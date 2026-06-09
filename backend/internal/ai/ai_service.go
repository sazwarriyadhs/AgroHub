package ai

import (
	"context"

	"gorm.io/gorm"
	"agrohub-backend/internal/config"
)

type AIService struct {
	DB  *gorm.DB
	Cfg *config.Config
}

func NewAIService(db *gorm.DB, cfg *config.Config) *AIService {
	return &AIService{
		DB:  db,
		Cfg: cfg,
	}
}
func (s *AIService) Analyze(ctx context.Context, module string, entityID string, prompt string) (string, error) {

	var contextData string

	s.DB.Raw(`
		SELECT COALESCE(details::text, '')
		FROM ai_consultations
		WHERE entity_id = ?
		ORDER BY created_at DESC
		LIMIT 1
	`, entityID).Scan(&contextData)

	finalPrompt := prompt + "\nContext:\n" + contextData

	// TEMP AI RESPONSE (biar jalan dulu)
	return "AI RESPONSE [" + module + "]: " + finalPrompt, nil
}