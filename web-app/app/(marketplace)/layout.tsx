// app/(marketplace)/layout.tsx
import type { Metadata } from 'next';
import ShopFooter from '@/components/layout/ShopFooter';
import MarketplaceNavbar from '@/components/layout/MarketplaceNavbar';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'AgroHub Marketplace',
    template: '%s | AgroHub',
  },
  description: 'Belanja kebutuhan pertanian dengan harga terbaik dari supplier terpercaya',
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketplaceNavbar />
      <main className="flex-1">
        {children}
      </main>
      <ShopFooter />
    </div>
  );
}