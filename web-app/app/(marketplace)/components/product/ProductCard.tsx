'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star } from 'lucide-react';

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

const PLACEHOLDER_PRODUCT = '/placeholder-product.png';

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
}

interface ProductCardProps {
  product: Product;
  type?: 'normal' | 'flash';
  isInWishlist: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ 
  product, 
  type = 'normal', 
  isInWishlist, 
  onToggleWishlist, 
  onAddToCart 
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const imageSrc = imageError ? PLACEHOLDER_PRODUCT : (product.image || PLACEHOLDER_PRODUCT);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-[190px] overflow-hidden bg-gray-100">
          <Image 
            src={imageSrc} 
            alt={product.name} 
            fill 
            className="object-cover group-hover:scale-105 transition duration-500" 
            onError={() => setImageError(true)}
          />
          {type === 'flash' && product.discount && product.discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-lg z-10">
              -{product.discount}%
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold">Habis</span>
            </div>
          )}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleWishlist(product);
            }} 
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition z-10"
          >
            <Heart className={`w-4 h-4 transition ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-slate-700'}`} />
          </button>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-bold text-slate-800 line-clamp-2 min-h-[48px] hover:text-green-700 transition">{product.name}</h3>
        </Link>
        <p className="text-xs text-slate-500 mt-1">{product.category}</p>
        <h4 className={`mt-3 text-[26px] font-black ${type === 'flash' ? 'text-red-500' : 'text-green-700'}`}>
          {formatCurrency(product.price)}
        </h4>
        {type === 'flash' && product.old_price && product.old_price > 0 && (
          <p className="text-sm line-through text-slate-400">{formatCurrency(product.old_price)}</p>
        )}
        <div className="mt-3 flex items-center gap-2 text-sm">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{product.rating || 4.5}</span>
          <span className="text-slate-400">• {formatNumber(product.sold || 0)} terjual</span>
        </div>
        <button 
          onClick={() => onAddToCart(product)} 
          disabled={product.stock === 0}
          className={`mt-4 w-full h-10 rounded-xl text-white text-sm font-semibold transition ${
            product.stock === 0 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-700 hover:bg-green-800'
          }`}
        >
          {product.stock === 0 ? 'Stok Habis' : '+ Keranjang'}
        </button>
      </div>
    </div>
  );
}