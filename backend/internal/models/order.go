// internal/models/order.go
package models

import (
	"time"
)

type Order struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	UserID      uint      `gorm:"index;not null" json:"user_id"`
	TotalAmount float64   `gorm:"type:decimal(15,2);not null" json:"total_amount"`
	Status      string    `gorm:"type:varchar(50);default:'pending'" json:"status"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	
	// Relations
	User        User        `gorm:"foreignKey:UserID" json:"user,omitempty"`
	OrderItems  []OrderItem `gorm:"foreignKey:OrderID" json:"order_items,omitempty"`
}

func (Order) TableName() string {
	return "orders"
}