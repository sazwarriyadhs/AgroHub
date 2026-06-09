// app/(marketplace)/state/user.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  roles?: string[];        // Array of roles
  roleName?: string;
  displayName?: string;
  initial?: string;
  isVerified?: boolean;
  avatar?: string;
  
  // Profile data from customer_profiles
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  defaultAddressLabel?: string;
  secondaryAddress?: string;
  deliveryInstructions?: string;
  preferredCategories?: string[];
  totalOrders?: number;
  totalSpent?: number;
  loyaltyPoints?: number;
  membershipTier?: 'silver' | 'gold' | 'platinum' | 'bronze';
  marketingOptIn?: boolean;
  profileCompleted?: boolean;
  
  // Wallet data
  walletNumber?: string;
  balance?: number;
  holdBalance?: number;
  availableBalance?: number;
  
  // Cart summary
  cartItemsCount?: number;
  cartTotal?: number;
}

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  fetchProfile: () => Promise<void>;
  fetchWalletBalance: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      fetchProfile: async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            set({ user: null, isAuthenticated: false });
            return;
          }

          // Endpoint yang benar: /api/v1/profile
          const response = await axios.get(`${API_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.data.success || response.data.data) {
            const data = response.data.data || response.data;
            
            // Transform data dari database ke frontend
            const userData: User = {
              id: data.user_id,
              name: data.name,
              email: data.email,
              role: data.roles?.split(', ')[0] || 'customer',
              roles: data.roles?.split(', ') || ['customer'],
              roleName: getRoleDisplayName(data.roles),
              displayName: data.full_name || data.name,
              initial: (data.full_name?.charAt(0) || data.name?.charAt(0) || 'U').toUpperCase(),
              isVerified: data.is_verified,
              
              // Profile data
              fullName: data.full_name,
              dateOfBirth: data.date_of_birth,
              gender: data.gender,
              defaultAddressLabel: data.default_address_label,
              secondaryAddress: data.secondary_address,
              deliveryInstructions: data.delivery_instructions,
              preferredCategories: data.preferred_categories,
              totalOrders: data.total_orders || 0,
              totalSpent: Number(data.total_spent) || 0,
              loyaltyPoints: data.loyalty_points || 0,
              membershipTier: data.membership_tier || 'bronze',
              marketingOptIn: data.marketing_opt_in,
              profileCompleted: data.profile_completed,
              
              // Wallet data
              walletNumber: data.wallet_number,
              balance: Number(data.balance) || 0,
              holdBalance: Number(data.hold_balance) || 0,
              availableBalance: Number(data.available_balance) || 0,
              
              // Cart summary
              cartItemsCount: data.cart_items_count || 0,
              cartTotal: Number(data.cart_total) || 0,
            };
            
            set({ user: userData, isAuthenticated: true });
            
            // Simpan ke localStorage sebagai backup
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          
          // Fallback ke localStorage
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            set({ user: userData, isAuthenticated: true });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        }
      },

      fetchWalletBalance: async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;
          
          const response = await axios.get(`${API_URL}/wallet`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.success) {
            const wallet = response.data.data;
            set((state) => ({
              user: state.user ? {
                ...state.user,
                balance: wallet.balance,
                holdBalance: wallet.hold_balance,
                availableBalance: wallet.balance - wallet.hold_balance,
                walletNumber: wallet.wallet_number,
              } : null
            }));
          }
        } catch (error) {
          console.error('Failed to fetch wallet:', error);
        }
      },

      logout: async () => {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            await axios.post(`${API_URL}/logout`, {}, {
              headers: { Authorization: `Bearer ${token}` }
            });
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Helper function untuk mendapatkan display role
function getRoleDisplayName(roles: string): string {
  const roleMap: Record<string, string> = {
    farmer: 'Petani',
    seller: 'Penjual',
    admin: 'Administrator',
    vendor: 'Vendor',
    customer: 'Pembeli',
  };
  
  const roleList = roles?.split(', ') || ['customer'];
  const primaryRole = roleList[0];
  return roleMap[primaryRole] || 'Member';
}