import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

// FIX IMPORT: Jalur absolut akurat sesuai struktur tree /f direktori kamu
import 'package:agrohub_customer/features/cart_checkout/providers/cart_provider.dart';
import 'package:agrohub_customer/features/dashboard_account/presentation/screens/dashboard_customer_screen.dart';
import 'package:agrohub_customer/features/marketplace/presentation/screens/category_screen.dart';
import 'package:agrohub_customer/features/core_services/presentation/screens/agrolive_screen.dart';
import 'package:agrohub_customer/features/cart_checkout/presentation/screens/cart_screen.dart';
import 'package:agrohub_customer/features/dashboard_account/presentation/screens/profile_screen.dart';

class MainWrapper extends StatefulWidget {
  const MainWrapper({super.key});

  @override
  State<MainWrapper> createState() => _MainWrapperState();
}

class _MainWrapperState extends State<MainWrapper> {
  int _currentIndex = 0;

  // Inisialisasi screen-screen utama dari masing-masing folder fitur
  final List<Widget> _screens = [
    const DashboardCustomerScreen(),
    const CategoryScreen(),
    const AgroLiveScreen(),
    const CartScreen(),
    const ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    // Mendengarkan perubahan data keranjang belanja untuk badge notifikasi
    final cartProvider = context.watch<CartProvider>();
    
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: Container(
        height: 70,
        margin: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(22),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.06),
              blurRadius: 16,
              offset: const Offset(0, 6),
            )
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _buildNavItem(Icons.home_rounded, 'Beranda', 0),
            _buildNavItem(Icons.grid_view_rounded, 'Kategori', 1),
            _buildNavItem(Icons.live_tv_rounded, 'AgroLive', 2),
            _buildNavItemWithBadge(Icons.shopping_cart_rounded, 'Keranjang', 3, cartProvider.totalItems),
            _buildNavItem(Icons.person_rounded, 'Akun', 4),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem(IconData icon, String label, int index) {
    final isSelected = _currentIndex == index;
    return Expanded(
      child: InkWell(
        onTap: () {
          setState(() {
            _currentIndex = index;
          });
        },
        borderRadius: BorderRadius.circular(12),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              color: isSelected ? const Color(0xFF1B5E20) : Colors.grey.shade500,
              size: 24,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: GoogleFonts.poppins(
                fontSize: 10,
                fontWeight: FontWeight.w500,
                color: isSelected ? const Color(0xFF1B5E20) : Colors.grey.shade500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItemWithBadge(IconData icon, String label, int index, int badgeCount) {
    final isSelected = _currentIndex == index;
    return Expanded(
      child: InkWell(
        onTap: () {
          setState(() {
            _currentIndex = index;
          });
        },
        borderRadius: BorderRadius.circular(12),
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  icon,
                  color: isSelected ? const Color(0xFF1B5E20) : Colors.grey.shade500,
                  size: 24,
                ),
                const SizedBox(height: 4),
                Text(
                  label,
                  style: GoogleFonts.poppins(
                    fontSize: 10,
                    fontWeight: FontWeight.w500,
                    color: isSelected ? const Color(0xFF1B5E20) : Colors.grey.shade500,
                  ),
                ),
              ],
            ),
            if (badgeCount > 0)
              Positioned(
                top: -4,
                right: 20,
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: const BoxDecoration(
                    color: Colors.red,
                    shape: BoxShape.circle,
                  ),
                  constraints: const BoxConstraints(
                    minWidth: 18,
                    minHeight: 18,
                  ),
                  child: Text(
                    badgeCount > 99 ? '99+' : '$badgeCount',
                    style: GoogleFonts.poppins(
                      color: Colors.white,
                      fontSize: 9,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}