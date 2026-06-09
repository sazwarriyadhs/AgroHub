// lib/features/dashboard/presentation/dashboard_sidebar.dart

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../core/constants/assets_constants.dart';
import '../../../core/routes/app_routes.dart';
import '../../auth/bloc/auth_bloc.dart';

// Import all screens
import '../../sell/presentation/sell_product_screen.dart';
import '../../buy/presentation/buy_product_screen.dart';
import '../../crops/presentation/my_crops_screen.dart';
import '../../weather/presentation/weather_screen.dart';
import '../../market/presentation/market_prices_screen.dart';
import '../../tasks/presentation/tasks_screen.dart';
import '../../notifications/presentation/notifications_screen.dart';
import '../../profile/presentation/profile_screen.dart';
import '../../settings/presentation/settings_screen.dart';
import '../../help/presentation/help_screen.dart';

class DashboardSidebar extends StatefulWidget {
  final bool isExpanded;
  final VoidCallback onToggle;

  const DashboardSidebar({
    super.key,
    required this.isExpanded,
    required this.onToggle,
  });

  @override
  State<DashboardSidebar> createState() => _DashboardSidebarState();
}

class _DashboardSidebarState extends State<DashboardSidebar> {
  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOutCubic,
      width: widget.isExpanded ? 260 : 70,
      decoration: BoxDecoration(
        color: Colors.white,
        border: const Border(
          right: BorderSide(color: Color(0xFFEAEAEA), width: 1),
        ),
      ),
      child: Column(
        children: [
          _buildLogoAndToggle(),
          const SizedBox(height: 8),
          Expanded(child: _buildMenuItems(context)),
          _buildTipsCard(),
          const SizedBox(height: 16),
          _buildUserSection(context),
          const SizedBox(height: 12),
        ],
      ),
    );
  }

  Widget _buildLogoAndToggle() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          if (widget.isExpanded)
            Expanded(
              child: Image.asset(
                AssetConstants.logo,
                height: 45,
                fit: BoxFit.contain,
                errorBuilder: (context, error, stackTrace) {
                  return Container(
                    height: 40,
                    width: 40,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF1B8F3E), Color(0xFF0A4A2A)],
                      ),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Center(
                      child: Icon(Icons.agriculture, color: Colors.white, size: 24),
                    ),
                  );
                },
              ),
            ),
          IconButton(
            onPressed: widget.onToggle,
            icon: Icon(
              widget.isExpanded ? Icons.chevron_left : Icons.chevron_right,
              color: const Color(0xFF1B8F3E),
            ),
            tooltip: widget.isExpanded ? "Sembunyikan menu" : "Tampilkan menu",
          ),
        ],
      ),
    );
  }

  // 🌾 MENU ITEMS - Tanpa Quick Actions
  Widget _buildMenuItems(BuildContext context) {
    final menuItems = [
      {'icon': Icons.dashboard, 'title': 'Beranda Kebun', 'screen': null},
      {'icon': Icons.grass, 'title': 'Ladang Saya', 'screen': MyCropsScreen()},
      {'icon': Icons.cloud, 'title': 'Cuaca & Musim Tanam', 'screen': WeatherScreen()},
      {'icon': Icons.bar_chart, 'title': 'Harga Hasil Panen', 'screen': MarketPricesScreen()},
      {'icon': Icons.task_alt, 'title': 'Kerjaan Hari Ini', 'screen': TasksScreen()},
      {'icon': Icons.sell, 'title': 'Jual Hasil Panen', 'screen': SellProductScreen()},
      {'icon': Icons.shopping_cart, 'title': 'Beli Kebutuhan Tani', 'screen': BuyProductScreen()},
      {'icon': Icons.notifications, 'title': 'Peringatan (Cuaca/Hama)', 'screen': NotificationsScreen()},
      {'icon': Icons.person, 'title': 'Profil Petani', 'screen': ProfileScreen()},
      {'icon': Icons.settings, 'title': 'Atur Aplikasi', 'screen': SettingsScreen()},
      {'icon': Icons.help, 'title': 'Panduan Bertani', 'screen': HelpScreen()},
    ];

    return ListView.builder(
      padding: EdgeInsets.zero,
      itemCount: menuItems.length,
      itemBuilder: (context, index) {
        final item = menuItems[index];
        final isActive = index == 0;
        
        return _SidebarMenuItem(
          icon: item['icon'] as IconData,
          title: item['title'] as String,
          isActive: isActive,
          isExpanded: widget.isExpanded,
          onTap: () {
            if (item['screen'] != null) {
              _navigateToScreen(context, item['screen'] as Widget);
            }
          },
        );
      },
    );
  }

  void _navigateToScreen(BuildContext context, Widget screen) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => screen),
    );
  }

  Widget _buildTipsCard() {
    if (!widget.isExpanded) return const SizedBox.shrink();
    
    return Container(
      margin: const EdgeInsets.all(12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.green.shade50, Colors.green.shade100],
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Image.asset(
            AssetConstants.panen1,
            height: 40,
            width: 40,
            errorBuilder: (context, error, stackTrace) {
              return Icon(Icons.eco, size: 32, color: Colors.green.shade700);
            },
          ),
          const SizedBox(height: 8),
          const Text(
            "💡 Tips Petani",
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11),
          ),
          const SizedBox(height: 4),
          const Text(
            "Siram tanaman pagi hari\nsebelum panas terik",
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 10, color: Colors.black54),
          ),
        ],
      ),
    );
  }

  Widget _buildUserSection(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(12),
      child: Column(
        children: [
          CircleAvatar(
            radius: widget.isExpanded ? 25 : 20,
            backgroundImage: const AssetImage(AssetConstants.farmer),
            backgroundColor: Colors.white,
          ),
          if (widget.isExpanded) ...[
            const SizedBox(height: 8),
            const Text(
              "Pak Rudi",
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
              textAlign: TextAlign.center,
            ),
            const Text(
              "Petani Padi & Cabai",
              style: TextStyle(fontSize: 10, color: Colors.grey),
              textAlign: TextAlign.center,
            ),
          ],
          const SizedBox(height: 8),
          _LogoutButton(isExpanded: widget.isExpanded),
        ],
      ),
    );
  }
}

