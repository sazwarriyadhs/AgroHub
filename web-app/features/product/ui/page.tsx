// app/(marketplace)/products/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

import {
  Search,
  SlidersHorizontal,
  ShoppingCart,
  Star,
  Heart,
  Store,
  MapPin,
  ChevronDown,
  Sparkles,
  Flame,
  Truck,
  ShieldCheck,
  BadgePercent,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

// ======================================================
// CONFIG
// ======================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';
const ITEMS_PER_PAGE = 12; // Products per page

// ======================================================
// TYPES
// ======================================================

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image_url?: string;
  image?: string;
  rating?: number;
  sold?: number;
  location?: string;
  discount?: number;
  original_price?: number;
  old_price?: number;
  store?: string;
  store_name?: string;
  stock?: number;
  description?: string;
  status?: string;
}

interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

interface ApiResponse {
  success: boolean;
  data: Product[];
  message?: string;
  meta?: PaginationMeta;
  total?: number;
  page?: number;
  limit?: number;
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

// ======================================================
// PAGINATION COMPONENT
// ======================================================

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

function Pagination({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange,
  isLoading = false 
}: PaginationProps) {
  const [inputPage, setInputPage] = useState(currentPage.toString());
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let page = parseInt(inputPage);
    if (isNaN(page)) page = currentPage;
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    onPageChange(page);
    setInputPage(page.toString());
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="mt-10 space-y-4">
      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Info text */}
        <div className="text-sm text-slate-500">
          Menampilkan <span className="font-semibold text-slate-700">{startItem}</span> -{' '}
          <span className="font-semibold text-slate-700">{endItem}</span>{' '}
          dari <span className="font-semibold text-slate-700">{formatNumber(totalItems)}</span> produk
        </div>

        {/* Pagination Buttons */}
        <div className="flex items-center gap-2">
          {/* First Page */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || isLoading}
            className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-50 hover:border-green-300 transition-all duration-200"
            title="Halaman Pertama"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Previous Page */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-50 hover:border-green-300 transition-all duration-200"
            title="Halaman Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`dots-${index}`} className="w-10 h-10 flex items-center justify-center text-slate-400">
                  ...
                </span>
              ) : (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPageChange(page as number)}
                  disabled={isLoading}
                  className={`min-w-[40px] h-10 px-3 rounded-lg font-semibold transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-200'
                      : 'border border-slate-200 text-slate-700 hover:bg-green-50 hover:border-green-300'
                  }`}
                >
                  {page}
                </motion.button>
              )
            ))}
          </div>

          {/* Next Page */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-50 hover:border-green-300 transition-all duration-200"
            title="Halaman Selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Last Page */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || isLoading}
            className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-50 hover:border-green-300 transition-all duration-200"
            title="Halaman Terakhir"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Go to page input */}
      <div className="flex justify-center">
        <form onSubmit={handleInputSubmit} className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Lompat ke halaman</span>
          <input
            type="number"
            value={inputPage}
            onChange={handleInputChange}
            min={1}
            max={totalPages}
            className="w-20 h-10 px-3 text-center rounded-lg border border-slate-200 focus:border-green-500 focus:outline-none transition"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="h-10 px-4 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            Go
          </button>
        </form>
      </div>
    </div>
  );
}

