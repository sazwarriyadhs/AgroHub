'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  ShieldCheck,
  Store,
  Tractor,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  CheckCircle2,
  XCircle,
  Eye,
  Ban,
  RefreshCw,
  Download,
  ArrowUpRight,
  Crown,
} from 'lucide-react';

interface UserItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'farmer' | 'vendor' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  location: string;
  joinDate: string;
  totalOrders: number;
  totalSpend: number;
  verified: boolean;
  avatar?: string;
}

const fallbackUsers: UserItem[] = [
  {
    id: 1,
    name: 'Budi Santoso',
    email: 'budi@agrohub.com',
    phone: '+62 812 1111 2222',
    role: 'customer',
    status: 'active',
    location: 'Bandung, Jawa Barat',
    joinDate: '2026-01-12',
    totalOrders: 23,
    totalSpend: 4500000,
    verified: true,
  },
  {
    id: 2,
    name: 'Tani Makmur',
    email: 'tanimakmur@agrohub.com',
    phone: '+62 813 2222 3333',
    role: 'farmer',
    status: 'active',
    location: 'Malang, Jawa Timur',
    joinDate: '2026-02-05',
    totalOrders: 54,
    totalSpend: 18200000,
    verified: true,
  },
  {
    id: 3,
    name: 'Agro Store Indonesia',
    email: 'store@agrohub.com',
    phone: '+62 814 3333 4444',
    role: 'vendor',
    status: 'pending',
    location: 'Surabaya, Jawa Timur',
    joinDate: '2026-03-01',
    totalOrders: 12,
    totalSpend: 8700000,
    verified: false,
  },
  {
    id: 4,
    name: 'Siti Nurhaliza',
    email: 'siti@agrohub.com',
    phone: '+62 815 4444 5555',
    role: 'customer',
    status: 'suspended',
    location: 'Jakarta',
    joinDate: '2026-01-28',
    totalOrders: 8,
    totalSpend: 1200000,
    verified: false,
  },
];

export default function DashboardUsersPage() {
  const [users, setUsers] =
    useState<UserItem[]>(fallbackUsers);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState('');

  const [roleFilter, setRoleFilter] =
    useState('all');

  const [statusFilter, setStatusFilter] =
    useState('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchSearch =
        user.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        user.email
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchRole =
        roleFilter === 'all'
          ? true
          : user.role === roleFilter;

      const matchStatus =
        statusFilter === 'all'
          ? true
          : user.status === statusFilter;

      return (
        matchSearch &&
        matchRole &&
        matchStatus
      );
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalUsers = users.length;

  const totalFarmers = users.filter(
    (u) => u.role === 'farmer'
  ).length;

  const totalVendors = users.filter(
    (u) => u.role === 'vendor'
  ).length;

  const activeUsers = users.filter(
    (u) => u.status === 'active'
  ).length;

  const formatCurrency = (
    amount: number
  ) => {
    return new Intl.NumberFormat(
      'id-ID',
      {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }
    ).format(amount);
  };

  const getRoleBadge = (
    role: string
  ) => {
    switch (role) {
      case 'admin':
        return {
          icon: Crown,
          className:
            'bg-red-100 text-red-700',
        };

      case 'vendor':
        return {
          icon: Store,
          className:
            'bg-purple-100 text-purple-700',
        };

      case 'farmer':
        return {
          icon: Tractor,
          className:
            'bg-green-100 text-green-700',
        };

      default:
        return {
          icon: User,
          className:
            'bg-blue-100 text-blue-700',
        };
    }
  };

  const getStatusBadge = (
    status: string
  ) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';

      case 'pending':
        return 'bg-yellow-100 text-yellow-700';

      default:
        return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg">
                <Users className="w-6 h-6" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  User Management
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Kelola semua user AgroHub ecosystem
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition flex items-center gap-2 text-sm font-medium">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>

            <button className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition flex items-center gap-2 text-sm font-medium">
              <Download className="w-4 h-4" />
              Export
            </button>

            <button className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white transition flex items-center gap-2 text-sm font-medium shadow-lg">
              <ArrowUpRight className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-80">
                Total Users
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {totalUsers}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">
                Farmers
              </p>

              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                {totalFarmers}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
              <Tractor className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">
                Vendors
              </p>

              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                {totalVendors}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">
              <Store className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">
                Active Users
              </p>

              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                {activeUsers}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Cari user..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value)
              }
              className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="all">
                Semua Role
              </option>
              <option value="customer">
                Customer
              </option>
              <option value="farmer">
                Farmer
              </option>
              <option value="vendor">
                Vendor
              </option>
              <option value="admin">
                Admin
              </option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="all">
                Semua Status
              </option>
              <option value="active">
                Active
              </option>
              <option value="pending">
                Pending
              </option>
              <option value="suspended">
                Suspended
              </option>
            </select>

            <button className="px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  User
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Role
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Location
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Orders
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Spend
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr
                    key={i}
                    className="border-b"
                  >
                    <td
                      colSpan={7}
                      className="px-6 py-5"
                    >
                      <div className="h-12 rounded-xl bg-gray-100 animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-16"
                  >
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />

                    <p className="text-gray-500">
                      Tidak ada user ditemukan
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleData =
                    getRoleBadge(
                      user.role
                    );

                  const RoleIcon =
                    roleData.icon;

                  return (
                    <tr
                      key={user.id}
                      className="border-b hover:bg-green-50/40 transition"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-bold">
                            {user.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-gray-800">
                                {user.name}
                              </p>

                              {user.verified && (
                                <ShieldCheck className="w-4 h-4 text-green-600" />
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <Phone className="w-3 h-3" />
                              {user.phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${roleData.className}`}
                        >
                          <RoleIcon className="w-3 h-3" />
                          {user.role}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                            user.status
                          )}`}
                        >
                          {user.status ===
                          'active' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}

                          {user.status}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {user.location}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                          <Calendar className="w-3 h-3" />
                          Joined{' '}
                          {new Date(
                            user.joinDate
                          ).toLocaleDateString(
                            'id-ID'
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-semibold text-gray-800">
                          {user.totalOrders}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-semibold text-green-700">
                          {formatCurrency(
                            user.totalSpend
                          )}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <button className="w-9 h-9 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-200 flex items-center justify-center transition">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>

                          <button className="w-9 h-9 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 flex items-center justify-center transition">
                            <Ban className="w-4 h-4 text-red-500" />
                          </button>

                          <button className="w-9 h-9 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition">
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}