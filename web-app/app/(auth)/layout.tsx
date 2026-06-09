// app/(auth)/layout.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import {
  ShieldCheck,
  Truck,
  Headphones,
  ArrowLeft,
} from 'lucide-react';

const LOGO = '/assets/logo/logo-agrohub.png';

const pageConfig = {
  login: {
    title: 'Masuk ke AgroHub',
    subtitle:
      'Belanja kebutuhan pertanian dengan mudah dan aman',
  },

  register: {
    title: 'Daftar Akun Baru',
    subtitle:
      'Mulai perjalanan belanja cerdas Anda',
  },

  vendor: {
    title: 'Daftar sebagai Penjual',
    subtitle:
      'Bergabunglah sebagai seller dan jangkau lebih banyak petani',
  },

  forgot: {
    title: 'Lupa Password',
    subtitle:
      'Tenang, kami akan bantu reset password Anda',
  },

  reset: {
    title: 'Reset Password',
    subtitle:
      'Buat password baru untuk akun Anda',
  },

  verify: {
    title: 'Verifikasi Email',
    subtitle:
      'Konfirmasi email Anda untuk mengaktifkan akun',
  },

  default: {
    title: 'AgroHub',
    subtitle:
      'Solusi pertanian modern untuk Indonesia',
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const config =
    pathname?.includes('login')
      ? pageConfig.login
      : pathname?.includes('register/vendor')
      ? pageConfig.vendor
      : pathname?.includes('register')
      ? pageConfig.register
      : pathname?.includes('forgot-password')
      ? pageConfig.forgot
      : pathname?.includes('reset-password')
      ? pageConfig.reset
      : pathname?.includes('verify-email')
      ? pageConfig.verify
      : pageConfig.default;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50">

      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-900 text-white p-14 flex-col justify-between">

          {/* DECORATION */}
          <div className="absolute top-10 right-10 text-[220px] opacity-[0.03] select-none">
            🌾
          </div>

          <div className="absolute bottom-0 left-0 text-[180px] opacity-[0.03] select-none">
            🌱
          </div>

          {/* BRAND */}
          <div className="relative z-10">

            <Link
              href="/"
              className="flex items-center gap-3 mb-20"
            >
              <div className="relative w-12 h-12">
                <Image
                  src={LOGO}
                  alt="AgroHub"
                  fill
                  className="object-contain brightness-0 invert"
                  priority
                />
              </div>

              <div>
                <h1 className="text-3xl font-black">
                  AgroHub
                </h1>

                <p className="text-sm text-green-200">
                  Smart Agriculture Ecosystem
                </p>
              </div>
            </Link>

            <div className="max-w-xl">
              <h2 className="text-5xl font-black leading-tight">
                {config.title}
              </h2>

              <p className="mt-6 text-lg text-green-100 leading-relaxed">
                {config.subtitle}
              </p>
            </div>
          </div>

          {/* FEATURES */}
          <div className="relative z-10 grid gap-5 max-w-md">

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>

              <div>
                <h3 className="font-semibold">
                  Transaksi Aman
                </h3>

                <p className="text-sm text-green-200">
                  Escrow & seller verification
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>

              <div>
                <h3 className="font-semibold">
                  Pengiriman Nasional
                </h3>

                <p className="text-sm text-green-200">
                  Cepat & terjangkau
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center">
                <Headphones className="w-5 h-5" />
              </div>

              <div>
                <h3 className="font-semibold">
                  Support 24/7
                </h3>

                <p className="text-sm text-green-200">
                  Tim AgroHub siap membantu
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10">

          <div className="w-full max-w-md">

            {/* MOBILE */}
            <div className="lg:hidden text-center mb-8">

              <div className="relative w-16 h-16 mx-auto">
                <Image
                  src={LOGO}
                  alt="AgroHub"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <h2 className="mt-5 text-3xl font-black text-slate-900">
                {config.title}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {config.subtitle}
              </p>
            </div>

            {/* BACK */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-green-700 transition mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Beranda
            </Link>

            {/* FORM */}
            {children}

          </div>
        </div>
      </div>
    </div>
  );
}