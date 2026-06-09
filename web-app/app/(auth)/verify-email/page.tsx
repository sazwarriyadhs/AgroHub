'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    if (countdown > 0 && resendDisabled) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  const handleResend = async () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      setCountdown(60);
      setResendDisabled(true);
    }, 1500);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 text-center">
      <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Mail className="w-12 h-12 text-yellow-600" />
      </div>
      
      <h2 className="text-2xl font-black text-slate-900 mb-3">
        Verifikasi Email Anda
      </h2>
      
      <p className="text-slate-600 mb-6">
        Kami telah mengirimkan link verifikasi ke email Anda.
        Silakan cek inbox atau folder spam Anda.
      </p>

      <div className="bg-blue-50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <p className="text-sm text-blue-700 text-left">
            Setelah verifikasi, Anda akan bisa mengakses semua fitur AgroHub
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => router.push('/')}
          className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-green-200"
        >
          Lanjut ke Beranda
        </button>

        <button
          onClick={handleResend}
          disabled={resendDisabled || resending}
          className="w-full h-12 border border-green-600 text-green-600 font-bold rounded-xl hover:bg-green-50 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resending ? (
            <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              {resendDisabled ? `Kirim Ulang (${countdown}s)` : 'Kirim Ulang Email'}
            </>
          )}
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200">
        <p className="text-sm text-slate-500">
          Sudah verifikasi?{' '}
          <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold">
            Masuk Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
