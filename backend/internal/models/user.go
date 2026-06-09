package models

import (
	"time"
)

type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"type:varchar(255)" json:"name"`
	Email     string    `gorm:"uniqueIndex;not null" json:"email"`
	Password  string    `gorm:"not null" json:"-"`

	Phone string `gorm:"type:varchar(20)" json:"phone"`
	Role  string `gorm:"type:varchar(50);default:'user'" json:"role"`

	RoleEnum   string `gorm:"type:varchar(50)" json:"role_enum"`
	IsActive   bool   `gorm:"default:true" json:"is_active"`
	IsVerified bool   `gorm:"default:false" json:"is_verified"`

	Avatar  string `gorm:"type:text" json:"avatar"`
	Address string `gorm:"type:text" json:"address"`
	City    string `gorm:"type:varchar(100)" json:"city"`
	Province string `gorm:"type:varchar(100)" json:"province"`

	// ================================
	// FARM DATA (SAFE + COMPATIBLE)
	// ================================
	FarmName string  `gorm:"type:varchar(255)" json:"farm_name"`
	FarmType string  `gorm:"type:varchar(100)" json:"farm_type"`
	LandArea float64 `gorm:"type:double precision" json:"land_area"`

	// ================================
	// STATUS (Dashboard support)
	// ================================
	FarmVerified       bool   `gorm:"default:false" json:"farm_verified"`
	VerificationStatus string `gorm:"type:varchar(50)" json:"verification_status"`

	// ================================
	// TIMESTAMPS
	// ================================
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `gorm:"index" json:"deleted_at,omitempty"`
}

func (User) TableName() string {
	return "users"
}