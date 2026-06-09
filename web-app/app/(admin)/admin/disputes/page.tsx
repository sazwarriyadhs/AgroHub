'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Loader2, 
  Scale,
  Search,
  Filter,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  User,
  Store,
  DollarSign,
  Calendar,
  Download,
  Send,
  Flag,
  Gavel
} from 'lucide-react';
import Link from 'next/link';

// Types
interface Dispute {
  id: number;
  dispute_id: string;
  order_id: number;
  order_number: string;
  escrow_id: number;
  escrow_id_display: string;
  buyer_id: number;
  buyer_name: string;
  buyer_email: string;
  seller_id: number;
  seller_name: string;
  seller_email: string;
  amount: number;
  reason: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'rejected' | 'closed';
  resolution?: 'buyer_won' | 'seller_won' | 'partial_refund' | 'cancelled';
  partial_amount?: number;
  notes?: string;
  admin_notes?: string;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

interface DisputeStats {
  total_disputes: number;
  total_amount: number;
  pending_count: number;
  investigating_count: number;
  resolved_count: number;
  rejected_count: number;
  closed_count: number;
  buyer_won_count: number;
  seller_won_count: number;
  pending_amount: number;
  resolved_amount: number;
  avg_resolution_time: number;
  today_count: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

export default function DisputesPage() {
  const [loading, setLoading] = useState(true);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [stats, setStats] = useState<DisputeStats>({
    total_disputes: 0,
    total_amount: 0,
    pending_count: 0,
    investigating_count: 0,
    resolved_count: 0,
    rejected_count: 0,
    closed_count: 0,
    buyer_won_count: 0,
    seller_won_count: 0,
    pending_amount: 0,
    resolved_amount: 0,
    avg_resolution_time: 0,
    today_count: 0
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
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');
  const [resolutionAction, setResolutionAction] = useState<'buyer_won' | 'seller_won' | 'partial_refund' | 'cancelled'>('buyer_won');
  const [partialAmount, setPartialAmount] = useState('');

  // Get token
  const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    const cookies = document.cookie.split('; ');
    const adminTokenCookie = cookies.find(row => row.startsWith('admin_token='));
    if (adminTokenCookie) return adminTokenCookie.split('=')[1];
    return localStorage.getItem('admin_token') || localStorage.getItem('token');
  };

  // Fetch disputes
  const fetchDisputes = useCallback(async () => {
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
        `${API_URL}/admin/disputes?${params.toString()}`,
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
      const disputesData = data.data || data.disputes || [];
      setDisputes(disputesData);
      setTotalPages(Math.ceil((data.total || disputesData.length) / itemsPerPage));
      
    } catch (error) {
      console.error('Error fetching disputes:', error);
      // Fallback mock data
      setDisputes([
        {
          id: 1,
          dispute_id: "DSP-2024-001",
          order_id: 1001,
          order_number: "ORD-2024-001",
          escrow_id: 2001,
          escrow_id_display: "ESC-2024-001",
          buyer_id: 101,
          buyer_name: "Ahmad Fauzi",
          buyer_email: "ahmad@agrohub.com",
          seller_id: 201,
          seller_name: "Tani Makmur Store",
          seller_email: "tanimakmur@agrohub.com",
          amount: 2500000,
          reason: "Produk tidak sesuai deskripsi",
          description: "Barang yang diterima berbeda dengan yang dipesan. Warna dan ukuran tidak sesuai.",
          status: "pending",
          created_at: "2024-01-15T10:30:00Z",
          updated_at: "2024-01-15T10:30:00Z"
        },
        {
          id: 2,
          dispute_id: "DSP-2024-002",
          order_id: 1002,
          order_number: "ORD-2024-002",
          escrow_id: 2002,
          escrow_id_display: "ESC-2024-002",
          buyer_id: 102,
          buyer_name: "Budi Santoso",
          buyer_email: "budi@agrohub.com",
          seller_id: 202,
          seller_name: "Agro Nusantara",
          seller_email: "agro@agrohub.com",
          amount: 5000000,
          reason: "Pengiriman terlambat",
          description: "Pesanan sudah melebihi estimated delivery time 7 hari.",
          status: "investigating",
          created_at: "2024-01-14T14:20:00Z",
          updated_at: "2024-01-16T09:00:00Z"
        },
        {
          id: 3,
          dispute_id: "DSP-2024-003",
          order_id: 1003,
          order_number: "ORD-2024-003",
          escrow_id: 2003,
          escrow_id_display: "ESC-2024-003",
          buyer_id: 103,
          buyer_name: "Siti Nurhaliza",
          buyer_email: "siti@agrohub.com",
          seller_id: 203,
          seller_name: "Green Farm Official",
          seller_email: "green@agrohub.com",
          amount: 1500000,
          reason: "Produk rusak/cacat",
          description: "Produk yang diterima dalam kondisi rusak, packing tidak memadai.",
          status: "resolved",
          resolution: "buyer_won",
          resolved_at: "2024-01-17T14:30:00Z",
          created_at: "2024-01-13T08:00:00Z",
          updated_at: "2024-01-17T14:30:00Z"
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

      const response = await fetch(`${API_URL}/admin/disputes/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) return;

      const data = await response.json();
      const statsData = data.data || data;
      
      setStats({
        total_disputes: statsData.total_disputes || 45,
        total_amount: statsData.total_amount || 125000000,
        pending_count: statsData.pending_count || 12,
        investigating_count: statsData.investigating_count || 8,
        resolved_count: statsData.resolved_count || 18,
        rejected_count: statsData.rejected_count || 4,
        closed_count: statsData.closed_count || 3,
        buyer_won_count: statsData.buyer_won_count || 12,
        seller_won_count: statsData.seller_won_count || 6,
        pending_amount: statsData.pending_amount || 45000000,
        resolved_amount: statsData.resolved_amount || 80000000,
        avg_resolution_time: statsData.avg_resolution_time || 3.5,
        today_count: statsData.today_count || 2
      });
      
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        total_disputes: 45,
        total_amount: 125000000,
        pending_count: 12,
        investigating_count: 8,
        resolved_count: 18,
        rejected_count: 4,
        closed_count: 3,
        buyer_won_count: 12,
        seller_won_count: 6,
        pending_amount: 45000000,
        resolved_amount: 80000000,
        avg_resolution_time: 3.5,
        today_count: 2
      });
    }
  }, []);

  // Update dispute status
  const updateDisputeStatus = async (disputeId: number, status: string) => {
    setProcessing(true);
    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/admin/disputes/${disputeId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status,
          notes: resolutionNote
        })
      });

      if (response.ok) {
        fetchDisputes();
        fetchStats();
        setShowDetailModal(false);
        setSelectedDispute(null);
        setResolutionNote('');
      } else {
        const error = await response.json();
        alert(error.message || 'Gagal mengupdate status');
      }
    } catch (error) {
      console.error('Error updating dispute status:', error);
      alert('Terjadi kesalahan');
    } finally {
      setProcessing(false);
    }
  };

  // Resolve dispute
  const resolveDispute = async (disputeId: number) => {
    setProcessing(true);
    try {
      const token = getToken();
      
      const body: any = {
        resolution: resolutionAction,
        admin_notes: resolutionNote
      };
      
      if (resolutionAction === 'partial_refund' && partialAmount) {
        body.partial_amount = Number(partialAmount);
      }

      const response = await fetch(`${API_URL}/admin/disputes/${disputeId}/resolve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        fetchDisputes();
        fetchStats();
        setShowDetailModal(false);
        setSelectedDispute(null);
        setResolutionNote('');
        setPartialAmount('');
      } else {
        const error = await response.json();
        alert(error.message || 'Gagal meresolusi dispute');
      }
    } catch (error) {
      console.error('Error resolving dispute:', error);
      alert('Terjadi kesalahan');
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
    fetchStats();
  }, [fetchDisputes, fetchStats]);

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
      case 'investigating':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Investigating</span>;
      case 'resolved':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Resolved</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</span>;
      case 'closed':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center gap-1"><XCircle className="w-3 h-3" /> Closed</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{status}</span>;
    }
  };

  // Get resolution badge
  const getResolutionBadge = (resolution?: string) => {
    switch (resolution) {
      case 'buyer_won':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Buyer Won</span>;
      case 'seller_won':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Seller Won</span>;
      case 'partial_refund':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Partial Refund</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Cancelled</span>;
      default:
        return null;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateRange('all');
  };

  const activeFiltersCount = (searchTerm ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0) + (dateRange !== 'all' ? 1 : 0);

  if (loading && disputes.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        <span className="ml-2 text-gray-500">Memuat data disputes...</span>
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
              <Scale className="w-6 h-6 text-green-600" />
              <h1 className="text-2xl font-bold capitalize text-gray-800">
                Disputes Management
              </h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Kelola sengketa transaksi antara buyer dan seller
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
            <Scale className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.total_disputes}</p>
          <p className="text-xs text-gray-500">Dispute</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="text-xs text-gray-400">Total Amount</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{formatCurrency(stats.total_amount)}</p>
          <p className="text-xs text-gray-500">Nilai dispute</p>
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
            <AlertCircle className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-gray-400">Investigating</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.investigating_count}</p>
          <p className="text-xs text-gray-500">Investigasi</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-xs text-gray-400">Resolved</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.resolved_count}</p>
          <p className="text-xs text-gray-500">Resolved</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-5 h-5 text-red-500" />
            <span className="text-xs text-gray-400">Rejected</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.rejected_count}</p>
          <p className="text-xs text-gray-500">Ditolak</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Gavel className="w-5 h-5 text-purple-500" />
            <span className="text-xs text-gray-400">Avg Time</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.avg_resolution_time}h</p>
          <p className="text-xs text-gray-500">Rata-rata resolve</p>
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
                placeholder="Cari berdasarkan ID dispute, order, atau user..."
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
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
              <option value="closed">Closed</option>
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
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
              <option value="closed">Closed</option>
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

      {/* DISPUTES TABLE */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-medium">ID Dispute</th>
                <th className="px-4 py-3 font-medium">Buyer</th>
                <th className="px-4 py-3 font-medium">Seller</th>
                <th className="px-4 py-3 font-medium">Jumlah</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {disputes.length > 0 ? (
                disputes.map((dispute) => (
                  <tr key={dispute.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs font-medium text-gray-800">{dispute.dispute_id}</p>
                      <p className="text-xs text-gray-400">Order: {dispute.order_number}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{dispute.buyer_name}</p>
                      <p className="text-xs text-gray-400">{dispute.buyer_email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{dispute.seller_name}</p>
                      <p className="text-xs text-gray-400">{dispute.seller_email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-blue-600">{formatCurrency(dispute.amount)}</p>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(dispute.status)}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(dispute.created_at)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedDispute(dispute);
                          setShowDetailModal(true);
                          setResolutionNote('');
                          setPartialAmount('');
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
                    <Scale className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Belum ada data dispute</p>
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
              Menampilkan {disputes.length} dari {stats.total_disputes} dispute
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

      {/* Dispute Detail Modal */}
      {showDetailModal && selectedDispute && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Detail Dispute</h3>
                  <p className="text-sm text-gray-500">{selectedDispute.dispute_id}</p>
                </div>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedDispute(null);
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
                    <p className="text-sm text-gray-500">Status Dispute</p>
                    <div className="mt-2">{getStatusBadge(selectedDispute.status)}</div>
                    {selectedDispute.resolution && (
                      <div className="mt-1">{getResolutionBadge(selectedDispute.resolution)}</div>
                    )}
                  </div>
                  {selectedDispute.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateDisputeStatus(selectedDispute.id, 'investigating')}
                        disabled={processing}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                      >
                        Start Investigation
                      </button>
                      <button
                        onClick={() => updateDisputeStatus(selectedDispute.id, 'rejected')}
                        disabled={processing}
                        className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {selectedDispute.status === 'investigating' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setResolutionAction('buyer_won')}
                        className={`px-3 py-1 rounded-lg text-sm transition ${
                          resolutionAction === 'buyer_won' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        Buyer Won
                      </button>
                      <button
                        onClick={() => setResolutionAction('seller_won')}
                        className={`px-3 py-1 rounded-lg text-sm transition ${
                          resolutionAction === 'seller_won' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        Seller Won
                      </button>
                      <button
                        onClick={() => setResolutionAction('partial_refund')}
                        className={`px-3 py-1 rounded-lg text-sm transition ${
                          resolutionAction === 'partial_refund' 
                            ? 'bg-orange-600 text-white' 
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        Partial Refund
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Resolution Form */}
              {selectedDispute.status === 'investigating' && (
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                  <h4 className="font-semibold text-gray-800 mb-3">Resolusi Dispute</h4>
                  {resolutionAction === 'partial_refund' && (
                    <div className="mb-3">
                      <label className="text-sm text-gray-500 mb-1 block">Jumlah Refund</label>
                      <input
                        type="number"
                        value={partialAmount}
                        onChange={(e) => setPartialAmount(e.target.value)}
                        placeholder="Masukkan jumlah refund"
                        className="w-full p-2 rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                  <textarea
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    placeholder="Catatan resolusi..."
                    rows={2}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none mb-3"
                  />
                  <button
                    onClick={() => resolveDispute(selectedDispute.id)}
                    disabled={processing || (resolutionAction === 'partial_refund' && !partialAmount)}
                    className="w-full py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gavel className="w-4 h-4" />}
                    Resolve Dispute
                  </button>
                </div>
              )}

              {/* Dispute Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ID Dispute</p>
                  <p className="font-mono text-sm">{selectedDispute.dispute_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium">{selectedDispute.order_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Escrow ID</p>
                  <p className="font-medium">{selectedDispute.escrow_id_display}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Jumlah</p>
                  <p className="text-xl font-bold text-blue-600">{formatCurrency(selectedDispute.amount)}</p>
                </div>
              </div>

              {/* Dispute Details */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Flag className="w-5 h-5 text-red-500" />
                  Detail Dispute
                </h4>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="font-medium text-gray-800 mb-2">Alasan: {selectedDispute.reason}</p>
                  <p className="text-gray-600">{selectedDispute.description}</p>
                </div>
              </div>

              {/* Buyer & Seller Info */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Informasi Pihak</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <p className="text-sm text-blue-600 font-medium mb-2">Buyer</p>
                    <p className="font-medium">{selectedDispute.buyer_name}</p>
                    <p className="text-xs text-gray-500">{selectedDispute.buyer_email}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl">
                    <p className="text-sm text-green-600 font-medium mb-2">Seller</p>
                    <p className="font-medium">{selectedDispute.seller_name}</p>
                    <p className="text-xs text-gray-500">{selectedDispute.seller_email}</p>
                  </div>
                </div>
              </div>

              {/* Admin Notes */}
              <div className="border-t pt-4">
                <label className="text-sm text-gray-500 mb-1 block">Catatan Admin</label>
                <textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Tambahkan catatan internal..."
                  rows={2}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              {/* Timestamps */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Informasi Waktu</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Dibuat</p>
                    <p className="font-medium">{formatDate(selectedDispute.created_at)}</p>
                  </div>
                  {selectedDispute.resolved_at && (
                    <div>
                      <p className="text-sm text-gray-500">Resolved</p>
                      <p className="font-medium">{formatDate(selectedDispute.resolved_at)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}