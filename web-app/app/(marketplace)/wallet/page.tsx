// C:\taniapp\agrohub\web-app\app\(marketplace)\wallet\page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Wallet, Eye, EyeOff, ArrowUpRight, ArrowDownRight, Plus, Send, History } from 'lucide-react';
import Link from 'next/link';

interface Transaction {
  id: string;
  type: 'topup' | 'payment' | 'refund' | 'transfer';
  amount: number;
  date: string;
  status: 'success' | 'pending' | 'failed';
  description: string;
}

export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [balance, setBalance] = useState(1250000);
  const [activeTab, setActiveTab] = useState<'transactions' | 'topup'>('transactions');

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'topup',
      amount: 100000,
      date: '2026-05-28',
      status: 'success',
      description: 'Top Up via Bank Transfer',
    },
    {
      id: '2',
      type: 'payment',
      amount: -50000,
      date: '2026-05-27',
      status: 'success',
      description: 'Pembayaran Pesanan #INV-001',
    },
    {
      id: '3',
      type: 'refund',
      amount: 25000,
      date: '2026-05-26',
      status: 'success',
      description: 'Refund Pesanan #INV-002',
    },
    {
      id: '4',
      type: 'payment',
      amount: -75000,
      date: '2026-05-25',
      status: 'success',
      description: 'Pembayaran Pesanan #INV-003',
    },
  ];

  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'topup':
        return <Plus className="w-5 h-5 text-green-600" />;
      case 'payment':
        return <ArrowUpRight className="w-5 h-5 text-red-600" />;
      case 'refund':
        return <ArrowDownRight className="w-5 h-5 text-blue-600" />;
      case 'transfer':
        return <Send className="w-5 h-5 text-purple-600" />;
    }
  };

  const getTransactionLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'topup':
        return 'Top Up Saldo';
      case 'payment':
        return 'Pembayaran';
      case 'refund':
        return 'Refund';
      case 'transfer':
        return 'Transfer';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-xl">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dompet Digital</h1>
              <p className="text-sm text-gray-500">Kelola saldo dan transaksi Anda</p>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-green-700 to-emerald-700 rounded-2xl p-6 text-white mb-6 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-200 text-sm mb-1">Total Saldo</p>
              <div className="flex items-center gap-3">
                <p className="text-4xl font-bold">
                  {showBalance ? `Rp ${balance.toLocaleString('id-ID')}` : 'Rp •••••••'}
                </p>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 hover:bg-green-600 rounded-full transition"
                >
                  {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-green-200 text-xs">Saldo Tersedia</p>
              <p className="text-sm font-semibold">
                {showBalance ? `Rp ${balance.toLocaleString('id-ID')}` : 'Rp •••••••'}
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button className="flex-1 bg-white/20 hover:bg-white/30 px-4 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Top Up
            </button>
            <button className="flex-1 bg-white/20 hover:bg-white/30 px-4 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              Transfer
            </button>
            <button className="flex-1 bg-white/20 hover:bg-white/30 px-4 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2">
              <History className="w-4 h-4" />
              Riwayat
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Total Pemasukan</p>
              <div className="p-1 bg-green-100 rounded-lg">
                <ArrowDownRight className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-green-600">
              Rp {totalIncome.toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-gray-400 mt-1">30 hari terakhir</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Total Pengeluaran</p>
              <div className="p-1 bg-red-100 rounded-lg">
                <ArrowUpRight className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-red-600">
              Rp {totalExpense.toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-gray-400 mt-1">30 hari terakhir</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                activeTab === 'transactions'
                  ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Riwayat Transaksi
            </button>
            <button
              onClick={() => setActiveTab('topup')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                activeTab === 'topup'
                  ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Metode Top Up
            </button>
          </div>

          {/* Transactions List */}
          {activeTab === 'transactions' && (
            <div className="divide-y">
              {transactions.length === 0 ? (
                <div className="p-8 text-center">
                  <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Belum ada transaksi</p>
                </div>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-full">
                          {getTransactionIcon(tx.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {getTransactionLabel(tx.type)}
                          </p>
                          <p className="text-xs text-gray-400">{tx.date}</p>
                          <p className="text-xs text-gray-500 mt-1">{tx.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {tx.amount > 0 ? '+' : ''}
                          Rp {Math.abs(tx.amount).toLocaleString('id-ID')}
                        </p>
                        <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full mt-1">
                          {tx.status === 'success' ? 'Berhasil' : tx.status === 'pending' ? 'Proses' : 'Gagal'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Top Up Methods */}
          {activeTab === 'topup' && (
            <div className="p-4 space-y-3">
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">BCA</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Transfer Bank BCA</p>
                    <p className="text-xs text-gray-500">Min. Top Up Rp10.000</p>
                  </div>
                  <div className="text-green-600">→</div>
                </div>
              </div>
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">OVO</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">OVO</p>
                    <p className="text-xs text-gray-500">Min. Top Up Rp10.000</p>
                  </div>
                  <div className="text-green-600">→</div>
                </div>
              </div>
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold">QR</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">QRIS</p>
                    <p className="text-xs text-gray-500">Scan QR Code</p>
                  </div>
                  <div className="text-green-600">→</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-blue-100 rounded-lg">
              <Wallet className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">Informasi Dompet Digital</p>
              <p className="text-xs text-blue-600 mt-1">
                Saldo dapat digunakan untuk bertransaksi di seluruh toko AgroHub.
                Top Up minimal Rp10.000 dan maksimal Rp5.000.000 per transaksi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}