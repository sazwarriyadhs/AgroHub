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

// Fix marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Location {
  id: number;
  name: string;
  type: 'farmer' | 'vendor' | 'store';
  lat: number;
  lng: number;
  address: string;
  city: string;
  province: string;
  rating?: number;
  status: string;
}

interface Props {
  locations?: Location[];
  activeLayer: string;
  onLocationSelect?: (location: Location) => void;
}

const getMarkerColor = (type: string) => {
  switch (type) {
    case 'farmer':
      return '#22c55e';
    case 'vendor':
      return '#a855f7';
    case 'store':
      return '#3b82f6';
    default:
      return '#6b7280';
  }
};

const getEmoji = (type: string) => {
  switch (type) {
    case 'farmer':
      return '🌾';
    case 'vendor':
      return '🏪';
    case 'store':
      return '🏬';
    default:
      return '📍';
  }
};

export default function AgroMapClient({
  locations = [],
  activeLayer,
  onLocationSelect,
}: Props) {
  const defaultCenter: [number, number] = [-2.5489, 118.0149];

  const filteredLocations =
    activeLayer === 'all'
      ? locations
      : locations.filter((l) => l.type === activeLayer);

  const markers = useMemo(() => {
    return filteredLocations.map((location) => {
      const icon = L.divIcon({
        className: '',
        html: `
          <div class="relative">
            <div
              style="
                background:${getMarkerColor(location.type)};
                width:58px;
                height:58px;
                border-radius:999px;
                border:4px solid white;
                display:flex;
                align-items:center;
                justify-content:center;
                box-shadow:0 10px 25px rgba(0,0,0,.25);
                font-size:24px;
              "
            >
              ${getEmoji(location.type)}
            </div>

            <div
              style="
                position:absolute;
                inset:0;
                border-radius:999px;
                background:${getMarkerColor(location.type)};
                opacity:.25;
                animation:ping 2s infinite;
              "
            ></div>
          </div>
        `,
        iconSize: [58, 58],
        popupAnchor: [0, -20],
      });

      return { location, icon };
    });
  }, [filteredLocations]);

  return (
    <div className="relative overflow-hidden rounded-3xl">
      {/* TOP OVERLAY */}
      <div className="absolute left-5 top-5 z-[1000]">
        <div className="backdrop-blur-xl bg-white/80 border border-white/50 rounded-2xl shadow-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center text-white">
              <MapPin className="w-6 h-6" />
            </div>

            <div>
              <h2 className="font-bold text-gray-800 text-lg">
                AgroHub Smart Map
              </h2>

              <p className="text-sm text-gray-500">
                Monitoring petani & vendor realtime
              </p>
            </div>
          </div>
        </div>
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={5}
        zoomControl={false}
        style={{
          height: '700px',
          width: '100%',
        }}
      >
        {/* DARK MAP */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <ZoomControl position="bottomright" />

        {markers.map(({ location, icon }) => (
          <div key={location.id}>
            <Circle
              center={[location.lat, location.lng]}
              radius={1200}
              pathOptions={{
                color: getMarkerColor(location.type),
                fillColor: getMarkerColor(location.type),
                fillOpacity: 0.15,
              }}
            />

            <Marker
              position={[location.lat, location.lng]}
              icon={icon}
              eventHandlers={{
                click: () => onLocationSelect?.(location),
              }}
            >
              <Popup>
                <div className="w-[260px]">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white"
                      style={{
                        background: getMarkerColor(location.type),
                      }}
                    >
                      {getEmoji(location.type)}
                    </div>

                    <div>
                      <h3 className="font-bold text-lg">
                        {location.name}
                      </h3>

                      <p className="text-sm capitalize text-gray-500">
                        {location.type}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Navigation className="w-4 h-4" />
                      {location.city}, {location.province}
                    </div>

                    {location.rating && (
                      <div className="flex items-center gap-2 text-yellow-500">
                        <Star className="w-4 h-4 fill-yellow-400" />
                        {location.rating}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onLocationSelect?.(location)}
                    className="
                      mt-5
                      w-full
                      rounded-xl
                      bg-green-500
                      hover:bg-green-600
                      text-white
                      py-3
                      font-semibold
                      transition
                    "
                  >
                    Lihat Detail
                  </button>
                </div>
              </Popup>
            </Marker>
          </div>
        ))}
      </MapContainer>
    </div>
  );
}
