'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Mail, Send, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email wajib diisi');
      return;
    }
    if (!email.includes('@')) {
      setError('Email tidak valid');
      return;
    }
    
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Send className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-3">Cek Email Anda</h2>
        <p className="text-slate-600 mb-6">
          Kami telah mengirimkan link reset password ke <br />
          <span className="font-semibold text-green-700">{email}</span>
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
        >
          Kembali ke Login →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">
      <p className="text-slate-600 text-center mb-6">
        Masukkan email Anda, kami akan mengirimkan link untuk reset password
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="petani@agrohub.id"
              className={`w-full h-12 pl-12 pr-4 rounded-xl border ${error ? 'border-red-500' : 'border-slate-200'} bg-white focus:border-green-500 focus:outline-none transition`}
            />
          </div>
          {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5" />
              Kirim Link Reset
            </>
          )}
        </button>

        <p className="text-center text-sm">
          <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold">
            Kembali ke Login
          </Link>
        </p>
      </form>
    </div>
  );
}
