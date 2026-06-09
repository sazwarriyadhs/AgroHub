package controllers

import (
    "net/http"
    "fmt"

    "github.com/gin-gonic/gin"
    "gorm.io/gorm"

    "agrohub-backend/internal/models"
)

type NotificationController struct {
    db *gorm.DB
}

func NewNotificationController(db *gorm.DB) *NotificationController {
    return &NotificationController{db: db}
}

func (c *NotificationController) GetNotificationCount(ctx *gin.Context) {
    userIDRaw, exists := ctx.Get("user_id")
    if !exists {
        ctx.JSON(http.StatusUnauthorized, gin.H{
            "success": false,
            "error":   "Unauthorized",
        })
        return
    }

    var userID uint
    switch v := userIDRaw.(type) {
    case float64:
        userID = uint(v)
    case uint:
        userID = v
    case int:
        userID = uint(v)
    case string:
        fmt.Sscanf(v, "%d", &userID)
    default:
        ctx.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Invalid user ID type",
        })
        return
    }

    var count int64
    c.db.Model(&models.Notification{}).
        Where("user_id = ? AND is_read = false", userID).
        Count(&count)

    ctx.JSON(http.StatusOK, gin.H{
        "success": true,
        "data": gin.H{
            "count": count,
        },
    })
}
