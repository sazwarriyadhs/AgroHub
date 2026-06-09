// app/dashboard/settings/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Store,
  LayoutDashboard,
  Package,
  Truck,
  Wallet,
  Star,
  Megaphone,
  Settings,
  Gift,
  HelpCircle,
  Home,
  Newspaper,
  LogOut,
  Bell,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  MessageCircle,
  PlusCircle,
  X,
  Save,
  RefreshCw,
  Bell as BellIcon,
  Mail,
  Globe,
  Lock,
  Eye as EyeIcon,
  EyeOff,
  Moon,
  Sun,
  Smartphone,
  Printer,
  FileText,
  Trash2,
  Shield,
  Database,
  Download,
  Users,
  ShoppingBag,
  DollarSign,
  Activity,
  Zap,
  Volume2,
  VolumeX,
  Palette,
  Type
} from 'lucide-react';

// Types
interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  email: boolean;
  push: boolean;
  icon: JSX.Element;
}

interface GeneralSetting {
  store_name: string;
  store_description: string;
  currency: string;
  timezone: string;
  language: string;
  date_format: string;
  time_format: string;
}

interface ShippingSetting {
  default_weight: number;
  default_weight_unit: string;
  default_courier: string;
  free_shipping_threshold: number;
  handling_fee: number;
  insurance: boolean;
}

interface InvoiceSetting {
  invoice_prefix: string;
  invoice_logo: string | null;
  invoice_footer_text: string;
  show_discount: boolean;
  show_tax: boolean;
  tax_rate: number;
}

interface NotificationPreference {
  new_order: NotificationSetting;
  order_status_update: NotificationSetting;
  new_review: NotificationSetting;
  low_stock: NotificationSetting;
  promo_expiring: NotificationSetting;
  withdrawal_status: NotificationSetting;
  daily_summary: NotificationSetting;
  weekly_report: NotificationSetting;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // General Settings
  const [generalSettings, setGeneralSettings] = useState<GeneralSetting>({
    store_name: '',
    store_description: '',
    currency: 'IDR',
    timezone: 'Asia/Jakarta',
    language: 'id',
    date_format: 'DD/MM/YYYY',
    time_format: '24'
  });

  // Shipping Settings
  const [shippingSettings, setShippingSettings] = useState<ShippingSetting>({
    default_weight: 1000,
    default_weight_unit: 'g',
    default_courier: 'jne',
    free_shipping_threshold: 500000,
    handling_fee: 0,
    insurance: false
  });

  // Invoice Settings
  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSetting>({
    invoice_prefix: 'INV',
    invoice_logo: null,
    invoice_footer_text: 'Terima kasih telah berbelanja di toko kami',
    show_discount: true,
    show_tax: true,
    tax_rate: 11
  });

  // Notification Preferences
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreference>({
    new_order: {
      id: 'new_order',
      name: 'Pesanan Baru',
      description: 'Notifikasi saat ada pesanan baru masuk',
      email: true,
      push: true,
      icon: <Package className="w-5 h-5" />
    },
    order_status_update: {
      id: 'order_status_update',
      name: 'Update Status Pesanan',
      description: 'Notifikasi saat status pesanan berubah',
      email: true,
      push: true,
      icon: <Truck className="w-5 h-5" />
    },
    new_review: {
      id: 'new_review',
      name: 'Ulasan Baru',
      description: 'Notifikasi saat ada ulasan baru untuk produk',
      email: true,
      push: true,
      icon: <Star className="w-5 h-5" />
    },
    low_stock: {
      id: 'low_stock',
      name: 'Stok Menipis',
      description: 'Notifikasi saat stok produk menipis',
      email: true,
      push: true,
      icon: <AlertCircle className="w-5 h-5" />
    },
    promo_expiring: {
      id: 'promo_expiring',
      name: 'Promosi Akan Berakhir',
      description: 'Notifikasi saat promosi akan berakhir',
      email: true,
      push: true,
      icon: <Megaphone className="w-5 h-5" />
    },
    withdrawal_status: {
      id: 'withdrawal_status',
      name: 'Status Penarikan',
      description: 'Notifikasi saat status penarikan dana berubah',
      email: true,
      push: true,
      icon: <Wallet className="w-5 h-5" />
    },
    daily_summary: {
      id: 'daily_summary',
      name: 'Ringkasan Harian',
      description: 'Ringkasan penjualan setiap hari',
      email: false,
      push: true,
      icon: <Activity className="w-5 h-5" />
    },
    weekly_report: {
      id: 'weekly_report',
      name: 'Laporan Mingguan',
      description: 'Laporan lengkap toko setiap minggu',
      email: true,
      push: false,
      icon: <FileText className="w-5 h-5" />
    }
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    cod_enabled: true,
    bank_transfer_enabled: true,
    ewallet_enabled: true
  });

