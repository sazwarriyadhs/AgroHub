'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CustomerSidebar() {
  const pathname = usePathname();

  const menu = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Pesanan', href: '/dashboard/orders' },
    { name: 'Wallet', href: '/dashboard/wallet' },
    { name: 'Profil', href: '/dashboard/profile' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r shadow-sm">

      {/* LOGO */}
      <div className="h-16 flex items-center px-6 border-b">
        <img src="/logo-agrohub.png" className="w-8 h-8 mr-2" />
        <span className="font-bold text-green-600 text-lg">
          AgroHub
        </span>
      </div>

      {/* MENU */}
      <nav className="p-4 space-y-1">
        {menu.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg text-sm transition ${
                active
                  ? 'bg-green-100 text-green-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="absolute bottom-4 left-6 text-xs text-gray-400">
        AgroHub v1.0
      </div>

    </aside>
  );
}