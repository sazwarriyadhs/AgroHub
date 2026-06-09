'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingBag,
  Star,
  Wallet,
  CreditCard,
  Landmark,
  Shield,
  Scale,
  Award,
  Medal,
  Verified,
  ChartLine,
  FileText,
  Settings,
  LogOut,
  Bell,
  Menu,
  MapPin,
  BarChart3,
  Zap,
  Building,
  Brain,
  Activity,
  Server,
  Lock,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Search,
  HelpCircle,
  Truck,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const [notifCount] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Management: true,
    Finance: true,
    Verification: false,
    'AI & Insights': false,
    System: false,
  });

  // ✅ Pindahkan ALL hooks ke ATAS sebelum conditional return
  // Auth check effect
  useEffect(() => {
    // Jangan jalankan auth check di halaman login
    if (pathname === '/admin/login') {
      setIsLoading(false);
      return;
    }

    const checkAuth = () => {
      try {
        const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
        const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');

        if (!token || !userStr) {
          router.push('/admin/login');
          return;
        }

        const user = JSON.parse(userStr);
        const role = String(user.role || user.role_enum || user.user_role || '').toLowerCase();
        const allowedRoles = ['admin', 'superadmin', 'super_admin'];

        if (!allowedRoles.includes(role)) {
          localStorage.clear();
          sessionStorage.clear();
          router.push('/admin/login');
          return;
        }

        setAdminName(user.name || user.fullname || user.full_name || 'Admin');

        const savedSidebar = localStorage.getItem('admin_sidebar_collapsed');
        if (savedSidebar) {
          setSidebarCollapsed(JSON.parse(savedSidebar));
        }
      } catch (err) {
        console.error('ADMIN AUTH ERROR:', err);
        localStorage.clear();
        sessionStorage.clear();
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedSidebar = localStorage.getItem('admin_sidebar_collapsed');
    if (savedSidebar) {
      setSidebarCollapsed(JSON.parse(savedSidebar));
    }
  }, []);

  // ✅ Conditional return AFTER all hooks
  // Skip layout untuk halaman login
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Handler functions
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push('/admin/login');
  };

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('admin_sidebar_collapsed', JSON.stringify(newState));
  };

  const toggleGroup = (groupName: string) => {
    if (sidebarCollapsed) return;
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  // Menu Groups
  const menuGroups = [
    {
      title: 'Management',
      icon: LayoutDashboard,
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
        { label: 'Users', icon: Users, href: '/admin/users' },
        { label: 'Sellers', icon: Store, href: '/admin/sellers' },
        { label: 'Stores', icon: Building, href: '/admin/stores' },
        { label: 'Products', icon: Package, href: '/admin/products' },
        { label: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
        { label: 'Pengiriman', icon: Truck, href: '/admin/shipping' },
        { label: 'Reviews', icon: Star, href: '/admin/reviews' },
        { label: 'Location Map', icon: MapPin, href: '/admin/locations' },
      ],
    },
    {
      title: 'Finance',
      icon: Wallet,
      items: [
        { label: 'Wallets', icon: Wallet, href: '/admin/wallets' },
        { label: 'Transactions', icon: CreditCard, href: '/admin/transactions' },
        { label: 'Withdrawals', icon: Landmark, href: '/admin/withdrawals', badge: 12 },
        { label: 'Escrow', icon: Shield, href: '/admin/escrow' },
        { label: 'Disputes', icon: Scale, href: '/admin/disputes', badge: 3 },
      ],
    },
    {
      title: 'Verification',
      icon: Verified,
      items: [
        { label: 'Verifications', icon: Verified, href: '/admin/verification', badge: 8 },
        { label: 'Memberships', icon: Award, href: '/admin/verification/memberships' },
        { label: 'Badges', icon: Medal, href: '/admin/verification/badges' },
      ],
    },
    {
      title: 'AI & Insights',
      icon: Brain,
      items: [
        { label: 'Analytics', icon: BarChart3, href: '/admin/ai-insights/analytics' },
        { label: 'Commodity Prices', icon: ChartLine, href: '/admin/ai-insights/commodity-prices' },
        { label: 'Doktor AI', icon: Zap, href: '/admin/ai-insights/doctor-ai' },
        { label: 'Reports', icon: FileText, href: '/admin/ai-insights/reports' },
      ],
    },
    {
      title: 'System',
      icon: Settings,
      items: [
        { label: 'Settings', icon: Settings, href: '/admin/system/settings' },
        { label: 'System Health', icon: Activity, href: '/admin/system/health' },
        { label: 'Server Status', icon: Server, href: '/admin/system/server-status' },
        { label: 'Security', icon: Lock, href: '/admin/system/security' },
        { label: 'Logs', icon: FileText, href: '/admin/system/logs' },
      ],
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading AgroHub Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ==================== SIDEBAR ==================== */}
      <aside
        className={`
          fixed left-0 top-0 bottom-0 z-50
          bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out
          flex flex-col
          ${sidebarCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Logo Section */}
        <div className={`border-b border-gray-200 py-6 ${sidebarCollapsed ? 'px-2' : 'px-4'}`}>
          <Link 
            href="/admin/dashboard" 
            className={`flex ${sidebarCollapsed ? 'justify-center' : 'justify-center'} items-center`}
          >
            <div className="relative" style={{ width: sidebarCollapsed ? 60 : 150, height: sidebarCollapsed ? 30 : 75 }}>
              <Image
                src="/assets/logo/logo-agrohub.png"
                alt="AgroHub"
                fill
                className="object-contain"
                priority
                style={{ objectFit: 'contain' }}
              />
            </div>
          </Link>
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex absolute -right-3 top-24 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center shadow-md hover:shadow-lg transition z-50"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-3 h-3 text-gray-600" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-gray-600" />
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
          {menuGroups.map((group) => {
            const GroupIcon = group.icon;
            const isExpanded = expandedGroups[group.title];
            const isActiveGroup = group.items.some(
              (item) => pathname === item.href || pathname?.startsWith(item.href + '/')
            );

            if (sidebarCollapsed) {
              // Collapsed mode - hanya icon
              return (
                <div key={group.title} className="relative group">
                  <div className="flex justify-center">
                    <div
                      className={`
                        p-3 rounded-xl transition cursor-pointer
                        ${isActiveGroup ? 'bg-green-50 text-green-600' : 'text-gray-500 hover:bg-gray-100'}
                      `}
                    >
                      <GroupIcon className="w-5 h-5" />
                    </div>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition z-50">
                    {group.title}
                  </div>
                </div>
              );
            }

            // Expanded mode
            return (
              <div key={group.title} className="space-y-1">
                <button
                  onClick={() => toggleGroup(group.title)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition
                    ${isActiveGroup ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-gray-100'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <GroupIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">{group.title}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {isExpanded && (
                  <div className="ml-4 pl-4 space-y-1 border-l border-gray-200">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`
                            flex items-center justify-between px-3 py-2 rounded-lg transition
                            ${isActive ? 'bg-green-50 text-green-600' : 'text-gray-500 hover:bg-gray-100'}
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-4 h-4" />
                            <span className="text-sm">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Section */}
        <div className={`border-t border-gray-200 p-4 ${sidebarCollapsed ? 'px-2' : ''}`}>
          {!sidebarCollapsed ? (
            <div className="mb-3 p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500">Logged in as</p>
              <p className="text-sm font-semibold text-gray-800 mt-1">{adminName}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                System Active
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">{adminName.charAt(0)}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition
              text-red-600 hover:bg-red-50
              ${sidebarCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>

              {/* Logo kecil untuk mobile */}
              <div className="lg:hidden relative w-8 h-8">
                <Image
                  src="/assets/logo/logo-agrohub.png"
                  alt="AgroHub"
                  fill
                  className="object-contain"
                  style={{ objectFit: 'contain' }}
                />
              </div>

              <div className="hidden lg:block">
                <h1 className="text-xl font-bold text-gray-800">
                  {pathname?.split('/').pop()?.replace(/-/g, ' ')?.toUpperCase() || 'DASHBOARD'}
                </h1>
                <p className="text-xs text-gray-500">AgroHub Administration System</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-500 text-sm hover:bg-gray-200 transition">
                <Search className="w-4 h-4" />
                <span>Cari...</span>
              </button>

              {/* Notification */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition">
                <Bell className="w-5 h-5 text-gray-600" />
                {notifCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                    {notifCount}
                  </span>
                )}
              </button>

              {/* Help */}
              <button className="p-2 rounded-lg hover:bg-gray-100 transition">
                <HelpCircle className="w-5 h-5 text-gray-600" />
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{adminName.charAt(0)}</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-800">{adminName}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}