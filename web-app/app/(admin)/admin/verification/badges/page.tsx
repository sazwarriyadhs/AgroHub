'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Loader2, 
  Medal,
  Search,
  Filter,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Users,
  TrendingUp,
  Download,
  Plus,
  Edit,
  Trash2,
  Award,
  Star,
  Crown,
  Zap,
  Sparkles,
  Gift,
  Trophy
} from 'lucide-react';
import Link from 'next/link';

// Types
interface Badge {
  id: number;
  badge_id: string;
  name: string;
  description: string;
  category: 'achievement' | 'verification' | 'special' | 'membership';
  level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  icon: string;
  color: string;
  points: number;
  requirements: string;
  requirements_condition: 'automatic' | 'manual' | 'mixed';
  max_quantity: number;
  is_active: boolean;
  issued_count: number;
  created_at: string;
  updated_at: string;
}

interface UserBadge {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  user_type: string;
  badge_id: number;
  badge_name: string;
  badge_category: string;
  badge_level: string;
  awarded_at: string;
  awarded_by: string;
  notes?: string;
  is_displayed: boolean;
}

interface BadgeStats {
  total_badges: number;
  active_badges: number;
  total_issued: number;
  unique_users: number;
  this_month_issued: number;
  by_category: {
    achievement: number;
    verification: number;
    special: number;
    membership: number;
  };
  by_level: {
    bronze: number;
    silver: number;
    gold: number;
    platinum: number;
    diamond: number;
  };
  most_issued: {
    name: string;
    count: number;
  }[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

export default function BadgesPage() {
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [stats, setStats] = useState<BadgeStats>({
    total_badges: 0,
    active_badges: 0,
    total_issued: 0,
    unique_users: 0,
    this_month_issued: 0,
    by_category: {
      achievement: 0,
      verification: 0,
      special: 0,
      membership: 0
    },
    by_level: {
      bronze: 0,
      silver: 0,
      gold: 0,
      platinum: 0,
      diamond: 0
    },
    most_issued: []
  });
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'badges' | 'user-badges'>('badges');
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [selectedUserBadge, setSelectedUserBadge] = useState<UserBadge | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'achievement',
    level: 'bronze',
    icon: '🏆',
    color: '#22c55e',
    points: 100,
    requirements: '',
    requirements_condition: 'automatic',
    max_quantity: 0,
    is_active: true
  });

  // Award form
  const [awardData, setAwardData] = useState({
    user_email: '',
    badge_id: 0,
    notes: ''
  });

