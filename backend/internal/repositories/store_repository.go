package repositories

import (
	"gorm.io/gorm"
	"agrohub-backend/internal/models"
)

type StoreRepository struct {
	db *gorm.DB
}

func NewStoreRepository(db *gorm.DB) *StoreRepository {
	return &StoreRepository{db: db}
}

func (r *StoreRepository) FindByID(id uint) (*models.Store, error) {
	var store models.Store
	err := r.db.First(&store, id).Error
	return &store, err
}

func (r *StoreRepository) FindAll() ([]models.Store, error) {
	var stores []models.Store
	err := r.db.Find(&stores).Error
	return stores, err
}