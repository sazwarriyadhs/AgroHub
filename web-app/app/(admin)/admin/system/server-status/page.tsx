'use client';

import { useEffect, useState } from 'react';
import { Loader2, Server, Activity, CheckCircle, XCircle, Clock, RefreshCw, Cpu, HardDrive, Wifi } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

interface ServerStatusData {
  status: 'online' | 'degraded' | 'offline';
  hostname: string;
  ip_address: string;
  uptime: number;
  cpu: {
    usage: number;
    cores: number;
    model: string;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  network: {
    inbound: number;
    outbound: number;
    connections: number;
  };
  load_average: number[];
  processes: number;
  last_boot: string;
  timestamp: string;
}

export default function ServerStatusPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ServerStatusData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => {
    if (typeof window === 'undefined') return null;
    const cookies = document.cookie.split('; ');
    const adminTokenCookie = cookies.find(row => row.startsWith('admin_token='));
    if (adminTokenCookie) return adminTokenCookie.split('=')[1];
    return localStorage.getItem('admin_token') || localStorage.getItem('token');
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }

      // ✅ FIXED: pakai backtick untuk template literal
      const response = await fetch(`${API_URL}/admin/system/server-status`, {
        headers: {
          'Authorization': `Bearer ${token}`,  // ✅ FIXED: token harus diisi
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      setData(result.data || result);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Gagal memuat status server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const getUsageColor = (usage: number) => {
    if (usage > 80) return 'text-red-600';
    if (usage > 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-50';
      case 'degraded': return 'text-yellow-600 bg-yellow-50';
      case 'offline': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Mock data if no data from API
  const serverData = data || {
    status: 'online',
    hostname: 'agrohub-server-01',
    ip_address: '192.168.1.100',
    uptime: 86400 * 15 + 3600 * 5,
    cpu: {
      usage: 32,
      cores: 8,
      model: 'Intel Xeon E5-2680 v4'
    },
    memory: {
      total: 16 * 1024 * 1024 * 1024,
      used: 7.2 * 1024 * 1024 * 1024,
      free: 8.8 * 1024 * 1024 * 1024,
      usage: 45
    },
    disk: {
      total: 500 * 1024 * 1024 * 1024,
      used: 290 * 1024 * 1024 * 1024,
      free: 210 * 1024 * 1024 * 1024,
      usage: 58
    },
    network: {
      inbound: 125 * 1024 * 1024,
      outbound: 85 * 1024 * 1024,
      connections: 1247
    },
    load_average: [1.25, 1.08, 0.95],
    processes: 245,
    last_boot: '2024-05-01T00:00:00Z',
    timestamp: new Date().toISOString()
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        <span className="ml-2 text-gray-500">Memuat status server...</span>
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
              <Server className="w-6 h-6 text-green-600" />
              <h1 className="text-2xl font-bold capitalize text-gray-800">
                Server Status
              </h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Status server, CPU, memory, dan disk usage
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Coba Lagi
          </button>
        </div>
      ) : (
        <>
          {/* SERVER STATUS CARD */}
          <div className={`rounded-2xl border p-6 ${getStatusColor(serverData.status)}`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Server className="w-6 h-6" />
                  <h2 className="text-xl font-semibold">Server Status</h2>
                </div>
                <p className="text-sm opacity-75 mt-1">
                  Hostname: {serverData.hostname} | IP: {serverData.ip_address}
                </p>
                <p className="text-sm opacity-75">
                  Last checked: {new Date(serverData.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold capitalize">{serverData.status}</div>
                <p className="text-sm opacity-75">Uptime: {formatUptime(serverData.uptime)}</p>
              </div>
            </div>
          </div>

          {/* CPU & MEMORY METRICS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CPU Section */}
            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-gray-800">CPU</h3>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Usage</span>
                  <span className={getUsageColor(serverData.cpu.usage)}>{serverData.cpu.usage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full ${serverData.cpu.usage > 80 ? 'bg-red-500' : serverData.cpu.usage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${serverData.cpu.usage}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                <div>
                  <p className="text-gray-500">Cores</p>
                  <p className="font-medium">{serverData.cpu.cores}</p>
                </div>
                <div>
                  <p className="text-gray-500">Model</p>
                  <p className="font-medium text-xs truncate">{serverData.cpu.model}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm text-gray-500">Load Average</p>
                <p className="font-medium">1 min: {serverData.load_average[0]} | 5 min: {serverData.load_average[1]} | 15 min: {serverData.load_average[2]}</p>
              </div>
            </div>

            {/* Memory Section */}
            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold text-gray-800">Memory</h3>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Usage</span>
                  <span className={getUsageColor(serverData.memory.usage)}>{serverData.memory.usage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full ${serverData.memory.usage > 80 ? 'bg-red-500' : serverData.memory.usage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${serverData.memory.usage}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm mt-3">
                <div>
                  <p className="text-gray-500">Total</p>
                  <p className="font-medium">{formatBytes(serverData.memory.total)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Used</p>
                  <p className="font-medium">{formatBytes(serverData.memory.used)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Free</p>
                  <p className="font-medium">{formatBytes(serverData.memory.free)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* DISK & NETWORK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Disk Section */}
            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <HardDrive className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-gray-800">Disk Storage</h3>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Usage</span>
                  <span className={getUsageColor(serverData.disk.usage)}>{serverData.disk.usage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full ${serverData.disk.usage > 80 ? 'bg-red-500' : serverData.disk.usage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${serverData.disk.usage}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm mt-3">
                <div>
                  <p className="text-gray-500">Total</p>
                  <p className="font-medium">{formatBytes(serverData.disk.total)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Used</p>
                  <p className="font-medium">{formatBytes(serverData.disk.used)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Free</p>
                  <p className="font-medium">{formatBytes(serverData.disk.free)}</p>
                </div>
              </div>
            </div>

            {/* Network Section */}
            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Wifi className="w-5 h-5 text-cyan-500" />
                <h3 className="font-semibold text-gray-800">Network</h3>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Inbound</p>
                  <p className="font-medium">{formatBytes(serverData.network.inbound)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Outbound</p>
                  <p className="font-medium">{formatBytes(serverData.network.outbound)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Connections</p>
                  <p className="font-medium">{serverData.network.connections}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm text-gray-500">Processes</p>
                <p className="font-medium">{serverData.processes} running</p>
              </div>
            </div>
          </div>

          {/* SYSTEM INFO */}
          <div className="bg-white rounded-2xl border shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Hostname</p>
                <p className="font-medium">{serverData.hostname}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">IP Address</p>
                <p className="font-medium">{serverData.ip_address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Boot</p>
                <p className="font-medium">{new Date(serverData.last_boot).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Processes</p>
                <p className="font-medium">{serverData.processes}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}