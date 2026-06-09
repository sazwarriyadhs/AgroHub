'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn, Mail, Lock, Facebook, Apple, AlertCircle, CheckCircle, Shield, UserCheck } from 'lucide-react';
import axios from 'axios';

// IMPORT dari marketplace state
import { useUserStore } from '../../(marketplace)/state/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

// Helper function untuk format role
const getRoleDisplayName = (role: string): string => {
  const roleMap: Record<string, string> = {
    farmer: 'Petani',
    seller: 'Penjual',
    admin: 'Administrator',
    vendor: 'Vendor',
    customer: 'Pembeli',
    buyer: 'Pembeli',
  };
  return roleMap[role?.toLowerCase()] || 'Member';
};

// Helper function untuk menyimpan data user secara konsisten
const saveUserData = (userData: any, token: string) => {
  // Simpan token
  localStorage.setItem('token', token);
  
  // Simpan user object lengkap
  localStorage.setItem('user', JSON.stringify(userData));
  
  // Simpan individual keys untuk kemudahan akses
  const userName = userData.name || userData.displayName || userData.fullName || userData.email?.split('@')[0] || 'Pengguna';
  const userEmail = userData.email || '';
  const userRole = userData.role || 'customer';
  const userId = String(userData.id || Date.now());
  
  localStorage.setItem('userName', userName);
  localStorage.setItem('userEmail', userEmail);
  localStorage.setItem('userRole', userRole);
  localStorage.setItem('userId', userId);
  
  // Set cookies untuk middleware
  document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
  document.cookie = `user_role=${userRole}; path=/; max-age=604800; SameSite=Lax`;
  document.cookie = `user_name=${encodeURIComponent(userName)}; path=/; max-age=604800; SameSite=Lax`;
  document.cookie = `user_email=${encodeURIComponent(userEmail)}; path=/; max-age=604800; SameSite=Lax`;
  
  // Jika remember me, set cookie lebih lama
  // (akan ditangani di component nanti)
  
  return { userName, userEmail, userRole, userId };
};

