package controllers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type OrderController struct {
	DB *gorm.DB
}

func NewOrderController(db *gorm.DB) *OrderController {
	return &OrderController{DB: db}
}

// GetOrders mengambil list order berdasarkan user_id yang sedang login
func (ctrl *OrderController) GetOrders(c *gin.Context) {
	// Mengambil user_id dari JWT / Auth middleware lu
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Unauthorized, login required",
		})
		return
	}

	var orders []map[string]interface{}

	// Query mengambil data dari table orders
	if err := ctrl.DB.Table("orders").Where("user_id = ?", userID).Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to fetch orders: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    orders,
	})
}