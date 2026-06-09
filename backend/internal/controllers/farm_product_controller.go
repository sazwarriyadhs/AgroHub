// internal/controllers/farm_product_controller.go
package controllers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type FarmProductController struct {
	db *gorm.DB
}

func NewFarmProductController(db *gorm.DB) *FarmProductController {
	return &FarmProductController{db: db}
}

// CommodityTypeResponse untuk response komoditas
type CommodityTypeResponse struct {
	ID         int     `json:"id"`
	Name       string  `json:"name"`
	CategoryID int     `json:"category_id"`
	BasePrice  float64 `json:"base_price"`
	Unit       string  `json:"unit"`
}

// GetFarmProducts - GET /api/v1/public/farm-products
func (ctrl *FarmProductController) GetFarmProducts(c *gin.Context) {
	products := []CommodityTypeResponse{
		{ID: 1, Name: "Beras IR64", CategoryID: 1, BasePrice: 12000, Unit: "kg"},
		{ID: 2, Name: "Beras Pandan Wangi", CategoryID: 1, BasePrice: 14000, Unit: "kg"},
		{ID: 3, Name: "Beras Organik", CategoryID: 1, BasePrice: 16000, Unit: "kg"},
		{ID: 4, Name: "Jagung Manis", CategoryID: 2, BasePrice: 8000, Unit: "kg"},
		{ID: 5, Name: "Jagung Pipil", CategoryID: 2, BasePrice: 6000, Unit: "kg"},
		{ID: 6, Name: "Cabai Merah Besar", CategoryID: 3, BasePrice: 35000, Unit: "kg"},
		{ID: 7, Name: "Cabai Rawit", CategoryID: 3, BasePrice: 40000, Unit: "kg"},
		{ID: 8, Name: "Tomat Biasa", CategoryID: 4, BasePrice: 10000, Unit: "kg"},
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   products,
	})
}

// GetCommoditiesByCategory - GET /api/v1/public/commodity-categories/:categoryId/commodities
func (ctrl *FarmProductController) GetCommoditiesByCategory(c *gin.Context) {
	categoryId := c.Param("categoryId")

	commoditiesMap := map[string][]CommodityTypeResponse{
		"1": {
			{ID: 1, Name: "Beras IR64", CategoryID: 1, BasePrice: 12000, Unit: "kg"},
			{ID: 2, Name: "Beras Pandan Wangi", CategoryID: 1, BasePrice: 14000, Unit: "kg"},
			{ID: 3, Name: "Beras Organik", CategoryID: 1, BasePrice: 16000, Unit: "kg"},
		},
		"2": {
			{ID: 4, Name: "Jagung Manis", CategoryID: 2, BasePrice: 8000, Unit: "kg"},
			{ID: 5, Name: "Jagung Pipil", CategoryID: 2, BasePrice: 6000, Unit: "kg"},
		},
		"3": {
			{ID: 6, Name: "Cabai Merah Besar", CategoryID: 3, BasePrice: 35000, Unit: "kg"},
			{ID: 7, Name: "Cabai Rawit", CategoryID: 3, BasePrice: 40000, Unit: "kg"},
		},
		"4": {
			{ID: 8, Name: "Tomat Biasa", CategoryID: 4, BasePrice: 10000, Unit: "kg"},
		},
	}

	data, exists := commoditiesMap[categoryId]
	if !exists {
		data = []CommodityTypeResponse{}
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   data,
	})
}

// PriceSuggestionResponse untuk response harga
type PriceSuggestionResponse struct {
	MarketPrice    float64 `json:"market_price"`
	SuggestedPrice float64 `json:"suggested_price"`
	MinPrice       float64 `json:"min_price"`
	MaxPrice       float64 `json:"max_price"`
}

