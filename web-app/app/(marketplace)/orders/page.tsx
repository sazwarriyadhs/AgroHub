'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck,
  Eye,
  Search,
  Store,
  ChevronRight,
  Calendar,
  CreditCard,
  AlertCircle
} from 'lucide-react';

// IMPORT state yang sudah direname
import { useUserStore } from '../state/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

// ======================================================
// TYPES - Sesuai dengan struktur database
// ======================================================

interface Order {
  id: number;
  order_code: string;
  user_id: number;
  store_id: number;
  store_name?: string;
  store_logo?: string;
  product_id: number;
  product_name?: string;
  product_image?: string;
  quantity: number;
  total_price: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'completed';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  payment_method: string;
  snap_token?: string;
  redirect_url?: string;
  paid_at?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
}

// ======================================================
// HELPER FUNCTIONS
// ======================================================

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value || 0);
};

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateString));
};

const getStatusConfig = (status: Order['status']) => {
  const config = {
    pending: { label: 'Menunggu Pembayaran', color: 'bg-yellow-100 text-yellow-700', border: 'border-yellow-200', icon: Clock, badge: '🟡' },
    processing: { label: 'Diproses', color: 'bg-blue-100 text-blue-700', border: 'border-blue-200', icon: Package, badge: '🔵' },
    shipped: { label: 'Dikirim', color: 'bg-purple-100 text-purple-700', border: 'border-purple-200', icon: Truck, badge: '📦' },
    delivered: { label: 'Terkirim', color: 'bg-green-100 text-green-700', border: 'border-green-200', icon: CheckCircle, badge: '✅' },
    completed: { label: 'Selesai', color: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200', icon: CheckCircle, badge: '🏆' },
    cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700', border: 'border-red-200', icon: XCircle, badge: '❌' },
  };
  return config[status] || config.pending;
};

const getPaymentStatusConfig = (status: Order['payment_status']) => {
  const config = {
    unpaid: { label: 'Belum Dibayar', color: 'bg-red-100 text-red-700', icon: AlertCircle },
    paid: { label: 'Sudah Dibayar', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    refunded: { label: 'Dikembalikan', color: 'bg-gray-100 text-gray-700', icon: XCircle },
  };
  return config[status];
};

const getPaymentMethodLabel = (method: string) => {
  const methods: Record<string, string> = {
    bank_transfer: 'Bank Transfer',
    qris: 'QRIS',
    credit_card: 'Kartu Kredit',
    cash_on_delivery: 'Bayar di Tempat',
    e_wallet: 'E-Wallet',
  };
  return methods[method] || method;
};

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function OrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated, fetchProfile } = useUserStore();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Order['status'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch orders dari API
  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      setLoading(true);
      
      // Panggil endpoint orders
      const response = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success || response.data.data) {
        let ordersData = response.data.data || response.data;
        
        if (Array.isArray(ordersData)) {
          // Transform data sesuai kebutuhan frontend
          const transformedOrders = ordersData.map((order: any) => ({
            id: order.id,
            order_code: order.order_code,
            user_id: order.user_id,
            store_id: order.store_id,
            store_name: order.store_name || `Toko ${order.store_id}`,
            store_logo: order.store_logo || '/placeholder-store.png',
            product_id: order.product_id,
            product_name: order.product_name || `Produk ${order.product_id}`,
            product_image: order.product_image || '/placeholder-product.png',
            quantity: order.quantity || 1,
            total_price: Number(order.total_price || 0),
            total_amount: Number(order.total_amount || order.total_price || 0),
            status: order.status || 'pending',
            payment_status: order.payment_status || 'unpaid',
            payment_method: order.payment_method || 'bank_transfer',
            snap_token: order.snap_token,
            redirect_url: order.redirect_url,
            paid_at: order.paid_at,
            cancelled_at: order.cancelled_at,
            created_at: order.created_at,
            updated_at: order.updated_at,
          }));
          setOrders(transformedOrders);
        } else {
          setOrders([]);
        }
      } else {
        // Jika API belum ready, gunakan data demo
        setOrders(getDemoOrders());
      }
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      
      // Jika error karena endpoint belum ada, tampilkan demo data
      if (error.response?.status === 404) {
        console.log('Endpoint orders belum tersedia, menggunakan demo data');
        setOrders(getDemoOrders());
        toast.error('Endpoint API belum siap, menampilkan data demo');
      } else if (error.response?.status === 401) {
        router.push('/login');
      } else {
        toast.error('Gagal memuat pesanan');
        setOrders(getDemoOrders());
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Data demo untuk development (sesuai struktur database)
  const getDemoOrders = (): Order[] => {
    return [
      {
        id: 1,
        order_code: 'ORD-20231201-001',
        user_id: 1,
        store_id: 23,
        store_name: 'AgroHub Farmer Collective',
        store_logo: '/placeholder-store.png',
        product_id: 436,
        product_name: 'Beras Organik Premium 5kg',
        product_image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a',
        quantity: 2,
        total_price: 150000,
        total_amount: 165000,
        status: 'delivered',
        payment_status: 'paid',
        payment_method: 'bank_transfer',
        paid_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        order_code: 'ORD-20231205-002',
        user_id: 1,
        store_id: 25,
        store_name: 'AgroHub Herd Center',
        store_logo: '/placeholder-store.png',
        product_id: 444,
        product_name: 'Sapi Potong Simental 300kg',
        product_image: '/gambar/simental.png',
        quantity: 1,
        total_price: 19500000,
        total_amount: 19550000,
        status: 'processing',
        payment_status: 'paid',
        payment_method: 'qris',
        paid_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 3,
        order_code: 'ORD-20231210-003',
        user_id: 1,
        store_id: 7,
        store_name: 'AgroHub Aqua Store',
        store_logo: '/placeholder-store.png',
        product_id: 440,
        product_name: 'Bibit Lele Sangkuriang 100 Ekor',
        product_image: '/gambar/bibitlele.png',
        quantity: 1,
        total_price: 45000,
        total_amount: 60000,
        status: 'pending',
        payment_status: 'unpaid',
        payment_method: 'bank_transfer',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 4,
        order_code: 'ORD-20231208-004',
        user_id: 1,
        store_id: 24,
        store_name: 'AgroHub Aqua Network',
        store_logo: '/placeholder-store.png',
        product_id: 441,
        product_name: 'Pakan Ikan Protein 1kg',
        product_image: '/gambar/PakanIkanProtein.png',
        quantity: 5,
        total_price: 110000,
        total_amount: 125000,
        status: 'shipped',
        payment_status: 'paid',
        payment_method: 'qris',
        paid_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 5,
        order_code: 'ORD-20231203-005',
        user_id: 1,
        store_id: 19,
        store_name: 'AgroHub Vendor Store',
        store_logo: '/placeholder-store.png',
        product_id: 438,
        product_name: 'Cabai Merah Grade A 1kg',
        product_image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38',
        quantity: 3,
        total_price: 105000,
        total_amount: 120000,
        status: 'cancelled',
        payment_status: 'refunded',
        payment_method: 'bank_transfer',
        paid_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        cancelled_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  };

  // Filter orders berdasarkan status
  const filteredOrders = orders.filter(order => {
    if (filter !== 'all' && order.status !== filter) return false;
    if (searchQuery) {
      return order.order_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
             order.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
             order.store_name?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  // Status counts
  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  // Handle cancel order
  const handleCancelOrder = async (orderId: number, orderCode: string) => {
    if (!confirm(`Yakin ingin membatalkan pesanan ${orderCode}?`)) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Pesanan berhasil dibatalkan');
      fetchOrders(); // Refresh list
    } catch (error) {
      toast.error('Gagal membatalkan pesanan');
    }
  };

  // Handle payment
  const handlePayment = async (order: Order) => {
    if (order.redirect_url) {
      window.open(order.redirect_url, '_blank');
    } else {
      toast.error('Link pembayaran tidak tersedia');
    }
  };

  useEffect(() => {
    // Cek auth dan fetch profile
    const token = localStorage.getItem('token');
    if (token && !user) {
      fetchProfile();
    }
    fetchOrders();
  }, [fetchOrders, fetchProfile, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-500">Memuat pesanan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Pesanan Saya</h1>
          <p className="text-slate-500 mt-1">Kelola dan lacak semua pesanan Anda</p>
        </div>

        {/* Status Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 mb-6 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {Object.entries(statusCounts).map(([key, count]) => {
              const isActive = filter === key;
              let label = '';
              switch (key) {
                case 'all': label = 'Semua'; break;
                case 'pending': label = 'Menunggu Bayar'; break;
                case 'processing': label = 'Diproses'; break;
                case 'shipped': label = 'Dikirim'; break;
                case 'delivered': label = 'Terkirim'; break;
                case 'completed': label = 'Selesai'; break;
                case 'cancelled': label = 'Dibatalkan'; break;
                default: label = key;
              }
              
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key as typeof filter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-green-50'
                  }`}
                >
                  {label}
                  {count > 0 && (
                    <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                      isActive ? 'bg-white text-green-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan kode pesanan, produk, atau toko..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-white focus:border-green-500 focus:outline-none transition"
          />
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">Belum ada pesanan</h3>
            <p className="text-slate-500 mt-2">Mulai berbelanja di AgroHub</p>
            <Link
              href="/"
              className="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Belanja Sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const paymentConfig = getPaymentStatusConfig(order.payment_status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <Store className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-500">{order.store_name}</p>
                        <p className="font-mono text-xs text-slate-400">{order.order_code}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm text-slate-500">{formatDate(order.created_at)}</p>
                        <p className="font-bold text-green-600">{formatCurrency(order.total_amount)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          {statusConfig.badge} {statusConfig.label}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentConfig.color}`}>
                          {paymentConfig.label}
                        </span>
                      </div>
                      <Link
                        href={`/orders/${order.id}`}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        Detail
                      </Link>
                    </div>
                  </div>

                  {/* Order Item Preview */}
                  <div className="p-4 flex gap-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={order.product_image}
                        alt={order.product_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-product.png';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <Link href={`/products/${order.product_id}`} className="font-semibold text-slate-700 hover:text-green-600">
                        {order.product_name}
                      </Link>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500">
                        <span>Jumlah: {order.quantity}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>{formatCurrency(order.total_price)}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          {getPaymentMethodLabel(order.payment_method)}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 p-4 bg-slate-50 border-t border-slate-200">
                    {order.status === 'pending' && order.payment_status === 'unpaid' && (
                      <>
                        <button
                          onClick={() => handlePayment(order)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                        >
                          Bayar Sekarang
                        </button>
                        <button
                          onClick={() => handleCancelOrder(order.id, order.order_code)}
                          className="px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition text-sm font-medium"
                        >
                          Batalkan Pesanan
                        </button>
                      </>
                    )}
                    {order.status === 'delivered' && order.payment_status === 'paid' && (
                      <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium">
                        Konfirmasi Selesai
                      </button>
                    )}
                    {order.status === 'completed' && (
                      <Link
                        href={`/products/${order.product_id}/review`}
                        className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition text-sm font-medium"
                      >
                        Beri Ulasan
                      </Link>
                    )}
                    {(order.status === 'shipped' || order.status === 'delivered') && (
                      <button className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition text-sm font-medium">
                        Lacak Pengiriman
                      </button>
                    )}
                    <Link
                      href={`/orders/${order.id}`}
                      className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition text-sm font-medium"
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}