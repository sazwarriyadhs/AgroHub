'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, X } from 'lucide-react';

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

interface WishlistItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
}

interface WishlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: WishlistItem[];
  removeFromWishlist: (id: number) => void;
  addToCart: (item: WishlistItem) => void;
}

export function WishlistSidebar({ isOpen, onClose, wishlist, removeFromWishlist, addToCart }: WishlistSidebarProps) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const getImageSrc = (item: WishlistItem) => {
    if (imageErrors[item.id]) return PLACEHOLDER_IMAGE;
    return normalizeImage(item.image);
  };

  const handleImageError = (itemId: number) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
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
              <Heart className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-black text-slate-900">Wishlist</h2>
              <span className="bg-red-100 text-red-500 px-2 py-1 rounded-full text-xs font-bold">{wishlist.length}</span>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Wishlist Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {wishlist.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Wishlist Kosong</h3>
                <p className="text-slate-500 text-sm">Simpan produk favorit Anda di sini!</p>
                <button onClick={onClose} className="mt-4 text-green-700 font-semibold hover:text-green-800 transition">
                  Jelajahi Produk →
                </button>
              </div>
            ) : (
              wishlist.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl group">
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
                    
                    {/* Rating */}
                    {item.rating > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-500 text-xs">★</span>
                        <span className="text-xs text-slate-600">{item.rating.toFixed(1)}</span>
                      </div>
                    )}
                    
                    {/* Category */}
                    {item.category && (
                      <p className="text-xs text-slate-400 mt-1">{item.category}</p>
                    )}
                    
                    <div className="flex gap-2 mt-3">
                      <button 
                        onClick={() => {
                          addToCart(item);
                          removeFromWishlist(item.id);
                        }}
                        className="flex-1 h-8 bg-green-700 text-white text-xs font-semibold rounded-lg hover:bg-green-800 transition"
                      >
                        + Keranjang
                      </button>
                      <button 
                        onClick={() => removeFromWishlist(item.id)}
                        className="px-3 h-8 border border-red-500 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-50 transition"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer - Rekomendasi */}
          {wishlist.length > 0 && (
            <div className="border-t border-slate-200 p-5 bg-white">
              <p className="text-xs text-slate-400 text-center">
                Tambahkan produk ke keranjang untuk melanjutkan pembelian
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}