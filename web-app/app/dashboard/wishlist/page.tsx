'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Trash2, ShoppingCart, ArrowLeft, Star } from 'lucide-react';

interface WishlistItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  rating: number;
  sold: number;
  image_url: string;
  seller_name: string;
}

export default function WishlistPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchWishlist();
  }, [router]);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8900/api/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.items || []);
      } else {
        // Fallback mock data
        const mockWishlist = [
          {
            id: 1,
            product_id: 1,
            name: "Pupuk Organik Premium",
            price: 150000,
            rating: 4.8,
            sold: 1234,
            image_url: "https://placehold.co/400x400/22c55e/white?text=Pupuk",
            seller_name: "CV Tani Makmur"
          },
          {
            id: 2,
            product_id: 3,
            name: "Sprayer Elektrik",
            price: 650000,
            rating: 4.9,
            sold: 430,
            image_url: "https://placehold.co/400x400/22c55e/white?text=Sprayer",
            seller_name: "Alat Pertanian Modern"
          }
        ];
        setWishlistItems(mockWishlist);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:8900/api/wishlist/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setWishlistItems(wishlistItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const addToCart = async (product_id: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8900/api/cart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product_id, quantity: 1 })
      });
      
      if (response.ok) {
        alert('Produk ditambahkan ke keranjang!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/seller" className="text-green-600 hover:text-green-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Wishlist</h1>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-2xl border p-12 text-center">
            <Heart className="w-20 h-20 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Wishlist Kosong</h2>
            <p className="text-gray-500 mb-6">Belum ada produk yang Anda tandai</p>
            <Link href="/product" className="bg-green-600 text-white px-6 py-3 rounded-lg inline-block hover:bg-green-700">
              Jelajahi Produk
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition group">
                <div className="relative h-48 bg-gray-100">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">Produk</span>
                  </div>
                  <Link href={`/product/${item.product_id}`}>
                    <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1 hover:text-green-600">{item.name}</h3>
                  </Link>
                  <p className="text-gray-500 text-sm">{item.seller_name}</p>
                  <p className="text-green-600 font-bold text-lg mt-2">{formatCurrency(item.price)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{item.rating}</span>
                    <span className="text-xs text-gray-400">| {item.sold.toLocaleString()} terjual</span>
                  </div>
                  <button
                    onClick={() => addToCart(item.product_id)}
                    className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Tambah ke Keranjang
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