  // Helper functions
  const safeNumber = (value: any, defaultValue: number = 0): number => {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 18) return 'Selamat Siang';
    return 'Selamat Malam';
  };

  // Fetch settings data
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch general settings
      const generalResponse = await fetch(`${API_URL}/seller/settings/general`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (generalResponse.ok) {
        const data = await generalResponse.json();
        setGeneralSettings(prev => ({ ...prev, ...data }));
      }

      // Fetch shipping settings
      const shippingResponse = await fetch(`${API_URL}/seller/settings/shipping`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (shippingResponse.ok) {
        const data = await shippingResponse.json();
        setShippingSettings(prev => ({ ...prev, ...data }));
      }

      // Fetch invoice settings
      const invoiceResponse = await fetch(`${API_URL}/seller/settings/invoice`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (invoiceResponse.ok) {
        const data = await invoiceResponse.json();
        setInvoiceSettings(prev => ({ ...prev, ...data }));
      }

      // Fetch notification preferences
      const notifResponse = await fetch(`${API_URL}/seller/settings/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (notifResponse.ok) {
        const data = await notifResponse.json();
        setNotificationPrefs(prev => ({ ...prev, ...data }));
      }

      // Fetch theme preference
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
      if (savedTheme) setTheme(savedTheme);

    } catch (error) {
      console.error('Error fetching settings:', error);
      setError('Gagal memuat pengaturan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name || user.fullname || 'Seller');
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
    fetchSettings();
  }, [fetchSettings]);

  const handleLogout = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => {});
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.split('=');
        document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
      router.push('/login');
    }
  }, [router]);

  const saveGeneralSettings = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/seller/settings/general`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(generalSettings)
      });

      if (response.ok) {
        setSuccess('Pengaturan umum berhasil disimpan');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error('Gagal menyimpan pengaturan');
      }
    } catch (error) {
      console.error('Error saving general settings:', error);
      setError('Gagal menyimpan pengaturan umum');
    } finally {
      setSaving(false);
    }
  };

  const saveShippingSettings = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/seller/settings/shipping`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(shippingSettings)
      });

      if (response.ok) {
        setSuccess('Pengaturan pengiriman berhasil disimpan');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error('Gagal menyimpan pengaturan');
      }
    } catch (error) {
      console.error('Error saving shipping settings:', error);
      setError('Gagal menyimpan pengaturan pengiriman');
    } finally {
      setSaving(false);
    }
  };

  const saveInvoiceSettings = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/seller/settings/invoice`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoiceSettings)
      });

      if (response.ok) {
        setSuccess('Pengaturan invoice berhasil disimpan');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error('Gagal menyimpan pengaturan');
      }
    } catch (error) {
      console.error('Error saving invoice settings:', error);
      setError('Gagal menyimpan pengaturan invoice');
    } finally {
      setSaving(false);
    }
  };

  const saveNotificationSettings = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/seller/settings/notifications`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notificationPrefs)
      });

      if (response.ok) {
        setSuccess('Pengaturan notifikasi berhasil disimpan');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error('Gagal menyimpan pengaturan');
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
      setError('Gagal menyimpan pengaturan notifikasi');
    } finally {
      setSaving(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const sidebarMenus = [
    { label: 'Ringkasan', icon: LayoutDashboard, href: '/dashboard/seller' },
    { label: 'Pesanan', icon: Package, href: '/dashboard/seller/orders' },
    { label: 'Produk', icon: Store, href: '/dashboard/seller/products' },
    { label: 'Tambah Produk', icon: PlusCircle, href: '/dashboard/seller/products/create' },
    { label: 'Wallet', icon: Wallet, href: '/dashboard/wallet' },
    { label: 'Pendapatan', icon: TrendingUp, href: '/dashboard/seller/revenue' },
    { label: 'Ulasan', icon: Star, href: '/dashboard/seller/reviews' },
    { label: 'Promosi', icon: Megaphone, href: '/dashboard/seller/promo' },
    { label: 'Profil Toko', icon: User, href: '/dashboard/profile' },
    { label: 'Pengaturan', icon: Settings, href: '/dashboard/settings' },
  ];

  const tabs = [
    { id: 'general', label: 'Umum', icon: Globe },
    { id: 'shipping', label: 'Pengiriman', icon: Truck },
    { id: 'invoice', label: 'Invoice', icon: FileText },
    { id: 'notifications', label: 'Notifikasi', icon: BellIcon },
    { id: 'payment', label: 'Pembayaran', icon: CreditCardIcon },
    { id: 'security', label: 'Keamanan', icon: Shield },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Memuat pengaturan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER - SAMA DENGAN WALLET PAGE */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between gap-6">
          <Link href="/dashboard/seller" className="flex items-center shrink-0">
            <img 
              src="/logo-agrohub.png" 
              alt="AgroHub" 
              className="h-[90px] w-auto object-contain"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/200x90/22c55e/white?text=AgroHub';
              }}
            />
          </Link>

          <div className="flex-1 max-w-2xl relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              placeholder="Cari pengaturan..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-5">
            <Link href="/dashboard/cart" className="hover:text-green-600 transition">
              <ShoppingCart className="w-6 h-6" />
            </Link>
            <Link href="/dashboard/wishlist" className="hover:text-green-600 transition">
              <Heart className="w-6 h-6" />
            </Link>
            <Bell className="w-6 h-6 cursor-pointer hover:text-green-600 transition" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                {userName?.charAt(0)?.toUpperCase() || 'S'}
              </div>
              <button 
                onClick={handleLogout} 
                className="text-sm text-red-600 hover:text-red-700 transition font-medium"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>

        {/* Marketplace Menu */}
        <div className="px-6 border-t bg-white">
          <div className="flex items-center gap-6 py-3 overflow-x-auto">
            <Link href="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition whitespace-nowrap">
              <Home className="w-4 h-4" /> Beranda
            </Link>
            <Link href="/product" className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition whitespace-nowrap">
              <Package className="w-4 h-4" /> Produk
            </Link>
            <Link href="/stores" className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition whitespace-nowrap">
              <Store className="w-4 h-4" /> Toko
            </Link>
            <Link href="/artikel" className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition whitespace-nowrap">
              <Newspaper className="w-4 h-4" /> Artikel
            </Link>
            <Link href="/promo" className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition whitespace-nowrap">
              <Gift className="w-4 h-4" /> Promo
            </Link>
            <Link href="/bantuan" className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition whitespace-nowrap">
              <HelpCircle className="w-4 h-4" /> Bantuan
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="col-span-3 bg-white rounded-2xl border p-5 h-fit sticky top-24">
            <div className="pb-5 border-b mb-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <Store className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Toko Saya</h2>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              {sidebarMenus.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
                    item.href === '/dashboard/settings'
                      ? 'bg-green-50 text-green-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-600 hover:bg-red-50 transition mt-4"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Keluar</span>
            </button>
          </aside>

          {/* Content Area - Settings */}
          <section className="col-span-9 space-y-6">
            {/* Page Title */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {getGreeting()}, {userName || 'Seller'}! 👋
                </h2>
                <p className="text-gray-500 mt-1">Kelola pengaturan toko Anda</p>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                {theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
              </button>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
                <button 
                  onClick={() => setError(null)}
                  className="ml-auto text-red-700 underline hover:no-underline"
                >
                  Tutup
                </button>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-600 text-sm flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {success}
                <button 
                  onClick={() => setSuccess(null)}
                  className="ml-auto text-green-700 underline hover:no-underline"
                >
                  Tutup
                </button>
              </div>
            )}

            {/* Settings Tabs */}
            <div className="bg-white rounded-xl border">
              <div className="flex border-b overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-green-600 border-b-2 border-green-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* General Settings Tab */}
                {activeTab === 'general' && (
                  <div className="max-w-2xl space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama Toko</label>
                      <input
                        type="text"
                        value={generalSettings.store_name}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, store_name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Toko</label>
                      <textarea
                        value={generalSettings.store_description}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, store_description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mata Uang</label>
                        <select
                          value={generalSettings.currency}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="IDR">IDR - Rupiah Indonesia</option>
                          <option value="USD">USD - US Dollar</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Zona Waktu</label>
                        <select
                          value={generalSettings.timezone}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="Asia/Jakarta">WIB - Jakarta</option>
                          <option value="Asia/Makassar">WITA - Makassar</option>
                          <option value="Asia/Jayapura">WIT - Jayapura</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bahasa</label>
                        <select
                          value={generalSettings.language}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="id">Bahasa Indonesia</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Format Tanggal</label>
                        <select
                          value={generalSettings.date_format}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, date_format: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={saveGeneralSettings}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                      >
                        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Simpan Perubahan
                      </button>
                    </div>
                  </div>
                )}

                {/* Shipping Settings Tab */}
                {activeTab === 'shipping' && (
                  <div className="max-w-2xl space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Berat Default (gram)</label>
                        <input
                          type="number"
                          value={shippingSettings.default_weight}
                          onChange={(e) => setShippingSettings({ ...shippingSettings, default_weight: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kurir Default</label>
                        <select
                          value={shippingSettings.default_courier}
                          onChange={(e) => setShippingSettings({ ...shippingSettings, default_courier: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="jne">JNE</option>
                          <option value="pos">POS Indonesia</option>
                          <option value="tiki">TIKI</option>
                          <option value="sicepat">SiCepat</option>
                          <option value="jnt">J&T Express</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Batas Free Shipping (Rp)</label>
                      <input
                        type="number"
                        value={shippingSettings.free_shipping_threshold}
                        onChange={(e) => setShippingSettings({ ...shippingSettings, free_shipping_threshold: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <p className="text-xs text-gray-400 mt-1">Set 0 untuk menonaktifkan free shipping</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Biaya Penanganan (Rp)</label>
                      <input
                        type="number"
                        value={shippingSettings.handling_fee}
                        onChange={(e) => setShippingSettings({ ...shippingSettings, handling_fee: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={shippingSettings.insurance}
                        onChange={(e) => setShippingSettings({ ...shippingSettings, insurance: e.target.checked })}
                        className="rounded text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">Aktifkan asuransi pengiriman</span>
                    </label>
                    <div className="flex justify-end">
                      <button
                        onClick={saveShippingSettings}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                      >
                        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Simpan Perubahan
                      </button>
                    </div>
                  </div>
                )}

                {/* Invoice Settings Tab */}
                {activeTab === 'invoice' && (
                  <div className="max-w-2xl space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prefiks Invoice</label>
                      <input
                        type="text"
                        value={invoiceSettings.invoice_prefix}
                        onChange={(e) => setInvoiceSettings({ ...invoiceSettings, invoice_prefix: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <p className="text-xs text-gray-400 mt-1">Contoh: INV akan menjadi INV-00001</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Footer Invoice</label>
                      <textarea
                        value={invoiceSettings.invoice_footer_text}
                        onChange={(e) => setInvoiceSettings({ ...invoiceSettings, invoice_footer_text: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rate Pajak (%)</label>
                      <input
                        type="number"
                        value={invoiceSettings.tax_rate}
                        onChange={(e) => setInvoiceSettings({ ...invoiceSettings, tax_rate: parseFloat(e.target.value) })}
                        step="0.01"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={invoiceSettings.show_discount}
                          onChange={(e) => setInvoiceSettings({ ...invoiceSettings, show_discount: e.target.checked })}
                          className="rounded text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">Tampilkan diskon di invoice</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={invoiceSettings.show_tax}
                          onChange={(e) => setInvoiceSettings({ ...invoiceSettings, show_tax: e.target.checked })}
                          className="rounded text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">Tampilkan pajak di invoice</span>
                      </label>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={saveInvoiceSettings}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                      >
                        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Simpan Perubahan
                      </button>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <div className="space-y-4">
                      {Object.values(notificationPrefs).map((notif) => (
                        <div key={notif.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-green-600">
                                {notif.icon}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-800">{notif.name}</h4>
                                <p className="text-sm text-gray-500">{notif.description}</p>
                              </div>
                            </div>
                            <div className="flex gap-4">
                              <label className="flex items-center gap-1">
                                <input
                                  type="checkbox"
                                  checked={notif.email}
                                  onChange={(e) => {
                                    setNotificationPrefs({
                                      ...notificationPrefs,
                                      [notif.id]: { ...notif, email: e.target.checked }
                                    });
                                  }}
                                  className="rounded text-green-600 focus:ring-green-500"
                                />
                                <span className="text-xs text-gray-600">Email</span>
                              </label>
                              <label className="flex items-center gap-1">
                                <input
                                  type="checkbox"
                                  checked={notif.push}
                                  onChange={(e) => {
                                    setNotificationPrefs({
                                      ...notificationPrefs,
                                      [notif.id]: { ...notif, push: e.target.checked }
                                    });
                                  }}
                                  className="rounded text-green-600 focus:ring-green-500"
                                />
                                <span className="text-xs text-gray-600">Push</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end mt-6">
                      <button
                        onClick={saveNotificationSettings}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                      >
                        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Simpan Perubahan
                      </button>
                    </div>
                  </div>
                )}

                {/* Payment Settings Tab */}
                {activeTab === 'payment' && (
                  <div className="max-w-md space-y-4">
                    <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Truck className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">COD (Cash on Delivery)</p>
                          <p className="text-sm text-gray-500">Bayar saat barang diterima</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={paymentSettings.cod_enabled}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, cod_enabled: e.target.checked })}
                        className="toggle toggle-green"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Building className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Transfer Bank</p>
                          <p className="text-sm text-gray-500">Pembayaran melalui transfer bank</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={paymentSettings.bank_transfer_enabled}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, bank_transfer_enabled: e.target.checked })}
                        className="toggle toggle-green"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Smartphone className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">E-Wallet</p>
                          <p className="text-sm text-gray-500">OVO, GoPay, Dana, dll</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={paymentSettings.ewallet_enabled}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, ewallet_enabled: e.target.checked })}
                        className="toggle toggle-green"
                      />
                    </label>

                    <div className="flex justify-end mt-6">
                      <button
                        onClick={() => {
                          setSuccess('Pengaturan pembayaran berhasil disimpan');
                          setTimeout(() => setSuccess(null), 3000);
                        }}
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        <Save className="w-4 h-4" />
                        Simpan Perubahan
                      </button>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="max-w-md space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-800">Keamanan Akun</p>
                          <p className="text-sm text-yellow-700 mt-1">
                            Jaga keamanan akun Anda dengan menggunakan password yang kuat dan jangan bagikan kepada siapapun.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-4">Data & Privasi</h4>
                      <button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition">
                        <div className="flex items-center gap-3">
                          <Download className="w-5 h-5 text-green-600" />
                          <span>Unduh Data Saya</span>
                        </div>
                        <span className="text-sm text-gray-400">→</span>
                      </button>
                      <button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-red-50 transition mt-2">
                        <div className="flex items-center gap-3">
                          <Trash2 className="w-5 h-5 text-red-600" />
                          <span className="text-red-600">Hapus Akun</span>
                        </div>
                        <span className="text-sm text-gray-400">→</span>
                      </button>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-4">Sesi Aktif</h4>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">Perangkat Saat Ini</p>
                          <p className="text-xs text-gray-500 mt-1">Chrome on Windows - {new Date().toLocaleDateString()}</p>
                        </div>
                        <span className="text-xs text-green-600">Aktif</span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button className="px-6 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition">
                        Logout Semua Perangkat
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Zona Bahaya
              </h3>
              <p className="text-sm text-red-700 mb-4">
                Tindakan berikut bersifat permanen dan tidak dapat dibatalkan.
              </p>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                Reset Semua Pengaturan
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// Missing icon component
function CreditCardIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
      <line x1="1" y1="10" x2="23" y2="10"></line>
    </svg>
  );
}

function Building(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
      <line x1="9" y1="22" x2="15" y2="22"></line>
      <line x1="9" y1="6" x2="15" y2="6"></line>
      <line x1="9" y1="10" x2="15" y2="10"></line>
      <line x1="9" y1="14" x2="15" y2="14"></line>
    </svg>
  );
}

