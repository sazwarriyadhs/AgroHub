// app/(marketplace)/wishlist/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Star, 
  Store,
  ArrowRight,
  Package,
  X,
  TrendingUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// ✅ IMPORT STATE YANG BENAR (sudah direname)
import { useWishlistStore } from '../state/wishlist';
import { useCartStore } from '../state/cart';
import { useUserStore } from '../state/user';

import axios from 'axios';

// ======================================================
// CONFIG
// ======================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';
const PLACEHOLDER_IMAGE = '/placeholder-product.png';

// ======================================================
// HELPERS
// ======================================================

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value || 0);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('id-ID').format(value || 0);
};

// ======================================================
// NORMALIZE IMAGE FUNCTION
// ======================================================

const normalizeImage = (url?: string | null) => {
  if (!url) return PLACEHOLDER_IMAGE;
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  if (url.startsWith('/')) {
    return url;
  }
  
  if (url.match(/^[a-zA-Z0-9_\-]+\.(png|jpg|jpeg|gif|webp)$/i)) {
    return `/gambar/${url}`;
  }
  
  return PLACEHOLDER_IMAGE;
};

// ======================================================
// WISHLIST ITEM CARD
// ======================================================

function WishlistItemCard({ item, onRemove, onAddToCart }: { 
  item: any; 
  onRemove: (id: number) => void;
  onAddToCart: (item: any) => Promise<void>;
}) {
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const imageSrc = imageError ? PLACEHOLDER_IMAGE : normalizeImage(item.image);
  
  const handleAddToCart = async () => {
    setIsAdding(true);
    await onAddToCart(item);
    setIsAdding(false);
  };
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl border border-slate-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Product Image */}
        <Link href={`/products/${item.product_id}`} className="sm:w-32 h-32 relative bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
          <Image
            src={imageSrc}
            alt={item.name}
            fill
            className="object-cover hover:scale-105 transition duration-300"
            onError={() => setImageError(true)}
          />
        </Link>
        
        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <Link href={`/products/${item.product_id}`}>
            <h3 className="font-bold text-slate-800 hover:text-green-700 transition line-clamp-2">
              {item.name}
            </h3>
          </Link>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{item.rating || 4.5}</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1 text-slate-500 text-sm">
              <Store className="w-3.5 h-3.5" />
              <span>Toko Terpercaya</span>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="text-2xl font-black text-green-700">
              {formatCurrency(item.price)}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4" />
              {isAdding ? 'Menambahkan...' : '+ Keranjang'}
            </button>
            <button
              onClick={() => onRemove(item.id)}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-50 transition"
            >
              <Trash2 className="w-4 h-4" />
              Hapus
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ======================================================
// EMPTY WISHLIST STATE
// ======================================================

function EmptyWishlist() {
  return (
    <div className="text-center py-16">
      <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <Heart className="w-16 h-16 text-red-400" />
      </div>
      <h2 className="text-2xl font-black text-slate-800 mb-2">Wishlist Masih Kosong</h2>
      <p className="text-slate-500 mb-6">Simpan produk favorit Anda di sini untuk dibeli nanti</p>
      <Link
        href="/products"
        className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition"
      >
        Jelajahi Produk
        <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  );
}

// ======================================================
// MAIN PAGE
// ======================================================

