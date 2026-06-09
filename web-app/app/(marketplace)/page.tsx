'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  TrendingUp, Flame, Sprout, Cpu, Warehouse, Tractor, 
  Droplets, Bug, Wheat, Store, Leaf, Fish, Trees, Factory,
  Syringe, Package, Shield, Cloud, Flower2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

// IMPORT
import { useCartStore } from './state/cart';
import { useWishlistStore } from './state/wishlist';
import { useUserStore } from './state/user';

// Import components
import { HeroSection } from './components/hero/HeroSection';
import { TrustSection } from './components/sections/TrustSection';
import { MarketSection } from './components/market/MarketSection';
import { StoreSection } from './components/store/StoreSection';
import { PromoBanner } from './components/promo/PromoBanner';
import { Footer } from './components/sections/Footer';
import { CountdownTimer } from './components/ui/CountdownTimer';
import { Navbar } from './components/overlays/Navbar';
import { CartSidebar } from './components/overlays/CartSidebar';
import { WishlistSidebar } from './components/overlays/WishlistSidebar';
import { ProductCard } from './components/product/ProductCard';

// ======================================================
// TYPES
// ======================================================

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  old_price?: number;
  sold: number;
  rating: number;
  image: string;
  stock: number;
  discount?: number;
  store_id?: number;
  store_name?: string;
  ecosystem_type?: 'FARMER' | 'AQUA' | 'HERD' | 'VENDOR' | null;
}

interface Store {
  id: number;
  name: string;
  rating: number;
  products_count: number;
  location: string;
  logo?: string;
  is_verified?: boolean;
  ecosystem_type?: string;
}

// ======================================================
// FALLBACK DATA (PASTI TAMPIL JIKA DB KOSONG)
// ======================================================

const DIRECT_PRODUCTS: Product[] = [
  {
    id: 444,
    name: 'Sapi Potong Simental 300kg',
    category: 'Sapi',
    price: 19500000,
    old_price: 25000000,
    sold: 60,
    rating: 4.9,
    image: '/gambar/simental.png',
    stock: 12,
    discount: 22,
    ecosystem_type: 'HERD'
  },
  {
    id: 445,
    name: 'Kambing Etawa Premium 35kg',
    category: 'Kambing',
    price: 3500000,
    sold: 140,
    rating: 4.8,
    image: '/gambar/etawa.png',
    stock: 35,
    ecosystem_type: 'HERD'
  },
  {
    id: 446,
    name: 'Ayam Broiler Organik 2kg',
    category: 'Ayam',
    price: 85000,
    sold: 980,
    rating: 4.7,
    image: '/gambar/Ayam_Broiler.png',
    stock: 500,
    ecosystem_type: 'HERD'
  },
  {
    id: 440,
    name: 'Bibit Lele Sangkuriang 100 Ekor',
    category: 'Perikanan',
    price: 45000,
    old_price: 60000,
    sold: 1500,
    rating: 4.8,
    image: '/gambar/bibitlele.png',
    stock: 1000,
    discount: 25,
    ecosystem_type: 'AQUA'
  },
  {
    id: 441,
    name: 'Pakan Ikan Protein 1kg',
    category: 'Pakan Ikan',
    price: 22000,
    sold: 2100,
    rating: 4.7,
    image: '/gambar/PakanIkanProtein.png',
    stock: 1200,
    ecosystem_type: 'AQUA'
  },
  {
    id: 436,
    name: 'Beras Organik Premium 5kg',
    category: 'Beras',
    price: 75000,
    sold: 1200,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a',
    stock: 400,
    ecosystem_type: 'FARMER'
  },
  {
    id: 437,
    name: 'Jagung Manis Fresh Farm 1kg',
    category: 'Jagung',
    price: 18000,
    sold: 980,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1601593768790-1f1f9b0b0c1f',
    stock: 600,
    ecosystem_type: 'FARMER'
  },
  {
    id: 438,
    name: 'Cabai Merah Grade A 1kg',
    category: 'Cabai',
    price: 35000,
    sold: 870,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38',
    stock: 500,
    ecosystem_type: 'FARMER'
  }
];

