'use client';

import { useEffect, useState } from 'react';
import { Loader2, Settings, Activity, CheckCircle, XCircle, Clock, RefreshCw, Save } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    site_name: 'AgroHub',
    site_description: 'Connecting Farmers to Markets',
    contact_email: 'info@agrohub.com',
    currency: 'IDR',
    maintenance_mode: false,
    registration_enabled: true
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const getToken = () => {
    if (typeof window === 'undefined') return null;
    const cookies = document.cookie.split('; ');
    const adminTokenCookie = cookies.find(row => row.startsWith('admin_token='));
    if (adminTokenCookie) return adminTokenCookie.split('=')[1];
    return localStorage.getItem('admin_token') || localStorage.getItem('token');
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) throw new Error('No token');
      
      // ✅ FIXED: pakai backtick untuk template literal
      const response = await fetch(`${API_URL}/admin/system/settings`, {
        headers: { 
          'Authorization': `Bearer ${token}`,  // ✅ FIXED: token harus diisi
          'Content-Type': 'application/json' 
        }
      });
      if (!response.ok) throw new Error('Failed');
      
      const result = await response.json();
      setSettings(prev => ({ ...prev, ...(result.data || result) }));
    } catch (err) {
      setError('Gagal memuat pengaturan');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const token = getToken();
      // ✅ FIXED: pakai backtick untuk template literal
      const response = await fetch(`${API_URL}/admin/system/settings`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,  // ✅ FIXED: token harus diisi
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(settings)
      });
      if (response.ok) {
        setSuccess('Pengaturan berhasil disimpan');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Gagal menyimpan pengaturan');
      }
    } catch (err) {
      setError('Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <Loader2 className="w-6 h-6 animate-spin text-green-600" />
      <span className="ml-2 text-gray-500">Memuat pengaturan...</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-green-600" />
            <h1 className="text-2xl font-bold">System Settings</h1>
          </div>
          <button 
            onClick={saveSettings} 
            disabled={saving} 
            className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-green-700 transition disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
            Simpan
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-green-600">
          {success}
        </div>
      )}
      
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500 block mb-1">Site Name</label>
            <input 
              type="text" 
              value={settings.site_name} 
              onChange={e => setSettings({...settings, site_name: e.target.value})} 
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">Site Description</label>
            <input 
              type="text" 
              value={settings.site_description} 
              onChange={e => setSettings({...settings, site_description: e.target.value})} 
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">Contact Email</label>
            <input 
              type="email" 
              value={settings.contact_email} 
              onChange={e => setSettings({...settings, contact_email: e.target.value})} 
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">Currency</label>
            <select 
              value={settings.currency} 
              onChange={e => setSettings({...settings, currency: e.target.value})} 
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="IDR">IDR - Rupiah Indonesia</option>
              <option value="USD">USD - US Dollar</option>
            </select>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={settings.maintenance_mode} 
              onChange={e => setSettings({...settings, maintenance_mode: e.target.checked})} 
              className="w-4 h-4 text-green-600 rounded"
            /> 
            <span className="text-sm">Maintenance Mode</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={settings.registration_enabled} 
              onChange={e => setSettings({...settings, registration_enabled: e.target.checked})} 
              className="w-4 h-4 text-green-600 rounded"
            /> 
            <span className="text-sm">Registration Enabled</span>
          </label>
        </div>
      </div>
    </div>
  );
}