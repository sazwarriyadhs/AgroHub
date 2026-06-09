'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, Mail, Lock, User, Building2, FileText, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function RegisterVendorPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    businessType: '',
    address: '',
    agreeTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/verify-email');
    }, 1500);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Store Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Nama Toko
          </label>
          <div className="relative">
            <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={formData.storeName}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              placeholder="Tani Makmur Store"
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-white focus:border-green-500 focus:outline-none transition"
              required
            />
          </div>
        </div>

        {/* Owner Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Nama Pemilik
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              placeholder="Budi Santoso"
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-white focus:border-green-500 focus:outline-none transition"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Email Toko
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="toko@agrohub.id"
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-white focus:border-green-500 focus:outline-none transition"
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Nomor Telepon
          </label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="0812 3456 7890"
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-white focus:border-green-500 focus:outline-none transition"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Minimal 6 karakter"
              className="w-full h-12 pl-12 pr-12 rounded-xl border border-slate-200 bg-white focus:border-green-500 focus:outline-none transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff className="w-5 h-5 text-slate-400" /> : <Eye className="w-5 h-5 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Alamat Toko
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Jl. Pertanian No. 123, Jakarta"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-green-500 focus:outline-none transition resize-none"
            required
          />
        </div>

        {/* Terms Agreement */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
              required
            />
            <span className="text-sm text-slate-600">
              Saya menyetujui{' '}
              <Link href="/terms" className="text-green-600 hover:text-green-700">
                Syarat & Ketentuan Seller
              </Link>
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Store className="w-5 h-5" />
              Daftar sebagai Penjual
            </>
          )}
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-slate-600">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold">
            Masuk Sekarang
          </Link>
        </p>
      </form>
    </div>
  );
}
