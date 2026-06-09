// app/admin/sellers/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Activity,
  Loader2,
  Users,
  Store,
  TrendingUp,
  Search,
  Filter,
  X,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Award,
  ShieldCheck,
  Phone,
  Mail,
  CalendarDays,
  BadgeDollarSign,
  ShoppingBag,
  Sparkles,
  Package
} from 'lucide-react';

// ==============================
// TYPES
// ==============================

interface Seller {
  id: number;
  name: string;
  store_name: string;
  email: string;
  phone: string;
  status: 'active' | 'pending' | 'suspended';
  total_products: number;
  total_sales: number;
  total_revenue: number;
  rating: number;
  joined_date: string;
  is_verified: boolean;
}

interface SellerStats {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  total_revenue: number;
  total_orders: number;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

export default function SellersPage() {
  const [loading, setLoading] = useState(true);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [sellerStats, setSellerStats] = useState<SellerStats>({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0,
    total_revenue: 0,
    total_orders: 0
  });

  // FILTER
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // MODAL
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return (
      localStorage.getItem('admin_token') ||
      localStorage.getItem('token')
    );
  };

  // ==============================
  // HELPER
  // ==============================

  const getInitial = (name: string) => {
    return name
      ?.trim()
      ?.split(' ')
      ?.map((x) => x[0])
      ?.slice(0, 2)
      ?.join('')
      ?.toUpperCase() || '?';
  };

  // ==============================
  // FETCH SELLERS
  // ==============================

  const fetchSellers = useCallback(async () => {
    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        console.error('No token found');
        return;
      }

      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());

      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all')
        params.append('status', statusFilter);
      if (sortBy) params.append('sort', sortBy);

      const response = await fetch(
        `${API_URL}/admin/sellers?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      const sellersData: Seller[] =
        Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.sellers)
          ? data.sellers
          : [];

      setSellers(sellersData);

      const total =
        data?.pagination?.total ||
        data?.total ||
        sellersData.length;

      setTotalPages(
        Math.max(
          1,
          Math.ceil(total / itemsPerPage)
        )
      );
    } catch (error) {
      console.error('Error fetching sellers:', error);

      // MOCK DATA
      setSellers([
        {
          id: 1,
          name: 'Ahmad Fauzi',
          store_name: 'Tani Makmur Store',
          email: 'ahmad@agrohub.com',
          phone: '081234567890',
          status: 'active',
          total_products: 245,
          total_sales: 1234,
          total_revenue: 125000000,
          rating: 4.8,
          joined_date: '2024-01-15',
          is_verified: true
        },
        {
          id: 2,
          name: 'Budi Santoso',
          store_name: 'Agro Nusantara',
          email: 'budi@agrohub.com',
          phone: '081234567891',
          status: 'active',
          total_products: 198,
          total_sales: 987,
          total_revenue: 98000000,
          rating: 4.7,
          joined_date: '2024-02-20',
          is_verified: true
        },
        {
          id: 3,
          name: 'Siti Nurhaliza',
          store_name: 'Green Farm Official',
          email: 'siti@agrohub.com',
          phone: '081234567892',
          status: 'pending',
          total_products: 312,
          total_sales: 0,
          total_revenue: 0,
          rating: 0,
          joined_date: '2024-03-10',
          is_verified: false
        },
        {
          id: 4,
          name: 'Reza Pahlevi',
          store_name: 'Alat Pertanian Modern',
          email: 'reza@agrohub.com',
          phone: '081234567893',
          status: 'active',
          total_products: 156,
          total_sales: 2345,
          total_revenue: 325000000,
          rating: 4.9,
          joined_date: '2024-01-05',
          is_verified: true
        }
      ]);

      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, sortBy]);

  // ==============================
  // FETCH STATS
  // ==============================

  const fetchStats = useCallback(async () => {
    try {
      const token = getToken();

      if (!token) return;

      const response = await fetch(
        `${API_URL}/admin/sellers/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) return;

      const data = await response.json();

      const statsData = data.data || data;

