'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ThumbsUp, Flag, MoreHorizontal } from 'lucide-react';

interface Review {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
  images?: string[];
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      productId: 1,
      productName: "Pupuk Organik Premium",
      productImage: "/assets/logo/logo-agrohub.png",
      userName: "Budi Petani",
      userAvatar: "",
      rating: 5,
      comment: "Produk sangat bagus, tanaman saya jadi subur! Pengiriman cepat. Recommended!",
      date: "2026-05-20",
      likes: 12
    },
    {
      id: 2,
      productId: 2,
      productName: "Sensor Tanah IoT",
      productImage: "/assets/logo/logo-agrohub.png",
      userName: "Susi Modern",
      userAvatar: "",
      rating: 4,
      comment: "Sensor akurat, aplikasi mudah digunakan. Harga sesuai dengan kualitas.",
      date: "2026-05-18",
      likes: 8
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'withPhoto' | 'highest'>('all');

  const filteredReviews = reviews.filter(review => {
    if (filter === 'withPhoto') return review.images && review.images.length > 0;
    return true;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (filter === 'highest') return b.rating - a.rating;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleLike = (id: number) => {
    setReviews(reviews.map(review =>
      review.id === id ? { ...review, likes: review.likes + 1 } : review
    ));
  };

  return (
    <div className="container-custom py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Ulasan Produk</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilter('withPhoto')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'withPhoto' ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Dengan Foto
          </button>
          <button
            onClick={() => setFilter('highest')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'highest' ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Rating Tertinggi
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {sortedReviews.map((review) => (
          <div key={review.id} className="border rounded-xl p-6 bg-white">
            <div className="flex items-start gap-4">
              {/* Product Image */}
              <Link href={`/products/${review.productId}`}>
                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={review.productImage}
                    alt={review.productName}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>

              {/* Review Content */}
              <div className="flex-1">
                <Link href={`/products/${review.productId}`}>
                  <h3 className="font-semibold hover:text-green-600">{review.productName}</h3>
                </Link>
                
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">• {review.date}</span>
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {review.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{review.userName}</p>
                    <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                  </div>
                </div>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {review.images.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden">
                        <Image src={img} alt={`Review ${idx + 1}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => handleLike(review.id)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 transition"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{review.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition">
                    <Flag className="w-4 h-4" />
                    <span>Laporkan</span>
                  </button>
                </div>
              </div>

              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-16">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Belum ada ulasan</p>
        </div>
      )}
    </div>
  );
}
