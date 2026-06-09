// app/(marketplace)/stores/[id]/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

import {
  MapPin,
  Star,
  BadgeCheck,
  ShoppingBag,
  Users,
  ShieldCheck,
  ChevronLeft,
  Heart,
  Clock,
  TrendingUp,
  Package,
  Truck,
  MessageCircle,
  Calendar,
  ExternalLink,
  X,
  ChevronDown,
  Loader2,
  Phone,
  Mail,
  Store as StoreIcon,
  Award,
} from 'lucide-react';

// ======================================================
// CONFIG
// ======================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';
const LOGO = '/assets/logo/logo-agrohub.png';
const PLACEHOLDER_PRODUCT = '/placeholder-product.png';
const PLACEHOLDER_STORE = '/placeholder-store.png';

// ======================================================
// NORMALIZE IMAGE FUNCTION
// ======================================================

const normalizeImage = (url?: string | null) => {
  if (!url) return PLACEHOLDER_PRODUCT;
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  if (url.startsWith('/')) {
    return url;
  }
  
  if (url.match(/^[a-zA-Z0-9_\-]+\.(png|jpg|jpeg|gif|webp)$/i)) {
    return `/gambar/${url}`;
  }
  
  return PLACEHOLDER_PRODUCT;
};

const normalizeStoreImage = (url?: string | null) => {
  if (!url) return PLACEHOLDER_STORE;
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  if (url.startsWith('/')) {
    return url;
  }
  
  return PLACEHOLDER_STORE;
};

// ======================================================
// DATA TOKO LANGSUNG (HARDCODED)
// ======================================================

