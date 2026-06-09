// lib/core/routes/app_routes.dart
import 'package:flutter/material.dart';
import '../../screens/splash_screen.dart';
import '../../screens/auth/login_screen.dart';
import '../../screens/auth/register_screen.dart';
import '../../screens/dashboard/herd_dashboard.dart';
import '../../screens/farm/ternak_screen.dart';
import '../../screens/farm/kesehatan_screen.dart';
import '../../screens/farm/pakan_screen.dart';
import '../../screens/financial/keuangan_screen.dart';
import '../../screens/market/marketplace_screen.dart';
import '../../screens/smart/ai_screen.dart';
import '../../screens/smart/live_screen.dart';
import '../../screens/komunitas_screen.dart';
import '../../screens/profile/profile_screen.dart';
import '../../screens/profile/breeding_screen.dart';
import '../../screens/profile/manajemen_screen.dart';
import '../../screens/membership/membership_screen.dart';

class AppRoutes {
  static const String splash = '/';
  static const String login = '/login';
  static const String register = '/register';
  static const String dashboard = '/dashboard';
  static const String herdDetail = '/herd-detail';
  static const String herdForm = '/herd-form';
  static const String ternak = '/ternak';
  static const String tambahTernak = '/tambah-ternak';
  static const String aktivitas = '/aktivitas';
  static const String kesehatan = '/kesehatan';
  static const String pakan = '/pakan';
  static const String keuangan = '/keuangan';
  static const String marketplace = '/marketplace';
  static const String profile = '/profile';
  static const String ai = '/ai';
  static const String live = '/live';
  static const String komunitas = '/komunitas';
  static const String breeding = '/breeding';
  static const String manajemen = '/manajemen';
  static const String membership = '/membership';
  
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case splash:
        return MaterialPageRoute(builder: (_) => const SplashScreen());
      case login:
        return MaterialPageRoute(builder: (_) => const LoginScreen());
      case register:
        return MaterialPageRoute(builder: (_) => const RegisterScreen());
      case dashboard:
        return MaterialPageRoute(builder: (_) => const HerdDashboard());
      case ternak:
        return MaterialPageRoute(builder: (_) => const TernakScreen());
      case tambahTernak:
        return MaterialPageRoute(builder: (_) => const TernakScreen());
      case aktivitas:
        return MaterialPageRoute(builder: (_) => const KesehatanScreen());
      case kesehatan:
        return MaterialPageRoute(builder: (_) => const KesehatanScreen());
      case pakan:
        return MaterialPageRoute(builder: (_) => const PakanScreen());
      case keuangan:
        return MaterialPageRoute(builder: (_) => const KeuanganScreen());
      case marketplace:
        return MaterialPageRoute(builder: (_) => const MarketplaceScreen());
      case ai:
        return MaterialPageRoute(builder: (_) => const AIScreen());
      case live:
        return MaterialPageRoute(builder: (_) => const LiveScreen());
      case komunitas:
        return MaterialPageRoute(builder: (_) => const KomunitasScreen());
      case profile:
        return MaterialPageRoute(builder: (_) => const ProfileScreen());
      case breeding:
        return MaterialPageRoute(builder: (_) => const BreedingScreen());
      case manajemen:
        return MaterialPageRoute(builder: (_) => const ManajemenScreen());
      case membership:
        return MaterialPageRoute(builder: (_) => const MembershipScreen());
      case herdDetail:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            appBar: AppBar(
              title: const Text('Detail Ternak'),
              backgroundColor: Colors.green,
            ),
            body: const Center(child: Text('Halaman Detail Ternak')),
          ),
        );
      case herdForm:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            appBar: AppBar(
              title: const Text('Form Ternak'),
              backgroundColor: Colors.green,
            ),
            body: const Center(child: Text('Halaman Form Ternak')),
          ),
        );
      default:
        return MaterialPageRoute(
          builder: (context) => Scaffold(
            appBar: AppBar(
              title: const Text('Halaman Tidak Ditemukan'),
              backgroundColor: Colors.green,
            ),
            body: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, size: 80, color: Colors.grey),
                  const SizedBox(height: 16),
                  Text(
                    'Route: ${settings.name} tidak ditemukan',
                    style: const TextStyle(fontSize: 16, color: Colors.grey),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.pushReplacementNamed(context, splash);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                    ),
                    child: const Text('Kembali ke Beranda'),
                  ),
                ],
              ),
            ),
          ),
        );
    }
  }
}