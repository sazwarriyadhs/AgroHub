'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Loader2, 
  Activity,
  Wallet,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  X,
  Eye,
  CreditCard,
  Landmark,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  Send
} from 'lucide-react';

// Types
interface Wallet {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  user_type: 'farmer' | 'vendor' | 'customer';
  balance: number;
  pending_balance: number;
  total_deposited: number;
  total_withdrawn: number;
  total_spent: number;
  status: 'active' | 'frozen' | 'suspended';
  created_at: string;
  updated_at: string;
}

interface Transaction {
  id: number;
  wallet_id: number;
  amount: number;
  type: 'deposit' | 'withdraw' | 'payment' | 'refund' | 'adjustment';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  reference_id?: string;
  payment_method?: string;
  created_at: string;
}

interface WalletStats {
  total_wallets: number;
  total_balance: number;
  total_pending: number;
  total_deposited: number;
  total_withdrawn: number;
  total_spent: number;
  active_wallets: number;
  frozen_wallets: number;
  suspended_wallets: number;
  avg_balance: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

export default function WalletsPage() {
  const [loading, setLoading] = useState(true);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletStats, setWalletStats] = useState<WalletStats>({
    total_wallets: 0,
    total_balance: 0,
    total_pending: 0,
    total_deposited: 0,
    total_withdrawn: 0,
    total_spent: 0,
    active_wallets: 0,
    frozen_wallets: 0,
    suspended_wallets: 0,
    avg_balance: 0
  });
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpNote, setTopUpNote] = useState('');
  const [processing, setProcessing] = useState(false);

  // Get token (from cookie or localStorage)
  const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    
    // Try to get from cookie first (for middleware)
    const cookies = document.cookie.split('; ');
    const adminTokenCookie = cookies.find(row => row.startsWith('admin_token='));
    if (adminTokenCookie) {
      return adminTokenCookie.split('=')[1];
    }
    
    // Fallback to localStorage
    return localStorage.getItem('admin_token') || localStorage.getItem('token');
  };

  // Fetch wallets
  const fetchWallets = useCallback(async () => {
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
      if (userTypeFilter !== 'all') params.append('user_type', userTypeFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(
        `${API_URL}/admin/wallets?${params.toString()}`,
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
      const walletsData = data.data || data.wallets || [];
      setWallets(walletsData);
      setTotalPages(Math.ceil((data.total || walletsData.length) / itemsPerPage));
      
    } catch (error) {
      console.error('Error fetching wallets:', error);
      // Fallback mock data
      setWallets([
        {
          id: 1,
          user_id: 101,
          user_name: "Ahmad Fauzi",
          user_email: "ahmad@agrohub.com",
          user_type: "farmer",
          balance: 2500000,
          pending_balance: 0,
          total_deposited: 5000000,
          total_withdrawn: 2500000,
          total_spent: 0,
          status: "active",
          created_at: "2024-01-15T00:00:00Z",
          updated_at: "2024-01-15T00:00:00Z"
        },
        {
          id: 2,
          user_id: 102,
          user_name: "Budi Santoso",
          user_email: "budi@agrohub.com",
          user_type: "vendor",
          balance: 8750000,
          pending_balance: 500000,
          total_deposited: 15000000,
          total_withdrawn: 6250000,
          total_spent: 0,
          status: "active",
          created_at: "2024-02-20T00:00:00Z",
          updated_at: "2024-02-20T00:00:00Z"
        },
        {
          id: 3,
          user_id: 103,
          user_name: "Siti Nurhaliza",
          user_email: "siti@agrohub.com",
          user_type: "customer",
          balance: 350000,
          pending_balance: 0,
          total_deposited: 500000,
          total_withdrawn: 150000,
          total_spent: 0,
          status: "active",
          created_at: "2024-03-10T00:00:00Z",
          updated_at: "2024-03-10T00:00:00Z"
        }
      ]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, userTypeFilter, statusFilter]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const token = getToken();
      
      if (!token) return;

      const response = await fetch(`${API_URL}/admin/wallets/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) return;

      const data = await response.json();
      const statsData = data.data || data;
      
      setWalletStats({
        total_wallets: statsData.total_wallets || 1250,
        total_balance: statsData.total_balance || 8750000000,
        total_pending: statsData.total_pending || 125000000,
        total_deposited: statsData.total_deposited || 15000000000,
        total_withdrawn: statsData.total_withdrawn || 6250000000,
        total_spent: statsData.total_spent || 0,
        active_wallets: statsData.active_wallets || 1120,
        frozen_wallets: statsData.frozen_wallets || 85,
        suspended_wallets: statsData.suspended_wallets || 45,
        avg_balance: statsData.avg_balance || 7000000
      });
      
    } catch (error) {
      console.error('Error fetching stats:', error);
      setWalletStats({
        total_wallets: 1250,
        total_balance: 8750000000,
        total_pending: 125000000,
        total_deposited: 15000000000,
        total_withdrawn: 6250000000,
        total_spent: 0,
        active_wallets: 1120,
        frozen_wallets: 85,
        suspended_wallets: 45,
        avg_balance: 7000000
      });
    }
  }, []);

  // Fetch transactions for a wallet
  const fetchTransactions = async (walletId: number) => {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/admin/wallets/${walletId}/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) return;

      const data = await response.json();
      const transactionsData = data.data || data.transactions || [];
      setTransactions(transactionsData);
      
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([
        {
          id: 1,
          wallet_id: walletId,
          amount: 500000,
          type: "deposit",
          status: "completed",
          description: "Top up via Bank Transfer",
          reference_id: "TXN-001",
          payment_method: "Bank Transfer",
          created_at: "2024-01-15T10:30:00Z"
        },
        {
          id: 2,
          wallet_id: walletId,
          amount: 250000,
          type: "withdraw",
          status: "completed",
          description: "Penarikan dana",
          reference_id: "WDR-001",
          payment_method: "Bank Transfer",
          created_at: "2024-01-20T14:00:00Z"
        }
      ]);
    }
  };

  // Top up wallet
  const handleTopUp = async () => {
    if (!selectedWallet || !topUpAmount || Number(topUpAmount) <= 0) return;
    
    setProcessing(true);
    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/admin/wallets/${selectedWallet.id}/topup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: Number(topUpAmount),
          note: topUpNote,
          admin_action: true
        })
      });

      if (response.ok) {
        fetchWallets();
        fetchStats();
        setShowTopUpModal(false);
        setTopUpAmount('');
        setTopUpNote('');
        if (selectedWallet) {
          fetchTransactions(selectedWallet.id);
        }
      } else {
        const error = await response.json();
        console.error('Top up failed:', error);
        alert(error.message || 'Top up gagal');
      }
    } catch (error) {
      console.error('Error topping up wallet:', error);
      alert('Terjadi kesalahan saat top up');
    } finally {
      setProcessing(false);
    }
  };

  // Update wallet status
  const updateWalletStatus = async (walletId: number, status: string) => {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/admin/wallets/${walletId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchWallets();
        fetchStats();
        if (selectedWallet) {
          setSelectedWallet({ ...selectedWallet, status: status as Wallet['status'] });
        }
      }
    } catch (error) {
      console.error('Error updating wallet status:', error);
    }
  };

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
      year: 'numeric'
    });
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

  // Get wallet status badge
  const getWalletStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Active</span>;
      case 'frozen':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> Frozen</span>;
      case 'suspended':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1"><XCircle className="w-3 h-3" /> Suspended</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Unknown</span>;
    }
  };

  // Get transaction type badge
  const getTransactionTypeBadge = (type: string) => {
    switch (type) {
      case 'deposit':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1"><ArrowDownRight className="w-3 h-3" /> Deposit</span>;
      case 'withdraw':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> Withdraw</span>;
      case 'payment':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1"><CreditCard className="w-3 h-3" /> Payment</span>;
      case 'refund':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full flex items-center gap-1"><ArrowDownRight className="w-3 h-3" /> Refund</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{type}</span>;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setUserTypeFilter('all');
    setStatusFilter('all');
  };

  const activeFiltersCount = (searchTerm ? 1 : 0) + (userTypeFilter !== 'all' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0);

  // Initial fetch
  useEffect(() => {
    fetchWallets();
    fetchStats();
  }, [fetchWallets, fetchStats]);

  if (loading && wallets.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        <span className="ml-2 text-gray-500">Memuat data wallets...</span>
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
              <Wallet className="w-6 h-6 text-green-600" />
              <h1 className="text-2xl font-bold capitalize text-gray-800">
                Wallets Management
              </h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Kelola dompet digital, saldo, dan riwayat transaksi pengguna
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
            <Wallet className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{walletStats.total_wallets.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Dompet</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-xs text-gray-400">Balance</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{formatCurrency(walletStats.total_balance)}</p>
          <p className="text-xs text-gray-500">Total saldo</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            <span className="text-xs text-gray-400">Pending</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{formatCurrency(walletStats.total_pending)}</p>
          <p className="text-xs text-gray-500">Saldo pending</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <ArrowDownRight className="w-5 h-5 text-green-600" />
            <span className="text-xs text-gray-400">Deposited</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{formatCurrency(walletStats.total_deposited)}</p>
          <p className="text-xs text-gray-500">Total deposit</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <ArrowUpRight className="w-5 h-5 text-red-500" />
            <span className="text-xs text-gray-400">Withdrawn</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{formatCurrency(walletStats.total_withdrawn)}</p>
          <p className="text-xs text-gray-500">Total withdraw</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-xs text-gray-400">Active</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{walletStats.active_wallets.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Dompet aktif</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-orange-500" />
            <span className="text-xs text-gray-400">Frozen</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{walletStats.frozen_wallets}</p>
          <p className="text-xs text-gray-500">Dompet frozen</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-5 h-5 text-red-500" />
            <span className="text-xs text-gray-400">Suspended</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{walletStats.suspended_wallets}</p>
          <p className="text-xs text-gray-500">Dompet suspend</p>
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
                placeholder="Cari berdasarkan nama atau email pengguna..."
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
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none text-sm"
            >
              <option value="all">Semua Tipe</option>
              <option value="farmer">Petani</option>
              <option value="vendor">Vendor</option>
              <option value="customer">Customer</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none text-sm"
            >
              <option value="all">Semua Status</option>
              <option value="active">Active</option>
              <option value="frozen">Frozen</option>
              <option value="suspended">Suspended</option>
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
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50"
            >
              <option value="all">Semua Tipe</option>
              <option value="farmer">Petani</option>
              <option value="vendor">Vendor</option>
              <option value="customer">Customer</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50"
            >
              <option value="all">Semua Status</option>
              <option value="active">Active</option>
              <option value="frozen">Frozen</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        )}
      </div>

      {/* WALLETS TABLE */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Pengguna</th>
                <th className="px-4 py-3 font-medium">Tipe</th>
                <th className="px-4 py-3 font-medium">Saldo</th>
                <th className="px-4 py-3 font-medium">Pending</th>
                <th className="px-4 py-3 font-medium">Total Deposit</th>
                <th className="px-4 py-3 font-medium">Total Withdraw</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {wallets.length > 0 ? (
                wallets.map((wallet) => (
                  <tr key={wallet.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-800">{wallet.user_name}</p>
                        <p className="text-xs text-gray-400">{wallet.user_email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getUserTypeBadge(wallet.user_type)}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-green-600">{formatCurrency(wallet.balance)}</p>
                    </td>
                    <td className="px-4 py-3 text-yellow-600">{formatCurrency(wallet.pending_balance)}</td>
                    <td className="px-4 py-3 text-gray-600">{formatCurrency(wallet.total_deposited)}</td>
                    <td className="px-4 py-3 text-gray-600">{formatCurrency(wallet.total_withdrawn)}</td>
                    <td className="px-4 py-3">{getWalletStatusBadge(wallet.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedWallet(wallet);
                            setShowDetailModal(true);
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4 text-blue-500" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedWallet(wallet);
                            setShowTopUpModal(true);
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                          title="Top Up"
                        >
                          <Plus className="w-4 h-4 text-green-600" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedWallet(wallet);
                            fetchTransactions(wallet.id);
                            setShowTransactionsModal(true);
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                          title="Riwayat"
                        >
                          <Activity className="w-4 h-4 text-purple-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                    <Wallet className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Belum ada data dompet</p>
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
              Menampilkan {wallets.length} dari {walletStats.total_wallets} dompet
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

      {/* Wallet Detail Modal */}
      {showDetailModal && selectedWallet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Detail Dompet</h3>
                  <p className="text-sm text-gray-500">{selectedWallet.user_name}</p>
                </div>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedWallet(null);
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
                    <p className="text-sm text-gray-500">Status Dompet</p>
                    <div className="mt-2">
                      {getWalletStatusBadge(selectedWallet.status)}
                    </div>
                  </div>
                  <select
                    value={selectedWallet.status}
                    onChange={(e) => updateWalletStatus(selectedWallet.id, e.target.value)}
                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="frozen">Frozen</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Balance Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500">Saldo Tersedia</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedWallet.balance)}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500">Saldo Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{formatCurrency(selectedWallet.pending_balance)}</p>
                </div>
              </div>

              {/* User Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nama Lengkap</p>
                  <p className="font-medium">{selectedWallet.user_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedWallet.user_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipe Pengguna</p>
                  <p className="font-medium">{getUserTypeBadge(selectedWallet.user_type)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bergabung Sejak</p>
                  <p className="font-medium">{formatDate(selectedWallet.created_at)}</p>
                </div>
              </div>

              {/* Transaction Summary */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Ringkasan Transaksi</h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Total Deposit</p>
                    <p className="font-semibold text-green-600">{formatCurrency(selectedWallet.total_deposited)}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Total Withdraw</p>
                    <p className="font-semibold text-red-600">{formatCurrency(selectedWallet.total_withdrawn)}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Total Spent</p>
                    <p className="font-semibold text-blue-600">{formatCurrency(selectedWallet.total_spent)}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t flex gap-3">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowTopUpModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Top Up Saldo
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    fetchTransactions(selectedWallet.id);
                    setShowTransactionsModal(true);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  Lihat Riwayat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Modal */}
      {showTransactionsModal && selectedWallet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Riwayat Transaksi</h3>
                  <p className="text-sm text-gray-500">{selectedWallet.user_name}</p>
                </div>
                <button
                  onClick={() => {
                    setShowTransactionsModal(false);
                    setSelectedWallet(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 border rounded-xl hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        {tx.type === 'deposit' ? (
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <ArrowDownRight className="w-5 h-5 text-green-600" />
                          </div>
                        ) : tx.type === 'withdraw' ? (
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <ArrowUpRight className="w-5 h-5 text-red-600" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800">{tx.description}</p>
                          <p className="text-xs text-gray-400">{formatDate(tx.created_at)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${tx.type === 'deposit' ? 'text-green-600' : tx.type === 'withdraw' ? 'text-red-600' : 'text-blue-600'}`}>
                          {tx.type === 'deposit' ? '+' : tx.type === 'withdraw' ? '-' : ''}{formatCurrency(tx.amount)}
                        </p>
                        <p className="text-xs text-gray-400">{getTransactionTypeBadge(tx.type)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Belum ada transaksi</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Up Modal */}
      {showTopUpModal && selectedWallet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Top Up Saldo</h3>
                <button
                  onClick={() => {
                    setShowTopUpModal(false);
                    setTopUpAmount('');
                    setTopUpNote('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pengguna</p>
                <p className="font-medium">{selectedWallet.user_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Saldo Saat Ini</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(selectedWallet.balance)}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Jumlah Top Up</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Catatan (Opsional)</label>
                <textarea
                  value={topUpNote}
                  onChange={(e) => setTopUpNote(e.target.value)}
                  placeholder="Tambahkan catatan..."
                  rows={2}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => {
                    setShowTopUpModal(false);
                    setTopUpAmount('');
                    setTopUpNote('');
                  }}
                  className="flex-1 px-4 py-2 border rounded-xl hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleTopUp}
                  disabled={processing || !topUpAmount || Number(topUpAmount) <= 0}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Proses Top Up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}