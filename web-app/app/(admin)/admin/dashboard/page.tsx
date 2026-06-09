'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import {
  Users,
  Store,
  TrendingUp,
  Landmark,
  Package,
  ShoppingCart,
  DollarSign,
  Lock,
  Activity,
  BarChart3,
  ShoppingBag,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ShieldCheck,
  Boxes,
  Globe2,
  Tractor,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Download,
  RefreshCw,
  Calendar,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingDown,
  MapPin,
  Layers,
  Fish,
  Sprout,
  FlaskRound as Vaccine,
} from 'lucide-react';

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// ================= MAP =================
const MapComponent = dynamic(() => import('@/components/admin/MapComponent'), { ssr: false });

// ================= TYPES =================
interface DashboardStats {
  total_users: number;
  total_stores: number;
  total_products: number;
  total_orders: number;
  gmv: number;
  revenue: number;
  take_rate: number;
  escrow_locked: number;
  pending_withdrawal: number;
  net_margin: number;
  total_wallets: number;
  pending_withdrawals_count: number;
  active_escrows: number;
  monthly_growth: number;
  active_buyers: number;
  total_transactions: number;
  today_gmv: number;
  platform_commission: number;
  total_payout: number;
}

interface DashboardResponse {
  data?: Partial<DashboardStats>;
}

interface MonthlyData {
  month: string;
  revenue: number;
  gmv: number;
  users: number;
  orders: number;
}

interface MonthlyResponse {
  data?: MonthlyData[];
}

interface CategoryData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface VerificationData {
  pending: number;
  review: number;
  verified: number;
}

interface Activity {
  id: string;
  title: string;
  time: string;
  user: string;
  type: 'order' | 'product' | 'seller' | 'transaction' | 'withdrawal';
  amount?: string;
}

interface SystemHealth {
  api: boolean;
  database: boolean;
  redis: boolean;
  queue: boolean;
  ai_service: boolean;
}

// ================= STATIC DATA =================
const CATEGORIES: CategoryData[] = [
  { name: 'Pertanian', value: 9165, percentage: 38.2, color: '#10b981' },
  { name: 'Perikanan', value: 6146, percentage: 25.6, color: '#3b82f6' },
  { name: 'Peternakan', value: 4891, percentage: 20.4, color: '#f59e0b' },
  { name: 'Pupuk & Pakan', value: 2329, percentage: 9.7, color: '#8b5cf6' },
  { name: 'Lainnya', value: 1456, percentage: 6.1, color: '#ef4444' },
];

const VERIFICATION_DATA: VerificationData = {
  pending: 128,
  review: 45,
  verified: 2345,
};

const RECENT_ACTIVITIES: Activity[] = [
  { id: '1', title: 'Order baru #ORD-78291', time: '2 menit lalu', user: 'Budi Santoso', type: 'order', amount: 'Rp 850,000' },
  { id: '2', title: 'Produk baru ditambahkan', time: '15 menit lalu', user: 'Beras Premium 5kg', type: 'product' },
  { id: '3', title: 'Seller baru bergabung', time: '28 menit lalu', user: 'Tani Makmur Store', type: 'seller' },
  { id: '4', title: 'Transaksi berhasil', time: '1 jam lalu', user: '', type: 'transaction', amount: 'Rp 850,000' },
  { id: '5', title: 'Penarikan dana disetujui', time: '2 jam lalu', user: 'Rp 2,500,000', type: 'withdrawal', amount: 'Rp 2,500,000' },
];

const SYSTEM_HEALTH: SystemHealth = {
  api: true,
  database: true,
  redis: true,
  queue: true,
  ai_service: true,
};

// ================= FALLBACK =================
const FALLBACK_STATS: DashboardStats = {
  total_users: 125430,
  total_stores: 8756,
  total_products: 23987,
  total_orders: 45892,
  gmv: 28400000000,
  revenue: 1420000000,
  take_rate: 5,
  escrow_locked: 3750000000,
  pending_withdrawal: 187500000,
  net_margin: 15.5,
  total_wallets: 1200,
  pending_withdrawals_count: 12,
  active_escrows: 89,
  monthly_growth: 12.5,
  active_buyers: 890,
  total_transactions: 78342,
  today_gmv: 2450000000,
  platform_commission: 122500000,
  total_payout: 1985300000,
};

