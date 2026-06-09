'use client';

import dynamic from 'next/dynamic';
import type { MapLocation } from './AgroMapClient';

interface AgroMapProps {
  locations?: MapLocation[];
  activeLayer?: 'all' | 'farmer' | 'vendor' | 'store';
  onLocationSelect?: (location: MapLocation) => void;
}

const AgroMapClient = dynamic(() => import('./AgroMapClient'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] rounded-2xl bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

export default function AgroMap(props: AgroMapProps) {
  return <AgroMapClient {...props} />;
}
