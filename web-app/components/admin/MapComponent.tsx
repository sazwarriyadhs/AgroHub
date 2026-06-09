'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Location {
  id: number;
  name: string;
  type: 'farmer' | 'vendor';
  lat: number;
  lng: number;
  address: string;
  phone?: string;
  email?: string;
  products?: string[];
  rating?: number;
  joined_date?: string;
}

interface MapComponentProps {
  locations: Location[];
  activeLayer: 'farmers' | 'vendors' | 'all';
}

export default function MapComponent({ locations, activeLayer }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: number]: L.Marker }>({});

  useEffect(() => {
    if (!mapRef.current && typeof window !== 'undefined') {
      mapRef.current = L.map('map').setView([-7.9666, 112.6326], 10);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> & CartoDB',
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 3
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add new markers
    locations.forEach(location => {
      const markerColor = location.type === 'farmer' ? '#22c55e' : '#a855f7';
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${markerColor}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${location.type === 'farmer' ? '🌾' : '🏪'}</div>`,
        iconSize: [24, 24],
        popupAnchor: [0, -12]
      });

      const marker = L.marker([location.lat, location.lng], { icon }).addTo(mapRef.current!);
      
      // Popup content
      const popupContent = `
        <div style="min-width: 200px; padding: 8px;">
          <h4 style="font-weight: bold; margin-bottom: 8px;">${location.name}</h4>
          <p style="font-size: 12px; margin-bottom: 4px;">📌 ${location.address}</p>
          ${location.phone ? `<p style="font-size: 12px; margin-bottom: 4px;">📞 ${location.phone}</p>` : ''}
          ${location.email ? `<p style="font-size: 12px; margin-bottom: 4px;">✉️ ${location.email}</p>` : ''}
          ${location.products ? `<p style="font-size: 12px;">🛒 ${location.products.join(', ')}</p>` : ''}
          ${location.rating ? `<p style="font-size: 12px;">⭐ ${location.rating} / 5</p>` : ''}
          <hr style="margin: 8px 0;" />
          <p style="font-size: 11px; color: #666;">Bergabung: ${location.joined_date}</p>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      markersRef.current[location.id] = marker;
    });

    // Fit bounds to show all markers
    if (locations.length > 0 && mapRef.current) {
      const bounds = L.latLngBounds(locations.map(l => [l.lat, l.lng]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations]);

  return <div id="map" style={{ height: '450px', width: '100%', zIndex: 1 }} />;
}

