// C:\taniapp\agrohub\web-app\next.config.js
/** @type {import('import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Local API
      {
        protocol: "http",
        hostname: "localhost",
        port: "8900",
        pathname: "/**",
      },
      // Local Next.js (untuk gambar di folder public)
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      // ✅ TAMBAHKAN PRAVATAR CC
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        pathname: "/**",
      },
      // Unsplash
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
      // Blogger CDN
      {
        protocol: "https",
        hostname: "blogger.googleusercontent.com",
        pathname: "/**",
      },
      // Krea AI
      {
        protocol: "https",
        hostname: "www.krea.ai",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "gen.krea.ai",
        pathname: "/**",
      },
      // Placeholder images
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      // Picsum Photos
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
        pathname: "/**",
      },
      // ✅ TAMBAHKAN UI AVATARS
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "/**",
      },
      // ✅ TAMBAHKAN CLOUDFLARE (opsional, untuk avatar alternatif)
      {
        protocol: "https",
        hostname: "*.cloudflare.com",
        pathname: "/**",
      },
    ],
    // Konfigurasi untuk gambar lokal di folder public
    unoptimized: false,
    // Format yang didukung
    formats: ['image/avif', 'image/webp'],
    // Minimum cache time (opsional)
    minimumCacheTTL: 60,
  },
};

module.exports = nextConfig;