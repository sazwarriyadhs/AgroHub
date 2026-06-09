package ai

import (
	"context"
	"strings"

	"gorm.io/gorm"
	"agrohub-backend/internal/config"
)

// =========================
// ORCHESTRATOR (AI BRAIN)
// =========================

type Orchestrator struct {
	DB *gorm.DB
	Cfg *config.Config
	AI *Client
}

func NewOrchestrator(db *gorm.DB, cfg *config.Config) *Orchestrator {
	return &Orchestrator{
		DB:  db,
		Cfg: cfg,
		AI:  NewClient(cfg),
	}
}

// =========================
// CORE ROUTER
// =========================

func (o *Orchestrator) Route(
	ctx context.Context,
	module string,
	entityID string,
	message string,
) (string, error) {

	m := strings.ToLower(module)

	switch {

	// 🐟 AQUA / POND
	case m == "aqua" || m == "fish" || m == "pond":
		return o.handleAqua(ctx, entityID, message)

	// 🐄 HERD / LIVESTOCK
	case m == "herd" || m == "livestock":
		return o.handleHerd(ctx, entityID, message)

	// 🌾 FARM / CROP
	case m == "farm" || m == "crop":
		return o.handleFarm(ctx, entityID, message)

	// 📊 MARKET
	case m == "market":
		return o.handleMarket(ctx, entityID, message)

	// 💬 GENERAL CHAT
	default:
		return o.handleGeneral(ctx, message)
	}
}

// =========================
// AQUA AI (FISH / POND)
// =========================

func (o *Orchestrator) handleAqua(ctx context.Context, pondID string, msg string) (string, error) {

	var lastHealth string

	err := o.DB.Raw(`
		SELECT COALESCE(status, '')
		FROM pond_monitorings
		WHERE pond_id = ?
		ORDER BY created_at DESC
		LIMIT 1
	`, pondID).Scan(&lastHealth).Error

	if err != nil {
		return "", err
	}

	prompt := "AQUA DISEASE ANALYSIS\n" +
		"Context: " + lastHealth + "\n" +
		"User: " + msg

	return o.AI.Generate(prompt)
}

// =========================
// HERD AI (LIVESTOCK)
// =========================

func (o *Orchestrator) handleHerd(ctx context.Context, livestockID string, msg string) (string, error) {

	var data string

	err := o.DB.Raw(`
		SELECT COALESCE(health_status::text, '')
		FROM livestock_monitorings
		WHERE livestock_id = ?
		ORDER BY created_at DESC
		LIMIT 1
	`, livestockID).Scan(&data).Error

	if err != nil {
		return "", err
	}

	prompt := "LIVESTOCK HEALTH ANALYSIS\n" +
		"Data: " + data + "\n" +
		"User: " + msg

	return o.AI.Generate(prompt)
}

// =========================
// FARM AI (CROP / ASSET)
// =========================

func (o *Orchestrator) handleFarm(ctx context.Context, assetID string, msg string) (string, error) {

	var growth string

	err := o.DB.Raw(`
		SELECT COALESCE(growth_stage::text, '')
		FROM asset_growth_logs
		WHERE asset_id = ?
		ORDER BY created_at DESC
		LIMIT 1
	`, assetID).Scan(&growth).Error

	if err != nil {
		return "", err
	}

	prompt := "FARM CROP ANALYSIS\n" +
		"Growth: " + growth + "\n" +
		"User: " + msg

	return o.AI.Generate(prompt)
}

// =========================
// MARKET AI (PRICE INSIGHT)
// =========================

func (o *Orchestrator) handleMarket(ctx context.Context, commodityID string, msg string) (string, error) {

	var price string

	err := o.DB.Raw(`
		SELECT COALESCE(price::text, '')
		FROM commodity_prices
		WHERE commodity_id = ?
		ORDER BY created_at DESC
		LIMIT 1
	`, commodityID).Scan(&price).Error

	if err != nil {
		return "", err
	}

	prompt := "MARKET INSIGHT AI\n" +
		"Price: " + price + "\n" +
		"User: " + msg

	return o.AI.Generate(prompt)
}

// =========================
// GENERAL AI CHAT
// =========================

func (o *Orchestrator) handleGeneral(ctx context.Context, msg string) (string, error) {

	prompt := "AGROHUB AGRI AI ASSISTANT\nUser: " + msg

	return o.AI.Generate(prompt)
}