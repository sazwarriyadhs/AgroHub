'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Activity, 
  Loader2, 
  Star,
  StarHalf,
  TrendingUp,
  Search,
  Filter,
  X,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  User,
  Package,
  ThumbsUp,
  Flag
} from 'lucide-react';

// Types
interface Review {
  id: number;
  rating: number;
  comment: string;
  customer_name: string;
  customer_email: string;
  customer_avatar?: string;
  product_id: number;
  product_name: string;
  product_image?: string;
  store_id: number;
  store_name: string;
  status: 'approved' | 'pending' | 'reported' | 'spam';
  helpful_count: number;
  reported_count: number;
  created_at: string;
  updated_at: string;
  reply?: string;
  reply_date?: string;
  images?: string[];
}

interface ReviewStats {
  total: number;
  average_rating: number;
  rating_distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  approved: number;
  pending: number;
  reported: number;
  spam: number;
  total_helpful: number;
  total_reported: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

// Rating distribution helper
const getRatingPercentage = (count: number, total: number) => {
  if (total === 0) return 0;
  return (count / total) * 100;
};

export default function ReviewsPage() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    total: 0,
    average_rating: 0,
    rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    approved: 0,
    pending: 0,
    reported: 0,
    spam: 0,
    total_helpful: 0,
    total_reported: 0
  });
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [updating, setUpdating] = useState(false);

  // Get token
  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('admin_token') || localStorage.getItem('token');
  };

  // Fetch reviews
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        console.error('No token found');
        return;
      }

      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (ratingFilter > 0) params.append('rating', ratingFilter.toString());

      const response = await fetch(
        `${API_URL}/admin/reviews?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const reviewsData = data.data || data.reviews || [];
      setReviews(reviewsData);
      setTotalPages(Math.ceil((data.total || reviewsData.length) / itemsPerPage));
      
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Fallback mock data
      setReviews([
        {
          id: 1,
          rating: 5,
          comment: "Produk sangat bagus! Pengiriman cepat, packing rapi. Recommended banget untuk para petani.",
          customer_name: "Ahmad Fauzi",
          customer_email: "ahmad@example.com",
          product_id: 1,
          product_name: "Pupuk Organik Premium",
          product_image: "https://placehold.co/40x40/22c55e/white",
          store_id: 1,
          store_name: "Tani Makmur Store",
          status: "approved",
          helpful_count: 45,
          reported_count: 0,
          created_at: "2024-01-15T10:30:00Z",
          updated_at: "2024-01-15T10:30:00Z"
        },
        {
          id: 2,
          rating: 4,
          comment: "Benih padi tumbuh dengan baik. Hasil panen memuaskan.",
          customer_name: "Budi Santoso",
          customer_email: "budi@example.com",
          product_id: 2,
          product_name: "Benih Padi Unggul",
          product_image: "https://placehold.co/40x40/22c55e/white",
          store_id: 1,
          store_name: "Tani Makmur Store",
          status: "approved",
          helpful_count: 23,
          reported_count: 0,
          created_at: "2024-01-16T14:20:00Z",
          updated_at: "2024-01-16T14:20:00Z"
        },
        {
          id: 3,
          rating: 3,
          comment: "Sprayer cukup bagus tapi baterai cepat habis.",
          customer_name: "Siti Nurhaliza",
          customer_email: "siti@example.com",
          product_id: 3,
          product_name: "Sprayer Elektrik Modern",
          product_image: "https://placehold.co/40x40/22c55e/white",
          store_id: 2,
          store_name: "Agro Nusantara",
          status: "pending",
          helpful_count: 12,
          reported_count: 1,
          created_at: "2024-01-17T09:15:00Z",
          updated_at: "2024-01-17T09:15:00Z"
        },
        {
          id: 4,
          rating: 1,
          comment: "Produk tidak sesuai deskripsi. Kecewa.",
          customer_name: "Reza Pahlevi",
          customer_email: "reza@example.com",
          product_id: 4,
          product_name: "Sensor Tanah IoT",
          product_image: "https://placehold.co/40x40/22c55e/white",
          store_id: 2,
          store_name: "Agro Nusantara",
          status: "reported",
          helpful_count: 5,
          reported_count: 3,
          created_at: "2024-01-18T11:00:00Z",
          updated_at: "2024-01-18T11:00:00Z"
        }
      ]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, ratingFilter]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const token = getToken();
      
      if (!token) return;

      const response = await fetch(`${API_URL}/admin/reviews/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) return;

      const data = await response.json();
      const statsData = data.data || data;
      
      setReviewStats({
        total: statsData.total || 1234,
        average_rating: statsData.average_rating || 4.5,
        rating_distribution: statsData.rating_distribution || { 1: 45, 2: 67, 3: 123, 4: 345, 5: 654 },
        approved: statsData.approved || 890,
        pending: statsData.pending || 234,
        reported: statsData.reported || 67,
        spam: statsData.spam || 43,
        total_helpful: statsData.total_helpful || 4567,
        total_reported: statsData.total_reported || 234
      });
      
    } catch (error) {
      console.error('Error fetching stats:', error);
      setReviewStats({
        total: 1234,
        average_rating: 4.5,
        rating_distribution: { 1: 45, 2: 67, 3: 123, 4: 345, 5: 654 },
        approved: 890,
        pending: 234,
        reported: 67,
        spam: 43,
        total_helpful: 4567,
        total_reported: 234
      });
    }
  }, []);

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [fetchReviews, fetchStats]);

  // Update review status
  const updateReviewStatus = async (reviewId: number, status: string) => {
    setUpdating(true);
    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/admin/reviews/${reviewId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchReviews();
        fetchStats();
        if (selectedReview) {
          setSelectedReview({ ...selectedReview, status: status as Review['status'] });
        }
      }
    } catch (error) {
      console.error('Error updating review status:', error);
    } finally {
      setUpdating(false);
    }
  };

  // Add reply to review
  const addReply = async () => {
    if (!selectedReview || !replyText.trim()) return;
    
    setUpdating(true);
    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/admin/reviews/${selectedReview.id}/reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reply: replyText })
      });

      if (response.ok) {
        fetchReviews();
        setSelectedReview({ ...selectedReview, reply: replyText, reply_date: new Date().toISOString() });
        setReplyText('');
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    } finally {
      setUpdating(false);
    }
  };

  // Delete review
  const deleteReview = async () => {
    if (!selectedReview) return;
    
    setUpdating(true);
    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/admin/reviews/${selectedReview.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchReviews();
        fetchStats();
        setShowDetailModal(false);
        setSelectedReview(null);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    } finally {
      setUpdating(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Render stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    return stars;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Approved</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Pending</span>;
      case 'reported':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1"><Flag className="w-3 h-3" /> Reported</span>;
      case 'spam':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center gap-1"><XCircle className="w-3 h-3" /> Spam</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Unknown</span>;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setRatingFilter(0);
  };

  const activeFiltersCount = (searchTerm ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0) + (ratingFilter > 0 ? 1 : 0);

  if (loading && reviews.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        <span className="ml-2 text-gray-500">Memuat data reviews...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-green-600" />
              <h1 className="text-2xl font-bold capitalize text-gray-800">
                Reviews Management
              </h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Kelola ulasan, rating, dan moderasi komentar pelanggan
            </p>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{reviewStats.total.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Total review</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-xs text-gray-400">Avg Rating</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{reviewStats.average_rating.toFixed(1)}</p>
          <div className="flex items-center gap-0.5 mt-1">
            {renderStars(reviewStats.average_rating)}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-xs text-gray-400">Approved</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{reviewStats.approved.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Disetujui</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <span className="text-xs text-gray-400">Pending</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{reviewStats.pending}</p>
          <p className="text-xs text-gray-500">Menunggu</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Flag className="w-5 h-5 text-red-500" />
            <span className="text-xs text-gray-400">Reported</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{reviewStats.reported}</p>
          <p className="text-xs text-gray-500">Dilaporkan</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <ThumbsUp className="w-5 h-5 text-purple-500" />
            <span className="text-xs text-gray-400">Helpful</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{reviewStats.total_helpful.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Total membantu</p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white p-5 rounded-2xl border shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Distribusi Rating</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviewStats.rating_distribution[rating as keyof typeof reviewStats.rating_distribution];
            const percentage = getRatingPercentage(count, reviewStats.total);
            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="w-16 text-sm font-medium">{rating} Bintang</div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-20 text-sm text-gray-500 text-right">{count.toLocaleString()}</div>
                <div className="w-12 text-sm text-gray-400">{percentage.toFixed(0)}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari review berdasarkan produk atau customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-xl"
          >
            <Filter className="w-4 h-4" />
            Filter
            {activeFiltersCount > 0 && (
              <span className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none text-sm"
            >
              <option value="all">Semua Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="reported">Reported</option>
              <option value="spam">Spam</option>
            </select>

            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(Number(e.target.value))}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none text-sm"
            >
              <option value={0}>Semua Rating</option>
              <option value={5}>⭐ 5 Bintang</option>
              <option value={4}>⭐ 4 Bintang</option>
              <option value={3}>⭐ 3 Bintang</option>
              <option value={2}>⭐ 2 Bintang</option>
              <option value={1}>⭐ 1 Bintang</option>
            </select>
          </div>

          {/* Reset Filter */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 transition"
            >
              <X className="w-4 h-4" />
              Reset ({activeFiltersCount})
            </button>
          )}
        </div>

        {/* Mobile Filters Drawer */}
        {showFilters && (
          <div className="lg:hidden mt-4 pt-4 border-t space-y-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50"
            >
              <option value="all">Semua Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="reported">Reported</option>
              <option value="spam">Spam</option>
            </select>

            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50"
            >
              <option value={0}>Semua Rating</option>
              <option value={5}>⭐ 5 Bintang</option>
              <option value={4}>⭐ 4 Bintang</option>
              <option value={3}>⭐ 3 Bintang</option>
              <option value={2}>⭐ 2 Bintang</option>
              <option value={1}>⭐ 1 Bintang</option>
            </select>
          </div>
        )}
      </div>

      {/* REVIEWS TABLE */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Produk</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Review</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-800">{review.product_name}</span>
                      </div>
                     </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{review.customer_name}</span>
                      </div>
                     </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-0.5">
                        {renderStars(review.rating)}
                      </div>
                     </td>
                    <td className="px-4 py-3">
                      <p className="max-w-xs truncate text-gray-600">
                        {review.comment.length > 60 ? review.comment.substring(0, 60) + '...' : review.comment}
                      </p>
                     </td>
                    <td className="px-4 py-3">{getStatusBadge(review.status)}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {formatDate(review.created_at)}
                     </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedReview(review);
                          setShowDetailModal(true);
                          setReplyText(review.reply || '');
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4 text-blue-500" />
                      </button>
                     </td>
                   </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Belum ada data review</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t flex justify-between items-center flex-wrap gap-2 bg-gray-50">
            <p className="text-xs text-gray-500">
              Menampilkan {reviews.length} dari {reviewStats.total} review
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-lg text-xs disabled:opacity-40 hover:bg-white transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg text-xs transition ${
                      currentPage === page
                        ? 'bg-green-600 text-white'
                        : 'border hover:bg-white'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              {totalPages > 5 && <span className="px-2 text-gray-400">...</span>}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-lg text-xs disabled:opacity-40 hover:bg-white transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review Detail Modal */}
      {showDetailModal && selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Detail Review</h3>
                  <p className="text-sm text-gray-500">Produk: {selectedReview.product_name}</p>
                </div>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedReview(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Status Update */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Status Review</p>
                    <div className="mt-2">
                      {getStatusBadge(selectedReview.status)}
                    </div>
                  </div>
                  <select
                    value={selectedReview.status}
                    onChange={(e) => updateReviewStatus(selectedReview.id, e.target.value)}
                    disabled={updating}
                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="reported">Reported</option>
                    <option value="spam">Spam</option>
                  </select>
                </div>
              </div>

              {/* Review Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Rating</h4>
                  <div className="flex items-center gap-0.5">
                    {renderStars(selectedReview.rating)}
                    <span className="ml-2 text-gray-600">({selectedReview.rating}/5)</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Ulasan</h4>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-xl">
                    {selectedReview.comment}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Customer</h4>
                    <p className="text-gray-600">{selectedReview.customer_name}</p>
                    <p className="text-sm text-gray-400">{selectedReview.customer_email}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Toko</h4>
                    <p className="text-gray-600">{selectedReview.store_name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Statistik</h4>
                    <p className="text-gray-600">👍 Membantu: {selectedReview.helpful_count}</p>
                    <p className="text-gray-600">🚩 Dilaporkan: {selectedReview.reported_count}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Tanggal</h4>
                    <p className="text-gray-600">Dibuat: {formatDate(selectedReview.created_at)}</p>
                    {selectedReview.updated_at !== selectedReview.created_at && (
                      <p className="text-gray-600">Diupdate: {formatDate(selectedReview.updated_at)}</p>
                    )}
                  </div>
                </div>

                {/* Reply Section */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Balasan Admin</h4>
                  {selectedReview.reply ? (
                    <div className="bg-green-50 p-4 rounded-xl mb-3">
                      <p className="text-gray-700">{selectedReview.reply}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        Dibalas: {formatDate(selectedReview.reply_date || selectedReview.updated_at)}
                      </p>
                    </div>
                  ) : null}
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Tulis balasan untuk review ini..."
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    rows={3}
                  />
                  <button
                    onClick={addReply}
                    disabled={updating || !replyText.trim()}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {updating ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null}
                    Kirim Balasan
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t flex gap-3">
                <button
                  onClick={deleteReview}
                  disabled={updating}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition disabled:opacity-50"
                >
                  Hapus Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}