const DIRECT_STORES: Record<number, any> = {
  7: {
    id: 7,
    name: 'AgroHub Aqua Store',
    slug: 'aqua-store',
    description: 'Distributor alat pertanian modern, traktor, sprayer, dan mesin pertanian lainnya.',
    address: 'Jl. Mesin Tani No. 77',
    city: 'Medan',
    province: 'Sumatera Utara',
    phone: '081234567807',
    email: 'sales@alatpertanian.com',
    store_type: 'supplier',
    is_verified: true,
    rating: 4.7,
    logo: PLACEHOLDER_STORE,
    banner: PLACEHOLDER_STORE,
    location: 'Medan, Sumatera Utara',
    verified: true,
    rating_count: 1200,
    followers: 5600,
    products_count: 45,
    total_sales: 3200,
    join_date: '2024-01-15',
    response_rate: 92,
  },
  23: {
    id: 23,
    name: 'AgroHub Farmer Collective',
    slug: 'farmer-collective',
    description: 'Hasil panen langsung dari petani berkualitas terbaik. Sayuran organik, buah segar, dan produk pertanian lainnya.',
    address: 'Jl. Petani No. 123',
    city: 'Yogyakarta',
    province: 'DI Yogyakarta',
    phone: '081234567890',
    email: 'farmer@agrohub.com',
    store_type: 'farmer',
    is_verified: true,
    rating: 4.9,
    logo: PLACEHOLDER_STORE,
    banner: PLACEHOLDER_STORE,
    location: 'Yogyakarta, DI Yogyakarta',
    verified: true,
    rating_count: 980,
    followers: 12300,
    products_count: 95,
    total_sales: 7200,
    join_date: '2024-02-10',
    response_rate: 95,
  },
  24: {
    id: 24,
    name: 'AgroHub Aqua Network',
    slug: 'aqua-network',
    description: 'Budidaya ikan & tambak modern terpercaya. Bibit ikan unggul, pakan berkualitas, dan perlengkapan kolam.',
    address: 'Jl. Tambak No. 45',
    city: 'Sukabumi',
    province: 'Jawa Barat',
    phone: '081234567891',
    email: 'aqua@agrohub.com',
    store_type: 'distributor',
    is_verified: true,
    rating: 4.8,
    logo: PLACEHOLDER_STORE,
    banner: PLACEHOLDER_STORE,
    location: 'Sukabumi, Jawa Barat',
    verified: true,
    rating_count: 860,
    followers: 8900,
    products_count: 110,
    total_sales: 6400,
    join_date: '2024-01-20',
    response_rate: 88,
  },
  25: {
    id: 25,
    name: 'AgroHub Herd Center',
    slug: 'herd-center',
    description: 'Peternakan sapi & kambing premium. Hewan sehat, berkualitas, dan siap kirim ke seluruh Indonesia.',
    address: 'Jl. Peternakan No. 88',
    city: 'Malang',
    province: 'Jawa Timur',
    phone: '081234567892',
    email: 'herd@agrohub.com',
    store_type: 'supplier',
    is_verified: true,
    rating: 4.9,
    logo: PLACEHOLDER_STORE,
    banner: PLACEHOLDER_STORE,
    location: 'Malang, Jawa Timur',
    verified: true,
    rating_count: 1100,
    followers: 15400,
    products_count: 85,
    total_sales: 9100,
    join_date: '2024-01-05',
    response_rate: 96,
  },
  3: {
    id: 3,
    name: 'AgroHub Farmer Store',
    slug: 'farmer-store',
    description: 'Menjual sayuran organik segar langsung dari petani. Kualitas terbaik untuk keluarga Anda.',
    address: 'Bogor, Jawa Barat',
    city: 'Bogor',
    province: 'Jawa Barat',
    phone: '081234567893',
    email: 'farmerstore@agrohub.com',
    store_type: 'farmer',
    is_verified: true,
    rating: 4.7,
    logo: PLACEHOLDER_STORE,
    banner: PLACEHOLDER_STORE,
    location: 'Bogor, Jawa Barat',
    verified: true,
    rating_count: 25,
    followers: 1200,
    products_count: 0,
    total_sales: 0,
    join_date: '2024-03-01',
    response_rate: 85,
  },
  19: {
    id: 19,
    name: 'AgroHub Vendor Store',
    slug: 'vendor-store',
    description: 'Marketplace vendor pertanian lengkap. Alat dan mesin pertanian modern.',
    address: 'Jl. Raya Tajur No. 123',
    city: 'Bandung',
    province: 'Jawa Barat',
    phone: '081234567894',
    email: 'vendor@agrohub.com',
    store_type: 'supplier',
    is_verified: true,
    rating: 4.8,
    logo: PLACEHOLDER_STORE,
    banner: PLACEHOLDER_STORE,
    location: 'Bandung, Jawa Barat',
    verified: true,
    rating_count: 120,
    followers: 4500,
    products_count: 10,
    total_sales: 5000,
    join_date: '2024-02-15',
    response_rate: 90,
  },
};

// ======================================================
// DATA PRODUK PER TOKO
// ======================================================

