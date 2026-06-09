'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Heart,
  Lock,
  Truck,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  X,
  Leaf,
  User,
  Package,
  Store,
  Home,
  Gift,
  HelpCircle,
  FileText,
  Menu,
  Search,
  CreditCard,
  Wallet,
  Tag,
  Percent,
  CheckCircle
} from 'lucide-react';

// ======================================================
// CONFIG
// ======================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';
const TOKEN_KEY = 'token';

// ======================================================
// TYPES
// ======================================================

interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
  seller_name: string;
  seller_id: number;
  weight: number;
  is_selected: boolean;
}

interface CartSummary {
  subtotal: number;
  shipping_fee: number;
  discount: number;
  tax: number;
  total: number;
  item_count: number;
}

// ======================================================
// HELPER FUNCTIONS
// ======================================================

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);

// ======================================================
// MAIN CART PAGE
// ======================================================

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<CartSummary>({
    subtotal: 0,
    shipping_fee: 0,
    discount: 0,
    tax: 0,
    total: 0,
    item_count: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedAll, setSelectedAll] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // ======================================================
  // FETCH CART DATA
  // ======================================================

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        router.push('/login');
        return;
      }

      setLoading(true);
      
      // Coba fetch dari API
      try {
        const response = await axios.get(`${API_BASE_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success || response.data.data) {
          const data = response.data.data || response.data;
          const items = Array.isArray(data) ? data : data.items || [];
          
          setCartItems(items.map((item: any) => ({
            ...item,
            is_selected: item.is_selected !== false
          })));
          
          calculateSummary(items);
          setLoading(false);
          return;
        }
      } catch (apiError) {
        console.log('API not ready, using demo data');
      }

      // Demo data jika API belum siap
      const demoCart: CartItem[] = [
        {
          id: 1,
          product_id: 101,
          name: 'Beras Organik Premium 5kg',
          price: 75000,
          quantity: 2,
          image: '',
          stock: 50,
          seller_name: 'Tani Makmur',
          seller_id: 1,
          weight: 5000,
          is_selected: true
        },
        {
          id: 2,
          product_id: 102,
          name: 'Pupuk NPK Mutiara 1kg',
          price: 25000,
          quantity: 1,
          image: '',
          stock: 100,
          seller_name: 'Agro Sejahtera',
          seller_id: 2,
          weight: 1000,
          is_selected: true
        },
        {
          id: 3,
          product_id: 103,
          name: 'Bibit Cabai Rawit',
          price: 15000,
          quantity: 3,
          image: '',
          stock: 200,
          seller_name: 'Benih Unggul',
          seller_id: 3,
          weight: 100,
          is_selected: true
        }
      ];
      setCartItems(demoCart);
      calculateSummary(demoCart);
      
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Gagal memuat keranjang');
    } finally {
      setLoading(false);
    }
  };

  // Calculate cart summary
  const calculateSummary = (items: CartItem[]) => {
    const selectedItems = items.filter(item => item.is_selected);
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping_fee = subtotal > 100000 ? 0 : 20000;
    const discount = subtotal > 200000 ? subtotal * 0.05 : 0;
    const tax = subtotal * 0.01;
    const total = subtotal + shipping_fee - discount + tax;
    const item_count = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

    setSummary({
      subtotal,
      shipping_fee,
      discount,
      tax,
      total,
      item_count
    });
  };

  // Update quantity
  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const item = cartItems.find(i => i.id === itemId);
    if (item && newQuantity > item.stock) {
      toast.error(`Stok hanya tersedia ${item.stock} item`);
      return;
    }

    const updatedItems = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    calculateSummary(updatedItems);
  };

  // Toggle item selection
  const toggleSelectItem = (itemId: number) => {
    const updatedItems = cartItems.map(item =>
      item.id === itemId ? { ...item, is_selected: !item.is_selected } : item
    );
    setCartItems(updatedItems);
    calculateSummary(updatedItems);
    setSelectedAll(updatedItems.every(item => item.is_selected));
  };

  // Toggle select all
  const toggleSelectAll = () => {
    const newSelectedState = !selectedAll;
    const updatedItems = cartItems.map(item => ({ ...item, is_selected: newSelectedState }));
    setCartItems(updatedItems);
    setSelectedAll(newSelectedState);
    calculateSummary(updatedItems);
  };

  // Remove item from cart
  const removeItem = (itemId: number, productName: string) => {
    if (!confirm(`Hapus ${productName} dari keranjang?`)) return;
    
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    calculateSummary(updatedItems);
    toast.success('Item dihapus dari keranjang');
  };

  // Move to wishlist
  const moveToWishlist = (item: CartItem) => {
    toast.success(`${item.name} dipindahkan ke wishlist`);
    removeItem(item.id, item.name);
  };

  // Proceed to checkout
  const handleCheckout = () => {
    const selectedItems = cartItems.filter(item => item.is_selected);
    if (selectedItems.length === 0) {
      toast.error('Pilih minimal 1 produk untuk checkout');
      return;
    }
    router.push('/checkout');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Menu items untuk header
  const menuItems = [
    { label: 'Beranda', href: '/', icon: Home },
    { label: 'Produk', href: '/products', icon: Package },
    { label: 'Toko', href: '/stores', icon: Store },
    { label: 'Artikel', href: '/articles', icon: FileText },
    { label: 'Promo', href: '/promo', icon: Gift },
    { label: 'Bantuan', href: '/help', icon: HelpCircle },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Memuat keranjang...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header Navigation */}
     

      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-green-700 transition">
          <ChevronLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>

      {/* Page Title */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-black text-slate-900">Keranjang Belanja</h1>
            <p className="text-slate-500 text-sm">Kelola produk yang akan Anda beli</p>
          </div>
        </div>
      </div>

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {cartItems.length === 0 ? (
          // Empty Cart
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Keranjang Kosong</h2>
            <p className="text-slate-500 mb-6">Belum ada produk di keranjang belanja Anda</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Belanja Sekarang
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items Section */}
            <div className="flex-1">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
                {/* Select All Header */}
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAll}
                      onChange={toggleSelectAll}
                      className="w-5 h-5 rounded border-slate-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="font-semibold text-slate-700">Pilih Semua</span>
                    <span className="text-sm text-slate-400">
                      ({cartItems.length} produk)
                    </span>
                  </label>
                </div>

                {/* Cart Items List */}
                <div className="divide-y divide-slate-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-slate-50/50 transition">
                      <div className="flex gap-4">
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={item.is_selected}
                          onChange={() => toggleSelectItem(item.id)}
                          className="w-5 h-5 rounded border-slate-300 text-green-600 focus:ring-green-500 mt-6"
                        />

                        {/* Product Image */}
                        <div className="w-24 h-24 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={96}
                              height={96}
                              className="object-cover"
                            />
                          ) : (
                            <Package className="w-10 h-10 text-slate-400" />
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div>
                              <Link href={`/products/${item.product_id}`}>
                                <h3 className="font-semibold text-slate-800 hover:text-green-600 transition line-clamp-2">
                                  {item.name}
                                </h3>
                              </Link>
                              <div className="flex items-center gap-2 mt-1">
                                <Store className="w-3 h-3 text-slate-400" />
                                <span className="text-xs text-slate-500">{item.seller_name}</span>
                              </div>
                              <div className="mt-2">
                                <span className="text-lg font-bold text-green-700">
                                  {formatCurrency(item.price)}
                                </span>
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 rounded-lg border border-slate-200 hover:border-green-300 hover:bg-green-50 transition disabled:opacity-50"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4 text-slate-600" />
                              </button>
                              <span className="w-10 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 rounded-lg border border-slate-200 hover:border-green-300 hover:bg-green-50 transition"
                              >
                                <Plus className="w-4 h-4 text-slate-600" />
                              </button>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-3 mt-3">
                            <button
                              onClick={() => moveToWishlist(item)}
                              className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-500 transition"
                            >
                              <Heart className="w-3 h-3" />
                              Pindahkan ke Wishlist
                            </button>
                            <button
                              onClick={() => removeItem(item.id, item.name)}
                              className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-500 transition"
                            >
                              <Trash2 className="w-3 h-3" />
                              Hapus
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-right hidden sm:block">
                          <p className="font-bold text-green-700">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            Berat: {(item.weight * item.quantity) / 1000} kg
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="mt-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Lanjutkan Belanja
                </Link>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:w-96">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sticky top-24">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Ringkasan Belanja</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal ({summary.item_count} produk)</span>
                    <span className="font-semibold">{formatCurrency(summary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Ongkos Kirim</span>
                    <span className="font-semibold">
                      {summary.shipping_fee === 0 ? 'Gratis' : formatCurrency(summary.shipping_fee)}
                    </span>
                  </div>
                  {summary.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        Diskon
                      </span>
                      <span>-{formatCurrency(summary.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Pajak (1%)</span>
                    <span className="font-semibold">{formatCurrency(summary.tax)}</span>
                  </div>
                  
                  <div className="border-t border-slate-200 pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-green-700">{formatCurrency(summary.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mt-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Kode Promo"
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-green-400 focus:outline-none"
                    />
                    <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-200 transition">
                      Pakai
                    </button>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={summary.item_count === 0}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Checkout ({summary.item_count})
                </button>

                {/* Payment Methods */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400 text-center mb-2">Metode Pembayaran</p>
                  <div className="flex items-center justify-center gap-3">
                    <CreditCard className="w-5 h-5 text-slate-400" />
                    <Wallet className="w-5 h-5 text-slate-400" />
                    <ShieldCheck className="w-5 h-5 text-slate-400" />
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-start gap-2">
                    <Truck className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-blue-800">Informasi Pengiriman</p>
                      <p className="text-xs text-blue-600">
                        Minimal belanja Rp100.000 untuk gratis ongkir
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}