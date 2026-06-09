'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import {
  Smartphone,
  Store,
  Package,
  FileText,
  ClipboardCheck,
  CheckCircle2,
  ArrowRight,
  Fish,
  Tractor,
  Shield,
  Warehouse,
  AlertTriangle,
  Download,
  ChevronRight,
  Clock,
  Camera,
  Tag,
  DollarSign,
  Award,
  Sparkles,
  HelpCircle,
  MessageCircle,
  Headphones,
} from 'lucide-react';

// ======================================================
// TYPES
// ======================================================

interface Step {
  number: number;
  title: string;
  desc: string;
  icon: any;
  extra?: string;
  examples?: string[];
  tips?: string[];
}

interface Ecosystem {
  id: string;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  description: string;
  downloadLink: string;
}

// ======================================================
// DATA
// ======================================================

const steps: Step[] = [
  {
    number: 1,
    title: 'Pilih Jenis Toko',
    desc: 'Pilih ecosystem toko sesuai dengan jenis usaha Anda',
    icon: Store,
    examples: ['Farmer', 'Aqua', 'Herd', 'Vendor'],
    tips: ['Pilih yang paling sesuai dengan produk Anda', 'Bisa mengganti ecosystem nanti dengan menghubungi support'],
  },
  {
    number: 2,
    title: 'Pilih Kategori Produk',
    desc: 'Pastikan kategori sesuai agar produk mudah ditemukan pembeli',
    icon: Package,
    tips: ['Pilih kategori yang paling spesifik', 'Produk dengan kategori tepat 2x lebih cepat laku'],
  },
  {
    number: 3,
    title: 'Tulis Judul Produk',
    desc: 'Gunakan judul yang jelas, informatif, dan mudah dipahami',
    extra: 'Maksimal 120 karakter',
    icon: FileText,
    tips: ['Sertakan merek jika ada', 'Cantumkan ukuran/berat', 'Hindari kata-kata clickbait'],
  },
  {
    number: 4,
    title: 'Upload Foto Produk',
    desc: 'Foto berkualitas tinggi meningkatkan kepercayaan pembeli',
    extra: 'Minimal 3 foto, maksimal 10 foto',
    icon: Camera,
    tips: ['Gunakan latar putih/polos', 'Foto dari berbagai sudut', 'Sertakan foto produk dengan skala'],
  },
  {
    number: 5,
    title: 'Isi Deskripsi Produk',
    desc: 'Lengkapi spesifikasi produk secara detail',
    extra: 'Berat, ukuran, volume, satuan, kualitas, dll',
    icon: ClipboardCheck,
    tips: ['Sebutkan keunggulan produk', 'Cantumkan cara penyimpanan', 'Informasikan garansi jika ada'],
  },
  {
    number: 6,
    title: 'Tentukan Harga',
    desc: 'Pasang harga yang kompetitif dengan mempertimbangkan biaya',
    icon: DollarSign,
    tips: ['Cek harga pasar terlebih dahulu', 'Sediakan diskon untuk pembelian grosir', 'Jangan lupa hitung ongkir'],
  },
  {
    number: 7,
    title: 'Submit Verifikasi',
    desc: 'Produk akan diperiksa oleh sistem otomatis & tim verifikator',
    icon: CheckCircle2,
    tips: ['Proses verifikasi 1x24 jam', 'Cek notifikasi untuk hasil verifikasi', 'Produk bisa diedit jika ditolak'],
  },
  {
    number: 8,
    title: 'Tampil di Marketplace',
    desc: 'Produk disetujui dan langsung muncul di marketplace AgroHub',
    icon: ArrowRight,
    tips: ['Promosikan produk ke media sosial', 'Pantau performa produk di dashboard', 'Respons cepat chat pembeli'],
  },
];

const ecosystems: Ecosystem[] = [
  {
    id: 'farmer',
    name: 'Farmer App',
    icon: Tractor,
    color: 'green',
    bgColor: 'bg-green-100',
    description: 'Untuk petani dan produsen hasil pertanian',
    downloadLink: '/download/farmer',
  },
  {
    id: 'aqua',
    name: 'Aqua App',
    icon: Fish,
    color: 'blue',
    bgColor: 'bg-blue-100',
    description: 'Untuk pebudidaya ikan dan produk perikanan',
    downloadLink: '/download/aqua',
  },
  {
    id: 'herd',
    name: 'Herd App',
    icon: Shield,
    color: 'purple',
    bgColor: 'bg-purple-100',
    description: 'Untuk peternak dan produk peternakan',
    downloadLink: '/download/herd',
  },
  {
    id: 'vendor',
    name: 'Vendor App',
    icon: Warehouse,
    color: 'orange',
    bgColor: 'bg-orange-100',
    description: 'Untuk supplier dan distributor pertanian',
    downloadLink: '/download/vendor',
  },
];

