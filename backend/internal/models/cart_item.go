// internal/models/cart_item.go
package models

import (
	"time"
)

type CartItem struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	CartID    uint      `gorm:"not null;index" json:"cart_id"`
	ProductID uint      `gorm:"not null;index" json:"product_id"`
	Quantity  int       `gorm:"not null;default:1" json:"quantity"`
	CreatedAt time.Time `json:"created_at"`
	
	// Relations
	Cart    Cart    `gorm:"foreignKey:CartID" json:"cart,omitempty"`
	Product Product `gorm:"foreignKey:ProductID" json:"product,omitempty"`
}

func (CartItem) TableName() string {
	return "cart_items"
}