const FALLBACK_MONTHLY: MonthlyData[] = [
  { month: '12 Mei', gmv: 18500000000, revenue: 925000000, users: 1250, orders: 12500 },
  { month: '13 Mei', gmv: 19200000000, revenue: 960000000, users: 1320, orders: 13100 },
  { month: '14 Mei', gmv: 21000000000, revenue: 1050000000, users: 1450, orders: 14200 },
  { month: '15 Mei', gmv: 24500000000, revenue: 1225000000, users: 1580, orders: 15600 },
  { month: '16 Mei', gmv: 26800000000, revenue: 1340000000, users: 1650, orders: 16300 },
  { month: '17 Mei', gmv: 27500000000, revenue: 1375000000, users: 1720, orders: 16900 },
  { month: '18 Mei', gmv: 28400000000, revenue: 1420000000, users: 1790, orders: 17500 },
];

// ================= HELPERS =================
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatShortCurrency = (value: number) => {
  if (value >= 1e9) return `Rp${(value / 1e9).toFixed(1)}M`;
  if (value >= 1e6) return `Rp${(value / 1e6).toFixed(0)}JT`;
  return `Rp${value.toLocaleString()}`;
};

const formatNumber = (value: number) => {
  return value.toLocaleString('id-ID');
};

// ================= DASHBOARD HOOK =================
function useAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(FALLBACK_STATS);
  const [monthly, setMonthly] = useState<MonthlyData[]>(FALLBACK_MONTHLY);
  const [loading, setLoading] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('admin_token') || localStorage.getItem('token') ||
      sessionStorage.getItem('admin_token') || sessionStorage.getItem('token');
  };

  const fetchAll = useCallback(async () => {
    try {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';
      const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

      const [statsRes, monthlyRes] = await Promise.allSettled([
        fetch(`${api}/admin/dashboard`, { headers, signal: controller.signal }),
        fetch(`${api}/admin/dashboard/monthly`, { headers, signal: controller.signal }),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
        const json = await statsRes.value.json();
        if (json?.data) setStats((prev) => ({ ...prev, ...json.data }));
      }
      if (monthlyRes.status === 'fulfilled' && monthlyRes.value.ok) {
        const json = await monthlyRes.value.json();
        if (json?.data?.length) setMonthly(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => {
      clearInterval(interval);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchAll]);

  return { stats, monthly, loading };
}

// ================= MAIN COMPONENT =================
export default function AdminDashboardPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [adminName, setAdminName] = useState('Administrator');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { stats, monthly, loading } = useAdminDashboard();

  // Auth Effect
  useEffect(() => {
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token') ||
      sessionStorage.getItem('admin_token') || sessionStorage.getItem('token');
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setAdminName(parsed.name || parsed.fullname || parsed.full_name || 'Administrator');
      } catch { }
    }
    setAuthChecked(true);
    setIsMounted(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push('/admin/login');
  };

  if (!isMounted || !authChecked || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat Dashboard...</p>
        </div>
      </div>
    );
  }

  // Main KPIs
  const mainKpis = [
    { title: 'Total Users', value: formatNumber(stats.total_users), change: '+12.5%', positive: true, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Total Sellers', value: formatNumber(stats.total_stores), change: '+8.2%', positive: true, icon: Store, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Total Products', value: formatNumber(stats.total_products), change: '+15.3%', positive: true, icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Total Orders', value: formatNumber(stats.total_orders), change: '+18.7%', positive: true, icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Total GMV', value: formatShortCurrency(stats.gmv), change: '+22.4%', positive: true, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Total Transactions', value: formatNumber(stats.total_transactions), change: '+17.6%', positive: true, icon: TrendingUp, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  ];

  // Financial Summary
  const financialCards = [
    { title: 'GMV Hari Ini', value: formatShortCurrency(stats.today_gmv), change: '+24.6%', positive: true, icon: TrendingUp },
    { title: 'Komisi Platform', value: formatShortCurrency(stats.platform_commission), change: '+18.4%', positive: true, icon: DollarSign },
    { title: 'Total Payout', value: formatShortCurrency(stats.total_payout), change: '+16.2%', positive: true, icon: Wallet },
    { title: 'Saldo Escrow', value: formatShortCurrency(stats.escrow_locked), change: '+11.7%', positive: true, icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
  

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        

        {/* Main KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          {mainKpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${kpi.bg}`}>
                    <Icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                  <div className={`flex items-center gap-0.5 text-xs font-medium ${kpi.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {kpi.change}
                  </div>
                </div>
                <p className="text-gray-500 text-xs mb-1">{kpi.title}</p>
                <p className="text-xl font-bold text-gray-800">{kpi.value}</p>
              </div>
            );
          })}
        </div>

        {/* Row 1: Performance Chart & Category Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Performance Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-gray-800">Ringkasan Performa</h3>
                <p className="text-xs text-gray-500">GMV, Orders & Users Baru</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <RefreshCw className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Download className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} tickFormatter={(value) => formatShortCurrency(value)} />
                <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={12} />
                <RechartsTooltip formatter={(value: number) => formatShortCurrency(value)} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="gmv" name="GMV (Rp)" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="users" name="Users Baru" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800">Distribusi Kategori Produk</h3>
                <p className="text-xs text-gray-500">Berdasarkan jumlah produk</p>
              </div>
            </div>
            <div className="space-y-3">
              {CATEGORIES.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{cat.name}</span>
                    <span className="font-medium text-gray-800">{cat.percentage}% ({formatNumber(cat.value)})</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }} />
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-green-600 text-sm font-medium hover:text-green-700 transition">
              Lihat semua kategori →
            </button>
          </div>
        </div>

        {/* Row 2: Verification Status & Financial Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Verification Status */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Status Verifikasi</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-600">Pending</span>
                </div>
                <span className="font-semibold text-gray-800">{VERIFICATION_DATA.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-600">In Review</span>
                </div>
                <span className="font-semibold text-gray-800">{VERIFICATION_DATA.review}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">Verified</span>
                </div>
                <span className="font-semibold text-gray-800">{formatNumber(VERIFICATION_DATA.verified)}</span>
              </div>
            </div>
            <button className="mt-4 text-green-600 text-sm font-medium hover:text-green-700 transition w-full text-center py-2 bg-green-50 rounded-lg">
              Kelola verifikasi →
            </button>
          </div>

          {/* Financial Summary */}
          <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Ringkasan Keuangan</h3>
              <button className="text-green-600 text-sm font-medium hover:text-green-700 transition">
                Lihat detail sistem →
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {financialCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-4 h-4 text-gray-500" />
                      <div className={`flex items-center gap-0.5 text-xs font-medium ${card.positive ? 'text-green-600' : 'text-red-600'}`}>
                        {card.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {card.change}
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs mb-1">{card.title}</p>
                    <p className="text-lg font-bold text-gray-800">{card.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Row 3: System Health & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* System Health */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Sistem Health</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">API Server</span>
                <span className="flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" /> Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Database</span>
                <span className="flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" /> Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Redis Cache</span>
                <span className="flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" /> Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Queue Worker</span>
                <span className="flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" /> Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">AI Service</span>
                <span className="flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" /> Healthy</span>
              </div>
            </div>
            <button className="mt-4 text-green-600 text-sm font-medium hover:text-green-700 transition w-full text-center py-2 bg-gray-50 rounded-lg">
              Lihat detail sistem →
            </button>
          </div>

          {/* Map */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Peta Distribusi Transaksi</h3>
              <p className="text-xs text-gray-500">Sebaran aktivitas transaksi berdasarkan wilayah</p>
            </div>
            <div className="h-[300px] bg-gray-100 relative">
              <MapComponent locations={[]} activeLayer="all" />
              <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-sm p-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-200 rounded" />
                  <span>Rendah</span>
                  <div className="w-3 h-3 bg-green-600 rounded ml-2" />
                  <span>Tinggi</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 4: Recent Activities & AI Insight */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Aktivitas Terbaru</h3>
              <button className="text-green-600 text-sm font-medium hover:text-green-700 transition">
                Lihat semua laporan →
              </button>
            </div>
            <div className="space-y-4">
              {RECENT_ACTIVITIES.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                    <p className="text-xs text-gray-500">oleh {activity.user || '-'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{activity.time}</p>
                    {activity.amount && <p className="text-xs font-medium text-gray-700">{activity.amount}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insight */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 shadow-sm border border-green-100">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-800">AI Insight Hari Ini</h3>
            </div>
            <p className="text-gray-700 text-sm mb-4 leading-relaxed">
              Kategori Pupuk Organik mengalami kenaikan permintaan 32% minggu ini. 
              Pertimbangkan untuk menambah stock dari seller terverifikasi.
            </p>
            <button className="flex items-center gap-2 text-green-600 text-sm font-medium hover:text-green-700 transition">
              Lihat AI Insights
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">© 2025 AgroHub. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}