const STORE_PRODUCTS: Record<number, any[]> = {
  25: [
    {
      id: 444,
      name: 'Sapi Potong Simental 300kg',
      price: 19500000,
      old_price: 25000000,
      image_url: '/gambar/simental.png',
      stock: 12,
      rating_avg: 4.9,
      sold_count: 60,
      discount_percent: 22,
      is_featured: true,
      brand: 'Premium Livestock',
      category: 'Sapi',
    },
    {
      id: 445,
      name: 'Kambing Etawa Premium 35kg',
      price: 3500000,
      image_url: '/gambar/etawa.png',
      stock: 35,
      rating_avg: 4.8,
      sold_count: 140,
      is_featured: true,
      brand: 'Premium Livestock',
      category: 'Kambing',
    },
    {
      id: 446,
      name: 'Ayam Broiler Organik 2kg',
      price: 85000,
      image_url: '/gambar/Ayam_Broiler.png',
      stock: 500,
      rating_avg: 4.7,
      sold_count: 980,
      brand: 'Organic Farm',
      category: 'Ayam',
    },
  ],
  24: [
    {
      id: 440,
      name: 'Bibit Lele Sangkuriang 100 Ekor',
      price: 45000,
      old_price: 60000,
      image_url: '/gambar/bibitlele.png',
      stock: 1000,
      rating_avg: 4.8,
      sold_count: 1500,
      discount_percent: 25,
      is_featured: true,
      brand: 'AquaFarm',
      category: 'Perikanan',
    },
    {
      id: 441,
      name: 'Pakan Ikan Protein 1kg',
      price: 22000,
      image_url: '/gambar/PakanIkanProtein.png',
      stock: 1200,
      rating_avg: 4.7,
      sold_count: 2100,
      brand: 'AquaFeed',
      category: 'Pakan Ikan',
    },
  ],
  23: [
    {
      id: 436,
      name: 'Beras Organik Premium 5kg',
      price: 75000,
      image_url: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a',
      stock: 400,
      rating_avg: 4.9,
      sold_count: 1200,
      is_featured: true,
      brand: 'Organic Harvest',
      category: 'Beras',
    },
    {
      id: 437,
      name: 'Jagung Manis Fresh Farm 1kg',
      price: 18000,
      image_url: 'https://images.unsplash.com/photo-1601593768790-1f1f9b0b0c1f',
      stock: 600,
      rating_avg: 4.7,
      sold_count: 980,
      brand: 'Fresh Farm',
      category: 'Jagung',
    },
    {
      id: 438,
      name: 'Cabai Merah Grade A 1kg',
      price: 35000,
      image_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38',
      stock: 500,
      rating_avg: 4.8,
      sold_count: 870,
      brand: 'Fresh Farm',
      category: 'Cabai',
    },
  ],
  19: [
    {
      id: 449,
      name: 'IoT Soil Sensor v2',
      price: 320000,
      image_url: 'https://images.unsplash.com/photo-1581091870627-3d2c8d9f4c3e',
      stock: 200,
      rating_avg: 4.9,
      sold_count: 320,
      is_featured: true,
      brand: 'AgroTech',
      category: 'IoT Farming',
    },
    {
      id: 450,
      name: 'Drip Irrigation Kit 100m',
      price: 275000,
      image_url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449',
      stock: 150,
      rating_avg: 4.6,
      sold_count: 180,
      brand: 'AgroTech',
      category: 'Irrigation',
    },
    {
      id: 448,
      name: 'Pupuk NPK Premium 25kg',
      price: 185000,
      image_url: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7',
      stock: 300,
      rating_avg: 4.8,
      sold_count: 540,
      brand: 'AgroTech',
      category: 'Fertilizer',
    },
  ],
};

// ======================================================
// TYPES
// ======================================================

interface Store {
  id: number;
  name: string;
  slug: string;
  description?: string;
  address?: string;
  city?: string;
  province?: string;
  phone?: string;
  email?: string;
  store_logo_url?: string;
  store_banner_url?: string;
  store_type?: 'farmer' | 'distributor' | 'supplier' | 'retailer';
  is_verified: boolean;
  rating: number;
  logo?: string;
  banner?: string;
  location: string;
  verified: boolean;
  rating_count?: number;
  followers?: number;
  products_count?: number;
  total_sales?: number;
  join_date?: string;
  response_rate?: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image_url?: string;
  stock: number;
  rating_avg?: number;
  sold_count?: number;
  is_featured?: boolean;
  discount_percent?: number;
  minimum_order?: number;
  brand?: string;
  sku?: string;
  distributor_name?: string;
  image: string;
  rating?: number;
  sold?: number;
  category?: string;
}

