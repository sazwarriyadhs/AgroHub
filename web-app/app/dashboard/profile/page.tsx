'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Building2, 
  CreditCard, 
  Plus, 
  Trash2,
  Save,
  Upload,
  CheckCircle,
  AlertCircle,
  Home
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState('/default-avatar.png');
  const [avatarError, setAvatarError] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
  });

  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [newBank, setNewBank] = useState({
    bank_name: '',
    account_number: '',
    account_name: '',
  });
  const [bankLoading, setBankLoading] = useState(false);

  // ================= PROFILE =================
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch(`${API_BASE}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401) {
        localStorage.clear();
        toast.error('Sesi habis, silakan login kembali');
        router.push('/login');
        return;
      }

      const data = await res.json();
      const user = data.data || data;
      
      // Update form dengan data user
      setForm({
        name: user.name || user.full_name || '',
        email: user.email || '',
        phone: user.phone || user.phone_number || '',
        address: user.address || '',
        city: user.city || '',
        province: user.province || '',
      });
      
      // Handle avatar dengan fallback
      const avatarUrl = user.avatar || '/default-avatar.png';
      setPreview(avatarUrl);
      setAvatarError(false);
      setUserData(user);
      
      // Update localStorage
      if (user.name) localStorage.setItem('userName', user.name);
      if (user.email) localStorage.setItem('userEmail', user.email);
      if (user.role) localStorage.setItem('userRole', user.role);
      
    } catch (err) {
      console.error('Error fetching profile:', err);
      toast.error('Gagal memuat profil');
      
      // Fallback ke localStorage
      const userName = localStorage.getItem('userName');
      const userEmail = localStorage.getItem('userEmail');
      if (userName) {
        setForm({
          name: userName,
          email: userEmail || '',
          phone: '',
          address: '',
          city: '',
          province: '',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Silakan login kembali');
        router.push('/login');
        return;
      }

      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.status === 401) {
        localStorage.clear();
        toast.error('Sesi habis, silakan login kembali');
        router.push('/login');
        return;
      }

      const data = await res.json();

      if (data.success || data.message === 'Profile updated successfully') {
        toast.success('Profil berhasil diupdate');
        
        // Update localStorage
        localStorage.setItem('userName', form.name);
        
        // Update user data di localStorage
        const existingUser = localStorage.getItem('user');
        if (existingUser) {
          const user = JSON.parse(existingUser);
          user.name = form.name;
          user.address = form.address;
          user.city = form.city;
          user.province = form.province;
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        fetchProfile(); // Refresh data
      } else {
        toast.error(data.message || 'Gagal update profil');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Gagal menghubungi server');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi file
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 2MB');
      return;
    }

    // Preview lokal dulu
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setAvatarError(false);
    setUploading(true);

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success('Avatar berhasil diupload');
        fetchProfile(); // Refresh ambil URL terbaru dari server
      } else {
        toast.error(data.message || 'Gagal upload avatar');
        // Kembalikan ke avatar lama
        fetchProfile();
      }
    } catch (err) {
      console.error('Error uploading avatar:', err);
      toast.error('Gagal upload avatar');
      fetchProfile();
    } finally {
      setUploading(false);
    }
  };

  // ================= BANK =================
  const fetchBanks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${API_BASE}/banks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (res.status === 404) {
        // Endpoint belum tersedia, tidak perlu error
        setBankAccounts([]);
        return;
      }
      
      const data = await res.json();
      setBankAccounts(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error('Error fetching banks:', err);
      setBankAccounts([]);
    }
  };

  const addBank = async () => {
    if (!newBank.bank_name || !newBank.account_number) {
      toast.error('Nama bank dan nomor rekening wajib diisi');
      return;
    }

    setBankLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/banks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newBank),
      });

      if (res.status === 404) {
        toast.error('Fitur rekening bank belum tersedia');
        return;
      }

      const data = await res.json();

      if (data.success) {
        toast.success('Rekening berhasil ditambahkan');
        setNewBank({ bank_name: '', account_number: '', account_name: '' });
        fetchBanks();
      } else {
        toast.error(data.message || 'Gagal menambahkan rekening');
      }
    } catch (err) {
      console.error('Error adding bank:', err);
      toast.error('Gagal menghubungi server');
    } finally {
      setBankLoading(false);
    }
  };

  const deleteBank = async (id: number) => {
    if (!confirm('Hapus rekening ini?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/banks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (res.status === 404) {
        toast.error('Fitur rekening bank belum tersedia');
        return;
      }
      
      toast.success('Rekening dihapus');
      fetchBanks();
    } catch (err) {
      console.error('Error deleting bank:', err);
      toast.error('Gagal menghapus rekening');
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchBanks();
  }, []);

  // Cek apakah profil lengkap
  const isProfileComplete = form.name && form.address && form.city && form.province && form.phone;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500">Memuat profil...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Profil Saya</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola informasi akun Anda</p>
        </div>
        <div className="flex items-center gap-2">
          {userData?.is_verified && (
            <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
              <CheckCircle className="w-4 h-4" />
              Terverifikasi
            </span>
          )}
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
            {userData?.role === 'customer' ? 'Pembeli' : userData?.role === 'seller' ? 'Penjual' : 'Member'}
          </span>
        </div>
      </div>

      {/* AVATAR SECTION */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="text-center">
            <div className="relative">
              <Image
                src={avatarError ? '/default-avatar.png' : preview}
                alt="Avatar"
                width={100}
                height={100}
                className="rounded-full border-4 border-green-100 object-cover w-24 h-24"
                onError={() => setAvatarError(true)}
                unoptimized={preview?.startsWith('blob:') || preview?.startsWith('data:')}
              />
              {uploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <label className="absolute bottom-0 right-0 p-1.5 bg-green-600 rounded-full cursor-pointer hover:bg-green-700 transition shadow-lg">
                <Upload className="w-3 h-3 text-white" />
                <input type="file" onChange={handleUpload} className="hidden" accept="image/*" />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">Klik ikon untuk ganti foto</p>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-semibold text-gray-800">{form.name || 'Pengguna'}</h2>
            <p className="text-gray-500">{form.email}</p>
            {(form.address || form.city || form.province) && (
              <div className="flex items-center justify-center md:justify-start gap-1 mt-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>
                  {form.city && form.city}
                  {form.city && form.province && ', '}
                  {form.province && form.province}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EDIT FORM */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-green-600" />
          Informasi Pribadi
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              className="w-full border border-gray-200 p-3 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              disabled
            />
            <p className="text-xs text-gray-400 mt-1">Email tidak dapat diubah</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
            <input
              type="tel"
              placeholder="Contoh: 081234567890"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
            <textarea
              placeholder="Alamat lengkap Anda"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows={2}
              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kota</label>
            <input
              type="text"
              placeholder="Contoh: Bogor Utara"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi</label>
            <input
              type="text"
              placeholder="Contoh: Jawa Barat"
              value={form.province}
              onChange={(e) => setForm({ ...form, province: e.target.value })}
              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
            />
          </div>
        </div>
        
        <button
          onClick={handleUpdate}
          disabled={saving}
          className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Simpan Perubahan
        </button>
      </div>

      {/* ALAMAT TERSIMPAN (Jika sudah lengkap) */}
      {isProfileComplete && (
        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Home className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-800">Alamat Tersimpan</h3>
              <p className="text-green-700 mt-1">
                {form.address}
                {form.city && <span>, {form.city}</span>}
                {form.province && <span>, {form.province}</span>}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-green-200 text-green-700 px-2 py-0.5 rounded-full">
                  {form.phone && `📞 ${form.phone}`}
                </span>
                <span className="text-xs bg-green-200 text-green-700 px-2 py-0.5 rounded-full">
                  {userData?.role === 'customer' ? 'Pembeli' : 'Member'}
                </span>
              </div>
              <p className="text-xs text-green-600 mt-2">
                Alamat ini akan digunakan untuk pengiriman pesanan Anda
              </p>
            </div>
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          </div>
        </div>
      )}

      {/* BANK ACCOUNTS - Sembunyikan jika endpoint 404 */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-green-600" />
          Rekening Saya
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            placeholder="Nama Bank (contoh: BCA, Mandiri)"
            value={newBank.bank_name}
            onChange={(e) => setNewBank({ ...newBank, bank_name: e.target.value })}
            className="border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition flex-1"
          />
          <input
            placeholder="Nama Pemilik Rekening"
            value={newBank.account_name}
            onChange={(e) => setNewBank({ ...newBank, account_name: e.target.value })}
            className="border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition flex-1"
          />
          <input
            placeholder="Nomor Rekening"
            value={newBank.account_number}
            onChange={(e) => setNewBank({ ...newBank, account_number: e.target.value })}
            className="border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition flex-1"
          />
          <button
            onClick={addBank}
            disabled={bankLoading}
            className="bg-green-600 text-white px-6 rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
          >
            {bankLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Tambah
          </button>
        </div>

        {bankAccounts.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border rounded-lg border-dashed">
            <CreditCard className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p>Belum ada rekening terdaftar</p>
            <p className="text-sm">Tambahkan rekening untuk memudahkan transaksi</p>
          </div>
        ) : (
          <div className="space-y-2">
            {bankAccounts.map((bank) => (
              <div key={bank.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{bank.bank_name}</p>
                    <p className="text-sm text-gray-500">
                      {bank.account_number} 
                      {bank.account_name && ` - ${bank.account_name}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteBank(bank.id)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}