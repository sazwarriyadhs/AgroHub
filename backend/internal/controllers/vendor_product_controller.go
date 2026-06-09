// internal/controllers/vendor_product_controller.go
package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type VendorProductController struct {
	db *gorm.DB
}

func NewVendorProductController(db *gorm.DB) *VendorProductController {
	return &VendorProductController{db: db}
}

func (ctrl *VendorProductController) GetVendorProducts(c *gin.Context) {
	products := []gin.H{
		{
			"id":          1,
			"name":        "Pupuk NPK",
			"category":    "fertilizer",
			"price":       185000,
			"unit":        "25kg",
			"stock":       100,
			"vendor_name": "PT Agro Makmur",
		},
		{
			"id":          2,
			"name":        "Pestisida Organik",
			"category":    "pesticide",
			"price":       75000,
			"unit":        "500ml",
			"stock":       50,
			"vendor_name": "CV Tani Sejahtera",
		},
		{
			"id":          3,
			"name":        "Benih Padi IR64",
			"category":    "seed",
			"price":       45000,
			"unit":        "5kg",
			"stock":       200,
			"vendor_name": "UD Sumber Tani",
		},
		{
			"id":          4,
			"name":        "Pompa Air",
			"category":    "tool",
			"price":       850000,
			"unit":        "unit",
			"stock":       10,
			"vendor_name": "PT Agro Makmur",
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   products,
	})
}