package controllers

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"agrohub-backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type FishPriceController struct {
	DB *gorm.DB
}

func NewFishPriceController(db *gorm.DB) *FishPriceController {
	return &FishPriceController{
		DB: db,
	}
}

// ============================================================================
// GET ALL FISH PRICES
// ============================================================================

func (f *FishPriceController) GetFishPrices(c *gin.Context) {
	var fishPrices []models.FishPrice

	err := f.DB.
		Preload("FishCategory").
		Order("updated_at DESC").
		Find(&fishPrices).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil data harga ikan",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"total":   len(fishPrices),
		"data":    fishPrices,
	})
}

// ============================================================================
// GET FISH PRICE BY FISH ID
// ============================================================================

func (f *FishPriceController) GetFishPriceByFishID(c *gin.Context) {
	fishID := c.Param("fishId")

	var fishPrice models.FishPrice

	err := f.DB.
		Preload("FishCategory").
		Where("fish_category_id = ?", fishID).
		First(&fishPrice).Error

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "Harga ikan tidak ditemukan",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    fishPrice,
	})
}

// ============================================================================
// GET FISH PRICE BY NAME
// ============================================================================

func (f *FishPriceController) GetFishPriceByName(c *gin.Context) {
	name := strings.TrimSpace(c.Param("name"))

	var fishPrice models.FishPrice

	err := f.DB.
		Preload("FishCategory").
		Joins("JOIN fish_categories ON fish_categories.id = fish_prices.fish_category_id").
		Where("LOWER(fish_categories.name) LIKE LOWER(?)", "%"+name+"%").
		First(&fishPrice).Error

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "Harga ikan tidak ditemukan",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    fishPrice,
	})
}

// ============================================================================
// TOP GAINER
// ============================================================================

func (f *FishPriceController) GetTopGainer(c *gin.Context) {
	var fish models.FishPrice

	err := f.DB.
		Preload("FishCategory").
		Order("price DESC").
		First(&fish).Error

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "Data tidak ditemukan",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    fish,
	})
}

// ============================================================================
// TRENDING FISH PRICES
// ============================================================================

func (f *FishPriceController) GetTrendingFishPrices(c *gin.Context) {
	var fishPrices []models.FishPrice

	err := f.DB.
		Preload("FishCategory").
		Order("updated_at DESC").
		Limit(10).
		Find(&fishPrices).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil trending harga ikan",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"total":   len(fishPrices),
		"data":    fishPrices,
	})
}

// ============================================================================
// CREATE FISH PRICE
// ============================================================================

func (f *FishPriceController) CreateFishPrice(c *gin.Context) {
	var payload models.FishPrice

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Payload tidak valid",
			"error":   err.Error(),
		})
		return
	}

	payload.CreatedAt = time.Now()
	payload.UpdatedAt = time.Now()

	if payload.PriceDate.IsZero() {
		payload.PriceDate = time.Now()
	}

	err := f.DB.Create(&payload).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal membuat harga ikan",
			"error":   err.Error(),
		})
		return
	}

	err = f.DB.
		Preload("FishCategory").
		First(&payload, payload.ID).Error

	if err != nil {
		c.JSON(http.StatusCreated, gin.H{
			"success": true,
			"message": "Harga ikan berhasil dibuat",
			"data":    payload,
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Harga ikan berhasil dibuat",
		"data":    payload,
	})
}

// ============================================================================
// UPDATE FISH PRICE
// ============================================================================

func (f *FishPriceController) UpdateFishPrice(c *gin.Context) {
	id := c.Param("id")

	var fishPrice models.FishPrice

	err := f.DB.First(&fishPrice, id).Error

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "Data harga ikan tidak ditemukan",
		})
		return
	}

	var payload models.FishPrice

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Payload tidak valid",
			"error":   err.Error(),
		})
		return
	}

	payload.UpdatedAt = time.Now()

	err = f.DB.Model(&fishPrice).Updates(map[string]interface{}{
		"fish_category_id": payload.FishCategoryID,
		"price":            payload.Price,
		"unit":             payload.Unit,
		"market_name":      payload.MarketName,
		"location":         payload.Location,
		"province":         payload.Province,
		"city":             payload.City,
		"image_url":        payload.ImageURL,
		"source":           payload.Source,
		"price_date":       payload.PriceDate,
		"updated_at":       payload.UpdatedAt,
	}).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal update harga ikan",
			"error":   err.Error(),
		})
		return
	}

	err = f.DB.
		Preload("FishCategory").
		First(&fishPrice, id).Error

	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "Harga ikan berhasil diupdate",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Harga ikan berhasil diupdate",
		"data":    fishPrice,
	})
}

// ============================================================================
// DELETE FISH PRICE
// ============================================================================

func (f *FishPriceController) DeleteFishPrice(c *gin.Context) {
	id := c.Param("id")

	var fishPrice models.FishPrice

	err := f.DB.First(&fishPrice, id).Error

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "Data harga ikan tidak ditemukan",
		})
		return
	}

	err = f.DB.Delete(&fishPrice).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal menghapus harga ikan",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Harga ikan berhasil dihapus",
	})
}

// ============================================================================
// GET PRICE STATS
// ============================================================================

func (f *FishPriceController) GetPriceStats(c *gin.Context) {
	var total int64
	var avgPrice float64

	f.DB.Model(&models.FishPrice{}).Count(&total)
	f.DB.Model(&models.FishPrice{}).Select("AVG(price)").Scan(&avgPrice)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total_data": total,
			"average_price": avgPrice,
		},
	})
}

// ============================================================================
// GET BY PROVINCE
// ============================================================================

func (f *FishPriceController) GetByProvince(c *gin.Context) {
	province := strings.TrimSpace(c.Param("province"))

	var fishPrices []models.FishPrice

	err := f.DB.
		Preload("FishCategory").
		Where("LOWER(province) = LOWER(?)", province).
		Order("updated_at DESC").
		Find(&fishPrices).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil data provinsi",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"total":   len(fishPrices),
		"data":    fishPrices,
	})
}

// ============================================================================
// GET LATEST
// ============================================================================

func (f *FishPriceController) GetLatestPrices(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "10")

	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 10
	}

	var fishPrices []models.FishPrice

	err = f.DB.
		Preload("FishCategory").
		Order("created_at DESC").
		Limit(limit).
		Find(&fishPrices).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil latest prices",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"total":   len(fishPrices),
		"data":    fishPrices,
	})
}