      setSellerStats({
        total: statsData.total || 127,
        active: statsData.active || 98,
        pending: statsData.pending || 23,
        suspended: statsData.suspended || 6,
        total_revenue:
          statsData.total_revenue || 1250000000,
        total_orders: statsData.total_orders || 3450
      });
    } catch (error) {
      console.error('Error fetching stats:', error);

      setSellerStats({
        total: 127,
        active: 98,
        pending: 23,
        suspended: 6,
        total_revenue: 1250000000,
        total_orders: 3450
      });
    }
  }, []);

  // ==============================
  // USE EFFECTS
  // ==============================

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy]);

  // Fetch sellers when dependencies change
  useEffect(() => {
    fetchSellers();
  }, [
    fetchSellers,
    currentPage,
    searchTerm,
    statusFilter,
    sortBy
  ]);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // ==============================
  // UPDATE STATUS
  // ==============================

  const updateSellerStatus = async (
    sellerId: number,
    status: string
  ) => {
    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/admin/sellers/${sellerId}/status`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        }
      );

      if (response.ok) {
        await Promise.all([
          fetchSellers(),
          fetchStats()
        ]);

        setSelectedSeller((prev) =>
          prev
            ? {
                ...prev,
                status: status as Seller['status']
              }
            : null
        );
      }
    } catch (error) {
      console.error('Error updating seller status:', error);
    }
  };

  // ==============================
  // DELETE SELLER
  // ==============================

  const deleteSeller = async () => {
    if (!selectedSeller) return;

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/admin/sellers/${selectedSeller.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        setShowDeleteModal(false);
        setSelectedSeller(null);

        await Promise.all([
          fetchSellers(),
          fetchStats()
        ]);
      }
    } catch (error) {
      console.error('Error deleting seller:', error);
    }
  };

  // ==============================
  // HELPERS
  // ==============================

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      'id-ID',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1 w-fit">
            <CheckCircle className="w-3 h-3" />
            Aktif
          </span>
        );

      case 'pending':
        return (
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold flex items-center gap-1 w-fit">
            <AlertCircle className="w-3 h-3" />
            Pending
          </span>
        );

      case 'suspended':
        return (
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold flex items-center gap-1 w-fit">
            <XCircle className="w-3 h-3" />
            Suspended
          </span>
        );

      default:
        return (
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
            Unknown
          </span>
        );
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSortBy('newest');
  };

  const activeFiltersCount =
    (searchTerm ? 1 : 0) +
    (statusFilter !== 'all' ? 1 : 0);

  // ==============================
  // LOADING
  // ==============================

  if (loading && sellers.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-7 h-7 animate-spin text-green-600" />
        <span className="ml-3 text-gray-500">
          Memuat data seller...
        </span>
      </div>
    );
  }

  // ==============================
  // UI
  // ==============================

  return (
    <div className="space-y-6">
      {/* HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-r from-green-600 via-emerald-600 to-lime-500 p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 opacity-10">
          <Store className="w-72 h-72" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm mb-4 backdrop-blur">
              <Sparkles className="w-4 h-4" />
              AgroHub Seller Center
            </div>

            <h1 className="text-4xl font-black leading-tight">
              Sellers Management
            </h1>

            <p className="text-green-50 mt-3 max-w-2xl">
              Kelola seller marketplace, verifikasi toko,
              monitoring performa penjualan, dan kontrol
              aktivitas seller AgroHub secara realtime.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <div className="bg-white/15 backdrop-blur px-4 py-2 rounded-2xl">
                <p className="text-xs text-green-100">
                  Total Seller
                </p>
                <p className="font-bold text-xl">
                  {sellerStats.total}
                </p>
              </div>

              <div className="bg-white/15 backdrop-blur px-4 py-2 rounded-2xl">
                <p className="text-xs text-green-100">
                  Seller Aktif
                </p>
                <p className="font-bold text-xl">
                  {sellerStats.active}
                </p>
              </div>

              <div className="bg-white/15 backdrop-blur px-4 py-2 rounded-2xl">
                <p className="text-xs text-green-100">
                  Total Revenue
                </p>
                <p className="font-bold text-xl">
                  {formatCurrency(
                    sellerStats.total_revenue
                  )}
                </p>
              </div>
            </div>
          </div>

          <button className="bg-white text-green-700 hover:bg-green-50 px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg transition-all hover:scale-105">
            <Plus className="w-5 h-5" />
            Tambah Seller
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 xl:grid-cols-6 gap-4">
        {[
          {
            title: 'Total Seller',
            value: sellerStats.total,
            icon: Users,
            color:
              'from-blue-500 to-cyan-500'
          },
          {
            title: 'Seller Aktif',
            value: sellerStats.active,
            icon: CheckCircle,
            color:
              'from-green-500 to-emerald-500'
          },
          {
            title: 'Pending',
            value: sellerStats.pending,
            icon: AlertCircle,
            color:
              'from-yellow-500 to-orange-500'
          },
          {
            title: 'Suspended',
            value: sellerStats.suspended,
            icon: XCircle,
            color:
              'from-red-500 to-rose-500'
          },
          {
            title: 'Revenue',
            value: formatCurrency(
              sellerStats.total_revenue
            ),
            icon: BadgeDollarSign,
            color:
              'from-purple-500 to-fuchsia-500'
          },
          {
            title: 'Orders',
            value:
              sellerStats.total_orders.toLocaleString(),
            icon: ShoppingBag,
            color:
              'from-indigo-500 to-blue-500'
          }
        ].map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white shadow-lg`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <span className="text-xs text-gray-400 font-medium">
                  Overview
                </span>
              </div>

              <h3 className="text-2xl font-black text-gray-800">
                {item.value}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {item.title}
              </p>
            </div>
          );
        })}
      </div>

      {/* FILTER */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-wrap gap-4 items-center">
          {/* SEARCH */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="text"
                placeholder="Cari seller, email, toko..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition"
              />
            </div>
          </div>

          {/* MOBILE */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden px-4 py-3 rounded-2xl border flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter

            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* DESKTOP */}
          <div className="hidden lg:flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">
                Semua Status
              </option>
              <option value="active">Aktif</option>
              <option value="pending">Pending</option>
              <option value="suspended">
                Suspended
              </option>
            </select>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
              className="px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="newest">Terbaru</option>
              <option value="name">Nama A-Z</option>
              <option value="products">
                Produk Terbanyak
              </option>
              <option value="sales">
                Penjualan Terbanyak
              </option>
              <option value="rating">
                Rating Tertinggi
              </option>
            </select>
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="px-4 py-3 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>

        {/* MOBILE DRAWER */}
        {showFilters && (
          <div className="lg:hidden mt-4 pt-4 border-t space-y-3">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50"
            >
              <option value="all">
                Semua Status
              </option>
              <option value="active">Aktif</option>
              <option value="pending">Pending</option>
              <option value="suspended">
                Suspended
              </option>
            </select>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50"
            >
              <option value="newest">Terbaru</option>
              <option value="name">Nama A-Z</option>
              <option value="products">
                Produk Terbanyak
              </option>
              <option value="sales">
                Penjualan Terbanyak
              </option>
              <option value="rating">
                Rating Tertinggi
              </option>
            </select>
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b text-gray-500">
              <tr>
                <th className="px-5 py-4 text-left font-semibold">
                  Seller
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Store
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Revenue
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Produk
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Rating
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Status
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {sellers.length > 0 ? (
                sellers.map((seller) => (
                  <tr
                    key={seller.id}
                    className="hover:bg-gray-50 transition"
                  >
                    {/* SELLER */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white flex items-center justify-center font-bold shadow-lg">
                            {getInitial(seller.name)}
                          </div>

                          {seller.is_verified && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                              <ShieldCheck className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-800">
                            {seller.name}
                          </p>

                          <p className="text-xs text-gray-400">
                            {seller.phone}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* STORE */}
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-800">
                        {seller.store_name}
                      </p>

                      <p className="text-xs text-gray-400">
                        {seller.email}
                      </p>
                    </td>

                    {/* REVENUE */}
                    <td className="px-5 py-4 font-bold text-green-600">
                      {formatCurrency(
                        seller.total_revenue
                      )}
                    </td>

                    {/* PRODUCTS */}
                    <td className="px-5 py-4">
                      <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                        <Package className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold">
                          {seller.total_products}
                        </span>
                      </div>
                    </td>

                    {/* RATING */}
                    <td className="px-5 py-4">
                      {seller.rating > 0 ? (
                        <div className="flex items-center gap-1">
                          <span>⭐</span>

                          <span className="font-semibold">
                            {seller.rating.toFixed(1)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">
                          No Rating
                        </span>
                      )}
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">
                      {getStatusBadge(
                        seller.status
                      )}
                    </td>

                    {/* ACTION */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedSeller(
                              seller
                            );
                            setShowDetailModal(
                              true
                            );
                          }}
                          className="w-9 h-9 rounded-xl bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>

                        <button className="w-9 h-9 rounded-xl bg-green-50 hover:bg-green-100 flex items-center justify-center transition">
                          <Edit className="w-4 h-4 text-green-600" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedSeller(
                              seller
                            );
                            setShowDeleteModal(
                              true
                            );
                          }}
                          className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center transition"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-20 text-center"
                  >
                    <Users className="w-14 h-14 mx-auto text-gray-300 mb-4" />

                    <p className="text-gray-400">
                      Belum ada seller
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t bg-gray-50 flex items-center justify-between flex-wrap gap-4">
            <p className="text-sm text-gray-500">
              Menampilkan {sellers.length} dari{' '}
              {sellerStats.total} seller
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.max(1, p - 1)
                  )
                }
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-xl border bg-white flex items-center justify-center disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {[...Array(Math.min(totalPages, 5))].map(
                (_, i) => {
                  const page = i + 1;

                  return (
                    <button
                      key={page}
                      onClick={() =>
                        setCurrentPage(page)
                      }
                      className={`w-10 h-10 rounded-xl text-sm font-semibold transition ${
                        currentPage === page
                          ? 'bg-green-600 text-white'
                          : 'bg-white border hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
              )}

              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(totalPages, p + 1)
                  )
                }
                disabled={
                  currentPage === totalPages
                }
                className="w-10 h-10 rounded-xl border bg-white flex items-center justify-center disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {showDetailModal && selectedSeller && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10">
                <Store className="w-44 h-44" />
              </div>

              <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-black">
                    {getInitial(selectedSeller.name)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-black">
                        {selectedSeller.name}
                      </h3>

                      {selectedSeller.is_verified && (
                        <ShieldCheck className="w-6 h-6 text-cyan-200" />
                      )}
                    </div>

                    <p className="text-green-100">
                      {selectedSeller.store_name}
                    </p>

                    <div className="mt-3">
                      {getStatusBadge(
                        selectedSeller.status
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedSeller(null);
                  }}
                  className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* BODY */}
            <div className="p-6 space-y-6">
              {/* INFO GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    icon: Mail,
                    label: 'Email',
                    value: selectedSeller.email
                  },
                  {
                    icon: Phone,
                    label: 'Telepon',
                    value: selectedSeller.phone
                  },
                  {
                    icon: Package,
                    label: 'Total Produk',
                    value:
                      selectedSeller.total_products
                  },
                  {
                    icon: TrendingUp,
                    label: 'Total Penjualan',
                    value:
                      selectedSeller.total_sales.toLocaleString()
                  },
                  {
                    icon: BadgeDollarSign,
                    label: 'Revenue',
                    value: formatCurrency(
                      selectedSeller.total_revenue
                    )
                  },
                  {
                    icon: Award,
                    label: 'Rating',
                    value: `⭐ ${selectedSeller.rating.toFixed(
                      1
                    )}`
                  },
                  {
                    icon: CalendarDays,
                    label: 'Joined',
                    value: formatDate(
                      selectedSeller.joined_date
                    )
                  }
                ].map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-2xl p-4 border border-gray-100"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-green-600" />
                        </div>

                        <p className="text-sm text-gray-500">
                          {item.label}
                        </p>
                      </div>

                      <p className="font-bold text-gray-800">
                        {item.value}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* ACTION */}
              <div className="pt-6 border-t flex flex-wrap gap-3">
                <select
                  value={selectedSeller.status}
                  onChange={(e) =>
                    updateSellerStatus(
                      selectedSeller.id,
                      e.target.value
                    )
                  }
                  className="px-4 py-3 rounded-2xl border border-gray-200"
                >
                  <option value="active">
                    Aktif
                  </option>

                  <option value="pending">
                    Pending
                  </option>

                  <option value="suspended">
                    Suspended
                  </option>
                </select>

                <button className="px-5 py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-semibold transition">
                  Edit Seller
                </button>

                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowDeleteModal(true);
                  }}
                  className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold transition"
                >
                  Hapus Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && selectedSeller && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>

            <h3 className="text-2xl font-bold text-center text-gray-800">
              Hapus Seller?
            </h3>

            <p className="text-gray-500 text-center mt-3">
              Semua data seller dan produk dari{' '}
              <span className="font-semibold text-gray-800">
                {selectedSeller.name}
              </span>{' '}
              akan dihapus permanen.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-8">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedSeller(null);
                }}
                className="py-3 rounded-2xl border border-gray-200 hover:bg-gray-50 font-medium transition"
              >
                Batal
              </button>

              <button
                onClick={deleteSeller}
                className="py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}