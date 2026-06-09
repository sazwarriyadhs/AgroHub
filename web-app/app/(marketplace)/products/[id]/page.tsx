'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

import {
  ShoppingCart,
  Heart,
  Star,
  Store,
  ShieldCheck,
  Truck,
  Minus,
  Plus,
  ChevronRight,
  MapPin,
  MessageCircle,
  Share2,
  Droplet,
  Trees,
  Factory,
  Leaf,
  Sprout,
  AlertCircle,
  Loader2,
  Link as LinkIcon,
  CheckCircle,
  Package,
  Clock,
  RotateCcw,
} from 'lucide-react';

// ======================================================
// CONFIG
// ======================================================
const PLACEHOLDER_IMAGE = '/placeholder-product.png';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

// ======================================================
// AXIOS INSTANCE
// ======================================================
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Add interceptors for debugging
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

// ======================================================
// NORMALIZE IMAGE FUNCTION
// ======================================================
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

// ======================================================
// TYPES
// ======================================================
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  category_id?: number;
  category_name?: string;
  category_slug?: string;
  image_url?: string;
  image?: string;
  rating?: number;
  rating_count?: number;
  sold?: number;
  stock?: number;
  description?: string;
  location?: string;
  origin_location?: string;
  store_id?: number;
  store_name?: string;
  store_logo?: string;
  store_verified?: boolean;
  store_rating?: number;
  store_total_sales?: number;
  weight?: string;
  old_price?: number;
  discount?: number;
  discount_percent?: number;
  created_at?: string;
  ecosystem_type?: 'FARMER' | 'AQUA' | 'HERD' | 'VENDOR' | null;
  minimum_order?: number;
  brand?: string;
  sku?: string;
  specifications?: { [key: string]: string };
  reviews?: Review[];
  animal_type?: string;
  animal_age?: string;
  animal_weight?: string;
  health_certificate?: boolean;
  vaccination_status?: string;
  is_featured?: boolean;
  unit?: string;
  shipping_info?: string;
}

interface Review {
  id: number;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  created_at: string;
  images?: string[];
}

interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  old_price?: number;
  category: string;
  image: string;
  rating: number;
  sold: number;
  ecosystem_type?: string;
  discount_percent?: number;
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

// Normalize product from API (adjust based on actual API response)
const normalizeProduct = (apiProduct: any): Product => {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    price: parseFloat(apiProduct.price),
    old_price: apiProduct.old_price ? parseFloat(apiProduct.old_price) : undefined,
    stock: apiProduct.stock || 0,
    sold: apiProduct.sold || 0,
    rating: apiProduct.rating ? parseFloat(apiProduct.rating) : 0,
    rating_count: apiProduct.rating_count || apiProduct.review_count || 0,
    description: apiProduct.description,
    location: apiProduct.location || apiProduct.origin_location,
    origin_location: apiProduct.origin_location,
    image_url: apiProduct.image_url || apiProduct.image,
    category_id: apiProduct.category_id,
    category_name: apiProduct.category_name || apiProduct.category,
    category_slug: apiProduct.category_slug,
    store_id: apiProduct.store_id,
    store_name: apiProduct.store_name,
    store_verified: apiProduct.store_verified,
    store_rating: apiProduct.store_rating,
    store_total_sales: apiProduct.store_total_sales,
    discount: apiProduct.discount || 0,
    discount_percent: apiProduct.discount || 0,
    ecosystem_type: apiProduct.ecosystem_type,
    minimum_order: apiProduct.minimum_order || 1,
    weight: apiProduct.weight,
    unit: apiProduct.unit || 'item',
    brand: apiProduct.brand,
    sku: apiProduct.sku,
    specifications: apiProduct.specifications,
    animal_type: apiProduct.animal_type,
    animal_age: apiProduct.animal_age,
    animal_weight: apiProduct.animal_weight,
    health_certificate: apiProduct.health_certificate,
    vaccination_status: apiProduct.vaccination_status,
    is_featured: apiProduct.is_featured || false,
    shipping_info: apiProduct.shipping_info,
    created_at: apiProduct.created_at,
  };
};

