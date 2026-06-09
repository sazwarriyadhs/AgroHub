'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Star } from 'lucide-react';

// Dynamic import untuk map component
const AgroHubMap = dynamic(
  () => import('@/components/map/AgroHubMapWrapper'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[650px] bg-gray-100 rounded-3xl">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Memuat peta...</p>
        </div>
      </div>
    ),
  }
);

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
  verified?: boolean;
}

export default function LocationsPage() {
  const [activeLayer, setActiveLayer] = useState<string>('all');
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    // Mock data untuk testing
    const mockLocations: Location[] = [
      { id: 1, name: "Tani Makmur Store", type: "vendor", lat: -7.9666, lng: 112.6326, address: "Jl. Pertanian No. 123", city: "Malang", province: "Jawa Timur", rating: 4.8, status: "active", verified: true },
      { id: 2, name: "Kelompok Tani Sumber Rejeki", type: "farmer", lat: -8.0964, lng: 112.4899, address: "Desa Sumberejo", city: "Malang", province: "Jawa Timur", rating: 4.5, status: "active", verified: false },
      { id: 3, name: "Agro Jaya Store", type: "store", lat: -7.9666, lng: 112.6426, address: "Jl. Raya Tlogomas No. 45", city: "Malang", province: "Jawa Timur", rating: 4.9, status: "active", verified: true },
      { id: 4, name: "Petani Hebat Indonesia", type: "farmer", lat: -8.1196, lng: 112.5699, address: "Desa Pandansari", city: "Malang", province: "Jawa Timur", rating: 4.7, status: "active", verified: false },
      { id: 5, name: "Green Agro Store", type: "vendor", lat: -7.9366, lng: 112.6126, address: "Jl. Soekarno Hatta No. 88", city: "Malang", province: "Jawa Timur", rating: 4.6, status: "active", verified: true },
    ];
    setLocations(mockLocations);
    setLoading(false);
  }, []);

  const stats = {
    total: locations.length,
    farmers: locations.filter(l => l.type === 'farmer').length,
    vendors: locations.filter(l => l.type === 'vendor').length,
    stores: locations.filter(l => l.type === 'store').length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h1 className="text-2xl font-bold">📍 Peta Lokasi</h1>
          <p className="text-gray-500 text-sm mt-1">Memuat data...</p>
        </div>
        <div className="flex items-center justify-center h-[650px] bg-gray-100 rounded-3xl">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Memuat peta...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-800">📍 Peta Lokasi</h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">Sebaran lokasi petani, vendor, dan toko AgroHub</p>
          </div>
          <div className="bg-green-50 rounded-xl px-4 py-2">
            <span className="text-sm font-semibold text-green-600">Total: {stats.total}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => setActiveLayer('all')} 
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeLayer === 'all' ? 'bg-green-600 text-white shadow-md' : 'bg-white border border-gray-200 hover:border-green-300'}`}
        >
          🗺️ Semua ({stats.total})
        </button>
        <button 
          onClick={() => setActiveLayer('farmer')} 
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeLayer === 'farmer' ? 'bg-green-600 text-white shadow-md' : 'bg-white border border-gray-200 hover:border-green-300'}`}
        >
          🌾 Petani ({stats.farmers})
        </button>
        <button 
          onClick={() => setActiveLayer('vendor')} 
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeLayer === 'vendor' ? 'bg-green-600 text-white shadow-md' : 'bg-white border border-gray-200 hover:border-green-300'}`}
        >
          🏪 Vendor ({stats.vendors})
        </button>
        <button 
          onClick={() => setActiveLayer('store')} 
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeLayer === 'store' ? 'bg-green-600 text-white shadow-md' : 'bg-white border border-gray-200 hover:border-green-300'}`}
        >
          🏬 Toko ({stats.stores})
        </button>
      </div>

      <AgroHubMap 
        locations={locations} 
        activeLayer={activeLayer} 
        onLocationSelect={setSelectedLocation} 
        height="650px" 
        showStats={true} 
        showLegend={true} 
      />

      {selectedLocation && (
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {selectedLocation.type === 'farmer' ? '🌾' : selectedLocation.type === 'vendor' ? '🏪' : '🏬'}
                </span>
                <h3 className="text-xl font-bold text-gray-800">{selectedLocation.name}</h3>
                {selectedLocation.rating && (
                  <span className="flex items-center gap-1 text-sm text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    {selectedLocation.rating}
                  </span>
                )}
                {selectedLocation.verified && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">✓ Verified</span>
                )}
              </div>
              <p className="text-gray-500 mt-2">{selectedLocation.address}, {selectedLocation.city}, {selectedLocation.province}</p>
            </div>
            <button onClick={() => setSelectedLocation(null)} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}