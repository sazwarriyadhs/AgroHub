// app/(marketplace)/articles/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  Calendar, 
  User, 
  Eye, 
  Heart, 
  Share2, 
  Bookmark,
  Clock,
  TrendingUp,
  ChevronRight,
  Filter,
  X,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Award,
  Flame,
  Sparkles,
  Leaf,
  Tractor,
  Droplets,
  Sprout,
  ArrowRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// ======================================================
// TYPES
// ======================================================

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  categorySlug: string;
  author: {
    id: number;
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  readTime: number;
  views: number;
  likes: number;
  isFeatured: boolean;
  isTrending: boolean;
  tags: string[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

// ======================================================
// HARDCODED ARTICLES DATA
// ======================================================

const CATEGORIES: Category[] = [
  { id: 1, name: 'Semua', slug: 'all', count: 24, icon: <Sparkles className="w-4 h-4" />, color: 'bg-purple-100 text-purple-600' },
  { id: 2, name: 'Pertanian', slug: 'pertanian', count: 8, icon: <Sprout className="w-4 h-4" />, color: 'bg-green-100 text-green-600' },
  { id: 3, name: 'Peternakan', slug: 'peternakan', count: 6, icon: <Tractor className="w-4 h-4" />, color: 'bg-orange-100 text-orange-600' },
  { id: 4, name: 'Perikanan', slug: 'perikanan', count: 5, icon: <Droplets className="w-4 h-4" />, color: 'bg-blue-100 text-blue-600' },
  { id: 5, name: 'Agribisnis', slug: 'agribisnis', count: 3, icon: <TrendingUp className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-600' },
  { id: 6, name: 'Teknologi', slug: 'teknologi', count: 2, icon: <Leaf className="w-4 h-4" />, color: 'bg-teal-100 text-teal-600' },
];

const ARTICLES: Article[] = [
  {
    id: 1,
    title: 'Panduan Lengkap Budidaya Padi Organik untuk Pemula',
    slug: 'panduan-budidaya-padi-organik',
    excerpt: 'Pelajari cara menanam padi organik dari awal hingga panen. Metode ramah lingkungan tanpa pestisida kimia.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1593113598332-cd288d649c14?w=800',
    category: 'Pertanian',
    categorySlug: 'pertanian',
    author: {
      id: 1,
      name: 'Dr. Ahmad Fauzi',
      avatar: 'https://ui-avatars.com/api/?name=Ahmad+Fauzi&background=0D9488&color=fff',
      role: 'Ahli Agronomi'
    },
    publishedAt: '2026-06-01',
    readTime: 8,
    views: 2450,
    likes: 342,
    isFeatured: true,
    isTrending: true,
    tags: ['Padi', 'Organik', 'Pertanian Berkelanjutan']
  },
  {
    id: 2,
    title: '5 Cara Mudah Meningkatkan Produktivitas Lahan Sempit',
    slug: 'cara-meningkatkan-produktivitas-lahan-sempit',
    excerpt: 'Manfaatkan lahan terbatas dengan teknik vertikultur dan hidroponik sederhana. Hasil panen melimpah!',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
    category: 'Pertanian',
    categorySlug: 'pertanian',
    author: {
      id: 2,
      name: 'Siti Nurjanah',
      avatar: 'https://ui-avatars.com/api/?name=Siti+Nurjanah&background=059669&color=fff',
      role: 'Petani Milenial'
    },
    publishedAt: '2026-05-28',
    readTime: 6,
    views: 1890,
    likes: 267,
    isFeatured: false,
    isTrending: true,
    tags: ['Lahan Sempit', 'Vertikultur', 'Hidroponik']
  },
  {
    id: 3,
    title: 'Inovasi Teknologi IoT untuk Monitoring Lahan Pertanian',
    slug: 'teknologi-iot-monitoring-lahan',
    excerpt: 'Gunakan sensor tanah dan drone untuk memantau kondisi lahan secara real-time. Efisiensi biaya hingga 40%!',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800',
    category: 'Teknologi',
    categorySlug: 'teknologi',
    author: {
      id: 3,
      name: 'Bambang Wijaya',
      avatar: 'https://ui-avatars.com/api/?name=Bambang+Wijaya&background=0D9488&color=fff',
      role: 'Teknologi Pertanian'
    },
    publishedAt: '2026-05-25',
    readTime: 10,
    views: 3210,
    likes: 489,
    isFeatured: true,
    isTrending: true,
    tags: ['IoT', 'Smart Farming', 'Sensor']
  },
  {
    id: 4,
    title: 'Tips Memilih Bibit Ayam Broiler Berkualitas',
    slug: 'tips-memilih-bibit-ayam-broiler',
    excerpt: 'Kriteria bibit ayam broiler yang sehat dan produktif. Tingkatkan keberhasilan ternak Anda!',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=800',
    category: 'Peternakan',
    categorySlug: 'peternakan',
    author: {
      id: 4,
      name: 'drh. Rina Hartati',
      avatar: 'https://ui-avatars.com/api/?name=Rina+Hartati&background=059669&color=fff',
      role: 'Dokter Hewan'
    },
    publishedAt: '2026-05-22',
    readTime: 7,
    views: 1560,
    likes: 234,
    isFeatured: false,
    isTrending: false,
    tags: ['Ayam Broiler', 'Bibit', 'Peternakan']
  },
  {
    id: 5,
    title: 'Panduan Sukses Budidaya Lele di Kolam Terpal',
    slug: 'budidaya-lele-kolam-terpal',
    excerpt: 'Teknik budidaya lele dengan kolam terpal hemat biaya dan mudah perawatannya. Cocok untuk pemula!',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1582628544010-9bd3f5c1b2da?w=800',
    category: 'Perikanan',
    categorySlug: 'perikanan',
    author: {
      id: 5,
      name: 'Muhammad Rizki',
      avatar: 'https://ui-avatars.com/api/?name=Muhammad+Rizki&background=0D9488&color=fff',
      role: 'Pembudidaya Ikan'
    },
    publishedAt: '2026-05-20',
    readTime: 9,
    views: 2780,
    likes: 398,
    isFeatured: false,
    isTrending: true,
    tags: ['Lele', 'Kolam Terpal', 'Budidaya']
  },
  {
    id: 6,
    title: 'Strategi Pemasaran Hasil Panen di Era Digital',
    slug: 'strategi-pemasaran-hasil-panen-digital',
    excerpt: 'Manfaatkan marketplace dan media sosial untuk menjual hasil panen langsung ke konsumen. Tanpa tengkulak!',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800',
    category: 'Agribisnis',
    categorySlug: 'agribisnis',
    author: {
      id: 6,
      name: 'Dewi Lestari',
      avatar: 'https://ui-avatars.com/api/?name=Dewi+Lestari&background=059669&color=fff',
      role: 'Digital Marketer'
    },
    publishedAt: '2026-05-18',
    readTime: 8,
    views: 2100,
    likes: 312,
    isFeatured: false,
    isTrending: false,
    tags: ['Pemasaran', 'Digital', 'Marketplace']
  },
  {
    id: 7,
    title: 'Cara Mengatasi Hama Wereng pada Tanaman Padi',
    slug: 'mengatasi-hama-wereng-padi',
    excerpt: 'Identifikasi dan pengendalian hama wereng secara alami maupun kimia. Lindungi hasil panen Anda!',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1593113598332-cd288d649c14?w=800',
    category: 'Pertanian',
    categorySlug: 'pertanian',
    author: {
      id: 1,
      name: 'Dr. Ahmad Fauzi',
      avatar: 'https://ui-avatars.com/api/?name=Ahmad+Fauzi&background=0D9488&color=fff',
      role: 'Ahli Agronomi'
    },
    publishedAt: '2026-05-15',
    readTime: 6,
    views: 1850,
    likes: 267,
    isFeatured: false,
    isTrending: false,
    tags: ['Hama', 'Wereng', 'Pengendalian Hama']
  },
  {
    id: 8,
    title: 'Peluang Bisnis Pupuk Organik di Era Pertanian Modern',
    slug: 'bisnis-pupuk-organik',
    excerpt: 'Analisis pasar dan prospek bisnis pupuk organik. Modal kecil untung besar!',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
    category: 'Agribisnis',
    categorySlug: 'agribisnis',
    author: {
      id: 2,
      name: 'Siti Nurjanah',
      avatar: 'https://ui-avatars.com/api/?name=Siti+Nurjanah&background=059669&color=fff',
      role: 'Petani Milenial'
    },
    publishedAt: '2026-05-12',
    readTime: 7,
    views: 1430,
    likes: 198,
    isFeatured: false,
    isTrending: false,
    tags: ['Pupuk Organik', 'Bisnis', 'Peluang Usaha']
  }
];

// ======================================================
// HELPER FUNCTIONS
// ======================================================

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

// ======================================================
// COMPONENTS
// ======================================================

function CategoryFilter({ categories, selected, onSelect }: any) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat: Category) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.slug)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            selected === cat.slug
              ? `${cat.color} shadow-md scale-105`
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          {cat.icon}
          {cat.name}
          <span className="text-xs opacity-70">({cat.count})</span>
        </button>
      ))}
    </div>
  );
}

