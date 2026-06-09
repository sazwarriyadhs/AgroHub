'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Loader2, 
  Brain,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Download,
  Sparkles,
  Zap,
  Shield,
  Users,
  ShoppingBag,
  Package,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  Lightbulb,
  Target,
  Eye,
  Send
} from 'lucide-react';
import {
  LineChart as ReLineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';

// Types
interface AIInsight {
  id: number;
  title: string;
  description: string;
  type: 'prediction' | 'recommendation' | 'alert' | 'insight';
  priority: 'high' | 'medium' | 'low';
  metric: string;
  current_value: number;
  predicted_value: number;
  confidence: number;
  created_at: string;
}

interface AIPrediction {
  metric: string;
  current: number;
  predicted: number;
  growth: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
}

interface FinancialForecast {
  month: string;
  revenue: number;
  expense: number;
  profit: number;
  prediction: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

export default function DoctorAIPage() {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [predictions, setPredictions] = useState<AIPrediction[]>([
    { metric: 'GMV', current: 1750000000, predicted: 1950000000, growth: 11.4, trend: 'up', confidence: 92 },
    { metric: 'Revenue', current: 87500000, predicted: 96000000, growth: 9.7, trend: 'up', confidence: 88 },
    { metric: 'Active Users', current: 1250, predicted: 1420, growth: 13.6, trend: 'up', confidence: 85 },
    { metric: 'Conversion Rate', current: 3.2, predicted: 3.5, growth: 9.4, trend: 'up', confidence: 78 },
    { metric: 'Avg Order Value', current: 507246, predicted: 535000, growth: 5.5, trend: 'up', confidence: 82 }
  ]);
  const [forecast, setForecast] = useState<FinancialForecast[]>([
    { month: 'Jun 24', revenue: 87500000, expense: 45000000, profit: 42500000, prediction: 88000000 },
    { month: 'Jul 24', revenue: 89000000, expense: 46000000, profit: 43000000, prediction: 90000000 },
    { month: 'Aug 24', revenue: 92000000, expense: 47000000, profit: 45000000, prediction: 94000000 },
    { month: 'Sep 24', revenue: 95000000, expense: 48000000, profit: 47000000, prediction: 97000000 },
    { month: 'Oct 24', revenue: 98000000, expense: 49000000, profit: 49000000, prediction: 100000000 },
    { month: 'Nov 24', revenue: 100000000, expense: 50000000, profit: 50000000, prediction: 103000000 }
  ]);
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [processing, setProcessing] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', message: string}[]>([
    { role: 'ai', message: 'Halo! Saya AI Finance Assistant AgroHub. Saya bisa membantu menganalisis performa keuangan, memprediksi tren, dan memberikan rekomendasi bisnis. Ada yang bisa saya bantu?' }
  ]);

  // Get token
  const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    const cookies = document.cookie.split('; ');
    const adminTokenCookie = cookies.find(row => row.startsWith('admin_token='));
    if (adminTokenCookie) return adminTokenCookie.split('=')[1];
    return localStorage.getItem('admin_token') || localStorage.getItem('token');
  };

  // Fetch AI insights
  const fetchInsights = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/admin/ai-insights`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) return;

      const data = await response.json();
      const insightsData = data.data || data.insights || [];
      setInsights(insightsData.length > 0 ? insightsData : [
        {
          id: 1,
          title: "Peningkatan GMV Diprediksi",
          description: "Berdasarkan tren 3 bulan terakhir, GMV diprediksi meningkat 11.4% bulan depan.",
          type: "prediction",
          priority: "high",
          metric: "GMV",
          current_value: 1750000000,
          predicted_value: 1950000000,
          confidence: 92,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title: "Potensi Peningkatan Konversi",
          description: "Optimasi halaman produk dapat meningkatkan konversi hingga 15%.",
          type: "recommendation",
          priority: "high",
          metric: "Conversion Rate",
          current_value: 3.2,
          predicted_value: 3.7,
          confidence: 85,
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          title: "Peringatan: Penurunan Retention",
          description: "Retention rate user menurun 5% dibanding bulan lalu. Perlu investigasi.",
          type: "alert",
          priority: "medium",
          metric: "Retention",
          current_value: 68,
          predicted_value: 63,
          confidence: 78,
          created_at: new Date().toISOString()
        }
      ]);
      
    } catch (error) {
      console.error('Error fetching AI insights:', error);
    }
  }, []);

  useEffect(() => {
    fetchInsights();
    setLoading(false);
  }, [fetchInsights]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format compact number
  const formatCompactNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  };

  // Get insight icon
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'prediction':
        return <Brain className="w-5 h-5 text-purple-500" />;
      case 'recommendation':
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-blue-500" />;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">High Priority</span>;
      case 'medium':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Medium Priority</span>;
      case 'low':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Low Priority</span>;
      default:
        return null;
    }
  };

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleAskAI = async () => {
    if (!aiMessage.trim()) return;
    
    setProcessing(true);
    setChatHistory(prev => [...prev, { role: 'user', message: aiMessage }]);
    
    // Simulasi AI response
    setTimeout(() => {
      const responses = [
        "Berdasarkan analisis data, GMV diprediksi akan tumbuh 11.4% bulan depan dengan confidence 92%.",
        "Rekomendasi saya: Fokuskan promosi pada kategori Alat Pertanian yang memberikan kontribusi 35% dari total penjualan.",
        "Saya melihat adanya pola peningkatan order dari region Jawa Timur. Perlu ditingkatkan inventory di region tersebut.",
        "Konversi turun 0.3% minggu ini. Saran saya optimasi halaman checkout."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatHistory(prev => [...prev, { role: 'ai', message: randomResponse }]);
      setAiMessage('');
      setProcessing(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        <span className="ml-2 text-gray-500">Memuat AI Finance Dashboard...</span>
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
              <Brain className="w-6 h-6 text-green-600" />
              <h1 className="text-2xl font-bold capitalize text-gray-800">
                AI Finance Doctor
              </h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              AI-powered financial insights, predictions, and business recommendations
            </p>
          </div>
          <div className="flex gap-2">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Run Analysis
            </button>
          </div>
        </div>
      </div>

      {/* AI INSIGHTS CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {insights.map((insight) => (
          <div key={insight.id} className="bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getInsightIcon(insight.type)}
                <span className="text-xs text-gray-400">{insight.type.toUpperCase()}</span>
              </div>
              {getPriorityBadge(insight.priority)}
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">{insight.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500">Confidence:</span>
                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${insight.confidence}%` }}
                  />
                </div>
                <span className="font-medium">{insight.confidence}%</span>
              </div>
              <button className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AI PREDICTIONS */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-5 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-800">AI Predictions</h3>
            <span className="text-xs text-gray-400 ml-2">Next month forecast</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Metric</th>
                <th className="px-4 py-3 font-medium">Current</th>
                <th className="px-4 py-3 font-medium">Predicted</th>
                <th className="px-4 py-3 font-medium">Growth</th>
                <th className="px-4 py-3 font-medium">Confidence</th>
                <th className="px-4 py-3 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {predictions.map((pred, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-800">{pred.metric}</td>
                  <td className="px-4 py-3">{pred.metric === 'Conversion Rate' ? `${pred.current}%` : formatCompactNumber(pred.current)}</td>
                  <td className="px-4 py-3 font-semibold text-green-600">
                    {pred.metric === 'Conversion Rate' ? `${pred.predicted}%` : formatCompactNumber(pred.predicted)}
                   </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-green-600">
                      <ArrowUpRight className="w-3 h-3" />
                      +{pred.growth}%
                    </span>
                   </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${pred.confidence}%` }} />
                      </div>
                      <span className="text-xs">{pred.confidence}%</span>
                    </div>
                   </td>
                  <td className="px-4 py-3">{getTrendIcon(pred.trend)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FINANCIAL FORECAST CHART */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-green-600" />
              Financial Forecast
            </h3>
            <p className="text-sm text-gray-500">Revenue, expense, and profit projection</p>
          </div>
          <select className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none text-sm">
            <option value="6months">6 Months</option>
            <option value="12months">12 Months</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={forecast}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis yAxisId="left" tickFormatter={(v) => formatCompactNumber(v)} stroke="#9ca3af" />
            <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => formatCompactNumber(v)} stroke="#9ca3af" />
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
            <Legend />
            <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#22c55e" fill="url(#revenueGradient)" />
            <Area yAxisId="left" type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" fill="none" strokeDasharray="5 5" />
            <Line yAxisId="right" type="monotone" dataKey="profit" name="Profit" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
            <Line yAxisId="right" type="monotone" dataKey="prediction" name="AI Prediction" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* AI CHAT ASSISTANT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-5 border-b bg-gray-50">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-800">AI Financial Assistant</h3>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Online</span>
            </div>
          </div>
          <div className="h-96 overflow-y-auto p-5 space-y-4">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 ${
                  msg.role === 'user' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
            {processing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t bg-gray-50">
            <div className="flex gap-2">
              <input
                type="text"
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
                placeholder="Tanyakan sesuatu tentang performa keuangan..."
                className="flex-1 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />
              <button
                onClick={handleAskAI}
                disabled={processing || !aiMessage.trim()}
                className="px-5 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Ask AI
              </button>
            </div>
          </div>
        </div>

        {/* AI Stats & Recommendations */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-800">AI Confidence Score</h3>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">87%</div>
              <p className="text-sm text-gray-500 mt-1">Overall prediction accuracy</p>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '87%' }} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-800">Top Recommendation</h3>
            </div>
            <p className="text-sm text-gray-600">
              Fokuskan promosi pada produk kategori <strong>Alat Pertanian</strong> yang memberikan kontribusi 35% dari total penjualan.
              Peningkatan inventory di region <strong>Jawa Timur</strong> juga disarankan.
            </p>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Risk Alert</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Retention Rate</span>
                <span className="text-red-600 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  -5%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Customer Churn</span>
                <span className="text-red-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +2.3%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Operational Cost</span>
                <span className="text-yellow-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +8%
                </span>
              </div>
            </div>
            <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
              View Details →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}