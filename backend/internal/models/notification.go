package models

import (
    "time"
    "github.com/google/uuid"
)

type Notification struct {
    ID        uuid.UUID `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
    UserID    uuid.UUID `json:"user_id" gorm:"type:uuid;not null;index"`
    Type      string    `json:"type" gorm:"type:varchar(50);not null"`
    Title     string    `json:"title" gorm:"type:varchar(255)"`
    Message   string    `json:"message" gorm:"type:text"`
    Data      string    `json:"data" gorm:"type:text"`
    IsRead    bool      `json:"is_read" gorm:"default:false"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`

    User User `json:"user,omitempty" gorm:"foreignKey:UserID"`
}
