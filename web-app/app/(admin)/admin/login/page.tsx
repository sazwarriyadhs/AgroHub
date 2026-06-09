'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Activity,
  Shield,
  TrendingUp,
} from 'lucide-react';

interface LoginUser {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  role_enum?: string;
  user_role?: string;
}

interface LoginResponse {
  token?: string;
  user?: LoginUser;
  data?: {
    token?: string;
    user?: LoginUser;
  };
  message?: string;
  error?: string;
}

export default function AdminLoginPage() {
  const mountedRef = useRef(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const normalizeRole = (role?: string) =>
    String(role || '').trim().toLowerCase().replace(/\s+/g, '_');

  const setCookie = (name: string, value: string, days = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError('');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1').replace(/\/$/, '');
      const finalUrl = `${apiUrl}/public/login`;

      console.log('LOGIN URL:', finalUrl);

      const response = await fetch(finalUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
        signal: controller.signal,
      });

      const raw = await response.text();
      console.log('STATUS:', response.status);
      console.log('RAW:', raw);

      let data: LoginResponse | null = null;

      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error(`Backend invalid response (${response.status})`);
      }

      if (!response.ok) {
        throw new Error(data?.error || data?.message || 'Login gagal');
      }

      const token = data?.data?.token || data?.token;
      const user = data?.data?.user || data?.user;

      if (!token) {
        throw new Error('Token tidak ditemukan');
      }

      if (!user) {
        throw new Error('User tidak ditemukan');
      }

      const role = normalizeRole(user.role || user.role_enum || user.user_role);
      const allowedRoles = ['admin', 'super_admin', 'superadmin'];

      if (!allowedRoles.includes(role)) {
        throw new Error(`Akses ditolak (${role})`);
      }

      const storage = remember ? localStorage : sessionStorage;

      storage.setItem('token', token);
      storage.setItem('admin_token', token);
      storage.setItem('user', JSON.stringify(user));
      storage.setItem('user_role', role);
      storage.setItem('agrohub_auth', JSON.stringify({ token, role, user }));

      setCookie('token', token);
      setCookie('admin_token', token);
      setCookie('user_role', role);
      setCookie('role', role);

      console.log('LOGIN SUCCESS');

      window.location.href = '/admin/dashboard';
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Login gagal');
    } finally {
      clearTimeout(timeout);
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#06120d] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-150px] left-[-150px] w-[420px] h-[420px] rounded-full bg-green-500/20 blur-3xl" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[420px] h-[420px] rounded-full bg-emerald-500/20 blur-3xl" />

      <div className="relative z-10 min-h-screen grid lg:grid-cols-2">
        {/* LEFT SIDE - Branding */}
        <div className="hidden lg:flex flex-col justify-between p-16">
          <div>
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white">AgroHub Admin</h1>
                <p className="text-green-200">Enterprise Control Panel</p>
              </div>
            </div>

            <h2 className="mt-24 text-6xl font-black text-white">
              Smart Agriculture
              <span className="block bg-gradient-to-r from-green-300 to-emerald-500 bg-clip-text text-transparent">
                Management
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[Activity, Shield, TrendingUp].map((Icon, i) => (
              <div key={i} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <Icon className="mb-3 text-green-400" />
                <p className="text-sm text-white">Enterprise</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - Login Form */}
        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/10 p-8 backdrop-blur-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Admin Login</h2>
              <p className="text-white/60 text-sm mt-2">Akses panel kontrol manajemen AgroHub</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@agrohub.com"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-green-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-green-500 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-white/40 hover:text-white/60 transition" />
                    ) : (
                      <Eye className="w-5 h-5 text-white/40 hover:text-white/60 transition" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-green-500"
                  />
                  <span className="text-white/60 text-sm">Ingat saya</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-green-400 text-sm hover:text-green-300 transition"
                >
                  Lupa password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white font-semibold hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
                <Sparkles className="w-3 h-3" />
                <span>AgroHub Enterprise Platform v2.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}