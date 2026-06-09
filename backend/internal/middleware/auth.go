package middleware

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"

	"agrohub-backend/internal/config"
	"agrohub-backend/internal/models"
)

// AuthMiddleware memvalidasi Bearer Token JWT dan mengecek sesi aktif di Redis
func AuthMiddleware(cfg *config.Config, db *gorm.DB, redisClient *redis.Client) gin.HandlerFunc {
	return func(c *gin.Context) {

		// =========================
		// 1. CHECK AUTH HEADER
		// =========================
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Authorization required",
			})
			c.Abort()
			return
		}

		if !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Bearer token required",
			})
			c.Abort()
			return
		}

		tokenString := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer "))

		// =========================
		// 2. PARSE JWT
		// =========================
		token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrTokenSignatureInvalid
			}
			return []byte(cfg.JWTSecret), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Invalid token",
			})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Invalid claims",
			})
			c.Abort()
			return
		}

		// =========================
		// 3. EXTRACT USER ID (SAFE)
		// =========================
		uidFloat, ok := claims["user_id"].(float64)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Invalid user_id in token",
			})
			c.Abort()
			return
		}

		userID := uint(uidFloat)

		// =========================
		// 4. CHECK USER IN DB
		// =========================
		var user models.User
		if err := db.First(&user, userID).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "User not found",
			})
			c.Abort()
			return
		}

		// =========================
		// 5. REDIS SESSION CHECK
		// =========================
		if redisClient != nil {
			sessionKey := fmt.Sprintf("session:%d", userID)

			val, err := redisClient.Get(c, sessionKey).Result()
			if err != nil || val != "active" {
				c.JSON(http.StatusUnauthorized, gin.H{
					"success": false,
					"message": "Session expired",
				})
				c.Abort()
				return
			}
		}

		// =========================
		// 6. SET CONTEXT
		// =========================
		c.Set("user", &user)
		c.Set("user_id", user.ID)
		c.Set("user_role", user.Role) // 🛠️ Disimpan menggunakan key "user_role"

		c.Next()
	}
}

// RoleMiddleware membatasi akses endpoint berdasarkan role yang diizinkan
func RoleMiddleware(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// 🛠️ FIXED: Sekarang membaca key "user_role" (Sinkron dengan AuthMiddleware di atas)
		userRole, exists := c.Get("user_role")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Akses ditolak: identitas role tidak ditemukan",
			})
			c.Abort()
			return
		}

		// Validasi apakah role user terdaftar di parameter yang diizinkan
		isAllowed := false
		for _, role := range allowedRoles {
			if userRole == role {
				isAllowed = true
				break
			}
		}

		if !isAllowed {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "Akses ditolak: Anda tidak memiliki hak akses untuk halaman ini",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}