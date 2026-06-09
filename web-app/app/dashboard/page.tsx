'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, Wallet, Package, TrendingUp, Clock } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  roleName: string;
  displayName: string;
  initial: string;
  balance: number;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  membershipTier: string;
}

interface DashboardStats {
  totalOrders: number;
  wishlistCount: number;
  walletBalance: number;
  pendingOrders: number;
  completedOrders: number;
  totalSpent: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    wishlistCount: 0,
    walletBalance: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    // Ambil data user dari localStorage
    const token = localStorage.getItem('token');
    const userDataStr = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }

    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      // Fallback: ambil dari individual keys
      const userName = localStorage.getItem('userName');
      const userEmail = localStorage.getItem('userEmail');
      const userRole = localStorage.getItem('userRole');
      
      if (userName && userEmail) {
        setUser({
          id: Number(localStorage.getItem('userId') || 0),
          name: userName,
          email: userEmail,
          role: userRole || 'customer',
          roleName: userRole === 'seller' ? 'Penjual' : 'Pembeli',
          displayName: userName,
          initial: userName.charAt(0).toUpperCase(),
          balance: 0,
          totalOrders: 0,
          totalSpent: 0,
          loyaltyPoints: 0,
          membershipTier: 'bronze',
        });
      }
    }

    // Fetch dashboard data
    fetchDashboardData(token);
  }, [router]);

  const fetchDashboardData = async (token: string) => {
    try {
      setLoading(true);
      
      // 1. Ambil data dari 1 Query Master Endpoint (Sesuai skema database lu)
      const dashboardResponse = await axios.get(`${API_BASE_URL}/dashboard/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Adaptasi data mentah dari alias query Postgres (snake_case)
      const masterData = dashboardResponse.data?.data || dashboardResponse.data;
      
      // 2. Ambil data recent orders (limit 5)
      const ordersResponse = await axios.get(`${API_BASE_URL}/orders?limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const orders = ordersResponse.data?.data || ordersResponse.data || [];
      
      // Hitung status order pending vs completed dari list order untuk melengkapi komponen UI
      const pendingOrdersCount = orders.filter((o: any) => o.status === 'pending' || o.status === 'processing').length;
      const completedOrdersCount = orders.filter((o: any) => o.status === 'completed' || o.status === 'delivered').length;
      
      setRecentOrders(orders.slice(0, 5));
      
      // Petakan field query database ke state Next.js secara presisi tanpa ngerusak UI
      setStats({
        totalOrders: masterData?.total_orders !== undefined ? Number(masterData.total_orders) : orders.length,
        wishlistCount: masterData?.wishlist_items !== undefined ? Number(masterData.wishlist_items) : 0,
        walletBalance: masterData?.wallet_balance !== undefined ? Number(masterData.wallet_balance) : 0,
        pendingOrders: pendingOrdersCount,
        completedOrders: completedOrdersCount,
        totalSpent: masterData?.total_spent !== undefined ? Number(masterData.total_spent) : 0,
      });
      
      // Update user data dengan info terbaru dari DB Master
      if (masterData) {
        const updatedUser = {
          ...user,
          name: masterData.name || user?.name,
          email: masterData.email || user?.email,
          role: masterData.role || user?.role,
          roleName: masterData.role === 'seller' ? 'Penjual' : 'Pembeli',
          displayName: masterData.name || user?.name,
          initial: (masterData.name || 'C').charAt(0).toUpperCase(),
          balance: masterData.wallet_balance !== undefined ? Number(masterData.wallet_balance) : 0,
          totalOrders: masterData.total_orders !== undefined ? Number(masterData.total_orders) : orders.length,
          totalSpent: masterData.total_spent !== undefined ? Number(masterData.total_spent) : 0,
          loyaltyPoints: masterData.loyalty_points || 0,
          membershipTier: masterData.membership_tier || 'bronze',
        };
        setUser(updatedUser as UserData);
        
        // Update localStorage biar sinkron
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback lokal jika API terputus
      const userDataStr = localStorage.getItem('user');
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          setStats({
            totalOrders: userData.totalOrders || 0,
            wishlistCount: 0,
            walletBalance: userData.balance || 0,
            pendingOrders: 0,
            completedOrders: 0,
            totalSpent: userData.totalSpent || 0,
          });
        } catch (e) {
          console.error(e);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Format Rupiah
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format tanggal (Ditambahkan validasi null-checking agar tidak crash saat render)
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Jika raw string bukan ISO, return apa adanya
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <p className="text-gray-500 mt-4">Memuat data dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* GREETING SECTION */}
      <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Halo, {user?.displayName || user?.name || 'Customer'}! 👋
            </h1>
            <p className="text-green-100 mt-1">
              Selamat datang kembali di AgroHub. 
              {stats.pendingOrders > 0 && ` Anda memiliki ${stats.pendingOrders} pesanan yang perlu diselesaikan.`}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">
              {user?.membershipTier === 'premium' ? '⭐ Premium Member' : 
               user?.membershipTier === 'vip' ? '👑 VIP Member' : '🥉 Bronze Member'}
            </span>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Orders Card */}
        <Link href="/dashboard/orders" className="block">
          <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Pesanan</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalOrders}</p>
                {stats.pendingOrders > 0 && (
                  <p className="text-xs text-orange-500 mt-1">
                    {stats.pendingOrders} pesanan pending
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </Link>

        {/* Wishlist Card */}
        <Link href="/dashboard/wishlist" className="block">
          <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Wishlist</p>
                <p className="text-3xl font-bold text-pink-500 mt-2">{stats.wishlistCount}</p>
                <p className="text-xs text-gray-400 mt-1">Produk favorit</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-200 transition">
                <Heart className="w-6 h-6 text-pink-500" />
              </div>
            </div>
          </div>
        </Link>

        {/* Wallet Card */}
        <Link href="/dashboard/wallet" className="block">
          <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Saldo Wallet</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {formatRupiah(stats.walletBalance)}
                </p>
                {stats.totalSpent > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    Total belanja: {formatRupiah(stats.totalSpent)}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* RECENT ORDERS SECTION */}
      {recentOrders.length > 0 ? (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Pesanan Terbaru</h2>
              <Link href="/dashboard/orders" className="text-sm text-green-600 hover:text-green-700">
                Lihat semua →
              </Link>
            </div>
          </div>
          <div className="divide-y">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Order #{order.id}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(order.created_at || order.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-gray-800">
                      {formatRupiah(order.total_amount || order.total || 0)}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'completed' || order.status === 'delivered'
                        ? 'bg-green-100 text-green-600'
                        : order.status === 'pending' || order.status === 'processing'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {order.status === 'completed' ? 'Selesai' :
                       order.status === 'delivered' ? 'Terkirim' :
                       order.status === 'pending' ? 'Menunggu' :
                       order.status === 'processing' ? 'Diproses' : order.status}
                    </span>
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="text-sm text-green-600 hover:text-green-700"
                    >
                      Detail →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* EMPTY STATE - Belum ada pesanan */
        <div className="bg-white rounded-xl border shadow-sm p-10 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Belum ada pesanan
          </h2>
          <p className="text-gray-500 mb-6">
            Mulai belanja produk pertanian terbaik di AgroHub 🌱
          </p>
          <Link
            href="/products"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Belanja Sekarang →
          </Link>
        </div>
      )}

      {/* MEMBERSHIP INFO */}
      {user?.loyaltyPoints !== undefined && user.loyaltyPoints > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Poin Loyalty Anda</p>
              <p className="font-bold text-yellow-600">{user.loyaltyPoints.toLocaleString()} poin</p>
            </div>
            <Link href="/dashboard/membership" className="ml-auto text-sm text-yellow-600 hover:text-yellow-700">
              Tukar Poin →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}