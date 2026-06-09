// app/(marketplace)/articles/[id]/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

import {
  ArrowLeft,
  Calendar,
  Clock3,
  User,
  Share2,
  Bookmark,
  Eye,
  ChevronRight,
  Heart,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Check,
  MessageCircle,
  ThumbsUp,
  Flag,
  Printer,
  Star,
  TrendingUp,
  Award,
  Send,
} from 'lucide-react';

const LOGO = '/assets/logo/logo-agrohub.png';

// ======================================================
// TYPES
// ======================================================

interface Article {
  id: number;
  title: string;
  image: string;
  category: string;
  author: string;
  authorAvatar?: string;
  authorBio?: string;
  date: string;
  readTime: string;
  views: number;
  likes: number;
  content: string;
  tags?: string[];
  relatedArticles?: Article[];
}

interface Comment {
  id: number;
  name: string;
  avatar: string;
  comment: string;
  date: string;
  likes: number;
  replies?: Comment[];
}

// ======================================================
// DATA (DIPERKAYA)
// ======================================================

const articles: Article[] = [
  {
    id: 1,
    title: 'Teknologi AI Membantu Petani Meningkatkan Hasil Panen',
    image: '/banner1.png',
    category: 'Teknologi',
    author: 'Dr. Ahmad Fauzi',
    authorAvatar: 'https://ui-avatars.com/api/?name=Ahmad+Fauzi&background=0D9488&color=fff',
    authorBio: 'Ahli Agronomi dengan pengalaman 15+ tahun di bidang pertanian modern.',
    date: '12 Mei 2026',
    readTime: '5 menit',
    views: 12450,
    likes: 892,
    tags: ['AI', 'Teknologi', 'Pertanian Modern', 'IoT'],
    content: `
Pertanian modern kini mengalami transformasi besar dengan hadirnya teknologi Artificial Intelligence (AI).

<h2>🔍 Apa Itu AI dalam Pertanian?</h2>

Artificial Intelligence (AI) dalam pertanian adalah penggunaan algoritma cerdas untuk menganalisis data pertanian dan memberikan rekomendasi yang tepat. Teknologi ini mencakup:

<ul>
  <li><strong>Machine Learning</strong> - Memprediksi hasil panen berdasarkan data historis</li>
  <li><strong>Computer Vision</strong> - Mendeteksi hama dan penyakit tanaman melalui gambar</li>
  <li><strong>IoT Sensors</strong> - Memantau kondisi tanah dan cuaca secara real-time</li>
  <li><strong>Drone Technology</strong> - Memetakan lahan dan menyemprot pupuk secara presisi</li>
</ul>

<h2>📊 Manfaat AI untuk Petani</h2>

Berdasarkan penelitian yang dilakukan AgroHub, penggunaan AI dalam pertanian memberikan dampak signifikan:

<div class="bg-green-50 p-6 rounded-2xl my-6">
  <div class="grid grid-cols-2 gap-4 text-center">
    <div>
      <div class="text-3xl font-bold text-green-700">+40%</div>
      <div class="text-sm text-slate-600">Peningkatan Hasil Panen</div>
    </div>
    <div>
      <div class="text-3xl font-bold text-green-700">-30%</div>
      <div class="text-sm text-slate-600">Pengurangan Biaya Produksi</div>
    </div>
    <div>
      <div class="text-3xl font-bold text-green-700">50%</div>
      <div class="text-sm text-slate-600">Efisiensi Penggunaan Air</div>
    </div>
    <div>
      <div class="text-3xl font-bold text-green-700">24/7</div>
      <div class="text-sm text-slate-600">Monitoring Real-time</div>
    </div>
  </div>
</div>

<h2>🌱 Implementasi di Indonesia</h2>

Di Indonesia, teknologi AI mulai diadopsi oleh petani milenial dan korporasi pertanian. AgroHub sebagai platform agribisnis modern telah membantu lebih dari <strong>10.000 petani</strong> mengimplementasikan teknologi ini.

"Sebelum pakai AI, saya sering gagal prediksi musim tanam. Sekarang hasil panen saya meningkat drastis," ujar Pak Slamet, petani jagung asal Jawa Timur.

<h2>🚀 Masa Depan Pertanian dengan AI</h2>

Kedepannya, AI akan semakin terintegrasi dengan:
<ul>
  <li>Blockchain untuk transparansi rantai pasok</li>
  <li>Robot otonom untuk panen otomatis</li>
  <li>Big data analytics untuk prediksi pasar</li>
</ul>

AgroHub menghadirkan solusi pertanian digital yang menghubungkan teknologi, supplier, dan petani dalam satu ekosistem modern.
    `,
    relatedArticles: [
      {
        id: 2,
        title: 'Cara Memilih Pupuk Organik Berkualitas Tinggi',
        image: '/banner2.png',
        category: 'Pupuk',
        author: 'AgroHub Team',
        date: '10 Mei 2026',
        readTime: '4 menit',
        views: 8921,
        likes: 0,
        content: '',
      },
      {
        id: 3,
        title: 'Panduan Sukses Budidaya Lele di Kolam Terpal',
        image: '/banner3.png',
        category: 'Perikanan',
        author: 'AgroHub Team',
        date: '8 Mei 2026',
        readTime: '6 menit',
        views: 15234,
        likes: 0,
        content: '',
      },
    ],
  },
  {
    id: 2,
    title: 'Cara Memilih Pupuk Organik Berkualitas Tinggi',
    image: '/banner2.png',
    category: 'Pupuk',
    author: 'Siti Nurjanah',
    authorAvatar: 'https://ui-avatars.com/api/?name=Siti+Nurjanah&background=059669&color=fff',
    authorBio: 'Petani milenial dan pegiat pertanian organik.',
    date: '10 Mei 2026',
    readTime: '4 menit',
    views: 8921,
    likes: 567,
    tags: ['Pupuk', 'Organik', 'Pertanian Berkelanjutan'],
    content: `
Pupuk organik memiliki peran penting dalam menjaga kesuburan tanah secara alami.

<h2>🌿 Jenis-Jenis Pupuk Organik</h2>

<ul>
  <li><strong>Pupuk Kompos</strong> - Dari sisa tanaman dan sampah organik</li>
  <li><strong>Pupuk Kandang</strong> - Dari kotoran hewan ternak</li>
  <li><strong>Pupuk Hijau</strong> - Dari tanaman yang ditanam khusus</li>
  <li><strong>Biochar</strong> - Arang hayati untuk meningkatkan kesuburan tanah</li>
</ul>

<h2>✅ Ciri Pupuk Organik Berkualitas</h2>

<ol>
  <li>Warna coklat kehitaman</li>
  <li>Berbau tanah (tidak menyengat)</li>
  <li>Tekstur remah dan tidak menggumpal</li>
  <li>Kadar air sekitar 30-40%</li>
  <li>Bebas dari biji gulma dan patogen</li>
</ol>

<h2>📈 Manfaat Pupuk Organik</h2>

<div class="bg-blue-50 p-6 rounded-2xl my-6">
  <ul class="space-y-2">
    <li>✓ Meningkatkan struktur tanah</li>
    <li>✓ Menyuburkan tanah secara alami</li>
    <li>✓ Ramah lingkungan</li>
    <li>✓ Meningkatkan hasil panen hingga 25%</li>
    <li>✓ Mengurangi ketergantungan pupuk kimia</li>
  </ul>
</div>

Penggunaan pupuk organik secara rutin dapat meningkatkan hasil panen dan menjaga kesehatan lingkungan.
    `,
  },
];

