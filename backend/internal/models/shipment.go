package models

import (
	"time"
	"github.com/google/uuid"
)

type ShipmentStatus string

const (
	ShipmentPending   ShipmentStatus = "PENDING"
	ShipmentAssigned  ShipmentStatus = "ASSIGNED"
	ShipmentPickup    ShipmentStatus = "PICKUP"
	ShipmentInTransit ShipmentStatus = "IN_TRANSIT"
	ShipmentDelivered ShipmentStatus = "DELIVERED"
	ShipmentCancelled ShipmentStatus = "CANCELLED"
)

type Shipment struct {
	ID                  uuid.UUID      `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	ShipmentNumber      string         `gorm:"type:varchar(50);unique;not null" json:"shipment_number"`
	CustomerName        string         `gorm:"type:varchar(100);not null" json:"customer_name"`
	CustomerPhone       string         `gorm:"type:varchar(20);not null" json:"customer_phone"`
	
	// Spatial data points (Menggunakan struct Point dari location.go)
	OriginLocation      Point          `gorm:"type:geometry(Point,4326);not null" json:"origin_location"`
	DestinationLocation Point          `gorm:"type:geometry(Point,4326);not null" json:"destination_location"`
	CurrentLocation     *Point         `gorm:"type:geometry(Point,4326)" json:"current_location,omitempty"`
	
	// Route tracking (Menggunakan struct LineString dari location.go)
	RoutePath           *LineString    `gorm:"type:geometry(LineString,4326)" json:"route_path,omitempty"`
	
	DriverID            *uuid.UUID     `gorm:"type:uuid" json:"driver_id,omitempty"`
	Driver              *Driver        `gorm:"foreignKey:DriverID;constraint:OnDelete:Set Null" json:"driver,omitempty"`
	
	Status              ShipmentStatus `gorm:"type:varchar(30);default:'PENDING';not null" json:"status"`
	Distance            float64        `gorm:"type:numeric(8,2)" json:"distance"` 
	DistanceRemaining   float64        `gorm:"type:numeric(8,2)" json:"distance_remaining"`
	EstimatedETA        *time.Time     `json:"estimated_eta,omitempty"`
	ActualETA           *time.Time     `json:"actual_eta,omitempty"`
	
	Price               float64        `gorm:"type:numeric(12,2)" json:"price"`
	CreatedAt           time.Time      `json:"created_at"`
	UpdatedAt           time.Time      `json:"updated_at"`
}