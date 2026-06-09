// core/routes/app_routes.dart

import 'package:flutter/material.dart';

import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/auth/presentation/screens/register_screen.dart';
import '../../features/auth/presentation/screens/forgot_password_screen.dart';
import '../../features/auth/presentation/screens/change_password_screen.dart';
import '../../features/auth/presentation/screens/splash_screen.dart';
import '../../features/dashboard/presentation/screens/dashboard_screen.dart';
import '../../features/dashboard/presentation/screens/ai_insight_screen.dart';
import '../../features/profile/presentation/screens/profile_screen.dart';
import '../../features/stores/presentation/screens/store_profile_screen.dart';
import '../../features/marketplace/presentation/screens/marketplace_screen.dart';
import '../../features/products/presentation/screens/product_list_screen.dart';
import '../../features/orders/presentation/screens/order_screen.dart';
import '../../features/inventory/presentation/screens/inventory_screen.dart';
import '../../features/wallet/presentation/screens/wallet_screen.dart';
import '../../features/add_product/presentation/screens/add_product_screen.dart';
import '../../features/activities/presentation/screens/activities_screen.dart';
import '../../features/notifications/presentation/screens/notifications_screen.dart';
import '../../features/settings/presentation/screens/settings_screen.dart';

class AppRoutes {
  static const String splash = '/';
  static const String login = '/login';
  static const String register = '/register';
  static const String forgotPassword = '/forgot-password';
  static const String changePassword = '/change-password';
  static const String dashboard = '/dashboard';
  static const String marketplace = '/marketplace';
  static const String products = '/products';
  static const String orders = '/orders';
  static const String inventory = '/inventory';
  static const String wallet = '/wallet';
  static const String profile = '/profile';
  static const String storeProfile = '/store-profile';
  static const String addProduct = '/add-product';
  static const String aiAnalytics = '/ai-analytics';
  static const String activities = '/activities';
  static const String productDetail = '/product-detail';
  static const String orderDetail = '/order-detail';
  static const String editProduct = '/edit-product';
  static const String notifications = '/notifications';
  static const String settingsRoute = '/settings';  // ✅ Ganti nama jadi settingsRoute

  static Route<dynamic> onGenerateRoute(RouteSettings routeSettings) {  // ✅ Ganti parameter name
    debugPrint('🔍 Navigating to: ${routeSettings.name}');
    
    switch (routeSettings.name) {  // ✅ Pakai routeSettings.name
      case splash:
        return MaterialPageRoute(builder: (_) => const SplashScreen());
      case login:
        return MaterialPageRoute(builder: (_) => const LoginScreen());
      case register:
        return MaterialPageRoute(builder: (_) => const RegisterScreen());
      case forgotPassword:
        return MaterialPageRoute(builder: (_) => const ForgotPasswordScreen());
      case changePassword:
        return MaterialPageRoute(builder: (_) => const ChangePasswordScreen());
      case dashboard:
        return MaterialPageRoute(builder: (_) => const DashboardScreen());
      case profile:
        return MaterialPageRoute(builder: (_) => const ProfileScreen());
      case storeProfile:
        return MaterialPageRoute(builder: (_) => const StoreProfileScreen());
      case marketplace:
        return MaterialPageRoute(builder: (_) => const MarketplaceScreen());
      case products:
        return MaterialPageRoute(builder: (_) => const ProductListScreen());
      case orders:
        return MaterialPageRoute(builder: (_) => const OrderScreen());
      case inventory:
        return MaterialPageRoute(builder: (_) => const InventoryScreen());
      case wallet:
        return MaterialPageRoute(builder: (_) => const WalletScreen());
      case addProduct:
        return MaterialPageRoute(builder: (_) => const AddProductScreen());
      case aiAnalytics:
        return MaterialPageRoute(builder: (_) => const AiInsightScreen());
      case activities:
        return MaterialPageRoute(builder: (_) => const ActivitiesScreen());
      case notifications:
        return MaterialPageRoute(builder: (_) => const NotificationsScreen());
      case settingsRoute:  // ✅ Pakai settingsRoute
        return MaterialPageRoute(builder: (_) => const SettingsScreen());
      default:
        debugPrint('⚠️ Route not found: ${routeSettings.name}, redirecting to splash');
        return MaterialPageRoute(builder: (_) => const SplashScreen());
    }
  }
}