  // Get token
  const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    const cookies = document.cookie.split('; ');
    const adminTokenCookie = cookies.find(row => row.startsWith('admin_token='));
    if (adminTokenCookie) return adminTokenCookie.split('=')[1];
    return localStorage.getItem('admin_token') || localStorage.getItem('token');
  };

  // Fetch badges
  const fetchBadges = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());
      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (levelFilter !== 'all') params.append('level', levelFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(
        `${API_URL}/admin/badges?${params.toString()}`,
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
      const badgesData = data.data || data.badges || [];
      setBadges(badgesData);
      setTotalPages(Math.ceil((data.total || badgesData.length) / itemsPerPage));
      
    } catch (error) {
      console.error('Error fetching badges:', error);
      // Fallback mock data
      setBadges([
        {
          id: 1,
          badge_id: "BDG-001",
          name: "Verified Farmer",
          description: "Petani terverifikasi dengan dokumen lengkap",
          category: "verification",
          level: "gold",
          icon: "🌾",
          color: "#22c55e",
          points: 500,
          requirements: "Verifikasi dokumen petani",
          requirements_condition: "manual",
          max_quantity: 0,
          is_active: true,
          issued_count: 45,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z"
        },
        {
          id: 2,
          badge_id: "BDG-002",
          name: "Top Seller",
          description: "Seller dengan penjualan terbanyak bulan ini",
          category: "achievement",
          level: "platinum",
          icon: "⭐",
          color: "#eab308",
          points: 1000,
          requirements: "Top 10 seller bulan ini",
          requirements_condition: "automatic",
          max_quantity: 10,
          is_active: true,
          issued_count: 12,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z"
        },
        {
          id: 3,
          badge_id: "BDG-003",
          name: "Community Hero",
          description: "Kontributor aktif di komunitas",
          category: "special",
          level: "diamond",
          icon: "🏆",
          color: "#8b5cf6",
          points: 2000,
          requirements: "100+ komentar bermanfaat",
          requirements_condition: "automatic",
          max_quantity: 0,
          is_active: true,
          issued_count: 8,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z"
        }
      ]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, categoryFilter, levelFilter, statusFilter]);

  // Fetch user badges
  const fetchUserBadges = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/admin/user-badges`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) return;

      const data = await response.json();
      const userBadgesData = data.data || data.user_badges || [];
      setUserBadges(userBadgesData);
      
    } catch (error) {
      console.error('Error fetching user badges:', error);
      setUserBadges([
        {
          id: 1,
          user_id: 101,
          user_name: "Ahmad Fauzi",
          user_email: "ahmad@agrohub.com",
          user_type: "farmer",
          badge_id: 1,
          badge_name: "Verified Farmer",
          badge_category: "verification",
          badge_level: "gold",
          awarded_at: "2024-01-15T00:00:00Z",
          awarded_by: "Admin",
          is_displayed: true
        },
        {
          id: 2,
          user_id: 102,
          user_name: "Budi Santoso",
          user_email: "budi@agrohub.com",
          user_type: "vendor",
          badge_id: 2,
          badge_name: "Top Seller",
          badge_category: "achievement",
          badge_level: "platinum",
          awarded_at: "2024-01-10T00:00:00Z",
          awarded_by: "System",
          is_displayed: true
        }
      ]);
    }
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const token = getToken();
      
      if (!token) return;

      const response = await fetch(`${API_URL}/admin/badges/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) return;

      const data = await response.json();
      const statsData = data.data || data;
      
      setStats({
        total_badges: statsData.total_badges || 15,
        active_badges: statsData.active_badges || 12,
        total_issued: statsData.total_issued || 234,
        unique_users: statsData.unique_users || 156,
        this_month_issued: statsData.this_month_issued || 23,
        by_category: statsData.by_category || {
          achievement: 5,
          verification: 4,
          special: 3,
          membership: 3
        },
        by_level: statsData.by_level || {
          bronze: 3,
          silver: 4,
          gold: 4,
          platinum: 2,
          diamond: 2
        },
        most_issued: statsData.most_issued || [
          { name: "Verified Farmer", count: 45 },
          { name: "Top Seller", count: 12 },
          { name: "Community Hero", count: 8 }
        ]
      });
      
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  // Create badge
  const createBadge = async () => {
    setProcessing(true);
    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/admin/badges`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchBadges();
        fetchStats();
        setShowEditModal(false);
        setFormData({
          name: '',
          description: '',
          category: 'achievement',
          level: 'bronze',
          icon: '🏆',
          color: '#22c55e',
          points: 100,
          requirements: '',
          requirements_condition: 'automatic',
          max_quantity: 0,
          is_active: true
        });
      } else {
        const error = await response.json();
        alert(error.message || 'Gagal membuat badge');
      }
    } catch (error) {
      console.error('Error creating badge:', error);
      alert('Terjadi kesalahan');
    } finally {
      setProcessing(false);
    }
  };

  // Update badge status
  const updateBadgeStatus = async (badgeId: number, isActive: boolean) => {
    setProcessing(true);
    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/admin/badges/${badgeId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: isActive })
      });

      if (response.ok) {
        fetchBadges();
        fetchStats();
        setShowDetailModal(false);
        setSelectedBadge(null);
      } else {
        const error = await response.json();
        alert(error.message || 'Gagal mengupdate status');
      }
    } catch (error) {
      console.error('Error updating badge status:', error);
      alert('Terjadi kesalahan');
    } finally {
      setProcessing(false);
    }
  };

  // Award badge to user
  const awardBadge = async () => {
    setProcessing(true);
    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/admin/user-badges/award`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(awardData)
      });

      if (response.ok) {
        fetchUserBadges();
        fetchStats();
        setShowAwardModal(false);
        setAwardData({
          user_email: '',
          badge_id: 0,
          notes: ''
        });
      } else {
        const error = await response.json();
        alert(error.message || 'Gagal memberikan badge');
      }
    } catch (error) {
      console.error('Error awarding badge:', error);
      alert('Terjadi kesalahan');
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchBadges();
    fetchStats();
    fetchUserBadges();
  }, [fetchBadges, fetchStats, fetchUserBadges]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get category badge
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'achievement':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">🏆 Achievement</span>;
      case 'verification':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">✓ Verification</span>;
      case 'special':
        return <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">✨ Special</span>;
      case 'membership':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">👑 Membership</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{category}</span>;
    }
  };

  // Get level badge
  const getLevelBadge = (level: string) => {
    const colors: Record<string, string> = {
      bronze: 'bg-amber-600',
      silver: 'bg-gray-400',
      gold: 'bg-yellow-500',
      platinum: 'bg-cyan-600',
      diamond: 'bg-blue-600'
    };
    return (
      <span className={`px-2 py-1 ${colors[level] || 'bg-gray-500'} text-white text-xs rounded-full`}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    );
  };

  // Get level icon
  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'bronze': return '🥉';
      case 'silver': return '🥈';
      case 'gold': return '🥇';
      case 'platinum': return '💎';
      case 'diamond': return '🔷';
      default: return '🏅';
    }
  };

  // Get status badge
  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Active</span> :
      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Inactive</span>;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setLevelFilter('all');
    setStatusFilter('all');
  };

  const activeFiltersCount = (searchTerm ? 1 : 0) + (categoryFilter !== 'all' ? 1 : 0) + (levelFilter !== 'all' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0);

  if (loading && badges.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        <span className="ml-2 text-gray-500">Memuat data badges...</span>
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
              <Medal className="w-6 h-6 text-green-600" />
              <h1 className="text-2xl font-bold capitalize text-gray-800">
                Badges Management
              </h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Kelola badge prestasi dan penghargaan pengguna
            </p>
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Badge
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Medal className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.total_badges}</p>
          <p className="text-xs text-gray-500">Total badge</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-xs text-gray-400">Active</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.active_badges}</p>
          <p className="text-xs text-gray-500">Badge aktif</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-xs text-gray-400">Issued</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.total_issued}</p>
          <p className="text-xs text-gray-500">Total diberikan</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-purple-500" />
            <span className="text-xs text-gray-400">Users</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.unique_users}</p>
          <p className="text-xs text-gray-500">User penerima</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            <span className="text-xs text-gray-400">This Month</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.this_month_issued}</p>
          <p className="text-xs text-gray-500">Bulan ini</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-5 h-5 text-indigo-500" />
            <span className="text-xs text-gray-400">Categories</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{Object.keys(stats.by_category).length}</p>
          <p className="text-xs text-gray-500">Kategori</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-5 h-5 text-pink-500" />
            <span className="text-xs text-gray-400">Levels</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{Object.keys(stats.by_level).length}</p>
          <p className="text-xs text-gray-500">Tingkatan</p>
        </div>
      </div>

      {/* TABS */}
      <div className="border-b">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('badges')}
            className={`pb-3 px-2 font-medium transition ${
              activeTab === 'badges'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Badges
          </button>
          <button
            onClick={() => setActiveTab('user-badges')}
            className={`pb-3 px-2 font-medium transition ${
              activeTab === 'user-badges'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            User Badges
          </button>
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
                placeholder={activeTab === 'badges' ? "Cari badge..." : "Cari user badges..."}
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
          {activeTab === 'badges' && (
            <div className="hidden lg:flex items-center gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none text-sm"
              >
                <option value="all">Semua Kategori</option>
                <option value="achievement">Achievement</option>
                <option value="verification">Verification</option>
                <option value="special">Special</option>
                <option value="membership">Membership</option>
              </select>

              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none text-sm"
              >
                <option value="all">Semua Level</option>
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
                <option value="diamond">Diamond</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none text-sm"
              >
                <option value="all">Semua Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}

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
        {showFilters && activeTab === 'badges' && (
          <div className="lg:hidden mt-4 pt-4 border-t space-y-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50"
            >
              <option value="all">Semua Kategori</option>
              <option value="achievement">Achievement</option>
              <option value="verification">Verification</option>
              <option value="special">Special</option>
              <option value="membership">Membership</option>
            </select>

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50"
            >
              <option value="all">Semua Level</option>
              <option value="bronze">Bronze</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
              <option value="platinum">Platinum</option>
              <option value="diamond">Diamond</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50"
            >
              <option value="all">Semua Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        )}
      </div>

      {/* BADGES TABLE */}
      {activeTab === 'badges' && (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">Badge</th>
                  <th className="px-4 py-3 font-medium">Kategori</th>
                  <th className="px-4 py-3 font-medium">Level</th>
                  <th className="px-4 py-3 font-medium">Points</th>
                  <th className="px-4 py-3 font-medium">Issued</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {badges.length > 0 ? (
                  badges.map((badge) => (
                    <tr key={badge.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-100 to-amber-100 flex items-center justify-center text-2xl">
                            {badge.icon}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{badge.name}</p>
                            <p className="text-xs text-gray-400 line-clamp-1">{badge.description}</p>
                          </div>
                        </div>
                       </td>
                      <td className="px-4 py-3">{getCategoryBadge(badge.category)}</td>
                      <td className="px-4 py-3">{getLevelBadge(badge.level)}</td>
                      <td className="px-4 py-3">{badge.points}</td>
                      <td className="px-4 py-3">{badge.issued_count}</td>
                      <td className="px-4 py-3">{getStatusBadge(badge.is_active)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedBadge(badge);
                              setShowDetailModal(true);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4 text-blue-500" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBadge(badge);
                              setFormData({
                                name: badge.name,
                                description: badge.description,
                                category: badge.category,
                                level: badge.level,
                                icon: badge.icon,
                                color: badge.color,
                                points: badge.points,
                                requirements: badge.requirements,
                                requirements_condition: badge.requirements_condition,
                                max_quantity: badge.max_quantity,
                                is_active: badge.is_active
                              });
                              setShowEditModal(true);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-green-500" />
                          </button>
                        </div>
                       </td>
                     </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                      <Medal className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Belum ada data badge</p>
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
                Menampilkan {badges.length} dari {stats.total_badges} badge
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
      )}

      {/* USER BADGES TABLE */}
      {activeTab === 'user-badges' && (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-800">User Badges</h3>
            </div>
            <button
              onClick={() => setShowAwardModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Award Badge
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Badge</th>
                  <th className="px-4 py-3 font-medium">Level</th>
                  <th className="px-4 py-3 font-medium">Awarded Date</th>
                  <th className="px-4 py-3 font-medium">Awarded By</th>
                  <th className="px-4 py-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {userBadges.length > 0 ? (
                  userBadges.map((ub) => (
                    <tr key={ub.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{ub.user_name}</p>
                        <p className="text-xs text-gray-400">{ub.user_email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{ub.badge_name === "Verified Farmer" ? "🌾" : ub.badge_name === "Top Seller" ? "⭐" : "🏆"}</span>
                          <span className="font-medium">{ub.badge_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{getLevelBadge(ub.badge_level)}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(ub.awarded_at)}</td>
                      <td className="px-4 py-3">{ub.awarded_by}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setSelectedUserBadge(ub);
                            setShowDetailModal(true);
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
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Belum ada data user badge</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Badge Detail Modal */}
      {showDetailModal && selectedBadge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{selectedBadge.name}</h3>
                  <p className="text-sm text-gray-500">{selectedBadge.badge_id}</p>
                </div>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedBadge(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Badge Preview */}
              <div className="flex items-center gap-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-200 to-amber-200 flex items-center justify-center text-5xl shadow-lg">
                  {selectedBadge.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getLevelBadge(selectedBadge.level)}
                    {getCategoryBadge(selectedBadge.category)}
                  </div>
                  <p className="text-gray-600">{selectedBadge.description}</p>
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Status Badge</p>
                    <div className="mt-2">{getStatusBadge(selectedBadge.is_active)}</div>
                  </div>
                  <button
                    onClick={() => updateBadgeStatus(selectedBadge.id, !selectedBadge.is_active)}
                    disabled={processing}
                    className={`px-4 py-2 rounded-xl text-white transition ${
                      selectedBadge.is_active 
                        ? 'bg-gray-500 hover:bg-gray-600' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {selectedBadge.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>

              {/* Badge Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Points</p>
                  <p className="text-2xl font-bold text-green-600">{selectedBadge.points}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Issued Count</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedBadge.issued_count}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Max Quantity</p>
                  <p className="font-medium">{selectedBadge.max_quantity === 0 ? 'Unlimited' : selectedBadge.max_quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Condition</p>
                  <p className="font-medium capitalize">{selectedBadge.requirements_condition}</p>
                </div>
              </div>

              {/* Requirements */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-2">Syarat & Ketentuan</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-xl">{selectedBadge.requirements}</p>
              </div>

              {/* Timestamps */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Informasi Waktu</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Dibuat</p>
                    <p className="font-medium">{formatDate(selectedBadge.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Terakhir Update</p>
                    <p className="font-medium">{formatDate(selectedBadge.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Badge Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">{selectedBadge ? 'Edit Badge' : 'Add Badge'}</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedBadge(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Nama Badge</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Icon (Emoji)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full p-2 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 rounded-xl border border-gray-200"
                  >
                    <option value="achievement">Achievement</option>
                    <option value="verification">Verification</option>
                    <option value="special">Special</option>
                    <option value="membership">Membership</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full p-2 rounded-xl border border-gray-200"
                  >
                    <option value="bronze">Bronze</option>
                    <option value="silver">Silver</option>
                    <option value="gold">Gold</option>
                    <option value="platinum">Platinum</option>
                    <option value="diamond">Diamond</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Points</label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Max Quantity</label>
                  <input
                    type="number"
                    value={formData.max_quantity}
                    onChange={(e) => setFormData({ ...formData, max_quantity: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Condition</label>
                  <select
                    value={formData.requirements_condition}
                    onChange={(e) => setFormData({ ...formData, requirements_condition: e.target.value })}
                    className="w-full p-2 rounded-xl border border-gray-200"
                  >
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  <label className="text-sm text-gray-700">Active</label>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full p-2 rounded-xl border border-gray-200"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Syarat & Ketentuan</label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  rows={3}
                  className="w-full p-2 rounded-xl border border-gray-200"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedBadge(null);
                  }}
                  className="flex-1 px-4 py-2 border rounded-xl hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  onClick={createBadge}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50"
                >
                  {processing ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null}
                  {selectedBadge ? 'Update' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Award Badge Modal */}
      {showAwardModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Award Badge</h3>
                <button
                  onClick={() => {
                    setShowAwardModal(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Email User</label>
                <input
                  type="email"
                  value={awardData.user_email}
                  onChange={(e) => setAwardData({ ...awardData, user_email: e.target.value })}
                  placeholder="user@example.com"
                  className="w-full p-2 rounded-xl border border-gray-200"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Badge</label>
                <select
                  value={awardData.badge_id}
                  onChange={(e) => setAwardData({ ...awardData, badge_id: Number(e.target.value) })}
                  className="w-full p-2 rounded-xl border border-gray-200"
                >
                  <option value={0}>Pilih badge</option>
                  {badges.filter(b => b.is_active).map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.points} pts)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Catatan (Opsional)</label>
                <textarea
                  value={awardData.notes}
                  onChange={(e) => setAwardData({ ...awardData, notes: e.target.value })}
                  rows={2}
                  placeholder="Alasan pemberian badge..."
                  className="w-full p-2 rounded-xl border border-gray-200"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setShowAwardModal(false)}
                  className="flex-1 px-4 py-2 border rounded-xl hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  onClick={awardBadge}
                  disabled={processing || !awardData.user_email || !awardData.badge_id}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50"
                >
                  {processing ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null}
                  Award Badge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}