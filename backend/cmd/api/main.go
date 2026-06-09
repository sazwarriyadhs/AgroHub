package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"agrohub-backend/internal/ai"
	"agrohub-backend/internal/config"
	"agrohub-backend/internal/models"
	"agrohub-backend/internal/routes"
	"agrohub-backend/pkg/database"
)

func main() {
	// =========================
	// CONFIG
	// =========================
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatal("❌ config error:", err)
	}

	log.Printf("📦 DB CONFIG => HOST: %s | PORT: %d | USER: %s | DB: %s\n",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBName)

	// Context global untuk aplikasi (Lifecycle management)
	appCtx, appCancel := context.WithCancel(context.Background())
	defer appCancel()

	// =========================
	// DB CONNECT
	// =========================
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatal("❌ db connection error:", err)
	}

	// Memastikan SQL DB ditutup saat aplikasi exit secara aman
	sqlDB, _ := db.DB()
	defer func() {
		if sqlDB != nil {
			log.Println("🔌 Closing Database connection...")
			_ = sqlDB.Close()
		}
	}()

	// =========================
	// AUTO MIGRATION
	// =========================
	log.Println("🔄 Auto Migration...")
	if err := db.AutoMigrate(
		&models.User{}, &models.Store{}, &models.Product{},
		&models.FarmProduct{}, &models.Wallet{}, &models.Cart{},
		&models.CartItem{}, &models.Order{}, &models.OrderItem{},
		&models.Notification{}, &models.Wishlist{}, &models.FishPrice{},
		&models.FishCategory{}, &models.ProductCategory{},
	); err != nil {
		log.Fatal("❌ migration error:", err)
	}
	log.Println("✅ Migration OK")

	// =========================
	// SEED USER (SAFE & STRICT)
	// =========================
	// 1. Seed Default Farmer
	var farmerUser models.User
	err = db.Where("email = ?", "petani.baru@agrohub.com").First(&farmerUser).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		log.Println("🌱 Seeding default farmer user...")

		hash, err := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)
		if err != nil {
			log.Fatal("❌ bcrypt error:", err)
		}

		err = db.Create(&models.User{
			Name:     "Petani Baru",
			Email:    "petani.baru@agrohub.com",
			Password: string(hash),
			Role:     "farmer",
			IsActive: true,
		}).Error

		if err != nil {
			log.Fatal("❌ seed farmer error:", err)
		}
		log.Println("✅ Default farmer user created")
	} else if err != nil {
		log.Println("⚠️ Failed to check default farmer status:", err)
	}

	// 2. Seed Default Driver (Untuk agrohub_express_mobile)
	var driverUser models.User
	err = db.Where("email = ?", "driver.express@agrohub.com").First(&driverUser).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		log.Println("🚚 Seeding default driver user...")

		// FIXED: Menggunakan password "driver123" sesuai request
		hash, err := bcrypt.GenerateFromPassword([]byte("driver123"), bcrypt.DefaultCost)
		if err != nil {
			log.Fatal("❌ bcrypt error:", err)
		}

		err = db.Create(&models.User{
			Name:     "Budi Santoso (Driver)",
			Email:    "driver.express@agrohub.com",
			Password: string(hash),
			Role:     "driver",
			IsActive: true,
		}).Error

		if err != nil {
			log.Fatal("❌ seed driver error:", err)
		}
		log.Println("✅ Default driver user created dengan password baru")
	} else if err != nil {
		log.Println("⚠️ Failed to check default driver status:", err)
	}

	// =========================
	// REDIS
	// =========================
	redisClient := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", cfg.RedisHost, cfg.RedisPort),
		Password: cfg.RedisPass,
		DB:       0,
	})
	defer func() {
		log.Println("🔌 Closing Redis connection...")
		_ = redisClient.Close()
	}()

	redisCtx, redisCancel := context.WithTimeout(appCtx, 3*time.Second)
	defer redisCancel()

	if err := redisClient.Ping(redisCtx).Err(); err != nil {
		log.Println("⚠️ Redis not connected:", err)
	} else {
		log.Println("✅ Redis connected")
	}

	// =========================
	// AI ORCHESTRATOR
	// =========================
	aiOrchestrator := ai.NewOrchestrator(db, cfg)

	// =========================
	// GIN SETUP
	// =========================
	gin.SetMode(gin.ReleaseMode)
	router := gin.New()

	// FORMAT LOGGER YANG SUDAH DIPERBAIKI (VALID)
	router.Use(gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return fmt.Sprintf("[API] %s - [%s] \"%s %s %s %d %s %s\"\n",
			param.ClientIP,
			param.TimeStamp.Format(time.RFC3339),
			param.Method,
			param.Path,
			param.Request.Proto,
			param.StatusCode,
			param.Latency,
			param.ErrorMessage,
		)
	}))
	router.Use(gin.Recovery())

	_ = router.SetTrustedProxies(nil)

	// CORS Setup
	router.Use(cors.New(cors.Config{
		AllowOriginFunc:  func(origin string) bool { return true },
		// 🛠️ FIXED: Dialokasikan sebagai slice tunggal []string standar Go yang valid
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// OPTIONS global handler
	router.OPTIONS("/*path", func(c *gin.Context) {
		c.Status(http.StatusNoContent)
	})

	// =========================
	// ROUTES
	// =========================
	routes.SetupRoutes(router, db, cfg, redisClient, aiOrchestrator)

	fmt.Println("\n========== REGISTERED ROUTES ==========")
	for _, r := range router.Routes() {
		fmt.Printf("[%s] %s\n", r.Method, r.Path)
	}
	fmt.Println("=======================================\n")

	// ==================================================
	// SERVER SETUP WITH GRACEFUL SHUTDOWN
	// ==================================================
	srv := &http.Server{
		Addr:         "0.0.0.0:8900",
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
	}

	// Channel untuk menangkap OS signal (Ctrl+C / Kill command)
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)

	go func() {
		log.Println("🚀 AgroHub Running on http://0.0.0.0:8900")
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("❌ Listen error: %s\n", err)
		}
	}()

	// Menunggu signal interupsi datang
	<-quit
	log.Println("⏳ Shutting down AgroHub server gracefully...")
	appCancel() // Batalkan context global aplikasi

	// Memberikan toleransi waktu 5 detik agar request yang berjalan bisa selesai dulu
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer shutdownCancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Fatal("❌ Server forced to shutdown:", err)
	}

	log.Println("👋 Server exited cleanly")
}