// ======================================================
// HELPERS
// ======================================================

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('id-ID').format(value || 0);
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// ======================================================
// PRODUCT CARD COMPONENT
// ======================================================

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [isWishlist, setIsWishlist] = useState(false);
  const [imgError, setImgError] = useState(false);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlist(!isWishlist);
  };

  const discountPercent = product.discount_percent || 0;
  const finalPrice = discountPercent > 0 
    ? product.price * (1 - discountPercent / 100)
    : product.price;
  
  const imageSrc = imgError ? PLACEHOLDER_PRODUCT : normalizeImage(product.image_url || product.image);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6 }}
    >
      <Link href={`/products/${product.id}`}>
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-2xl transition-all duration-300 cursor-pointer group">
          <div className="relative h-48 overflow-hidden bg-slate-100">
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition duration-500"
              onError={() => setImgError(true)}
            />
            {discountPercent > 0 && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                -{discountPercent}%
              </div>
            )}
            {product.is_featured && (
              <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                <Award className="w-3 h-3" />
                Unggulan
              </div>
            )}
            <button
              onClick={toggleWishlist}
              className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:scale-110"
            >
              <Heart className={`w-4 h-4 ${isWishlist ? 'fill-red-500 text-red-500' : 'text-slate-700'}`} />
            </button>
          </div>
          <div className="p-4">
            {product.brand && (
              <div className="text-xs text-green-700 font-bold mb-1">{product.brand}</div>
            )}
            <h3 className="font-semibold text-slate-800 line-clamp-2 text-sm min-h-[40px]">
              {product.name}
            </h3>
            <div className="mt-2">
              <div className="text-lg font-black text-green-700">
                {formatCurrency(finalPrice)}
              </div>
              {discountPercent > 0 && (
                <div className="text-xs line-through text-slate-400">
                  {formatCurrency(product.price)}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs">
              {product.rating_avg && product.rating_avg > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{product.rating_avg.toFixed(1)}</span>
                </div>
              )}
              {product.sold_count && product.sold_count > 0 && (
                <>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500">{formatNumber(product.sold_count)} terjual</span>
                </>
              )}
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

export default function StoreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = parseInt(params.id as string);

  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'featured' | 'about'>('products');
  const [sortBy, setSortBy] = useState('popular');
  const [bannerError, setBannerError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Load store and products from direct data
  useEffect(() => {
    const foundStore = DIRECT_STORES[storeId];
    
    if (foundStore) {
      setStore({
        ...foundStore,
        logo: normalizeStoreImage(foundStore.logo || foundStore.store_logo_url),
        banner: normalizeStoreImage(foundStore.banner || foundStore.store_banner_url),
      });
      
      const storeProducts = STORE_PRODUCTS[storeId] || [];
      const transformedProducts: Product[] = storeProducts.map((p: any) => ({
        ...p,
        image: normalizeImage(p.image_url),
        rating: p.rating_avg,
        sold: p.sold_count,
        category: p.category,
      }));
      
      const featured = transformedProducts.filter(p => p.is_featured);
      const regular = transformedProducts.filter(p => !p.is_featured);
      
      setFeaturedProducts(featured);
      setProducts(regular);
      setError(null);
    } else {
      setError('Toko tidak ditemukan');
    }
    setLoading(false);
  }, [storeId]);

  // Load follow/favorite status from localStorage
  useEffect(() => {
    const savedFollowing = localStorage.getItem(`following_${storeId}`);
    const savedFavorite = localStorage.getItem(`favorite_store_${storeId}`);
    
    if (savedFollowing) setIsFollowing(JSON.parse(savedFollowing));
    if (savedFavorite) setIsFavorite(JSON.parse(savedFavorite));
  }, [storeId]);

  // Sort products
  const getSortedProducts = useCallback(() => {
    let sorted = [...products];
    switch (sortBy) {
      case 'popular':
        sorted.sort((a, b) => (b.sold_count || 0) - (a.sold_count || 0));
        break;
      case 'cheapest':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'expensive':
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    return sorted;
  }, [products, sortBy]);

  const sortedProducts = getSortedProducts();
  const totalProducts = products.length + featuredProducts.length;

  // Handle follow
  const handleFollow = () => {
    const newFollowState = !isFollowing;
    setIsFollowing(newFollowState);
    localStorage.setItem(`following_${storeId}`, JSON.stringify(newFollowState));
    
    if (store) {
      setStore({
        ...store,
        followers: (store.followers || 0) + (newFollowState ? 1 : -1),
      });
    }
  };

  // Handle favorite
  const handleFavorite = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    localStorage.setItem(`favorite_store_${storeId}`, JSON.stringify(newFavoriteState));
  };

  // Handle chat
  const handleChat = () => {
    router.push(`/chat?store=${storeId}&store_name=${store?.name}`);
  };

  // Get store type badge
  const getStoreTypeBadge = () => {
    switch (store?.store_type) {
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

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-green-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Memuat detail toko...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !store) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{error || 'Toko tidak ditemukan'}</h2>
            <p className="text-slate-500 mb-6">Maaf, toko yang Anda cari tidak tersedia</p>
            <Link
              href="/stores"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
            >
              <ChevronLeft className="w-5 h-5" />
              Kembali ke Toko
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const typeBadge = getStoreTypeBadge();

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* BACK BUTTON */}
      <section className="max-w-7xl mx-auto px-4 pt-6">
        <Link
          href="/stores"
          className="inline-flex items-center gap-2 text-green-700 font-bold hover:text-green-800 transition"
        >
          <ChevronLeft className="w-5 h-5" />
          Kembali ke Toko
        </Link>
      </section>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 pt-5">
        <div className="relative overflow-hidden rounded-[36px] h-[420px]">
          {/* Banner Image */}
          {store.banner && !bannerError ? (
            <Image
              src={store.banner}
              alt={store.name}
              fill
              className="object-cover"
              priority
              onError={() => setBannerError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-green-700 to-green-900" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="flex-1">
                {/* Store Logo & Verified Badge */}
                <div className="flex items-center gap-4 mb-4">
                  {store.logo && !logoError ? (
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white">
                      <Image 
                        src={store.logo} 
                        alt={store.name} 
                        fill 
                        className="object-cover"
                        onError={() => setLogoError(true)}
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center">
                      <StoreIcon className="w-10 h-10 text-green-600" />
                    </div>
                  )}
                  <div className={`${typeBadge.color} px-3 py-1.5 rounded-full text-xs font-semibold`}>
                    {typeBadge.label}
                  </div>
                  {store.verified && (
                    <div className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      Verified Store
                    </div>
                  )}
                </div>

                <h1 className="text-5xl font-black text-white">{store.name}</h1>

                <div className="flex flex-wrap items-center gap-5 mt-5 text-white/90">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {store.location}
                  </div>

                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    {store.rating.toFixed(1)}
                    {store.rating_count && store.rating_count > 0 && (
                      <span className="text-sm">({formatNumber(store.rating_count)} ulasan)</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {formatNumber(store.followers || 0)} followers
                  </div>

                  {store.response_rate && store.response_rate > 0 && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Respon {store.response_rate}%
                    </div>
                  )}

                  {store.join_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Bergabung {formatDate(store.join_date)}
                    </div>
                  )}
                </div>

                {store.description && (
                  <p className="text-white/80 mt-6 max-w-2xl leading-relaxed line-clamp-2">
                    {store.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleFollow}
                  className={`px-7 py-4 rounded-2xl font-bold transition flex items-center gap-2 ${
                    isFollowing
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-white text-green-700 hover:scale-105'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  {isFollowing ? 'Following' : 'Follow'}
                </button>

                <button
                  onClick={handleFavorite}
                  className={`px-7 py-4 rounded-2xl font-bold transition flex items-center gap-2 ${
                    isFavorite
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white text-slate-700 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
                  {isFavorite ? 'Favorit' : 'Favorit'}
                </button>

                <button
                  onClick={handleChat}
                  className="bg-green-600 hover:bg-green-700 text-white px-7 py-4 rounded-2xl font-bold transition flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-4 gap-5">
          {[
            { title: formatNumber(store.products_count || 0), desc: 'Total Produk', icon: ShoppingBag, color: 'from-green-500 to-emerald-500' },
            { title: formatNumber(store.followers || 0), desc: 'Followers', icon: Users, color: 'from-blue-500 to-cyan-500' },
            { title: store.rating.toFixed(1), desc: 'Rating Toko', icon: Star, color: 'from-yellow-500 to-orange-500' },
            { title: formatNumber(store.total_sales || 0), desc: 'Total Terjual', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
          ].map((item, idx) => (
            <motion.div
              key={item.desc}
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

      {/* TABS SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs Navigation */}
        <div className="flex gap-2 border-b border-slate-200 bg-white rounded-t-2xl px-6 pt-4">
          {[
            { id: 'products', label: 'Semua Produk', count: totalProducts },
            { id: 'featured', label: 'Produk Unggulan', count: featuredProducts.length },
            { id: 'about', label: 'Tentang Toko' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-semibold transition relative ${
                activeTab === tab.id
                  ? 'text-green-700'
                  : 'text-slate-500 hover:text-green-600'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-2 text-xs bg-slate-100 px-2 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-b-2xl rounded-tr-2xl border border-slate-200 p-6 shadow-lg"
            >
              {/* Sort & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Semua Produk</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {formatNumber(totalProducts)} produk tersedia
                  </p>
                </div>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-10 px-4 pr-10 rounded-xl border border-slate-200 bg-white appearance-none cursor-pointer focus:border-green-500 focus:outline-none text-sm"
                  >
                    <option value="popular">Terpopuler</option>
                    <option value="cheapest">Termurah</option>
                    <option value="expensive">Termahal</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Products Grid */}
              {totalProducts === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">Belum Ada Produk</h3>
                  <p className="text-slate-500 mt-1">Toko ini belum memiliki produk</p>
                </div>
              ) : (
                <>
                  {/* Show featured products first */}
                  {featuredProducts.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-md font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4 text-yellow-500" />
                        Produk Unggulan
                      </h4>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {featuredProducts.map((product, idx) => (
                          <ProductCard key={product.id} product={product} index={idx} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Regular products */}
                  {sortedProducts.length > 0 && (
                    <>
                      {featuredProducts.length > 0 && (
                        <h4 className="text-md font-bold text-slate-700 mb-3">Produk Lainnya</h4>
                      )}
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {sortedProducts.map((product, idx) => (
                          <ProductCard key={product.id} product={product} index={idx} />
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}

              {/* View All Products Link */}
              {(products.length > 0 || featuredProducts.length > 0) && (
                <div className="text-center mt-6">
                  <Link
                    href={`/products?store=${store.id}`}
                    className="inline-flex items-center gap-2 text-green-700 font-semibold hover:text-green-800 transition"
                  >
                    Lihat Semua Produk
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {/* FEATURED PRODUCTS TAB */}
          {activeTab === 'featured' && (
            <motion.div
              key="featured"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-b-2xl rounded-tr-2xl border border-slate-200 p-6 shadow-lg"
            >
              {featuredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">Belum Ada Produk Unggulan</h3>
                  <p className="text-slate-500 mt-1">Toko ini belum memiliki produk unggulan</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {featuredProducts.map((product, idx) => (
                    <ProductCard key={product.id} product={product} index={idx} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ABOUT TAB */}
          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-b-2xl rounded-tr-2xl border border-slate-200 p-6 shadow-lg"
            >
              <div className="space-y-6">
                {/* Description */}
                {store.description && (
                  <div>
                    <h3 className="text-lg font-black text-slate-900 mb-3">Deskripsi Toko</h3>
                    <p className="text-slate-600 leading-relaxed">{store.description}</p>
                  </div>
                )}

                {/* Contact Info */}
                {(store.phone || store.email) && (
                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-lg font-black text-slate-900 mb-3">Kontak Toko</h3>
                    <div className="space-y-2 text-sm">
                      {store.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span>{store.phone}</span>
                        </div>
                      )}
                      {store.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span>{store.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Store Info */}
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Informasi Toko</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <BadgeCheck className="w-4 h-4 text-green-600" />
                        <span>{store.verified ? 'Toko Terverifikasi' : 'Toko Belum Terverifikasi'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StoreIcon className="w-4 h-4 text-slate-400" />
                        <span>{typeBadge.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{store.location}</span>
                      </div>
                      {store.address && (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                          <span className="text-slate-600">{store.address}</span>
                        </div>
                      )}
                      {store.join_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>Bergabung {formatDate(store.join_date)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Performance */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Kinerja Toko</h3>
                    <div className="space-y-2 text-sm">
                      {store.response_rate && store.response_rate > 0 && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>Rate Respon: {store.response_rate}%</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-slate-400" />
                        <span>Pengiriman ke seluruh Indonesia</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-slate-400" />
                        <span>Garansi 100% produk original</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-slate-400" />
                        <span>{formatNumber(store.products_count || 0)} produk tersedia</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* FOOTER */}
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
    </main>
  );
}