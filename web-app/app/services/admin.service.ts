// services/admin.service.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900';

const getToken = () => {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem('admin_token') || 
         localStorage.getItem('token') || 
         sessionStorage.getItem('admin_token') ||
         sessionStorage.getItem('token');
};

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const adminService = {
  async getDashboardStats() {
    try {
      const response = await fetch(`${API_URL}/api/admin/dashboard`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        console.error(`Dashboard stats error: ${response.status}`);
        return { data: null, status: response.status };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return { data: null, error: true };
    }
  },

  async getMonthlyData() {
    try {
      // Coba beberapa endpoint alternatif
      const endpoints = [
        '/api/admin/dashboard/monthly',
        '/api/admin/monthly-stats', 
        '/api/admin/charts/monthly',
        '/api/admin/stats/monthly'
      ];

      for (const endpoint of endpoints) {
        const response = await fetch(`${API_URL}${endpoint}`, {
          method: 'GET',
          headers: getHeaders(),
        });

        if (response.ok) {
          const data = await response.json();
          return data;
        }
      }
      
      console.warn('No monthly data endpoint found, using fallback');
      return { data: null, notFound: true };
    } catch (error) {
      console.error('Error fetching monthly data:', error);
      return { data: null, error: true };
    }
  },

  async getCommodityPrices() {
    try {
      const response = await fetch(`${API_URL}/api/admin/commodity-prices`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        console.error(`Commodity prices error: ${response.status}`);
        return { data: null, status: response.status };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching commodity prices:', error);
      return { data: null, error: true };
    }
  },

  async testConnection() {
    try {
      const response = await fetch(`${API_URL}/api/admin/test`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return { ok: response.ok, status: response.status };
    } catch (error) {
      return { ok: false, error };
    }
  }
};