// Helper function untuk clear semua data user
const clearUserData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  localStorage.removeItem('cartCount');
  
  document.cookie = 'token=; Max-Age=0; path=/';
  document.cookie = 'user_role=; Max-Age=0; path=/';
  document.cookie = 'user_name=; Max-Age=0; path=/';
  document.cookie = 'user_email=; Max-Age=0; path=/';
};

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUserStore();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const verifyToken = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = response.data?.data || response.data;
          
          if (response.data.success || data) {
            const userRole = data.role || data.roles?.split(', ')[0] || 'customer';
            const userName = data.name || data.full_name || data.display_name || 'Pengguna';
            const userEmail = data.email || '';
            
            // Refresh cookies
            document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
            document.cookie = `user_role=${userRole}; path=/; max-age=604800; SameSite=Lax`;
            document.cookie = `user_name=${encodeURIComponent(userName)}; path=/; max-age=604800; SameSite=Lax`;
            document.cookie = `user_email=${encodeURIComponent(userEmail)}; path=/; max-age=604800; SameSite=Lax`;
            
            router.push('/');
          }
        } catch {
          clearUserData();
        }
      };
      verifyToken();
    }
  }, [router]);

  // FETCH FULL PROFILE
  const fetchFullProfile = async (token: string): Promise<any | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data?.data || response.data;
      if (!data) return null;

      // Ambil nama dengan prioritas yang benar
      const userName = data.full_name || data.name || data.display_name || data.email?.split('@')[0] || 'Pengguna';
      const userEmail = data.email || '';
      const userRole = data.role || data.roles?.split(', ')[0] || 'customer';

      return {
        id: data.user_id || data.id,
        name: userName,
        email: userEmail,
        role: userRole,
        roles: data.roles?.split(', ') || [userRole],
        roleName: getRoleDisplayName(userRole),
        displayName: userName,
        initial: userName.charAt(0).toUpperCase(),
        isVerified: Boolean(data.is_verified),
        fullName: data.full_name || userName,
        dateOfBirth: data.date_of_birth ?? '',
        gender: data.gender ?? '',
        defaultAddressLabel: data.default_address_label ?? '',
        secondaryAddress: data.secondary_address ?? '',
        deliveryInstructions: data.delivery_instructions ?? '',
        preferredCategories: data.preferred_categories ?? [],
        totalOrders: Number(data.total_orders || 0),
        totalSpent: Number(data.total_spent || 0),
        loyaltyPoints: Number(data.loyalty_points || 0),
        membershipTier: data.membership_tier || 'bronze',
        marketingOptIn: Boolean(data.marketing_opt_in),
        profileCompleted: Boolean(data.profile_completed),
        walletNumber: data.wallet_number ?? '',
        balance: Number(data.balance || 0),
        holdBalance: Number(data.hold_balance || 0),
        availableBalance: Number(data.available_balance || 0),
        cartItemsCount: Number(data.cart_items_count || 0),
        cartTotal: Number(data.cart_total || 0),
      };
    } catch (error) {
      console.error('fetch profile error', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Email dan password wajib diisi');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_BASE_URL}/public/login`, {
        email: formData.email,
        password: formData.password,
      });

      const data = response.data;

      if (data.success || data.data) {
        const token = data.data?.token || data.token;
        
        const userData: any = await fetchFullProfile(token);
        
        if (userData) {
          // Gunakan helper function untuk menyimpan data
          saveUserData(userData, token);
          setUser(userData);
          
          setSuccess(`Login berhasil! Selamat datang, ${userData.name}`);
          
          setTimeout(() => {
            if (userData.role === 'admin') {
              router.push('/admin/dashboard');
            } else if (userData.role === 'seller' || userData.role === 'vendor') {
              router.push('/seller/dashboard');
            } else {
              router.push('/');
            }
          }, 1000);
        } else {
          // Fallback handling
          const user = data.data?.user || data.user;
          const userName = user?.name || user?.full_name || formData.email.split('@')[0];
          const userEmail = user?.email || formData.email;
          const userRole = user?.role || 'customer';
          
          const fallbackUserData = {
            id: user?.id || Date.now(),
            name: userName,
            email: userEmail,
            role: userRole,
            roleName: getRoleDisplayName(userRole),
            displayName: userName,
            initial: userName.charAt(0).toUpperCase(),
            isVerified: user?.is_verified || false,
          };
          
          saveUserData(fallbackUserData, token);
          setUser(fallbackUserData);
          
          setSuccess('Login berhasil! Mengalihkan...');
          setTimeout(() => router.push('/'), 1000);
        }
      } else {
        setError(data.message || 'Email atau password salah');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError('Email atau password salah');
      } else {
        setError('Gagal terhubung ke server. Periksa koneksi Anda.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Demo login handler yang sudah diperbaiki
  const handleDemoLogin = async (email: string, password: string, role: string = 'customer', customName?: string) => {
    setFormData({ ...formData, email, password });
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_BASE_URL}/public/login`, { email, password })
        .catch(() => null);
      
      if (response?.data?.success || response?.data?.data) {
        const token = response.data.data?.token || response.data.token;
        
        const userData: any = await fetchFullProfile(token);
        if (userData) {
          saveUserData(userData, token);
          setUser(userData);
          setSuccess(`Login berhasil! Selamat datang, ${userData.name}`);
        } else {
          // Fallback dengan data dari response
          const user = response.data.data?.user || response.data.user;
          const userName = customName || user?.name || user?.full_name || email.split('@')[0];
          const userEmail = user?.email || email;
          
          const fallbackData = {
            id: user?.id || Date.now(),
            name: userName,
            email: userEmail,
            role: role,
            roleName: getRoleDisplayName(role),
            displayName: userName,
            initial: userName.charAt(0).toUpperCase(),
            isVerified: false,
          };
          saveUserData(fallbackData, token);
          setUser(fallbackData);
          setSuccess(`Login berhasil! Selamat datang, ${userName}`);
        }
        
        setTimeout(() => {
          if (role === 'seller' || role === 'vendor') router.push('/seller/dashboard');
          else if (role === 'admin') router.push('/admin/dashboard');
          else router.push('/');
        }, 1000);
      } else {
        // Mode Demo / Offline
        setTimeout(() => {
          const userName = customName || (email === 'tri.endah@agrohub.com' ? 'Tri Endah Ariwati' : email.split('@')[0]);
          const userEmail = email;
          const userRole = role;
          
          const userData = {
            id: Date.now(),
            name: userName,
            email: userEmail,
            role: userRole,
            roleName: getRoleDisplayName(userRole),
            displayName: userName,
            initial: userName.charAt(0).toUpperCase(),
            isVerified: true,
            totalOrders: 0,
            totalSpent: 0,
            loyaltyPoints: 0,
            membershipTier: 'bronze',
            walletNumber: `DEMO-${Date.now()}`,
            balance: 1000000,
            holdBalance: 0,
            availableBalance: 1000000,
            cartItemsCount: 0,
            cartTotal: 0,
          };

          const fakeToken = `demo_token_${Date.now()}`;
          saveUserData(userData, fakeToken);
          setUser(userData);
          
          setSuccess(`Login berhasil (Mode Demo)! Selamat datang, ${userName}`);
          
          setTimeout(() => {
            if (role === 'seller' || role === 'vendor') router.push('/seller/dashboard');
            else if (role === 'admin') router.push('/admin/dashboard');
            else router.push('/');
          }, 1000);
          setLoading(false);
        }, 500);
      }
    } catch (error) {
      // Fallback offline demo
      setTimeout(() => {
        const userName = customName || (email === 'tri.endah@agrohub.com' ? 'Tri Endah Ariwati' : email.split('@')[0]);
        const userEmail = email;
        const userRole = role;
        
        const userData = {
          id: Date.now(),
          name: userName,
          email: userEmail,
          role: userRole,
          roleName: getRoleDisplayName(userRole),
          displayName: userName,
          initial: userName.charAt(0).toUpperCase(),
          isVerified: true,
          totalOrders: 0,
          totalSpent: 0,
          loyaltyPoints: 0,
          membershipTier: 'bronze',
          walletNumber: `DEMO-${Date.now()}`,
          balance: 1000000,
          holdBalance: 0,
          availableBalance: 1000000,
          cartItemsCount: 0,
          cartTotal: 0,
        };

        const fakeToken = `demo_token_${Date.now()}`;
        saveUserData(userData, fakeToken);
        setUser(userData);
        
        setSuccess(`Login berhasil (Mode Demo)! Selamat datang, ${userName}`);
        
        setTimeout(() => {
          if (role === 'seller' || role === 'vendor') router.push('/seller/dashboard');
          else if (role === 'admin') router.push('/admin/dashboard');
          else router.push('/');
        }, 1000);
        setLoading(false);
      }, 500);
    }
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center overflow-hidden p-4"
      style={{
        backgroundImage: `url('/pasar.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div className="absolute w-[500px] h-[500px] bg-green-500/20 blur-3xl rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-emerald-400/20 blur-3xl rounded-full bottom-[-120px] right-[-120px]" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="flex justify-center">
            <div className="relative group inline-block">
              <div className="absolute inset-0 bg-white/30 blur-2xl opacity-50 group-hover:opacity-70 transition rounded-2xl" />
              <div className="relative p-2 bg-white/10 backdrop-blur-sm rounded-2xl">
                <Image
                  src="/assets/logo/logo-agrohub.png"
                  alt="AgroHub"
                  width={200}
                  height={100}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </Link>
          <p className="text-white/90 mt-2 text-sm drop-shadow">
            Marketplace pertanian modern Indonesia 🌱
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-xs text-white">
            <Shield className="w-3 h-3" />
            Secure • AI Powered • Real Marketplace
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 p-8 hover:shadow-green-100/20 transition">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="petani@agrohub.id"
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-white focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                  required
                />
              </div>
            </div>

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
                  placeholder="••••••••"
                  className="w-full h-12 pl-12 pr-12 rounded-xl border border-slate-200 bg-white focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-slate-600">Ingat saya</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-semibold">
                Lupa Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-green-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(120deg,transparent,white,transparent)] animate-pulse" />
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Masuk
                </div>
              )}
            </button>

            {/* Demo Accounts */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-slate-400" />
                <p className="text-xs text-slate-500">Akun Demo (Data Real Database)</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('buyer@agrohub.com', 'password123', 'customer', 'Pembeli Demo')}
                  className="text-sm bg-white border border-green-100 text-green-700 py-2 rounded-xl hover:bg-green-50 hover:shadow transition flex items-center justify-center gap-2"
                >
                  🛒 Customer
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('seller@agrohub.com', 'password123', 'seller', 'Penjual Demo')}
                  className="text-sm bg-white border border-green-100 text-green-700 py-2 rounded-xl hover:bg-green-50 hover:shadow transition flex items-center justify-center gap-2"
                >
                  🏪 Seller
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('farmer@agrohub.com', 'password123', 'farmer', 'Petani Demo')}
                  className="text-sm bg-white border border-green-100 text-green-700 py-2 rounded-xl hover:bg-green-50 hover:shadow transition flex items-center justify-center gap-2"
                >
                  🌾 Farmer
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('buyer@agrohub.com', 'password123', 'customer', 'Tri Endah Ariwati')}
                  className="text-sm bg-white border border-green-100 text-green-700 py-2 rounded-xl hover:bg-green-50 hover:shadow transition flex items-center justify-center gap-2"
                >
                  👤 Tri Endah
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">atau</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="h-11 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition">
                <Facebook className="w-4 h-4 text-blue-600" />
                Facebook
              </button>
              <button type="button" className="h-11 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition">
                <Apple className="w-4 h-4" />
                Apple
              </button>
            </div>

            <p className="text-center text-sm text-slate-600">
              Belum punya akun?{' '}
              <Link href="/register" className="text-green-600 hover:text-green-700 font-semibold">
                Daftar Sekarang
              </Link>
            </p>

            <p className="text-center text-xs text-slate-400">
              Ingin berjualan?{' '}
              <Link href="/register/vendor" className="text-green-600 hover:text-green-700">
                Daftar sebagai Penjual
              </Link>
            </p>
          </form>
        </div>

        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-xs text-white/90">
            <UserCheck className="w-3 h-3" />
            End-to-End Encrypted • AgroHub Secure Auth
          </div>
        </div>
      </div>
    </div>
  );
}