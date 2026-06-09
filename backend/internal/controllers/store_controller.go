package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"agrohub-backend/internal/models"
	"agrohub-backend/internal/repositories"
)

type StoreController struct {
	storeRepo *repositories.StoreRepository
	db        *gorm.DB
}

func NewStoreController(storeRepo *repositories.StoreRepository, db *gorm.DB) *StoreController {
	return &StoreController{
		storeRepo: storeRepo,
		db:        db,
	}
}

// ================= GET ALL STORES =================
func (ctrl *StoreController) GetAllStores(c *gin.Context) {

	stores, err := ctrl.storeRepo.FindAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to fetch stores",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    stores,
	})
}

// ================= GET STORE BY ID =================
func (ctrl *StoreController) GetStoreByID(c *gin.Context) {

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid store ID",
		})
		return
	}

	store, err := ctrl.storeRepo.FindByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "Store not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    store,
	})
}

// ================= GET STORE PRODUCTS =================
func (ctrl *StoreController) GetStoreProducts(c *gin.Context) {

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid store ID",
		})
		return
	}

	var products []models.Product

	err = ctrl.db.
		Where("store_id = ?", id).
		Order("created_at DESC").
		Find(&products).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to fetch store products",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"total":   len(products),
		"data":    products,
	})
}