'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useMemo, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  Download,
  Truck,
  ShieldCheck,
  Headphones,
  TrendingUp,
  Sparkles,
  Star,
  Users,
  ShoppingBag,
  QrCode,
  Store,
  Fish,
  Milk,
  Wheat,
  ShoppingCart,
  Menu,
  Home,
  FileText,
  HelpCircle,
  Smartphone,
  Apple,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  MapPin,
  Phone,
  CheckCircle,
  Leaf,
  LineChart,
  Heart,
  User,
} from 'lucide-react';

// ======================================================
// CONFIG (ENTERPRISE SAFE CONFIG LAYER)
// ======================================================

const CONFIG = {
  app: {
    name: 'AgroHub',
    version: '3.2.1',
    lastUpdate: '15 Januari 2026',
    size: '45 MB',
    logo: '/assets/logo/logo-agrohub.png',
  },
  statsKey: 'agrohub_download_count',
};

// ======================================================
// SIMPLE TOAST SYSTEM (NO LIB DEPENDENCY)
// ======================================================

function useToast() {
  const [message, setMessage] = useState<string | null>(null);

  const show = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  }, []);

  const Toast = () =>
    message ? (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-3 rounded-xl shadow-xl z-50 text-sm">
        {message}
      </div>
    ) : null;

  return { show, Toast };
}

// ======================================================
// NAVIGATION
// ======================================================

function NavigationMenu() {
  const [open, setOpen] = useState(false);

  const menu = useMemo(
    () => [
      { icon: Home, label: 'Beranda', href: '/' },
      { icon: ShoppingCart, label: 'Marketplace', href: '/products' },
      { icon: Store, label: 'Toko', href: '/stores' },
      { icon: FileText, label: 'Artikel', href: '/articles' },
      { icon: HelpCircle, label: 'Bantuan', href: '/help' },
    ],
    []
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Image
            src={CONFIG.app.logo}
            alt="logo"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="text-green-700">{CONFIG.app.name}</span>
        </Link>

        <div className="hidden md:flex gap-6 text-sm text-gray-600">
          {menu.map((m) => (
            <Link key={m.label} href={m.href} className="flex items-center gap-2 hover:text-green-700">
              <m.icon size={16} />
              {m.label}
            </Link>
          ))}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          <Menu />
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {menu.map((m) => (
            <Link key={m.label} href={m.href} className="flex gap-2 p-2 rounded hover:bg-green-50">
              <m.icon size={16} />
              {m.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

// ======================================================
// DOWNLOAD BUTTON
// ======================================================

function DownloadButton({
  platform,
  icon: Icon,
  onClick,
}: {
  platform: string;
  icon: any;
  onClick: () => void;
}) {
  const style =
    platform === 'android'
      ? 'bg-black'
      : platform === 'ios'
      ? 'bg-slate-800'
      : 'bg-green-700';

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-white ${style}`}
    >
      <Icon />
      <div className="text-left">
        <p className="text-xs opacity-70">Download</p>
        <p className="font-bold capitalize">{platform}</p>
      </div>
    </motion.button>
  );
}

// ======================================================
// FEATURE CARD
// ======================================================

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-5 rounded-2xl bg-white shadow border hover:shadow-lg transition">
      <Icon className="text-green-600 mb-3" />
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
}

// ======================================================
// MAIN PAGE
// ======================================================

export default function DownloadAppPage() {
  const { show, Toast } = useToast();
  const [count, setCount] = useState(0);
  const [qr, setQr] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(CONFIG.statsKey);
    setCount(saved ? Number(saved) : 0);
  }, []);

  const handleDownload = (platform: string) => {
    const newCount = count + 1;
    setCount(newCount);
    localStorage.setItem(CONFIG.statsKey, String(newCount));

    show(`Download ${platform} dimulai 🚀`);
  };

  const features = useMemo(
    () => [
      { icon: Truck, title: 'Smart Delivery', desc: 'Tracking real-time' },
      { icon: ShieldCheck, title: 'Escrow Payment', desc: 'Dana aman' },
      { icon: TrendingUp, title: 'Harga Transparan', desc: 'Tanpa middleman' },
      { icon: Headphones, title: 'Support 24/7', desc: 'Bantuan cepat' },
      { icon: Leaf, title: 'Sustainable', desc: 'Ramah lingkungan' },
      { icon: LineChart, title: 'Market Insight', desc: 'Data realtime' },
    ],
    []
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <NavigationMenu />
      <Toast />

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12">
        <div>
          <div className="inline-flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full text-sm mb-4">
            <Sparkles size={14} />
            v{CONFIG.app.version}
          </div>

          <h1 className="text-5xl font-black leading-tight">
            Semua Kebutuhan Pangan
            <span className="text-green-600"> dalam 1 App</span>
          </h1>

          <p className="mt-4 text-gray-600">
            Petani, vendor, dan konsumen terhubung tanpa batas.
          </p>

          <div className="flex gap-3 mt-6 flex-wrap">
            <DownloadButton platform="android" icon={Smartphone} onClick={() => handleDownload('android')} />
            <DownloadButton platform="ios" icon={Apple} onClick={() => handleDownload('ios')} />
            <DownloadButton platform="apk" icon={Download} onClick={() => handleDownload('apk')} />
          </div>

          <button
            onClick={() => setQr(!qr)}
            className="mt-4 text-green-600 text-sm flex items-center gap-2"
          >
            <QrCode size={16} /> QR Download
          </button>

          {qr && (
            <div className="mt-4 p-4 bg-white rounded-xl shadow inline-block">
              <QrCode size={120} />
            </div>
          )}

          <div className="mt-6 text-sm text-gray-500 flex gap-4">
            <span className="flex items-center gap-1">
              <CheckCircle size={14} /> Secure
            </span>
            <span>{count}+ downloads</span>
          </div>
        </div>

        {/* MOCKUP */}
        <div className="bg-black p-4 rounded-3xl">
          <div className="bg-white rounded-2xl p-4 space-y-3">
            {['Beras', 'Ikan', 'Susu', 'Sayur'].map((item) => (
              <div key={item} className="p-3 bg-green-50 rounded-xl">
                <p className="font-bold">{item}</p>
                <p className="text-xs text-gray-500">Live Market</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-black text-center mb-8">Enterprise Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* FOOTER MINI */}
      <footer className="text-center py-10 text-sm text-gray-500">
        © {CONFIG.app.version} {CONFIG.app.name}
      </footer>
    </main>
  );
}