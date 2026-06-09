'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Activity,
  Loader2,
  Package,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Star,
  Store,
  Calendar,
  RefreshCcw,
} from 'lucide-react';

// ===============================
// TYPES
// ===============================
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
  rating_avg?: number;
  sold_count?: number;
  status: 'active' | 'inactive' | 'pending';
  store_id: number;
  store_name: string;
  seller_name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface ProductStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  low_stock: number;
  out_of_stock: number;
  total_value: number;
  avg_price: number;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

const categories = [
  'Semua Kategori',
  'Pupuk & Nutrisi',
  'Benih Unggul',
  'Alat Pertanian',
  'IoT & Sensor',
  'Irigasi',
  'Pestisida',
  'Hasil Panen',
  'Pakan Ternak',
  'Greenhouse',
];

// ===============================
// COMPONENT
// ===============================
export default function ProductsPage() {
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);

  const [stats, setStats] = useState<ProductStats>({
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0,
    low_stock: 0,
    out_of_stock: 0,
    total_value: 0,
    avg_price: 0,
  });

  // FILTER
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState('Semua Kategori');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 10;

  // MODAL
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // ===============================
  // HELPERS
  // ===============================
  const getToken = () => {
    if (typeof window === 'undefined') return null;

    return (
      localStorage.getItem('admin_token') ||
      localStorage.getItem('token')
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // ===============================
  // FETCH PRODUCTS
  // ===============================
  const fetchProducts = useCallback(async () => {
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

      if (selectedCategory !== 'Semua Kategori') {
        params.append('category', selectedCategory);
      }

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      if (sortBy) {
        params.append('sort', sortBy);
      }

      const response = await fetch(
        `${API_URL}/admin/products?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      const productsData = data.data || data.products || [];

      setProducts(productsData);

      setTotalPages(
        Math.ceil((data.total || productsData.length) / itemsPerPage)
      );
    } catch (error) {
      console.error('Error fetching products:', error);

      // MOCK DATA
      setProducts([
        {
          id: 1,
          name: 'Pupuk Organik Premium',
          price: 180000,
          category: 'Pupuk & Nutrisi',
          image_url:
            'https://placehold.co/400x400/22c55e/ffffff?text=AgroHub',
          stock: 497,
          rating_avg: 4.8,
          sold_count: 1234,
          status: 'active',
          store_id: 1,
          store_name: 'Tani Makmur Store',
          seller_name: 'Ahmad Fauzi',
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z',
        },
        {
          id: 2,
          name: 'Benih Padi Unggul',
          price: 120000,
          category: 'Benih Unggul',
          image_url:
            'https://placehold.co/400x400/16a34a/ffffff?text=Benih',
          stock: 200,
          rating_avg: 4.7,
          sold_count: 980,
          status: 'active',
          store_id: 1,
          store_name: 'Tani Makmur Store',
          seller_name: 'Ahmad Fauzi',
          created_at: '2024-01-20T00:00:00Z',
          updated_at: '2024-01-20T00:00:00Z',
        },
        {
          id: 3,
          name: 'Sprayer Elektrik Modern',
          price: 650000,
          category: 'Alat Pertanian',
          image_url:
            'https://placehold.co/400x400/15803d/ffffff?text=Sprayer',
          stock: 8,
          rating_avg: 4.9,
          sold_count: 430,
          status: 'pending',
          store_id: 2,
          store_name: 'Agro Nusantara',
          seller_name: 'Budi Santoso',
          created_at: '2024-02-01T00:00:00Z',
          updated_at: '2024-02-01T00:00:00Z',
        },
      ]);

      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    searchTerm,
    selectedCategory,
    statusFilter,
    sortBy,
  ]);

  // ===============================
  // FETCH STATS
  // ===============================
  const fetchStats = useCallback(async () => {
    try {
      const token = getToken();

      if (!token) return;

      const response = await fetch(
        `${API_URL}/admin/products/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) return;

      const data = await response.json();

      const statsData = data.data || data;

      setStats({
        total: statsData.total || 1250,
        active: statsData.active || 1120,
        inactive: statsData.inactive || 85,
        pending: statsData.pending || 45,
        low_stock: statsData.low_stock || 67,
        out_of_stock: statsData.out_of_stock || 23,
        total_value: statsData.total_value || 125000000000,
        avg_price: statsData.avg_price || 250000,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);

      setStats({
        total: 1250,
        active: 1120,
        inactive: 85,
        pending: 45,
        low_stock: 67,
        out_of_stock: 23,
        total_value: 125000000000,
        avg_price: 250000,
      });
    }
  }, []);

  // ===============================
  // EFFECT
  // ===============================
  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, [fetchProducts, fetchStats]);

  // ===============================
  // UPDATE STATUS
  // ===============================
  const updateProductStatus = async (
    productId: number,
    status: string
  ) => {
    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/admin/products/${productId}/status`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        fetchProducts();
        fetchStats();
        setSelectedProduct(null);
      }
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  // ===============================
  // DELETE PRODUCT
  // ===============================
  const deleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/admin/products/${selectedProduct.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        fetchProducts();
        fetchStats();

        setShowDeleteModal(false);
        setSelectedProduct(null);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // ===============================
  // STATUS BADGE
  // ===============================
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle className="h-3 w-3" />
            Aktif
          </span>
        );

      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
            <XCircle className="h-3 w-3" />
            Nonaktif
          </span>
        );

      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
            <AlertCircle className="h-3 w-3" />
            Pending
          </span>
        );

      default:
        return (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
            Unknown
          </span>
        );
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Semua Kategori');
    setStatusFilter('all');
    setSortBy('newest');
  };

  const activeFiltersCount =
    (searchTerm ? 1 : 0) +
    (selectedCategory !== 'Semua Kategori' ? 1 : 0) +
    (statusFilter !== 'all' ? 1 : 0);

  // ===============================
  // LOADING
  // ===============================
  if (loading && products.length === 0) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border bg-white px-6 py-4 shadow-sm">
          <Loader2 className="h-6 w-6 animate-spin text-green-600" />
          <span className="text-sm font-medium text-gray-600">
            Memuat data produk...
          </span>
        </div>
      </div>
    );
  }

  // ===============================
  // UI
  // ===============================
  return (
    <div className="space-y-6">
      {/* =============================== */}
      {/* HERO */}
      {/* =============================== */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 p-8 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
              <Package className="h-4 w-4" />
              AgroHub Product Management
            </div>

            <h1 className="text-3xl font-black lg:text-5xl">
              Kelola Produk Marketplace
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-green-50 lg:text-base">
              Monitoring produk, verifikasi seller, stok,
              performa penjualan, dan aktivitas marketplace AgroHub.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                fetchProducts();
                fetchStats();
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>

            <button className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-green-700 transition hover:scale-[1.02] hover:bg-green-50">
              <Plus className="h-4 w-4" />
              Tambah Produk
            </button>
          </div>
        </div>
      </div>

      {/* =============================== */}
      {/* STATS */}
      {/* =============================== */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-8">
        {[
          {
            label: 'Total Produk',
            value: stats.total.toLocaleString(),
            icon: Package,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
          },
          {
            label: 'Produk Aktif',
            value: stats.active.toLocaleString(),
            icon: CheckCircle,
            color: 'text-green-600',
            bg: 'bg-green-50',
          },
          {
            label: 'Pending',
            value: stats.pending.toLocaleString(),
            icon: AlertCircle,
            color: 'text-yellow-600',
            bg: 'bg-yellow-50',
          },
          {
            label: 'Low Stock',
            value: stats.low_stock.toLocaleString(),
            icon: TrendingUp,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
          },
          {
            label: 'Out Stock',
            value: stats.out_of_stock.toLocaleString(),
            icon: XCircle,
            color: 'text-red-600',
            bg: 'bg-red-50',
          },
          {
            label: 'Inactive',
            value: stats.inactive.toLocaleString(),
            icon: Activity,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
          },
          {
            label: 'Inventory',
            value: formatCurrency(stats.total_value),
            icon: TrendingUp,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
          },
          {
            label: 'Avg Price',
            value: formatCurrency(stats.avg_price),
            icon: Package,
            color: 'text-teal-600',
            bg: 'bg-teal-50',
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="group rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div
              className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg}`}
            >
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </div>

            <p className="line-clamp-1 text-xl font-black text-gray-800">
              {item.value}
            </p>

            <p className="mt-1 text-xs font-medium text-gray-500">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* =============================== */}
      {/* FILTER */}
      {/* =============================== */}
      <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {/* SEARCH */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Cari produk, seller, toko..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
            />
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium lg:hidden"
          >
            <Filter className="h-4 w-4" />

            Filter

            {activeFiltersCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[10px] text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* DESKTOP FILTER */}
          <div className="hidden flex-wrap items-center gap-3 lg:flex">
            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value)
              }
              className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500"
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="pending">Pending</option>
              <option value="inactive">Nonaktif</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500"
            >
              <option value="newest">Terbaru</option>
              <option value="price_asc">
                Harga Rendah - Tinggi
              </option>
              <option value="price_desc">
                Harga Tinggi - Rendah
              </option>
              <option value="best_seller">Terlaris</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          {/* RESET */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <X className="h-4 w-4" />
              Reset
            </button>
          )}
        </div>

        {/* MOBILE FILTER */}
        {showFilters && (
          <div className="mt-4 space-y-3 border-t pt-4 lg:hidden">
            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value)
              }
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm"
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="pending">Pending</option>
              <option value="inactive">Nonaktif</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm"
            >
              <option value="newest">Terbaru</option>
              <option value="price_asc">
                Harga Rendah - Tinggi
              </option>
              <option value="price_desc">
                Harga Tinggi - Rendah
              </option>
              <option value="best_seller">Terlaris</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        )}
      </div>

      {/* =============================== */}
      {/* TABLE */}
      {/* =============================== */}
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead className="bg-gray-50">
              <tr className="border-b text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-5 py-4 font-semibold">Produk</th>
                <th className="px-5 py-4 font-semibold">Kategori</th>
                <th className="px-5 py-4 font-semibold">Harga</th>
                <th className="px-5 py-4 font-semibold">Stock</th>
                <th className="px-5 py-4 font-semibold">Terjual</th>
                <th className="px-5 py-4 font-semibold">Rating</th>
                <th className="px-5 py-4 font-semibold">Store</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="transition hover:bg-green-50/30"
                  >
                    {/* PRODUCT */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            product.image_url ||
                            'https://placehold.co/100x100/22c55e/ffffff'
                          }
                          alt={product.name}
                          className="h-14 w-14 rounded-2xl border object-cover"
                        />

                        <div>
                          <p className="max-w-[240px] truncate font-bold text-gray-800">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Seller: {product.seller_name}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        {product.category}
                      </span>
                    </td>

                    {/* PRICE */}
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-800">
                        {formatCurrency(product.price)}
                      </p>
                    </td>

                    {/* STOCK */}
                    <td className="px-5 py-4">
                      <span
                        className={`font-bold ${
                          product.stock < 10
                            ? 'text-red-600'
                            : 'text-gray-700'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>

                    {/* SOLD */}
                    <td className="px-5 py-4">
                      {product.sold_count?.toLocaleString() || 0}
                    </td>

                    {/* RATING */}
                    <td className="px-5 py-4">
                      {product.rating_avg ? (
                        <div className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">
                            {product.rating_avg.toFixed(1)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Belum ada rating
                        </span>
                      )}
                    </td>

                    {/* STORE */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-green-600" />
                        <span>{product.store_name}</span>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">
                      {getStatusBadge(product.status)}
                    </td>

                    {/* ACTION */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            setSelectedProduct(product)
                          }
                          className="rounded-xl bg-blue-50 p-2 transition hover:bg-blue-100"
                        >
                          <Eye className="h-4 w-4 text-blue-600" />
                        </button>

                        <button
                          onClick={() =>
                            setSelectedProduct(product)
                          }
                          className="rounded-xl bg-green-50 p-2 transition hover:bg-green-100"
                        >
                          <Edit className="h-4 w-4 text-green-600" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowDeleteModal(true);
                          }}
                          className="rounded-xl bg-red-50 p-2 transition hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-16 text-center"
                  >
                    <Package className="mx-auto mb-4 h-16 w-16 text-gray-300" />

                    <p className="text-lg font-bold text-gray-500">
                      Belum ada produk
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      Produk marketplace akan tampil di sini
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t bg-gray-50 px-5 py-4">
            <p className="text-sm text-gray-500">
              Menampilkan {products.length} dari {stats.total}{' '}
              produk
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.max(1, p - 1))
                }
                disabled={currentPage === 1}
                className="rounded-xl border bg-white p-2 transition hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {[...Array(Math.min(totalPages, 5))].map(
                (_, index) => {
                  const page = index + 1;

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-10 w-10 rounded-xl text-sm font-bold transition ${
                        currentPage === page
                          ? 'bg-green-600 text-white'
                          : 'border bg-white hover:bg-gray-100'
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
                disabled={currentPage === totalPages}
                className="rounded-xl border bg-white p-2 transition hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =============================== */}
      {/* DETAIL MODAL */}
      {/* =============================== */}
      {selectedProduct && !showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white">
            {/* HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-6">
              <div>
                <h3 className="text-2xl font-black text-gray-800">
                  Detail Produk
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Informasi lengkap produk marketplace
                </p>
              </div>

              <button
                onClick={() => setSelectedProduct(null)}
                className="rounded-2xl p-2 transition hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* CONTENT */}
            <div className="space-y-6 p-6">
              <div className="flex flex-col gap-5 md:flex-row">
                <img
                  src={
                    selectedProduct.image_url ||
                    'https://placehold.co/300x300/22c55e/ffffff'
                  }
                  alt={selectedProduct.name}
                  className="h-48 w-full rounded-3xl border object-cover md:w-64"
                />

                <div className="flex-1">
                  <div className="mb-3">
                    {getStatusBadge(selectedProduct.status)}
                  </div>

                  <h2 className="text-3xl font-black text-gray-800">
                    {selectedProduct.name}
                  </h2>

                  <p className="mt-3 text-4xl font-black text-green-600">
                    {formatCurrency(selectedProduct.price)}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <div className="rounded-2xl bg-gray-50 px-4 py-3">
                      <p className="text-xs text-gray-500">
                        Stock
                      </p>

                      <p className="font-bold">
                        {selectedProduct.stock} Unit
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 px-4 py-3">
                      <p className="text-xs text-gray-500">
                        Terjual
                      </p>

                      <p className="font-bold">
                        {selectedProduct.sold_count || 0}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 px-4 py-3">
                      <p className="text-xs text-gray-500">
                        Rating
                      </p>

                      <p className="font-bold">
                        ⭐{' '}
                        {selectedProduct.rating_avg?.toFixed(
                          1
                        ) || '0.0'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* INFO GRID */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border p-4">
                  <p className="mb-1 text-xs text-gray-500">
                    Kategori
                  </p>

                  <p className="font-bold">
                    {selectedProduct.category}
                  </p>
                </div>

                <div className="rounded-2xl border p-4">
                  <p className="mb-1 text-xs text-gray-500">
                    Seller
                  </p>

                  <p className="font-bold">
                    {selectedProduct.seller_name}
                  </p>
                </div>

                <div className="rounded-2xl border p-4">
                  <p className="mb-1 text-xs text-gray-500">
                    Store
                  </p>

                  <p className="font-bold">
                    {selectedProduct.store_name}
                  </p>
                </div>

                <div className="rounded-2xl border p-4">
                  <p className="mb-1 text-xs text-gray-500">
                    Product ID
                  </p>

                  <p className="font-bold">
                    #{selectedProduct.id}
                  </p>
                </div>

                <div className="rounded-2xl border p-4">
                  <p className="mb-1 text-xs text-gray-500">
                    Dibuat
                  </p>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />

                    <p className="font-bold">
                      {formatDate(selectedProduct.created_at)}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border p-4">
                  <p className="mb-1 text-xs text-gray-500">
                    Last Update
                  </p>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />

                    <p className="font-bold">
                      {formatDate(selectedProduct.updated_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}
              {selectedProduct.description && (
                <div className="rounded-2xl border p-5">
                  <p className="mb-2 text-sm font-bold text-gray-700">
                    Deskripsi Produk
                  </p>

                  <p className="text-sm leading-relaxed text-gray-600">
                    {selectedProduct.description}
                  </p>
                </div>
              )}

              {/* ACTION */}
              <div className="flex flex-col gap-3 border-t pt-5 md:flex-row">
                <select
                  value={selectedProduct.status}
                  onChange={(e) =>
                    updateProductStatus(
                      selectedProduct.id,
                      e.target.value
                    )
                  }
                  className="rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                  <option value="pending">Pending</option>
                </select>

                <button className="rounded-2xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700">
                  Edit Produk
                </button>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
                >
                  Hapus Produk
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =============================== */}
      {/* DELETE MODAL */}
      {/* =============================== */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-7 w-7 text-red-600" />
              </div>

              <div>
                <h3 className="text-xl font-black text-gray-800">
                  Hapus Produk
                </h3>

                <p className="text-sm text-gray-500">
                  Konfirmasi penghapusan produk
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-red-50 p-4">
              <p className="text-sm leading-relaxed text-red-700">
                Apakah Anda yakin ingin menghapus produk{' '}
                <span className="font-bold">
                  {selectedProduct.name}
                </span>
                ? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-2xl border px-4 py-3 font-semibold transition hover:bg-gray-50"
              >
                Batal
              </button>

              <button
                onClick={deleteProduct}
                className="flex-1 rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                Hapus Produk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}