const faqs = [
  {
    question: 'Berapa lama proses verifikasi produk?',
    answer: 'Proses verifikasi biasanya memakan waktu 1x24 jam kerja. Anda akan mendapat notifikasi melalui email dan aplikasi.',
  },
  {
    question: 'Bisa edit produk setelah submit?',
    answer: 'Bisa. Selama produk belum diverifikasi, Anda bisa edit. Setelah diverifikasi, tetap bisa edit tetapi akan masuk antrian verifikasi ulang.',
  },
  {
    question: 'Kenapa produk saya ditolak?',
    answer: 'Produk bisa ditolak karena: foto kurang jelas, deskripsi tidak lengkap, kategori salah, atau produk dilarang. Cek email untuk detail penolakan.',
  },
  {
    question: 'Apakah ada biaya upload produk?',
    answer: 'Upload produk GRATIS! AgroHub tidak memungut biaya untuk listing produk. Kami hanya mengambil komisi kecil saat produk terjual.',
  },
];

// ======================================================
// COMPONENTS
// ======================================================

function Badge({ icon: Icon, text, color = 'green' }: { icon: any; text: string; color?: string }) {
  const colorClasses: Record<string, string> = {
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700',
  };
  
  return (
    <div className={`px-4 py-2 rounded-full ${colorClasses[color]} flex items-center gap-2 font-medium`}>
      <Icon className="w-4 h-4" />
      {text}
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-slate-50 transition"
      >
        <span className="font-semibold text-slate-800">{question}</span>
        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-5 pt-0 text-slate-600 border-t border-slate-100 bg-slate-50/50">
          {answer}
        </div>
      )}
    </div>
  );
}

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'faq'>('upload');

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-r from-green-700 to-emerald-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-green-500/30 rounded-full blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-emerald-500/30 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Panduan Seller
            </div>
            <h1 className="text-5xl lg:text-6xl font-black leading-tight">
              Cara Upload Produk ke <span className="text-yellow-300">Marketplace AgroHub</span>
            </h1>
            <p className="mt-6 text-green-100 text-lg max-w-2xl">
              Upload produk dilakukan melalui aplikasi mobile ecosystem 
              agar verifikasi lebih aman, cepat, dan terintegrasi.
            </p>
            <div className="flex gap-4 mt-8">
              <Link
                href="/download"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 font-bold rounded-xl hover:bg-gray-100 transition shadow-lg"
              >
                <Download className="w-5 h-5" />
                Download Apps
              </Link>
              <Link
                href="/help"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition"
              >
                <HelpCircle className="w-5 h-5" />
                Bantuan
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* MOBILE ONLY SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl hover:shadow-2xl transition">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center shrink-0">
              <Smartphone className="w-8 h-8 text-green-700" />
            </div>
            <div className="flex-1">
              <h2 className="font-black text-2xl text-slate-800">
                Upload Produk Hanya di Mobile Apps
              </h2>
              <p className="text-slate-600 mt-2 max-w-2xl">
                Untuk menjaga kualitas marketplace dan keamanan data, upload produk 
                hanya dapat dilakukan melalui aplikasi mobile ecosystem masing-masing.
              </p>
              <div className="flex flex-wrap gap-3 mt-5">
                {ecosystems.map((eco) => (
                  <Badge 
                    key={eco.id} 
                    icon={eco.icon} 
                    text={eco.name} 
                    color={eco.color}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TABS NAVIGATION */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'upload'
                ? 'text-green-700 border-b-2 border-green-700'
                : 'text-slate-500 hover:text-green-600'
            }`}
          >
            📤 Panduan Upload
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'faq'
                ? 'text-green-700 border-b-2 border-green-700'
                : 'text-slate-500 hover:text-green-600'
            }`}
          >
            ❓ FAQ & Tips
          </button>
        </div>
      </div>

      {/* UPLOAD STEPS SECTION */}
      {activeTab === 'upload' && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-800">Langkah Upload Produk</h2>
            <p className="text-slate-500 mt-2">Ikuti panduan berikut untuk sukses menjual di AgroHub</p>
          </div>
          
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl transition group">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition">
                        <Icon className="w-7 h-7 text-green-700" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {step.number}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-lg text-slate-800">{step.title}</h3>
                      <p className="mt-2 text-slate-600 text-sm">{step.desc}</p>
                      
                      {step.extra && (
                        <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-lg">
                          <Clock className="w-3 h-3" />
                          {step.extra}
                        </div>
                      )}
                      
                      {step.examples && (
                        <div className="mt-3 flex gap-1 flex-wrap">
                          {step.examples.map((item) => (
                            <span
                              key={item}
                              className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {step.tips && (
                        <details className="mt-3">
                          <summary className="text-xs text-green-600 cursor-pointer hover:text-green-700">
                            💡 Tips
                          </summary>
                          <ul className="mt-2 space-y-1 text-xs text-slate-500 pl-4">
                            {step.tips.map((tip, i) => (
                              <li key={i} className="list-disc">• {tip}</li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* FAQ SECTION */}
      {activeTab === 'faq' && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* FAQ List */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-black text-slate-800 mb-6">
                Pertanyaan Umum
              </h2>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <FAQItem key={idx} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>
            
            {/* Tips Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-6 h-6 text-green-600" />
                  <h3 className="font-bold text-slate-800">Tips Sukses Jualan</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Respons cepat terhadap chat pembeli</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Update stok secara rutin</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Berikan foto produk berkualitas</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Ikuti promo dan event marketplace</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Jaga rating dan ulasan positif</span>
                  </li>
                </ul>
                
                <div className="mt-6 pt-4 border-t border-green-200">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Headphones className="w-4 h-4 text-green-600" />
                    <span>Butuh bantuan?</span>
                  </div>
                  <Link
                    href="/help"
                    className="inline-flex items-center gap-1 mt-2 text-green-700 font-semibold text-sm hover:text-green-800"
                  >
                    Hubungi Support
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* RULES SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-3xl p-8">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
              <AlertTriangle className="w-7 h-7 text-amber-600" />
            </div>
            <div>
              <h2 className="font-black text-2xl text-slate-800">Aturan & Ketentuan Verifikasi Produk</h2>
              <p className="text-slate-600 mt-2">Pastikan produk Anda memenuhi kriteria berikut agar cepat disetujui:</p>
              <div className="grid sm:grid-cols-2 gap-3 mt-5">
                <ul className="space-y-2 text-slate-700 text-sm">
                  <li className="flex items-center gap-2">✓ Minimal 3 foto produk</li>
                  <li className="flex items-center gap-2">✓ Judul maksimal 120 karakter</li>
                  <li className="flex items-center gap-2">✓ Deskripsi wajib lengkap & informatif</li>
                  <li className="flex items-center gap-2">✓ Harga harus sesuai kategori</li>
                </ul>
                <ul className="space-y-2 text-slate-700 text-sm">
                  <li className="flex items-center gap-2">✓ Stok produk harus jelas</li>
                  <li className="flex items-center gap-2">✓ Produk dilarang: ilegal, kadaluarsa, palsu</li>
                  <li className="flex items-center gap-2">✓ Produk akan diverifikasi sebelum tayang</li>
                  <li className="flex items-center gap-2">✓ Verifikasi dilakukan 1x24 jam</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="relative rounded-3xl bg-gradient-to-r from-green-800 to-emerald-700 text-white p-10 text-center overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-green-500/20 rounded-full blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
          
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              Mulai Berjualan
            </div>
            <h2 className="text-4xl font-black">Siap Upload Produk?</h2>
            <p className="mt-3 text-green-100 max-w-md mx-auto">
              Download aplikasi ecosystem AgroHub dan mulai jual produk Anda sekarang juga!
            </p>
            <Link
              href="/download"
              className="inline-flex items-center gap-2 mt-6 px-8 py-4 rounded-2xl bg-white text-green-700 font-bold hover:bg-gray-100 transition shadow-xl"
            >
              <Download className="w-5 h-5" />
              Download Apps
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}