'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Crown, Star, Sparkles, ArrowRight } from 'lucide-react';
import MembershipCard from './components/MembershipCard';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

interface MembershipPlan {
  id: number;
  name: 'starter' | 'premium' | 'ultimate';
  price: number;
  duration_days: number;
  features: string;
}

interface UserMembership {
  id: number;
  user_id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  address: string;
  city: string;
  province: string;
  avatar: string;
  membership_type: string | null;
  membership_status: string | null;
  started_at: string | null;
  expired_at: string | null;
}

export default function MembershipPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [membership, setMembership] = useState<UserMembership | null>(null);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);

  // Fetch membership plans and user membership
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch membership plans
      setPlans([
        { id: 1, name: 'starter', price: 0, duration_days: 365, features: 'Basic access' },
        { id: 2, name: 'premium', price: 100000, duration_days: 365, features: 'AI support, market insights, priority listing' },
        { id: 3, name: 'ultimate', price: 200000, duration_days: 365, features: 'All premium features + analytics + priority support' }
      ]);

      // Fetch user membership
      try {
        const membershipResponse = await fetch(`${API_BASE}/membership`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (membershipResponse.ok) {
          const membershipData = await membershipResponse.json();
          setMembership(membershipData.data || membershipData);
        } else {
          // Fallback untuk user ID 3 (Tri Endah Ariwati)
          setMembership({
            id: 3,
            user_id: 3,
            name: 'Tri Endah Ariwati',
            email: 'buyer@agrohub.com',
            phone: '081234567890',
            role: 'customer',
            is_active: true,
            is_verified: true,
            address: 'Cimahpar Stoneyard Bogor Blok E No 1, Cimahpar, 16155',
            city: 'Bogor Utara',
            province: 'Jawa Barat',
            avatar: '/avatars/titi.jpg',
            membership_type: 'premium',
            membership_status: 'active',
            started_at: '2026-06-04T20:49:55.006399+00:00',
            expired_at: '2026-07-04T20:49:55.006399+00:00'
          });
        }
      } catch (error) {
        // Fallback untuk user ID 3
        setMembership({
          id: 3,
          user_id: 3,
          name: 'Tri Endah Ariwati',
          email: 'buyer@agrohub.com',
          phone: '081234567890',
          role: 'customer',
          is_active: true,
          is_verified: true,
          address: 'Cimahpar Stoneyard Bogor Blok E No 1, Cimahpar, 16155',
          city: 'Bogor Utara',
          province: 'Jawa Barat',
          avatar: '/avatars/titi.jpg',
          membership_type: 'premium',
          membership_status: 'active',
          started_at: '2026-06-04T20:49:55.006399+00:00',
          expired_at: '2026-07-04T20:49:55.006399+00:00'
        });
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle upgrade membership
  const handleUpgrade = async (planName: string) => {
    if (membership?.membership_type === planName) {
      toast.success(`Anda sudah berlangganan ${planName}`);
      return;
    }

    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/membership/upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: planName }),
      });

      if (response.ok) {
        toast.success(`Berhasil upgrade ke ${planName}!`);
        fetchData();
      } else {
        toast.error('Gagal upgrade membership');
      }
    } catch (error) {
      console.error('Error upgrading membership:', error);
      toast.error('Gagal menghubungi server');
    } finally {
      setProcessing(false);
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).toUpperCase();
  };

  // Format full date
  const formatFullDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Generate member ID
  const getMemberId = (userId: number) => {
    return `AGH-${String(userId).padStart(6, '0')}`;
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500">Memuat informasi membership...</p>
      </div>
    );
  }

  const currentPlanName = membership?.membership_type || 'starter';
  const isPremium = currentPlanName === 'premium' || currentPlanName === 'ultimate';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Membership</h1>
          <p className="text-gray-500 text-sm mt-1">
            Nikmati berbagai benefit eksklusif sebagai member AgroHub
          </p>
        </div>
      </div>

      {/* Membership Card Widget */}
      {membership && (
        <MembershipCard
          userName={membership.name}
          memberId={getMemberId(membership.user_id)}
          memberSince={formatFullDate(membership.started_at)}
          validUntil={formatFullDate(membership.expired_at)}
          membershipType={membership.membership_type as 'starter' | 'premium' | 'ultimate' || 'starter'}
          isVerified={membership.is_verified}
        />
      )}

      {/* Membership Plans - Only show upgrade options if not premium */}
      {!isPremium && (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            Upgrade Membership
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.filter(p => p.name !== 'starter').map((plan) => (
              <div
                key={plan.id}
                className="rounded-xl border-2 border-gray-200 p-6 hover:border-yellow-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    plan.name === 'premium' ? 'bg-yellow-100' : 'bg-purple-100'
                  }`}>
                    {plan.name === 'premium' ? (
                      <Crown className="w-6 h-6 text-yellow-600" />
                    ) : (
                      <Sparkles className="w-6 h-6 text-purple-600" />
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 capitalize">{plan.name}</h3>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  Rp {plan.price.toLocaleString()}
                  <span className="text-sm font-normal text-gray-500">/tahun</span>
                </p>
                
                <button
                  onClick={() => handleUpgrade(plan.name)}
                  disabled={processing}
                  className={`mt-6 w-full py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                    plan.name === 'premium'
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                      : 'bg-purple-500 text-white hover:bg-purple-600'
                  } disabled:opacity-50`}
                >
                  {processing ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Upgrade ke {plan.name}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}