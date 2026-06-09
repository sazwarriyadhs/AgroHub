'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Loader2, 
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Download,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  ChartLine,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';

// Types
interface CommodityPrice {
  id: number;
  commodity_id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  previous_price: number;
  change_percent: number;
  region: string;
  market: string;
  date: string;
  source: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface CommodityStats {
  total_commodities: number;
  total_regions: number;
  avg_price: number;
  highest_price: {
    name: string;
    price: number;
  };
  lowest_price: {
    name: string;
    price: number;
  };
  top_increase: {
    name: string;
    change: number;
  };
  top_decrease: {
    name: string;
    change: number;
  };
}

interface PriceHistory {
  date: string;
  rice: number;
  corn: number;
  chili: number;
  shallot: number;
  garlic: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

// Commodity categories
const categories = [
  'Semua Kategori',
  'Beras',
  'Jagung',
  'Cabai',
  'Bawang Merah',
  'Bawang Putih',
  'Kedelai',
  'Gula',
  'Minyak Goreng',
  'Daging Ayam',
  'Daging Sapi',
  'Telur'
];

// Regions
const regions = [
  'Semua Region',
  'Nasional',
  'Jawa Barat',
  'Jawa Tengah',
  'Jawa Timur',
  'DKI Jakarta',
  'Sumatera Utara',
  'Sumatera Selatan',
  'Kalimantan Timur',
  'Sulawesi Selatan',
  'Bali',
  'NTB',
  'NTT'
];

export default function CommodityPricesPage() {
  const [loading, setLoading] = useState(true);
  const [commodities, setCommodities] = useState<CommodityPrice[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [stats, setStats] = useState<CommodityStats>({
    total_commodities: 0,
    total_regions: 0,
    avg_price: 0,
    highest_price: { name: '', price: 0 },
    lowest_price: { name: '', price: 0 },
    top_increase: { name: '', change: 0 },
    top_decrease: { name: '', change: 0 }
  });
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua Kategori');
  const [regionFilter, setRegionFilter] = useState('Semua Region');
  const [dateRange, setDateRange] = useState('week');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [selectedCommodity, setSelectedCommodity] = useState<CommodityPrice | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 0,
    region: 'Nasional',
    market: '',
    unit: 'kg',
    notes: ''
  });

  // Get token
  const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    const cookies = document.cookie.split('; ');
    const adminTokenCookie = cookies.find(row => row.startsWith('admin_token='));
    if (adminTokenCookie) return adminTokenCookie.split('=')[1];
    return localStorage.getItem('admin_token') || localStorage.getItem('token');
  };

