package services

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"agrohub-backend/internal/config"
	"agrohub-backend/internal/models"
	"agrohub-backend/internal/repositories"

	"github.com/redis/go-redis/v9"
)

type AuthService struct {
	cfg      *config.Config
	userRepo *repositories.UserRepository
	redis    *redis.Client
}

func NewAuthService(
	cfg *config.Config,
	userRepo *repositories.UserRepository,
	redis *redis.Client,
) *AuthService {
	return &AuthService{
		cfg:      cfg,
		userRepo: userRepo,
		redis:    redis,
	}
}

// =====================
// DTO
// =====================

type RegisterRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Phone    string `json:"phone"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// =====================
// REGISTER
// =====================

func (s *AuthService) Register(req RegisterRequest) (*models.User, error) {

	existing, err := s.userRepo.FindByEmail(req.Email)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, errors.New("database error")
	}

	if existing != nil {
		return nil, errors.New("user already exists")
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	user := &models.User{
		Name:       req.Name,
		Email:      req.Email,
		Password:   string(hashed),
		Phone:      req.Phone,
		Role:       "farmer",
		RoleEnum:   "farmer",
		IsActive:   true,
		IsVerified: true,
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, errors.New("failed to create user")
	}

	return user, nil
}

// =====================
// LOGIN
// =====================

func (s *AuthService) Login(req LoginRequest) (string, *models.User, error) {

	user, err := s.userRepo.FindByEmail(req.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", nil, errors.New("invalid email or password")
		}
		return "", nil, errors.New("login failed")
	}

	if !user.IsActive {
		return "", nil, errors.New("account is deactivated")
	}

	if err := bcrypt.CompareHashAndPassword(
		[]byte(user.Password),
		[]byte(req.Password),
	); err != nil {
		return "", nil, errors.New("invalid email or password")
	}

	// =====================
	// JWT
	// =====================
	token, err := s.generateJWT(user)
	if err != nil {
		return "", nil, errors.New("failed to generate token")
	}

	// =====================
	// REDIS SESSION (FIXED)
	// =====================
	ctx := context.Background()

	err = s.redis.Set(
		ctx,
		fmt.Sprintf("session:%d", user.ID),
		"active",
		7*24*time.Hour,
	).Err()

	if err != nil {
		// optional: jangan gagalkan login, tapi log production
		fmt.Println("redis session error:", err)
	}

	return token, user, nil
}

// =====================
// JWT
// =====================

func (s *AuthService) generateJWT(user *models.User) (string, error) {

	claims := jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.Role,
		"exp":     time.Now().Add(15 * time.Minute).Unix(),
		"iat":     time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.cfg.JWTSecret))
}

// =====================
// TOKEN VALIDATION
// =====================

func (s *AuthService) ValidateToken(tokenString string) (jwt.MapClaims, error) {

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(s.cfg.JWTSecret), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token")
}

// =====================
// SESSION CHECK
// =====================

func (s *AuthService) IsSessionActive(userID int64) bool {

	ctx := context.Background()

	val, err := s.redis.Get(ctx, fmt.Sprintf("session:%d", userID)).Result()
	if err != nil {
		return false
	}

	return val == "active"
}

// =====================
// LOGOUT
// =====================

func (s *AuthService) Logout(userID int64) error {

	ctx := context.Background()

	return s.redis.Del(ctx, fmt.Sprintf("session:%d", userID)).Err()
}