package models

import "time"

type Store struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name" gorm:"size:150;not null"`
	Description string    `json:"description" gorm:"type:text"`
	OwnerID     uint      `json:"owner_id" gorm:"index"`
	Logo        string    `json:"logo" gorm:"size:255"`
	Address     string    `json:"address" gorm:"size:255"`
	Phone       string    `json:"phone" gorm:"size:30"`
	IsActive    bool      `json:"is_active" gorm:"default:true"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}