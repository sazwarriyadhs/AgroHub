package models

import "time"

type Wallet struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `json:"user_id"`
	Balance    float64  `json:"balance"`
	Currency   string   `json:"currency"`
	CreatedAt  time.Time
	UpdatedAt  time.Time
}