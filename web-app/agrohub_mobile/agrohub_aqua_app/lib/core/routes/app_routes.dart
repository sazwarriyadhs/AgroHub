// lib/core/routes/app_routes.dart

class AppRoutes {
  AppRoutes._();

  // Auth
  static const String splash = '/';
  static const String login = '/login';
  static const String register = '/register';
  static const String forgotPassword = '/forgot-password';

  // Dashboard
  static const String dashboard = '/dashboard';

  // Pond
  static const String pond = '/pond';
  static const String pondDetail = '/pond/:id';

  // Monitoring
  static const String waterQuality = '/water-quality';
  static const String monitoring = '/monitoring';
  static const String ai = '/ai';
  static const String feeding = '/feeding';
  static const String harvest = '/harvest';

  // Marketplace
  static const String marketplace = '/marketplace';
  static const String productDetail = '/product/:id';
  static const String cart = '/cart';
  static const String checkout = '/checkout';
  static const String wallet = '/wallet';

  // Live / IoT
  static const String liveStream = '/live';
  static const String iot = '/iot';
  static const String analytics = '/analytics';

  // User
  static const String notifications = '/notifications';
  static const String kyc = '/kyc';
  static const String profile = '/profile';
  static const String settings = '/settings';
}


