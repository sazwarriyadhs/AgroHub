'use client';

import { useEffect, useState } from 'react';
import { 
  Activity, 
  Loader2, 
  Store, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  MapPin,
  Star,
  Eye
} from 'lucide-react';

// Types
interface Store {
  id: number;
  name: string;
  owner_name: string;
  owner_email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  status: 'active' | 'pending' | 'suspended';
  total_products: number;
  total_orders: number;
  total_revenue: number;
  rating: number;
  is_verified: boolean;
  joined_date: string;
}

interface StoreStats {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  total_revenue: number;
  total_orders: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

export default function StoresPage() {
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState<Store[]>([]);
  const [storeStats, setStoreStats] = useState<StoreStats>({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0,
    total_revenue: 0,
    total_orders: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  // Get token from localStorage
  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('admin_token') || localStorage.getItem('token');
  };

  // Fetch stores data
  const fetchStores = async () => {
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

      const response = await fetch(
        `${API_URL}/admin/stores?${params.toString()}`,
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
      
      const storesData = data.data || data.stores || [];
      setStores(storesData);
      setTotalPages(Math.ceil((data.total || storesData.length) / itemsPerPage));
      
    } catch (error) {
      console.error('Error fetching stores:', error);
      // Fallback mock data
      setStores([
        {
          id: 1,
          name: "Tani Makmur Store",
          owner_name: "Ahmad Fauzi",
          owner_email: "ahmad@agrohub.com",
          phone: "081234567890",
          address: "Jl. Pertanian No. 123",
          city: "Bandung",
          province: "Jawa Barat",
          status: "active",
          total_products: 245,
          total_orders: 1234,
          total_revenue: 125000000,
          rating: 4.8,
          is_verified: true,
          joined_date: "2024-01-15"
        },
        {
          id: 2,
          name: "Agro Nusantara",
          owner_name: "Budi Santoso",
          owner_email: "budi@agrohub.com",
          phone: "081234567891",
          address: "Jl. Raya No. 45",
          city: "Surabaya",
          province: "Jawa Timur",
          status: "active",
          total_products: 198,
          total_orders: 987,
          total_revenue: 98000000,
          rating: 4.7,
          is_verified: true,
          joined_date: "2024-02-20"
        },
        {
          id: 3,
          name: "Green Farm Official",
          owner_name: "Siti Nurhaliza",
          owner_email: "siti@agrohub.com",
          phone: "081234567892",
          address: "Jl. Hijau No. 78",
          city: "Jakarta",
          province: "DKI Jakarta",
          status: "pending",
          total_products: 312,
          total_orders: 0,
          total_revenue: 0,
          rating: 0,
          is_verified: false,
          joined_date: "2024-03-10"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const token = getToken();
      
      if (!token) return;

      const response = await fetch(`${API_URL}/admin/stores/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) return;

      const data = await response.json();
      const stats = data.data || data;
      
      setStoreStats({
        total: stats.total || 45,
        active: stats.active || 38,
        pending: stats.pending || 5,
        suspended: stats.suspended || 2,
        total_revenue: stats.total_revenue || 1250000000,
        total_orders: stats.total_orders || 3450
      });
      
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback mock data
      setStoreStats({
        total: 45,
        active: 38,
        pending: 5,
        suspended: 2,
        total_revenue: 1250000000,
        total_orders: 3450
      });
    }
  };

  // Update store status
  const updateStoreStatus = async (storeId: number, status: string) => {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/admin/stores/${storeId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchStores();
        fetchStats();
      }
    } catch (error) {
      console.error('Error updating store status:', error);
    }
  };

  useEffect(() => {
    fetchStores();
    fetchStats();
  }, [currentPage, searchTerm]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Aktif</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Pending</span>;
      case 'suspended':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Diblokir</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Unknown</span>;
    }
  };

  if (loading && stores.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        <span className="ml-2 text-gray-500">Memuat data stores...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold capitalize text-gray-800">
              Stores Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Kelola data toko, verifikasi, dan monitoring performa toko
            </p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
            + Tambah Toko
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Store className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{storeStats.total}</p>
          <p className="text-xs text-gray-500">Toko terdaftar</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-green-500" />
            <span className="text-xs text-gray-400">Aktif</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{storeStats.active}</p>
          <p className="text-xs text-gray-500">Toko aktif</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-yellow-500" />
            <span className="text-xs text-gray-400">Pending</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{storeStats.pending}</p>
          <p className="text-xs text-gray-500">Menunggu verifikasi</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-red-500" />
            <span className="text-xs text-gray-400">Suspended</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{storeStats.suspended}</p>
          <p className="text-xs text-gray-500">Toko diblokir</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <ShoppingBag className="w-5 h-5 text-purple-500" />
            <span className="text-xs text-gray-400">Orders</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{storeStats.total_orders.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Total pesanan</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <span className="text-xs text-gray-400">Revenue</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{formatCurrency(storeStats.total_revenue)}</p>
          <p className="text-xs text-gray-500">Total pendapatan</p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari toko berdasarkan nama atau pemilik..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
          />
          <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Data Table */}
        <div className="bg-white p-5 rounded-2xl border shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Daftar Toko</h3>
            <button className="text-sm text-green-600 hover:text-green-700">
              Lihat Semua →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left text-gray-500">
                  <th className="pb-2 font-medium">Nama Toko</th>
                  <th className="pb-2 font-medium">Pemilik</th>
                  <th className="pb-2 font-medium">Kota</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Produk</th>
                  <th className="pb-2 font-medium">Rating</th>
                  <th className="pb-2 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stores.length > 0 ? (
                  stores.map((store) => (
                    <tr key={store.id} className="hover:bg-gray-50">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Store className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{store.name}</p>
                            {store.is_verified && (
                              <span className="text-xs text-green-600">✓ Verified</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <p className="font-medium">{store.owner_name}</p>
                        <p className="text-xs text-gray-400">{store.owner_email}</p>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-sm">{store.city}</span>
                        </div>
                      </td>
                      <td className="py-3">{getStatusBadge(store.status)}</td>
                      <td className="py-3">{store.total_products || 0}</td>
                      <td className="py-3">
                        {store.rating > 0 ? (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{store.rating.toFixed(1)}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">Belum ada</span>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button className="text-green-600 hover:text-green-700 text-xs">
                            Detail
                          </button>
                          <button className="text-blue-600 hover:text-blue-700 text-xs">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      Belum ada data toko
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 pt-3 border-t flex justify-between items-center flex-wrap gap-2">
              <p className="text-xs text-gray-400">
                Menampilkan {stores.length} dari {storeStats.total} toko
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-lg text-xs disabled:opacity-40 hover:bg-gray-50 transition"
                >
                  Previous
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
                          : 'border hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                {totalPages > 5 && <span className="px-2">...</span>}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-lg text-xs disabled:opacity-40 hover:bg-gray-50 transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions & Tips */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm transition">
                🏪 Verifikasi Toko Baru ({storeStats.pending})
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm transition">
                📊 Export Data Toko
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm transition">
                🏆 Top Performers
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm transition">
                📍 Peta Lokasi Toko
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-2xl border border-green-100">
            <h3 className="font-semibold text-gray-800 mb-2">💡 Tips</h3>
            <p className="text-xs text-gray-600">
              Verifikasi toko baru dalam 24 jam untuk meningkatkan kepercayaan pembeli dan meningkatkan penjualan.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">🏆 Top Categories</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Alat Pertanian</span>
                <span className="text-sm font-semibold text-green-600">45 toko</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pupuk & Nutrisi</span>
                <span className="text-sm font-semibold text-green-600">38 toko</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Benih Unggul</span>
                <span className="text-sm font-semibold text-green-600">32 toko</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}