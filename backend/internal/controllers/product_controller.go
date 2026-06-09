package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"agrohub-backend/internal/models"
)

type ProductController struct {
	db *gorm.DB
}

func NewProductController(db *gorm.DB) *ProductController {
	return &ProductController{db: db}
}

// ===============================
// GET /products (Menyesuaikan Database Riil)
// ===============================
func (ctrl *ProductController) GetProducts(c *gin.Context) {
	var products []models.Product

	// Gunakan query builder dasar yang menunjuk ke tabel products
	query := ctrl.db.Table("products").Where("products.status = ?", "active")

	// 1. DYNAMIC FILTER BY CATEGORY SLUG (Join ke tabel product_categories)
	categorySlug := c.Query("category")
	if categorySlug != "" {
		// Kita join tabel product_categories untuk mencari slug yang cocok dari frontend
		query = query.Joins("JOIN product_categories ON product_categories.id = products.category_id").
			Where("product_categories.slug = ?", categorySlug)
	}

	// 2. DYNAMIC FILTER FLASH SALE
	flashSaleParam := c.Query("flash_sale")
	if flashSaleParam == "true" {
		query = query.Where("products.discount > ?", 0)
	}

	// 3. DYNAMIC SORTING
	sortParam := c.Query("sort")
	if sortParam == "popular" {
		query = query.Order("products.sold DESC")
	} else {
		query = query.Order("products.created_at DESC")
	}

	// 4. LIMIT PAGINATION
	limitStr := c.DefaultQuery("limit", "50")
	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 50
	}
	query = query.Limit(limit)

	// Ambil field-field products (menghindari konflik nama kolom setelah JOIN)
	if err := query.Select("products.*").Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to fetch products: " + err.Error(),
			"data":    []models.Product{},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"total":   len(products),
		"data":    products,
	})
}

// ===============================
// GET /products/:id
// ===============================
func (ctrl *ProductController) GetProductByID(c *gin.Context) {
	idParam := c.Param("id")

	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid product ID",
			"data":    nil,
		})
		return
	}

	var product models.Product

	// Query mengambil satu data produk spesifik berdasarkan primary key 'id'
	err = ctrl.db.Table("products").Where("id = ? AND status = ?", id, "active").First(&product).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"message": "Product not found",
				"data":    nil,
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Database error: " + err.Error(),
			"data":    nil,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    product,
	})
}