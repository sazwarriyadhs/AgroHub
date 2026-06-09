'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Loader2, 
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
  Eye,
  Filter,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Printer,
  Mail,
  Share2,
  FileSpreadsheet,
  FileJson,
  FileImage
} from 'lucide-react';
import {
  LineChart as ReLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface Report {
  id: number;
  report_id: string;
  title: string;
  description: string;
  type: 'financial' | 'sales' | 'user' | 'product' | 'commodity' | 'custom';
  format: 'pdf' | 'excel' | 'csv' | 'json';
  period: string;
  generated_at: string;
  generated_by: string;
  size: string;
  status: 'ready' | 'processing' | 'failed';
  downloads: number;
  url?: string;
}

interface ReportTemplate {
  id: number;
  name: string;
  description: string;
  type: string;
  icon: JSX.Element;
}

interface ReportStats {
  total_reports: number;
  this_month: number;
  most_downloaded: {
    name: string;
    downloads: number;
  };
  popular_type: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

const reportTemplates: ReportTemplate[] = [
  { id: 1, name: 'Laporan Keuangan', description: 'Ringkasan pendapatan, profit, dan cash flow', type: 'financial', icon: <DollarSign className="w-5 h-5" /> },
  { id: 2, name: 'Laporan Penjualan', description: 'Analisis penjualan per produk dan kategori', type: 'sales', icon: <TrendingUp className="w-5 h-5" /> },
  { id: 3, name: 'Laporan User', description: 'Data pertumbuhan user dan engagement', type: 'user', icon: <Activity className="w-5 h-5" /> },
  { id: 4, name: 'Laporan Produk', description: 'Performa produk terlaris', type: 'product', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 5, name: 'Laporan Komoditas', description: 'Harga komoditas pertanian', type: 'commodity', icon: <PieChart className="w-5 h-5" /> },
  { id: 6, name: 'Laporan Kustom', description: 'Buat laporan sesuai kebutuhan', type: 'custom', icon: <FileText className="w-5 h-5" /> },
];

const COLORS = ['#22c55e', '#3b82f6', '#eab308', '#ef4444', '#8b5cf6'];

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<ReportStats>({
    total_reports: 0,
    this_month: 0,
    most_downloaded: { name: '', downloads: 0 },
    popular_type: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState('30days');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [customDateStart, setCustomDateStart] = useState('');
  const [customDateEnd, setCustomDateEnd] = useState('');
  const itemsPerPage = 10;

  const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    const cookies = document.cookie.split('; ');
    const adminTokenCookie = cookies.find(row => row.startsWith('admin_token='));
    if (adminTokenCookie) return adminTokenCookie.split('=')[1];
    return localStorage.getItem('admin_token') || localStorage.getItem('token');
  };

  const fetchReports = useCallback(async () => {
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
      if (typeFilter !== 'all') params.append('type', typeFilter);
      if (dateRange !== 'all') params.append('range', dateRange);

      const response = await fetch(`${API_URL}/admin/reports?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const reportsData = data.data || data.reports || [];
      setReports(reportsData);
      setTotalPages(Math.ceil((data.total || reportsData.length) / itemsPerPage));
      
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReports([
        {
          id: 1,
          report_id: "RPT-2024-001",
          title: "Laporan Keuangan Q2 2024",
          description: "Ringkasan pendapatan, profit, dan cash flow Q2 2024",
          type: "financial",
          format: "pdf",
          period: "Q2 2024",
          generated_at: "2024-07-01T10:30:00Z",
          generated_by: "System",
          size: "2.4 MB",
          status: "ready",
          downloads: 45,
          url: "#"
        },
        {
          id: 2,
          report_id: "RPT-2024-002",
          title: "Laporan Penjualan Juni 2024",
          description: "Analisis penjualan per produk dan kategori bulan Juni",
          type: "sales",
          format: "excel",
          period: "Juni 2024",
          generated_at: "2024-07-02T14:15:00Z",
          generated_by: "System",
          size: "1.8 MB",
          status: "ready",
          downloads: 32,
          url: "#"
        },
        {
          id: 3,
          report_id: "RPT-2024-003",
          title: "Laporan User Growth",
          description: "Data pertumbuhan user dan engagement",
          type: "user",
          format: "pdf",
          period: "Q2 2024",
          generated_at: "2024-07-03T09:00:00Z",
          generated_by: "Admin",
          size: "1.2 MB",
          status: "ready",
          downloads: 28,
          url: "#"
        }
      ]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, typeFilter, dateRange]);

  const fetchStats = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/admin/reports/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) return;

      const data = await response.json();
      const statsData = data.data || data;
      
      setStats({
        total_reports: statsData.total_reports || 45,
        this_month: statsData.this_month || 12,
        most_downloaded: statsData.most_downloaded || { name: 'Laporan Keuangan', downloads: 156 },
        popular_type: statsData.popular_type || 'financial'
      });
      
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        total_reports: 45,
        this_month: 12,
        most_downloaded: { name: 'Laporan Keuangan', downloads: 156 },
        popular_type: 'financial'
      });
    }
  }, []);

  const generateReport = async () => {
    if (!selectedTemplate) return;
    
    setGenerating(true);
    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/admin/reports/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          template_id: selectedTemplate.id,
          type: selectedTemplate.type,
          date_range: {
            start: customDateStart,
            end: customDateEnd
          }
        })
      });

      if (response.ok) {
        fetchReports();
        fetchStats();
        setSelectedTemplate(null);
        setCustomDateStart('');
        setCustomDateEnd('');
        alert('Report generation started. You will be notified when ready.');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Terjadi kesalahan');
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, [fetchReports, fetchStats]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeBadge = (type: string) => {
    const types: Record<string, { label: string; color: string }> = {
      financial: { label: 'Financial', color: 'bg-green-100 text-green-700' },
      sales: { label: 'Sales', color: 'bg-blue-100 text-blue-700' },
      user: { label: 'User', color: 'bg-purple-100 text-purple-700' },
      product: { label: 'Product', color: 'bg-orange-100 text-orange-700' },
      commodity: { label: 'Commodity', color: 'bg-amber-100 text-amber-700' },
      custom: { label: 'Custom', color: 'bg-gray-100 text-gray-700' }
    };
    const t = types[type] || { label: type, color: 'bg-gray-100 text-gray-700' };
    return <span className={`px-2 py-1 text-xs rounded-full ${t.color}`}>{t.label}</span>;
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return <FileText className="w-4 h-4 text-red-500" />;
      case 'excel': return <FileSpreadsheet className="w-4 h-4 text-green-600" />;
      case 'csv': return <FileJson className="w-4 h-4 text-blue-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Ready</span>;
      case 'processing':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> Processing</span>;
      case 'failed':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Failed</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{status}</span>;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setDateRange('30days');
  };

  const activeFiltersCount = (searchTerm ? 1 : 0) + (typeFilter !== 'all' ? 1 : 0);

  if (loading && reports.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        <span className="ml-2 text-gray-500">Memuat data reports...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-green-600" />
              <h1 className="text-2xl font-bold capitalize text-gray-800">
                Reports Center
              </h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Generate, download, and manage platform reports
            </p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
            + Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.total_reports}</p>
          <p className="text-xs text-gray-500">Total reports</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-green-500" />
            <span className="text-xs text-gray-400">This Month</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.this_month}</p>
          <p className="text-xs text-gray-500">Generated this month</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <span className="text-xs text-gray-400">Most Downloaded</span>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800">{stats.most_downloaded.downloads}</p>
            <p className="text-xs text-gray-500">{stats.most_downloaded.name}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <PieChart className="w-5 h-5 text-orange-500" />
            <span className="text-xs text-gray-400">Popular Type</span>
          </div>
          <p className="text-xl font-bold text-gray-800 capitalize">{stats.popular_type}</p>
          <p className="text-xs text-gray-500">Most requested</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-green-600" />
          Report Templates
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {reportTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className="p-4 border rounded-xl hover:border-green-300 hover:shadow-md transition group text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-3 group-hover:bg-green-200">
                {template.icon}
              </div>
              <h4 className="font-medium text-gray-800 text-sm">{template.name}</h4>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{template.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari report..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />
            </div>
          </div>

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

          <div className="hidden lg:flex items-center gap-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none text-sm"
            >
              <option value="all">Semua Tipe</option>
              <option value="financial">Financial</option>
              <option value="sales">Sales</option>
              <option value="user">User</option>
              <option value="product">Product</option>
              <option value="commodity">Commodity</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none text-sm"
            >
              <option value="7days">7 Hari Terakhir</option>
              <option value="30days">30 Hari Terakhir</option>
              <option value="90days">3 Bulan Terakhir</option>
              <option value="365days">1 Tahun Terakhir</option>
            </select>
          </div>

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

        {showFilters && (
          <div className="lg:hidden mt-4 pt-4 border-t space-y-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50"
            >
              <option value="all">Semua Tipe</option>
              <option value="financial">Financial</option>
              <option value="sales">Sales</option>
              <option value="user">User</option>
              <option value="product">Product</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50"
            >
              <option value="7days">7 Hari Terakhir</option>
              <option value="30days">30 Hari Terakhir</option>
              <option value="90days">3 Bulan Terakhir</option>
            </select>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Report</th>
                <th className="px-4 py-3 font-medium">Tipe</th>
                <th className="px-4 py-3 font-medium">Format</th>
                <th className="px-4 py-3 font-medium">Periode</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Downloads</th>
                <th className="px-4 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reports.length > 0 ? (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-800">{report.title}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{report.description}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getTypeBadge(report.type)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {getFormatIcon(report.format)}
                        <span className="text-xs uppercase">{report.format}</span>
                      </div>
                     </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{report.period}</td>
                    <td className="px-4 py-3">{getStatusBadge(report.status)}</td>
                    <td className="px-4 py-3">{report.downloads}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setShowPreviewModal(true);
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4 text-blue-500" />
                        </button>
                        <button
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                          title="Download"
                        >
                          <Download className="w-4 h-4 text-green-600" />
                        </button>
                        <button
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                          title="Share"
                        >
                          <Share2 className="w-4 h-4 text-purple-500" />
                        </button>
                      </div>
                     </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Belum ada data report</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t flex justify-between items-center flex-wrap gap-2 bg-gray-50">
            <p className="text-xs text-gray-500">
              Menampilkan {reports.length} dari {stats.total_reports} report
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

      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Generate {selectedTemplate.name}</h3>
                <button
                  onClick={() => {
                    setSelectedTemplate(null);
                    setCustomDateStart('');
                    setCustomDateEnd('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-500">{selectedTemplate.description}</p>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Date Range (Opsional)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={customDateStart}
                    onChange={(e) => setCustomDateStart(e.target.value)}
                    className="p-2 rounded-xl border border-gray-200"
                    placeholder="Start date"
                  />
                  <input
                    type="date"
                    value={customDateEnd}
                    onChange={(e) => setCustomDateEnd(e.target.value)}
                    className="p-2 rounded-xl border border-gray-200"
                    placeholder="End date"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => {
                    setSelectedTemplate(null);
                    setCustomDateStart('');
                    setCustomDateEnd('');
                  }}
                  className="flex-1 px-4 py-2 border rounded-xl hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  onClick={generateReport}
                  disabled={generating}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50"
                >
                  {generating ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null}
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPreviewModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{selectedReport.title}</h3>
                  <p className="text-sm text-gray-500">{selectedReport.report_id}</p>
                </div>
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    setSelectedReport(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-3">Report Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium capitalize">{selectedReport.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Format</p>
                    <p className="font-medium uppercase">{selectedReport.format}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Period</p>
                    <p className="font-medium">{selectedReport.period}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Generated</p>
                    <p className="font-medium">{formatDate(selectedReport.generated_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Generated By</p>
                    <p className="font-medium">{selectedReport.generated_by}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">File Size</p>
                    <p className="font-medium">{selectedReport.size}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 rounded-xl p-8 text-center">
                <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Preview tidak tersedia</p>
                <p className="text-xs text-gray-400 mt-2">Download file untuk melihat konten lengkap</p>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    setSelectedReport(null);
                  }}
                  className="flex-1 px-4 py-2 border rounded-xl hover:bg-gray-50 transition"
                >
                  Close
                </button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Report
                </button>
                <button className="px-4 py-2 border rounded-xl hover:bg-gray-50 transition">
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}