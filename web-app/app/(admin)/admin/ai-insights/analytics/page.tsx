'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Loader2, 
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingBag,
  DollarSign,
  Package,
  Star,
  Calendar,
  Download,
  Filter,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Award,
  MapPin,
  Zap,
  Brain,
  Target,
  Eye
} from 'lucide-react';
import {
  LineChart as ReLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';

interface AnalyticsStats {
  total_revenue: number;
  total_orders: number;
  total_users: number;
  total_products: number;
  avg_order_value: number;
  conversion_rate: number;
  growth_rate: number;
  active_users: number;
  returning_customers: number;
  top_category: string;
  top_region: string;
}

interface DailyData {
  date: string;
  revenue: number;
  orders: number;
  users: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface RegionData {
  name: string;
  value: number;
  color: string;
}

interface ProductPerformance {
  id: number;
  name: string;
  sales: number;
  revenue: number;
  growth: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

const COLORS = ['#22c55e', '#3b82f6', '#eab308', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AnalyticsStats>({
    total_revenue: 0,
    total_orders: 0,
    total_users: 0,
    total_products: 0,
    avg_order_value: 0,
    conversion_rate: 0,
    growth_rate: 0,
    active_users: 0,
    returning_customers: 0,
    top_category: '',
    top_region: ''
  });
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [topProducts, setTopProducts] = useState<ProductPerformance[]>([]);
  const [dateRange, setDateRange] = useState('30days');
  const [showFilters, setShowFilters] = useState(false);

  const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    const cookies = document.cookie.split('; ');
    const adminTokenCookie = cookies.find(row => row.startsWith('admin_token='));
    if (adminTokenCookie) return adminTokenCookie.split('=')[1];
    return localStorage.getItem('admin_token') || localStorage.getItem('token');
  };

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();
      params.append('range', dateRange);

      const response = await fetch(`${API_URL}/admin/analytics?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const analyticsData = data.data || data;
      
      setStats(analyticsData.stats || {
        total_revenue: 8750000000,
        total_orders: 3450,
        total_users: 1250,
        total_products: 234,
        avg_order_value: 2536231,
        conversion_rate: 3.2,
        growth_rate: 12.5,
        active_users: 890,
        returning_customers: 456,
        top_category: "Alat Pertanian",
        top_region: "Jawa Timur"
      });
      
      setDailyData(analyticsData.daily_data || [
        { date: '01/05', revenue: 125000000, orders: 45, users: 32 },
        { date: '02/05', revenue: 135000000, orders: 48, users: 35 },
        { date: '03/05', revenue: 142000000, orders: 52, users: 38 },
        { date: '04/05', revenue: 138000000, orders: 50, users: 36 },
        { date: '05/05', revenue: 145000000, orders: 55, users: 40 },
        { date: '06/05', revenue: 152000000, orders: 58, users: 42 },
        { date: '07/05', revenue: 148000000, orders: 56, users: 41 },
        { date: '08/05', revenue: 158000000, orders: 60, users: 45 },
        { date: '09/05', revenue: 165000000, orders: 65, users: 48 },
        { date: '10/05', revenue: 172000000, orders: 68, users: 52 },
        { date: '11/05', revenue: 168000000, orders: 66, users: 50 },
        { date: '12/05', revenue: 175000000, orders: 70, users: 55 },
        { date: '13/05', revenue: 182000000, orders: 75, users: 58 },
        { date: '14/05', revenue: 178000000, orders: 72, users: 56 }
      ]);
      
      setCategoryData(analyticsData.category_data || [
        { name: 'Alat Pertanian', value: 35, color: '#22c55e' },
        { name: 'Pupuk & Nutrisi', value: 28, color: '#3b82f6' },
        { name: 'Benih Unggul', value: 20, color: '#eab308' },
        { name: 'Hasil Panen', value: 12, color: '#ef4444' },
        { name: 'Lainnya', value: 5, color: '#8b5cf6' }
      ]);
      
      setRegionData(analyticsData.region_data || [
        { name: 'Jawa Timur', value: 32, color: '#22c55e' },
        { name: 'Jawa Barat', value: 28, color: '#3b82f6' },
        { name: 'Jawa Tengah', value: 18, color: '#eab308' },
        { name: 'DKI Jakarta', value: 12, color: '#ef4444' },
        { name: 'Lainnya', value: 10, color: '#8b5cf6' }
      ]);
      
      setTopProducts(analyticsData.top_products || [
        { id: 1, name: 'Pupuk Organik Premium', sales: 1234, revenue: 222120000, growth: 15 },
        { id: 2, name: 'Sprayer Elektrik', sales: 890, revenue: 578500000, growth: 12 },
        { id: 3, name: 'Benih Padi Unggul', sales: 756, revenue: 90720000, growth: 8 },
        { id: 4, name: 'Sensor Tanah IoT', sales: 543, revenue: 461550000, growth: 25 },
        { id: 5, name: 'Pupuk NPK Premium', sales: 432, revenue: 108000000, growth: 10 }
      ]);
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatCompactNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'revenue' ? formatCurrency(entry.value) : entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        <span className="ml-2 text-gray-500">Memuat data analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-green-600" />
              <h1 className="text-2xl font-bold capitalize text-gray-800">
                AI Analytics Dashboard
              </h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Analisis data platform dengan wawasan AI
            </p>
          </div>
          <div className="flex gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none text-sm"
            >
              <option value="7days">7 Hari Terakhir</option>
              <option value="30days">30 Hari Terakhir</option>
              <option value="90days">3 Bulan Terakhir</option>
              <option value="365days">1 Tahun Terakhir</option>
            </select>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="text-xs text-gray-400">Revenue</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{formatCompactNumber(stats.total_revenue)}</p>
          <p className="text-xs text-gray-500">Total pendapatan</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <ShoppingBag className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-gray-400">Orders</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{formatNumber(stats.total_orders)}</p>
          <p className="text-xs text-gray-500">Total pesanan</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-purple-500" />
            <span className="text-xs text-gray-400">Users</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{formatNumber(stats.total_users)}</p>
          <p className="text-xs text-gray-500">Total user</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-5 h-5 text-orange-500" />
            <span className="text-xs text-gray-400">Products</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{formatNumber(stats.total_products)}</p>
          <p className="text-xs text-gray-500">Total produk</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-xs text-gray-400">AOV</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{formatCompactNumber(stats.avg_order_value)}</p>
          <p className="text-xs text-gray-500">Rata-rata order</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="text-xs text-gray-400">Conversion</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.conversion_rate}%</p>
          <p className="text-xs text-gray-500">Konversi</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-cyan-500" />
            <span className="text-xs text-gray-400">Growth</span>
          </div>
          <p className="text-2xl font-bold text-green-600">+{stats.growth_rate}%</p>
          <p className="text-xs text-gray-500">Pertumbuhan</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-indigo-500" />
            <span className="text-xs text-gray-400">Active</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{formatNumber(stats.active_users)}</p>
          <p className="text-xs text-gray-500">User aktif</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-green-600" />
              Revenue & Orders Trend
            </h3>
            <p className="text-sm text-gray-500">Performa harian platform</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={dailyData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis yAxisId="left" tickFormatter={formatCompactNumber} stroke="#9ca3af" />
            <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#22c55e" fill="url(#revenueGradient)" />
            <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-green-600" />
            Kategori Populer
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </RePieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-green-600" />
            Sebaran Regional
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {regionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-green-600" />
          User Growth Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={dailyData}>
            <defs>
              <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area type="monotone" dataKey="users" name="New Users" stroke="#22c55e" fill="url(#userGradient)" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">👥 Active Users: {formatNumber(stats.active_users)}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">🔄 Returning: {formatNumber(stats.returning_customers)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-5 border-b bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-800">Top Performing Products</h3>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Sales</th>
                <th className="px-4 py-3 font-medium">Revenue</th>
                <th className="px-4 py-3 font-medium">Growth</th>
                <th className="px-4 py-3 font-medium">Aksi</th>
               </tr>
            </thead>
            <tbody className="divide-y">
              {topProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{product.name}</p>
                   </td>
                  <td className="px-4 py-3">{formatNumber(product.sales)}</td>
                  <td className="px-4 py-3 font-semibold text-green-600">{formatCompactNumber(product.revenue)}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-green-600">
                      <ArrowUpRight className="w-3 h-3" />
                      +{product.growth}%
                    </span>
                   </td>
                  <td className="px-4 py-3">
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                      <Eye className="w-4 h-4 text-blue-500" />
                    </button>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Brain className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">AI Insights Summary</h3>
            <p className="text-gray-600 text-sm">
              📈 Pertumbuhan revenue meningkat {stats.growth_rate}% dibanding periode sebelumnya.
              Kategori <strong>{stats.top_category}</strong> menjadi kontributor terbesar dengan {categoryData.find(c => c.name === stats.top_category)?.value || 35}% dari total penjualan.
              Region <strong>{stats.top_region}</strong> memiliki potensi pengembangan tertinggi.
            </p>
            <p className="text-gray-600 text-sm mt-2">
              🎯 Rekomendasi: Fokuskan promosi pada produk kategori {stats.top_category} 
              dan tingkatkan akuisisi user di region {stats.top_region}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}