// models/location.go
package models

import (
	"database/sql/driver"
	"fmt"
	"strings"
)

// Point represents a GeoJSON Point (WGS84)
type Point struct {
	Lat float64 `json:"lat"`
	Lng float64 `json:"lng"`
}

// Scan implements sql.Scanner interface for PostGIS WKT/EWKT
func (p *Point) Scan(value interface{}) error {
	if value == nil {
		return nil
	}

	s, ok := value.(string)
	if !ok {
		// Mengatasi jika database mengembalikan representasi byte (WKB)
		b, ok := value.([]byte)
		if !ok {
			return fmt.Errorf("failed to scan Point: unsupported data type %T", value)
		}
		s = string(b)
	}

	// Hilangkan prefix SRID jika dibaca sebagai EWKT (misal: SRID=4326;POINT(...))
	if idx := strings.Index(s, ";"); idx != -1 {
		s = s[idx+1:]
	}

	s = strings.TrimPrefix(s, "POINT(")
	s = strings.TrimSuffix(s, ")")
	coords := strings.Split(s, " ")
	if len(coords) != 2 {
		return fmt.Errorf("failed to parse Point coordinates from: %s", s)
	}

	if _, err := fmt.Sscanf(coords[0], "%f", &p.Lng); err != nil {
		return err
	}
	if _, err := fmt.Sscanf(coords[1], "%f", &p.Lat); err != nil {
		return err
	}

	return nil
}

// Value implements driver.Valuer for PostGIS - Menggunakan format EWKT SRID 4326
func (p Point) Value() (driver.Value, error) {
	// PostGIS dapat menerima string EWKT secara langsung saat insert/update
	return fmt.Sprintf("SRID=4326;POINT(%f %f)", p.Lng, p.Lat), nil
}

// LineString represents a GeoJSON LineString for route paths
type LineString struct {
	Coordinates [][]float64 `json:"coordinates"`
}

// Scan implements sql.Scanner interface for PostGIS LineString WKT/EWKT
func (l *LineString) Scan(value interface{}) error {
	if value == nil {
		return nil
	}

	s, ok := value.(string)
	if !ok {
		b, ok := value.([]byte)
		if !ok {
			return fmt.Errorf("failed to scan LineString: unsupported data type %T", value)
		}
		s = string(b)
	}

	if idx := strings.Index(s, ";"); idx != -1 {
		s = s[idx+1:]
	}

	s = strings.TrimPrefix(s, "LINESTRING(")
	s = strings.TrimSuffix(s, ")")
	points := strings.Split(s, ",")

	// FIX: Diubah dari []float64{} menjadi [][]float64{} agar tipe datanya match (2 Dimensi)
	l.Coordinates = [][]float64{} 
	for _, point := range points {
		coords := strings.Split(strings.TrimSpace(point), " ")
		if len(coords) == 2 {
			var lng, lat float64
			if _, err := fmt.Sscanf(coords[0], "%f", &lng); err == nil {
				if _, err := fmt.Sscanf(coords[1], "%f", &lat); err == nil {
					l.Coordinates = append(l.Coordinates, []float64{lng, lat})
				}
			}
		}
	}

	return nil
}

// Value implements driver.Valuer for PostGIS LineString
func (l LineString) Value() (driver.Value, error) {
	if len(l.Coordinates) == 0 {
		return nil, nil
	}

	var segments []string
	for _, coord := range l.Coordinates {
		if len(coord) == 2 {
			segments = append(segments, fmt.Sprintf("%f %f", coord[0], coord[1]))
		}
	}
	
	return fmt.Sprintf("SRID=4326;LINESTRING(%s)", strings.Join(segments, ",")), nil
}