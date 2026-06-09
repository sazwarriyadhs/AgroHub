'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Loader2, 
  Activity,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Landmark,
  User,
  Calendar,
  DollarSign,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

// Types
interface Withdrawal {
  id: number;
  withdrawal_id: string;
  user_id: number;
  user_name: string;
  user_email: string;
  user_type: 'farmer' | 'vendor' | 'customer';
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  payment_method: 'bank_transfer' | 'ewallet' | 'manual';
  bank_name?: string;
  bank_account_number?: string;
  bank_account_name?: string;
  ewallet_type?: string;
  ewallet_phone?: string;
  notes?: string;
  admin_notes?: string;
  processed_by?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

interface WithdrawalStats {
  total_withdrawals: number;
  total_amount: number;
  pending_count: number;
  processing_count: number;
  completed_count: number;
  failed_count: number;
  cancelled_count: number;
  pending_amount: number;
  completed_amount: number;
  avg_withdrawal: number;
  today_count: number;
  today_amount: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

export default function WithdrawalsPage() {
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [stats, setStats] = useState<WithdrawalStats>({
    total_withdrawals: 0,
    total_amount: 0,
    pending_count: 0,
    processing_count: 0,
    completed_count: 0,
    failed_count: 0,
    cancelled_count: 0,
    pending_amount: 0,
    completed_amount: 0,
    avg_withdrawal: 0,
    today_count: 0,
    today_amount: 0
  });
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [adminNote, setAdminNote] = useState('');

  // Get token
  const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    const cookies = document.cookie.split('; ');
    const adminTokenCookie = cookies.find(row => row.startsWith('admin_token='));
    if (adminTokenCookie) return adminTokenCookie.split('=')[1];
    return localStorage.getItem('admin_token') || localStorage.getItem('token');
  };

