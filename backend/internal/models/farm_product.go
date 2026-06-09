package models

import "time"

type FarmProduct struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `json:"user_id"`
	Name      string    `json:"name"`
	Type      string    `json:"type"` // crop / livestock / fish
	Quantity  float64   `json:"quantity"`
	Unit      string    `json:"unit"`
	Status    string    `json:"status"` // growing / ready / sold
	Price     float64   `json:"price"`
	CreatedAt time.Time
	UpdatedAt time.Time
}