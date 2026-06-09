'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  ChevronRight,
  Search,
  FileText,
  ShoppingBag,
  CreditCard,
  Package,
  UserCircle,
  Shield,
  Truck,
} from 'lucide-react';

// ======================================================
// TYPES
// ======================================================

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  icon: any;
  count: number;
}

// ======================================================
// DATA
// ======================================================

const categories: Category[] = [
  { id: 'all', name: 'Semua', icon: HelpCircle, count: 24 },
  { id: 'akun', name: 'Akun & Profil', icon: UserCircle, count: 6 },
  { id: 'belanja', name: 'Cara Belanja', icon: ShoppingBag, count: 5 },
  { id: 'pembayaran', name: 'Pembayaran', icon: CreditCard, count: 4 },
  { id: 'pengiriman', name: 'Pengiriman', icon: Truck, count: 4 },
  { id: 'pesanan', name: 'Pesanan', icon: Package, count: 3 },
  { id: 'keamanan', name: 'Keamanan', icon: Shield, count: 2 },
];

const faqs: FAQItem[] = [
  {
    id: 1,
    category: 'akun',
    question: 'Bagaimana cara membuat akun di AgroHub?',
    answer: 'Anda dapat mendaftar melalui halaman Register dengan mengisi email, nomor telepon, dan password. Anda juga bisa mendaftar menggunakan akun Google atau Facebook.',
  },
  {
    id: 2,
    category: 'akun',
    question: 'Lupa password, bagaimana cara meresetnya?',
    answer: 'Klik "Lupa Password" di halaman Login, masukkan email terdaftar, kami akan mengirimkan link reset password ke email Anda.',
  },
  {
    id: 3,
    category: 'akun',
    question: 'Bagaimana cara mengubah data profil?',
    answer: 'Masuk ke akun Anda, buka halaman Profil, klik Edit Profil, lalu ubah informasi yang diperlukan dan simpan perubahan.',
  },
  {
    id: 4,
    category: 'belanja',
    question: 'Bagaimana cara mencari produk?',
    answer: 'Gunakan fitur search di bagian atas halaman, atau telusuri berdasarkan kategori yang tersedia.',
  },
  {
    id: 5,
    category: 'belanja',
    question: 'Bagaimana cara menambahkan produk ke keranjang?',
    answer: 'Klik tombol "Tambah ke Keranjang" pada halaman produk. Anda bisa melihat keranjang di icon keranjang di pojok kanan atas.',
  },
  {
    id: 6,
    category: 'belanja',
    question: 'Bisa membatalkan pesanan?',
    answer: 'Selama pesanan belum diproses, Anda bisa membatalkan di halaman Pesanan. Setelah diproses, hubungi customer support.',
  },
  {
    id: 7,
    category: 'pembayaran',
    question: 'Metode pembayaran apa saja yang tersedia?',
    answer: 'Kami menerima pembayaran melalui Bank Transfer (BCA, Mandiri, BRI, BNI), QRIS, Kartu Kredit, dan E-Wallet (OVO, GoPay, Dana, ShopeePay).',
  },
  {
    id: 8,
    category: 'pembayaran',
    question: 'Apakah ada biaya tambahan?',
    answer: 'Biaya tambahan tergantung metode pembayaran. Bank Transfer mungkin dikenakan biaya antar bank, QRIS gratis.',
  },
  {
    id: 9,
    category: 'pengiriman',
    question: 'Berapa lama waktu pengiriman?',
    answer: 'Waktu pengiriman bervariasi tergantung lokasi: 1-3 hari untuk Jabodetabek, 3-7 hari untuk luar Jawa.',
  },
  {
    id: 10,
    category: 'pengiriman',
    question: 'Bisa melacak pesanan?',
    answer: 'Ya, setelah pesanan dikirim, Anda akan mendapatkan nomor resi yang bisa dilacak di website kurir terkait.',
  },
  {
    id: 11,
    category: 'pesanan',
    question: 'Bagaimana melihat status pesanan?',
    answer: 'Buka halaman "Pesanan Saya" di menu profil untuk melihat status semua pesanan Anda.',
  },
  {
    id: 12,
    category: 'keamanan',
    question: 'Apakah data saya aman?',
    answer: 'Ya, semua data Anda dienkripsi dan diproteksi dengan standar keamanan tertinggi.',
  },
];

