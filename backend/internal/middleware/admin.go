package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func AdminOnlyMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 🔥 FIX: Handle OPTIONS request di awal
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		role, exists := c.Get("user_role")
		if !exists || role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "Admin access required",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}