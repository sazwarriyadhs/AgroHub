// lib/core/routes/app_routes.dart

import 'package:flutter/material.dart';

// AUTH
import '../../features/auth/presentation/splash_screen.dart';
import '../../features/auth/presentation/login_screen.dart';
import '../../features/auth/presentation/register_screen.dart';

// MAIN FEATURES
import '../../features/dashboard/presentation/dashboard_screen.dart';
import '../../features/crops/presentation/my_crops_screen.dart';
import '../../features/sell/presentation/sell_product_screen.dart';
import '../../features/buy/presentation/buy_product_screen.dart';
import '../../features/tasks/presentation/tasks_screen.dart';
import '../../features/market/presentation/market_prices_screen.dart';
import '../../features/wallet/presentation/wallet_screen.dart';
import '../../features/community/presentation/community_screen.dart';
import '../../features/profile/presentation/profile_screen.dart';
import '../../features/notifications/presentation/notifications_screen.dart';
import '../../features/settings/presentation/settings_screen.dart';
import '../../features/help/presentation/help_screen.dart';
import '../../features/ai/presentation/ai_assistant_screen.dart';

// LIVE
import '../../features/live/livescreen.dart';

class AppRoutes {
  AppRoutes._();

  // AUTH
  static const String splash = "/";
  static const String login = "/login";
  static const String register = "/register";

  // MAIN
  static const String dashboard = "/dashboard";
  static const String myCrops = "/my-crops";
  static const String sellProduct = "/sell-product";
  static const String buyProduct = "/buy-product";
  static const String tasks = "/tasks";
  static const String marketPrices = "/market-prices";
  static const String wallet = "/wallet";
  static const String community = "/community";
  static const String profile = "/profile";
  static const String notifications = "/notifications";

  // rename supaya tidak bentrok
  static const String appSettings = "/settings";

  static const String help = "/help";
  static const String aiAssistant = "/ai-assistant";
  static const String live = "/live";

  static Route<dynamic> onGenerateRoute(
    RouteSettings routeSettings,
  ) {
    switch (routeSettings.name) {

      case splash:
        return _page(
          const SplashScreen(),
        );

      case login:
        return _page(
          const LoginScreen(),
        );

      case register:
        return _page(
          const RegisterScreen(),
        );

      case dashboard:
        return _page(
          const DashboardScreen(),
        );

      case myCrops:
        return _page(
          const MyCropsScreen(),
        );

      case sellProduct:
        return _page(
          const SellProductScreen(),
        );

      case buyProduct:
        return _page(
          const BuyProductScreen(),
        );

      case tasks:
        return _page(
          const TasksScreen(),
        );

      case marketPrices:
        return _page(
          const MarketPricesScreen(),
        );

      case wallet:
        return _page(
          const WalletScreen(),
        );

      case community:
        return _page(
          const CommunityScreen(),
        );

      case profile:
        return _page(
          const ProfileScreen(),
        );

      case notifications:
        return _page(
          const NotificationsScreen(),
        );

      case appSettings:
        return _page(
          const SettingsScreen(),
        );

      case help:
        return _page(
          const HelpScreen(),
        );

      case aiAssistant:
        return _page(
          const AiAssistantScreen(),
        );

      case live:
        return _page(
          const LiveScreen(),
        );

      default:
        return _notFound(
          routeSettings.name,
        );
    }
  }

  static MaterialPageRoute _page(
    Widget child,
  ) {
    return MaterialPageRoute(
      builder: (_) => child,
    );
  }

  static MaterialPageRoute _notFound(
    String? route,
  ) {
    return MaterialPageRoute(
      builder: (_) => Scaffold(
        appBar: AppBar(
          title: const Text(
            "Route Error",
          ),
        ),
        body: Center(
          child: Text(
            "Route tidak ditemukan:\n$route",
            textAlign: TextAlign.center,
          ),
        ),
      ),
    );
  }
}