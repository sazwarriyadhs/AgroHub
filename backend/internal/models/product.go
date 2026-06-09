// internal/models/product.go
package models

import (
	"time"
)

type Product struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"not null" json:"name"`
	Slug        string    `gorm:"uniqueIndex" json:"slug"`
	Description string    `json:"description"`
	Price       float64   `gorm:"not null" json:"price"`  // Harus float64
	OldPrice    float64   `json:"old_price"`
	Stock       int       `gorm:"default:0" json:"stock"`
	Sold        int       `gorm:"default:0" json:"sold"`
	Rating      float64   `gorm:"default:0" json:"rating"`
	Image       string    `json:"image"`
	CategoryID  uint      `json:"category_id"`
	StoreID     uint      `json:"store_id"`
	Status      string    `gorm:"default:'active'" json:"status"`
	Discount    int       `gorm:"default:0" json:"discount"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`

	// Relations
	Category interface{} `gorm:"-" json:"category,omitempty"`
	Store    interface{} `gorm:"-" json:"store,omitempty"`
}

func (Product) TableName() string {
	return "products"
}