  // Fetch commodities
  const fetchCommodities = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());
      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter !== 'Semua Kategori') params.append('category', categoryFilter);
      if (regionFilter !== 'Semua Region') params.append('region', regionFilter);
      if (dateRange !== 'all') params.append('range', dateRange);

      const response = await fetch(
        `${API_URL}/admin/commodity-prices?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const commoditiesData = data.data || data.commodities || [];
      setCommodities(commoditiesData);
      setTotalPages(Math.ceil((data.total || commoditiesData.length) / itemsPerPage));
      
    } catch (error) {
      console.error('Error fetching commodities:', error);
      // Fallback mock data
      setCommodities([
        {
          id: 1,
          commodity_id: "CMD-001",
          name: "Beras Premium",
          category: "Beras",
          unit: "kg",
          price: 14500,
          previous_price: 14200,
          change_percent: 2.11,
          region: "Jawa Barat",
          market: "Pasar Induk Cipinang",
          date: "2024-01-15",
          source: "Kementerian Perdagangan",
          created_at: "2024-01-15T00:00:00Z",
          updated_at: "2024-01-15T00:00:00Z"
        },
        {
          id: 2,
          commodity_id: "CMD-002",
          name: "Jagung Pipilan",
          category: "Jagung",
          unit: "kg",
          price: 5800,
          previous_price: 5600,
          change_percent: 3.57,
          region: "Jawa Timur",
          market: "Pasar Induk Surabaya",
          date: "2024-01-15",
          source: "Kementerian Perdagangan",
          created_at: "2024-01-15T00:00:00Z",
          updated_at: "2024-01-15T00:00:00Z"
        },
        {
          id: 3,
          commodity_id: "CMD-003",
          name: "Cabai Merah Keriting",
          category: "Cabai",
          unit: "kg",
          price: 48500,
          previous_price: 52000,
          change_percent: -6.73,
          region: "Jawa Tengah",
          market: "Pasar Induk Semarang",
          date: "2024-01-15",
          source: "Kementerian Perdagangan",
          created_at: "2024-01-15T00:00:00Z",
          updated_at: "2024-01-15T00:00:00Z"
        }
      ]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, categoryFilter, regionFilter, dateRange]);

  // Fetch price history
  const fetchPriceHistory = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const params = new URLSearchParams();
      params.append('range', dateRange);

      const response = await fetch(`${API_URL}/admin/commodity-prices/history?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) return;

      const data = await response.json();
      const historyData = data.data || data.history || [];
      setPriceHistory(historyData.length > 0 ? historyData : [
        { date: '01/05', rice: 14200, corn: 5600, chili: 52000, shallot: 36000, garlic: 32000 },
        { date: '02/05', rice: 14300, corn: 5650, chili: 51000, shallot: 35500, garlic: 31500 },
        { date: '03/05', rice: 14400, corn: 5700, chili: 50000, shallot: 35000, garlic: 31000 },
        { date: '04/05', rice: 14450, corn: 5750, chili: 49500, shallot: 34500, garlic: 30800 },
        { date: '05/05', rice: 14500, corn: 5780, chili: 49000, shallot: 34000, garlic: 30500 },
        { date: '06/05', rice: 14500, corn: 5800, chili: 48800, shallot: 33800, garlic: 30300 },
        { date: '07/05', rice: 14500, corn: 5800, chili: 48500, shallot: 33800, garlic: 30000 }
      ]);
      
    } catch (error) {
      console.error('Error fetching price history:', error);
      setPriceHistory([
        { date: '01/05', rice: 14200, corn: 5600, chili: 52000, shallot: 36000, garlic: 32000 },
        { date: '02/05', rice: 14300, corn: 5650, chili: 51000, shallot: 35500, garlic: 31500 },
        { date: '03/05', rice: 14400, corn: 5700, chili: 50000, shallot: 35000, garlic: 31000 },
        { date: '04/05', rice: 14450, corn: 5750, chili: 49500, shallot: 34500, garlic: 30800 },
        { date: '05/05', rice: 14500, corn: 5780, chili: 49000, shallot: 34000, garlic: 30500 },
        { date: '06/05', rice: 14500, corn: 5800, chili: 48800, shallot: 33800, garlic: 30300 },
        { date: '07/05', rice: 14500, corn: 5800, chili: 48500, shallot: 33800, garlic: 30000 }
      ]);
    }
  }, [dateRange]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/admin/commodity-prices/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) return;

      const data = await response.json();
      const statsData = data.data || data;
      
      setStats({
        total_commodities: statsData.total_commodities || 24,
        total_regions: statsData.total_regions || 12,
        avg_price: statsData.avg_price || 24500,
        highest_price: statsData.highest_price || { name: 'Cabai Merah', price: 48500 },
        lowest_price: statsData.lowest_price || { name: 'Jagung', price: 5800 },
        top_increase: statsData.top_increase || { name: 'Bawang Putih', change: 8.5 },
        top_decrease: statsData.top_decrease || { name: 'Cabai Merah', change: -6.7 }
      });
      
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        total_commodities: 24,
        total_regions: 12,
        avg_price: 24500,
        highest_price: { name: 'Cabai Merah', price: 48500 },
        lowest_price: { name: 'Jagung', price: 5800 },
        top_increase: { name: 'Bawang Putih', change: 8.5 },
        top_decrease: { name: 'Cabai Merah', change: -6.7 }
      });
    }
  }, []);

  // Create commodity
  const createCommodity = async () => {
    setProcessing(true);
    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/admin/commodity-prices`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchCommodities();
        fetchStats();
        setShowEditModal(false);
        setFormData({
          name: '',
          category: '',
          price: 0,
          region: 'Nasional',
          market: '',
          unit: 'kg',
          notes: ''
        });
      } else {
        const error = await response.json();
        alert(error.message || 'Gagal menambah data');
      }
    } catch (error) {
      console.error('Error creating commodity:', error);
      alert('Terjadi kesalahan');
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchCommodities();
    fetchStats();
    fetchPriceHistory();
  }, [fetchCommodities, fetchStats, fetchPriceHistory]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get change color and icon
  const getChangeDisplay = (change: number) => {
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {Math.abs(change).toFixed(2)}%
      </span>
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('Semua Kategori');
    setRegionFilter('Semua Region');
    setDateRange('week');
  };

  const activeFiltersCount = (searchTerm ? 1 : 0) + (categoryFilter !== 'Semua Kategori' ? 1 : 0) + (regionFilter !== 'Semua Region' ? 1 : 0);

  if (loading && commodities.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        <span className="ml-2 text-gray-500">Memuat data harga komoditas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ChartLine className="w-6 h-6 text-green-600" />
              <h1 className="text-2xl font-bold capitalize text-gray-800">
                Commodity Prices
              </h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Pantau harga komoditas pertanian secara real-time
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Price
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <ChartLine className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.total_commodities}</p>
          <p className="text-xs text-gray-500">Komoditas</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="text-xs text-gray-400">Avg Price</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{formatCurrency(stats.avg_price)}</p>
          <p className="text-xs text-gray-500">Rata-rata harga</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-red-500" />
            <span className="text-xs text-gray-400">Highest</span>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800">{formatCurrency(stats.highest_price.price)}</p>
            <p className="text-xs text-gray-500">{stats.highest_price.name}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-5 h-5 text-green-600" />
            <span className="text-xs text-gray-400">Lowest</span>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800">{formatCurrency(stats.lowest_price.price)}</p>
            <p className="text-xs text-gray-500">{stats.lowest_price.name}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-xs text-gray-400">Top Increase</span>
          </div>
          <div>
            <p className="text-lg font-bold text-green-600">+{stats.top_increase.change}%</p>
            <p className="text-xs text-gray-500">{stats.top_increase.name}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <span className="text-xs text-gray-400">Top Decrease</span>
          </div>
          <div>
            <p className="text-lg font-bold text-red-600">{stats.top_decrease.change}%</p>
            <p className="text-xs text-gray-500">{stats.top_decrease.name}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <RefreshCw className="w-5 h-5 text-purple-500" />
            <span className="text-xs text-gray-400">Regions</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.total_regions}</p>
          <p className="text-xs text-gray-500">Wilayah</p>
        </div>
      </div>

      {/* PRICE TREND CHART */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <ChartLine className="w-5 h-5 text-green-600" />
              Harga Komoditas (Rp/kg)
            </h3>
            <p className="text-sm text-gray-500">Trend harga 7 hari terakhir</p>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none text-sm"
          >
            <option value="week">7 Hari Terakhir</option>
            <option value="month">30 Hari Terakhir</option>
            <option value="quarter">3 Bulan Terakhir</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={priceHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" tickFormatter={(v) => `Rp${v.toLocaleString()}`} />
            <Tooltip formatter={(value) => `Rp${value.toLocaleString()}`} />
            <Legend />
            <Line type="monotone" dataKey="rice" name="Beras" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="corn" name="Jagung" stroke="#eab308" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="chili" name="Cabai" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="shallot" name="Bawang Merah" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="garlic" name="Bawang Putih" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari komoditas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-xl"
          >
            <Filter className="w-4 h-4" />
            Filter
            {activeFiltersCount > 0 && (
              <span className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none text-sm"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none text-sm"
            >
              {regions.map(reg => (
                <option key={reg} value={reg}>{reg}</option>
              ))}
            </select>
          </div>

          {/* Reset Filter */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 transition"
            >
              <X className="w-4 h-4" />
              Reset ({activeFiltersCount})
            </button>
          )}
        </div>

        {/* Mobile Filters Drawer */}
        {showFilters && (
          <div className="lg:hidden mt-4 pt-4 border-t space-y-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50"
            >
              {regions.map(reg => (
                <option key={reg} value={reg}>{reg}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* COMMODITIES TABLE */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Komoditas</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Harga</th>
                <th className="px-4 py-3 font-medium">Perubahan</th>
                <th className="px-4 py-3 font-medium">Region</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {commodities.length > 0 ? (
                commodities.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400">/{item.unit}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-green-600">{formatCurrency(item.price)}</p>
                    </td>
                    <td className="px-4 py-3">{getChangeDisplay(item.change_percent)}</td>
                    <td className="px-4 py-3">{item.region}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(item.date)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedCommodity(item);
                          setShowDetailModal(true);
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4 text-blue-500" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    <ChartLine className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Belum ada data harga komoditas</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t flex justify-between items-center flex-wrap gap-2 bg-gray-50">
            <p className="text-xs text-gray-500">
              Menampilkan {commodities.length} dari {stats.total_commodities} komoditas
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-lg text-xs disabled:opacity-40 hover:bg-white transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg text-xs transition ${
                      currentPage === page
                        ? 'bg-green-600 text-white'
                        : 'border hover:bg-white'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              {totalPages > 5 && <span className="px-2 text-gray-400">...</span>}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-lg text-xs disabled:opacity-40 hover:bg-white transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Commodity Detail Modal */}
      {showDetailModal && selectedCommodity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{selectedCommodity.name}</h3>
                  <p className="text-sm text-gray-500">{selectedCommodity.commodity_id}</p>
                </div>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedCommodity(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Kategori</p>
                  <p className="font-medium">{selectedCommodity.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Satuan</p>
                  <p className="font-medium">{selectedCommodity.unit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Harga Saat Ini</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedCommodity.price)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Perubahan</p>
                  <div className="mt-1">{getChangeDisplay(selectedCommodity.change_percent)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Harga Sebelumnya</p>
                  <p className="font-medium">{formatCurrency(selectedCommodity.previous_price)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Region</p>
                  <p className="font-medium">{selectedCommodity.region}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pasar</p>
                  <p className="font-medium">{selectedCommodity.market}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal Update</p>
                  <p className="font-medium">{formatDate(selectedCommodity.date)}</p>
                </div>
              </div>

              {selectedCommodity.notes && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Catatan</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-xl">{selectedCommodity.notes}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Informasi Sumber</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Sumber Data</p>
                    <p className="font-medium">{selectedCommodity.source}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Terakhir Update</p>
                    <p className="font-medium">{formatDate(selectedCommodity.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Commodity Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Tambah Harga Komoditas</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Nama Komoditas</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 rounded-xl border border-gray-200"
                  >
                    {categories.filter(c => c !== 'Semua Kategori').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Harga (Rp)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Satuan</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full p-2 rounded-xl border border-gray-200"
                  >
                    <option value="kg">kg</option>
                    <option value="liter">liter</option>
                    <option value="butir">butir</option>
                    <option value="ekor">ekor</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Region</label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full p-2 rounded-xl border border-gray-200"
                  >
                    {regions.filter(r => r !== 'Semua Region').map(reg => (
                      <option key={reg} value={reg}>{reg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Pasar</label>
                  <input
                    type="text"
                    value={formData.market}
                    onChange={(e) => setFormData({ ...formData, market: e.target.value })}
                    className="w-full p-2 rounded-xl border border-gray-200"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Catatan (Opsional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full p-2 rounded-xl border border-gray-200"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border rounded-xl hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  onClick={createCommodity}
                  disabled={processing || !formData.name || !formData.price}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50"
                >
                  {processing ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null}
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}