const DIRECT_STORES: Store[] = [
  {
    id: 7,
    name: 'AgroHub Aqua Store',
    rating: 4.7,
    products_count: 0,
    location: 'Medan, Sumatera Utara',
    logo: '/placeholder-store.png',
    is_verified: true,
    ecosystem_type: 'AQUA'
  },
  {
    id: 23,
    name: 'AgroHub Farmer Collective',
    rating: 4.9,
    products_count: 95,
    location: 'Yogyakarta, DI Yogyakarta',
    logo: '/placeholder-store.png',
    is_verified: true,
    ecosystem_type: 'FARMER'
  },
  {
    id: 24,
    name: 'AgroHub Aqua Network',
    rating: 4.8,
    products_count: 110,
    location: 'Sukabumi, Jawa Barat',
    logo: '/placeholder-store.png',
    is_verified: true,
    ecosystem_type: 'AQUA'
  },
  {
    id: 25,
    name: 'AgroHub Herd Center',
    rating: 4.9,
    products_count: 85,
    location: 'Malang, Jawa Timur',
    logo: '/placeholder-store.png',
    is_verified: true,
    ecosystem_type: 'HERD'
  },
  {
    id: 3,
    name: 'AgroHub Farmer Store',
    rating: 4.7,
    products_count: 0,
    location: 'Bogor, Jawa Barat',
    logo: '/placeholder-store.png',
    is_verified: true,
    ecosystem_type: 'FARMER'
  },
  {
    id: 19,
    name: 'AgroHub Vendor Store',
    rating: 4.8,
    products_count: 10,
    location: 'Bandung, Jawa Barat',
    logo: '/placeholder-store.png',
    is_verified: true,
    ecosystem_type: 'VENDOR'
  }
];

// ======================================================
// PRODUCT CATEGORIES (SINKRON DATA SLUG POSTGRES '-')
// ======================================================

const productCategories = [
  { value: "padi-beras", label: "Padi & Beras", icon: Wheat, count: 245 },
  { value: "sayuran", label: "Sayuran", icon: Leaf, count: 189 },
  { value: "buah", label: "Buah-buahan", icon: Flower2, count: 312 },
  { value: "pupuk", label: "Pupuk", icon: Sprout, count: 178 },
  { value: "bibit", label: "Bibit", icon: Leaf, count: 156 },
  { value: "pakan-ternak", label: "Pakan Ternak", icon: Wheat, count: 312 },
  { value: "ikan-air-tawar", label: "Ikan Air Tawar", icon: Fish, count: 178 },
  { value: "alat-tani", label: "Peralatan Tani", icon: Tractor, count: 156 },
  { value: "peternakan", label: "Peternakan", icon: Shield, count: 234 },
  { value: "perikanan", label: "Perikanan", icon: Fish, count: 267 },
  { value: "hidroponik", label: "Hidroponik", icon: Cloud, count: 143 },
  { value: "organik", label: "Organik", icon: Leaf, count: 98 },
  { value: "benih-ikan", label: "Benih Ikan", icon: Droplets, count: 76 },
  { value: "sapi", label: "Sapi", icon: Shield, count: 112 },
  { value: "kambing", label: "Kambing", icon: Shield, count: 134 },
  { value: "ayam", label: "Ayam", icon: Flame, count: 201 },
  { value: "pakan-ikan", label: "Pakan Ikan", icon: Fish, count: 289 },
  { value: "alat-irigasi", label: "Alat Irigasi", icon: Droplets, count: 167 },
  { value: "greenhouse", label: "Greenhouse", icon: Cloud, count: 223 },
  { value: "iot-farming", label: "IoT Farming", icon: Cpu, count: 54 }
];

// ======================================================
// CONFIG
// ======================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('id-ID').format(value || 0);
};

// ======================================================
// MAIN PAGE
// ======================================================

