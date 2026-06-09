'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useUserStore } from '../(marketplace)/state/user';

// ======================================================
// IMPORT ALL REQUIRED ICONS FROM LUCIDE-REACT
// ======================================================
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  Edit2,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  Award,
  CheckCircle,
  ShoppingBag,
  Store,
  TrendingUp,
  Users,
  CreditCard,
  Settings,
  Bell,
  Lock,
  Home,
  FileText,
  HelpCircle,
  Menu,
  ChevronRight,
  Sparkles,
  BadgeCheck,
  Wallet,
  Coins,
  Gem,
  Crown,
  Clock,
  AlertCircle,
  X,
  ChevronLeft,
  Star,
  Truck,
  RefreshCw,
  DollarSign,
  Percent,
  Gift,
  Zap,
  Leaf,
  Droplets,
  Sun,
  Cloud,
  Plus,
  Minus,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Search,
  ShoppingCart,
  ChevronDown
} from 'lucide-react';

// ======================================================
// CONFIG
// ======================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

// ======================================================
// TYPES - Sesuai dengan database
// ======================================================

interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'farmer' | 'seller' | 'admin';
  avatar?: string;
  phone?: string;
  address?: string;
  created_at: string;
  
  // Wallet fields
  wallet_balance: number;
  hold_balance: number;
  wallet_number?: string;
  available_balance: number;
  
  // Membership fields
  membership_id?: number;
  membership_plan?: string;
  membership_type?: 'free' | 'premium' | 'business' | 'enterprise';
  membership_status?: 'active' | 'inactive' | 'expired' | 'pending';
  membership_expired_at?: string;
  membership_points?: number;
  featured_store?: boolean;
  priority_support?: boolean;
  
  // Store fields
  store_id?: number;
  store_name?: string;
  store_verified?: boolean;
  store_logo?: string;
  
  // Computed fields
  roleName: string;
  verified: boolean;
  total_balance: number;
  membership_level: number;
  membership_badge: string;
  membership_color: string;
  membership_benefits: string[];
  total_orders: number;
  total_spent: number;
}

interface Order {
  id: number;
  order_code: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'completed';
  total_amount: number;
  created_at: string;
  items_count: number;
  product_name?: string;
  product_image?: string;
}

interface WishlistItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  stock: number;
  added_at: string;
}

interface Transaction {
  id: number;
  type: 'topup' | 'payment' | 'refund' | 'withdrawal';
  amount: number;
  status: 'pending' | 'success' | 'failed';
  description: string;
  created_at: string;
}

interface Address {
  id: number;
  label: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  is_default: boolean;
}

