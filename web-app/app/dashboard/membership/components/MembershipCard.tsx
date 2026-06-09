'use client';

import Image from 'next/image';
import { Calendar, Award, Shield, TrendingUp, Headphones, Gift, CheckCircle } from 'lucide-react';

interface MembershipCardProps {
  userName: string;
  memberId: string;
  memberSince: string;
  validUntil: string;
  membershipType: 'starter' | 'premium' | 'ultimate';
  isVerified: boolean;
}

export default function MembershipCard({
  userName,
  memberId,
  memberSince,
  validUntil,
  membershipType,
  isVerified
}: MembershipCardProps) {
  
  const getCardStyle = () => {
    switch (membershipType) {
      case 'premium':
        return {
          overlay: 'bg-gradient-to-br from-black/50 via-black/30 to-black/50',
          borderColor: 'border-yellow-400/50',
          accentColor: 'bg-yellow-500',
          textColor: 'text-yellow-400',
          badgeColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          badgeText: 'PREMIUM',
          glow: 'shadow-yellow-500/20'
        };
      case 'ultimate':
        return {
          overlay: 'bg-gradient-to-br from-black/50 via-black/30 to-black/50',
          borderColor: 'border-purple-400/50',
          accentColor: 'bg-purple-500',
          textColor: 'text-purple-400',
          badgeColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
          badgeText: 'ULTIMATE',
          glow: 'shadow-purple-500/20'
        };
      default:
        return {
          overlay: 'bg-gradient-to-br from-black/50 via-black/30 to-black/50',
          borderColor: 'border-gray-400/50',
          accentColor: 'bg-gray-500',
          textColor: 'text-gray-400',
          badgeColor: 'bg-gradient-to-r from-gray-500 to-gray-600',
          badgeText: 'MEMBER',
          glow: 'shadow-gray-500/20'
        };
    }
  };

  const cardStyle = getCardStyle();

  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-2xl ${cardStyle.glow} border ${cardStyle.borderColor}`}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/images/background.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Overlay Gradient */}
      <div className={`absolute inset-0 z-10 ${cardStyle.overlay}`} />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl -mr-32 -mt-32 z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-green-500/20 to-emerald-500/20 rounded-full blur-3xl -ml-32 -mb-32 z-10" />
      
      {/* Main Content */}
      <div className="relative z-20 p-8">
        {/* Header with Logo and Badge */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/95 backdrop-blur-sm p-2 rounded-xl shadow-md">
              <Image
                src="/assets/logo/logo-agrohub.png"
                alt="AgroHub"
                width={100}
                height={50}
                className="object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs text-white/80 drop-shadow-lg">Connect.Grow.Succeed.</p>
            </div>
          </div>
          <div className={`${cardStyle.badgeColor} px-4 py-1.5 rounded-full shadow-lg`}>
            <span className="text-white font-bold text-sm tracking-wider drop-shadow">
              {cardStyle.badgeText}
            </span>
          </div>
        </div>

        {/* Member Name and ID */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-1 drop-shadow-lg">{userName}</h2>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <Award className="w-4 h-4" />
            <span>MEMBER ID: {memberId}</span>
            {isVerified && (
              <span className="flex items-center gap-1 ml-2 text-green-400">
                <CheckCircle className="w-4 h-4" />
                Verified Member
              </span>
            )}
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
            <TrendingUp className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
            <p className="text-xs text-white/80">MARKET</p>
            <p className="text-sm font-semibold text-white">FEATURES</p>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
            <Shield className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <p className="text-xs text-white/80">INSIGHTS</p>
            <p className="text-sm font-semibold text-white">PRIORITY</p>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
            <Headphones className="w-5 h-5 text-purple-400 mx-auto mb-2" />
            <p className="text-xs text-white/80">SUPPORT</p>
            <p className="text-sm font-semibold text-white">24/7</p>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
            <Gift className="w-5 h-5 text-pink-400 mx-auto mb-2" />
            <p className="text-xs text-white/80">EXCLUSIVE</p>
            <p className="text-sm font-semibold text-white">OFFERS</p>
          </div>
        </div>

        {/* Date Information */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20">
            <div className="flex items-center gap-2 text-xs text-white/70 mb-1">
              <Calendar className="w-3 h-3" />
              <span>MEMBER SINCE</span>
            </div>
            <p className="font-semibold text-white">{memberSince}</p>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20">
            <div className="flex items-center gap-2 text-xs text-white/70 mb-1">
              <Calendar className="w-3 h-3" />
              <span>VALID UNTIL</span>
            </div>
            <p className="font-semibold text-white">{validUntil}</p>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center pt-4 border-t border-white/20">
          <p className="text-sm text-white/90">
            Thank you for being part of AgroHub family
          </p>
          <p className="text-xs text-white/60 mt-2">
            Growing Together 🌱
          </p>
        </div>
      </div>

      {/* Bottom Branding */}
      <div className="relative z-20 bg-black/30 backdrop-blur-sm px-8 py-3 flex justify-between items-center text-xs text-white/70">
        <span className="font-semibold tracking-wider">PREMIUM MEMBERSHIP</span>
        <span>www.agrohub.id</span>
      </div>
    </div>
  );
}