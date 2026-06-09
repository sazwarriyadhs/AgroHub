import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

// ✅ FIXED IMPORTS - Sesuaikan dengan struktur proyek Anda
import 'package:agrohub_customer/features/dashboard_account/presentation/screens/dashboard_customer_screen.dart';
import 'package:agrohub_customer/features/cart_checkout/presentation/screens/cart_screen.dart';
import 'package:agrohub_customer/features/marketplace/presentation/screens/product_detail_screen.dart';
import 'package:agrohub_customer/features/marketplace/presentation/screens/marketplace_screen.dart';
import 'package:agrohub_customer/features/marketplace/presentation/screens/flash_sale_screen.dart';
import 'package:agrohub_customer/features/marketplace/presentation/screens/category_detail_screen.dart';
import 'package:agrohub_customer/features/ai_smart/presentation/screens/ai_recipe_screen.dart';
import 'package:agrohub_customer/features/dashboard_account/presentation/screens/notification_screen.dart';
import 'package:agrohub_customer/features/cart_checkout/presentation/screens/orders_screen.dart';
import 'package:agrohub_customer/features/dashboard_account/presentation/screens/profile_screen.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/',
    debugLogDiagnostics: true, // 🔥 Untuk debugging (hapus di production)
    routes: [
      ShellRoute(
        builder: (context, state, child) {
          return MainWrapper(child: child);
        },
        routes: [
          // 🔥 MAIN BOTTOM NAV ROUTES
          GoRoute(
            path: '/',
            name: 'dashboard',
            builder: (context, state) => const DashboardCustomerScreen(),
          ),
          GoRoute(
            path: '/marketplace',
            name: 'marketplace',
            builder: (context, state) => const MarketplaceScreen(),
          ),
          GoRoute(
            path: '/cart',
            name: 'cart',
            builder: (context, state) => const CartScreen(),
          ),
          GoRoute(
            path: '/profile',
            name: 'profile',
            builder: (context, state) => const ProfileScreen(),
          ),
          
          // 🔥 ADDITIONAL ROUTES (tanpa bottom nav)
          GoRoute(
            path: '/product/:id',
            name: 'productDetail',
            builder: (context, state) {
              final id = state.pathParameters['id'];
              return ProductDetailScreen(productId: id!);
            },
          ),
          GoRoute(
            path: '/flash-sale',
            name: 'flashSale',
            builder: (context, state) => const FlashSaleScreen(),
          ),
          GoRoute(
            path: '/category/:id/:name',
            name: 'categoryDetail',
            builder: (context, state) {
              final id = state.pathParameters['id']!;
              final name = state.pathParameters['name']!;
              return CategoryDetailScreen(
                categoryId: int.parse(id),
                categoryName: Uri.decodeComponent(name),
              );
            },
          ),
          GoRoute(
            path: '/ai-recipe',
            name: 'aiRecipe',
            builder: (context, state) => const AIRecipeScreen(),
          ),
          GoRoute(
            path: '/notifications',
            name: 'notifications',
            builder: (context, state) => const NotificationScreen(),
          ),
          GoRoute(
            path: '/orders',
            name: 'orders',
            builder: (context, state) => const OrdersScreen(),
          ),
        ],
      ),
    ],
    // 🔥 ERROR HANDLER
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.error_outline,
              size: 64,
              color: Colors.red.shade300,
            ),
            const SizedBox(height: 16),
            Text(
              'Page not found',
              style: GoogleFonts.poppins(
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'The page you are looking for does not exist.',
              style: GoogleFonts.poppins(
                fontSize: 14,
                color: Colors.grey.shade600,
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                context.go('/');
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1B5E20),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text('Go to Home'),
            ),
          ],
        ),
      ),
    ),
    // 🔥 REDIRECT HANDLER (contoh untuk auth)
    redirect: (context, state) {
      // Contoh: redirect ke login jika belum login
      // final isLoggedIn = false;
      // if (!isLoggedIn && state.matchedLocation != '/login') {
      //   return '/login';
      // }
      return null; // Tidak ada redirect
    },
  );
}

// 🔥 BOTTOM NAVIGATION BAR
class MainWrapper extends StatelessWidget {
  final Widget child;
  
  const MainWrapper({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: child,
      bottomNavigationBar: const CustomBottomNavBar(),
    );
  }
}

// 🔥 CUSTOM BOTTOM NAVIGATION BAR
class CustomBottomNavBar extends StatelessWidget {
  const CustomBottomNavBar({super.key});

  static const Color primaryGreen = Color(0xFF1B5E20);
  static const Color secondaryGreen = Color(0xFF4CAF50);

  @override
  Widget build(BuildContext context) {
    final GoRouter router = GoRouter.of(context);
    final String currentLocation = router.state.uri.path;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        backgroundColor: Colors.white,
        selectedItemColor: primaryGreen,
        unselectedItemColor: Colors.grey.shade600,
        selectedLabelStyle: const TextStyle(
          fontWeight: FontWeight.w600,
          fontSize: 12,
        ),
        unselectedLabelStyle: const TextStyle(
          fontSize: 11,
        ),
        currentIndex: _getCurrentIndex(currentLocation),
        onTap: (index) => _onNavBarTap(context, index),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home),
            label: 'Beranda',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.store_outlined),
            activeIcon: Icon(Icons.store),
            label: 'Marketplace',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.shopping_cart_outlined),
            activeIcon: Icon(Icons.shopping_cart),
            label: 'Keranjang',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            activeIcon: Icon(Icons.person),
            label: 'Profil',
          ),
        ],
      ),
    );
  }

  int _getCurrentIndex(String location) {
    switch (location) {
      case '/':
        return 0;
      case '/marketplace':
        return 1;
      case '/cart':
        return 2;
      case '/profile':
        return 3;
      default:
        return 0;
    }
  }

  void _onNavBarTap(BuildContext context, int index) {
    switch (index) {
      case 0:
        context.go('/');
        break;
      case 1:
        context.go('/marketplace');
        break;
      case 2:
        context.go('/cart');
        break;
      case 3:
        context.go('/profile');
        break;
    }
  }
}

// 🔥 EXTENSION untuk memudahkan navigasi
extension GoRouterExtension on BuildContext {
  void goToDashboard() => go('/');
  void goToMarketplace() => go('/marketplace');
  void goToCart() => go('/cart');
  void goToProfile() => go('/profile');
  void goToProductDetail(String id) => go('/product/$id');
  void goToFlashSale() => go('/flash-sale');
  void goToCategoryDetail(int id, String name) => go('/category/$id/${Uri.encodeComponent(name)}');
  void goToAIRecipe() => go('/ai-recipe');
  void goToNotifications() => go('/notifications');
  void goToOrders() => go('/orders');
  
  void goBack() => pop();
  void popUntilRoot() => go('/');
}