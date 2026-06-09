// internal/routes/routes.go
package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"

	"agrohub-backend/internal/ai"
	"agrohub-backend/internal/config"
	"agrohub-backend/internal/controllers"
	"agrohub-backend/internal/middleware"
	"agrohub-backend/internal/repositories"
	"agrohub-backend/internal/services"
	"agrohub-backend/internal/ws"
)

func SetupRoutes(
	router *gin.Engine,
	db *gorm.DB,
	cfg *config.Config,
	redisClient *redis.Client,
	orchestrator *ai.Orchestrator,
) {

	// =====================
	// WS
	// =====================
	hub := ws.NewHub()
	go hub.Run()

	router.GET("/ws/chat", func(c *gin.Context) {
		ws.ServeWs(hub, c)
	})

	// =====================
	// REPO + SERVICE
	// =====================
	userRepo := repositories.NewUserRepository(db)
	storeRepo := repositories.NewStoreRepository(db)

	authService := services.NewAuthService(cfg, userRepo, redisClient)

	// =====================
	// CONTROLLERS
	// =====================
	authController := controllers.NewAuthController(authService)

	productController := controllers.NewProductController(db)
	storeController := controllers.NewStoreController(storeRepo, db)
	categoryController := controllers.NewCategoryController(db)

	dashboardController := controllers.NewDashboardController(db)
	walletController := controllers.NewWalletController(db)
	
	communityController := controllers.NewCommunityController(db)

	cartController := controllers.NewCartController(db)
	wishlistController := controllers.NewWishlistController(db)
	orderController := controllers.NewOrderController(db)

	fishPriceController := controllers.NewFishPriceController(db)
	fishCategoryController := controllers.NewFishCategoryController(db)

	farmProductController := controllers.NewFarmProductController(db)
	vendorProductController := controllers.NewVendorProductController(db)

	// NEW: AQUA DASHBOARD CONTROLLER
	aquaDashboardController := controllers.NewAquaDashboardController(db)

	// 🛠️ NEW: DRIVER CONTROLLER FOR EXPRESS MOBILE APP
	driverController := controllers.NewDriverController(db)

	// =====================
	// ROOT
	// =====================
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"success": true, "message": "AgroHub Running 🚀"})
	})

	// =====================
	// PUBLIC
	// =====================
	public := router.Group("/api/v1/public")
	{
		public.POST("/login", authController.Login)
		public.POST("/register", authController.Register)

		public.GET("/products", productController.GetProducts)
		public.GET("/products/:id", productController.GetProductByID)

		public.GET("/stores", storeController.GetAllStores)
		public.GET("/stores/:id", storeController.GetStoreByID)

		public.GET("/categories", categoryController.GetCategories)

		public.GET("/fish-prices", fishPriceController.GetFishPrices)
		public.GET("/fish-categories", fishCategoryController.GetFishCategories)

		public.GET("/vendor-products", vendorProductController.GetVendorProducts)
	}

	// =====================
	// AUTH (Protected Routes)
	// =====================
	auth := router.Group("/api/v1")
	auth.Use(middleware.AuthMiddleware(cfg, db, redisClient))
	{
		// Common routes (semua apps bisa pakai)
		auth.GET("/profile", authController.GetProfile)
		auth.POST("/logout", authController.Logout)

		auth.GET("/dashboard/stats", dashboardController.GetStats)
		auth.GET("/wallet", walletController.GetWallet)

		auth.GET("/community/feed", communityController.GetFeed)

		// CART MODULE
		auth.GET("/cart", cartController.GetCart)
		auth.POST("/cart/add", cartController.AddToCart)

		// WISHLIST MODULE
		auth.GET("/wishlist", wishlistController.GetWishlist)
		auth.POST("/wishlist/add", wishlistController.AddToWishlist)

		// ORDERS MODULE
		auth.GET("/orders", orderController.GetOrders)

		// FARM MODULE
		auth.GET("/farm/products", farmProductController.GetMyCrops)
		auth.POST("/farm/products/sell", farmProductController.SellProduct)

		// ===============================================
		// NEW: AQUA SPECIFIC ROUTES (agrohub_aqua_app)
		// ===============================================
		aqua := auth.Group("/aqua")
		{
			aqua.GET("/dashboard/stats", aquaDashboardController.GetAquaDashboardStats)
			aqua.GET("/commodity-prices", aquaDashboardController.GetCommodityPrices)
			aqua.GET("/activities/recent", aquaDashboardController.GetRecentActivities)
			aqua.GET("/notifications/count", aquaDashboardController.GetNotificationCount)
		}

		// ===============================================
		// 🛠️ NEW: DRIVER SPECIFIC ROUTES (agrohub_express_mobile)
		// ===============================================
		driver := auth.Group("/driver")
		driver.Use(middleware.RoleMiddleware("driver"))
		{
			driver.GET("/orders", driverController.GetDriverOrders)
			driver.POST("/orders/:id/accept", driverController.AcceptOrder)
			driver.POST("/location", driverController.UpdateLocation)
		}

		// AI Chat
		auth.POST("/ai/chat", func(c *gin.Context) {
			if orchestrator == nil {
				c.JSON(503, gin.H{"error": "AI unavailable"})
				return
			}

			var req struct {
				Module   string `json:"module"`
				EntityID string `json:"entity_id"`
				Message  string `json:"message"`
			}

			if err := c.ShouldBindJSON(&req); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}

			res, err := orchestrator.Route(c, req.Module, req.EntityID, req.Message)
			if err != nil {
				c.JSON(500, gin.H{"error": err.Error()})
				return
			}

			c.JSON(200, gin.H{"reply": res})
		})
	}

	// =====================
	// ADMIN
	// =====================
	admin := router.Group("/api/v1/admin")
	admin.Use(middleware.AuthMiddleware(cfg, db, redisClient))
	{
		admin.GET("/dashboard", dashboardController.GetAdminDashboardStats)
	}
}