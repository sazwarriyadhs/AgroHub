// API Configuration - dengan fallback value
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api';

// Optional: Tambahkan helper function
export const getApiUrl = (endpoint: string) => {
  return `${API_BASE}${endpoint}`;
};

// Optional: Export untuk debugging
console.log('API_BASE:', API_BASE);