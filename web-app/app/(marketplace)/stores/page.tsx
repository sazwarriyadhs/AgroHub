// app/(marketplace)/stores/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

import {
  Search,
  Store,
  MapPin,
  Star,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
  Users,
  BadgeCheck,
  Filter,
  X,
  ChevronDown,
  Clock,
  Loader2,
} from 'lucide-react';

// ======================================================
// CONFIG
// ======================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';
const LOGO = '/assets/logo/logo-agrohub.png';
const PLACEHOLDER_STORE = '/placeholder-store.png';

// ======================================================
// NORMALIZE IMAGE FUNCTION
// ======================================================

const normalizeImage = (url?: string | null) => {
  if (!url) return PLACEHOLDER_STORE;
  
  // Jika URL sudah lengkap (http/https), gunakan langsung
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Jika URL adalah path lokal (dimulai dengan /)
  if (url.startsWith('/')) {
    return url;
  }
  
  // Jika URL adalah nama file gambar
  if (url.match(/^[a-zA-Z0-9_\-]+\.(png|jpg|jpeg|gif|webp)$/i)) {
    return `/gambar/${url}`;
  }
  
  return PLACEHOLDER_STORE;
};

// ======================================================
// DATA TOKO LANGSUNG (HARDCODED) - PASTI TAMPIL
// ======================================================

const DIRECT_STORES: Store[] = [
  {
    id: 7,
    name: 'AgroHub Aqua Store',
    slug: 'aqua-store',
    description: 'Distributor alat pertanian modern, traktor, sprayer, dan mesin pertanian lainnya.',
    city: 'Medan',
    province: 'Sumatera Utara',
    store_type: 'supplier',
    is_verified: true,
    is_active: true,
    rating: 4.7,
    total_products: 0,
    total_sales: 0,
    total_reviews: 1200,
    // Computed fields
    logo: PLACEHOLDER_STORE,
    banner: PLACEHOLDER_STORE,
    location: 'Medan, Sumatera Utara',
    verified: true,
    rating_count: 1200,
    followers: 0,
    products_count: 0,
  },
  {
    id: 23,
    name: 'AgroHub Farmer Collective',
    slug: 'farmer-collective',
    description: 'Hasil panen langsung dari petani berkualitas terbaik.',
    city: 'Yogyakarta',
    province: 'DI Yogyakarta',
    store_type: 'farmer',
    is_verified: true,
    is_active: true,
    rating: 4.9,
    total_products: 95,
    total_sales: 7200,
    total_reviews: 980,
    // Computed fields
    logo: PLACEHOLDER_STORE,
    banner: PLACEHOLDER_STORE,
    location: 'Yogyakarta, DI Yogyakarta',
    verified: true,
    rating_count: 980,
    followers: 7200,
    products_count: 95,
  },
  {
    id: 24,
    name: 'AgroHub Aqua Network',
    slug: 'aqua-network',
    description: 'Budidaya ikan & tambak modern terpercaya.',
    city: 'Sukabumi',
    province: 'Jawa Barat',
    store_type: 'distributor',
    is_verified: true,
    is_active: true,
    rating: 4.8,
    total_products: 110,
    total_sales: 6400,
    total_reviews: 860,
    // Computed fields
    logo: PLACEHOLDER_STORE,
    banner: PLACEHOLDER_STORE,
    location: 'Sukabumi, Jawa Barat',
    verified: true,
    rating_count: 860,
    followers: 6400,
    products_count: 110,
  },
  {
    id: 25,
    name: 'AgroHub Herd Center',
    slug: 'herd-center',
    description: 'Peternakan sapi & kambing premium.',
    city: 'Malang',
    province: 'Jawa Timur',
    store_type: 'supplier',
    is_verified: true,
    is_active: true,
    rating: 4.9,
    total_products: 85,
    total_sales: 9100,
    total_reviews: 1100,
    // Computed fields
    logo: PLACEHOLDER_STORE,
    banner: PLACEHOLDER_STORE,
    location: 'Malang, Jawa Timur',
    verified: true,
    rating_count: 1100,
    followers: 9100,
    products_count: 85,
  },
  {
    id: 3,
    name: 'AgroHub Farmer Store',
    slug: 'farmer-store',
    description: 'Menjual sayuran organik segar langsung dari petani.',
    city: 'Bogor',
    province: 'Jawa Barat',
    store_type: 'farmer',
    is_verified: true,
    is_active: true,
    rating: 4.7,
    total_products: 0,
    total_sales: 0,
    total_reviews: 25,
    // Computed fields
    logo: '/gambar/placeholder-store.png',
    banner: 'https://picsum.photos/800/300',
    location: 'Bogor, Jawa Barat',
    verified: true,
    rating_count: 25,
    followers: 0,
    products_count: 0,
  },
  {
    id: 19,
    name: 'AgroHub Vendor Store',
    slug: 'vendor-store',
    description: 'Marketplace vendor pertanian lengkap.',
    city: 'Bandung',
    province: 'Jawa Barat',
    store_type: 'supplier',
    is_verified: true,
    is_active: true,
    rating: 4.8,
    total_products: 10,
    total_sales: 5000,
    total_reviews: 120,
    // Computed fields
    logo: '/assets/images/vendor.png',
    banner: PLACEHOLDER_STORE,
    location: 'Bandung, Jawa Barat',
    verified: true,
    rating_count: 120,
    followers: 5000,
    products_count: 10,
  },
];

