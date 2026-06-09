'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Printer,
  MapPin,
  CreditCard,
  Calendar,
  User,
  Phone,
  Store,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Download,
  TrendingUp,
  Shield
} from 'lucide-react';

// IMPORT state yang sudah direname
import { useUserStore } from '../../state/user';

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
  store_phone?: string;
  product_id: number;
  product_name?: string;
  product_image?: string;
  product_price?: number;
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
  shipping_cost?: number;
  shipping_address?: {
    name: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
  };
  tracking_number?: string;
  tracking_courier?: string;
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
  if (!dateString) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'full',
    timeStyle: 'long',
  }).format(new Date(dateString));
};

const formatDateShort = (dateString: string) => {
  if (!dateString) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateString));
};

const getStatusConfig = (status: Order['status']) => {
  const config = {
    pending: { 
      label: 'Menunggu Pembayaran', 
      color: 'bg-yellow-100 text-yellow-700', 
      border: 'border-yellow-200',
      bgLight: 'bg-yellow-50',
      icon: Clock, 
      step: 1,
      description: 'Silakan selesaikan pembayaran Anda sebelum pesanan diproses.',
      badge: '🟡'
    },
    processing: { 
      label: 'Diproses', 
      color: 'bg-blue-100 text-blue-700', 
      border: 'border-blue-200',
      bgLight: 'bg-blue-50',
      icon: Package, 
      step: 2,
      description: 'Penjual sedang memproses pesanan Anda.',
      badge: '🔵'
    },
    shipped: { 
      label: 'Dikirim', 
      color: 'bg-purple-100 text-purple-700', 
      border: 'border-purple-200',
      bgLight: 'bg-purple-50',
      icon: Truck, 
      step: 3,
      description: 'Pesanan sedang dalam perjalanan menuju alamat Anda.',
      badge: '📦'
    },
    delivered: { 
      label: 'Terkirim', 
      color: 'bg-green-100 text-green-700', 
      border: 'border-green-200',
      bgLight: 'bg-green-50',
      icon: CheckCircle, 
      step: 4,
      description: 'Pesanan telah sampai di tujuan. Konfirmasikan jika sudah diterima.',
      badge: '✅'
    },
    completed: { 
      label: 'Selesai', 
      color: 'bg-emerald-100 text-emerald-700', 
      border: 'border-emerald-200',
      bgLight: 'bg-emerald-50',
      icon: CheckCircle, 
      step: 5,
      description: 'Pesanan telah selesai. Terima kasih telah berbelanja di AgroHub!',
      badge: '🏆'
    },
    cancelled: { 
      label: 'Dibatalkan', 
      color: 'bg-red-100 text-red-700', 
      border: 'border-red-200',
      bgLight: 'bg-red-50',
      icon: XCircle, 
      step: 0,
      description: 'Pesanan ini telah dibatalkan.',
      badge: '❌'
    },
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
    cash_on_delivery: 'Bayar di Tempat (COD)',
    e_wallet: 'E-Wallet',
  };
  return methods[method] || method.replace('_', ' ').toUpperCase();
};

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, fetchProfile } = useUserStore();
  
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Fetch order detail dari API
  const fetchOrderDetail = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      setLoading(true);
      
      // Panggil endpoint order detail
      const response = await axios.get(`${API_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success || response.data.data) {
        const orderData = response.data.data || response.data;
        setOrder(transformOrderData(orderData));
      } else {
        // Fallback ke data demo jika API belum ready
        const demoOrder = getDemoOrderDetail(orderId);
        if (demoOrder) {
          setOrder(demoOrder);
          toast.error('API belum siap, menampilkan data demo');
        } else {
          toast.error('Pesanan tidak ditemukan');
          router.push('/orders');
        }
      }
    } catch (error: any) {
      console.error('Failed to fetch order detail:', error);
      
      if (error.response?.status === 404) {
        const demoOrder = getDemoOrderDetail(orderId);
        if (demoOrder) {
          setOrder(demoOrder);
          toast.error('API belum siap, menampilkan data demo');
        } else {
          toast.error('Pesanan tidak ditemukan');
          router.push('/orders');
        }
      } else if (error.response?.status === 401) {
        router.push('/login');
      } else {
        toast.error('Gagal memuat detail pesanan');
      }
    } finally {
      setLoading(false);
    }
  }, [orderId, router]);

  // Transform data dari API ke format frontend
  const transformOrderData = (data: any): Order => {
    return {
      id: data.id,
      order_code: data.order_code,
      user_id: data.user_id,
      store_id: data.store_id,
      store_name: data.store_name || data.store?.name || `Toko ${data.store_id}`,
      store_logo: data.store_logo || data.store?.logo || '/placeholder-store.png',
      store_phone: data.store_phone || data.store?.phone,
      product_id: data.product_id,
      product_name: data.product_name || data.product?.name || `Produk ${data.product_id}`,
      product_image: data.product_image || data.product?.image_url || '/placeholder-product.png',
      product_price: data.product_price || data.product?.price,
      quantity: data.quantity || 1,
      total_price: Number(data.total_price || 0),
      total_amount: Number(data.total_amount || data.total_price || 0),
      status: data.status || 'pending',
      payment_status: data.payment_status || 'unpaid',
      payment_method: data.payment_method || 'bank_transfer',
      snap_token: data.snap_token,
      redirect_url: data.redirect_url,
      paid_at: data.paid_at,
      cancelled_at: data.cancelled_at,
      created_at: data.created_at,
      updated_at: data.updated_at,
      shipping_cost: data.shipping_cost || 0,
      tracking_number: data.tracking_number,
      tracking_courier: data.tracking_courier,
      shipping_address: data.shipping_address || {
        name: user?.name || 'Alamat Belum Diisi',
        phone: user?.phone || '-',
        address: data.shipping_address_raw || 'Jl. Contoh No. 123',
        city: data.shipping_city || 'Kota Contoh',
        province: data.shipping_province || 'Provinsi Contoh',
        postal_code: data.shipping_postal_code || '12345',
      },
    };
  };

  // Data demo untuk development (sesuai database real)
  const getDemoOrderDetail = (id: string): Order | null => {
    const demoOrders: Record<string, Order> = {
      '1': {
        id: 1,
        order_code: 'ORD-20231201-001',
        user_id: 3,
        store_id: 23,
        store_name: 'AgroHub Farmer Collective',
        store_logo: '/placeholder-store.png',
        store_phone: '08123456789',
        product_id: 436,
        product_name: 'Beras Organik Premium 5kg',
        product_image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a',
        product_price: 75000,
        quantity: 2,
        total_price: 150000,
        total_amount: 165000,
        status: 'delivered',
        payment_status: 'paid',
        payment_method: 'bank_transfer',
        paid_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        shipping_cost: 15000,
        tracking_number: 'JNE1234567890',
        tracking_courier: 'JNE',
        shipping_address: {
          name: 'Tri Endah Ariwati',
          phone: '081234567890',
          address: 'Jl. Pajajaran No. 88, Bogor Tengah',
          city: 'Bogor',
          province: 'Jawa Barat',
          postal_code: '16128',
        },
      },
      '2': {
        id: 2,
        order_code: 'ORD-20231205-002',
        user_id: 3,
        store_id: 25,
        store_name: 'AgroHub Herd Center',
        store_logo: '/placeholder-store.png',
        store_phone: '081298765432',
        product_id: 444,
        product_name: 'Sapi Potong Simental 300kg',
        product_image: '/gambar/simental.png',
        product_price: 19500000,
        quantity: 1,
        total_price: 19500000,
        total_amount: 19550000,
        status: 'processing',
        payment_status: 'paid',
        payment_method: 'qris',
        paid_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        shipping_cost: 50000,
        shipping_address: {
          name: 'Tri Endah Ariwati',
          phone: '081234567890',
          address: 'Jl. Pajajaran No. 88, Bogor Tengah',
          city: 'Bogor',
          province: 'Jawa Barat',
          postal_code: '16128',
        },
      },
      '3': {
        id: 3,
        order_code: 'ORD-20231210-003',
        user_id: 3,
        store_id: 7,
        store_name: 'AgroHub Aqua Store',
        store_logo: '/placeholder-store.png',
        store_phone: '081355577788',
        product_id: 440,
        product_name: 'Bibit Lele Sangkuriang 100 Ekor',
        product_image: '/gambar/bibitlele.png',
        product_price: 45000,
        quantity: 1,
        total_price: 45000,
        total_amount: 60000,
        status: 'pending',
        payment_status: 'unpaid',
        payment_method: 'bank_transfer',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        shipping_cost: 15000,
        shipping_address: {
          name: 'Tri Endah Ariwati',
          phone: '081234567890',
          address: 'Jl. Pajajaran No. 88, Bogor Tengah',
          city: 'Bogor',
          province: 'Jawa Barat',
          postal_code: '16128',
        },
      },
    };
    
    return demoOrders[id] || null;
  };

  // Handle cancel order
  const handleCancelOrder = async () => {
    if (!confirm(`Yakin ingin membatalkan pesanan ${order?.order_code}?`)) return;
    
    setCancelling(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Pesanan berhasil dibatalkan');
      fetchOrderDetail(); // Refresh data
    } catch (error: any) {
      console.error('Cancel order error:', error);
      if (error.response?.status === 404) {
        // Demo mode: update local state
        setOrder(prev => prev ? { ...prev, status: 'cancelled', payment_status: 'refunded' } : null);
        toast.success('Pesanan berhasil dibatalkan (Demo)');
      } else {
        toast.error(error.response?.data?.message || 'Gagal membatalkan pesanan');
      }
    } finally {
      setCancelling(false);
    }
  };

  // Handle payment
  const handlePayment = async () => {
    if (order?.redirect_url) {
      window.open(order.redirect_url, '_blank');
    } else {
      // Try to create payment session
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/orders/${orderId}/pay`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.redirect_url) {
          window.open(response.data.redirect_url, '_blank');
        } else {
          toast.error('Link pembayaran tidak tersedia');
        }
      } catch (error: any) {
        console.error('Payment error:', error);
        if (error.response?.status === 404) {
          toast.error('Fitur pembayaran belum tersedia di demo mode');
        } else {
          toast.error('Gagal memproses pembayaran');
        }
      }
    }
  };

  // Handle confirm receipt
  const handleConfirmReceipt = async () => {
    if (!confirm('Konfirmasi bahwa pesanan sudah diterima dengan baik?')) return;
    
    setConfirming(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/orders/${orderId}/confirm`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Pesanan dikonfirmasi! Terima kasih.');
      fetchOrderDetail();
    } catch (error: any) {
      console.error('Confirm receipt error:', error);
      if (error.response?.status === 404) {
        // Demo mode: update local state
        setOrder(prev => prev ? { ...prev, status: 'completed' } : null);
        toast.success('Pesanan dikonfirmasi! Terima kasih (Demo)');
      } else {
        toast.error('Gagal mengkonfirmasi pesanan');
      }
    } finally {
      setConfirming(false);
    }
  };

  // Copy order code
  const copyOrderCode = () => {
    if (order?.order_code) {
      navigator.clipboard.writeText(order.order_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Kode pesanan disalin');
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    // Check auth dan fetch profile
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    if (!user) {
      fetchProfile();
    }
    
    fetchOrderDetail();
  }, [fetchOrderDetail, fetchProfile, router, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-500">Memuat detail pesanan...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700">Pesanan Tidak Ditemukan</h2>
          <p className="text-slate-500 mt-2">Pesanan yang Anda cari tidak tersedia</p>
          <Link href="/orders" className="inline-block mt-4 text-green-600 hover:text-green-700">
            Kembali ke Daftar Pesanan
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const paymentConfig = getPaymentStatusConfig(order.payment_status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 print:py-0 print:bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 print:max-w-none print:px-0">
        
        {/* Header - Hidden when printing */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link href="/orders" className="flex items-center gap-2 text-slate-600 hover:text-green-600 transition">
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Pesanan
          </Link>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-white transition"
            >
              <Printer className="w-4 h-4" />
              Cetak
            </button>
          </div>
        </div>

        {/* Order Code Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 print:shadow-none print:border print:border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Kode Pesanan</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="font-mono font-bold text-xl text-slate-700">{order.order_code}</p>
                <button
                  onClick={copyOrderCode}
                  className="p-1 hover:bg-slate-100 rounded-lg transition print:hidden"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-slate-400" />}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">Dibuat: {formatDateShort(order.created_at)}</p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.color} ${statusConfig.bgLight} border ${statusConfig.border}`}>
                <StatusIcon className="w-4 h-4" />
                <span className="font-medium">{statusConfig.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Info Card */}
        <div className={`rounded-xl border ${statusConfig.border} ${statusConfig.bgLight} p-4 mb-6`}>
          <div className="flex gap-3">
            <StatusIcon className="w-6 h-6 text-current shrink-0" />
            <div>
              <p className="font-semibold text-slate-700">Status Pesanan: {statusConfig.label}</p>
              <p className="text-sm text-slate-600 mt-1">{statusConfig.description}</p>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h2 className="font-semibold text-slate-700">Detail Produk</h2>
          </div>
          <div className="p-4 flex gap-4">
            <div className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden shrink-0">
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
              <div className="mt-2 space-y-1 text-sm">
                <p className="text-slate-500">Harga: {formatCurrency(order.product_price || order.total_price / order.quantity)}</p>
                <p className="text-slate-500">Jumlah: {order.quantity}</p>
                <p className="font-medium text-green-600">Subtotal: {formatCurrency(order.total_price)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Store Info */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
            <Store className="w-5 h-5 text-green-600" />
            <h2 className="font-semibold text-slate-700">Informasi Toko</h2>
          </div>
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden">
                <img
                  src={order.store_logo}
                  alt={order.store_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-store.png';
                  }}
                />
              </div>
              <div className="flex-1">
                <Link href={`/stores/${order.store_id}`} className="font-semibold text-slate-700 hover:text-green-600">
                  {order.store_name}
                </Link>
                {order.store_phone && (
                  <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                    <Phone className="w-4 h-4" />
                    <span>{order.store_phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Info & Payment Summary */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Alamat Pengiriman */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <h2 className="font-semibold text-slate-700">Alamat Pengiriman</h2>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-slate-400" />
                <span>{order.shipping_address?.name || 'Tidak tersedia'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{order.shipping_address?.phone || '-'}</span>
              </div>
              <div className="text-sm text-slate-600 mt-3 pt-2 border-t border-slate-100">
                <p>{order.shipping_address?.address || '-'}</p>
                <p className="mt-1">{order.shipping_address?.city}, {order.shipping_address?.province}</p>
                <p>Kode Pos: {order.shipping_address?.postal_code || '-'}</p>
              </div>
              {order.tracking_number && (
                <div className="mt-3 pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-500">Nomor Resi</p>
                  <p className="text-sm font-mono font-medium">{order.tracking_number}</p>
                  <p className="text-xs text-slate-400">Kurir: {order.tracking_courier}</p>
                </div>
              )}
            </div>
          </div>

          {/* Ringkasan Pembayaran */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-600" />
              <h2 className="font-semibold text-slate-700">Ringkasan Pembayaran</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total Belanja</span>
                <span className="font-medium">{formatCurrency(order.total_price)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Biaya Pengiriman</span>
                <span className="font-medium">{formatCurrency(order.shipping_cost || 0)}</span>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Total Tagihan</span>
                  <span className="font-bold text-green-600 text-lg">{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Metode Pembayaran</span>
                <span className="font-medium">{getPaymentMethodLabel(order.payment_method)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Status Pembayaran</span>
                <span className={`font-medium ${paymentConfig.color}`}>
                  {paymentConfig.label}
                </span>
              </div>
              {order.paid_at && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tanggal Bayar</span>
                  <span className="font-medium">{formatDateShort(order.paid_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline / Riwayat */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <h2 className="font-semibold text-slate-700">Riwayat Pesanan</h2>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Dibuat pada</span>
                <span className="text-slate-700">{formatDate(order.created_at)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Terakhir diperbarui</span>
                <span className="text-slate-700">{formatDate(order.updated_at)}</span>
              </div>
              {order.paid_at && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Dibayar pada</span>
                  <span className="text-slate-700">{formatDate(order.paid_at)}</span>
                </div>
              )}
              {order.cancelled_at && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Dibatalkan pada</span>
                  <span className="text-slate-700">{formatDate(order.cancelled_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 print:hidden">
          {order.status === 'pending' && order.payment_status === 'unpaid' && (
            <>
              <button
                onClick={handlePayment}
                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
              >
                Bayar Sekarang
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="px-6 py-3 border border-red-500 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition disabled:opacity-50"
              >
                {cancelling ? 'Membatalkan...' : 'Batalkan Pesanan'}
              </button>
            </>
          )}
          
          {order.status === 'delivered' && order.payment_status === 'paid' && (
            <button
              onClick={handleConfirmReceipt}
              disabled={confirming}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {confirming ? 'Mengkonfirmasi...' : 'Konfirmasi Pesanan Selesai'}
            </button>
          )}
          
          {order.status === 'completed' && (
            <Link
              href={`/products/${order.product_id}/review`}
              className="flex-1 py-3 text-center border border-green-600 text-green-600 rounded-xl font-semibold hover:bg-green-50 transition"
            >
              Beri Ulasan Produk
            </Link>
          )}
          
          {(order.status === 'shipped' || order.status === 'delivered') && order.tracking_number && (
            <button className="flex-1 py-3 border border-slate-300 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition">
              Lacak Pengiriman
            </button>
          )}
        </div>

        {/* Need Help? */}
        <div className="mt-8 p-4 bg-slate-50 rounded-xl text-center print:hidden">
          <p className="text-sm text-slate-600">
            Ada masalah dengan pesanan?{' '}
            <Link href="/help" className="text-green-600 font-semibold hover:text-green-700">
              Hubungi Bantuan
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}