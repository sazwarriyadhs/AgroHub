// internal/controllers/wishlist_controller.go
package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"agrohub-backend/internal/models"
)

type WishlistController struct {
	db *gorm.DB
}

func NewWishlistController(db *gorm.DB) *WishlistController {
	return &WishlistController{db: db}
}

type WishlistSyncRequest struct {
	Items []struct {
		ProductID uint `json:"product_id"`
	} `json:"items"`
}

type WishlistAddRequest struct {
	ProductID uint `json:"product_id"`
}

// SyncWishlist - POST /api/v1/wishlist/sync
func (ctrl *WishlistController) SyncWishlist(c *gin.Context) {
	var req WishlistSyncRequest
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

	// Delete existing wishlist
	if err := ctrl.db.Where("user_id = ?", userID).Delete(&models.Wishlist{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to clear wishlist",
		})
		return
	}

	// Add new items
	for _, item := range req.Items {
		wishlist := models.Wishlist{
			UserID:    userID.(uint),
			ProductID: item.ProductID,
		}
		if err := ctrl.db.Create(&wishlist).Error; err != nil {
			// Ignore duplicate errors
			if err.Error() != "duplicate key value violates unique constraint" {
				c.JSON(http.StatusInternalServerError, gin.H{
					"success": false,
					"message": "Failed to sync wishlist",
				})
				return
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Wishlist synced successfully",
	})
}

// AddToWishlist - POST /api/v1/wishlist/add
func (ctrl *WishlistController) AddToWishlist(c *gin.Context) {
	var req WishlistAddRequest
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

	// Check if already in wishlist
	var existing models.Wishlist
	result := ctrl.db.Where("user_id = ? AND product_id = ?", userID, req.ProductID).First(&existing)
	if result.Error == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Product already in wishlist",
		})
		return
	}

	wishlist := models.Wishlist{
		UserID:    userID.(uint),
		ProductID: req.ProductID,
	}
	if err := ctrl.db.Create(&wishlist).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to add to wishlist",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Added to wishlist",
	})
}

// GetWishlist - GET /api/v1/wishlist
func (ctrl *WishlistController) GetWishlist(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User not authenticated",
		})
		return
	}

	var wishlistItems []models.Wishlist
	if err := ctrl.db.Where("user_id = ?", userID).Preload("Product").Find(&wishlistItems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to get wishlist",
		})
		return
	}

	// Transform response
	var response []gin.H
	for _, item := range wishlistItems {
		response = append(response, gin.H{
			"id":          item.ID,
			"product_id":  item.ProductID,
			"name":        item.Product.Name,
			"price":       item.Product.Price,
			"image":       item.Product.Image,
			"category":    item.Product.CategoryID,
			"rating":      item.Product.Rating,
			"added_at":    item.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    response,
	})
}

// RemoveFromWishlist - DELETE /api/v1/wishlist/:id
func (ctrl *WishlistController) RemoveFromWishlist(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid wishlist ID",
		})
		return
	}

	if err := ctrl.db.Delete(&models.Wishlist{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to remove from wishlist",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Removed from wishlist",
	})
}