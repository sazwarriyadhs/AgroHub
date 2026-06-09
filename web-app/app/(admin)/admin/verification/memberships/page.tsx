'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Loader2, 
  Award,
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
  DollarSign,
  Users,
  TrendingUp,
  Download,
  Plus,
  Edit,
  Trash2,
  Crown,
  Star,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

// Types
interface Membership {
  id: number;
  membership_id: string;
  name: string;
  description: string;
  type: 'basic' | 'premium' | 'business' | 'enterprise';
  price: number;
  duration_days: number;
  features: string[];
  benefits: string[];
  max_products?: number;
  max_stores?: number;
  commission_rate: number;
  priority_support: boolean;
  analytics_access: boolean;
  api_access: boolean;
  status: 'active' | 'inactive' | 'coming_soon';
  user_count: number;
  created_at: string;
  updated_at: string;
}

interface UserMembership {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  user_type: string;
  membership_id: number;
  membership_name: string;
  membership_type: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  payment_status: 'paid' | 'pending' | 'failed';
  auto_renew: boolean;
  amount_paid: number;
  created_at: string;
}

interface MembershipStats {
  total_memberships: number;
  active_memberships: number;
  total_users: number;
  total_revenue: number;
  monthly_revenue: number;
  basic_count: number;
  premium_count: number;
  business_count: number;
  enterprise_count: number;
  expiring_soon: number;
  conversion_rate: number;
  avg_duration: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

export default function MembershipsPage() {
  const [loading, setLoading] = useState(true);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [userMemberships, setUserMemberships] = useState<UserMembership[]>([]);
  const [stats, setStats] = useState<MembershipStats>({
    total_memberships: 0,
    active_memberships: 0,
    total_users: 0,
    total_revenue: 0,
    monthly_revenue: 0,
    basic_count: 0,
    premium_count: 0,
    business_count: 0,
    enterprise_count: 0,
    expiring_soon: 0,
    conversion_rate: 0,
    avg_duration: 0
  });
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'plans' | 'user-memberships'>('plans');
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const [selectedUserMembership, setSelectedUserMembership] = useState<UserMembership | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'basic',
    price: 0,
    duration_days: 30,
    commission_rate: 5,
    priority_support: false,
    analytics_access: false,
    api_access: false,
    status: 'active'
  });

  // Assign form
  const [assignData, setAssignData] = useState({
    user_email: '',
    membership_id: 0,
    duration_days: 30,
    auto_renew: false
  });

  // Get token
  const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    const cookies = document.cookie.split('; ');
    const adminTokenCookie = cookies.find(row => row.startsWith('admin_token='));
    if (adminTokenCookie) return adminTokenCookie.split('=')[1];
    return localStorage.getItem('admin_token') || localStorage.getItem('token');
  };

  // Fetch memberships
  const fetchMemberships = useCallback(async () => {
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
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(
        `${API_URL}/admin/memberships?${params.toString()}`,
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
      const membershipsData = data.data || data.memberships || [];
      setMemberships(membershipsData);
      setTotalPages(Math.ceil((data.total || membershipsData.length) / itemsPerPage));
      
    } catch (error) {
      console.error('Error fetching memberships:', error);
      // Fallback mock data
      setMemberships([
        {
          id: 1,
          membership_id: "MBR-001",
          name: "Basic Plan",
          description: "Paket dasar untuk pemula",
          type: "basic",
          price: 99000,
          duration_days: 30,
          features: ["Akses marketplace", "5 produk", "1 toko"],
          benefits: ["Support 24/7"],
          max_products: 5,
          max_stores: 1,
          commission_rate: 10,
          priority_support: false,
          analytics_access: false,
          api_access: false,
          status: "active",
          user_count: 45,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z"
        },
        {
          id: 2,
          membership_id: "MBR-002",
          name: "Premium Plan",
          description: "Paket premium untuk penjual aktif",
          type: "premium",
          price: 299000,
          duration_days: 30,
          features: ["Akses marketplace", "50 produk", "3 toko", "Analytics"],
          benefits: ["Priority support", "Featured store"],
          max_products: 50,
          max_stores: 3,
          commission_rate: 7,
          priority_support: true,
          analytics_access: true,
          api_access: false,
          status: "active",
          user_count: 28,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z"
        },
        {
          id: 3,
          membership_id: "MBR-003",
          name: "Business Plan",
          description: "Paket bisnis untuk skala besar",
          type: "business",
          price: 599000,
          duration_days: 30,
          features: ["Akses marketplace", "Unlimited produk", "5 toko", "Analytics", "API Access"],
          benefits: ["Priority support", "Verified badge", "Featured store"],
          max_products: -1,
          max_stores: 5,
          commission_rate: 5,
          priority_support: true,
          analytics_access: true,
          api_access: true,
          status: "active",
          user_count: 12,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z"
        }
      ]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

  // Fetch user memberships
  const fetchUserMemberships = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/admin/user-memberships`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) return;

      const data = await response.json();
      const userMembershipsData = data.data || data.user_memberships || [];
      setUserMemberships(userMembershipsData);
      
    } catch (error) {
      console.error('Error fetching user memberships:', error);
      setUserMemberships([
        {
          id: 1,
          user_id: 101,
          user_name: "Ahmad Fauzi",
          user_email: "ahmad@agrohub.com",
          user_type: "farmer",
          membership_id: 1,
          membership_name: "Basic Plan",
          membership_type: "basic",
          start_date: "2024-01-15T00:00:00Z",
          end_date: "2024-02-14T00:00:00Z",
          status: "active",
          payment_status: "paid",
          auto_renew: true,
          amount_paid: 99000,
          created_at: "2024-01-15T00:00:00Z"
        },
        {
          id: 2,
          user_id: 102,
          user_name: "Budi Santoso",
          user_email: "budi@agrohub.com",
          user_type: "vendor",
          membership_id: 2,
          membership_name: "Premium Plan",
          membership_type: "premium",
          start_date: "2024-01-10T00:00:00Z",
          end_date: "2024-02-09T00:00:00Z",
          status: "active",
          payment_status: "paid",
          auto_renew: true,
          amount_paid: 299000,
          created_at: "2024-01-10T00:00:00Z"
        }
      ]);
    }
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const token = getToken();
      
      if (!token) return;

      const response = await fetch(`${API_URL}/admin/memberships/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) return;

      const data = await response.json();
      const statsData = data.data || data;
      
      setStats({
        total_memberships: statsData.total_memberships || 89,
        active_memberships: statsData.active_memberships || 67,
        total_users: statsData.total_users || 1250,
        total_revenue: statsData.total_revenue || 125000000,
        monthly_revenue: statsData.monthly_revenue || 45000000,
        basic_count: statsData.basic_count || 45,
        premium_count: statsData.premium_count || 28,
        business_count: statsData.business_count || 12,
        enterprise_count: statsData.enterprise_count || 4,
        expiring_soon: statsData.expiring_soon || 8,
        conversion_rate: statsData.conversion_rate || 15.5,
        avg_duration: statsData.avg_duration || 8.5
      });
      
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        total_memberships: 89,
        active_memberships: 67,
        total_users: 1250,
        total_revenue: 125000000,
        monthly_revenue: 45000000,
        basic_count: 45,
        premium_count: 28,
        business_count: 12,
        enterprise_count: 4,
        expiring_soon: 8,
        conversion_rate: 15.5,
        avg_duration: 8.5
      });
    }
  }, []);

  // Create membership
  const createMembership = async () => {
    setProcessing(true);
    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/admin/memberships`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchMemberships();
        setShowEditModal(false);
        setFormData({
          name: '',
          description: '',
          type: 'basic',
          price: 0,
          duration_days: 30,
          commission_rate: 5,
          priority_support: false,
          analytics_access: false,
          api_access: false,
          status: 'active'
        });
      } else {
        const error = await response.json();
        alert(error.message || 'Gagal membuat membership');
      }
    } catch (error) {
      console.error('Error creating membership:', error);
      alert('Terjadi kesalahan');
    } finally {
      setProcessing(false);
    }
  };

  // Update membership status
  const updateMembershipStatus = async (membershipId: number, status: string) => {
    setProcessing(true);
    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/admin/memberships/${membershipId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchMemberships();
        setShowDetailModal(false);
        setSelectedMembership(null);
      } else {
        const error = await response.json();
        alert(error.message || 'Gagal mengupdate status');
      }
    } catch (error) {
      console.error('Error updating membership status:', error);
      alert('Terjadi kesalahan');
    } finally {
      setProcessing(false);
    }
  };

  // Assign membership to user
  const assignMembership = async () => {
    setProcessing(true);
    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/admin/user-memberships/assign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(assignData)
      });

      if (response.ok) {
        fetchUserMemberships();
        fetchStats();
        setShowAssignModal(false);
        setAssignData({
          user_email: '',
          membership_id: 0,
          duration_days: 30,
          auto_renew: false
        });
      } else {
        const error = await response.json();
        alert(error.message || 'Gagal assign membership');
      }
    } catch (error) {
      console.error('Error assigning membership:', error);
      alert('Terjadi kesalahan');
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
    fetchStats();
    fetchUserMemberships();
  }, [fetchMemberships, fetchStats, fetchUserMemberships]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get membership type badge
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'basic':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Basic</span>;
      case 'premium':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Premium</span>;
      case 'business':
        return <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Business</span>;
      case 'enterprise':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Enterprise</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{type}</span>;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Active</span>;
      case 'inactive':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Inactive</span>;
      case 'coming_soon':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Coming Soon</span>;
      case 'expired':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1"><XCircle className="w-3 h-3" /> Expired</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Cancelled</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{status}</span>;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  const activeFiltersCount = (searchTerm ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0);

  if (loading && memberships.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        <span className="ml-2 text-gray-500">Memuat data memberships...</span>
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
              <Award className="w-6 h-6 text-green-600" />
              <h1 className="text-2xl font-bold capitalize text-gray-800">
                Memberships Management
              </h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Kelola paket membership dan langganan pengguna
            </p>
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Membership
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.total_memberships}</p>
          <p className="text-xs text-gray-500">Membership aktif</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-green-500" />
            <span className="text-xs text-gray-400">Users</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.total_users.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Total user</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-xs text-gray-400">Revenue</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{formatCurrency(stats.total_revenue)}</p>
          <p className="text-xs text-gray-500">Total pendapatan</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <span className="text-xs text-gray-400">Monthly</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{formatCurrency(stats.monthly_revenue)}</p>
          <p className="text-xs text-gray-500">Pendapatan bulanan</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-gray-400">Basic</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.basic_count}</p>
          <p className="text-xs text-gray-500">Basic plan</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            <span className="text-xs text-gray-400">Premium+</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.premium_count + stats.business_count + stats.enterprise_count}</p>
          <p className="text-xs text-gray-500">Premium plans</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <span className="text-xs text-gray-400">Expiring</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.expiring_soon}</p>
          <p className="text-xs text-gray-500">Akan kadaluarsa</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-teal-500" />
            <span className="text-xs text-gray-400">Conversion</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.conversion_rate}%</p>
          <p className="text-xs text-gray-500">Konversi</p>
        </div>
      </div>

      {/* TABS */}
      <div className="border-b">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('plans')}
            className={`pb-3 px-2 font-medium transition ${
              activeTab === 'plans'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Membership Plans
          </button>
          <button
            onClick={() => setActiveTab('user-memberships')}
            className={`pb-3 px-2 font-medium transition ${
              activeTab === 'user-memberships'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            User Memberships
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
                placeholder={activeTab === 'plans' ? "Cari membership plan..." : "Cari user membership..."}
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
          {activeTab === 'plans' && (
            <div className="hidden lg:flex items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none text-sm"
              >
                <option value="all">Semua Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="coming_soon">Coming Soon</option>
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
        {showFilters && activeTab === 'plans' && (
          <div className="lg:hidden mt-4 pt-4 border-t space-y-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50"
            >
              <option value="all">Semua Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="coming_soon">Coming Soon</option>
            </select>
          </div>
        )}
      </div>

      {/* MEMBERSHIP PLANS TABLE */}
      {activeTab === 'plans' && (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">Nama</th>
                  <th className="px-4 py-3 font-medium">Tipe</th>
                  <th className="px-4 py-3 font-medium">Harga</th>
                  <th className="px-4 py-3 font-medium">Durasi</th>
                  <th className="px-4 py-3 font-medium">Komisi</th>
                  <th className="px-4 py-3 font-medium">Users</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {memberships.length > 0 ? (
                  memberships.map((membership) => (
                    <tr key={membership.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{membership.name}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{membership.description}</p>
                      </td>
                      <td className="px-4 py-3">{getTypeBadge(membership.type)}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-green-600">{formatCurrency(membership.price)}</p>
                        <p className="text-xs text-gray-400">/{membership.duration_days} hari</p>
                      </td>
                      <td className="px-4 py-3">{membership.duration_days} hari</td>
                      <td className="px-4 py-3">{membership.commission_rate}%</td>
                      <td className="px-4 py-3">{membership.user_count}</td>
                      <td className="px-4 py-3">{getStatusBadge(membership.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedMembership(membership);
                              setShowDetailModal(true);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4 text-blue-500" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedMembership(membership);
                              setFormData({
                                name: membership.name,
                                description: membership.description,
                                type: membership.type,
                                price: membership.price,
                                duration_days: membership.duration_days,
                                commission_rate: membership.commission_rate,
                                priority_support: membership.priority_support,
                                analytics_access: membership.analytics_access,
                                api_access: membership.api_access,
                                status: membership.status
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
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                      <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Belum ada data membership</p>
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
                Menampilkan {memberships.length} dari {stats.total_memberships} membership
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

      {/* USER MEMBERSHIPS TABLE */}
      {activeTab === 'user-memberships' && (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-800">User Memberships</h3>
            </div>
            <button
              onClick={() => setShowAssignModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Assign Membership
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Membership</th>
                  <th className="px-4 py-3 font-medium">Periode</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium">Auto Renew</th>
                  <th className="px-4 py-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {userMemberships.length > 0 ? (
                  userMemberships.map((um) => (
                    <tr key={um.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{um.user_name}</p>
                        <p className="text-xs text-gray-400">{um.user_email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{um.membership_name}</p>
                        {getTypeBadge(um.membership_type)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs">{formatDate(um.start_date)} - {formatDate(um.end_date)}</p>
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(um.status)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          um.payment_status === 'paid' ? 'bg-green-100 text-green-700' :
                          um.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {um.payment_status}
                        </span>
                       </td>
                      <td className="px-4 py-3">
                        {um.auto_renew ? 
                          <span className="text-green-600">✓ Yes</span> : 
                          <span className="text-gray-400">✗ No</span>
                        }
                       </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setSelectedUserMembership(um);
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
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Belum ada data user membership</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Membership Detail Modal */}
      {showDetailModal && selectedMembership && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{selectedMembership.name}</h3>
                  <p className="text-sm text-gray-500">{selectedMembership.membership_id}</p>
                </div>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedMembership(null);
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
                    <p className="text-sm text-gray-500">Status Membership</p>
                    <div className="mt-2">{getStatusBadge(selectedMembership.status)}</div>
                  </div>
                  <select
                    value={selectedMembership.status}
                    onChange={(e) => updateMembershipStatus(selectedMembership.id, e.target.value)}
                    disabled={processing}
                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="coming_soon">Coming Soon</option>
                  </select>
                </div>
              </div>

              {/* Membership Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tipe</p>
                  <p className="font-medium">{getTypeBadge(selectedMembership.type)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Harga</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(selectedMembership.price)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Durasi</p>
                  <p className="font-medium">{selectedMembership.duration_days} hari</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Komisi</p>
                  <p className="font-medium">{selectedMembership.commission_rate}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total User</p>
                  <p className="font-medium">{selectedMembership.user_count} user</p>
                </div>
              </div>

              {/* Features */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Fitur</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedMembership.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Benefits</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMembership.benefits.map((benefit, idx) => (
                    <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>

              {/* Access Flags */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Akses</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    {selectedMembership.priority_support ? 
                      <CheckCircle className="w-4 h-4 text-green-500" /> : 
                      <XCircle className="w-4 h-4 text-gray-300" />
                    }
                    <span className="text-sm">Priority Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedMembership.analytics_access ? 
                      <CheckCircle className="w-4 h-4 text-green-500" /> : 
                      <XCircle className="w-4 h-4 text-gray-300" />
                    }
                    <span className="text-sm">Analytics Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedMembership.api_access ? 
                      <CheckCircle className="w-4 h-4 text-green-500" /> : 
                      <XCircle className="w-4 h-4 text-gray-300" />
                    }
                    <span className="text-sm">API Access</span>
                  </div>
                </div>
              </div>

              {/* Limits */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Batas</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Maks. Produk</p>
                    <p className="font-medium">{selectedMembership.max_products === -1 ? 'Unlimited' : selectedMembership.max_products}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Maks. Toko</p>
                    <p className="font-medium">{selectedMembership.max_stores === -1 ? 'Unlimited' : selectedMembership.max_stores}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-2">Deskripsi</h4>
                <p className="text-gray-600">{selectedMembership.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Membership Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">{selectedMembership ? 'Edit Membership' : 'Add Membership'}</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedMembership(null);
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
                  <label className="text-sm text-gray-500 mb-1 block">Nama</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Tipe</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-2 rounded-xl border border-gray-200"
                  >
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="business">Business</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Harga</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Durasi (hari)</label>
                  <input
                    type="number"
                    value={formData.duration_days}
                    onChange={(e) => setFormData({ ...formData, duration_days: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Komisi (%)</label>
                  <input
                    type="number"
                    value={formData.commission_rate}
                    onChange={(e) => setFormData({ ...formData, commission_rate: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2 rounded-xl border border-gray-200"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="coming_soon">Coming Soon</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full p-2 rounded-xl border border-gray-200"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.priority_support}
                    onChange={(e) => setFormData({ ...formData, priority_support: e.target.checked })}
                  />
                  Priority Support
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.analytics_access}
                    onChange={(e) => setFormData({ ...formData, analytics_access: e.target.checked })}
                  />
                  Analytics Access
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.api_access}
                    onChange={(e) => setFormData({ ...formData, api_access: e.target.checked })}
                  />
                  API Access
                </label>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedMembership(null);
                  }}
                  className="flex-1 px-4 py-2 border rounded-xl hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  onClick={createMembership}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50"
                >
                  {processing ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null}
                  {selectedMembership ? 'Update' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Membership Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Assign Membership</h3>
                <button
                  onClick={() => {
                    setShowAssignModal(false);
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
                  value={assignData.user_email}
                  onChange={(e) => setAssignData({ ...assignData, user_email: e.target.value })}
                  placeholder="user@example.com"
                  className="w-full p-2 rounded-xl border border-gray-200"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Membership Plan</label>
                <select
                  value={assignData.membership_id}
                  onChange={(e) => setAssignData({ ...assignData, membership_id: Number(e.target.value) })}
                  className="w-full p-2 rounded-xl border border-gray-200"
                >
                  <option value={0}>Pilih membership</option>
                  {memberships.filter(m => m.status === 'active').map(m => (
                    <option key={m.id} value={m.id}>{m.name} - {formatCurrency(m.price)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Durasi (hari)</label>
                <input
                  type="number"
                  value={assignData.duration_days}
                  onChange={(e) => setAssignData({ ...assignData, duration_days: Number(e.target.value) })}
                  className="w-full p-2 rounded-xl border border-gray-200"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={assignData.auto_renew}
                  onChange={(e) => setAssignData({ ...assignData, auto_renew: e.target.checked })}
                />
                Auto Renew
              </label>
              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 px-4 py-2 border rounded-xl hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  onClick={assignMembership}
                  disabled={processing || !assignData.user_email || !assignData.membership_id}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50"
                >
                  {processing ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null}
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}