// ======================================================
// TYPES
// ======================================================

interface Store {
  id: number;
  name: string;
  slug: string;
  description?: string;
  city?: string;
  province?: string;
  store_logo_url?: string;
  store_banner_url?: string;
  store_type?: 'farmer' | 'distributor' | 'supplier' | 'retailer';
  is_verified: boolean;
  is_active: boolean;
  rating: number;
  total_products: number;
  total_sales: number;
  total_reviews: number;
  // Computed fields for UI
  logo?: string;
  banner?: string;
  location: string;
  verified: boolean;
  rating_count?: number;
  followers: number;
  products_count: number;
}

interface Stats {
  total_stores: number;
  total_products: number;
  total_farmers: number;
}

// ======================================================
// HELPERS
// ======================================================

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('id-ID').format(value || 0);
};

// ======================================================
// STORE CARD COMPONENT
// ======================================================

function StoreCard({ store, index }: { store: Store; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [bannerError, setBannerError] = useState(false);

  // Get store type badge
  const getStoreTypeBadge = () => {
    switch (store.store_type) {
      case 'farmer':
        return { label: 'Petani', color: 'bg-green-100 text-green-700' };
      case 'distributor':
        return { label: 'Distributor', color: 'bg-blue-100 text-blue-700' };
      case 'supplier':
        return { label: 'Supplier', color: 'bg-purple-100 text-purple-700' };
      case 'retailer':
        return { label: 'Retailer', color: 'bg-orange-100 text-orange-700' };
      default:
        return { label: 'Toko', color: 'bg-slate-100 text-slate-700' };
    }
  };

  const typeBadge = getStoreTypeBadge();

  // Get logo URL with fallback
  const logoUrl = normalizeImage(store.logo || store.store_logo_url);
  const bannerUrl = normalizeImage(store.banner || store.store_banner_url);

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFollowed(!isFollowed);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/stores/${store.id}`}>
        <div className="group bg-white rounded-[30px] overflow-hidden border border-slate-200 hover:shadow-2xl transition-all duration-300 cursor-pointer">
          {/* Banner/Image */}
          <div className="relative h-52 overflow-hidden bg-gradient-to-r from-green-100 to-emerald-100">
            {bannerUrl && !bannerError ? (
              <Image
                src={bannerUrl}
                alt={store.name}
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
                onError={() => setBannerError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Store className="w-20 h-20 text-green-300" />
              </div>
            )}
            
            {/* Store Type Badge */}
            <div className="absolute top-4 left-4">
              <span className={`${typeBadge.color} px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm`}>
                {typeBadge.label}
              </span>
            </div>

            {/* Verified Badge Overlay */}
            {store.verified && (
              <div className="absolute top-4 right-4 bg-green-600/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1">
                <BadgeCheck className="w-4 h-4 text-white" />
                <span className="text-white text-xs font-semibold">Verified</span>
              </div>
            )}

            {/* Follow Button on Hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onClick={handleFollow}
                  className={`absolute bottom-4 right-4 px-4 py-2 rounded-xl font-semibold text-sm transition ${
                    isFollowed
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-green-700 hover:bg-green-50'
                  } shadow-lg`}
                >
                  {isFollowed ? '✓ Diikuti' : '+ Ikuti'}
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900 line-clamp-1">
                    {store.name}
                  </h3>
                  {store.verified && (
                    <BadgeCheck className="w-5 h-5 text-green-600 shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="line-clamp-1">{store.location || 'Indonesia'}</span>
                </div>
              </div>

              {/* Store Logo */}
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0 ml-3">
                <Image 
                  src={logoUrl} 
                  alt={store.name} 
                  fill 
                  className="object-cover"
                  onError={() => setImgError(true)}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-5 mt-5 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-slate-800">
                  {store.rating?.toFixed(1) || '4.5'}
                </span>
                {store.total_reviews > 0 && (
                  <span className="text-slate-400 text-xs">
                    ({formatNumber(store.total_reviews)})
                  </span>
                )}
              </div>

              <div className="text-slate-500">
                {formatNumber(store.total_sales || 0)} terjual
              </div>

              <div className="text-slate-500">
                {formatNumber(store.products_count || 0)} produk
              </div>
            </div>

            {/* Description Preview */}
            {store.description && (
              <p className="text-slate-500 text-sm mt-3 line-clamp-2">
                {store.description}
              </p>
            )}

            {/* Action Button */}
            <div className="mt-5">
              <button className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-2xl text-sm font-bold transition shadow-md">
                Kunjungi Toko
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ======================================================
// MAIN PAGE COMPONENT
// ======================================================

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>(DIRECT_STORES);
  const [stats, setStats] = useState<Stats>({
    total_stores: DIRECT_STORES.length,
    total_products: 500,
    total_farmers: 1000,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: 'Semua Lokasi',
    sortBy: 'rating',
    minRating: 0,
    verified: false,
  });
  const [totalStores, setTotalStores] = useState(DIRECT_STORES.length);

  // Get filtered stores
  const getFilteredStores = useCallback(() => {
    let filtered = [...DIRECT_STORES];
    
    if (searchQuery) {
      filtered = filtered.filter(store => 
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filters.location !== 'Semua Lokasi') {
      filtered = filtered.filter(store => 
        store.location?.includes(filters.location)
      );
    }
    
    if (filters.verified) {
      filtered = filtered.filter(store => store.verified);
    }
    
    if (filters.minRating > 0) {
      filtered = filtered.filter(store => store.rating >= filters.minRating);
    }
    
    // Sorting
    switch (filters.sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'sales':
        filtered.sort((a, b) => b.total_sales - a.total_sales);
        break;
      case 'products':
        filtered.sort((a, b) => b.products_count - a.products_count);
        break;
      default:
        break;
    }
    
    return filtered;
  }, [searchQuery, filters]);

  const filteredStores = getFilteredStores();

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      const response = await api.get('/public/stores/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
      // Keep default stats
    }
  }, []);

  useEffect(() => {
    loadStats();
    setTotalStores(filteredStores.length);
  }, [loadStats, filteredStores.length]);

  // Handle filter change
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-green-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Memuat toko...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* ================================================= */}
      {/* HERO SECTION */}
      {/* ================================================= */}

      <section className="max-w-7xl mx-auto px-4 pt-6">
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-green-700 via-green-800 to-green-900 p-10">
          <div className="absolute right-0 top-0 opacity-10 text-[220px]">🌾</div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-green-500 rounded-full opacity-20 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4" />
              Toko Terpercaya AgroHub
            </div>

            <h1 className="text-6xl font-black text-white leading-tight">
              Temukan
              <br />
              Toko Terbaik
            </h1>

            <p className="text-green-100 text-lg mt-6 leading-relaxed">
              Supplier, distributor, dan petani terpercaya Indonesia dalam satu platform modern.
            </p>

            {/* Search Bar */}
            <div className="mt-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && setSearchQuery(searchQuery)}
                  placeholder="Cari toko berdasarkan nama..."
                  className="w-full h-14 pl-12 pr-28 rounded-2xl bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Stats Floating Card */}
          <div className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="text-center">
              <div className="text-2xl font-black text-white">{formatNumber(stats.total_stores)}+</div>
              <div className="text-xs text-green-100">Toko Aktif</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* STATS SECTION */}
      {/* ================================================= */}

      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { title: formatNumber(stats.total_stores) + '+', desc: 'Toko Aktif', icon: Store, color: 'from-green-500 to-emerald-500' },
            { title: formatNumber(stats.total_products) + '+', desc: 'Produk Pertanian', icon: ShoppingBag, color: 'from-blue-500 to-cyan-500' },
            { title: formatNumber(stats.total_farmers) + '+', desc: 'Petani Bergabung', icon: Users, color: 'from-orange-500 to-red-500' },
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-4xl font-black text-slate-900">{item.title}</h2>
              <p className="text-slate-500 mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================================================= */}
      {/* STORE GRID SECTION */}
      {/* ================================================= */}

      <section className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-4xl font-black text-slate-900">Toko Populer</h2>
            <p className="text-slate-500 mt-2">Supplier & seller terbaik pilihan AgroHub</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl font-semibold text-slate-700 hover:border-green-400 transition"
            >
              <Filter className="w-4 h-4" />
              Filter
              {(filters.location !== 'Semua Lokasi' || filters.minRating > 0 || filters.verified) && (
                <span className="w-2 h-2 bg-green-600 rounded-full" />
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="h-12 px-4 pr-10 rounded-2xl border border-slate-200 bg-white appearance-none cursor-pointer focus:border-green-500 focus:outline-none font-medium"
              >
                <option value="rating">Rating Tertinggi</option>
                <option value="sales">Penjualan Terbanyak</option>
                <option value="products">Produk Terbanyak</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Store Grid */}
        {filteredStores.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map((store, idx) => (
                <StoreCard key={store.id} store={store} index={idx} />
              ))}
            </div>

            {/* Results Info */}
            <div className="text-center text-sm text-slate-500 mt-6">
              Menampilkan {filteredStores.length} dari {formatNumber(totalStores)} toko
            </div>
          </>
        )}

        {/* No Results */}
        {filteredStores.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Toko tidak ditemukan</h3>
            <p className="text-slate-500">Coba ubah filter atau kata kunci pencarian</p>
          </div>
        )}
      </section>

      {/* ================================================= */}
      {/* TRUST BANNER */}
      {/* ================================================= */}

      <section className="max-w-7xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-black">Ingin Menjadi Seller?</h3>
              <p className="text-green-100 mt-1">Bergabunglah dengan ribuan seller di AgroHub</p>
            </div>
            <Link href="/seller/register">
              <button className="bg-white text-green-700 px-8 py-3 rounded-xl font-bold hover:shadow-xl transition">
                Daftar Sekarang →
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <footer className="bg-gradient-to-r from-green-950 to-green-900 text-white mt-14">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14">
                <Image src={LOGO} alt="AgroHub" fill className="object-contain brightness-0 invert" />
              </div>
              <div>
                <h2 className="text-3xl font-black">AgroHub</h2>
                <p className="text-green-200 text-sm">Marketplace Pertanian Modern</p>
              </div>
            </div>
            <div className="text-sm text-green-100">© 2026 AgroHub. All rights reserved.</div>
          </div>
        </div>
      </footer>

      {/* Filter Sidebar Sederhana */}
      <AnimatePresence>
        {showFilters && (
          <>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowFilters(false)} />
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-slate-200 p-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Filter Toko</h2>
                  <p className="text-sm text-slate-500">{formatNumber(totalStores)} toko tersedia</p>
                </div>
                <button onClick={() => setShowFilters(false)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-6">
                {/* Location Filter */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Lokasi</label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-green-500 focus:outline-none"
                  >
                    <option>Semua Lokasi</option>
                    <option>Jakarta</option>
                    <option>Bandung</option>
                    <option>Surabaya</option>
                    <option>Medan</option>
                    <option>Yogyakarta</option>
                    <option>Malang</option>
                    <option>Bogor</option>
                    <option>Sukabumi</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Urutkan</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-green-500 focus:outline-none"
                  >
                    <option value="rating">Rating Tertinggi</option>
                    <option value="sales">Penjualan Terbanyak</option>
                    <option value="products">Produk Terbanyak</option>
                  </select>
                </div>

                {/* Min Rating */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Rating Minimal</label>
                  <div className="flex gap-2">
                    {[0, 4, 4.5, 4.8].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setFilters({ ...filters, minRating: rating })}
                        className={`flex-1 h-10 rounded-xl border transition ${
                          filters.minRating === rating
                            ? 'border-green-600 bg-green-50 text-green-700 font-semibold'
                            : 'border-slate-200 hover:border-green-400'
                        }`}
                      >
                        {rating === 0 ? 'Semua' : rating}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Verified Only */}
                <div className="flex items-center justify-between py-3 border-t border-slate-100">
                  <span className="text-sm font-semibold text-slate-700">Toko Terverifikasi</span>
                  <button
                    onClick={() => setFilters({ ...filters, verified: !filters.verified })}
                    className={`relative w-12 h-6 rounded-full transition ${
                      filters.verified ? 'bg-green-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition ${
                        filters.verified ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-slate-200 p-5 flex gap-3">
                <button
                  onClick={() => {
                    setFilters({ location: 'Semua Lokasi', sortBy: 'rating', minRating: 0, verified: false });
                    setShowFilters(false);
                  }}
                  className="flex-1 h-12 rounded-xl border border-slate-300 font-semibold hover:bg-slate-50 transition"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 h-12 rounded-xl bg-green-700 text-white font-bold hover:bg-green-800 transition"
                >
                  Terapkan
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}