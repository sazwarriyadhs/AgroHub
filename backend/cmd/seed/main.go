package main

import (
	"errors"
	"log"

	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"agrohub-backend/internal/config"
	"agrohub-backend/internal/models"
	"agrohub-backend/pkg/database"
)

func main() {

	// 🔥 WAJIB: load .env secara eksplisit (biar gak gagal di Windows)
	err := godotenv.Load()
	if err != nil {
		log.Println("⚠️ .env not found, using system env")
	}

	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatal("config error:", err)
	}

	// 🔍 DEBUG (hapus nanti kalau sudah stabil)
	log.Println("DB HOST:", cfg.DBHost)
	log.Println("DB PORT:", cfg.DBPort)
	log.Println("DB USER:", cfg.DBUser)
	log.Println("DB PASSWORD:", cfg.DBPassword)

	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatal("db connection error:", err)
	}

	// 🔥 AUTO MIGRATION (wajib sebelum seed)
	err = db.AutoMigrate(&models.User{})
	if err != nil {
		log.Fatal("auto migrate error:", err)
	}

	seedUser(db)
}

func seedUser(db *gorm.DB) {

	email := "petani.baru@agrohub.com"

	var user models.User

	err := db.Where("email = ?", email).First(&user).Error

	// ✅ sudah ada
	if err == nil {
		log.Println("User already exists")
		return
	}

	// ❌ selain not found
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		log.Fatal("query error:", err)
	}

	// 🔐 hash password
	hash, err := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal("bcrypt error:", err)
	}

	// 👤 create user
	user = models.User{
		Name:     "Petani Baru",
		Email:    email,
		Password: string(hash),
		Role:     "farmer",
		IsActive: true,
	}

	if err := db.Create(&user).Error; err != nil {
		log.Fatal("create user error:", err)
	}

	log.Println("Seed user created successfully")
}