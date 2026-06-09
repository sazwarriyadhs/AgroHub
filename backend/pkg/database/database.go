package database

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"agrohub-backend/internal/config"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Connect(cfg *config.Config) (*gorm.DB, error) {

	// =========================
	// VALIDATION (STRICT)
	// =========================
	if cfg.DBHost == "" {
		return nil, fmt.Errorf("DB_HOST is empty")
	}

	if cfg.DBPort == 0 {
		return nil, fmt.Errorf("DB_PORT is empty or invalid")
	}

	if cfg.DBUser == "" {
		return nil, fmt.Errorf("DB_USER is empty")
	}

	if cfg.DBPassword == "" {
		return nil, fmt.Errorf("DB_PASSWORD is empty (check .env loading)")
	}

	if cfg.DBName == "" {
		return nil, fmt.Errorf("DB_NAME is empty")
	}

	// =========================
	// DEBUG (IMPORTANT)
	// =========================
	log.Println("🔌 DB CONFIG:")
	log.Println("HOST:", cfg.DBHost)
	log.Println("PORT:", cfg.DBPort)
	log.Println("USER:", cfg.DBUser)
	log.Println("PASS:", maskPassword(cfg.DBPassword))
	log.Println("DB  :", cfg.DBName)

	// =========================
	// DSN
	// =========================
	dsn := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		cfg.DBHost,
		cfg.DBPort,
		cfg.DBUser,
		cfg.DBPassword,
		cfg.DBName,
		cfg.SSLMode,
	)

	// =========================
	// CONNECT DB
	// =========================
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		return nil, fmt.Errorf("gorm connect error: %w", err)
	}

	// =========================
	// RAW SQL CONNECTION
	// =========================
	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("db instance error: %w", err)
	}

	// =========================
	// CONNECTION POOL
	// =========================
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	// =========================
	// PING CHECK (REAL VALIDATION)
	// =========================
	if err := pingDB(sqlDB); err != nil {
		return nil, err
	}

	log.Println("✅ Database connected successfully")

	return db, nil
}

// =========================
// SAFE PING
// =========================
func pingDB(db *sql.DB) error {
	if err := db.Ping(); err != nil {
		return fmt.Errorf("database ping failed: %w", err)
	}
	return nil
}

// =========================
// MASK PASSWORD (DEBUG SAFE)
// =========================
func maskPassword(pw string) string {
	if len(pw) <= 2 {
		return "***"
	}
	return pw[:2] + "****"
}