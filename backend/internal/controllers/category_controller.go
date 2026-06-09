// internal/controllers/category_controller.go
package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CategoryController struct {
	db *gorm.DB
}

func NewCategoryController(db *gorm.DB) *CategoryController {
	return &CategoryController{db: db}
}

// CategoryResponse untuk response API
type CategoryResponse struct {
	ID           uint   `json:"id"`
	Name         string `json:"name"`
	Slug         string `json:"slug"`
	ProductCount int64  `json:"product_count"`
}

// ProductCategoryResponse untuk Flutter (dengan icon)
type ProductCategoryResponse struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
	Icon string `json:"icon"`
}

// GetCategories - GET /api/v1/public/categories
func (ctrl *CategoryController) GetCategories(c *gin.Context) {
	var categories []CategoryResponse

	// Query categories with product count
	err := ctrl.db.Table("product_categories").
		Select("product_categories.id, product_categories.name, product_categories.slug, COUNT(products.id) as product_count").
		Joins("LEFT JOIN products ON products.category_id = product_categories.id AND products.status = 'active'").
		Group("product_categories.id").
		Order("product_count DESC, product_categories.name ASC").
		Scan(&categories).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to fetch categories",
		})
		return
	}

	if categories == nil {
		categories = []CategoryResponse{}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    categories,
	})
}

// GetCategoryBySlug - GET /api/v1/public/categories/:slug
func (ctrl *CategoryController) GetCategoryBySlug(c *gin.Context) {
	slug := c.Param("slug")

	var category struct {
		ID   uint
		Name string
		Slug string
	}

	// Get category by slug
	if err := ctrl.db.Table("product_categories").Where("slug = ?", slug).First(&category).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "Category not found",
		})
		return
	}

	// Get product count
	var productCount int64
	ctrl.db.Table("products").Where("category_id = ? AND status = 'active'", category.ID).Count(&productCount)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"id":            category.ID,
			"name":          category.Name,
			"slug":          category.Slug,
			"product_count": productCount,
		},
	})
}

// ============================================
// ✅ TAMBAH: GetProductCategories untuk Flutter
// ============================================
// GetProductCategories - GET /api/v1/public/product-categories
// Khusus untuk Flutter dengan format yang diharapkan
func (ctrl *CategoryController) GetProductCategories(c *gin.Context) {
	// Data sementara sampai database terisi
	// TODO: Ambil dari database table 'product_categories'
	categories := []ProductCategoryResponse{
		{ID: 1, Name: "Padi", Slug: "padi", Icon: "🌾"},
		{ID: 2, Name: "Jagung", Slug: "jagung", Icon: "🌽"},
		{ID: 3, Name: "Cabai", Slug: "cabai", Icon: "🌶️"},
		{ID: 4, Name: "Tomat", Slug: "tomat", Icon: "🍅"},
		{ID: 5, Name: "Sayuran", Slug: "sayuran", Icon: "🥬"},
		{ID: 6, Name: "Buah", Slug: "buah", Icon: "🍎"},
		{ID: 7, Name: "Palawija", Slug: "palawija", Icon: "🌿"},
	}

	// Alternative: Ambil dari database jika table sudah ada
	// var dbCategories []models.ProductCategory
	// if err := ctrl.db.Find(&dbCategories).Error; err == nil && len(dbCategories) > 0 {
	// 	categories = []ProductCategoryResponse{}
	// 	for _, cat := range dbCategories {
	// 		categories = append(categories, ProductCategoryResponse{
	// 			ID:   int(cat.ID),
	// 			Name: cat.Name,
	// 			Slug: cat.Slug,
	// 			Icon: getIconForCategory(cat.Name),
	// 		})
	// 	}
	// }

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   categories,
	})
}

// Helper function untuk mapping icon berdasarkan nama kategori
func getIconForCategory(categoryName string) string {
	iconMap := map[string]string{
		"Padi":     "🌾",
		"Jagung":   "🌽",
		"Cabai":    "🌶️",
		"Tomat":    "🍅",
		"Sayuran":  "🥬",
		"Buah":     "🍎",
		"Palawija": "🌿",
	}
	
	if icon, exists := iconMap[categoryName]; exists {
		return icon
	}
	return "🌱"
}