function ArticleCard({ article, isFeatured = false }: { article: Article; isFeatured?: boolean }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(article.likes);

  const handleLike = () => {
    if (isLiked) {
      setLikesCount(prev => prev - 1);
      setIsLiked(false);
      toast.success('Batal menyukai artikel');
    } else {
      setLikesCount(prev => prev + 1);
      setIsLiked(true);
      toast.success('Menyukai artikel ini');
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Dihapus dari bookmark' : 'Disimpan ke bookmark');
  };

  if (isFeatured) {
    return (
      <article className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
        <div className="relative h-80 md:h-96 overflow-hidden">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Featured Badge */}
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              Artikel Unggulan
            </span>
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
            <div className="flex items-center gap-4 text-sm mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(article.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.readTime} menit
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {formatNumber(article.views)} views
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 line-clamp-2">
              {article.title}
            </h2>
            <p className="text-white/80 text-sm md:text-base mb-4 line-clamp-2">
              {article.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white"
                />
                <div>
                  <p className="font-semibold text-sm">{article.author.name}</p>
                  <p className="text-xs text-white/70">{article.author.role}</p>
                </div>
              </div>
              <Link
                href={`/articles/${article.slug}`}
                className="bg-white text-slate-900 px-5 py-2 rounded-full text-sm font-semibold hover:bg-green-50 transition flex items-center gap-2"
              >
                Baca Selengkapnya
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <Link href={`/articles/${article.slug}`} className="relative h-52 overflow-hidden block">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {article.isTrending && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Flame className="w-3 h-3" />
            Trending
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5">
        {/* Category & Meta */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            CATEGORIES.find(c => c.name === article.category)?.color || 'bg-gray-100 text-gray-600'
          }`}>
            {article.category}
          </span>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(article.publishedAt).slice(0, 10)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime}mnt
            </span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/articles/${article.slug}`}>
          <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2 group-hover:text-green-600 transition">
            {article.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">
          {article.excerpt}
        </p>

        {/* Author & Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Image
              src={article.author.avatar}
              alt={article.author.name}
              width={32}
              height={32}
              className="rounded-full"
            />
            <div>
              <p className="text-xs font-medium text-slate-700">{article.author.name}</p>
              <p className="text-xs text-slate-400">{article.author.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`p-1.5 rounded-full transition ${isLiked ? 'text-red-500 bg-red-50' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <span className="text-xs text-slate-500">{formatNumber(likesCount)}</span>
            
            <button
              onClick={handleBookmark}
              className={`p-1.5 rounded-full transition ${isBookmarked ? 'text-green-600 bg-green-50' : 'text-slate-400 hover:text-green-600 hover:bg-green-50'}`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function FeaturedSection({ articles }: { articles: Article[] }) {
  const featured = articles.find(a => a.isFeatured);
  const trending = articles.filter(a => a.isTrending).slice(0, 3);
  
  if (!featured) return null;

  return (
    <div className="grid lg:grid-cols-3 gap-6 mb-12">
      {/* Main Featured Article */}
      <div className="lg:col-span-2">
        <ArticleCard article={featured} isFeatured={true} />
      </div>

      {/* Trending Sidebar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <Flame className="w-5 h-5 text-red-500" />
          <h3 className="font-bold text-slate-800">Paling Populer</h3>
        </div>
        <div className="space-y-4">
          {trending.map((article, idx) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="flex items-start gap-3 group hover:bg-slate-50 p-2 rounded-lg transition"
            >
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center font-bold text-red-600">
                {idx + 1}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-800 line-clamp-2 group-hover:text-green-600 transition">
                  {article.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {formatNumber(article.views)} views
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ======================================================
// MAIN PAGE
// ======================================================

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredArticles, setFilteredArticles] = useState(ARTICLES);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      let filtered = [...ARTICLES];

      if (selectedCategory !== 'all') {
        filtered = filtered.filter(a => a.categorySlug === selectedCategory);
      }

      if (searchQuery) {
        filtered = filtered.filter(a =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      setFilteredArticles(filtered);
      setIsLoading(false);
    }, 300);
  }, [selectedCategory, searchQuery]);

  const featuredArticles = filteredArticles.filter(a => a.isFeatured);
  const regularArticles = filteredArticles.filter(a => !a.isFeatured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-700 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 animate-fade-in-up">
            Artikel & Inspirasi
          </h1>
          <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto mb-8">
            Temukan berbagai artikel menarik tentang pertanian, peternakan, perikanan, dan agribisnis
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari artikel, tips, atau panduan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Categories */}
        <div className="mb-8">
          <CategoryFilter
            categories={CATEGORIES}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-500">Memuat artikel...</p>
            </div>
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredArticles.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Artikel Tidak Ditemukan</h3>
            <p className="text-slate-500">Coba kata kunci lain atau lihat kategori lainnya</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* Featured Articles Section */}
        {!isLoading && featuredArticles.length > 0 && selectedCategory === 'all' && searchQuery === '' && (
          <FeaturedSection articles={ARTICLES} />
        )}

        {/* Articles Grid */}
        {!isLoading && filteredArticles.length > 0 && (
          <div>
            {selectedCategory !== 'all' && (
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  {CATEGORIES.find(c => c.slug === selectedCategory)?.name}
                </h2>
                <p className="text-sm text-slate-500">{filteredArticles.length} artikel ditemukan</p>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        )}

        {/* Newsletter Section */}
        <section className="mt-16 bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-8 md:p-12 text-white">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              Dapatkan Artikel Terbaru
            </h3>
            <p className="text-green-100 mb-6">
              Berlangganan newsletter kami untuk mendapatkan tips dan informasi terbaru seputar pertanian
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Email Anda"
                className="flex-1 px-5 py-3 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-green-600 rounded-xl font-semibold hover:bg-green-50 transition"
              >
                Berlangganan
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}