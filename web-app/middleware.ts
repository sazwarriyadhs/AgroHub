import { NextRequest, NextResponse } from 'next/server';

const ROLE_ROUTES: Record<string, string[]> = {
  customer: ['/dashboard', '/cart', '/checkout', '/orders', '/wallet', '/profile', '/wishlist'],
  buyer: ['/dashboard', '/cart', '/checkout', '/orders', '/wallet', '/profile', '/wishlist'],

  farmer: ['/farmer', '/farmer/products', '/profile', '/orders', '/wishlist'],
  livestock_farmer: ['/herd', '/profile', '/wishlist'],
  herd_manager: ['/herd', '/profile', '/wishlist'],
  aquaculture_farmer: ['/aqua', '/profile', '/wishlist'],
  aqua: ['/aqua', '/profile', '/wishlist'],
  
  vendor: ['/vendor', '/vendor/products', '/profile', '/orders', '/wishlist'],
  seller: ['/vendor', '/vendor/products', '/profile', '/orders', '/wishlist'],
  
  admin: ['/admin', '/dashboard', '/profile', '/wishlist', '/wallet'],
  super_admin: ['/admin', '/dashboard', '/profile', '/wishlist', '/wallet'],
  superadmin: ['/admin', '/dashboard', '/profile', '/wishlist', '/wallet'],
};

// ✅ Rute yang memerlukan autentikasi (Wajib Login)
const PROTECTED_ROUTES = [
  '/dashboard', '/cart', '/checkout', '/orders', '/wallet', 
  '/profile', '/wishlist', '/farmer', '/vendor', '/admin', '/herd', '/aqua'
];

// ✅ Rute publik (Bisa diakses tanpa login)
const PUBLIC_ROUTES = [
  '/', '/home',
  '/login', '/register', '/forgot-password', '/reset-password', '/verify-email',
  '/products', '/stores', '/categories', '/search', '/promo', '/compare', '/reviews',
  '/knowledge', '/articles', '/help', '/about', '/contact',
  '/terms', '/privacy', '/403', '/404',
  '/seller', '/download', '/mobile-only', '/test',
  // 🔥 TAMBAHKAN INI:
  '/admin/login',      // ← Halaman login admin
  '/admin/forgot-password', // ← Kalau ada
];

// ✅ Rute yang bisa diakses guest TANPA redirect ke login
const GUEST_ALLOWED = [
  '/products', '/stores', '/categories', '/search', '/promo',
  '/seller', '/download', '/knowledge', '/articles', '/help',
  '/about', '/contact', '/compare', '/reviews',
  '/admin/login',      // 🔥 Tambahkan juga di sini untuk berjaga-jaga
];

const PUBLIC_FILE = /\.(.*)$/;

const matchPath = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(route + '/'));

function normalizeRole(role?: string) {
  return String(role || '').trim().toLowerCase().replace(/\s+/g, '_');
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Skip static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/gambar') ||
    pathname.startsWith('/fonts') ||
    pathname === '/favicon.ico' ||
    pathname === '/manifest.json' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 🔥 PERHATIAN: Cek /admin/login harus diizinkan SEBELUM cek token
  // ✅ Cek apakah ini rute publik (LANGSUNG izinkan)
  if (matchPath(pathname, PUBLIC_ROUTES)) {
    return NextResponse.next();
  }

  // ✅ Cek apakah ini rute guest (LANGSUNG izinkan)
  if (matchPath(pathname, GUEST_ALLOWED)) {
    return NextResponse.next();
  }

  // Ambil token dari cookies
  const token = req.cookies.get('token')?.value || req.cookies.get('admin_token')?.value;
  const role = normalizeRole(req.cookies.get('user_role')?.value) || 'customer';

  // Jika TIDAK ada token dan mencoba akses rute terproteksi
  if (!token && matchPath(pathname, PROTECTED_ROUTES)) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname + search);
    return NextResponse.redirect(url);
  }

  // Jika TIDAK ada token dan bukan rute publik/guest/proteksi
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname + search);
    return NextResponse.redirect(url);
  }

  // Role-based access control (HANYA untuk yang sudah login)
  const allowed = ROLE_ROUTES[role] || ROLE_ROUTES.customer;
  
  if (!matchPath(pathname, allowed)) {
    const url = req.nextUrl.clone();
    url.pathname = '/403';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json).*)'],
};