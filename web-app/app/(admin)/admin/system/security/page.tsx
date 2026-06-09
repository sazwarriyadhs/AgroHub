'use client';

import { useEffect, useState } from 'react';
import { Loader2, Shield, Activity, CheckCircle, XCircle, Clock, RefreshCw, Lock, Eye, AlertTriangle, Fingerprint, Key, Globe } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

interface SecuritySettings {
  two_factor_auth: boolean;
  login_attempts: number;
  session_timeout: number;
  password_policy: {
    min_length: number;
    require_numbers: boolean;
    require_symbols: boolean;
    require_uppercase: boolean;
  };
  ip_whitelist: string[];
  ip_blacklist: string[];
  rate_limits: {
    per_minute: number;
    per_hour: number;
    per_day: number;
  };
  ssl_enabled: boolean;
  firewall_active: boolean;
  last_audit: string;
}

export default function SecurityPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<SecuritySettings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showIpInput, setShowIpInput] = useState(false);
  const [newIp, setNewIp] = useState('');

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
      const response = await fetch(`${API_URL}/admin/system/security`, {
        headers: {
          'Authorization': `Bearer ${token}`,  // ✅ FIXED: token harus diisi
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      const securityData = result.data || result;
      setData(securityData);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Gagal memuat pengaturan keamanan');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!data) return;
    
    setSaving(true);
    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/admin/system/security`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setSuccess('Pengaturan keamanan berhasil disimpan');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Gagal menyimpan pengaturan');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  const addIpToWhitelist = () => {
    if (!data || !newIp.trim()) return;
    if (!data.ip_whitelist.includes(newIp.trim())) {
      setData({
        ...data,
        ip_whitelist: [...data.ip_whitelist, newIp.trim()]
      });
    }
    setNewIp('');
    setShowIpInput(false);
  };

  const removeIpFromWhitelist = (ip: string) => {
    if (!data) return;
    setData({
      ...data,
      ip_whitelist: data.ip_whitelist.filter(i => i !== ip)
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  // Mock data if no data from API
  const securityData = data || {
    two_factor_auth: false,
    login_attempts: 5,
    session_timeout: 60,
    password_policy: {
      min_length: 8,
      require_numbers: true,
      require_symbols: true,
      require_uppercase: true
    },
    ip_whitelist: ['192.168.1.0/24', '10.0.0.0/8'],
    ip_blacklist: ['203.0.113.0/24'],
    rate_limits: {
      per_minute: 10,
      per_hour: 50,
      per_day: 200
    },
    ssl_enabled: true,
    firewall_active: true,
    last_audit: new Date().toISOString()
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        <span className="ml-2 text-gray-500">Memuat pengaturan keamanan...</span>
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
              <Shield className="w-6 h-6 text-green-600" />
              <h1 className="text-2xl font-bold capitalize text-gray-800">
                Security Settings
              </h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Pengaturan keamanan dan proteksi sistem
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Simpan Pengaturan
            </button>
            <button
              onClick={handleRefresh}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* MESSAGES */}
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

      {/* SECURITY SETTINGS FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Authentication Section */}
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-800">Authentication</h3>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Two-Factor Authentication</span>
              <button
                type="button"
                onClick={() => setData({ ...securityData, two_factor_auth: !securityData.two_factor_auth })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  securityData.two_factor_auth ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    securityData.two_factor_auth ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Max Login Attempts</label>
              <input
                type="number"
                value={securityData.login_attempts}
                onChange={(e) => setData({ ...securityData, login_attempts: parseInt(e.target.value) })}
                className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Session Timeout (minutes)</label>
              <input
                type="number"
                value={securityData.session_timeout}
                onChange={(e) => setData({ ...securityData, session_timeout: parseInt(e.target.value) })}
                className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Password Policy Section */}
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold text-gray-800">Password Policy</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Minimum Length</label>
              <input
                type="number"
                value={securityData.password_policy.min_length}
                onChange={(e) => setData({
                  ...securityData,
                  password_policy: { ...securityData.password_policy, min_length: parseInt(e.target.value) }
                })}
                className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Require Numbers</span>
              <button
                type="button"
                onClick={() => setData({
                  ...securityData,
                  password_policy: { ...securityData.password_policy, require_numbers: !securityData.password_policy.require_numbers }
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  securityData.password_policy.require_numbers ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${securityData.password_policy.require_numbers ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Require Symbols</span>
              <button
                type="button"
                onClick={() => setData({
                  ...securityData,
                  password_policy: { ...securityData.password_policy, require_symbols: !securityData.password_policy.require_symbols }
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  securityData.password_policy.require_symbols ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${securityData.password_policy.require_symbols ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Require Uppercase</span>
              <button
                type="button"
                onClick={() => setData({
                  ...securityData,
                  password_policy: { ...securityData.password_policy, require_uppercase: !securityData.password_policy.require_uppercase }
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  securityData.password_policy.require_uppercase ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${securityData.password_policy.require_uppercase ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </label>
          </div>
        </div>

        {/* IP Whitelist Section */}
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-800">IP Whitelist</h3>
          </div>
          <div className="space-y-2">
            {securityData.ip_whitelist.map((ip, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-sm font-mono">{ip}</span>
                <button
                  onClick={() => removeIpFromWhitelist(ip)}
                  className="text-red-500 hover:text-red-700"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
            {showIpInput ? (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  placeholder="IP Address (e.g., 192.168.1.0/24)"
                  className="flex-1 p-2 rounded-lg border border-gray-200"
                />
                <button
                  onClick={addIpToWhitelist}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowIpInput(false)}
                  className="px-3 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowIpInput(true)}
                className="w-full mt-2 p-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-green-500 hover:text-green-600 transition"
              >
                + Add IP Address
              </button>
            )}
          </div>
        </div>

        {/* Rate Limits Section */}
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-800">Rate Limits</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Per Minute</label>
              <input
                type="number"
                value={securityData.rate_limits.per_minute}
                onChange={(e) => setData({
                  ...securityData,
                  rate_limits: { ...securityData.rate_limits, per_minute: parseInt(e.target.value) }
                })}
                className="w-full p-2 rounded-lg border border-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Per Hour</label>
              <input
                type="number"
                value={securityData.rate_limits.per_hour}
                onChange={(e) => setData({
                  ...securityData,
                  rate_limits: { ...securityData.rate_limits, per_hour: parseInt(e.target.value) }
                })}
                className="w-full p-2 rounded-lg border border-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Per Day</label>
              <input
                type="number"
                value={securityData.rate_limits.per_day}
                onChange={(e) => setData({
                  ...securityData,
                  rate_limits: { ...securityData.rate_limits, per_day: parseInt(e.target.value) }
                })}
                className="w-full p-2 rounded-lg border border-gray-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Security Settings */}
      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Additional Security</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <span className="text-sm text-gray-700">SSL/TLS Enabled</span>
            <button
              type="button"
              onClick={() => setData({ ...securityData, ssl_enabled: !securityData.ssl_enabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                securityData.ssl_enabled ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${securityData.ssl_enabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </label>
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <span className="text-sm text-gray-700">Firewall Active</span>
            <button
              type="button"
              onClick={() => setData({ ...securityData, firewall_active: !securityData.firewall_active })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                securityData.firewall_active ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${securityData.firewall_active ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </label>
        </div>
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-500">Last Security Audit</p>
          <p className="font-medium">{new Date(securityData.last_audit).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}