package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	AppEnv  string
	Port    int
	AppName string

	DBHost     string
	DBPort     int
	DBUser     string
	DBPassword string
	DBName     string
	SSLMode    string

	JWTSecret     string
	JWTExpiryHour int

	RedisHost string
	RedisPort int
	RedisPass string
}

func LoadConfig() (*Config, error) {

	_ = godotenv.Load()

	port, _ := strconv.Atoi(getEnv("APP_PORT", "8900"))
	dbPort, _ := strconv.Atoi(getEnv("DB_PORT", "5432"))
	redisPort, _ := strconv.Atoi(getEnv("REDIS_PORT", "6379"))
	jwtExpiry, _ := strconv.Atoi(getEnv("JWT_EXPIRATION_HOURS", "24"))

	cfg := &Config{
		AppEnv:  getEnv("APP_ENV", "development"),
		Port:    port,
		AppName: getEnv("APP_NAME", "AgroHub"),

		DBHost:     getEnv("DB_HOST", "127.0.0.1"),
		DBPort:     dbPort,
		DBUser:     getEnv("DB_USER", "postgres"),
		DBPassword: getEnv("DB_PASSWORD", ""),
		DBName:     getEnv("DB_NAME", "agrohub"),
		SSLMode:    getEnv("DB_SSL_MODE", "disable"),

		JWTSecret:     getEnv("JWT_SECRET", "secret"),
		JWTExpiryHour: jwtExpiry,

		RedisHost: getEnv("REDIS_HOST", "localhost"),
		RedisPort: redisPort,
		RedisPass: getEnv("REDIS_PASSWORD", ""),
	}

	if cfg.DBPassword == "" {
		log.Fatal("❌ DB_PASSWORD is empty")
	}

	return cfg, nil
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}