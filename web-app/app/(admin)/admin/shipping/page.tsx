'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Truck,
  RefreshCw,
  Eye,
  X,
  Package,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  TruckIcon,
  Home,
  Navigation,
} from 'lucide-react';

type Shipment = {
  id: number;
  order_id: number;
  shipment_code: string;
  courier_name: string;
  courier: string;
  tracking_number: string;
  status: string;
  shipping_cost: number;
  distance_km: number;
  estimated_days: number;
  shipped_at: string | null;
  delivered_at: string | null;
  delivery_type: string;
  cargo_type: string;
};

type ShipmentDetail = Shipment & {
  customer_name?: string;
  customer_phone?: string;
  customer_address?: string;
  driver_name?: string;
  driver_phone?: string;
  vehicle_plate?: string;
  current_location?: string;
  last_update?: string;
  notes?: string;
};

export default function ShippingPage() {
  const router = useRouter();

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedShipment, setSelectedShipment] = useState<ShipmentDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return (
      localStorage.getItem('admin_token') ||
      localStorage.getItem('token') ||
      sessionStorage.getItem('admin_token') ||
      sessionStorage.getItem('token')
    );
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

  const fetchShipments = async () => {
    try {
      setLoading(true);
      setError('');

      const token = getToken();
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const endpoints = [
        `${API_URL}/admin/shipments`,
        `${API_URL}/shipments`,
        `${API_URL}/logistics/shipments`,
        `${API_URL}/agrohub-express/shipments`,
      ];

      let res: Response | null = null;

      for (const url of endpoints) {
        try {
          res = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (res.ok) break;
        } catch {
          continue;
        }
      }

      if (!res || !res.ok) {
        if (res?.status === 401) {
          router.push('/admin/login');
          return;
        }
        throw new Error('API Shipments not found');
      }

      const json = await res.json();
      const data = json.data ?? json ?? [];
      setShipments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Gagal memuat data pengiriman AgroHub Express - Menggunakan data contoh');
      setShipments(mockShipments);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-gray-100 text-gray-700 border-gray-200',
      waiting_pickup: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      picked_up: 'bg-blue-100 text-blue-700 border-blue-200',
      in_transit: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      arrived_hub: 'bg-purple-100 text-purple-700 border-purple-200',
      out_for_delivery: 'bg-orange-100 text-orange-700 border-orange-200',
      delivered: 'bg-green-100 text-green-700 border-green-200',
      failed: 'bg-red-100 text-red-700 border-red-200',
      returned: 'bg-pink-100 text-pink-700 border-pink-200',
      cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
    };
    return map[status] ?? 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    const map: Record<string, React.ReactNode> = {
      pending: <Clock className="w-3 h-3" />,
      waiting_pickup: <Clock className="w-3 h-3" />,
      picked_up: <Package className="w-3 h-3" />,
      in_transit: <Truck className="w-3 h-3" />,
      arrived_hub: <Home className="w-3 h-3" />,
      out_for_delivery: <Navigation className="w-3 h-3" />,
      delivered: <CheckCircle className="w-3 h-3" />,
      failed: <AlertCircle className="w-3 h-3" />,
      returned: <AlertCircle className="w-3 h-3" />,
      cancelled: <X className="w-3 h-3" />,
    };
    return map[status] ?? <Package className="w-3 h-3" />;
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      pending: 'Menunggu Driver',
      waiting_pickup: 'Menunggu Pickup',
      picked_up: 'Dijemput',
      in_transit: 'Dalam Perjalanan',
      arrived_hub: 'Tiba di Hub',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Terkirim',
      failed: 'Gagal',
      returned: 'Dikembalikan',
      cancelled: 'Dibatalkan',
    };
    return map[status] ?? status;
  };

  const getDeliveryTypeText = (type: string) => {
    const map: Record<string, string> = {
      standard: 'Standar',
      express: 'Ekspres',
      same_day: 'Same Day',
      instant: 'Instan',
      cold_chain: 'Cold Chain',
      live_cargo: 'Live Cargo',
    };
    return map[type] ?? type;
  };

  const getCargoTypeText = (type: string) => {
    const map: Record<string, string> = {
      general: 'Umum',
      fragile: 'Pecah Belah',
      temperature_controlled: 'Suhu Terjaga',
      live_animal: 'Hewan Hidup',
      agricultural: 'Hasil Pertanian',
      aquaculture: 'Hasil Perikanan',
      livestock: 'Ternak',
    };
    return map[type] ?? type;
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = 
      shipment.shipment_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.order_id.toString().includes(searchTerm) ||
      shipment.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { 
      label: 'Total Pengiriman', 
      value: shipments.length, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      icon: Package 
    },
    { 
      label: 'Dalam Perjalanan', 
      value: shipments.filter(s => ['in_transit', 'out_for_delivery', 'picked_up'].includes(s.status)).length, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50',
      icon: Truck 
    },
    { 
      label: 'Terkirim', 
      value: shipments.filter(s => s.status === 'delivered').length, 
      color: 'text-green-600', 
      bg: 'bg-green-50',
      icon: CheckCircle 
    },
    { 
      label: 'Pending', 
      value: shipments.filter(s => s.status === 'pending' || s.status === 'waiting_pickup').length, 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-50',
      icon: Clock 
    },
  ];

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat data pengiriman AgroHub Express...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Truck className="w-5 h-5 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">AgroHub Express</h1>
          </div>
          <p className="text-gray-500 text-sm ml-12">
            Manajemen pengiriman internal - Kelola semua shipment dari driver AgroHub Express
          </p>
        </div>

        <button
          onClick={fetchShipments}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* INFO BANNER */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
        <span className="text-blue-600 text-sm">ℹ️</span>
        <p className="text-blue-700 text-sm">
          Menampilkan pengiriman yang dikelola oleh <strong>AgroHub Express</strong> (kurir internal AgroHub)
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`${stat.bg} rounded-xl p-4 border transition hover:shadow-md`}>
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Cari berdasarkan kode, order ID, atau nomor resi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">Semua Status</option>
          <option value="pending">Menunggu Driver</option>
          <option value="waiting_pickup">Menunggu Pickup</option>
          <option value="picked_up">Dijemput</option>
          <option value="in_transit">Dalam Perjalanan</option>
          <option value="arrived_hub">Tiba di Hub</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Terkirim</option>
          <option value="failed">Gagal</option>
          <option value="cancelled">Dibatalkan</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 text-left font-semibold text-gray-600">Kode</th>
                <th className="p-3 text-left font-semibold text-gray-600">Order ID</th>
                <th className="p-3 text-left font-semibold text-gray-600">Kurir</th>
                <th className="p-3 text-left font-semibold text-gray-600">No. Resi</th>
                <th className="p-3 text-left font-semibold text-gray-600">Tipe</th>
                <th className="p-3 text-left font-semibold text-gray-600">Biaya</th>
                <th className="p-3 text-left font-semibold text-gray-600">Status</th>
                <th className="p-3 text-left font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    Tidak ada data pengiriman
                  </td>
                </tr>
              ) : (
                filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3 font-mono font-medium text-gray-900">
                      {shipment.shipment_code}
                    </td>
                    <td className="p-3 text-gray-700">#{shipment.order_id}</td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-gray-900">{shipment.courier_name}</p>
                        <p className="text-xs text-gray-500">{shipment.courier}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-blue-600 font-mono text-xs">
                        {shipment.tracking_number || '-'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-xs text-gray-600">
                        {getDeliveryTypeText(shipment.delivery_type)}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-gray-900">
                      {formatCurrency(shipment.shipping_cost)}
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(shipment.status)}`}>
                        {getStatusIcon(shipment.status)}
                        {getStatusText(shipment.status)}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          setSelectedShipment(shipment);
                          setIsModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DETAIL */}
      {isModalOpen && selectedShipment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedShipment.shipment_code}
                </h2>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(selectedShipment.status)}`}>
                  {getStatusText(selectedShipment.status)}
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-xs text-gray-500">Order ID</label>
                  <p className="font-medium text-gray-900">#{selectedShipment.order_id}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-xs text-gray-500">Kode Pengiriman</label>
                  <p className="font-mono text-sm text-gray-900">{selectedShipment.shipment_code}</p>
                </div>
              </div>

              {/* Courier Info */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <TruckIcon className="w-4 h-4" />
                  Informasi Kurir
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Kurir</span>
                    <span className="font-medium">{selectedShipment.courier_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nomor Resi</span>
                    <span className="font-mono">{selectedShipment.tracking_number || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Shipment Details */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Detail Pengiriman
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Jarak Tempuh</span>
                    <span>{selectedShipment.distance_km} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estimasi Hari</span>
                    <span>{selectedShipment.estimated_days} hari</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Biaya Pengiriman</span>
                    <span className="font-medium text-green-600">{formatCurrency(selectedShipment.shipping_cost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tipe Pengiriman</span>
                    <span>{getDeliveryTypeText(selectedShipment.delivery_type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tipe Kargo</span>
                    <span>{getCargoTypeText(selectedShipment.cargo_type)}</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Timeline
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tanggal Kirim</span>
                    <span>{formatDateTime(selectedShipment.shipped_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tanggal Terkirim</span>
                    <span>{formatDateTime(selectedShipment.delivered_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const mockShipments: Shipment[] = [
  {
    id: 1,
    order_id: 1001,
    shipment_code: 'AGX-001',
    courier_name: 'AgroHub Express',
    courier: 'INTERNAL',
    tracking_number: 'AGX123456',
    status: 'in_transit',
    shipping_cost: 25000,
    distance_km: 15.5,
    estimated_days: 1,
    shipped_at: new Date().toISOString(),
    delivered_at: null,
    delivery_type: 'express',
    cargo_type: 'agricultural',
  },
  {
    id: 2,
    order_id: 1002,
    shipment_code: 'AGX-002',
    courier_name: 'AgroHub Express',
    courier: 'INTERNAL',
    tracking_number: 'AGX789012',
    status: 'delivered',
    shipping_cost: 35000,
    distance_km: 25.0,
    estimated_days: 2,
    shipped_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    delivered_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    delivery_type: 'standard',
    cargo_type: 'aquaculture',
  },
  {
    id: 3,
    order_id: 1003,
    shipment_code: 'AGX-003',
    courier_name: 'AgroHub Express',
    courier: 'INTERNAL',
    tracking_number: '',
    status: 'pending',
    shipping_cost: 18000,
    distance_km: 8.0,
    estimated_days: 1,
    shipped_at: null,
    delivered_at: null,
    delivery_type: 'cold_chain',
    cargo_type: 'temperature_controlled',
  },
];