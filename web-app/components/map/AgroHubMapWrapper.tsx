'use client';

import dynamic from 'next/dynamic';

const AgroHubMapClient = dynamic(
  () => import('./AgroMapClient'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center bg-gray-100 rounded-3xl" style={{ height: '650px' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Memuat peta...</p>
        </div>
      </div>
    ),
  }
);

export default function AgroHubMapWrapper(props: any) {
  return <AgroHubMapClient {...props} />;
}
