'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Check, XCircle, Star } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  sold: number;
  stock: number;
  description: string;
}

export default function ComparePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Load products to compare from localStorage
    const saved = localStorage.getItem('compare');
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      // Sample data
      setProducts([
        {
          id: 1,
          name: "Pupuk Organik Premium",
          price: 180000,
          image: "/assets/logo/logo-agrohub.png",
          category: "Pupuk",
          rating: 4.8,
          sold: 1234,
          stock: 100,
          description: "Pupuk organik berkualitas tinggi untuk semua jenis tanaman"
        },
        {
          id: 2,
          name: "Pupuk NPK Mutiara",
          price: 250000,
          image: "/assets/logo/logo-agrohub.png",
          category: "Pupuk",
          rating: 4.9,
          sold: 1500,
          stock: 50,
          description: "Pupuk NPK dengan formula khusus untuk hasil maksimal"
        }
      ]);
    }
  }, []);

  const removeProduct = (id: number) => {
    const newProducts = products.filter(p => p.id !== id);
    setProducts(newProducts);
    localStorage.setItem('compare', JSON.stringify(newProducts));
  };

  if (products.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Tidak Ada Produk untuk Dibandingkan</h1>
        <p className="text-gray-500 mb-6">Tambahkan produk ke perbandingan dari halaman produk</p>
        <Link href="/products" className="bg-green-600 text-white px-6 py-2 rounded-lg">
          Lihat Produk
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-2xl font-bold mb-6">Bandingkan Produk</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left w-48">Spesifikasi</th>
              {products.map((product) => (
                <th key={product.id} className="p-4 text-center min-w-[250px]">
                  <div className="relative">
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-500 rounded-full hover:bg-red-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="relative h-40 bg-gray-100 rounded-lg mb-3">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-green-600 font-bold">Rp {product.price.toLocaleString()}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-4 font-medium">Kategori</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">{product.category}</td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-4 font-medium">Rating</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {product.rating}
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-4 font-medium">Terjual</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">{product.sold.toLocaleString()}</td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-4 font-medium">Stok</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  {product.stock > 0 ? (
                    <span className="text-green-600 flex items-center justify-center gap-1">
                      <Check className="w-4 h-4" /> Tersedia
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center justify-center gap-1">
                      <XCircle className="w-4 h-4" /> Habis
                    </span>
                  )}
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-4 font-medium">Deskripsi</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-sm">{product.description}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium">Aksi</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  <Link href={`/products/${product.id}`}>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                      Lihat Detail
                    </button>
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
