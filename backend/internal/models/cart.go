// internal/models/cart.go
package models

import (
	"time"
)

type Cart struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"not null;index" json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	
	// Relations
	Items []CartItem `gorm:"foreignKey:CartID" json:"items,omitempty"`
	User  User       `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

func (Cart) TableName() string {
	return "carts"
}