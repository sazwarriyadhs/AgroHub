package models

import (
	"time"

	"gorm.io/gorm"
)

type FishPrice struct {
	ID uint `json:"id" gorm:"primaryKey"`

	// RELATION
	FishCategoryID uint         `json:"fish_category_id" gorm:"not null;index"`
	FishCategory   FishCategory `json:"fish_category" gorm:"foreignKey:FishCategoryID"`

	// PRICE
	Price float64 `json:"price" gorm:"type:numeric(12,2);default:0"`

	Unit string `json:"unit" gorm:"type:varchar(50);default:'kg'"`

	// MARKET INFO
	MarketName string `json:"market_name" gorm:"type:varchar(255)"`
	Location   string `json:"location" gorm:"type:varchar(255)"`
	Province   string `json:"province" gorm:"type:varchar(255)"`
	City       string `json:"city" gorm:"type:varchar(255)"`

	// IMAGE
	ImageURL string `json:"image_url" gorm:"type:text"`

	// SOURCE
	Source string `json:"source" gorm:"type:varchar(255)"`

	// DATE
	PriceDate time.Time `json:"price_date"`

	// TIMESTAMP
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

func (FishPrice) TableName() string {
	return "fish_prices"
}