// app/(marketplace)/components/store/StoreSection.tsx - Versi dengan gambar + fallback
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Store, Star, BadgeCheck } from 'lucide-react';

const PLACEHOLDER_STORE = '/placeholder-store.png';

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

interface StoreSectionProps {
  stores: Store[];
}

const getEcosystemBgColor = (type?: string) => {
  switch (type) {
    case 'FARMER': return 'bg-green-100';
    case 'AQUA': return 'bg-blue-100';
    case 'HERD': return 'bg-amber-100';
    case 'VENDOR': return 'bg-purple-100';
    default: return 'bg-green-100';
  }
};

const getEcosystemIconColor = (type?: string) => {
  switch (type) {
    case 'FARMER': return 'text-green-600';
    case 'AQUA': return 'text-blue-600';
    case 'HERD': return 'text-amber-600';
    case 'VENDOR': return 'text-purple-600';
    default: return 'text-green-600';
  }
};

export function StoreSection({ stores }: StoreSectionProps) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  if (!stores || stores.length === 0) {
    return (
      <section className="max-w-[1500px] mx-auto px-5 mt-12 mb-12">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Store className="w-7 h-7 text-green-600" />
            <h2 className="text-3xl font-black text-slate-900">Toko Unggulan</h2>
          </div>
          <Link href="/stores" className="text-green-700 font-bold hover:text-green-800 transition">
            Lihat Semua →
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Store className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Belum ada toko</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-[1500px] mx-auto px-5 mt-12 mb-12">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Store className="w-7 h-7 text-green-600" />
          <h2 className="text-3xl font-black text-slate-900">Toko Unggulan</h2>
        </div>
        <Link href="/stores" className="text-green-700 font-bold hover:text-green-800 transition">
          Lihat Semua →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stores.slice(0, 6).map((store) => {
          const hasImageError = imageErrors[store.id];
          const hasLogo = store.logo && store.logo !== '' && !hasImageError;
          
          return (
            <Link
              key={store.id}
              href={`/store/${store.id}`}
              className="group bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-xl hover:border-green-400 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                {/* Logo/Icon Toko */}
                <div className={`w-16 h-16 rounded-full ${getEcosystemBgColor(store.ecosystem_type)} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 overflow-hidden`}>
                  {hasLogo ? (
                    <Image
                      src={store.logo || PLACEHOLDER_STORE}
                      alt={store.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      onError={() => setImageErrors(prev => ({ ...prev, [store.id]: true }))}
                    />
                  ) : (
                    <Store className={`w-8 h-8 ${getEcosystemIconColor(store.ecosystem_type)}`} />
                  )}
                </div>
                
                {/* Info Toko */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-800 group-hover:text-green-700 transition line-clamp-1">
                      {store.name}
                    </h3>
                    {store.is_verified && (
                      <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{store.rating}</span>
                    <span className="text-xs text-slate-400">
                      ({store.products_count} produk)
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs">📍</span>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {store.location}
                    </p>
                  </div>
                  
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getEcosystemBgColor(store.ecosystem_type)} ${getEcosystemIconColor(store.ecosystem_type)}`}>
                      {store.ecosystem_type || 'STORE'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}