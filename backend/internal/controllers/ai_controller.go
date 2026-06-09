package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"agrohub-backend/internal/config"
	"agrohub-backend/internal/ai"
)

type AIController struct {
	DB  *gorm.DB
	Cfg *config.Config
	AI  *ai.AIService
}

func NewAIController(db *gorm.DB, cfg *config.Config) *AIController {
	return &AIController{
		DB:  db,
		Cfg: cfg,
		AI:  ai.NewAIService(db, cfg),
	}
}

// =========================
// PUBLIC AI
// =========================

func (c *AIController) AskAI(ctx *gin.Context) {

	var req struct {
		Module   string `json:"module"`
		EntityID string `json:"entity_id"`
		Message  string `json:"message"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	res, err := c.AI.Analyze(ctx, req.Module, req.EntityID, req.Message)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    res,
	})
}

// =========================
// DISEASE AI
// =========================

func (c *AIController) DetectDisease(ctx *gin.Context) {

	var req struct {
		Module   string `json:"module"`
		EntityID string `json:"entity_id"`
	}

	ctx.ShouldBindJSON(&req)

	res, err := c.AI.Analyze(ctx, req.Module, req.EntityID, "disease check")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    res,
	})
}

// =========================
// MARKET AI
// =========================

func (c *AIController) MarketInsight(ctx *gin.Context) {

	var req struct {
		CommodityID string `json:"commodity_id"`
	}

	ctx.ShouldBindJSON(&req)

	res, err := c.AI.Analyze(ctx, "market", req.CommodityID, "market insight")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    res,
	})
}

// =========================
// USER AI CHAT
// =========================

func (c *AIController) ChatWithAI(ctx *gin.Context) {

	var req struct {
		Message string `json:"message"`
	}

	ctx.ShouldBindJSON(&req)

	res, err := c.AI.Analyze(ctx, "general", "0", req.Message)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"reply":   res,
	})
}

// =========================
// ANALYZE ASSET (AQUA/HERD/FARM)
// =========================

func (c *AIController) AnalyzeAsset(ctx *gin.Context) {

	var req struct {
		Module   string `json:"module"`
		EntityID string `json:"entity_id"`
	}

	ctx.ShouldBindJSON(&req)

	res, err := c.AI.Analyze(ctx, req.Module, req.EntityID, "full analysis")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    res,
	})
}

// =========================
// HISTORY (placeholder)
// =========================

func (c *AIController) GetAIHistory(ctx *gin.Context) {

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    []string{},
	})
}

// =========================
// ADMIN AI
// =========================

func (c *AIController) GetAIMetrics(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"metrics": "AI system healthy",
	})
}

func (c *AIController) GetAILogs(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"logs": []string{},
	})
}

func (c *AIController) TriggerAIRefresh(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "AI refresh triggered",
	})
}