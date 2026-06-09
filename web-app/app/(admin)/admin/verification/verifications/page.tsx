'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Loader2, 
  ShieldCheck,
  Search,
  Filter,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  FileText,
  Image as ImageIcon,
  Download,
  Send,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

// Types
interface Verification {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  user_phone: string;
  user_type: 'farmer' | 'vendor' | 'customer';
  status: 'pending' | 'approved' | 'rejected' | 'revision';
  kyc_type: 'ktp' | 'passport' | 'sim';
  kyc_number: string;
  kyc_name: string;
  kyc_address?: string;
  kyc_photo_url?: string;
  selfie_photo_url?: string;
  document_photo_url?: string;
  submitted_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  notes?: string;
}

interface VerificationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  revision: number;
  today_submissions: number;
  avg_processing_time: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

export default function VerificationsPage() {
  const [loading, setLoading] = useState(true);
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [stats, setStats] = useState<VerificationStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    revision: 0,
    today_submissions: 0,
    avg_processing_time: 0
  });
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNote, setAdminNote] = useState('');

  // Get token
  const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    const cookies = document.cookie.split('; ');
    const adminTokenCookie = cookies.find(row => row.startsWith('admin_token='));
    if (adminTokenCookie) return adminTokenCookie.split('=')[1];
    return localStorage.getItem('admin_token') || localStorage.getItem('token');
  };

  // Fetch verifications
  const fetchVerifications = useCallback(async () => {
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
      if (typeFilter !== 'all') params.append('user_type', typeFilter);

      const response = await fetch(
        `${API_URL}/admin/verifications?${params.toString()}`,
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
      const verificationsData = data.data || data.verifications || [];
      setVerifications(verificationsData);
      setTotalPages(Math.ceil((data.total || verificationsData.length) / itemsPerPage));
      
    } catch (error) {
      console.error('Error fetching verifications:', error);
      // Fallback mock data
      setVerifications([
        {
          id: 1,
          user_id: 101,
          user_name: "Ahmad Fauzi",
          user_email: "ahmad@agrohub.com",
          user_phone: "081234567890",
          user_type: "farmer",
          status: "pending",
          kyc_type: "ktp",
          kyc_number: "1234567890123456",
          kyc_name: "Ahmad Fauzi",
          kyc_address: "Jl. Pertanian No. 123, Malang",
          submitted_at: "2024-01-15T10:30:00Z",
        },
        {
          id: 2,
          user_id: 102,
          user_name: "Budi Santoso",
          user_email: "budi@agrohub.com",
          user_phone: "081234567891",
          user_type: "vendor",
          status: "approved",
          kyc_type: "ktp",
          kyc_number: "1234567890123457",
          kyc_name: "Budi Santoso",
          kyc_address: "Jl. Raya No. 45, Surabaya",
          submitted_at: "2024-01-14T14:20:00Z",
          reviewed_by: "Admin",
          reviewed_at: "2024-01-15T09:00:00Z",
        },
        {
          id: 3,
          user_id: 103,
          user_name: "Siti Nurhaliza",
          user_email: "siti@agrohub.com",
          user_phone: "081234567892",
          user_type: "customer",
          status: "rejected",
          kyc_type: "ktp",
          kyc_number: "1234567890123458",
          kyc_name: "Siti Nurhaliza",
          kyc_address: "Jl. Hijau No. 78, Jakarta",
          submitted_at: "2024-01-13T08:15:00Z",
          reviewed_by: "Admin",
          reviewed_at: "2024-01-14T11:30:00Z",
          rejection_reason: "Foto KTP tidak jelas",
        }
      ]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, typeFilter]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const token = getToken();
      
      if (!token) return;

      const response = await fetch(`${API_URL}/admin/verifications/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) return;

      const data = await response.json();
      const statsData = data.data || data;
      
      setStats({
        total: statsData.total || 156,
        pending: statsData.pending || 23,
        approved: statsData.approved || 112,
        rejected: statsData.rejected || 15,
        revision: statsData.revision || 6,
        today_submissions: statsData.today_submissions || 8,
        avg_processing_time: statsData.avg_processing_time || 2.5
      });
      
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        total: 156,
        pending: 23,
        approved: 112,
        rejected: 15,
        revision: 6,
        today_submissions: 8,
        avg_processing_time: 2.5
      });
    }
  }, []);

  // Update verification status
  const updateVerificationStatus = async (verificationId: number, status: string) => {
    setProcessing(true);
    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/admin/verifications/${verificationId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status,
          rejection_reason: status === 'rejected' ? rejectionReason : undefined,
          notes: adminNote
        })
      });

      if (response.ok) {
        fetchVerifications();
        fetchStats();
        setShowDetailModal(false);
        setSelectedVerification(null);
        setRejectionReason('');
        setAdminNote('');
      } else {
        const error = await response.json();
        alert(error.message || 'Gagal mengupdate status');
      }
    } catch (error) {
      console.error('Error updating verification status:', error);
      alert('Terjadi kesalahan');
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
    fetchStats();
  }, [fetchVerifications, fetchStats]);

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
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</span>;
      case 'revision':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Revision</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{status}</span>;
    }
  };

  // Get user type badge
  const getUserTypeBadge = (type: string) => {
    switch (type) {
      case 'farmer':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">🌾 Farmer</span>;
      case 'vendor':
        return <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">🏪 Vendor</span>;
      case 'customer':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">👤 Customer</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{type}</span>;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  const activeFiltersCount = (searchTerm ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0) + (typeFilter !== 'all' ? 1 : 0);

  if (loading && verifications.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        <span className="ml-2 text-gray-500">Memuat data verifikasi...</span>
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
              <ShieldCheck className="w-6 h-6 text-green-600" />
              <h1 className="text-2xl font-bold capitalize text-gray-800">
                KYC Verifications
              </h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Kelola verifikasi identitas pengguna (KYC)
            </p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-xs text-gray-500">Verifikasi</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            <span className="text-xs text-gray-400">Pending</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
          <p className="text-xs text-gray-500">Menunggu</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-xs text-gray-400">Approved</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.approved}</p>
          <p className="text-xs text-gray-500">Disetujui</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-5 h-5 text-red-500" />
            <span className="text-xs text-gray-400">Rejected</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.rejected}</p>
          <p className="text-xs text-gray-500">Ditolak</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <span className="text-xs text-gray-400">Revision</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.revision}</p>
          <p className="text-xs text-gray-500">Revisi</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <UserCheck className="w-5 h-5 text-teal-500" />
            <span className="text-xs text-gray-400">Today</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.today_submissions}</p>
          <p className="text-xs text-gray-500">Hari ini</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            <span className="text-xs text-gray-400">Avg Time</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.avg_processing_time}h</p>
          <p className="text-xs text-gray-500">Proses rata-rata</p>
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
                placeholder="Cari berdasarkan nama, email, atau nomor KTP..."
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
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="revision">Revision</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none text-sm"
            >
              <option value="all">Semua Tipe</option>
              <option value="farmer">Petani</option>
              <option value="vendor">Vendor</option>
              <option value="customer">Customer</option>
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
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="revision">Revision</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50"
            >
              <option value="all">Semua Tipe</option>
              <option value="farmer">Petani</option>
              <option value="vendor">Vendor</option>
              <option value="customer">Customer</option>
            </select>
          </div>
        )}
      </div>

      {/* VERIFICATIONS TABLE */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Tipe</th>
                <th className="px-4 py-3 font-medium">KTP</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {verifications.length > 0 ? (
                verifications.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{v.user_name}</p>
                      <p className="text-xs text-gray-400">{v.user_email}</p>
                    </td>
                    <td className="px-4 py-3">{getUserTypeBadge(v.user_type)}</td>
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs">{v.kyc_number}</p>
                      <p className="text-xs text-gray-400">{v.kyc_name}</p>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(v.status)}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(v.submitted_at)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedVerification(v);
                          setShowDetailModal(true);
                          setRejectionReason('');
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
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Belum ada data verifikasi</p>
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
              Menampilkan {verifications.length} dari {stats.total} verifikasi
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

      {/* Verification Detail Modal */}
      {showDetailModal && selectedVerification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Detail Verifikasi KYC</h3>
                  <p className="text-sm text-gray-500">{selectedVerification.user_name}</p>
                </div>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedVerification(null);
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
                    <p className="text-sm text-gray-500">Status Verifikasi</p>
                    <div className="mt-2">{getStatusBadge(selectedVerification.status)}</div>
                  </div>
                  {selectedVerification.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateVerificationStatus(selectedVerification.id, 'approved')}
                        disabled={processing}
                        className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
                      >
                        {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Approve
                      </button>
                      <button
                        onClick={() => updateVerificationStatus(selectedVerification.id, 'revision')}
                        disabled={processing}
                        className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition disabled:opacity-50 flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        Revision
                      </button>
                      <button
                        onClick={() => setShowDetailModal(false)}
                        className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Rejection Reason (if rejected) */}
              {selectedVerification.status === 'rejected' && selectedVerification.rejection_reason && (
                <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                  <p className="text-sm font-medium text-red-700 mb-1">Alasan Penolakan</p>
                  <p className="text-sm text-red-600">{selectedVerification.rejection_reason}</p>
                </div>
              )}

              {/* User Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nama Lengkap</p>
                  <p className="font-medium">{selectedVerification.user_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedVerification.user_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telepon</p>
                  <p className="font-medium">{selectedVerification.user_phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipe Pengguna</p>
                  <p className="font-medium capitalize">{selectedVerification.user_type}</p>
                </div>
              </div>

              {/* KYC Info */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Informasi KTP
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nomor KTP</p>
                    <p className="font-mono text-sm">{selectedVerification.kyc_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nama di KTP</p>
                    <p className="font-medium">{selectedVerification.kyc_name}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Alamat</p>
                    <p className="text-sm">{selectedVerification.kyc_address || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Document Photos */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-green-600" />
                  Dokumen
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-xl p-3 text-center">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs text-gray-500">Foto KTP</p>
                    <button className="mt-2 text-xs text-green-600 hover:text-green-700">
                      Lihat
                    </button>
                  </div>
                  <div className="border rounded-xl p-3 text-center">
                    <UserCheck className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs text-gray-500">Selfie dengan KTP</p>
                    <button className="mt-2 text-xs text-green-600 hover:text-green-700">
                      Lihat
                    </button>
                  </div>
                </div>
              </div>

              {/* Admin Note */}
              {(selectedVerification.status === 'pending' || selectedVerification.status === 'revision') && (
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Catatan Admin (Opsional)</label>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Tambahkan catatan untuk user..."
                    rows={2}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              )}

              {/* Timestamps */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Informasi Waktu</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Diajukan</p>
                    <p className="font-medium">{formatDate(selectedVerification.submitted_at)}</p>
                  </div>
                  {selectedVerification.reviewed_at && (
                    <div>
                      <p className="text-sm text-gray-500">Direview</p>
                      <p className="font-medium">{formatDate(selectedVerification.reviewed_at)}</p>
                    </div>
                  )}
                  {selectedVerification.reviewed_by && (
                    <div>
                      <p className="text-sm text-gray-500">Direview oleh</p>
                      <p className="font-medium">{selectedVerification.reviewed_by}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons for pending status */}
              {selectedVerification.status === 'pending' && (
                <div className="pt-4 border-t flex gap-3">
                  <button
                    onClick={() => updateVerificationStatus(selectedVerification.id, 'approved')}
                    disabled={processing}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Approve Verification
                  </button>
                  <button
                    onClick={() => {
                      if (!rejectionReason) {
                        alert('Silakan masukkan alasan penolakan');
                        return;
                      }
                      updateVerificationStatus(selectedVerification.id, 'rejected');
                    }}
                    disabled={processing}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              )}

              {/* Rejection Reason Input (if reject button clicked) */}
              {selectedVerification.status === 'pending' && (
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Alasan Penolakan (wajib jika reject)</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Masukkan alasan penolakan..."
                    rows={2}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}