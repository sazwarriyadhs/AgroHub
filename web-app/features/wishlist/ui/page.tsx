'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ShoppingCart, Star } from 'lucide-react';

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  sold: number;
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      // Sample data
      setItems([
        {
          id: 1,
          name: "Pupuk Organik Premium",
          price: 180000,
          image: "/assets/logo/logo-agrohub.png",
          category: "Pupuk",
          rating: 4.8,
          sold: 1234
        },
        {
          id: 2,
          name: "Sensor Tanah IoT",
          price: 850000,
          image: "/assets/logo/logo-agrohub.png",
          category: "IoT",
          rating: 4.9,
          sold: 210
        }
      ]);
    }
    setLoading(false);
  }, []);

  const removeFromWishlist = (id: number) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    localStorage.setItem('wishlist', JSON.stringify(newItems));
  };

  const addToCart = (item: WishlistItem) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((i: any) => i.id === item.id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`${item.name} ditambahkan ke keranjang!`);
  };

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-8 h-8 text-red-500" />
        <h1 className="text-3xl font-bold">Wishlist Saya</h1>
        <span className="text-gray-500">({items.length} item)</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Wishlist Kosong</h2>
          <p className="text-gray-500 mb-6">Belum ada produk yang ditambahkan ke wishlist</p>
          <Link href="/products" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            Belanja Sekarang
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition bg-white">
              <Link href={`/products/${item.id}`}>
                <div className="relative h-48 bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
              <div className="p-4">
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  {item.category}
                </span>
                <Link href={`/products/${item.id}`}>
                  <h3 className="font-semibold mt-2 mb-1 hover:text-green-600">{item.name}</h3>
                </Link>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{item.rating}</span>
                  <span className="text-xs text-gray-400">| {item.sold} terjual</span>
                </div>
                <p className="text-green-600 font-bold text-lg">Rp {item.price.toLocaleString()}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => addToCart(item)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Keranjang
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="px-4 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
