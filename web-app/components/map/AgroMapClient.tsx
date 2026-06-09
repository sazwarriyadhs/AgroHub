'use client';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  Circle,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useMemo } from 'react';
import { MapPin, Star, Navigation } from 'lucide-react';

// Fix marker icon untuk Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export interface MapLocation {
  id: number;
  name: string;
  type: 'farmer' | 'vendor' | 'store';
  lat: number;
  lng: number;
  address: string;
  city: string;
  province: string;
  rating?: number;
  status: 'active' | 'inactive' | 'pending';
}

interface Props {
  locations?: MapLocation[];
  activeLayer: 'all' | 'farmer' | 'vendor' | 'store';
  onLocationSelect?: (location: MapLocation) => void;
}

const getMarkerColor = (type: string) => {
  switch (type) {
    case 'farmer': return '#22c55e';
    case 'vendor': return '#a855f7';
    case 'store': return '#3b82f6';
    default: return '#6b7280';
  }
};

const getEmoji = (type: string) => {
  switch (type) {
    case 'farmer': return '🌾';
    case 'vendor': return '🏪';
    case 'store': return '🏬';
    default: return '📍';
  }
};

export default function AgroMapClient({
  locations = [],
  activeLayer,
  onLocationSelect,
}: Props) {
  const defaultCenter: [number, number] = [-2.5489, 118.0149];

  const filteredLocations = activeLayer === 'all'
    ? locations
    : locations.filter((l) => l.type === activeLayer);

  const markers = useMemo(() => {
    return filteredLocations.map((location) => {
      const icon = L.divIcon({
        className: '',
        html: `
          <div class="relative">
            <div style="
              background:${getMarkerColor(location.type)};
              width:44px;
              height:44px;
              border-radius:999px;
              border:3px solid white;
              display:flex;
              align-items:center;
              justify-content:center;
              box-shadow:0 4px 12px rgba(0,0,0,.25);
              font-size:20px;
              cursor:pointer;
              transition:transform 0.2s;
            ">
              ${getEmoji(location.type)}
            </div>
            <div style="
              position:absolute;
              inset:0;
              border-radius:999px;
              background:${getMarkerColor(location.type)};
              opacity:.3;
              animation:ping 1.5s infinite;
            "></div>
          </div>
        `,
        iconSize: [44, 44],
        popupAnchor: [0, -18],
      });

      return { location, icon };
    });
  }, [filteredLocations]);

  if (filteredLocations.length === 0) {
    return (
      <div className="h-[500px] w-full bg-gray-100 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Tidak ada lokasi untuk ditampilkan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg">
      <MapContainer
        center={defaultCenter}
        zoom={5}
        zoomControl={false}
        style={{ height: '500px', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />
        <ZoomControl position="bottomright" />

        {markers.map(({ location, icon }) => (
          <div key={location.id}>
            <Circle
              center={[location.lat, location.lng]}
              radius={600}
              pathOptions={{
                color: getMarkerColor(location.type),
                fillColor: getMarkerColor(location.type),
                fillOpacity: 0.1,
                weight: 1.5,
              }}
            />
            <Marker
              position={[location.lat, location.lng]}
              icon={icon}
              eventHandlers={{ click: () => onLocationSelect?.(location) }}
            >
              <Popup>
                <div className="min-w-[220px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                      style={{ background: getMarkerColor(location.type) }}
                    >
                      {getEmoji(location.type)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{location.name}</h4>
                      <p className="text-xs text-gray-500 capitalize">{location.type}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600 flex items-center gap-1">
                      <Navigation className="w-3 h-3" /> {location.city}, {location.province}
                    </p>
                    {location.rating && (
                      <p className="text-yellow-500 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400" /> {location.rating}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => onLocationSelect?.(location)}
                    className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white text-sm py-2 rounded-lg transition"
                  >
                    Lihat Detail
                  </button>
                </div>
              </Popup>
            </Marker>
          </div>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg shadow-md px-3 py-1.5 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div><span>Petani</span></div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div><span>Vendor</span></div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span>Toko</span></div>
        </div>
      </div>
    </div>
  );
}
