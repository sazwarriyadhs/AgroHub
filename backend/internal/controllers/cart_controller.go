// internal/controllers/cart_controller.go
package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"agrohub-backend/internal/models"
)

type CartController struct {
	db *gorm.DB
}

func NewCartController(db *gorm.DB) *CartController {
	return &CartController{db: db}
}

type CartSyncRequest struct {
	Items []struct {
		ProductID uint `json:"product_id"`
		Quantity  int  `json:"quantity"`
		Price     int64 `json:"price"`
	} `json:"items"`
}

type CartAddRequest struct {
	ProductID uint `json:"product_id"`
	Quantity  int  `json:"quantity"`
}

// SyncCart - POST /api/v1/cart/sync
func (ctrl *CartController) SyncCart(c *gin.Context) {
	var req CartSyncRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User not authenticated",
		})
		return
	}

	// Find or create cart for user
	var cart models.Cart
	result := ctrl.db.Where("user_id = ?", userID).First(&cart)
	if result.Error != nil {
		// Create new cart
		cart = models.Cart{
			UserID: userID.(uint),
		}
		if err := ctrl.db.Create(&cart).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Failed to create cart",
			})
			return
		}
	}

	// Delete existing cart items
	if err := ctrl.db.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to clear cart",
		})
		return
	}

	// Add new items
	for _, item := range req.Items {
		cartItem := models.CartItem{
			CartID:    cart.ID,
			ProductID: item.ProductID,
			Quantity:  item.Quantity,
		}
		if err := ctrl.db.Create(&cartItem).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Failed to sync cart",
			})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Cart synced successfully",
	})
}

// AddToCart - POST /api/v1/cart/add
func (ctrl *CartController) AddToCart(c *gin.Context) {
	var req CartAddRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User not authenticated",
		})
		return
	}

	// Check if product exists
	var product models.Product
	if err := ctrl.db.First(&product, req.ProductID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "Product not found",
		})
		return
	}

	// Find or create cart for user
	var cart models.Cart
	result := ctrl.db.Where("user_id = ?", userID).First(&cart)
	if result.Error != nil {
		cart = models.Cart{
			UserID: userID.(uint),
		}
		if err := ctrl.db.Create(&cart).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Failed to create cart",
			})
			return
		}
	}

	// Check if item already in cart
	var existingItem models.CartItem
	itemResult := ctrl.db.Where("cart_id = ? AND product_id = ?", cart.ID, req.ProductID).First(&existingItem)

	if itemResult.Error == nil {
		// Update existing
		existingItem.Quantity += req.Quantity
		if err := ctrl.db.Save(&existingItem).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Failed to update cart",
			})
			return
		}
	} else {
		// Create new
		cartItem := models.CartItem{
			CartID:    cart.ID,
			ProductID: req.ProductID,
			Quantity:  req.Quantity,
		}
		if err := ctrl.db.Create(&cartItem).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Failed to add to cart",
			})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Added to cart",
	})
}

// GetCart - GET /api/v1/cart
func (ctrl *CartController) GetCart(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User not authenticated",
		})
		return
	}

	var cart models.Cart
	if err := ctrl.db.Where("user_id = ?", userID).Preload("Items.Product").First(&cart).Error; err != nil {
		// Return empty cart if not found
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data":    nil,
			"message": "Cart is empty",
		})
		return
	}

	// Calculate totals
	var totalItems int
	var subtotal float64 // FIXED: ubah ke float64 karena Product.Price bertipe float64
	for _, item := range cart.Items {
		totalItems += item.Quantity
		subtotal += float64(item.Quantity) * item.Product.Price
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"id":          cart.ID,
			"user_id":     cart.UserID,
			"items":       cart.Items,
			"total_items": totalItems,
			"subtotal":    subtotal,
			"created_at":  cart.CreatedAt,
			"updated_at":  cart.UpdatedAt,
		},
	})
}

// UpdateCartQuantity - PUT /api/v1/cart/items/:id
func (ctrl *CartController) UpdateCartQuantity(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid cart item ID",
		})
		return
	}

	var req struct {
		Quantity int `json:"quantity"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	if req.Quantity < 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Quantity cannot be negative",
		})
		return
	}

	var cartItem models.CartItem
	if err := ctrl.db.First(&cartItem, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "Cart item not found",
		})
		return
	}

	if req.Quantity == 0 {
		// Delete item if quantity is 0
		if err := ctrl.db.Delete(&cartItem).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Failed to remove item",
			})
			return
		}
	} else {
		// Update quantity
		cartItem.Quantity = req.Quantity
		if err := ctrl.db.Save(&cartItem).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Failed to update cart",
			})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Cart updated",
	})
}

// RemoveFromCart - DELETE /api/v1/cart/items/:id
func (ctrl *CartController) RemoveFromCart(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid cart item ID",
		})
		return
	}

	if err := ctrl.db.Delete(&models.CartItem{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to remove from cart",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Removed from cart",
	})
}

// ClearCart - DELETE /api/v1/cart/clear
func (ctrl *CartController) ClearCart(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User not authenticated",
		})
		return
	}

	var cart models.Cart
	if err := ctrl.db.Where("user_id = ?", userID).First(&cart).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "Cart already empty",
		})
		return
	}

	if err := ctrl.db.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to clear cart",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Cart cleared",
	})
}