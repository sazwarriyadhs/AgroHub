'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Loader2, 
  Shield,
  Search,
  Filter,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  Lock,
  Unlock,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
  Send,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

// Types
interface Escrow {
  id: number;
  escrow_id: string;
  order_id: number;
  order_number: string;
  buyer_id: number;
  buyer_name: string;
  buyer_email: string;
  seller_id: number;
  seller_name: string;
  seller_email: string;
  amount: number;
  status: 'pending' | 'locked' | 'released' | 'disputed' | 'cancelled' | 'refunded';
  payment_method: string;
  release_conditions?: string;
  release_date?: string;
  disputed_at?: string;
  resolved_at?: string;
  resolution_notes?: string;
  released_at?: string;
  released_by?: string;
  created_at: string;
  updated_at: string;
}

interface EscrowStats {
  total_escrows: number;
  total_amount: number;
  pending_count: number;
  locked_count: number;
  released_count: number;
  disputed_count: number;
  cancelled_count: number;
  refunded_count: number;
  pending_amount: number;
  locked_amount: number;
  released_amount: number;
  avg_escrow_value: number;
  today_count: number;
  today_amount: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

export default function EscrowPage() {
  const [loading, setLoading] = useState(true);
  const [escrows, setEscrows] = useState<Escrow[]>([]);
  const [stats, setStats] = useState<EscrowStats>({
    total_escrows: 0,
    total_amount: 0,
    pending_count: 0,
    locked_count: 0,
    released_count: 0,
    disputed_count: 0,
    cancelled_count: 0,
    refunded_count: 0,
    pending_amount: 0,
    locked_amount: 0,
    released_amount: 0,
    avg_escrow_value: 0,
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
  const [selectedEscrow, setSelectedEscrow] = useState<Escrow | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [releaseNote, setReleaseNote] = useState('');

  // Get token
  const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    const cookies = document.cookie.split('; ');
    const adminTokenCookie = cookies.find(row => row.startsWith('admin_token='));
    if (adminTokenCookie) return adminTokenCookie.split('=')[1];
    return localStorage.getItem('admin_token') || localStorage.getItem('token');
  };

  // Fetch escrows
  const fetchEscrows = useCallback(async () => {
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
        `${API_URL}/admin/escrow?${params.toString()}`,
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
      const escrowsData = data.data || data.escrows || [];
      setEscrows(escrowsData);
      setTotalPages(Math.ceil((data.total || escrowsData.length) / itemsPerPage));
      
    } catch (error) {
      console.error('Error fetching escrows:', error);
      // Fallback mock data
      setEscrows([
        {
          id: 1,
          escrow_id: "ESC-2024-001",
          order_id: 1001,
          order_number: "ORD-2024-001",
          buyer_id: 101,
          buyer_name: "Ahmad Fauzi",
          buyer_email: "ahmad@agrohub.com",
          seller_id: 201,
          seller_name: "Tani Makmur Store",
          seller_email: "tanimakmur@agrohub.com",
          amount: 2500000,
          status: "locked",
          payment_method: "Bank Transfer",
          created_at: "2024-01-15T10:30:00Z",
          updated_at: "2024-01-15T10:30:00Z"
        },
        {
          id: 2,
          escrow_id: "ESC-2024-002",
          order_id: 1002,
          order_number: "ORD-2024-002",
          buyer_id: 102,
          buyer_name: "Budi Santoso",
          buyer_email: "budi@agrohub.com",
          seller_id: 202,
          seller_name: "Agro Nusantara",
          seller_email: "agro@agrohub.com",
          amount: 5000000,
          status: "pending",
          payment_method: "Bank Transfer",
          created_at: "2024-01-16T14:20:00Z",
          updated_at: "2024-01-16T14:20:00Z"
        },
        {
          id: 3,
          escrow_id: "ESC-2024-003",
          order_id: 1003,
          order_number: "ORD-2024-003",
          buyer_id: 103,
          buyer_name: "Siti Nurhaliza",
          buyer_email: "siti@agrohub.com",
          seller_id: 203,
          seller_name: "Green Farm Official",
          seller_email: "green@agrohub.com",
          amount: 1500000,
          status: "disputed",
          payment_method: "Wallet",
          created_at: "2024-01-14T09:00:00Z",
          updated_at: "2024-01-16T11:30:00Z"
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

      const response = await fetch(`${API_URL}/admin/escrow/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) return;

      const data = await response.json();
      const statsData = data.data || data;
      
      setStats({
        total_escrows: statsData.total_escrows || 234,
        total_amount: statsData.total_amount || 1250000000,
        pending_count: statsData.pending_count || 23,
        locked_count: statsData.locked_count || 89,
        released_count: statsData.released_count || 112,
        disputed_count: statsData.disputed_count || 8,
        cancelled_count: statsData.cancelled_count || 2,
        refunded_count: statsData.refunded_count || 0,
        pending_amount: statsData.pending_amount || 125000000,
        locked_amount: statsData.locked_amount || 325000000,
        released_amount: statsData.released_amount || 800000000,
        avg_escrow_value: statsData.avg_escrow_value || 5341880,
        today_count: statsData.today_count || 5,
        today_amount: statsData.today_amount || 25000000
      });
      
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        total_escrows: 234,
        total_amount: 1250000000,
        pending_count: 23,
        locked_count: 89,
        released_count: 112,
        disputed_count: 8,
        cancelled_count: 2,
        refunded_count: 0,
        pending_amount: 125000000,
        locked_amount: 325000000,
        released_amount: 800000000,
        avg_escrow_value: 5341880,
        today_count: 5,
        today_amount: 25000000
      });
    }
  }, []);

  // Update escrow status
  const updateEscrowStatus = async (escrowId: number, status: string) => {
    setProcessing(true);
    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/admin/escrow/${escrowId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status,
          notes: releaseNote
        })
      });

      if (response.ok) {
        fetchEscrows();
        fetchStats();
        setShowDetailModal(false);
        setSelectedEscrow(null);
        setReleaseNote('');
      } else {
        const error = await response.json();
        alert(error.message || 'Gagal mengupdate status');
      }
    } catch (error) {
      console.error('Error updating escrow status:', error);
      alert('Terjadi kesalahan');
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchEscrows();
    fetchStats();
  }, [fetchEscrows, fetchStats]);

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
      case 'locked':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</span>;
      case 'released':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1"><Unlock className="w-3 h-3" /> Released</span>;
      case 'disputed':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Disputed</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center gap-1"><XCircle className="w-3 h-3" /> Cancelled</span>;
      case 'refunded':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Refunded</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{status}</span>;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateRange('all');
  };

  const activeFiltersCount = (searchTerm ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0) + (dateRange !== 'all' ? 1 : 0);

  if (loading && escrows.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        <span className="ml-2 text-gray-500">Memuat data escrow...</span>
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
              <Shield className="w-6 h-6 text-green-600" />
              <h1 className="text-2xl font-bold capitalize text-gray-800">
                Escrow Management
              </h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Kelola dana escrow dan proteksi transaksi
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
            <Shield className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.total_escrows.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Escrow</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="text-xs text-gray-400">Total Amount</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{formatCurrency(stats.total_amount)}</p>
          <p className="text-xs text-gray-500">Total dana</p>
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
            <Lock className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-gray-400">Locked</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.locked_count}</p>
          <p className="text-xs text-gray-500">Dikunci</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Unlock className="w-5 h-5 text-green-500" />
            <span className="text-xs text-gray-400">Released</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.released_count}</p>
          <p className="text-xs text-gray-500">Dirilis</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-xs text-gray-400">Disputed</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.disputed_count}</p>
          <p className="text-xs text-gray-500">Dispute</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <span className="text-xs text-gray-400">Avg Value</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{formatCurrency(stats.avg_escrow_value)}</p>
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
                placeholder="Cari berdasarkan ID escrow, order, atau user..."
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
              <option value="locked">Locked</option>
              <option value="released">Released</option>
              <option value="disputed">Disputed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
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
              <option value="locked">Locked</option>
              <option value="released">Released</option>
              <option value="disputed">Disputed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
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

      {/* ESCROW TABLE */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-medium">ID Escrow</th>
                <th className="px-4 py-3 font-medium">Buyer</th>
                <th className="px-4 py-3 font-medium">Seller</th>
                <th className="px-4 py-3 font-medium">Jumlah</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {escrows.length > 0 ? (
                escrows.map((escrow) => (
                  <tr key={escrow.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs font-medium text-gray-800">{escrow.escrow_id}</p>
                      <p className="text-xs text-gray-400">Order: {escrow.order_number}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{escrow.buyer_name}</p>
                      <p className="text-xs text-gray-400">{escrow.buyer_email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{escrow.seller_name}</p>
                      <p className="text-xs text-gray-400">{escrow.seller_email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-blue-600">{formatCurrency(escrow.amount)}</p>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(escrow.status)}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(escrow.created_at)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedEscrow(escrow);
                          setShowDetailModal(true);
                          setReleaseNote('');
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
                    <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Belum ada data escrow</p>
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
              Menampilkan {escrows.length} dari {stats.total_escrows} escrow
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

      {/* Escrow Detail Modal */}
      {showDetailModal && selectedEscrow && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Detail Escrow</h3>
                  <p className="text-sm text-gray-500">{selectedEscrow.escrow_id}</p>
                </div>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedEscrow(null);
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
                    <p className="text-sm text-gray-500">Status Escrow</p>
                    <div className="mt-2">{getStatusBadge(selectedEscrow.status)}</div>
                  </div>
                  {(selectedEscrow.status === 'pending' || selectedEscrow.status === 'locked') && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateEscrowStatus(selectedEscrow.id, 'released')}
                        disabled={processing}
                        className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
                      >
                        {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
                        Release
                      </button>
                      {selectedEscrow.status === 'pending' && (
                        <button
                          onClick={() => updateEscrowStatus(selectedEscrow.id, 'cancelled')}
                          disabled={processing}
                          className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Release Note */}
              {(selectedEscrow.status === 'pending' || selectedEscrow.status === 'locked') && (
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Catatan Release (Opsional)</label>
                  <textarea
                    value={releaseNote}
                    onChange={(e) => setReleaseNote(e.target.value)}
                    placeholder="Tambahkan catatan untuk release escrow..."
                    rows={2}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              )}

              {/* Escrow Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ID Escrow</p>
                  <p className="font-mono text-sm">{selectedEscrow.escrow_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium">{selectedEscrow.order_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Jumlah</p>
                  <p className="text-xl font-bold text-blue-600">{formatCurrency(selectedEscrow.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Metode Pembayaran</p>
                  <p className="font-medium">{selectedEscrow.payment_method}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal Dibuat</p>
                  <p className="font-medium">{formatDate(selectedEscrow.created_at)}</p>
                </div>
                {selectedEscrow.released_at && (
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Release</p>
                    <p className="font-medium">{formatDate(selectedEscrow.released_at)}</p>
                  </div>
                )}
              </div>

              {/* Buyer & Seller Info */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Informasi Transaksi</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <p className="text-sm text-blue-600 font-medium mb-2">Buyer</p>
                    <p className="font-medium">{selectedEscrow.buyer_name}</p>
                    <p className="text-xs text-gray-500">{selectedEscrow.buyer_email}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl">
                    <p className="text-sm text-green-600 font-medium mb-2">Seller</p>
                    <p className="font-medium">{selectedEscrow.seller_name}</p>
                    <p className="text-xs text-gray-500">{selectedEscrow.seller_email}</p>
                  </div>
                </div>
              </div>

              {/* Resolution Info (if disputed) */}
              {selectedEscrow.status === 'disputed' && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Informasi Dispute</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedEscrow.disputed_at && (
                      <div>
                        <p className="text-sm text-gray-500">Tanggal Dispute</p>
                        <p className="font-medium">{formatDate(selectedEscrow.disputed_at)}</p>
                      </div>
                    )}
                    {selectedEscrow.resolution_notes && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Catatan Resolusi</p>
                        <p className="text-sm bg-gray-50 p-2 rounded-lg mt-1">{selectedEscrow.resolution_notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => updateEscrowStatus(selectedEscrow.id, 'released')}
                      disabled={processing}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50"
                    >
                      Release to Seller
                    </button>
                    <button
                      onClick={() => updateEscrowStatus(selectedEscrow.id, 'refunded')}
                      disabled={processing}
                      className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition disabled:opacity-50"
                    >
                      Refund to Buyer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}