// ======================================================
// HELP CARD COMPONENT
// ======================================================

function HelpCard({ icon: Icon, title, description, action, href }: {
  icon: any;
  title: string;
  description: string;
  action: string;
  href?: string;
}) {
  const CardContent = () => (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition group cursor-pointer">
      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition">
        <Icon className="w-6 h-6 text-green-700" />
      </div>
      <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
      <p className="text-slate-500 text-sm mt-1">{description}</p>
      <div className="mt-4 text-green-700 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition">
        {action}
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
}

// ======================================================
// FAQ ITEM COMPONENT
// ======================================================

function FAQItemComponent({ item, isOpen, onToggle }: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left hover:bg-slate-50/50 px-4 rounded-lg transition"
      >
        <span className="font-semibold text-slate-700">{item.question}</span>
        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-slate-500 text-sm">
          {item.answer}
        </div>
      )}
    </div>
  );
}

// ======================================================
// MAIN PAGE
// ======================================================

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  // Filter FAQs
  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-700 to-emerald-600 text-white py-16">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-5">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm mb-4">
              <HelpCircle className="w-4 h-4" />
              Pusat Bantuan
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Ada yang bisa kami bantu?
            </h1>
            <p className="text-green-100 max-w-2xl mx-auto">
              Temukan jawaban untuk pertanyaan Anda atau hubungi tim support kami
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto mt-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari pertanyaan Anda..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Cards */}
      <section className="max-w-7xl mx-auto px-5 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <HelpCard
            icon={FileText}
            title="Pusat Pengetahuan"
            description="Panduan lengkap berjualan dan berbelanja di AgroHub"
            action="Baca Panduan"
            href="/knowledge"
          />
          <HelpCard
            icon={MessageCircle}
            title="Live Chat"
            description="Chat langsung dengan tim support kami"
            action="Mulai Chat"
          />
          <HelpCard
            icon={Mail}
            title="Email Support"
            description="support@agrohub.com - Balas dalam 1x24 jam"
            action="Kirim Email"
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-5 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Categories */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sticky top-24">
              <h3 className="font-bold text-slate-800 mb-3 px-2">Kategori</h3>
              <div className="space-y-1">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition ${
                        selectedCategory === cat.id
                          ? 'bg-green-100 text-green-700 font-semibold'
                          : 'text-slate-600 hover:bg-green-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{cat.name}</span>
                      <span className="text-xs text-slate-400 ml-auto">({cat.count})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* FAQ List */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-green-50 to-emerald-50">
                <h2 className="font-black text-slate-800">
                  Pertanyaan Umum
                  {selectedCategory !== 'all' && (
                    <span className="text-sm text-green-600 ml-2">
                      - {categories.find(c => c.id === selectedCategory)?.name}
                    </span>
                  )}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  {filteredFaqs.length} pertanyaan ditemukan
                </p>
              </div>
              
              <div className="divide-y divide-slate-100">
                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-12">
                    <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Tidak ada pertanyaan yang ditemukan</p>
                    <p className="text-slate-400 text-sm mt-1">Coba dengan kata kunci lain</p>
                  </div>
                ) : (
                  filteredFaqs.map((faq) => (
                    <FAQItemComponent
                      key={faq.id}
                      item={faq}
                      isOpen={openFaqId === faq.id}
                      onToggle={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-5 py-12">
        <div className="bg-gradient-to-r from-green-700 to-emerald-700 rounded-3xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Masih perlu bantuan?</h2>
            <p className="text-green-100 mb-6">
              Tim support kami siap membantu Anda
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2">
                <Phone className="w-4 h-4" />
                <span>+62 21 1234 5678</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2">
                <Mail className="w-4 h-4" />
                <span>support@agrohub.com</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2">
                <Clock className="w-4 h-4" />
                <span>Senin-Jumat, 09:00-17:00</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}