'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, X, Minus, Plus } from 'lucide-react';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value || 0);
};

// ======================================================
// NORMALIZE IMAGE FUNCTION
// ======================================================

const PLACEHOLDER_IMAGE = '/placeholder-product.png';

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

interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQuantity: (id: number, change: number) => void;
  removeFromCart: (id: number) => void;
}

export function CartSidebar({ isOpen, onClose, cart, updateQuantity, removeFromCart }: CartSidebarProps) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 20000;
  const total = subtotal + shipping;

  const getImageSrc = (item: CartItem) => {
    if (imageErrors[item.id]) return PLACEHOLDER_IMAGE;
    return normalizeImage(item.image);
  };

  const handleImageError = (itemId: number) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      
      const response = await api.post('/orders/create', {
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        })),
        shipping_cost: shipping,
        total_amount: total
      });
      
      if (response.data.success) {
        window.location.href = '/checkout';
      } else {
        alert(response.data.message || 'Gagal melanjutkan ke checkout');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Gagal melanjutkan ke checkout. Silakan coba lagi.');
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      )}
      
      <div className={`fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-green-700" />
              <h2 className="text-xl font-black text-slate-900">Keranjang Belanja</h2>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">{totalItems}</span>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Keranjang Kosong</h3>
                <p className="text-slate-500 text-sm">Yuk, belanja kebutuhan pertanian Anda!</p>
                <button onClick={onClose} className="mt-4 text-green-700 font-semibold hover:text-green-800 transition">
                  Mulai Belanja →
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl">
                  {/* Product Image */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-slate-200">
                    <Image 
                      src={getImageSrc(item)} 
                      alt={item.name} 
                      fill 
                      className="object-cover"
                      onError={() => handleImageError(item.id)}
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 line-clamp-2 text-sm">{item.name}</h3>
                    <p className="text-green-700 font-bold mt-1">{formatCurrency(item.price)}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 border border-slate-200 rounded-lg bg-white">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)} 
                          className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 transition rounded-l-lg"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)} 
                          className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 transition rounded-r-lg"
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="text-red-500 text-xs hover:text-red-600 transition"
                      >
                        Hapus
                      </button>
                    </div>
                    
                    {item.quantity >= item.stock && (
                      <p className="text-xs text-red-500 mt-1">Stok tersisa {item.stock}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Checkout */}
          {cart.length > 0 && (
            <div className="border-t border-slate-200 p-5 space-y-4 bg-white">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal ({totalItems} item)</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Ongkos Kirim</span>
                  <span className="font-semibold">{formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between text-lg font-black pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span className="text-green-700">{formatCurrency(total)}</span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="w-full h-12 bg-green-700 text-white font-bold rounded-xl hover:bg-green-800 transition"
              >
                Checkout Sekarang
              </button>
              
              <p className="text-xs text-slate-400 text-center">
                Pengiriman ke seluruh Indonesia • Pembayaran aman
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}