package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"agrohub-backend/internal/models"
)

type DashboardController struct {
	db *gorm.DB
}

func NewDashboardController(db *gorm.DB) *DashboardController {
	return &DashboardController{db: db}
}

// =========================
// HELPERS
// =========================

func getVerificationStatus(user *models.User) string {
	if user.IsVerified {
		return "verified"
	}
	return "pending"
}

func (dc *DashboardController) getUser(c *gin.Context) (*models.User, bool) {
	userInterface, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "user not found in context",
		})
		return nil, false
	}

	user, ok := userInterface.(*models.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "invalid user type",
		})
		return nil, false
	}

	return user, true
}

// =========================
// DASHBOARD STATS
// =========================
func (dc *DashboardController) GetStats(c *gin.Context) {
	user, ok := dc.getUser(c)
	if !ok {
		return
	}

	var totalProducts int64
	var totalOrders int64
	var totalRevenue float64
	var avgRating float64

	dc.db.Model(&models.Product{}).
		Where("seller_id = ?", user.ID).
		Count(&totalProducts)

	dc.db.Model(&models.Order{}).
		Where("user_id = ?", user.ID).
		Count(&totalOrders)

	dc.db.Model(&models.Order{}).
		Select("COALESCE(SUM(total_amount),0)").
		Where("user_id = ?", user.ID).
		Scan(&totalRevenue)

	dc.db.Model(&models.Product{}).
		Select("COALESCE(AVG(rating_avg),0)").
		Where("seller_id = ?", user.ID).
		Scan(&avgRating)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"totalRevenue": totalRevenue,
			"totalSales":   totalProducts,
			"activeOrders": totalOrders,
			"pendingTasks": 5,

			"total_orders":   totalOrders,
			"total_products": totalProducts,
			"avg_rating":     avgRating,
			"ai_insight":     "Demand naik 22% minggu ini",
		},
	})
}

// =========================
// GET PROFILE
// =========================
func (dc *DashboardController) GetProfile(c *gin.Context) {
	user, ok := dc.getUser(c)
	if !ok {
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"id":        user.ID,
			"name":      user.Name,
			"email":     user.Email,
			"phone":     user.Phone,
			"role":      user.Role,
			"city":      user.City,
			"province":  user.Province,
			"address":   user.Address,
			"verified":  user.IsVerified,
			"createdAt": user.CreatedAt,
			"updatedAt": user.UpdatedAt,
		},
	})
}

// =========================
// WALLET
// =========================
func (dc *DashboardController) GetWallet(c *gin.Context) {
	user, ok := dc.getUser(c)
	if !ok {
		return
	}

	var wallet models.Wallet
	balance := 0.0

	err := dc.db.Where("user_id = ?", user.ID).First(&wallet).Error
	if err == nil {
		balance = wallet.Balance
	} else {
		wallet = models.Wallet{
			UserID:  user.ID,
			Balance: 0,
		}
		dc.db.Create(&wallet)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"balance":  balance,
			"currency": "IDR",
			"user_id":  user.ID,
		},
	})
}

// =========================
// COMPLETE PROFILE
// =========================
func (dc *DashboardController) GetCompleteProfile(c *gin.Context) {
	user, ok := dc.getUser(c)
	if !ok {
		return
	}

	var wallet models.Wallet
	dc.db.Where("user_id = ?", user.ID).First(&wallet)

	var totalSales int64
	dc.db.Model(&models.Order{}).
		Where("user_id = ?", user.ID).
		Count(&totalSales)

	var totalProducts int64
	dc.db.Model(&models.Product{}).
		Where("seller_id = ?", user.ID).
		Count(&totalProducts)

	var sellerScore float64
	dc.db.Model(&models.Product{}).
		Select("COALESCE(AVG(rating_avg),0)").
		Where("seller_id = ?", user.ID).
		Scan(&sellerScore)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"id":             user.ID,
			"name":           user.Name,
			"email":          user.Email,
			"phone":          user.Phone,
			"role":           user.Role,
			"city":           user.City,
			"province":       user.Province,
			"balance":        wallet.Balance,
			"total_sales":    totalSales,
			"total_products": totalProducts,
			"sellerScore":    sellerScore,
			"verified":       user.IsVerified,
		},
	})
}

// =========================
// UPDATE PROFILE
// =========================
func (dc *DashboardController) UpdateProfile(c *gin.Context) {
	user, ok := dc.getUser(c)
	if !ok {
		return
	}

	var input map[string]interface{}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "invalid request",
		})
		return
	}

	if v, ok := input["name"].(string); ok {
		user.Name = v
	}
	if v, ok := input["phone"].(string); ok {
		user.Phone = v
	}
	if v, ok := input["city"].(string); ok {
		user.City = v
	}
	if v, ok := input["province"].(string); ok {
		user.Province = v
	}
	if v, ok := input["address"].(string); ok {
		user.Address = v
	}

	if err := dc.db.Save(user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "failed to update",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "updated successfully",
	})
}

// =========================
// ADMIN STATS
// =========================
func (dc *DashboardController) GetAdminDashboardStats(c *gin.Context) {
	var users, orders, products int64
	var revenue float64

	dc.db.Model(&models.User{}).Count(&users)
	dc.db.Model(&models.Order{}).Count(&orders)
	dc.db.Model(&models.Product{}).Count(&products)

	dc.db.Model(&models.Order{}).
		Select("COALESCE(SUM(total_amount),0)").
		Scan(&revenue)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"users":    users,
			"orders":   orders,
			"products": products,
			"revenue":  revenue,
		},
	})
}

// =========================
// RECENT ACTIVITY
// =========================
func (dc *DashboardController) GetRecentActivities(c *gin.Context) {
	user, ok := dc.getUser(c)
	if !ok {
		return
	}

	var orders []models.Order
	dc.db.Where("user_id = ?", user.ID).
		Order("created_at DESC").
		Limit(5).
		Find(&orders)

	activities := []gin.H{}

	for _, o := range orders {

		amount := ""
		if o.TotalAmount > 0 {
			amount = fmt.Sprintf("Rp %.0f", o.TotalAmount)
		}

		activities = append(activities, gin.H{
			"title":    fmt.Sprintf("Order #%d", o.ID),
			"subtitle": o.Status,
			"amount":   amount,
			"time":     o.CreatedAt.Format("2006-01-02 15:04"),
		})
	}

	if len(activities) == 0 {
		activities = append(activities, gin.H{
			"title":    "Welcome",
			"subtitle": "Mulai gunakan AgroHub",
			"time":     "baru saja",
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    activities,
	})
}