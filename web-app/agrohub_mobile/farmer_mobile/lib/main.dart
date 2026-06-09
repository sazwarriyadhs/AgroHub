// lib/main.dart

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'injection/di_container.dart' as di;

// BLOCS
import 'features/auth/bloc/auth_bloc.dart';
import 'features/dashboard/blocs/dashboard_bloc.dart';

// AUTH
import 'features/auth/presentation/login_screen.dart';
import 'features/auth/presentation/register_screen.dart';
import 'features/auth/presentation/splash_screen.dart';

// DASHBOARD
import 'features/dashboard/presentation/dashboard_screen.dart';

// FEATURES
import 'features/sell/presentation/sell_product_screen.dart';
import 'features/buy/presentation/buy_product_screen.dart';
import 'features/crops/presentation/my_crops_screen.dart';
import 'features/market/presentation/market_prices_screen.dart';
import 'features/tasks/presentation/tasks_screen.dart';
import 'features/weather/presentation/weather_screen.dart';
import 'features/notifications/presentation/notifications_screen.dart';
import 'features/profile/presentation/profile_screen.dart';
import 'features/profile/presentation/edit_profile_screen.dart';
import 'features/settings/presentation/settings_screen.dart';
import 'features/help/presentation/help_screen.dart';
import 'features/wallet/presentation/wallet_screen.dart';
import 'features/community/presentation/community_screen.dart';
import 'features/ai/presentation/ai_assistant_screen.dart';

// ✅ FIX: Import cart.dart (path yang benar)
import 'features/cart/cart.dart';  // Karena file di: lib/features/cart/cart.dart

// LIVE
import 'features/live/livescreen.dart';

final GlobalKey<NavigatorState> navigatorKey =
    GlobalKey<NavigatorState>();

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await di.init();

  runApp(const AgroHubApp());
}

class AgroHubApp extends StatelessWidget {
  const AgroHubApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        // AUTH
        BlocProvider<AuthBloc>(
          create: (_) => di.sl<AuthBloc>(),
        ),

        // DASHBOARD
        BlocProvider<DashboardBloc>(
          create: (_) => di.sl<DashboardBloc>(),
        ),
      ],

      child: MaterialApp(
        navigatorKey: navigatorKey,

        debugShowCheckedModeBanner: false,

        title: "AgroHub Farmer",

        theme: ThemeData(
          useMaterial3: true,

          fontFamily: "Poppins",

          scaffoldBackgroundColor:
              const Color(0xFFF4F7FB),

          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF1B8F3E),
            brightness: Brightness.light,
          ),

          appBarTheme: const AppBarTheme(
            centerTitle: true,
            elevation: 0,
            backgroundColor: Color(0xFF1B8F3E),
            foregroundColor: Colors.white,
          ),

          bottomNavigationBarTheme:
              const BottomNavigationBarThemeData(
            type: BottomNavigationBarType.fixed,
            selectedItemColor: Color(0xFF16A34A),
            unselectedItemColor: Colors.grey,
            backgroundColor: Colors.white,
          ),

          elevatedButtonTheme:
              ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
              backgroundColor:
                  const Color(0xFF1B8F3E),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius:
                    BorderRadius.circular(14),
              ),
            ),
          ),
        ),

        initialRoute: "/splash",

        routes: {
          // AUTH
          "/splash": (_) => const SplashScreen(),
          "/login": (_) => const LoginScreen(),
          "/register": (_) => const RegisterScreen(),

          // DASHBOARD
          "/dashboard": (_) => const DashboardScreen(),

          // FEATURE ROUTES
          "/sell": (_) => const SellProductScreen(),
          "/buy": (_) => const BuyProductScreen(),
          "/crops": (_) => const MyCropsScreen(),
          "/market": (_) => const MarketPricesScreen(),
          "/tasks": (_) => const TasksScreen(),
          "/weather": (_) => const WeatherScreen(),
          "/notifications": (_) => const NotificationsScreen(),
          "/profile": (_) => const ProfileScreen(),
          
          // Profile related
          "/edit-profile": (_) => EditProfileScreen(),
          "/settings": (_) => SettingsScreen(),
          "/help": (_) => const HelpScreen(),
          "/wallet": (_) => const WalletScreen(),
          "/community": (_) => const CommunityScreen(),
          "/ai": (_) => const AiAssistantScreen(),
          
          // ✅ FIX: Cart route - gunakan CartScreen dari cart.dart
          // Cek apakah CartScreen berupa const atau tidak
          "/cart": (_) {
            // Jika CartScreen di cart.dart adalah StatelessWidget dengan const constructor
            // return const CartScreen();
            
            // Jika CartScreen di cart.dart adalah StatefulWidget atau tidak bisa const
            return CartScreen();
          },
          
          "/live": (_) => const LiveScreen(),
        },

        onUnknownRoute: (settings) {
          return MaterialPageRoute(
            builder: (_) => Scaffold(
              appBar: AppBar(
                title: const Text("Route Error"),
              ),
              body: Center(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(
                        Icons.error_outline,
                        size: 70,
                        color: Colors.red,
                      ),
                      const SizedBox(height: 20),
                      Text(
                        "Route tidak ditemukan:\n${settings.name}",
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: () {
                          navigatorKey.currentState
                              ?.pushNamedAndRemoveUntil(
                            "/dashboard",
                            (route) => false,
                          );
                        },
                        child: const Text("Kembali"),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}