class _SidebarMenuItem extends StatefulWidget {
  final IconData icon;
  final String title;
  final bool isActive;
  final bool isExpanded;
  final VoidCallback onTap;

  const _SidebarMenuItem({
    required this.icon,
    required this.title,
    required this.isActive,
    required this.isExpanded,
    required this.onTap,
  });

  @override
  State<_SidebarMenuItem> createState() => _SidebarMenuItemState();
}

class _SidebarMenuItemState extends State<_SidebarMenuItem> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: InkWell(
        onTap: widget.onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
          decoration: BoxDecoration(
            color: widget.isActive
                ? const Color(0xFF1B8F3E)
                : (_isHovered ? const Color(0xFF1B8F3E).withOpacity(0.1) : Colors.transparent),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              Icon(
                widget.icon,
                color: widget.isActive
                    ? Colors.white
                    : (_isHovered ? const Color(0xFF1B8F3E) : Colors.black87),
                size: 22,
              ),
              if (widget.isExpanded) ...[
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    widget.title,
                    style: TextStyle(
                      color: widget.isActive
                          ? Colors.white
                          : (_isHovered ? const Color(0xFF1B8F3E) : Colors.black87),
                      fontWeight: widget.isActive ? FontWeight.w600 : FontWeight.w500,
                      fontSize: 13,
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _LogoutButton extends StatefulWidget {
  final bool isExpanded;

  const _LogoutButton({required this.isExpanded});

  @override
  State<_LogoutButton> createState() => _LogoutButtonState();
}

class _LogoutButtonState extends State<_LogoutButton> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: InkWell(
        onTap: () => _showLogoutDialog(context),
        borderRadius: BorderRadius.circular(20),
        child: Container(
          padding: widget.isExpanded
              ? const EdgeInsets.symmetric(vertical: 8, horizontal: 12)
              : const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: _isHovered ? Colors.red.shade100 : Colors.red.shade50,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.logout,
                size: widget.isExpanded ? 14 : 18,
                color: _isHovered ? Colors.red.shade700 : Colors.red.shade600,
              ),
              if (widget.isExpanded) ...[
                const SizedBox(width: 4),
                Text(
                  "Keluar",
                  style: TextStyle(
                    fontSize: 11,
                    color: _isHovered ? Colors.red.shade700 : Colors.red.shade600,
                    fontWeight: _isHovered ? FontWeight.w600 : FontWeight.normal,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Keluar Aplikasi'),
          content: const Text('Yakin mau keluar dari AgroHub?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Batal'),
            ),
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                context.read<AuthBloc>().add(LogoutRequested());
                Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
              },
              style: TextButton.styleFrom(foregroundColor: Colors.red),
              child: const Text('Keluar'),
            ),
          ],
        );
      },
    );
  }
}