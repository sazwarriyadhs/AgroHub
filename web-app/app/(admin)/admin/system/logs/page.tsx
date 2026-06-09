'use client';

import { useEffect, useState } from 'react';
import { Loader2, FileText, Activity, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';

export default function logsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
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

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';
      const response = await fetch(${apiUrl}/admin/system/logs, {
        headers: {
          'Authorization': Bearer ,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(HTTP );
      }

      const result = await response.json();
      setData(result.data || result);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Gagal memuat data');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        <span className="ml-2 text-gray-500">Memuat data...</span>
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
                System Logs
              </h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Log aktivitas sistem dan audit trail
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
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <pre className="text-sm text-gray-600 overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
