'use client';

import dynamic from 'next/dynamic';

const AgroMapClient = dynamic(
  () => import('./AgroMapClient'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[700px] rounded-3xl bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">
            Loading AgroHub Map...
          </p>
        </div>
      </div>
    ),
  }
);

export default function AgroMap(props) {
  return <AgroMapClient {...props} />;
}
