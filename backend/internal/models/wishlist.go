// internal/models/wishlist.go
package models

import (
	"time"
)

type Wishlist struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"not null;index" json:"user_id"`
	ProductID uint      `gorm:"not null;index" json:"product_id"`
	CreatedAt time.Time `json:"created_at"`
	
	// Relations
	Product Product `gorm:"foreignKey:ProductID" json:"product,omitempty"`
}

func (Wishlist) TableName() string {
	return "wishlists"
}