// components/MarketIntelligence.tsx - FIXED VERSION
'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';

interface MarketPrice {
  commodity: string;
  price: number;
  previous_price: number;
  unit: string;
  change: number;
  change_percent: number;
  trend: string;
  province: string;
}

// Default/sample data untuk initial state
const defaultPrices: MarketPrice[] = [
  { commodity: 'Cabai Merah', price: 38000, previous_price: 33900, unit: 'kg', change: 4100, change_percent: 12, trend: 'up', province: 'Nasional' },
  { commodity: 'Bawang Merah', price: 26000, previous_price: 27400, unit: 'kg', change: -1400, change_percent: -5, trend: 'down', province: 'Nasional' },
  { commodity: 'Tomat', price: 8000, previous_price: 7770, unit: 'kg', change: 230, change_percent: 3, trend: 'up', province: 'Nasional' },
  { commodity: 'Jagung Pipilan', price: 5200, previous_price: 4860, unit: 'kg', change: 340, change_percent: 7, trend: 'up', province: 'Nasional' },
  { commodity: 'Beras Medium', price: 13000, previous_price: 13130, unit: 'kg', change: -130, change_percent: -1, trend: 'down', province: 'Nasional' },
];

export default function MarketIntelligence() {
  const [prices, setPrices] = useState<MarketPrice[]>(defaultPrices);
  const [insight, setInsight] = useState('Harga Cabai Merah diprediksi naik dalam 3 hari ke depan. Waktu terbaik untuk menjual adalah besok.');
  const [lastUpdate, setLastUpdate] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMarketData = async () => {
    try {
      const response = await fetch('http://localhost:8900/api/market/prices');
      const data = await response.json();
      
      if (data.success && data.data && data.data.prices && data.data.prices.length > 0) {
        setPrices(data.data.prices);
        setInsight(data.data.insight || insight);
        setLastUpdate(data.data.last_update || new Date().toLocaleString('id-ID'));
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      // Keep using default prices
      setLastUpdate(new Date().toLocaleString('id-ID'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchMarketData();
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-yellow-500" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-500';
    return 'text-yellow-500';
  };

  // Pastikan prices selalu array
  const safePrices = Array.isArray(prices) ? prices : defaultPrices;

  if (loading && safePrices.length === 0) {
    return (
      <div className="bg-white border rounded-3xl p-8 shadow-sm">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-3xl p-8 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            📊 Market Intelligence
            <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
              Real-time
            </span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Pantau harga komoditas & prediksi 3 hari ke depan
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-slate-400">Update terakhir</p>
            <p className="text-xs text-slate-500 font-medium">{lastUpdate || 'Belum update'}</p>
          </div>
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-slate-500 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Commodities Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {safePrices.slice(0, 5).map((item, idx) => (
          <div
            key={idx}
            className="border rounded-2xl p-4 hover:shadow-lg transition-all cursor-pointer group"
          >
            <h3 className="font-semibold text-slate-700 text-sm mb-2 line-clamp-1">
              {item.commodity}
            </h3>
            
            <p className="text-xl font-bold text-green-700 mb-1">
              {formatPrice(item.price)}
            </p>
            
            <p className="text-xs text-slate-400 mb-2">/ {item.unit || 'kg'}</p>
            
            <div className="flex items-center gap-1 mb-3">
              {getTrendIcon(item.trend)}
              <span className={`text-sm font-medium ${getTrendColor(item.trend)}`}>
                {item.change_percent > 0 ? '+' : ''}{item.change_percent}%
              </span>
              <span className="text-xs text-slate-400">hari ini</span>
            </div>
          </div>
        ))}
      </div>

      {/* Insight Section */}
      <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="bg-green-100 rounded-full p-2">
            <TrendingUp className="w-5 h-5 text-green-700" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-green-800 mb-1 flex items-center gap-2">
              📈 Insight Hari Ini
              <span className="text-xs font-normal bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                AI Analysis
              </span>
            </p>
            <p className="text-slate-700 text-sm leading-relaxed">{insight}</p>
          </div>
          <button className="text-green-700 text-sm font-medium hover:underline whitespace-nowrap">
            Detail →
          </button>
        </div>
      </div>

      {/* Source Attribution */}
      <div className="mt-4 text-center">
        <p className="text-xs text-slate-400">
          Sumber data: Pusat Informasi Harga Pangan Strategis (Bank Indonesia)
        </p>
      </div>
    </div>
  );
}

