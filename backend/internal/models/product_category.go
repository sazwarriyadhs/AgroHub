// internal/models/product_category.go
package models

type ProductCategory struct {
	ID   uint   `gorm:"primaryKey" json:"id"`
	Name string `gorm:"not null" json:"name"`
	Slug string `gorm:"uniqueIndex;not null" json:"slug"`
}

func (ProductCategory) TableName() string {
	return "product_categories"
}