// GetPriceSuggestion - GET /api/v1/public/commodities/:commodityId/price-suggestion
func (ctrl *FarmProductController) GetPriceSuggestion(c *gin.Context) {
	commodityId := c.Param("commodityId")
	id, _ := strconv.Atoi(commodityId)

	var suggestion PriceSuggestionResponse

	switch id {
	case 1, 2, 3: // Beras
		suggestion = PriceSuggestionResponse{
			MarketPrice:    12000,
			SuggestedPrice: 12200,
			MinPrice:       11500,
			MaxPrice:       13500,
		}
	case 4, 5: // Jagung
		suggestion = PriceSuggestionResponse{
			MarketPrice:    8000,
			SuggestedPrice: 8200,
			MinPrice:       7500,
			MaxPrice:       9000,
		}
	case 6, 7: // Cabai
		suggestion = PriceSuggestionResponse{
			MarketPrice:    35000,
			SuggestedPrice: 36000,
			MinPrice:       32000,
			MaxPrice:       40000,
		}
	case 8: // Tomat
		suggestion = PriceSuggestionResponse{
			MarketPrice:    10000,
			SuggestedPrice: 10500,
			MinPrice:       9000,
			MaxPrice:       12000,
		}
	default:
		suggestion = PriceSuggestionResponse{
			MarketPrice:    10000,
			SuggestedPrice: 10000,
			MinPrice:       9000,
			MaxPrice:       11500,
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   suggestion,
	})
}

// MyCropResponse untuk response tanaman petani
type MyCropResponse struct {
	ID     int     `json:"id"`
	Name   string  `json:"name"`
	Days   int     `json:"days"`
	Phase  string  `json:"phase"`
	Area   float64 `json:"area"`
	Status string  `json:"status"`
}

// GetMyCrops - GET /api/v1/farm/products (Auth required)
func (ctrl *FarmProductController) GetMyCrops(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  "error",
			"message": "User not found",
		})
		return
	}

	// TODO: Ambil dari database berdasarkan user_id
	_ = userID

	crops := []MyCropResponse{
		{ID: 1, Name: "Padi", Days: 60, Phase: "Pembungaan", Area: 2.5, Status: "active"},
		{ID: 2, Name: "Jagung", Days: 45, Phase: "Pertumbuhan", Area: 1.0, Status: "active"},
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   crops,
	})
}

// FarmTaskResponse untuk response tugas
type FarmTaskResponse struct {
	Title    string `json:"title"`
	Priority string `json:"priority"`
	DueDate  string `json:"due_date"`
}

// GetFarmTasks - GET /api/v1/farm/tasks (Auth required)
func (ctrl *FarmProductController) GetFarmTasks(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  "error",
			"message": "User not found",
		})
		return
	}

	_ = userID

	tasks := []FarmTaskResponse{
		{Title: "Penyiraman", Priority: "High", DueDate: time.Now().Format(time.RFC3339)},
		{Title: "Pemupukan", Priority: "Medium", DueDate: time.Now().AddDate(0, 0, 2).Format(time.RFC3339)},
		{Title: "Panen Padi", Priority: "Critical", DueDate: time.Now().AddDate(0, 0, 5).Format(time.RFC3339)},
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   tasks,
	})
}

// SellProductRequest untuk request jual produk
type SellProductRequest struct {
	FarmerID            int     `json:"farmer_id"`
	CategoryID          int     `json:"category_id"`
	CommodityTypeID     int     `json:"commodity_type_id"`
	QuantityKg          float64 `json:"quantity_kg"`
	PricePerKg          float64 `json:"price_per_kg"`
	MarketReferencePrice float64 `json:"market_reference_price"`
	ImageURL            string  `json:"image_url"`
	Location            string  `json:"location"`
	Grade               string  `json:"grade"`
	Description         string  `json:"description"`
}

// SellProduct - POST /api/v1/farm/products/sell (Auth required)
func (ctrl *FarmProductController) SellProduct(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  "error",
			"message": "User not found",
		})
		return
	}

	var req SellProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": err.Error(),
		})
		return
	}

	// TODO: Simpan ke database dengan user_id
	_ = userID

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Produk berhasil dijual",
		"data":    req,
	})
}