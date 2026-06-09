'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import {
  Search,
  SlidersHorizontal,
  Grid3x3,
  List,
  Heart,
  ShoppingCart,
  Package,
  Award,
  RotateCcw,
  X,
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

// ======================================================
// TYPES & INTERFACES (SESUAI DATABASE)
// ======================================================

interface Product {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  old_price?: number | null;
  stock: number;
  sold?: number;
  rating?: number;
  image?: string | null;
  category_id?: number | null;
  store_id?: number | null;
  status?: string;
  discount?: number;
  created_at?: string;
  updated_at?: string;
  // Extended fields from JOIN
  category_name?: string;
  category_slug?: string;
  store_name?: string;
  store_verified?: boolean;
  store_logo?: string;
  // Computed fields
  discount_percent?: number;
  sold_count?: number;
  rating_avg?: number;
  image_url?: string;
  is_featured?: boolean;
  ecosystem_type?: 'FARMER' | 'AQUA' | 'HERD' | 'VENDOR' | null;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  product_count?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isInWishlist: boolean;
  viewMode: 'grid' | 'list';
}

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  priceRange: {
    min: string;
    max: string;
    inStockOnly: boolean;
  };
  onPriceChange: (value: any) => void;
  onReset: () => void;
}

// ======================================================
// HARDCODED PRODUCTS DATA (FALLBACK)
// ======================================================
const DIRECT_PRODUCTS: Product[] = [
  {
    id: 444,
    name: 'Sapi Potong Simental 300kg',
    price: 19500000,
    old_price: 25000000,
    sold: 60,
    rating: 4.9,
    image: '/gambar/simental.png',
    stock: 12,
    discount: 22,
    category_id: 1,
    category_name: 'Sapi',
    category_slug: 'sapi',
    store_name: 'AgroHub Herd Center',
    store_verified: true,
  },
  {
    id: 445,
    name: 'Kambing Etawa Premium 35kg',
    price: 3500000,
    sold: 140,
    rating: 4.8,
    image: '/gambar/etawa.png',
    stock: 35,
    category_id: 2,
    category_name: 'Kambing',
    category_slug: 'kambing',
    store_name: 'AgroHub Herd Center',
    store_verified: true,
  },
  {
    id: 446,
    name: 'Ayam Broiler Organik 2kg',
    price: 85000,
    sold: 980,
    rating: 4.7,
    image: '/gambar/Ayam_Broiler.png',
    stock: 500,
    category_id: 3,
    category_name: 'Ayam',
    category_slug: 'ayam',
    store_name: 'AgroHub Herd Center',
    store_verified: true,
  },
  {
    id: 440,
    name: 'Bibit Lele Sangkuriang 100 Ekor',
    price: 45000,
    old_price: 60000,
    sold: 1500,
    rating: 4.8,
    image: '/gambar/bibitlele.png',
    stock: 1000,
    discount: 25,
    category_id: 4,
    category_name: 'Perikanan',
    category_slug: 'perikanan',
    store_name: 'AgroHub Aqua Network',
    store_verified: true,
  },
  {
    id: 441,
    name: 'Pakan Ikan Protein 1kg',
    price: 22000,
    sold: 2100,
    rating: 4.7,
    image: '/gambar/PakanIkanProtein.png',
    stock: 1200,
    category_id: 5,
    category_name: 'Pakan Ikan',
    category_slug: 'pakan-ikan',
    store_name: 'AgroHub Aqua Network',
    store_verified: true,
  },
  {
    id: 436,
    name: 'Beras Organik Premium 5kg',
    price: 75000,
    sold: 1200,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a',
    stock: 400,
    category_id: 6,
    category_name: 'Padi & Beras',
    category_slug: 'padi-beras',
    store_name: 'AgroHub Farmer Collective',
    store_verified: true,
  },
  {
    id: 437,
    name: 'Jagung Manis Fresh Farm 1kg',
    price: 18000,
    sold: 980,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1601593768790-1f1f9b0b0c1f',
    stock: 600,
    category_id: 7,
    category_name: 'Hasil Panen',
    category_slug: 'hasil-panen',
    store_name: 'AgroHub Farmer Collective',
    store_verified: true,
  },
  {
    id: 438,
    name: 'Cabai Merah Grade A 1kg',
    price: 35000,
    sold: 870,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38',
    stock: 500,
    category_id: 7,
    category_name: 'Hasil Panen',
    category_slug: 'hasil-panen',
    store_name: 'AgroHub Farmer Collective',
    store_verified: true,
  },
  {
    id: 449,
    name: 'IoT Soil Sensor v2',
    price: 320000,
    sold: 320,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1581091870627-3d2c8d9f4c3e',
    stock: 200,
    category_id: 8,
    category_name: 'IoT Farming',
    category_slug: 'iot-farming',
    store_name: 'AgroHub Vendor Store',
    store_verified: true,
  },
  {
    id: 450,
    name: 'Drip Irrigation Kit 100m',
    price: 275000,
    sold: 180,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449',
    stock: 150,
    category_id: 9,
    category_name: 'Alat Irigasi',
    category_slug: 'alat-irigasi',
    store_name: 'AgroHub Vendor Store',
    store_verified: true,
  },
  {
    id: 448,
    name: 'Pupuk NPK Premium 25kg',
    price: 185000,
    sold: 540,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7',
    stock: 300,
    category_id: 10,
    category_name: 'Pupuk',
    category_slug: 'pupuk',
    store_name: 'AgroHub Vendor Store',
    store_verified: true,
  },
  {
    id: 442,
    name: 'Aerator Kolam 40W Smart',
    price: 185000,
    sold: 600,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1601758123927-196d1d3b6f54',
    stock: 200,
    category_id: 11,
    category_name: 'Kolam Budidaya',
    category_slug: 'kolam-budidaya',
    store_name: 'AgroHub Aqua Network',
    store_verified: true,
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';
const PLACEHOLDER_IMAGE = '/placeholder-product.png';

// Normalize product from API to match frontend interface
const normalizeProduct = (apiProduct: any): Product => {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    slug: apiProduct.slug,
    description: apiProduct.description,
    price: parseFloat(apiProduct.price),
    old_price: apiProduct.old_price ? parseFloat(apiProduct.old_price) : undefined,
    stock: apiProduct.stock,
    sold: apiProduct.sold || 0,
    rating: apiProduct.rating ? parseFloat(apiProduct.rating) : 0,
    image: apiProduct.image,
    category_id: apiProduct.category_id,
    category_name: apiProduct.category_name,
    category_slug: apiProduct.category_slug,
    store_name: apiProduct.store_name,
    store_verified: apiProduct.store_verified,
    store_logo: apiProduct.store_logo,
    discount: apiProduct.discount || 0,
    status: apiProduct.status,
    discount_percent: apiProduct.discount || 0,
    sold_count: apiProduct.sold || 0,
    rating_avg: apiProduct.rating ? parseFloat(apiProduct.rating) : 0,
    image_url: apiProduct.image,
    is_featured: apiProduct.is_featured || false,
    created_at: apiProduct.created_at,
    updated_at: apiProduct.updated_at,
  };
};

const normalizeImage = (url?: string | null) => {
  if (!url) return PLACEHOLDER_IMAGE;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return url;
  if (url.startsWith('uploads/')) {
    return `${API_URL.replace('/api/v1', '')}/${url}`;
  }
  if (url.match(/^[a-zA-Z0-9_\-]+\.(png|jpg|jpeg|gif|webp)$/i)) return `/gambar/${url}`;
  return PLACEHOLDER_IMAGE;
};

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Add request interceptor for debugging
api.interceptors.request.use((config) => {
  console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.config?.url}`, error.message);
    return Promise.reject(error);
  }
);

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value || 0);
};

function ProductCard({ product, onAddToCart, onToggleWishlist, isInWishlist, viewMode }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  
  const discountPercent = product.discount_percent || product.discount || 0;
  const finalPrice = discountPercent > 0 
    ? product.price * (1 - discountPercent / 100)
    : product.price;
  
  const getImageUrl = () => {
    if (imgError) return PLACEHOLDER_IMAGE;
    return normalizeImage(product.image_url || product.image);
  };
  
  if (viewMode === 'list') {
    return (
      <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row p-4 gap-4">
        <div className="relative w-full sm:w-48 h-48 sm:h-auto overflow-hidden rounded-xl bg-slate-100 flex-shrink-0">
          <Image
            src={getImageUrl()}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition duration-500"
            onError={() => setImgError(true)}
            unoptimized={getImageUrl() === PLACEHOLDER_IMAGE}
          />
          {discountPercent > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg z-10">
              -{discountPercent}%
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {product.category_name && (
                  <span className="text-xs text-green-700 font-medium">{product.category_name}</span>
                )}
              </div>
              <button
                onClick={() => onToggleWishlist(product)}
                className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center hover:scale-110 transition text-slate-600"
                aria-label="Tambah ke wishlist"
              >
                <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
              </button>
            </div>

            <Link href={`/products/${product.id}`}>
              <h3 className="font-bold text-slate-800 hover:text-green-700 text-base mb-1 transition">
                {product.name}
              </h3>
            </Link>

            <div className="flex items-center gap-3 mt-2">
              <h4 className="text-xl font-black text-green-700">{formatCurrency(finalPrice)}</h4>
              {discountPercent > 0 && product.old_price && (
                <p className="text-sm line-through text-slate-400">{formatCurrency(product.old_price)}</p>
              )}
            </div>
          </div>

          <div className="mt-4 sm:mt-0 flex gap-2">
            <button
              onClick={() => onAddToCart(product)}
              disabled={product.stock <= 0}
              className={`px-6 h-10 rounded-xl text-white text-sm font-semibold transition flex items-center justify-center gap-2 ${
                product.stock > 0 ? 'bg-green-700 hover:bg-green-800' : 'bg-slate-300 cursor-not-allowed'
              }`}
              aria-label="Tambah ke keranjang"
            >
              <ShoppingCart className="w-4 h-4" />
              {product.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <Image
          src={getImageUrl()}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition duration-500"
          onError={() => setImgError(true)}
          unoptimized={getImageUrl() === PLACEHOLDER_IMAGE}
        />
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg z-10">
            -{discountPercent}%
          </div>
        )}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">Habis</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            {product.category_name && <span className="text-xs text-green-700 font-medium">{product.category_name}</span>}
          </div>
          <Link href={`/products/${product.id}`}>
            <h3 className="font-bold text-slate-800 line-clamp-2 min-h-[48px] hover:text-green-700 transition text-sm">
              {product.name}
            </h3>
          </Link>
          <div className="mt-2">
            <h4 className="text-xl font-black text-green-700">{formatCurrency(finalPrice)}</h4>
            {discountPercent > 0 && product.old_price && (
              <p className="text-xs line-through text-slate-400">{formatCurrency(product.old_price)}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock <= 0}
          className={`mt-3 w-full h-9 rounded-xl text-white text-sm font-semibold transition flex items-center justify-center gap-2 ${
            product.stock > 0 ? 'bg-green-700 hover:bg-green-800' : 'bg-slate-300 cursor-not-allowed'
          }`}
          aria-label="Tambah ke keranjang"
        >
          <ShoppingCart className="w-4 h-4" />
          {product.stock > 0 ? '+ Keranjang' : 'Stok Habis'}
        </button>
      </div>
    </div>
  );
}

// ======================================================
// FILTER SIDEBAR Component (Tanpa Ecosystem)
// ======================================================
function FilterSidebar({ 
  isOpen, 
  onClose, 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  priceRange, 
  onPriceChange,
  onReset
}: FilterSidebarProps) {
  return (
    <>
      {/* Overlay layar hp */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={onClose} aria-label="Tutup filter" />}
      
      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 w-full max-w-xs bg-white z-50 transform transition-transform duration-300 overflow-y-auto lg:sticky lg:top-4 lg:z-0 lg:translate-x-0 lg:w-64 border border-slate-200 rounded-2xl flex-shrink-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-green-600" />
            <h2 className="text-md font-black text-slate-900">Filter Produk</h2>
          </div>
          <button onClick={onClose} className="lg:hidden w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center" aria-label="Tutup filter">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Filter Kategori */}
          <div>
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">Kategori</h3>
            <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
              <button
                onClick={() => onCategoryChange('')}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${
                  selectedCategory === '' ? 'bg-green-100 text-green-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
                aria-label="Semua kategori"
              >
                Semua Kategori
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onCategoryChange(cat.slug)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition flex justify-between ${
                    selectedCategory === cat.slug ? 'bg-green-100 text-green-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                  aria-label={`Filter kategori ${cat.name}`}
                >
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Rentang Harga */}
          <div>
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">Rentang Harga</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => onPriceChange({ ...priceRange, min: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:border-green-500 focus:outline-none bg-slate-50"
                aria-label="Harga minimum"
              />
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => onPriceChange({ ...priceRange, max: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:border-green-500 focus:outline-none bg-slate-50"
                aria-label="Harga maksimum"
              />
            </div>
          </div>

          {/* Checkboxes Toggles */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <label className="flex justify-between items-center cursor-pointer">
              <span className="text-xs font-semibold text-slate-600">Tersedia Stok</span>
              <input
                type="checkbox"
                checked={priceRange.inStockOnly}
                onChange={(e) => onPriceChange({ ...priceRange, inStockOnly: e.target.checked })}
                className="w-4 h-4 text-green-600 focus:ring-green-500 border-slate-300 rounded"
                aria-label="Tampilkan produk yang tersedia stok"
              />
            </label>
          </div>

          <button onClick={onReset} className="w-full h-9 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition flex items-center justify-center gap-1" aria-label="Reset semua filter">
            <RotateCcw className="w-3 h-3" /> Reset Filter
          </button>
        </div>
      </div>
    </>
  );
}

// ======================================================
// MAIN PRODUCTS PAGE COMPONENT
// ======================================================
export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '', inStockOnly: false });
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [priceStats, setPriceStats] = useState({ min: 0, max: 0 });

  // Load wishlist from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        try {
          const parsed = JSON.parse(savedWishlist);
          if (Array.isArray(parsed)) {
            setWishlist(parsed);
          }
        } catch (e) {
          console.error('Failed to parse wishlist:', e);
        }
      }
    }
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist]);

  // Wishlist handler
  const handleToggleWishlist = useCallback((product: Product) => {
    setWishlist((prev) => {
      const exists = prev.includes(product.id);
      const newWishlist = exists
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id];
      
      toast.success(exists ? 'Dihapus dari wishlist' : 'Ditambahkan ke wishlist');
      return newWishlist;
    });
  }, []);

  // Add to cart handler
  const handleAddToCart = useCallback((product: Product) => {
    toast.success(`${product.name} masuk keranjang!`);
  }, []);

  // Fetch products from API with filters
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Build query params
      const params: any = {
        status: 'active',
      };
      
      if (selectedCategory) {
        params.category = selectedCategory;
      }
      
      if (priceRange.min) {
        params.min_price = priceRange.min;
      }
      
      if (priceRange.max) {
        params.max_price = priceRange.max;
      }
      
      if (priceRange.inStockOnly) {
        params.in_stock = true;
      }
      
      if (sortBy) {
        params.sort = sortBy;
      }
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      console.log('Fetching products with params:', params);
      
      const response = await api.get('/public/products', { params });
      
      if (response.data?.data && Array.isArray(response.data.data)) {
        const normalizedProducts = response.data.data.map(normalizeProduct);
        setProducts(normalizedProducts);
        console.log(`✅ Loaded ${normalizedProducts.length} products from API`);
      } else if (response.data && Array.isArray(response.data)) {
        // Handle response that is directly an array
        const normalizedProducts = response.data.map(normalizeProduct);
        setProducts(normalizedProducts);
        console.log(`✅ Loaded ${normalizedProducts.length} products from API (direct array)`);
      } else {
        console.warn('API response format unexpected, using fallback data');
        setProducts(DIRECT_PRODUCTS);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Gagal memuat produk, menggunakan data lokal');
      setProducts(DIRECT_PRODUCTS);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, priceRange, sortBy, searchQuery]);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get('/public/categories');
      
      if (response.data?.data && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
        console.log(`✅ Loaded ${response.data.data.length} categories from API`);
      } else if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
        console.log(`✅ Loaded ${response.data.length} categories from API (direct array)`);
      } else {
        // Generate categories from products
        const sourceProducts = products.length > 0 ? products : DIRECT_PRODUCTS;
        const uniqueCategories = Array.from(
          new Map(sourceProducts.map(p => [p.category_id, {
            id: p.category_id || 0,
            name: p.category_name || '',
            slug: p.category_slug || '',
          }]))
        ).map(([_, value]) => value);
        setCategories(uniqueCategories);
        console.log(`📦 Generated ${uniqueCategories.length} categories from product data`);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Generate categories from fallback products
      const uniqueCategories = Array.from(
        new Map(DIRECT_PRODUCTS.map(p => [p.category_id, {
          id: p.category_id || 0,
          name: p.category_name || '',
          slug: p.category_slug || '',
        }]))
      ).map(([_, value]) => value);
      setCategories(uniqueCategories);
    }
  }, [products]);

  // Fetch price range stats
  const fetchPriceStats = useCallback(async () => {
    try {
      const response = await api.get('/public/products/price-range');
      if (response.data?.data) {
        setPriceStats({
          min: response.data.data.min_price || 0,
          max: response.data.data.max_price || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching price stats:', error);
      // Calculate from products
      if (products.length > 0) {
        const prices = products.map(p => p.price);
        setPriceStats({
          min: Math.min(...prices),
          max: Math.max(...prices),
        });
      }
    }
  }, [products]);

  // Initial data load
  useEffect(() => {
    fetchCategories();
    fetchPriceStats();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleResetFilters = useCallback(() => {
    setSelectedCategory('');
    setPriceRange({ min: '', max: '', inStockOnly: false });
    setSearchQuery('');
    setSortBy('featured');
    toast.success('Filter direset');
  }, []);

  // Filter & Sort Logic (client-side for instant response, but data is already filtered from API)
  const filteredAndSortedProducts = useMemo(() => {
    // Additional client-side filtering for instant UX
    let filtered = [...products];
    
    // Client-side search (as backup)
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Client-side stock filter (as backup)
    if (priceRange.inStockOnly) {
      filtered = filtered.filter(p => p.stock > 0);
    }
    
    // Client-side price filter (as backup)
    if (priceRange.min) {
      filtered = filtered.filter(p => {
        const finalPrice = (p.discount_percent || 0) > 0 
          ? p.price * (1 - (p.discount_percent || 0) / 100)
          : p.price;
        return finalPrice >= Number(priceRange.min);
      });
    }
    
    if (priceRange.max) {
      filtered = filtered.filter(p => {
        const finalPrice = (p.discount_percent || 0) > 0 
          ? p.price * (1 - (p.discount_percent || 0) / 100)
          : p.price;
        return finalPrice <= Number(priceRange.max);
      });
    }
    
    // Sorting
    return [...filtered].sort((a, b) => {
      const priceA = (a.discount_percent || 0) > 0 
        ? a.price * (1 - (a.discount_percent || 0) / 100) 
        : a.price;
      const priceB = (b.discount_percent || 0) > 0 
        ? b.price * (1 - (b.discount_percent || 0) / 100) 
        : b.price;

      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      // featured = sort by sold count (popularity)
      return (b.sold_count || 0) - (a.sold_count || 0);
    });
  }, [products, searchQuery, priceRange, sortBy]);

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-6 text-slate-800">
      <Toaster position="top-right" />
      
      {/* Search Bar & Top Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari produk pertanian..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-green-600 bg-white text-sm"
            aria-label="Cari produk"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button onClick={() => setIsFilterOpen(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-xl text-xs font-bold" aria-label="Buka filter">
            <SlidersHorizontal className="w-4 h-4 text-green-600" /> Filter
          </button>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs focus:outline-none focus:border-green-600 font-medium"
            aria-label="Urutkan berdasarkan"
          >
            <option value="featured">Terpopuler</option>
            <option value="price-low">Harga: Rendah ke Tinggi</option>
            <option value="price-high">Harga: Tinggi ke Rendah</option>
          </select>
          <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-white">
            <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-slate-100 text-green-700' : 'bg-white'}`} aria-label="Tampilan grid">
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-slate-100 text-green-700' : 'bg-white'}`} aria-label="Tampilan list">
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Price range indicator */}
      {priceStats.max > 0 && (
        <div className="text-xs text-slate-400 mb-4">
          Rentang harga: {formatCurrency(priceStats.min)} - {formatCurrency(priceStats.max)}
        </div>
      )}

      {/* STRUKTUR UTAMA */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* SISI KIRI: Sidebar Filter */}
        <FilterSidebar
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          onReset={handleResetFilters}
        />

        {/* SISI KANAN: Hasil Katalog */}
        <div className="flex-1 w-full">
          {isLoading ? (
            <div className="text-center py-20 text-slate-400 text-sm font-medium">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              Memuat katalog produk...
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">Produk Tidak Ditemukan</h3>
              <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci atau bersihkan pengaturan filter Anda.</p>
              <button onClick={handleResetFilters} className="mt-4 px-4 py-1.5 bg-green-700 text-white font-bold text-xs rounded-xl" aria-label="Reset filter">
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <>
              <div className="text-sm text-slate-500 mb-4">
                Menampilkan {filteredAndSortedProducts.length} produk
              </div>
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4' : 'flex flex-col gap-4'}>
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    isInWishlist={wishlist.includes(product.id)}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}