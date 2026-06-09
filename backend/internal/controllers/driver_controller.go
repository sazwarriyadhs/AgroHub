package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type DriverController struct {
	db *gorm.DB
}

func NewDriverController(db *gorm.DB) *DriverController {
	return &DriverController{db: db}
}

// ============================
// 📦 GET DRIVER ORDERS
// ============================
func (h *DriverController) GetDriverOrders(c *gin.Context) {
	driverID := c.GetString("user_id")

	// TODO: replace with real query from orders table
	var orders []map[string]interface{}

	// contoh dummy response dulu
	c.JSON(http.StatusOK, gin.H{
		"success":   true,
		"driver_id": driverID,
		"orders":    orders,
	})
}

// ============================
// 🟢 ACCEPT ORDER
// ============================
func (h *DriverController) AcceptOrder(c *gin.Context) {
	driverID := c.GetString("user_id")
	orderID := c.Param("id")

	// TODO: update DB order status
	// h.db.Model(&models.Order{}).Where("id = ?", orderID).Update(...)

	c.JSON(http.StatusOK, gin.H{
		"success":   true,
		"message":   "order accepted",
		"order_id":  orderID,
		"driver_id": driverID,
	})
}

// ============================
// 📍 UPDATE DRIVER LOCATION
// ============================
func (h *DriverController) UpdateLocation(c *gin.Context) {
	driverID := c.GetString("user_id")

	var req struct {
		Lat float64 `json:"lat"`
		Lng float64 `json:"lng"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	// TODO:
	// - simpan ke Redis (real-time tracking)
	// - atau update DB driver_location

	c.JSON(http.StatusOK, gin.H{
		"success":   true,
		"driver_id": driverID,
		"lat":       req.Lat,
		"lng":       req.Lng,
		"status":    "location updated",
	})
}