// Get related products from same category (client-side fallback)
const getRelatedProductsFromList = async (productId: number, categoryId?: number): Promise<RelatedProduct[]> => {
  try {
    // Fetch all products and filter by same category
    const response = await api.get('/public/products', {
      params: {
        limit: 20,
        category_id: categoryId,
      }
    });
    
    if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data
        .filter((p: any) => p.id !== productId)
        .slice(0, 4)
        .map((p: any) => ({
          id: p.id,
          name: p.name,
          price: parseFloat(p.price),
          old_price: p.old_price ? parseFloat(p.old_price) : undefined,
          category: p.category_name || p.category || 'Produk',
          image: normalizeImage(p.image_url || p.image),
          rating: p.rating || 4.5,
          sold: p.sold || 0,
          ecosystem_type: p.ecosystem_type,
          discount_percent: p.discount || 0,
        }));
    }
  } catch (error) {
    console.error('Error fetching related products:', error);
  }
  return [];
};

// ======================================================
// ECOSYSTEM BADGE
// ======================================================
function EcosystemBadge({ type }: { type?: string | null }) {
  const badges: Record<string, { label: string; color: string; icon: JSX.Element; bgColor: string }> = {
    FARMER: { 
      label: '🌾 Farmer - Petani', 
      color: 'text-green-700', 
      icon: <Leaf className="w-4 h-4" />,
      bgColor: 'bg-green-50'
    },
    AQUA: { 
      label: '🐟 Aqua - Perikanan Darat', 
      color: 'text-blue-700', 
      icon: <Droplet className="w-4 h-4" />,
      bgColor: 'bg-blue-50'
    },
    HERD: { 
      label: '🐄 Herd - Peternakan', 
      color: 'text-orange-700', 
      icon: <Trees className="w-4 h-4" />,
      bgColor: 'bg-orange-50'
    },
    VENDOR: { 
      label: '🏪 Vendor - Supplier', 
      color: 'text-purple-700', 
      icon: <Factory className="w-4 h-4" />,
      bgColor: 'bg-purple-50'
    },
  };

  const badge = type ? badges[type] : null;
  if (!badge) return null;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${badge.bgColor} ${badge.color}`}>
      {badge.icon}
      {badge.label}
    </span>
  );
}

// ======================================================
// STORE INFO SECTION
// ======================================================
function StoreInfoSection({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
        <Store className="w-5 h-5 text-green-600" />
        Informasi Toko
      </h3>
      
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
          {product.store_name?.charAt(0) || 'S'}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-slate-900">{product.store_name || 'AgroHub Store'}</h4>
            {product.store_verified && (
              <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" /> Terverifikasi
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
            {product.store_rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-slate-700">{product.store_rating}</span>
                {product.store_total_sales && <span>({formatNumber(product.store_total_sales)} penjualan)</span>}
              </div>
            )}
          </div>
          
          {product.store_id && (
            <Link 
              href={`/stores/${product.store_id}`} 
              className="inline-block mt-3 text-xs text-green-600 hover:text-green-700 font-medium"
            >
              Kunjungi Toko →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ======================================================
// ANIMAL INFO SECTION
// ======================================================
function AnimalInfoSection({ product }: { product: Product }) {
  const isAnimal = product.ecosystem_type === 'HERD' || product.ecosystem_type === 'AQUA';
  if (!isAnimal) return null;
  
  const isHerd = product.ecosystem_type === 'HERD';
  
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
        {isHerd ? '🐮 Informasi Hewan Ternak' : '🐟 Informasi Bibit Ikan'}
      </h3>
      
      <div className="grid sm:grid-cols-2 gap-3">
        {product.animal_type && (
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-500">Jenis</span>
            <span className="text-sm font-medium text-slate-800">{product.animal_type}</span>
          </div>
        )}
        {product.animal_age && (
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-500">Umur</span>
            <span className="text-sm font-medium text-slate-800">{product.animal_age}</span>
          </div>
        )}
        {product.animal_weight && (
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-500">Berat</span>
            <span className="text-sm font-medium text-slate-800">{product.animal_weight}</span>
          </div>
        )}
        {product.health_certificate && (
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-500">Sertifikat Kesehatan</span>
            <span className="text-sm font-medium text-green-600 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Tersedia
            </span>
          </div>
        )}
        {product.vaccination_status && (
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-500">Vaksinasi</span>
            <span className="text-sm font-medium text-slate-800 text-right">{product.vaccination_status}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ======================================================
// VENDOR INFO SECTION
// ======================================================
function VendorInfoSection({ product }: { product: Product }) {
  if (product.ecosystem_type !== 'VENDOR') return null;
  
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-purple-600" />
        Spesifikasi Produk
      </h3>
      
      <div className="grid sm:grid-cols-2 gap-3">
        {product.brand && (
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-500">Merek</span>
            <span className="text-sm font-medium text-slate-800">{product.brand}</span>
          </div>
        )}
        {product.sku && (
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-500">SKU</span>
            <span className="text-sm font-medium text-slate-800">{product.sku}</span>
          </div>
        )}
        {product.weight && (
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-500">Berat</span>
            <span className="text-sm font-medium text-slate-800">{product.weight}</span>
          </div>
        )}
      </div>
      
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <h4 className="text-sm font-semibold text-slate-800 mb-2">Detail Spesifikasi</h4>
          <div className="grid sm:grid-cols-2 gap-2">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-1 text-xs">
                <span className="text-slate-500">{key}</span>
                <span className="font-medium text-slate-700 text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ======================================================
// PLANT INFO SECTION
// ======================================================
function PlantInfoSection({ product }: { product: Product }) {
  if (product.ecosystem_type !== 'FARMER') return null;
  
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Sprout className="w-5 h-5 text-green-600" />
        Informasi Produk
      </h3>
      
      <div className="grid sm:grid-cols-2 gap-3">
        {product.weight && (
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-500">Berat per Unit</span>
            <span className="text-sm font-medium text-slate-800">{product.weight}</span>
          </div>
        )}
        {product.origin_location && (
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-500">Asal Produk</span>
            <span className="text-sm font-medium text-slate-800">{product.origin_location}</span>
          </div>
        )}
      </div>
      
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <h4 className="text-sm font-semibold text-slate-800 mb-2">Informasi Tambahan</h4>
          <div className="grid sm:grid-cols-2 gap-2">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-1 text-xs">
                <span className="text-slate-500">{key}</span>
                <span className="font-medium text-slate-700 text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ======================================================
// SHARE BUTTONS
// ======================================================
function ShareButtons({ productName, productId }: { productName: string; productId: number }) {
  const [showShare, setShowShare] = useState(false);
  const [url, setUrl] = useState('');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href);
    }
  }, []);

  const shareLinks = [
    { name: 'WhatsApp', icon: '💬', color: 'text-green-600', url: `https://wa.me/?text=${encodeURIComponent(`${productName} - ${url}`)}` },
    { name: 'Facebook', icon: '📘', color: 'text-blue-600', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: 'Twitter', icon: '🐦', color: 'text-sky-500', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(productName)}&url=${encodeURIComponent(url)}` },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('✅ Link produk telah disalin!');
      setShowShare(false);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Gagal menyalin link');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowShare(!showShare)}
        className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition"
        aria-label="Share product"
      >
        <Share2 className="w-5 h-5 text-slate-600" />
      </button>

      <AnimatePresence>
        {showShare && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowShare(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 5 }}
              className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden p-1"
            >
              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-50 transition ${link.color}`}
                  onClick={() => setShowShare(false)}
                >
                  <span className="text-base">{link.icon}</span> {link.name}
                </a>
              ))}
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-50 transition text-slate-700 text-left"
              >
                <LinkIcon className="w-4 h-4 text-slate-400" /> Salin Link
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ======================================================
// QUANTITY SELECTOR
// ======================================================
function QuantitySelector({ 
  quantity, 
  onQuantityChange, 
  stock, 
  minimumOrder = 1 
}: { 
  quantity: number; 
  onQuantityChange: (qty: number) => void; 
  stock: number; 
  minimumOrder?: number;
}) {
  const increment = () => {
    if (quantity < stock) {
      onQuantityChange(quantity + 1);
    }
  };
  
  const decrement = () => {
    if (quantity > minimumOrder) {
      onQuantityChange(quantity - 1);
    }
  };
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
        <button
          onClick={decrement}
          disabled={quantity <= minimumOrder}
          className={`w-10 h-10 flex items-center justify-center rounded-l-xl transition ${
            quantity <= minimumOrder ? 'text-slate-300 cursor-not-allowed' : 'hover:bg-white text-slate-700'
          }`}
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-14 text-center text-sm font-bold text-slate-800">{quantity}</span>
        <button
          onClick={increment}
          disabled={quantity >= stock}
          className={`w-10 h-10 flex items-center justify-center rounded-r-xl transition ${
            quantity >= stock ? 'text-slate-300 cursor-not-allowed' : 'hover:bg-white text-slate-700'
          }`}
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <div className="text-xs text-slate-500">
        Stok: <span className="font-bold text-slate-800">{formatNumber(stock)}</span>
        {minimumOrder > 1 && (
          <span className="block text-slate-400">Min. order {minimumOrder}</span>
        )}
      </div>
    </div>
  );
}