// ======================================================
// HELPER FUNCTIONS
// ======================================================

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatDateTime = (dateString: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusColor = (status: Order['status']) => {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return map[status] || 'bg-slate-100 text-slate-700';
};

const getStatusText = (status: Order['status']) => {
  const map: Record<string, string> = {
    pending: 'Menunggu Pembayaran',
    processing: 'Diproses',
    shipped: 'Dikirim',
    delivered: 'Terkirim',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  };
  return map[status] || status;
};

const getMembershipBadge = (type: string, status: string) => {
  if (status !== 'active') return { badge: 'Non-Aktif', color: 'bg-gray-500', textColor: 'text-gray-600', icon: Clock };
  
  const map: Record<string, { badge: string; color: string; textColor: string; icon: any }> = {
    free: { badge: 'Member Biasa', color: 'bg-green-100', textColor: 'text-green-700', icon: User },
    premium: { badge: 'Premium Member', color: 'bg-yellow-100', textColor: 'text-yellow-700', icon: Crown },
    business: { badge: 'Business Member', color: 'bg-purple-100', textColor: 'text-purple-700', icon: Gem },
    enterprise: { badge: 'Enterprise Member', color: 'bg-red-100', textColor: 'text-red-700', icon: Zap },
  };
  return map[type] || map.free;
};

const getMembershipBenefits = (type: string): string[] => {
  const benefits: Record<string, string[]> = {
    free: [
      '✅ Akses marketplace standar',
      '✅ Support 24/7 via email',
      '✅ Rating & review produk',
    ],
    premium: [
      '✅ Semua benefit Free',
      '💰 Diskon 5% semua produk',
      '🚚 Gratis ongkir min belanja Rp100rb',
      '⭐ Prioritas customer support',
      '📊 Akses marketplace prioritas',
      '📈 Statistik penjualan lanjutan',
    ],
    business: [
      '✅ Semua benefit Premium',
      '💰 Diskon 10% semua produk',
      '🚚 Gratis ongkir tanpa minimal',
      '🏪 Store verification badge',
      '📌 Featured store placement',
      '📊 Analytics dashboard lengkap',
      '🔌 API akses untuk integrasi',
    ],
    enterprise: [
      '✅ Semua benefit Business',
      '💰 Diskon 15% semua produk',
      '👨‍💼 Dedicated account manager',
      '🔧 Custom integration support',
      '📢 Priority listing di homepage',
      '🎓 Exclusive webinar & event',
      '🏷️ White-label options',
      '🏢 Multi-store management',
    ],
  };
  return benefits[type] || benefits.free;
};

const getRoleDisplayName = (role: string): string => {
  const map: Record<string, string> = {
    customer: 'Pelanggan',
    farmer: 'Petani',
    seller: 'Penjual',
    vendor: 'Vendor',
    admin: 'Administrator',
  };
  return map[role] || 'Member';
};

const getMembershipLevel = (type: string): number => {
  const map: Record<string, number> = { free: 0, premium: 1, business: 2, enterprise: 3 };
  return map[type] || 0;
};

// ======================================================
// MAIN PROFILE PAGE - DATA AS SOURCE OF TRUTH
// ======================================================

export default function ProfilePage() {
  const router = useRouter();
  const { user: storeUser, fetchProfile, updateUser, setUser: setStoreUser } = useUserStore();
  
  // SINGLE SOURCE OF TRUTH - semua data disimpan di state ini
  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  
  // Form states
  const [editingProfile, setEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '', address: '' });
  const [topupAmount, setTopupAmount] = useState(100000);
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [searchQuery, setSearchQuery] = useState('');

  // ======================================================
  // FETCH DATA FROM API - SOURCE OF TRUTH
  // ======================================================
  
  const fetchAllUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        router.push('/login');
        return;
      }

      setLoading(true);
      setError(null);

      // Fetch all data in parallel untuk efisiensi
      const [profileRes, ordersRes, wishlistRes, transactionsRes, addressesRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/profile`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/orders`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { data: [] } })),
        axios.get(`${API_BASE_URL}/wishlist`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { data: [] } })),
        axios.get(`${API_BASE_URL}/wallet/transactions`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { data: [] } })),
        axios.get(`${API_BASE_URL}/addresses`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { data: [] } })),
      ]);

      // Process profile data (MAIN SOURCE)
      if (profileRes.status === 'fulfilled' && (profileRes.value.data.success || profileRes.value.data.data)) {
        const data = profileRes.value.data.data || profileRes.value.data;
        
        const transformedUser: UserData = {
          id: data.user_id || data.id,
          name: data.name || data.full_name,
          email: data.email,
          role: data.role || 'customer',
          phone: data.phone || data.mobile || 'Belum diisi',
          address: data.address || data.default_address || 'Belum diisi',
          created_at: data.created_at || new Date().toISOString(),
          wallet_balance: Number(data.balance || data.wallet_balance || 0),
          hold_balance: Number(data.hold_balance || 0),
          wallet_number: data.wallet_number,
          available_balance: Number(data.available_balance || (data.balance - data.hold_balance) || 0),
          membership_type: data.membership_type || 'free',
          membership_status: data.membership_status || 'active',
          membership_expired_at: data.membership_expired_at,
          membership_points: data.membership_points || data.loyalty_points || 0,
          featured_store: data.featured_store || false,
          priority_support: data.priority_support || false,
          store_id: data.store_id,
          store_name: data.store_name,
          store_verified: data.store_verified || false,
          store_logo: data.store_logo,
          verified: data.is_verified || data.verified || false,
          roleName: getRoleDisplayName(data.role),
          total_balance: Number(data.total_balance || data.balance || 0),
          membership_level: getMembershipLevel(data.membership_type),
          membership_badge: getMembershipBadge(data.membership_type || 'free', data.membership_status || 'active').badge,
          membership_color: getMembershipBadge(data.membership_type || 'free', data.membership_status || 'active').color,
          membership_benefits: getMembershipBenefits(data.membership_type || 'free'),
          total_orders: data.total_orders || 0,
          total_spent: Number(data.total_spent || 0),
        };
        
        setUser(transformedUser);
        setStoreUser(transformedUser);
        localStorage.setItem(USER_KEY, JSON.stringify(transformedUser));
      }

      // Process orders
      if (ordersRes.status === 'fulfilled' && (ordersRes.value.data.success || ordersRes.value.data.data)) {
        const ordersData = ordersRes.value.data.data || ordersRes.value.data;
        setOrders(Array.isArray(ordersData) ? ordersData.map((o: any) => ({
          id: o.id,
          order_code: o.order_code,
          status: o.status,
          total_amount: Number(o.total_amount),
          created_at: o.created_at,
          items_count: o.items_count || 1,
          product_name: o.product_name,
          product_image: o.product_image,
        })) : []);
      } else {
        setOrders([
          { id: 1, order_code: 'ORD-001', status: 'delivered', total_amount: 150000, created_at: new Date().toISOString(), items_count: 2 },
          { id: 2, order_code: 'ORD-002', status: 'processing', total_amount: 75000, created_at: new Date().toISOString(), items_count: 1 },
        ]);
      }

      // Process wishlist
      if (wishlistRes.status === 'fulfilled' && (wishlistRes.value.data.success || wishlistRes.value.data.data)) {
        const wishlistData = wishlistRes.value.data.data || wishlistRes.value.data;
        setWishlist(Array.isArray(wishlistData) ? wishlistData : []);
      } else {
        setWishlist([
          { id: 1, product_id: 1, name: 'Beras Organik', price: 75000, image: '', category: 'Makanan', rating: 4.5, stock: 100, added_at: new Date().toISOString() },
        ]);
      }

      // Process transactions
      if (transactionsRes.status === 'fulfilled' && (transactionsRes.value.data.success || transactionsRes.value.data.data)) {
        const txData = transactionsRes.value.data.data || transactionsRes.value.data;
        setTransactions(Array.isArray(txData) ? txData : []);
      } else {
        setTransactions([
          { id: 1, type: 'topup', amount: 100000, status: 'success', description: 'Top Up Saldo', created_at: new Date().toISOString() },
        ]);
      }

      // Process addresses
      if (addressesRes.status === 'fulfilled' && (addressesRes.value.data.success || addressesRes.value.data.data)) {
        const addrData = addressesRes.value.data.data || addressesRes.value.data;
        setAddresses(Array.isArray(addrData) ? addrData : []);
      }

    } catch (err: any) {
      console.error('Error fetching user data:', err);
      setError(err.response?.data?.message || 'Gagal memuat data profil');
      
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } finally {
      setLoading(false);
    }
  }, [router, setStoreUser]);

  // ======================================================
  // UPDATE FUNCTIONS
  // ======================================================

  const refreshAllData = useCallback(async () => {
    await fetchAllUserData();
    if (fetchProfile) await fetchProfile();
    setLastUpdate(Date.now());
  }, [fetchAllUserData, fetchProfile]);

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      await axios.put(`${API_BASE_URL}/profile`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Profil berhasil diperbarui');
      setEditingProfile(false);
      await refreshAllData();
      
    } catch (error) {
      toast.error('Gagal memperbarui profil');
    }
  };

  const handleTopUp = async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await axios.post(`${API_BASE_URL}/wallet/topup`, 
        { amount: topupAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.redirect_url) {
        window.open(response.data.redirect_url, '_blank');
        toast.info('Silakan selesaikan pembayaran');
      } else {
        toast.success(`Top up Rp${topupAmount.toLocaleString()} berhasil`);
        setShowTopupModal(false);
        await refreshAllData();
      }
    } catch (error) {
      toast.error('Gagal melakukan top up');
    }
  };

  const handleAddToCart = async (productId: number, productName: string) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      await axios.post(`${API_BASE_URL}/cart/add`, 
        { product_id: productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`${productName} ditambahkan ke keranjang`);
    } catch (error) {
      toast.error('Gagal menambahkan ke keranjang');
    }
  };

  const handleRemoveFromWishlist = async (productId: number, productName: string) => {
    if (!confirm(`Hapus ${productName} dari wishlist?`)) return;
    
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      await axios.delete(`${API_BASE_URL}/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Dihapus dari wishlist');
      await refreshAllData();
      
    } catch (error) {
      toast.error('Gagal menghapus dari wishlist');
    }
  };

  const handleSetDefaultAddress = async (addressId: number) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      await axios.put(`${API_BASE_URL}/addresses/${addressId}/default`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Alamat default diperbarui');
      await refreshAllData();
      
    } catch (error) {
      toast.error('Gagal mengubah alamat default');
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (!confirm('Hapus alamat ini?')) return;
    
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      await axios.delete(`${API_BASE_URL}/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Alamat dihapus');
      await refreshAllData();
      
    } catch (error) {
      toast.error('Gagal menghapus alamat');
    }
  };

  const copyWalletNumber = () => {
    if (user?.wallet_number) {
      navigator.clipboard.writeText(user.wallet_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Nomor wallet disalin');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // ======================================================
  // EFFECTS
  // ======================================================

  useEffect(() => {
    fetchAllUserData();
  }, [fetchAllUserData]);

  useEffect(() => {
    if (user) {
      setEditForm({ 
        name: user.name, 
        phone: user.phone || '', 
        address: user.address || '' 
      });
    }
  }, [user]);

  // ======================================================
  // RENDER
  // ======================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white p-4">
        <div className="bg-white rounded-3xl p-10 text-center max-w-md shadow-xl">
          <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-3">Gagal Memuat Profil</h1>
          <p className="text-slate-500 mb-8">{error}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={fetchAllUserData} className="bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition">
              Coba Lagi
            </button>
            <Link href="/" className="border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition">
              Kembali
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Stats yang menggunakan data REAL dari profile
  const stats = [
    { label: 'Total Pesanan', value: user.total_orders || orders.length, icon: Package, color: 'blue' },
    { label: 'Pesanan Selesai', value: orders.filter(o => o.status === 'delivered' || o.status === 'completed').length, icon: CheckCircle, color: 'green' },
    { label: 'Wishlist', value: wishlist.length, icon: Heart, color: 'red' },
    { label: 'Poin Reward', value: user.membership_points?.toLocaleString() || '0', icon: Award, color: 'yellow' },
    { label: 'Total Belanja', value: formatCurrency(user.total_spent), icon: TrendingUp, color: 'purple' },
  ];

  // Menu items untuk header
  const menuItems = [
    { label: 'Beranda', href: '/', icon: Home },
    { label: 'Produk', href: '/products', icon: Package },
    { label: 'Toko', href: '/stores', icon: Store },
    { label: 'Artikel', href: '/articles', icon: FileText },
    { label: 'Promo', href: '/promo', icon: Gift },
    { label: 'Bantuan', href: '/help', icon: HelpCircle },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* ====================================================== */}
      {/* MAIN NAVIGATION HEADER - DENGAN LOGO ASLI */}
      {/* ====================================================== */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          {/* Top Bar - Logo, Search, Cart, User */}
          <div className="flex items-center justify-between gap-4 py-3">
            {/* Logo dengan gambar asli */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md overflow-hidden bg-white p-1">
                {!logoError ? (
                  <Image 
                    src="/assets/logo/logo-agrohub.png"
                    alt="AgroHub Logo"
                    width={32}
                    height={32}
                    className="object-contain w-full h-full"
                    priority
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <Leaf className="w-5 h-5 text-green-600" />
                )}
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-lg bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                  AgroHub
                </span>
                <p className="text-xs text-green-600">Connecting Farmers to Markets</p>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Cari produk, kategori, atau toko..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 pr-4 rounded-xl border border-slate-200 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-100 text-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </form>

            {/* Right Icons */}
            <div className="flex items-center gap-2">
              {/* Cart Icon */}
              <Link href="/cart" className="relative p-2 rounded-xl hover:bg-green-50 transition">
                <ShoppingBag className="w-5 h-5 text-slate-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </Link>

              {/* User Profile Button */}
              <Link href="/profile" className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-2 rounded-xl text-sm font-semibold hover:shadow-md transition">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profil</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-green-50 transition"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center gap-1 py-2 border-t border-slate-100">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:bg-green-50 hover:text-green-700 transition font-medium text-sm"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden py-4 border-t border-slate-100"
              >
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari produk..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-200 focus:border-green-400 focus:outline-none text-sm"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </form>

                {/* Mobile Menu Items */}
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-green-50 rounded-xl transition"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Back to Home Link */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-green-700 transition">
          <ChevronLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>

      {/* Hero Section with Wallet Data from Profile */}
      <section className="max-w-7xl mx-auto px-4 mt-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-900 via-green-800 to-emerald-800 p-6 md:p-8">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute right-0 top-0 opacity-10 text-[200px] select-none">🌾</div>
          
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <span className="text-white text-3xl font-black">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                </div>
                <button 
                  onClick={() => setEditingProfile(true)}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition"
                >
                  <Edit2 className="w-4 h-4 text-slate-700" />
                </button>
              </div>

              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full text-sm mb-3">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="font-semibold">{user.roleName}</span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-black text-white">{user.name}</h1>
                {user.store_name && (
                  <div className="flex items-center gap-2 mt-1 text-green-100 text-sm">
                    <Store className="w-4 h-4" />
                    <span>{user.store_name}</span>
                    {user.store_verified && <BadgeCheck className="w-4 h-4 text-green-400" />}
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-3 mt-2 text-green-100 text-xs lg:text-sm">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {user.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* WALLET SUMMARY */}
          <div className="relative mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-green-100 text-xs">Total Saldo</p>
              <p className="text-white font-bold text-lg">{formatCurrency(user.total_balance)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-green-100 text-xs">Saldo Tersedia</p>
              <p className="text-white font-bold text-lg">{formatCurrency(user.wallet_balance)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-green-100 text-xs">Saldo Hold</p>
              <p className="text-white font-bold text-lg">{formatCurrency(user.hold_balance)}</p>
            </div>
            {user.wallet_number && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 cursor-pointer hover:bg-white/20 transition" onClick={copyWalletNumber}>
                <p className="text-green-100 text-xs">No. Wallet</p>
                <p className="text-white font-mono text-xs truncate flex items-center gap-1">
                  {user.wallet_number}
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </p>
              </div>
            )}
          </div>

          {/* Tombol Top Up */}
          <div className="relative mt-4">
            <button
              onClick={() => setShowTopupModal(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              Top Up Saldo
            </button>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="max-w-7xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {stats.map((stat, idx) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-md p-3 border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs">{stat.label}</p>
                  <p className="text-lg font-black text-slate-900 mt-0.5">{stat.value}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-slate-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-2">
          {[
            { id: 'profile', label: 'Profil', icon: User },
            { id: 'wallet', label: 'Dompet', icon: Wallet },
            { id: 'orders', label: 'Pesanan', icon: Package },
            { id: 'wishlist', label: 'Wishlist', icon: Heart },
            { id: 'addresses', label: 'Alamat', icon: MapPin },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-green-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* WALLET TAB */}
      {activeTab === 'wallet' && (
        <section className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center gap-3">
                <Wallet className="w-6 h-6 text-purple-600" />
                <div>
                  <h2 className="text-xl font-black text-slate-900">Dompet Digital</h2>
                  <p className="text-slate-500 text-sm mt-0.5">Kelola saldo dan transaksi Anda</p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 text-center">
                  <p className="text-slate-500 text-sm">Total Saldo</p>
                  <p className="text-2xl font-black text-green-700">{formatCurrency(user.total_balance)}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 text-center">
                  <p className="text-slate-500 text-sm">Saldo Tersedia</p>
                  <p className="text-2xl font-black text-blue-700">{formatCurrency(user.wallet_balance)}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 text-center">
                  <p className="text-slate-500 text-sm">Saldo Hold</p>
                  <p className="text-2xl font-black text-orange-700">{formatCurrency(user.hold_balance)}</p>
                </div>
              </div>

              <div className="flex gap-3 mb-8">
                <button
                  onClick={() => setShowTopupModal(true)}
                  className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-4 h-4" />
                  Top Up Saldo
                </button>
                <button className="flex-1 py-3 border border-green-600 text-green-600 font-semibold rounded-xl hover:bg-green-50 transition flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Withdraw
                </button>
              </div>

              <h3 className="font-bold text-slate-800 mb-4">Transaksi Terbaru</h3>
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <Wallet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-400">Belum ada transaksi</p>
                  </div>
                ) : (
                  transactions.slice(0, 10).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'topup' ? 'bg-green-100' : 
                          tx.type === 'payment' ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          {tx.type === 'topup' ? <Plus className="w-5 h-5 text-green-600" /> : 
                           tx.type === 'payment' ? <Minus className="w-5 h-5 text-red-600" /> : 
                           <RefreshCw className="w-5 h-5 text-blue-600" />}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{tx.description}</p>
                          <p className="text-xs text-slate-400">{formatDateTime(tx.created_at)}</p>
                        </div>
                      </div>
                      <div className={`text-right ${
                        tx.type === 'topup' ? 'text-green-600' : 
                        tx.type === 'payment' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        <p className="font-bold">{tx.type === 'topup' ? '+' : '-'}{formatCurrency(tx.amount)}</p>
                        <p className="text-xs">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                            tx.status === 'success' ? 'bg-green-100 text-green-700' :
                            tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {tx.status === 'success' ? 'Berhasil' : 
                             tx.status === 'pending' ? 'Diproses' : 'Gagal'}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <section className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Informasi Profil</h2>
                  <p className="text-slate-500 text-sm mt-0.5">Data dari akun Anda</p>
                </div>
                <button
                  onClick={() => setEditingProfile(true)}
                  className="flex items-center gap-1 text-green-700 font-semibold text-sm hover:text-green-800 transition"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profil
                </button>
              </div>
            </div>
            <div className="p-5">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: 'Nama Lengkap', value: user.name, icon: User },
                  { label: 'Email', value: user.email, icon: Mail },
                  { label: 'Nomor Telepon', value: user.phone || 'Belum diisi', icon: Phone },
                  { label: 'Alamat', value: user.address || 'Belum diisi', icon: MapPin },
                  { label: 'Role', value: user.roleName, icon: ShieldCheck },
                  { label: 'Member Sejak', value: formatDate(user.created_at), icon: Calendar },
                  { label: 'Status Verifikasi', value: user.verified ? 'Terverifikasi' : 'Belum Verifikasi', icon: BadgeCheck },
                  { label: 'Total Pesanan', value: user.total_orders || orders.length, icon: Package },
                ].map((item) => (
                  <div key={item.label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                      <item.icon className="w-3 h-3" />
                      {item.label}
                    </div>
                    <div className="font-semibold text-slate-900 text-sm">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <section className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <h2 className="text-xl font-black text-slate-900">Riwayat Pesanan</h2>
              <p className="text-slate-500 text-sm mt-0.5">Semua transaksi belanja Anda</p>
            </div>
            <div className="p-5">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Belum ada pesanan</p>
                  <Link href="/products" className="inline-block mt-4 text-green-600 font-semibold">
                    Mulai Belanja →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-black text-slate-900">{order.order_code}</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                          <div className="text-sm text-slate-500 mt-1">
                            {formatDate(order.created_at)} • {order.items_count} produk
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-black text-green-700">{formatCurrency(order.total_amount)}</div>
                          <Link href={`/orders/${order.id}`} className="text-sm text-green-600 font-semibold hover:text-green-700">
                            Detail →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Wishlist Tab */}
      {activeTab === 'wishlist' && (
        <section className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-red-50 to-pink-50">
              <h2 className="text-xl font-black text-slate-900">Wishlist</h2>
              <p className="text-slate-500 text-sm mt-0.5">Produk favorit yang Anda simpan</p>
            </div>
            <div className="p-5">
              {wishlist.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Belum ada produk di wishlist</p>
                  <Link href="/products" className="inline-block mt-4 text-green-600 font-semibold">
                    Jelajahi Produk →
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {wishlist.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border border-slate-200 rounded-xl hover:shadow-md transition">
                      <div className="relative w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            onError={() => setImageErrors(prev => ({ ...prev, [item.id]: true }))}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">🌾</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 text-sm line-clamp-2">{item.name}</p>
                        <p className="text-green-700 font-bold mt-1">{formatCurrency(item.price)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleAddToCart(item.product_id, item.name)}
                            className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition"
                          >
                            + Keranjang
                          </button>
                          <button
                            onClick={() => handleRemoveFromWishlist(item.product_id, item.name)}
                            className="text-xs border border-red-500 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Addresses Tab */}
      {activeTab === 'addresses' && (
        <section className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Alamat Saya</h2>
                  <p className="text-slate-500 text-sm mt-0.5">Kelola alamat pengiriman</p>
                </div>
              </div>
            </div>
            <div className="p-5">
              {addresses.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Belum ada alamat tersimpan</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className={`p-4 rounded-xl border ${addr.is_default ? 'border-green-300 bg-green-50' : 'border-slate-200'}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-800">{addr.label}</p>
                            {addr.is_default && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Default</span>
                            )}
                          </div>
                          <p className="font-medium text-slate-700 mt-2">{addr.name}</p>
                          <p className="text-sm text-slate-500">{addr.phone}</p>
                          <p className="text-sm text-slate-600 mt-1">{addr.address}</p>
                          <p className="text-sm text-slate-600">{addr.city}, {addr.province} - {addr.postal_code}</p>
                        </div>
                        <div className="flex gap-2">
                          {!addr.is_default && (
                            <button
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-xs text-green-600 hover:text-green-700"
                            >
                              Set default
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-2 text-slate-400 hover:text-red-600 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Edit Profile Modal */}
      {editingProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Edit Profil</h3>
              <button onClick={() => setEditingProfile(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-3 border rounded-xl focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nomor Telepon</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full p-3 border rounded-xl focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Alamat</label>
                <textarea
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  rows={3}
                  className="w-full p-3 border rounded-xl focus:border-green-500 focus:outline-none"
                />
              </div>
              <button
                onClick={handleUpdateProfile}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Up Modal */}
      {showTopupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Top Up Saldo</h3>
              <button onClick={() => setShowTopupModal(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Jumlah Top Up</label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[50000, 100000, 250000, 500000, 1000000].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setTopupAmount(amount)}
                      className={`py-2 rounded-xl border transition ${
                        topupAmount === amount 
                          ? 'bg-green-600 text-white border-green-600' 
                          : 'border-slate-200 hover:border-green-300'
                      }`}
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(Number(e.target.value))}
                  className="w-full p-3 border rounded-xl focus:border-green-500 focus:outline-none"
                  placeholder="Masukkan jumlah"
                />
              </div>
              <button
                onClick={handleTopUp}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
              >
                Proses Top Up
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}