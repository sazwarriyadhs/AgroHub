package controllers

import (
	"net/http"
	"strconv"

	"agrohub-backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type FishCategoryController struct {
	DB *gorm.DB
}

func NewFishCategoryController(db *gorm.DB) *FishCategoryController {
	return &FishCategoryController{
		DB: db,
	}
}

// ============================================================================
// GET ALL FISH CATEGORIES
// ============================================================================

func (f *FishCategoryController) GetFishCategories(c *gin.Context) {
	var categories []models.FishCategory

	err := f.DB.
		Order("name ASC").
		Find(&categories).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil kategori ikan",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    categories,
	})
}

// ============================================================================
// GET CATEGORY BY ID
// ============================================================================

func (f *FishCategoryController) GetFishCategoryByID(c *gin.Context) {
	idParam := c.Param("id")

	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "ID kategori tidak valid",
		})
		return
	}

	var category models.FishCategory

	err = f.DB.
		First(&category, id).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"message": "Kategori ikan tidak ditemukan",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil kategori ikan",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    category,
	})
}

// ============================================================================
// GET CATEGORY BY WATER TYPE
// ============================================================================

func (f *FishCategoryController) GetFishByWaterType(c *gin.Context) {
	waterType := c.Param("type")

	var categories []models.FishCategory

	err := f.DB.
		Where("LOWER(description) LIKE LOWER(?)", "%"+waterType+"%").
		Order("name ASC").
		Find(&categories).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil kategori berdasarkan tipe air",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    categories,
	})
}