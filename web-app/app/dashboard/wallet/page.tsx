'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Wallet,
  ArrowUp,
  ArrowDown,
  CreditCard,
  History,
  Banknote,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Filter,
  Calendar,
  ChevronRight,
  ArrowLeft,
  Search,
  ShoppingCart,
  Heart,
  Bell,
  User,
  Home,
  Package,
  Store,
  Newspaper,
  Gift,
  HelpCircle,
} from 'lucide-react';

interface Transaction {
  id: number;
  type: 'topup' | 'order' | 'withdraw';
  amount: number;
  status: 'success' | 'pending' | 'failed';
  date: string;
  time: string;
  description: string;
  paymentMethod?: string;
  reference?: string;
}

interface WalletData {
  balance: number;
  pending_balance: number;
  total_withdrawn: number;
  total_topup: number;
}

export default function WalletPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Ahmad Fauzi');

  const [walletData, setWalletData] = useState<WalletData>({
    balance: 0,
    pending_balance: 0,
    total_withdrawn: 0,
    total_topup: 0,
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const marketplaceMenu = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Produk', href: '/product', icon: Package },
    { name: 'Toko', href: '/stores', icon: Store },
    { name: 'Artikel', href: '/artikel', icon: Newspaper },
    { name: 'Promo', href: '/promo', icon: Gift },
    { name: 'Bantuan', href: '/bantuan', icon: HelpCircle },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name || 'Ahmad Fauzi');
      } catch {}
    }

    fetchWalletData();
    fetchTransactions();
  }, [router]);

  const fetchWalletData = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        'http://localhost:8900/api/wallet',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        setWalletData({
          balance: data.balance || 5000000,
          pending_balance: data.pending_balance || 250000,
          total_withdrawn: data.total_withdrawn || 300000,
          total_topup: data.total_topup || 700000,
        });
      }
    } catch {
      setWalletData({
        balance: 5000000,
        pending_balance: 250000,
        total_withdrawn: 300000,
        total_topup: 700000,
      });
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        'http://localhost:8900/api/wallet/transactions',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      } else {
        setTransactions([
          {
            id: 1,
            type: 'topup',
            amount: 200000,
            status: 'success',
            date: '2026-04-28',
            time: '15:17',
            description: 'Top Up Saldo',
          },
          {
            id: 2,
            type: 'order',
            amount: -120000,
            status: 'success',
            date: '2026-04-28',
            time: '14:32',
            description: 'Pembayaran Order #AG260428-001',
          },
          {
            id: 3,
            type: 'withdraw',
            amount: -300000,
            status: 'pending',
            date: '2026-04-28',
            time: '11:05',
            description: 'Penarikan Saldo',
          },
        ]);
      }
    } catch {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Math.abs(amount));

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'topup':
        return <ArrowUp className="w-5 h-5 text-green-600" />;
      case 'order':
        return <CreditCard className="w-5 h-5 text-blue-600" />;
      case 'withdraw':
        return <ArrowDown className="w-5 h-5 text-red-600" />;
      default:
        return <History className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Berhasil
          </span>
        );

      case 'pending':
        return (
          <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );

      default:
        return (
          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Gagal
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-10 w-10 rounded-full border-4 border-green-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf8]">
      {/* HEADER */}
      

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        

        <div>
                   <p className="text-gray-500 mt-2">
            Kelola saldo dan transaksi Anda
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
            <Wallet className="w-8 h-8 mb-4" />
            <p className="text-sm opacity-80">Saldo Tersedia</p>
            <h2 className="text-4xl font-bold mt-2">
              {formatCurrency(walletData.balance)}
            </h2>

            <div className="flex gap-3 mt-6">
              <button className="bg-white text-green-700 px-4 py-2 rounded-xl font-semibold">
                Top Up
              </button>

              <button className="bg-white/20 px-4 py-2 rounded-xl font-semibold">
                Tarik Saldo
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border p-6">
            <h3 className="font-semibold mb-4">Ringkasan</h3>

            <div className="space-y-4">
              <div className="flex justify-between border-b pb-3">
                <span>Saldo Tersedia</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(walletData.balance)}
                </span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span>Saldo Tertahan</span>
                <span className="font-semibold text-yellow-600">
                  {formatCurrency(walletData.pending_balance)}
                </span>
              </div>

              <div className="flex justify-between font-bold text-lg">
                <span>Total Saldo</span>
                <span>
                  {formatCurrency(
                    walletData.balance + walletData.pending_balance
                  )}
                </span>
              </div>
            </div>

            <div className="mt-4 bg-blue-50 rounded-xl p-3 text-sm text-blue-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Saldo tertahan akan cair setelah pesanan selesai
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border">
          <div className="p-5 border-b flex items-center justify-between">
            <h2 className="font-bold text-lg">Transaksi Terbaru</h2>

            <div className="flex gap-2">
              <button className="p-2 border rounded-lg">
                <Filter className="w-4 h-4" />
              </button>

              <button className="p-2 border rounded-lg">
                <Calendar className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="divide-y">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    {getTypeIcon(tx.type)}
                  </div>

                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-gray-500">
                      {tx.date} • {tx.time}
                    </p>
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <p
                    className={`font-semibold ${
                      tx.amount > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {tx.amount > 0 ? '+' : '-'}{' '}
                    {formatCurrency(tx.amount)}
                  </p>

                  {getStatusBadge(tx.status)}
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 border-t text-center">
            <button className="text-green-600 font-medium inline-flex items-center gap-1">
              Lihat Semua
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

