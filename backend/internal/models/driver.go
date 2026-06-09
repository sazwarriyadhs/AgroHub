package models

import (
	"time"
	"github.com/google/uuid"
)

type DriverStatus string

const (
	DriverOffline         DriverStatus = "OFFLINE"
	DriverAvailable       DriverStatus = "AVAILABLE"
	DriverEnRoutePickup   DriverStatus = "EN_ROUTE_PICKUP"
	DriverArrivedPickup   DriverStatus = "ARRIVED_PICKUP"
	DriverEnRouteDelivery DriverStatus = "EN_ROUTE_DELIVERY"
	DriverCompleted       DriverStatus = "COMPLETED"
)

type Driver struct {
	ID               uuid.UUID    `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	Name             string       `gorm:"type:varchar(100);not null" json:"name"`
	Phone            string       `gorm:"type:varchar(20);unique;not null" json:"phone"`
	CurrentStatus    DriverStatus `gorm:"type:varchar(30);default:'OFFLINE';not null" json:"current_status"`
	ActiveShipmentID *uuid.UUID   `gorm:"type:uuid" json:"active_shipment_id,omitempty"`
	Rating           float64      `gorm:"type:numeric(3,2);default:5.0" json:"rating"`
	TotalTrips       int          `gorm:"type:integer;default:0" json:"total_trips"`
	LastLocation     *Point       `gorm:"type:geometry(Point,4326)" json:"last_location,omitempty"`
	LastLocationAt   *time.Time   `json:"last_location_at,omitempty"`
	CreatedAt        time.Time    `json:"created_at"`
	UpdatedAt        time.Time    `json:"updated_at"`
}