// ======================================================
// REVIEW SECTION (DUMMY - Endpoint belum tersedia)
// ======================================================
function ReviewSection({ productId }: { productId: number }) {
  const [reviews] = useState<Review[]>([
    {
      id: 1,
      user_name: 'Budi Santoso',
      rating: 5,
      comment: 'Barangnya mantap banget, sesuai deskripsi dan pengiriman cepat aman!',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      user_name: 'Siti Rahma',
      rating: 4,
      comment: 'Kualitas produk oke punya, pelayanannya responsif. Recommended seller.',
      created_at: new Date().toISOString()
    }
  ]);
  
  const rating = 4.5;
  const ratingCount = reviews.length;

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <p className="text-slate-500 text-sm">Belum ada ulasan untuk produk ini.</p>
        <p className="text-xs text-slate-400 mt-1">Jadilah yang pertama memberikan ulasan!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-900">{rating.toFixed(1)}</div>
          <div className="flex items-center justify-center gap-0.5 mt-1">
            {[1,2,3,4,5].map((star) => (
              <Star key={star} className={`w-4 h-4 ${star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
            ))}
          </div>
          <div className="text-xs text-slate-500 mt-1">{formatNumber(ratingCount)} ulasan</div>
        </div>
      </div>
      
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 text-sm font-bold">
              {review.user_name.charAt(0)}
            </div>
            <div>
              <div className="font-medium text-sm text-slate-800">{review.user_name}</div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                ))}
                <span className="text-xs text-slate-400 ml-2">{new Date(review.created_at).toLocaleDateString('id-ID')}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-600">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}

// ======================================================
// MAIN PAGE COMPONENT
// ======================================================
export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id ? parseInt(params.id as string) : NaN;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

  // Load wishlist from API (GET /api/v1/wishlist)
  const loadWishlist = useCallback(async () => {
    try {
      const response = await api.get('/wishlist');
      if (response.data?.data && Array.isArray(response.data.data)) {
        setIsWishlist(response.data.data.some((item: any) => item.product_id === productId));
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      // Fallback ke localStorage
      if (typeof window !== 'undefined') {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          try {
            const wishlistItems = JSON.parse(savedWishlist);
            setIsWishlist(Array.isArray(wishlistItems) && wishlistItems.includes(productId));
          } catch (err) {
            console.error('Error parsing wishlist:', err);
          }
        }
      }
    }
  }, [productId]);

  // Add to wishlist API
  const addToWishlistAPI = async () => {
    try {
      await api.post('/wishlist/add', { product_id: productId });
      toast.success('❤️ Ditambahkan ke wishlist');
      setIsWishlist(true);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      // Fallback ke localStorage
      if (typeof window !== 'undefined') {
        const savedWishlist = localStorage.getItem('wishlist');
        let wishlistItems = savedWishlist ? JSON.parse(savedWishlist) : [];
        if (!Array.isArray(wishlistItems)) wishlistItems = [];
        if (!wishlistItems.includes(productId)) {
          wishlistItems.push(productId);
          localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
          setIsWishlist(true);
          toast.success('❤️ Ditambahkan ke wishlist (lokal)');
        }
      }
    }
  };

  // Remove from wishlist API
  const removeFromWishlistAPI = async () => {
    try {
      await api.delete(`/wishlist/${productId}`);
      toast.success('❤️ Dihapus dari wishlist');
      setIsWishlist(false);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      // Fallback ke localStorage
      if (typeof window !== 'undefined') {
        const savedWishlist = localStorage.getItem('wishlist');
        let wishlistItems = savedWishlist ? JSON.parse(savedWishlist) : [];
        if (Array.isArray(wishlistItems)) {
          wishlistItems = wishlistItems.filter((id: number) => id !== productId);
          localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
          setIsWishlist(false);
          toast.success('❤️ Dihapus dari wishlist (lokal)');
        }
      }
    }
  };

  // Toggle Wishlist Handler
  const toggleWishlist = () => {
    if (isWishlist) {
      removeFromWishlistAPI();
    } else {
      addToWishlistAPI();
    }
  };

  // Add to Cart Handler
  const addToCart = () => {
    if (!product) return;
    toast.success(`🛒 Berhasil menambahkan ${quantity} ${product.unit || 'item'} ${product.name} ke keranjang!`);
  };

  // Fetch product from API
  const fetchProduct = useCallback(async () => {
    if (isNaN(productId)) {
      setError('ID produk tidak valid');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/public/products/${productId}`);
      
      if (response.data?.data) {
        const normalizedProduct = normalizeProduct(response.data.data);
        setProduct(normalizedProduct);
        setQuantity(normalizedProduct.minimum_order || 1);
        
        // Fetch related products (from same category)
        if (normalizedProduct.category_id) {
          const related = await getRelatedProductsFromList(productId, normalizedProduct.category_id);
          setRelatedProducts(related);
        }
      } else if (response.data) {
        // Handle response that is directly the product object
        const normalizedProduct = normalizeProduct(response.data);
        setProduct(normalizedProduct);
        setQuantity(normalizedProduct.minimum_order || 1);
      } else {
        setError('Produk tidak ditemukan');
      }
    } catch (err: any) {
      console.error('Error fetching product:', err);
      if (err.response?.status === 404) {
        setError('Produk tidak ditemukan');
      } else {
        setError('Gagal memuat detail produk');
      }
      toast.error('Gagal memuat data produk');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    if (!isNaN(productId)) {
      loadWishlist();
    }
  }, [productId, loadWishlist]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-green-600" />
        <p className="text-sm font-medium text-slate-600">Memuat detail produk...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full text-center border border-slate-100">
          <AlertCircle className="w-14 h-14 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Waduh, Error!</h2>
          <p className="text-slate-500 text-sm mb-6">{error || 'Produk gagal dimuat.'}</p>
          <button 
            onClick={() => router.push('/products')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition text-sm"
          >
            Kembali ke Produk
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16 pt-6">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6 overflow-x-auto whitespace-nowrap py-1">
          <Link href="/" className="hover:text-green-600 transition">Home</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <Link href="/products" className="hover:text-green-600 transition">Produk</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <span className="text-slate-800 truncate">{product.name}</span>
        </nav>

        {/* MAIN LAYOUT */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: IMAGE & DETAIL TABS */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm relative aspect-square max-h-[500px] w-full mx-auto flex items-center justify-center">
              <Image 
                src={normalizeImage(product.image_url)} 
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-w-7xl) 100vw"
              />
              {product.discount_percent && product.discount_percent > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-md">
                  DISKON {product.discount_percent}%
                </span>
              )}
            </div>

            {/* CARD TABS INFO */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="flex border-b border-slate-100 mb-4 gap-4 overflow-x-auto">
                {(['description', 'specifications', 'reviews'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-bold capitalize border-b-2 transition flex-shrink-0 ${
                      activeTab === tab 
                        ? 'border-green-600 text-green-600' 
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab === 'description' ? 'Deskripsi' : tab === 'specifications' ? 'Spesifikasi' : 'Ulasan'}
                  </button>
                ))}
              </div>

              <div>
                {activeTab === 'description' && (
                  <p className="text-slate-600 text-sm whitespace-pre-line leading-relaxed">
                    {product.description || 'Deskripsi produk belum tersedia.'}
                  </p>
                )}
                {activeTab === 'specifications' && (
                  <div className="space-y-2">
                    {product.specifications && Object.keys(product.specifications).length > 0 ? (
                      Object.entries(product.specifications).map(([key, val]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-slate-50 text-sm">
                          <span className="text-slate-500 font-medium">{key}</span>
                          <span className="text-slate-800 font-semibold text-right">{val}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-sm text-center py-4">Spesifikasi detail tidak tersedia.</p>
                    )}
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <ReviewSection productId={product.id} />
                )}
              </div>
            </div>

            {/* DYNAMIC ECOSYSTEM INFO SECTIONS */}
            <AnimalInfoSection product={product} />
            <VendorInfoSection product={product} />
            <PlantInfoSection product={product} />
          </div>

          {/* RIGHT: BUYING ACTIONS & ACTION BOX */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5">
              
              <div className="space-y-2">
                <EcosystemBadge type={product.ecosystem_type} />
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">{product.name}</h1>
                
                <div className="flex items-center gap-4 flex-wrap text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-slate-700">{product.rating || 4.5}</span>
                    <span>({product.rating_count || 0} ulasan)</span>
                  </div>
                  <span>•</span>
                  <div>Terjual <span className="font-semibold text-slate-700">{formatNumber(product.sold || 0)}</span></div>
                  <span>•</span>
                  <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {product.location || 'Indonesia'}</div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* PRICING */}
              <div className="bg-slate-50 p-4 rounded-xl space-y-1">
                {product.old_price && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="line-through text-slate-400">{formatCurrency(product.old_price)}</span>
                    <span className="font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-md">-{product.discount_percent}%</span>
                  </div>
                )}
                <div className="text-2xl sm:text-3xl font-black text-slate-900">
                  {formatCurrency(product.price)}
                  <span className="text-xs text-slate-400 font-normal ml-1">/ {product.unit || 'item'}</span>
                </div>
              </div>

              {/* QUANTITY SELECTOR */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Jumlah Pembelian</label>
                <QuantitySelector 
                  quantity={quantity} 
                  onQuantityChange={setQuantity} 
                  stock={product.stock || 0} 
                  minimumOrder={product.minimum_order} 
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={toggleWishlist}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition ${
                    isWishlist 
                      ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100' 
                      : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                  }`}
                  aria-label="Add to wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlist ? 'fill-current' : ''}`} />
                </button>
                
                <ShareButtons productName={product.name} productId={product.id} />

                <button
                  onClick={addToCart}
                  disabled={!product.stock || product.stock <= 0}
                  className="flex-1 h-12 bg-green-600 hover:bg-green-700 disabled:bg-slate-200 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-md shadow-green-600/10"
                >
                  <ShoppingCart className="w-4 h-4" /> Masukkan Keranjang
                </button>
              </div>
            </div>

            {/* INFORMATION SELLER BOX */}
            <StoreInfoSection product={product} />

            {/* SHIPPING PROMO BANNER */}
            <div className="bg-gradient-to-r from-green-700 to-emerald-800 text-white rounded-2xl p-5 shadow-sm space-y-3">
              <h4 className="font-black text-sm flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-300" /> Layanan Logistik AgroHub
              </h4>
              <p className="text-xs text-emerald-100 leading-relaxed">
                {product.shipping_info || 'Pengiriman aman terintegrasi ke seluruh wilayah jangkauan dengan armada standar penanganan komoditas pangan hidup & segar.'}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-emerald-200 font-medium">
                <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-emerald-300" /> Tepat Waktu</div>
                <div className="flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5 text-emerald-300" /> Garansi Segar</div>
              </div>
            </div>

          </div>
        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">Produk Terkait Lainnya</h2>
              <Link href="/products" className="text-xs font-bold text-green-600 hover:text-green-700">Lihat Semua →</Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <Link 
                  href={`/products/${p.id}`} 
                  key={p.id}
                  className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group"
                >
                  <div className="aspect-square relative w-full bg-slate-100">
                    <Image 
                      src={p.image} 
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                      sizes="(max-w-md) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">{p.category}</span>
                      <h3 className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-2 group-hover:text-green-600 transition">{p.name}</h3>
                    </div>
                    <div className="space-y-1">
                      {p.old_price && (
                        <span className="line-through text-[10px] text-slate-400 block">{formatCurrency(p.old_price)}</span>
                      )}
                      <div className="font-black text-sm text-slate-900">{formatCurrency(p.price)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}