export default function MarketplacePage() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>(DIRECT_PRODUCTS);
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>(
    DIRECT_PRODUCTS.filter(p => p.discount && p.discount > 0).slice(0, 4)
  );
  const [stores, setStores] = useState<Store[]>(DIRECT_STORES);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const { 
    items: cartItems, 
    addItem: addToCartStore, 
    updateQuantityByChange, 
    removeItem: removeFromCartStore,
    getTotalItems,
    updateQuantity
  } = useCartStore();
  
  const { 
    items: wishlistItems, 
    addItem: addToWishlistStore, 
    removeByProductId,
    isInWishlist 
  } = useWishlistStore();
  
  const { user, isAuthenticated, fetchProfile, logout } = useUserStore();
  
  const cartCount = getTotalItems();
  const wishlistCount = wishlistItems.length;

  // FETCH DATA DARI API BACKEND REALS
  useEffect(() => {
    async function loadInitialData() {
      try {
        const response = await api.get('/public/products');
        if (response.data && response.data.success && response.data.data.length > 0) {
          setProducts(response.data.data);
          // Set flash sale secara dinamis dari database yang memiliki diskon
          const flashSales = response.data.data.filter((p: Product) => p.discount && p.discount > 0);
          if (flashSales.length > 0) {
            setFlashSaleProducts(flashSales.slice(0, 4));
          }
        }
      } catch (err) {
        console.warn("Backend API /public/products unreachable. Menggunakan data lokal.", err);
      }
    }
    loadInitialData();
  }, []);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile();
    }
  }, [fetchProfile]);
  
  const handleAddToCart = useCallback(async (product: Product) => {
    if (product.stock <= 0) {
      toast.error('Maaf, stok produk ini habis');
      return;
    }
    
    addToCartStore({
      id: Date.now(),
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      stock: product.stock
    });
    
    if (isAuthenticated) {
      try {
        const token = localStorage.getItem('token');
        await api.post('/cart/add', 
          { product_id: product.id, quantity: 1 },
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
      } catch (error) {
        console.error('Failed to add to cart:', error);
      }
    }
    
    toast.success(`${product.name} ditambahkan ke keranjang`);
  }, [addToCartStore, isAuthenticated]);
  
  const handleToggleWishlist = useCallback(async (product: Product) => {
    if (isInWishlist(product.id)) {
      removeByProductId(product.id);
      toast.success(`${product.name} dihapus dari wishlist`);
    } else {
      addToWishlistStore({
        id: Date.now(),
        product_id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        rating: product.rating
      });

      if (isAuthenticated) {
        try {
          const token = localStorage.getItem('token');
          await api.post('/wishlist/add', 
            { product_id: product.id },
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
        } catch (error) {
          console.error('Failed to sync wishlist to backend:', error);
        }
      }
      toast.success(`${product.name} ditambahkan ke wishlist`);
    }
  }, [isInWishlist, removeByProductId, addToWishlistStore, isAuthenticated]);
  
  const handleUpdateQuantity = useCallback((id: number, change: number) => {
    updateQuantityByChange(id, change);
  }, [updateQuantityByChange]);
  
  const handleRemoveFromCart = useCallback((id: number) => {
    removeFromCartStore(id);
    toast.success('Item dihapus dari keranjang');
  }, [removeFromCartStore]);
  
  const handleLogout = useCallback(async () => {
    await logout();
    toast.success('Anda telah logout');
  }, [logout]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Memuat AgroHub...</p>
        </div>
      </div>
    );
  }
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Navbar 
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
        onProfileClick={() => setIsProfileOpen(!isProfileOpen)}
        isProfileOpen={isProfileOpen}
        user={user}
        onLogout={handleLogout}
        categories={productCategories}
      />
      
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cartItems} 
        updateQuantity={updateQuantity || handleUpdateQuantity} 
        removeFromCart={handleRemoveFromCart} 
      />
      
      <WishlistSidebar 
        isOpen={isWishlistOpen} 
        onClose={() => setIsWishlistOpen(false)} 
        wishlist={wishlistItems} 
        removeFromWishlist={useWishlistStore.getState().removeItem} 
        addToCart={(item) => {
          const product: Product = {
            id: item.product_id,
            name: item.name,
            price: item.price,
            image: item.image,
            category: item.category,
            rating: item.rating,
            sold: 0,
            stock: 99,
            ecosystem_type: null
          };
          handleAddToCart(product);
        }} 
      />
      
      <HeroSection />
      <TrustSection />
      <MarketSection ricePrice={0} cornPrice={0} />
      
      {/* KATEGORI POPULER */}
      <section className="max-w-[1500px] mx-auto px-5 mt-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900">Kategori Populer</h2>
          <p className="text-slate-500 mt-2">Temukan kebutuhan pertanian Anda berdasarkan kategori</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {productCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.value}
                href={`/products?category=${category.value}`}
                className="group"
              >
                <div className="bg-white rounded-2xl p-4 text-center border border-slate-200 hover:shadow-lg hover:border-green-400 transition-all duration-300">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <IconComponent className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-sm text-slate-700 group-hover:text-green-700 transition-colors">
                    {category.label}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{formatNumber(category.count)} produk</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      
      {/* PRODUK TERLARIS */}
      <section className="max-w-[1500px] mx-auto px-5 mt-12">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-yellow-500" />
            <h2 className="text-3xl font-black text-slate-900">Produk Terlaris</h2>
          </div>
          <Link href="/products?sort=popular" className="text-green-700 font-bold hover:text-green-800 transition">
            Lihat Semua →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              type="normal"
              isInWishlist={isInWishlist(product.id)}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>
      
      {/* FLASH SALE */}
      {flashSaleProducts.length > 0 && (
        <section className="max-w-[1500px] mx-auto px-5 mt-12">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Flame className="w-7 h-7 text-red-500" />
              <div>
                <h2 className="text-3xl font-black text-slate-900">Flash Sale</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-slate-500">Berakhir dalam</span>
                  <CountdownTimer />
                </div>
              </div>
            </div>
            <Link href="/products?flash_sale=true" className="text-green-700 font-bold hover:text-green-800 transition">
              Lihat Semua →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {flashSaleProducts.slice(0, 4).map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                type="flash"
                isInWishlist={isInWishlist(product.id)}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>
      )}
      
      {/* TOKO UNGGULAN */}
      <StoreSection stores={stores} />
      
      <PromoBanner />
      <Footer />
    </main>
  );
}