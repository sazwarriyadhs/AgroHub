import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../shared/widgets/app_drawer.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  static const Color primaryGreen = Color(0xff00752A);
  static const Color secondaryGreen = Color(0xff00A63E);
  static const Color backgroundColor = Color(0xffF4F7F5);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundColor,
      drawer: const AppDrawer(),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: Column(
            children: [
              _buildHeader(context),
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    _buildMetricsGrid(context),
                    const SizedBox(height: 24),
                    _buildActiveShipment(context),
                    const SizedBox(height: 24),
                    _buildQuickActions(context),
                    const SizedBox(height: 24),
                    _buildWeeklyStats(context),
                    const SizedBox(height: 24),
                    _buildWeeklyEarnings(),
                    const SizedBox(height: 120),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: _buildBottomNav(context),
    );
  }

  // =========================================================
  // HEADER
  // =========================================================

  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 30),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [primaryGreen, secondaryGreen],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(34),
          bottomRight: Radius.circular(34),
        ),
      ),
      child: Column(
        children: [
          // =====================================================
          // TOP BAR
          // =====================================================
          Row(
            children: [
              Builder(
                builder: (context) {
                  return _glassButton(
                    icon: Icons.menu,
                    onTap: () {
                      Scaffold.of(context).openDrawer();
                    },
                  );
                },
              ),
              const Spacer(),
              Image.asset(
                'assets/logo/agroexpress.png',
                height: 42,
                fit: BoxFit.contain,
                errorBuilder: (context, error, stackTrace) {
                  return const Icon(
                    Icons.local_shipping,
                    color: Colors.white,
                    size: 42,
                  );
                },
              ),
              const Spacer(),
              Stack(
                children: [
                  _glassButton(
                    icon: Icons.notifications_none,
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Notifikasi coming soon'),
                          duration: Duration(seconds: 2),
                        ),
                      );
                    },
                  ),
                  Positioned(
                    top: 10,
                    right: 10,
                    child: Container(
                      width: 10,
                      height: 10,
                      decoration: const BoxDecoration(
                        color: Colors.red,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 24),

          // =====================================================
          // PROFILE
          // =====================================================
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Hello Driver 👋',
                      style: GoogleFonts.poppins(
                        color: Colors.white70,
                        fontSize: 15,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Budi Santoso',
                      style: GoogleFonts.poppins(
                        color: Colors.white,
                        fontSize: 28,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        GestureDetector(
                          onTap: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Status: Online'),
                                duration: Duration(seconds: 2),
                              ),
                            );
                          },
                          child: _statusChip(
                            icon: Icons.circle,
                            text: 'Online',
                            color: Colors.greenAccent,
                          ),
                        ),
                        const SizedBox(width: 10),
                        GestureDetector(
                          onTap: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Rating 4.9 dari 128 review'),
                                duration: Duration(seconds: 2),
                              ),
                            );
                          },
                          child: _statusChip(
                            icon: Icons.star,
                            text: '4.9 (128)',
                            color: Colors.amber,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              GestureDetector(
                onTap: () {
                  context.go('/profile');
                },
                child: Container(
                  width: 76,
                  height: 76,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: Colors.white,
                      width: 3,
                    ),
                  ),
                  child: const CircleAvatar(
                    backgroundImage: AssetImage(
                      'assets/images/splash.png',
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // =====================================================
          // HEADER IMAGE (BANNER)
          // =====================================================
          GestureDetector(
            onTap: () {
              context.go('/shipments');
            },
            child: ClipRRect(
              borderRadius: BorderRadius.circular(24),
              child: Image.asset(
                'assets/header/header.png',
                width: double.infinity,
                height: 180,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return Container(
                    height: 180,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.10),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: const Center(
                      child: Icon(
                        Icons.image,
                        color: Colors.white,
                        size: 60,
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  // =========================================================
  // METRICS GRID
  // =========================================================

  Widget _buildMetricsGrid(BuildContext context) {
    final metrics = [
      {
        'icon': Icons.inventory_2_rounded,
        'value': '8',
        'label': 'Pengiriman',
        'sub': '+2 hari ini',
        'color': Colors.green,
        'route': '/shipments',
      },
      {
        'icon': Icons.local_shipping,
        'value': '3',
        'label': 'Berjalan',
        'sub': 'On Progress',
        'color': Colors.orange,
        'route': '/tracking',
      },
      {
        'icon': Icons.payments,
        'value': 'Rp450K',
        'label': 'Pendapatan',
        'sub': '+12%',
        'color': Colors.purple,
        'route': '/earnings',
      },
      {
        'icon': Icons.star,
        'value': '4.9',
        'label': 'Rating',
        'sub': '128 Review',
        'color': Colors.amber,
        'route': null,
      },
    ];

    return GridView.builder(
      shrinkWrap: true,
      itemCount: metrics.length,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 14,
        mainAxisSpacing: 14,
        childAspectRatio: 1.18,
      ),
      itemBuilder: (context, index) {
        final item = metrics[index];
        
        return GestureDetector(
          onTap: () {
            switch (index) {
              case 0:
                context.go('/shipments');
                break;
              case 1:
                context.go('/tracking');
                break;
              case 2:
                context.go('/earnings');
                break;
              case 3:
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Rating detail coming soon'),
                    duration: Duration(seconds: 2),
                  ),
                );
                break;
            }
          },
          child: _metricCard(
            icon: item['icon'] as IconData,
            value: item['value'] as String,
            label: item['label'] as String,
            subtitle: item['sub'] as String,
            color: item['color'] as Color,
          ),
        );
      },
    );
  }

  Widget _metricCard({
    required IconData icon,
    required String value,
    required String label,
    required String subtitle,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CircleAvatar(
            radius: 22,
            backgroundColor: color.withOpacity(0.12),
            child: Icon(icon, color: color),
          ),
          const Spacer(),
          Text(
            value,
            style: GoogleFonts.poppins(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: GoogleFonts.poppins(
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            subtitle,
            style: GoogleFonts.poppins(
              fontSize: 10,
              color: Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }

  // =========================================================
  // ACTIVE SHIPMENT
  // =========================================================

  Widget _buildActiveShipment(BuildContext context) {
    return GestureDetector(
      onTap: () {
        context.push('/tracking/SHP-20240607-0012');
      },
      child: _sectionContainer(
        title: 'Pengiriman Aktif',
        action: () {
          context.go('/shipments');
        },
        child: Column(
          children: [
            Row(
              children: [
                Image.asset(
                  'assets/icons/mobil.png',
                  width: 56,
                  height: 56,
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '#SHP-20240607-0012',
                        style: GoogleFonts.poppins(
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Bandung → Jakarta',
                        style: GoogleFonts.poppins(
                          fontSize: 12,
                          color: Colors.grey[700],
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 14,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.orange.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: Text(
                    'Pickup',
                    style: GoogleFonts.poppins(
                      color: Colors.orange,
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),
            Row(
              children: [
                const Icon(
                  Icons.schedule,
                  size: 18,
                  color: Colors.orange,
                ),
                const SizedBox(width: 6),
                Text(
                  'Estimasi 11:30',
                  style: GoogleFonts.poppins(
                    fontWeight: FontWeight.w600,
                    color: Colors.orange,
                  ),
                ),
                const Spacer(),
                Text(
                  '8.6 km lagi',
                  style: GoogleFonts.poppins(
                    color: Colors.grey[700],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  context.push('/tracking/SHP-20240607-0012');
                },
                icon: const Icon(Icons.navigation),
                label: const Text('Lihat Rute'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: secondaryGreen,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  padding: const EdgeInsets.symmetric(vertical: 15),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(18),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // =========================================================
  // QUICK ACTIONS
  // =========================================================

  Widget _buildQuickActions(BuildContext context) {
    final actions = [
      {
        'icon': 'assets/icons/mobil.png',
        'label': 'Shipment',
        'route': '/shipments',
        'materialIcon': null,
      },
      {
        'icon': 'assets/icons/motor.png',
        'label': 'Tracking',
        'route': '/tracking',
        'materialIcon': null,
      },
      {
        'icon': null,
        'label': 'Earnings',
        'route': '/earnings',
        'materialIcon': Icons.payments,
      },
      {
        'icon': null,
        'label': 'Profile',
        'route': '/profile',
        'materialIcon': Icons.person,
      },
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Menu Cepat',
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: actions.map((item) {
            return Expanded(
              child: GestureDetector(
                onTap: () {
                  context.go(item['route'] as String);
                },
                child: Column(
                  children: [
                    Container(
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      padding: const EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(22),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.04),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: item['icon'] != null
                          ? Image.asset(
                              item['icon'] as String,
                              width: 30,
                              height: 30,
                            )
                          : Icon(
                              item['materialIcon'] as IconData,
                              color: secondaryGreen,
                            ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      item['label'] as String,
                      style: GoogleFonts.poppins(
                        fontSize: 11,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  // =========================================================
  // WEEKLY STATS
  // =========================================================

  Widget _buildWeeklyStats(BuildContext context) {
    return _sectionContainer(
      title: 'Pengiriman Minggu Ini',
      action: () {
        context.go('/shipments');
      },
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildStatItem('Selesai', '24', Colors.green),
          _buildStatItem('Berjalan', '10', Colors.orange),
          _buildStatItem('Pending', '16', Colors.grey),
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, String value, Color color) {
    return Column(
      children: [
        Text(
          value,
          style: GoogleFonts.poppins(
            color: color,
            fontWeight: FontWeight.bold,
            fontSize: 28,
          ),
        ),
        Text(
          label,
          style: GoogleFonts.poppins(
            color: Colors.grey[700],
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  // =========================================================
  // WEEKLY EARNINGS
  // =========================================================

  Widget _buildWeeklyEarnings() {
    return _sectionContainer(
      title: 'Pendapatan Minggu Ini',
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Rp 2.450.000',
                  style: GoogleFonts.poppins(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '+18% dari minggu lalu',
                  style: GoogleFonts.poppins(
                    color: Colors.green,
                    fontWeight: FontWeight.w600,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.green.withOpacity(0.12),
              borderRadius: BorderRadius.circular(18),
            ),
            child: const Icon(
              Icons.trending_up,
              color: Colors.green,
              size: 34,
            ),
          ),
        ],
      ),
    );
  }

  // =========================================================
  // BOTTOM NAVIGATION
  // =========================================================

  Widget _buildBottomNav(BuildContext context) {
    // Get current route to determine selected index
    final String currentRoute = GoRouterState.of(context).uri.path;
    int selectedIndex = 0;
    
    switch (currentRoute) {
      case '/':
        selectedIndex = 0;
        break;
      case '/shipments':
        selectedIndex = 1;
        break;
      case '/tracking':
        selectedIndex = 2;
        break;
      case '/earnings':
        selectedIndex = 3;
        break;
      case '/profile':
        selectedIndex = 4;
        break;
      default:
        selectedIndex = 0;
    }

    return NavigationBar(
      backgroundColor: Colors.white,
      indicatorColor: secondaryGreen.withOpacity(0.12),
      selectedIndex: selectedIndex,
      onDestinationSelected: (index) {
        final routes = [
          '/',
          '/shipments',
          '/tracking',
          '/earnings',
          '/profile',
        ];
        context.go(routes[index]);
      },
      destinations: const [
        NavigationDestination(
          icon: Icon(Icons.dashboard_outlined),
          selectedIcon: Icon(Icons.dashboard),
          label: 'Dashboard',
        ),
        NavigationDestination(
          icon: Icon(Icons.local_shipping_outlined),
          selectedIcon: Icon(Icons.local_shipping),
          label: 'Shipment',
        ),
        NavigationDestination(
          icon: Icon(Icons.location_on_outlined),
          selectedIcon: Icon(Icons.location_on),
          label: 'Tracking',
        ),
        NavigationDestination(
          icon: Icon(Icons.payments_outlined),
          selectedIcon: Icon(Icons.payments),
          label: 'Earnings',
        ),
        NavigationDestination(
          icon: Icon(Icons.person_outline),
          selectedIcon: Icon(Icons.person),
          label: 'Profil',
        ),
      ],
    );
  }

  // =========================================================
  // REUSABLE SECTION
  // =========================================================

  Widget _sectionContainer({
    required String title,
    required Widget child,
    VoidCallback? action,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(26),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              Text(
                title,
                style: GoogleFonts.poppins(
                  fontWeight: FontWeight.bold,
                  fontSize: 17,
                ),
              ),
              const Spacer(),
              if (action != null)
                TextButton(
                  onPressed: action,
                  child: const Text('Lihat'),
                ),
            ],
          ),
          const SizedBox(height: 18),
          child,
        ],
      ),
    );
  }

  // =========================================================
  // GLASS BUTTON
  // =========================================================

  Widget _glassButton({
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(14),
      child: BackdropFilter(
        filter: ImageFilter.blur(
          sigmaX: 10,
          sigmaY: 10,
        ),
        child: InkWell(
          onTap: onTap,
          child: Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.15),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(
              icon,
              color: Colors.white,
            ),
          ),
        ),
      ),
    );
  }

  // =========================================================
  // STATUS CHIP
  // =========================================================

  Widget _statusChip({
    required IconData icon,
    required String text,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 12,
        vertical: 7,
      ),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.15),
        borderRadius: BorderRadius.circular(40),
      ),
      child: Row(
        children: [
          Icon(
            icon,
            color: color,
            size: 14,
          ),
          const SizedBox(width: 6),
          Text(
            text,
            style: GoogleFonts.poppins(
              color: Colors.white,
              fontSize: 11,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}