// ======================================================
// HELPER FUNCTIONS
// ======================================================

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
};

// ======================================================
// COMPONENTS
// ======================================================

function ShareButtons({ title, url }: { title: string; url: string }) {
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareLinks = [
    { name: 'WhatsApp', icon: '💬', color: 'text-green-600', url: `https://wa.me/?text=${encodeURIComponent(title + ' - ' + url)}` },
    { name: 'Facebook', icon: '📘', color: 'text-blue-600', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: 'Twitter', icon: '🐦', color: 'text-sky-500', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
    { name: 'LinkedIn', icon: '💼', color: 'text-blue-700', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link artikel disalin!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Gagal menyalin link');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowShare(!showShare)}
        className="w-11 h-11 rounded-2xl border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition"
      >
        <Share2 className="w-5 h-5 text-slate-700" />
      </button>

      {showShare && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowShare(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
            <div className="p-2 border-b border-slate-100">
              <p className="text-xs font-medium text-slate-500">Bagikan ke</p>
            </div>
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 transition ${link.color}`}
                onClick={() => setShowShare(false)}
              >
                <span className="text-lg">{link.icon}</span> {link.name}
              </a>
            ))}
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition border-t border-slate-100"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <LinkIcon className="w-4 h-4" />}
              {copied ? 'Tersalin!' : 'Salin Link'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function LikeButton({ articleId, initialLikes }: { articleId: number; initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(prev => prev - 1);
      setIsLiked(false);
      toast.success('Batal menyukai artikel');
    } else {
      setLikes(prev => prev + 1);
      setIsLiked(true);
      toast.success('Terima kasih telah menyukai artikel ini!');
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${
        isLiked 
          ? 'bg-red-50 border-red-200 text-red-500' 
          : 'border-slate-200 text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-500'
      }`}
    >
      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
      <span className="text-sm font-medium">{formatNumber(likes)}</span>
    </button>
  );
}

function BookmarkButton({ articleId }: { articleId: number }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Dihapus dari bookmark' : 'Disimpan ke bookmark');
  };

  return (
    <button
      onClick={handleBookmark}
      className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition ${
        isBookmarked 
          ? 'bg-green-50 border-green-200 text-green-600' 
          : 'border-slate-200 text-slate-700 hover:bg-green-50 hover:border-green-200 hover:text-green-600'
      }`}
    >
      <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
    </button>
  );
}

function CommentSection({ articleId }: { articleId: number }) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      name: 'Budi Santoso',
      avatar: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=0D9488&color=fff',
      comment: 'Artikel sangat informatif! Terima kasih AgroHub.',
      date: '2 jam yang lalu',
      likes: 12,
      replies: [
        {
          id: 2,
          name: 'AgroHub Team',
          avatar: 'https://ui-avatars.com/api/?name=AgroHub&background=059669&color=fff',
          comment: 'Terima kasih atas apresiasinya, Pak Budi! 🙏',
          date: '1 jam yang lalu',
          likes: 5,
          replies: [],
        },
      ],
    },
  ]);
  const [newComment, setNewComment] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Komentar tidak boleh kosong');
      return;
    }
    if (!name.trim()) {
      toast.error('Nama tidak boleh kosong');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const comment: Comment = {
        id: comments.length + 1,
        name: name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D9488&color=fff`,
        comment: newComment,
        date: 'Baru saja',
        likes: 0,
        replies: [],
      };
      setComments([comment, ...comments]);
      setNewComment('');
      setIsSubmitting(false);
      toast.success('Komentar berhasil ditambahkan!');
    }, 500);
  };

  return (
    <div className="mt-8 pt-6 border-t border-slate-200">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-green-600" />
        <h3 className="text-xl font-bold text-slate-900">
          Komentar ({comments.length})
        </h3>
      </div>

      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Nama Anda"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="relative">
          <textarea
            placeholder="Tulis komentar Anda..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="absolute bottom-3 right-3 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Image src={comment.avatar} alt={comment.name} width={40} height={40} className="rounded-full" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-slate-800">{comment.name}</span>
                  <span className="text-xs text-slate-400">{comment.date}</span>
                </div>
                <p className="text-slate-600 text-sm">{comment.comment}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition">
                    <ThumbsUp className="w-3 h-3" />
                    {comment.likes > 0 && comment.likes}
                  </button>
                  <button className="text-xs text-slate-400 hover:text-green-600 transition">Balas</button>
                </div>
              </div>
            </div>
            {comment.replies?.map((reply) => (
              <div key={reply.id} className="ml-12 mt-3 pt-3 border-l-2 border-green-200 pl-4">
                <div className="flex items-start gap-3">
                  <Image src={reply.avatar} alt={reply.name} width={32} height={32} className="rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-800 text-sm">{reply.name}</span>
                      <span className="text-xs text-slate-400">{reply.date}</span>
                    </div>
                    <p className="text-slate-600 text-sm">{reply.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ======================================================
// MAIN PAGE
// ======================================================

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = parseInt(params.id as string);
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const found = articles.find((a) => a.id === articleId);
      if (found) {
        setArticle(found);
        setRelatedArticles(found.relatedArticles || articles.filter(a => a.id !== articleId).slice(0, 3));
      }
      setIsLoading(false);
    }, 300);
  }, [articleId]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Memuat artikel...</p>
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6">
        <div className="bg-white rounded-[32px] p-10 border border-slate-200 text-center max-w-lg">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Flag className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">
            Artikel Tidak Ditemukan
          </h1>
          <p className="text-slate-500 mt-4">
            Artikel yang kamu cari tidak tersedia atau telah dihapus.
          </p>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 mt-6 bg-green-700 hover:bg-green-800 text-white px-6 py-4 rounded-2xl font-bold transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Artikel
          </Link>
        </div>
      </main>
    );
  }

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <main className="min-h-screen bg-[#F5F5F5]">
      {/* HERO IMAGE */}
      <section className="relative h-[420px] md:h-[500px] overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="max-w-5xl mx-auto px-4 pb-10">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
              Kembali ke Artikel
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full bg-green-600 text-white px-4 py-2 text-sm font-bold mb-5 shadow-lg">
              <TrendingUp className="w-4 h-4" />
              {article.category}
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight max-w-4xl">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-5 mt-6 text-white/90 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {article.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {article.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock3 className="w-5 h-5" />
                {article.readTime}
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                {formatNumber(article.views)} views
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* ARTICLE */}
          <article className="bg-white rounded-[32px] border border-slate-200 p-6 md:p-10 shadow-sm">
            {/* Author & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-green-100 flex items-center justify-center">
                  {article.authorAvatar ? (
                    <Image src={article.authorAvatar} alt={article.author} width={48} height={48} className="object-cover" />
                  ) : (
                    <span className="text-green-600 font-bold text-lg">
                      {article.author.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-black text-slate-900">{article.author}</h3>
                  <p className="text-sm text-slate-500">{article.authorBio || 'Penulis AgroHub'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <LikeButton articleId={article.id} initialLikes={article.likes} />
                <BookmarkButton articleId={article.id} />
                <ShareButtons title={article.title} url={pageUrl} />
              </div>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {article.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-8 prose-strong:text-green-700 prose-ul:text-slate-700 prose-li:my-2 mt-6"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Comment Section */}
            <CommentSection articleId={article.id} />
          </article>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            {/* Author Card */}
            <div className="bg-white rounded-[30px] border border-slate-200 p-6 text-center">
              <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden bg-green-100 flex items-center justify-center mb-4">
                {article.authorAvatar ? (
                  <Image src={article.authorAvatar} alt={article.author} width={96} height={96} />
                ) : (
                  <span className="text-green-600 font-bold text-3xl">
                    {article.author.charAt(0)}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-slate-900 text-lg">{article.author}</h3>
              <p className="text-sm text-slate-500 mt-1">{article.authorBio || 'Kontributor AgroHub'}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <button className="mt-4 w-full py-2 bg-green-50 text-green-600 rounded-xl font-semibold hover:bg-green-100 transition">
                Ikuti Penulis
              </button>
            </div>

            {/* Related Articles */}
            <div className="bg-white rounded-[30px] border border-slate-200 p-6">
              <h3 className="text-xl font-black text-slate-900 mb-5 flex items-center gap-2">
                <Award className="w-5 h-5 text-green-600" />
                Artikel Terkait
              </h3>

              <div className="space-y-5">
                {relatedArticles.map((item) => (
                  <Link
                    href={`/articles/${item.id}`}
                    key={item.id}
                    className="group block"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-green-700 mb-1">
                          {item.category}
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm line-clamp-2 group-hover:text-green-700 transition">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                          <Calendar className="w-3 h-3" />
                          {item.date}
                          <span>•</span>
                          <Eye className="w-3 h-3" />
                          {formatNumber(item.views)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA Banner */}
            <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-[30px] p-7 text-white overflow-hidden relative">
              <div className="absolute right-0 bottom-0 opacity-10 text-[140px]">🌾</div>
              <div className="relative z-10">
                <div className="text-sm font-semibold text-green-100 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  AgroHub Insight
                </div>
                <h3 className="text-2xl font-black mt-3 leading-tight">
                  Pertanian Modern Dimulai Hari Ini
                </h3>
                <p className="text-green-100 mt-4 text-sm leading-relaxed">
                  Temukan teknologi, supplier, dan edukasi pertanian terbaik Indonesia.
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="mt-6 inline-flex items-center gap-2 bg-white text-green-700 px-5 py-3 rounded-2xl font-bold hover:bg-green-50 hover:scale-105 transition shadow-lg"
                >
                  Jelajahi Marketplace
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-[30px] border border-slate-200 p-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-black text-green-600">{formatNumber(article.views)}</div>
                  <div className="text-xs text-slate-500">Pembaca</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-green-600">{formatNumber(article.likes)}</div>
                  <div className="text-xs text-slate-500">Suka</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-green-600">{article.readTime}</div>
                  <div className="text-xs text-slate-500">Waktu Baca</div>
                </div>
                <div>
                  <button onClick={() => window.print()} className="flex flex-col items-center gap-1 hover:text-green-600 transition">
                    <Printer className="w-5 h-5" />
                    <span className="text-xs">Cetak</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}