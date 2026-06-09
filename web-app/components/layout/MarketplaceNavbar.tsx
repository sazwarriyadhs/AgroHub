'use client';

import { Navbar } from '@/app/(marketplace)/components/overlays/Navbar';
import { useCartStore } from '@/app/(marketplace)/state/cart';
import { useWishlistStore } from '@/app/(marketplace)/state/wishlist';
import { useUserStore } from '@/app/(marketplace)/state/user';
import { useState } from 'react';

export default function MarketplaceNavbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { getTotalItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, logout } = useUserStore();

  const cartCount = getTotalItems();
  const wishlistCount = wishlistItems.length;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Navbar
      cartCount={cartCount}
      wishlistCount={wishlistCount}
      onCartClick={() => {}}
      onWishlistClick={() => {}}
      onProfileClick={() => setIsProfileOpen(!isProfileOpen)}
      isProfileOpen={isProfileOpen}
      user={user}
      onLogout={handleLogout}
      categories={[]}
    />
  );
}