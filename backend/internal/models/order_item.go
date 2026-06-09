// internal/models/order_item.go
package models

type OrderItem struct {
	ID        uint    `gorm:"primaryKey" json:"id"`
	OrderID   uint    `gorm:"index;not null" json:"order_id"`
	ProductID uint    `gorm:"index;not null" json:"product_id"`
	Quantity  int     `json:"quantity"`
	Price     float64 `gorm:"type:decimal(15,2)" json:"price"`
	
	// Relations
	Order   Order   `gorm:"foreignKey:OrderID" json:"order,omitempty"`
	Product Product `gorm:"foreignKey:ProductID" json:"product,omitempty"`
}

func (OrderItem) TableName() string {
	return "order_items"
}