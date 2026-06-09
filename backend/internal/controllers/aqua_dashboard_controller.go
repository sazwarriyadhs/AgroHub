// internal/controllers/aqua_dashboard_controller.go
package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"agrohub-backend/internal/models"
)

type AquaDashboardController struct {
	db *gorm.DB
}

func NewAquaDashboardController(db *gorm.DB) *AquaDashboardController {
	return &AquaDashboardController{db: db}
}

// GetAquaDashboardStats returns stats khusus untuk agrohub_aqua_app
// GET /api/v1/aqua/dashboard/stats
func (ctrl *AquaDashboardController) GetAquaDashboardStats(c *gin.Context) {
	userInterface, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "user not found",
		})
		return
	}

	_, ok := userInterface.(*models.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "invalid user type",
		})
		return
	}

	// Return mock data untuk sementara (sampai tabel Pond, Fish, Harvest dibuat)
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"pond_count":     0,
			"fish_count":     0,
			"water_quality":  "Normal",
			"total_harvest":  0,
			"ai_insight":     "Musim panen dalam 2 minggu",
		},
	})
}

// GetCommodityPrices returns current fish market prices untuk aqua
// GET /api/v1/aqua/commodity-prices
func (ctrl *AquaDashboardController) GetCommodityPrices(c *gin.Context) {
	// Try to get from database using raw query
	var fishPrices []map[string]interface{}
	
	if ctrl.db.Migrator().HasTable("fish_prices") {
		ctrl.db.Table("fish_prices").
			Where("is_active = ?", true).
			Order("fish_name ASC").
			Find(&fishPrices)
	}

	if len(fishPrices) > 0 {
		result := make([]gin.H, len(fishPrices))
		for i, p := range fishPrices {
			result[i] = gin.H{
				"name":           p["fish_name"],
				"current_price":  p["current_price"],
				"unit":           p["unit"],
				"trend":          p["trend"],
				"change_percent": p["change_percent"],
			}
		}
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data":    result,
		})
		return
	}

	// Fallback to default prices
	defaultPrices := []gin.H{
		{"name": "Lele", "current_price": 18500, "unit": "kg", "trend": "up", "change_percent": 2.5},
		{"name": "Nila", "current_price": 24500, "unit": "kg", "trend": "stable", "change_percent": 0},
		{"name": "Gurame", "current_price": 52000, "unit": "kg", "trend": "up", "change_percent": 5.0},
		{"name": "Patin", "current_price": 28000, "unit": "kg", "trend": "down", "change_percent": -1.5},
		{"name": "Mas", "current_price": 32000, "unit": "kg", "trend": "stable", "change_percent": 0},
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    defaultPrices,
	})
}

// GetRecentActivities returns recent activities untuk aqua
// GET /api/v1/aqua/activities/recent
func (ctrl *AquaDashboardController) GetRecentActivities(c *gin.Context) {
	userInterface, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "user not found",
		})
		return
	}

	_, ok := userInterface.(*models.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "invalid user type",
		})
		return
	}

	// Sample activities (mock data untuk sementara)
	activities := []gin.H{
		{
			"title":       "Selamat datang di AgroHub Aqua",
			"description": "Mulai kelola kolam ikan Anda",
			"amount":      "",
			"created_at":  time.Now().Format(time.RFC3339),
			"type":        "info",
		},
		{
			"title":       "Tips Kualitas Air",
			"description": "Cek pH dan suhu air secara rutin untuk hasil panen optimal",
			"amount":      "",
			"created_at":  time.Now().Add(-24 * time.Hour).Format(time.RFC3339),
			"type":        "success",
		},
		{
			"title":       "Pakan Terbaru",
			"description": "Pakan berkualitas tinggi untuk lele tersedia di marketplace",
			"amount":      "",
			"created_at":  time.Now().Add(-48 * time.Hour).Format(time.RFC3339),
			"type":        "info",
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    activities,
	})
}

// GetNotificationCount returns unread notification count untuk aqua
// GET /api/v1/aqua/notifications/count
func (ctrl *AquaDashboardController) GetNotificationCount(c *gin.Context) {
	var count int64

	if ctrl.db.Migrator().HasTable("notifications") {
		userInterface, exists := c.Get("user")
		if exists {
			if user, ok := userInterface.(*models.User); ok {
				ctrl.db.Table("notifications").
					Where("user_id = ? AND is_read = ? AND (category = ? OR category = ?)",
						user.ID, false, "aqua", "general").
					Count(&count)
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"count": count,
		},
	})
}