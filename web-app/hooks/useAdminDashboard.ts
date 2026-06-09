// hooks/useAdminDashboard.ts

import { useEffect, useState, useCallback } from 'react';
import { adminService } from '@/services/admin.service';

// Types
interface DashboardStats {
  total_users: number;
  total_stores: number;
  total_products: number;
  total_orders: number;
  total_reviews: number;
  gmv: number;
  revenue: number;
  take_rate: number;
  escrow_locked: number;
  pending_withdrawal: number;
  net_margin: number;
  total_wallets: number;
  total_withdrawals: number;
  pending_withdrawals_count: number;
  total_escrows: number;
  active_escrows: number;
  total_disputes: number;
  pending_disputes: number;
  total_memberships: number;
  active_memberships: number;
  total_badges: number;
  total_verifications: number;
  pending_verifications: number;
  total_commodity_prices: number;
  total_seller_scores: number;
  total_farmers: number;
  total_vendors: number;
  active_products: number;
  low_stock_products: number;
  monthly_growth: number;
  average_order_value: number;
  active_buyers: number;
}

interface MonthlyData {
  month: string;
  revenue: number;
  gmv: number;
  users: number;
  withdrawals: number;
  escrow_released: number;
}

interface CommodityData {
  month: string;
  rice: number;
  corn: number;
  chili: number;
  shallot: number;
}

// Complete fallback data
const FALLBACK_STATS: DashboardStats = {
  total_users: 1250,
  total_stores: 45,
  total_products: 1250,
  total_orders: 3450,
  total_reviews: 234,
  gmv: 1750000000,
  revenue: 87500000,
  take_rate: 5.0,
  escrow_locked: 325000000,
  pending_withdrawal: 187500000,
  net_margin: 15.5,
  total_wallets: 1200,
  total_withdrawals: 89,
  pending_withdrawals_count: 12,
  total_escrows: 156,
  active_escrows: 89,
  total_disputes: 23,
  pending_disputes: 8,
  total_memberships: 45,
  active_memberships: 32,
  total_badges: 15,
  total_verifications: 56,
  pending_verifications: 8,
  total_commodity_prices: 120,
  total_seller_scores: 45,
  total_farmers: 28,
  total_vendors: 17,
  active_products: 1120,
  low_stock_products: 45,
  monthly_growth: 12.5,
  average_order_value: 507246,
  active_buyers: 890
};

const FALLBACK_MONTHLY: MonthlyData[] = [
  { month: 'Jan 24', revenue: 45000000, gmv: 950000000, users: 890, withdrawals: 15000000, escrow_released: 45000000 },
  { month: 'Feb 24', revenue: 52000000, gmv: 1100000000, users: 945, withdrawals: 18200000, escrow_released: 52000000 },
  { month: 'Mar 24', revenue: 61000000, gmv: 1250000000, users: 1012, withdrawals: 21500000, escrow_released: 61000000 },
  { month: 'Apr 24', revenue: 68000000, gmv: 1380000000, users: 1089, withdrawals: 24800000, escrow_released: 68000000 },
  { month: 'May 24', revenue: 75000000, gmv: 1520000000, users: 1156, withdrawals: 28200000, escrow_released: 75000000 },
  { month: 'Jun 24', revenue: 82500000, gmv: 1650000000, users: 1234, withdrawals: 31500000, escrow_released: 82500000 },
  { month: 'Jul 24', revenue: 87500000, gmv: 1750000000, users: 1250, withdrawals: 187500000, escrow_released: 125000000 },
];

const FALLBACK_COMMODITY: CommodityData[] = [
  { month: 'Jan 24', rice: 13500, corn: 5500, chili: 45000, shallot: 32000 },
  { month: 'Feb 24', rice: 13800, corn: 5600, chili: 48000, shallot: 33500 },
  { month: 'Mar 24', rice: 14000, corn: 5450, chili: 52000, shallot: 34800 },
  { month: 'Apr 24', rice: 14200, corn: 5700, chili: 49000, shallot: 36000 },
  { month: 'May 24', rice: 14100, corn: 5800, chili: 51000, shallot: 35500 },
  { month: 'Jun 24', rice: 13900, corn: 5650, chili: 47000, shallot: 34500 },
  { month: 'Jul 24', rice: 14000, corn: 5600, chili: 48500, shallot: 33800 },
];

export const useAdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>(FALLBACK_STATS);
  const [monthly, setMonthly] = useState<MonthlyData[]>(FALLBACK_MONTHLY);
  const [commodity, setCommodity] = useState<CommodityData[]>(FALLBACK_COMMODITY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch semua data parallel
      const [statsRes, monthlyRes, commodityRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getMonthlyData(),
        adminService.getCommodityPrices(),
      ]);

      let hasRealData = false;

      // Handle dashboard stats
      if (statsRes && !statsRes.error && statsRes.status !== 403 && statsRes.data) {
        const realStats = statsRes.data || statsRes;
        setStats(prev => ({ ...prev, ...realStats }));
        hasRealData = true;
      } else if (statsRes?.status === 403) {
        setError('Session expired. Please login again.');
      }

      // Handle monthly data (pakai fallback jika 404 atau error)
      if (monthlyRes && !monthlyRes.notFound && !monthlyRes.error && monthlyRes.data) {
        const realMonthly = monthlyRes.data || monthlyRes;
        if (Array.isArray(realMonthly) && realMonthly.length > 0) {
          setMonthly(realMonthly);
          hasRealData = true;
        }
      }

      // Handle commodity data
      if (commodityRes && !commodityRes.error && commodityRes.status !== 403 && commodityRes.data) {
        const realCommodity = commodityRes.data || commodityRes;
        if (Array.isArray(realCommodity) && realCommodity.length > 0) {
          setCommodity(realCommodity);
          hasRealData = true;
        }
      }

      setUsingFallback(!hasRealData);

    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      // Keep using fallback data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  return {
    stats,
    monthly,
    commodity,
    loading,
    error,
    usingFallback,
    refetch: fetchAll,
  };
};