// ======================================================
// PAGE COMPONENT
// ======================================================

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('terbaru');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000000]);
  const [categories, setCategories] = useState<string[]>(['Semua']);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  
  // UI state
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<{ [key: number]: number }>({});

  // Load products from API with pagination
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (search) params.search = search;
      if (selectedCategory !== 'Semua') params.category = selectedCategory;
      if (sortBy) {
        switch(sortBy) {
          case 'termurah':
            params.sort_by = 'price';
            params.sort_order = 'asc';
            break;
          case 'termahal':
            params.sort_by = 'price';
            params.sort_order = 'desc';
            break;
          case 'terlaris':
            params.sort_by = 'sold';
            params.sort_order = 'desc';
            break;
          case 'terbaik':
            params.sort_by = 'rating';
            params.sort_order = 'desc';
            break;
          case 'terbaru':
          default:
            params.sort_by = 'created_at';
            params.sort_order = 'desc';
            break;
        }
      }
      if (priceRange[0] > 0) params.min_price = priceRange[0];
      if (priceRange[1] < 20000000) params.max_price = priceRange[1];

      const response = await axios.get<ApiResponse>(`${API_URL}/public/products`, { params });
      
      if (response.data.success) {
        // Transform products to match frontend format
        const transformedProducts = (response.data.data || []).map((product: any) => ({
          ...product,
          image_url: product.image || product.image_url || '/banner1.png',
          original_price: product.old_price || product.original_price,
          store: product.store_name || product.store || 'AgroHub Official',
          rating: product.rating || 4.5,
          sold: product.sold || 0,
        }));
        
        setProducts(transformedProducts);
        
        // Handle pagination meta
        if (response.data.meta) {
          setTotalPages(response.data.meta.total_pages);
          setTotalProducts(response.data.meta.total);
        } else if (response.data.total) {
          const pages = Math.ceil(response.data.total / itemsPerPage);
          setTotalPages(pages);
          setTotalProducts(response.data.total);
        } else {
          setTotalPages(1);
          setTotalProducts(transformedProducts.length);
        }
      } else {
        setProducts([]);
        setTotalProducts(0);
        setTotalPages(1);
        if (response.data.message) {
          setError(response.data.message);
        }
      }
    } catch (err: any) {
      console.error('Error loading products:', err);
      setError(err.response?.data?.message || 'Gagal memuat produk');
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, search, selectedCategory, sortBy, priceRange]);

  // Load categories from API
  const loadCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/public/categories`);
      if (response.data.success && response.data.data) {
        const categoryNames = ['Semua', ...response.data.data.map((cat: any) => cat.name)];
        setCategories(categoryNames);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      // Keep default categories
    }
  }, []);

  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
    
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      const cartMap: { [key: number]: number } = {};
      cartItems.forEach((item: any) => {
        cartMap[item.product_id || item.id] = item.quantity;
      });
      setCart(cartMap);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, sortBy, priceRange]);

  // Add to cart
  const addToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const existingCart = localStorage.getItem('cart');
    let cartItems = existingCart ? JSON.parse(existingCart) : [];
    
    const existingItem = cartItems.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      cartItems = cartItems.map((item: any) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      cartItems.push({
        id: product.id,
        product_id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url,
        quantity: 1,
        stock: product.stock || 99
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cartItems));
    setCart(prev => ({ ...prev, [product.id]: (prev[product.id] || 0) + 1 }));
    
    showToast(`${product.name} ditambahkan ke keranjang`);
  };

  // Toggle wishlist
  const toggleWishlist = (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setWishlist(prev => {
      if (prev.includes(productId)) {
        showToast('Produk dihapus dari wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Produk ditambahkan ke wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const toast = document.createElement('div');
    const colors = {
      success: 'bg-green-600',
      error: 'bg-red-600',
      info: 'bg-blue-600'
    };
    toast.className = `fixed bottom-4 right-4 ${colors[type]} text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-up`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  // Reset filters
  const resetFilters = () => {
    setPriceRange([0, 20000000]);
    setSelectedCategory('Semua');
    setSearch('');
    setSortBy('terbaru');
    setCurrentPage(1);
  };

  // Change page with scroll to top
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Change items per page
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loading && currentPage === 1 && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Memuat produk...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 pt-6">
        <div className="relative overflow-hidden rounded-3xl h-[320px]">
          <Image
            src="/banner1.png"
            alt="Banner"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="relative z-10 h-full flex items-center px-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full text-green-400 text-sm font-semibold mb-4">
                <Sparkles className="w-4 h-4" />
                Marketplace Pertanian Modern
              </div>
              <h1 className="text-5xl font-black text-white leading-tight">
                Koleksi Produk
                <br />
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Pertanian Terlengkap
                </span>
              </h1>
              <p className="text-white/80 text-lg mt-4 max-w-lg">
                Temukan ribuan produk pertanian berkualitas dari supplier terpercaya
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari produk..."
                className="w-full h-[48px] pl-11 pr-4 rounded-xl border border-slate-200 bg-white focus:border-green-500 focus:outline-none transition"
              />
            </div>

            {/* Category Select */}
            <div className="relative min-w-[160px]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-[48px] px-4 pr-10 rounded-xl border border-slate-200 bg-white appearance-none cursor-pointer focus:border-green-500 focus:outline-none w-full"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Sort Select */}
            <div className="relative min-w-[180px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-[48px] px-4 pr-10 rounded-xl border border-slate-200 bg-white appearance-none cursor-pointer focus:border-green-500 focus:outline-none w-full"
              >
                <option value="terbaru">Terbaru</option>
                <option value="termurah">Harga Terendah</option>
                <option value="termahal">Harga Tertinggi</option>
                <option value="terlaris">Terlaris</option>
                <option value="terbaik">Rating Tertinggi</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Items Per Page Select */}
            <div className="relative min-w-[130px]">
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="h-[48px] px-4 pr-10 rounded-xl border border-slate-200 bg-white appearance-none cursor-pointer focus:border-green-500 focus:outline-none w-full"
              >
                <option value={12}>12 per halaman</option>
                <option value={24}>24 per halaman</option>
                <option value={48}>48 per halaman</option>
                <option value={96}>96 per halaman</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`h-[48px] px-5 rounded-xl border flex items-center gap-2 transition ${
                showFilters
                  ? 'bg-green-700 text-white border-green-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-green-400'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          {/* Extended Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-slate-200"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Range Harga
                    </label>
                    <div className="flex gap-4">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        placeholder="Min"
                        className="flex-1 h-[40px] px-3 rounded-lg border border-slate-200 focus:border-green-500 focus:outline-none"
                      />
                      <span className="text-slate-400">-</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        placeholder="Max"
                        className="flex-1 h-[40px] px-3 rounded-lg border border-slate-200 focus:border-green-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Reset Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={resetFilters}
                      className="text-sm text-red-500 hover:text-red-600 font-semibold"
                    >
                      Reset Semua Filter
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Semua Produk
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Menampilkan {formatNumber(totalProducts)} produk
            </p>
          </div>
        </div>

        {/* Loading indicator for page changes */}
        {loading && currentPage > 1 && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Error Memuat Produk
            </h3>
            <p className="text-slate-500">{error}</p>
            <button
              onClick={() => loadProducts()}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!error && products.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Produk tidak ditemukan
            </h3>
            <p className="text-slate-500">
              Coba ubah filter atau kata kunci pencarian
            </p>
          </div>
        )}

        {products.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product, idx) => {
                const isInWishlist = wishlist.includes(product.id);
                const cartQuantity = cart[product.id] || 0;
                const discountPercent = product.discount || 
                  (product.original_price && product.original_price > product.price 
                    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                    : 0);
                
                return (
                  <motion.div
                    key={`${product.id}-${currentPage}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (idx % itemsPerPage) * 0.02 }}
                    whileHover={{ y: -6 }}
                  >
                    <Link href={`/products/${product.id}`}>
                      <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                        {/* Image */}
                        <div className="relative h-52 overflow-hidden bg-slate-100">
                          <Image
                            src={product.image_url || '/banner1.png'}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition duration-500"
                          />
                          {discountPercent > 0 && (
                            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                              -{discountPercent}%
                            </div>
                          )}
                          <button
                            onClick={(e) => toggleWishlist(product.id, e)}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:scale-110"
                          >
                            <Heart className={`w-4 h-4 transition ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-slate-700'}`} />
                          </button>
                          {cartQuantity > 0 && (
                            <div className="absolute bottom-3 right-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                              {cartQuantity}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <div className="text-xs text-green-700 font-bold mb-1">
                            {product.category}
                          </div>
                          <h3 className="font-semibold text-slate-800 line-clamp-2 min-h-[48px] text-sm">
                            {product.name}
                          </h3>

                          <div className="mt-2">
                            <div className="text-xl font-black text-green-700">
                              {formatCurrency(product.price)}
                            </div>
                            {product.original_price && product.original_price > product.price && (
                              <div className="text-xs text-slate-400 line-through">
                                {formatCurrency(product.original_price)}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-2 text-xs">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{product.rating}</span>
                            </div>
                            <span className="text-slate-300">|</span>
                            <span className="text-slate-500">
                              {formatNumber(product.sold || 0)} terjual
                            </span>
                          </div>

                          <div className="mt-3 flex items-center gap-1">
                            <Store className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-600 truncate">
                              {product.store}
                            </span>
                          </div>

                          <button
                            onClick={(e) => addToCart(product, e)}
                            className="mt-3 w-full h-9 rounded-xl bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition flex items-center justify-center gap-1"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            + Keranjang
                          </button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination Component */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalProducts}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                isLoading={loading}
              />
            )}
          </>
        )}
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 p-10 shadow-2xl cursor-pointer"
        >
          <div className="absolute -right-10 -bottom-10 text-[180px] opacity-10 animate-pulse">
            🔥
          </div>
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <div className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                <span className="text-white font-semibold text-sm">🎉 Limited Offer</span>
              </div>
              <h2 className="text-5xl font-black text-white">
                Diskon Hingga 70%
              </h2>
              <p className="text-white/80 mt-3 text-lg">untuk produk pertanian pilihan</p>
            </div>
            <div className="flex gap-4">
              <Link href="/products?discount=true">
                <button className="h-[54px] px-8 rounded-xl bg-white text-red-600 font-bold hover:shadow-xl transition-all">
                  Belanja Promo
                </button>
              </Link>
              <Link href="/promo">
                <button className="h-[54px] px-8 rounded-xl border border-white/30 text-white font-bold backdrop-blur-md hover:bg-white/10 transition-all">
                  Lihat Detail
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}