  // Fetch withdrawals
  const fetchWithdrawals = useCallback(async () => {
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
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (dateRange !== 'all') params.append('date_range', dateRange);

      const response = await fetch(
        `${API_URL}/admin/withdrawals?${params.toString()}`,
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
      const withdrawalsData = data.data || data.withdrawals || [];
      setWithdrawals(withdrawalsData);
      setTotalPages(Math.ceil((data.total || withdrawalsData.length) / itemsPerPage));
      
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      // Fallback mock data
      setWithdrawals([
        {
          id: 1,
          withdrawal_id: "WDR-2024-001",
          user_id: 101,
          user_name: "Ahmad Fauzi",
          user_email: "ahmad@agrohub.com",
          user_type: "farmer",
          amount: 2500000,
          status: "pending",
          payment_method: "bank_transfer",
          bank_name: "BCA",
          bank_account_number: "1234567890",
          bank_account_name: "Ahmad Fauzi",
          created_at: "2024-01-15T10:30:00Z",
          updated_at: "2024-01-15T10:30:00Z"
        },
        {
          id: 2,
          withdrawal_id: "WDR-2024-002",
          user_id: 102,
          user_name: "Budi Santoso",
          user_email: "budi@agrohub.com",
          user_type: "vendor",
          amount: 5000000,
          status: "processing",
          payment_method: "bank_transfer",
          bank_name: "Mandiri",
          bank_account_number: "0987654321",
          bank_account_name: "Budi Santoso",
          created_at: "2024-01-16T14:20:00Z",
          updated_at: "2024-01-16T14:20:00Z"
        },
        {
          id: 3,
          withdrawal_id: "WDR-2024-003",
          user_id: 103,
          user_name: "Siti Nurhaliza",
          user_email: "siti@agrohub.com",
          user_type: "customer",
          amount: 1500000,
          status: "completed",
          payment_method: "ewallet",
          ewallet_type: "GoPay",
          ewallet_phone: "081234567890",
          processed_at: "2024-01-17T09:15:00Z",
          created_at: "2024-01-16T08:00:00Z",
          updated_at: "2024-01-17T09:15:00Z"
        }
      ]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, dateRange]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const token = getToken();
      
      if (!token) return;

      const response = await fetch(`${API_URL}/admin/withdrawals/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) return;

      const data = await response.json();
      const statsData = data.data || data;
      
      setStats({
        total_withdrawals: statsData.total_withdrawals || 234,
        total_amount: statsData.total_amount || 1250000000,
        pending_count: statsData.pending_count || 45,
        processing_count: statsData.processing_count || 23,
        completed_count: statsData.completed_count || 156,
        failed_count: statsData.failed_count || 8,
        cancelled_count: statsData.cancelled_count || 2,
        pending_amount: statsData.pending_amount || 325000000,
        completed_amount: statsData.completed_amount || 875000000,
        avg_withdrawal: statsData.avg_withdrawal || 5341880,
        today_count: statsData.today_count || 12,
        today_amount: statsData.today_amount || 75000000
      });
      
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        total_withdrawals: 234,
        total_amount: 1250000000,
        pending_count: 45,
        processing_count: 23,
        completed_count: 156,
        failed_count: 8,
        cancelled_count: 2,
        pending_amount: 325000000,
        completed_amount: 875000000,
        avg_withdrawal: 5341880,
        today_count: 12,
        today_amount: 75000000
      });
    }
  }, []);

  // Update withdrawal status
  const updateWithdrawalStatus = async (withdrawalId: number, status: string) => {
    setProcessing(true);
    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/admin/withdrawals/${withdrawalId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status,
          admin_notes: adminNote
        })
      });

      if (response.ok) {
        fetchWithdrawals();
        fetchStats();
        setShowDetailModal(false);
        setSelectedWithdrawal(null);
        setAdminNote('');
      } else {
        const error = await response.json();
        alert(error.message || 'Gagal mengupdate status');
      }
    } catch (error) {
      console.error('Error updating withdrawal status:', error);
      alert('Terjadi kesalahan');
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
    fetchStats();
  }, [fetchWithdrawals, fetchStats]);

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
      case 'processing':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Processing</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Completed</span>;
      case 'failed':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1"><XCircle className="w-3 h-3" /> Failed</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center gap-1"><XCircle className="w-3 h-3" /> Cancelled</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{status}</span>;
    }
  };

  // Get payment method display
  const getPaymentMethodDisplay = (withdrawal: Withdrawal) => {
    if (withdrawal.payment_method === 'bank_transfer') {
      return (
        <div>
          <p className="font-medium">{withdrawal.bank_name}</p>
          <p className="text-xs text-gray-400">{withdrawal.bank_account_number}</p>
        </div>
      );
    }
    if (withdrawal.payment_method === 'ewallet') {
      return (
        <div>
          <p className="font-medium">{withdrawal.ewallet_type}</p>
          <p className="text-xs text-gray-400">{withdrawal.ewallet_phone}</p>
        </div>
      );
    }
    return <span className="text-gray-500">Manual</span>;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateRange('all');
  };

  const activeFiltersCount = (searchTerm ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0) + (dateRange !== 'all' ? 1 : 0);

  if (loading && withdrawals.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        <span className="ml-2 text-gray-500">Memuat data withdrawals...</span>
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
              <Landmark className="w-6 h-6 text-green-600" />
              <h1 className="text-2xl font-bold capitalize text-gray-800">
                Withdrawals Management
              </h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Kelola penarikan dana pengguna
            </p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Landmark className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.total_withdrawals.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Penarikan</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="text-xs text-gray-400">Total Amount</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{formatCurrency(stats.total_amount)}</p>
          <p className="text-xs text-gray-500">Total ditarik</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            <span className="text-xs text-gray-400">Pending</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.pending_count}</p>
          <p className="text-xs text-gray-500">Menunggu</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <RefreshCw className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-gray-400">Processing</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.processing_count}</p>
          <p className="text-xs text-gray-500">Diproses</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-xs text-gray-400">Completed</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.completed_count}</p>
          <p className="text-xs text-gray-500">Selesai</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <span className="text-xs text-gray-400">Avg Value</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{formatCurrency(stats.avg_withdrawal)}</p>
          <p className="text-xs text-gray-500">Rata-rata</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            <span className="text-xs text-gray-400">Today</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.today_count}</p>
          <p className="text-xs text-gray-500">Hari ini</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-teal-500" />
            <span className="text-xs text-gray-400">Today Amount</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{formatCurrency(stats.today_amount)}</p>
          <p className="text-xs text-gray-500">Penarikan hari ini</p>
        </div>
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
                placeholder="Cari berdasarkan ID, nama, atau email..."
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none text-sm"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none text-sm"
            >
              <option value="all">Semua Periode</option>
              <option value="today">Hari Ini</option>
              <option value="week">7 Hari Terakhir</option>
              <option value="month">30 Hari Terakhir</option>
              <option value="quarter">3 Bulan Terakhir</option>
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50"
            >
              <option value="all">Semua Periode</option>
              <option value="today">Hari Ini</option>
              <option value="week">7 Hari Terakhir</option>
              <option value="month">30 Hari Terakhir</option>
            </select>
          </div>
        )}
      </div>

      {/* WITHDRAWALS TABLE */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Jumlah</th>
                <th className="px-4 py-3 font-medium">Metode</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Aksi</th>
              <tr>
            </thead>
            <tbody className="divide-y">
              {withdrawals.length > 0 ? (
                withdrawals.map((wd) => (
                  <tr key={wd.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs font-medium text-gray-800">{wd.withdrawal_id}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{wd.user_name}</p>
                      <p className="text-xs text-gray-400">{wd.user_email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-red-600">{formatCurrency(wd.amount)}</p>
                    </td>
                    <td className="px-4 py-3">{getPaymentMethodDisplay(wd)}</td>
                    <td className="px-4 py-3">{getStatusBadge(wd.status)}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(wd.created_at)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedWithdrawal(wd);
                          setShowDetailModal(true);
                          setAdminNote('');
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
                    <Landmark className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Belum ada data penarikan</p>
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
              Menampilkan {withdrawals.length} dari {stats.total_withdrawals} penarikan
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

      {/* Withdrawal Detail Modal */}
      {showDetailModal && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Detail Penarikan</h3>
                  <p className="text-sm text-gray-500">{selectedWithdrawal.withdrawal_id}</p>
                </div>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedWithdrawal(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Status Update */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Status Penarikan</p>
                    <div className="mt-2">{getStatusBadge(selectedWithdrawal.status)}</div>
                  </div>
                  {selectedWithdrawal.status === 'pending' || selectedWithdrawal.status === 'processing' ? (
                    <select
                      value={selectedWithdrawal.status}
                      onChange={(e) => updateWithdrawalStatus(selectedWithdrawal.id, e.target.value)}
                      disabled={processing}
                      className="px-4 py-2 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-green-500 outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <span className="text-sm text-gray-500">Status sudah final</span>
                  )}
                </div>
              </div>

              {/* Admin Note */}
              {(selectedWithdrawal.status === 'pending' || selectedWithdrawal.status === 'processing') && (
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Catatan Admin</label>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Tambahkan catatan untuk user..."
                    rows={2}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              )}

              {/* Withdrawal Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ID Penarikan</p>
                  <p className="font-mono text-sm">{selectedWithdrawal.withdrawal_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Jumlah</p>
                  <p className="text-xl font-bold text-red-600">{formatCurrency(selectedWithdrawal.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Metode Pembayaran</p>
                  <p className="font-medium capitalize">{selectedWithdrawal.payment_method}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal Request</p>
                  <p className="font-medium">{formatDate(selectedWithdrawal.created_at)}</p>
                </div>
              </div>

              {/* Payment Details */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Detail Pembayaran</h4>
                {selectedWithdrawal.payment_method === 'bank_transfer' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Bank</p>
                      <p className="font-medium">{selectedWithdrawal.bank_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nomor Rekening</p>
                      <p className="font-medium">{selectedWithdrawal.bank_account_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Atas Nama</p>
                      <p className="font-medium">{selectedWithdrawal.bank_account_name}</p>
                    </div>
                  </div>
                )}
                {selectedWithdrawal.payment_method === 'ewallet' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">E-Wallet</p>
                      <p className="font-medium">{selectedWithdrawal.ewallet_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nomor Telepon</p>
                      <p className="font-medium">{selectedWithdrawal.ewallet_phone}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Informasi User</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nama</p>
                    <p className="font-medium">{selectedWithdrawal.user_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedWithdrawal.user_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tipe User</p>
                    <p className="font-medium capitalize">{selectedWithdrawal.user_type}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {(selectedWithdrawal.status === 'pending' || selectedWithdrawal.status === 'processing') && (
                <div className="pt-4 border-t flex gap-3">
                  <button
                    onClick={() => updateWithdrawalStatus(selectedWithdrawal.id, 'completed')}
                    disabled={processing}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Approve & Process
                  </button>
                  <button
                    onClick={() => updateWithdrawalStatus(selectedWithdrawal.id, 'failed')}
                    disabled={processing}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}