export default function WishlistPage() {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const { 
    items: wishlistItems, 
    removeItem,
    removeByProductId,
    clearWishlist,
    isInWishlist
  } = useWishlistStore();
  
  const { addItem: addToCartStore } = useCartStore();
  const { isAuthenticated, user } = useUserStore();
  
  // Sync wishlist dengan backend (jika login)
  const syncWishlistWithBackend = async () => {
    if (!isAuthenticated) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success && response.data.data) {
        // Backend akan mengirim data wishlist
        console.log('Wishlist synced from backend:', response.data.data);
      }
    } catch (error) {
      console.error('Failed to sync wishlist:', error);
    }
  };
  
  // Load recommendations (produk serupa)
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const response = await axios.get(`${API_URL}/public/products`, {
          params: { limit: 4, sort_by: 'sold_count', sort_order: 'desc' }
        });
        if (response.data.success && response.data.data) {
          setRecommendations(response.data.data.slice(0, 4));
        } else {
          // Fallback recommendations
          setRecommendations([
            { id: 1, name: 'Pupuk Organik Premium', price: 85000, image_url: null, rating_avg: 4.8, sold_count: 234 },
            { id: 2, name: 'Benih Padi Unggul', price: 45000, image_url: null, rating_avg: 4.7, sold_count: 567 },
            { id: 3, name: 'Pakan Ikan Kualitas Terbaik', price: 120000, image_url: null, rating_avg: 4.9, sold_count: 890 },
            { id: 4, name: 'Alat Penyemprot Tanaman', price: 250000, image_url: null, rating_avg: 4.6, sold_count: 123 },
          ]);
        }
      } catch (error) {
        console.error('Error loading recommendations:', error);
        // Fallback recommendations
        setRecommendations([
          { id: 1, name: 'Pupuk Organik Premium', price: 85000, image_url: null, rating_avg: 4.8, sold_count: 234 },
          { id: 2, name: 'Benih Padi Unggul', price: 45000, image_url: null, rating_avg: 4.7, sold_count: 567 },
          { id: 3, name: 'Pakan Ikan Kualitas Terbaik', price: 120000, image_url: null, rating_avg: 4.9, sold_count: 890 },
          { id: 4, name: 'Alat Penyemprot Tanaman', price: 250000, image_url: null, rating_avg: 4.6, sold_count: 123 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    loadRecommendations();
    syncWishlistWithBackend();
  }, [isAuthenticated]);
  
  // Remove from wishlist
  const handleRemove = async (id: number) => {
    removeItem(id);
    toast.success('Produk dihapus dari wishlist');
    
    // Sync ke backend jika login
    if (isAuthenticated) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/wishlist/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Failed to remove from backend wishlist:', error);
      }
    }
  };
  
  // Add to cart
  const handleAddToCart = async (item: any) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`${API_URL}/cart/add`, 
          { product_id: item.product_id, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      addToCartStore({
        id: Date.now(),
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        image: normalizeImage(item.image),
        quantity: 1,
        stock: 99
      });
      
      toast.success(`${item.name} ditambahkan ke keranjang`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Gagal menambahkan ke keranjang');
    }
  };
  
  // Clear all wishlist
  const handleClearAll = async () => {
    if (confirm('Hapus semua produk dari wishlist?')) {
      clearWishlist();
      toast.success('Semua produk dihapus dari wishlist');
      
      // Sync ke backend jika login
      if (isAuthenticated) {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`${API_URL}/wishlist/clear`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (error) {
          console.error('Failed to clear backend wishlist:', error);
        }
      }
    }
  };
  
  if (loading && wishlistItems.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-5 py-8">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-slate-600">Memuat wishlist...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-5 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              Wishlist Saya
            </h1>
            <p className="text-slate-500 mt-2">
              {formatNumber(wishlistItems.length)} produk tersimpan
            </p>
          </div>
          
          {wishlistItems.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition"
            >
              <Trash2 className="w-4 h-4" />
              Hapus Semua
            </button>
          )}
        </div>
        
        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {wishlistItems.map((item) => (
                <WishlistItemCard
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
        
        {/* Rekomendasi Produk */}
        {recommendations.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Rekomendasi Untuk Anda</h2>
                <p className="text-slate-500 text-sm">Produk lain yang mungkin Anda sukai</p>
              </div>
              <Link href="/products" className="text-green-700 font-bold hover:text-green-800 transition">
                Lihat Semua →
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {recommendations.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition group">
                    <div className="relative h-40 overflow-hidden bg-slate-100">
                      <Image
                        src={normalizeImage(product.image_url)}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-slate-800 line-clamp-2 text-sm min-h-[40px]">
                        {product.name}
                      </h3>
                      <div className="mt-2">
                        <div className="text-md font-black text-green-700">
                          {formatCurrency(product.price)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{product.rating_avg || 4.5}</span>
                        <span className="text-slate-400">
                          ({formatNumber(product.sold_count || 0)} terjual)
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}