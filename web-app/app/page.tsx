// app/page.tsx - FULLY FIXED
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';

// ✅ Metadata untuk SEO
export const metadata: Metadata = {
  title: 'AgroHub - Marketplace Pertanian Modern Indonesia',
  description: 'Belanja kebutuhan pertanian, pupuk, benih unggul, alat pertanian, dan perlengkapan petani terpercaya. Harga kompetitif, pengiriman cepat, aman & terpercaya.',
  keywords: 'marketplace pertanian, pupuk organik, benih padi, alat pertanian, petani indonesia',
  openGraph: {
    title: 'AgroHub - Marketplace Pertanian Modern',
    description: 'Solusi belanja kebutuhan pertanian lebih mudah dan murah',
    images: ['/logo-agrohub.png'],
  },
};

// ✅ Loading component
function MarketplaceLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Memuat AgroHub...</p>
      </div>
    </div>
  );
}

// ✅ Dynamic import dengan loading state (optional, untuk performance)
const MarketplacePage = dynamic(
  () => import('./(marketplace)/page').then(mod => mod.default),
  {
    loading: () => <MarketplaceLoading />,
    ssr: true, // Enable SSR for better SEO
  }
);

export default function Home() {
  return (
    <Suspense fallback={<MarketplaceLoading />}>
      <MarketplacePage />
    </Suspense>
  );
}