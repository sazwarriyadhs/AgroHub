import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';

// PATH IMPORT BARU SETELAH MIGRASI FEATURE-FIRST
import 'package:agrohub_customer/features/auth/providers/user_provider.dart';
import 'package:agrohub_customer/features/cart_checkout/providers/cart_provider.dart';
import 'package:agrohub_customer/features/marketplace/providers/product_provider.dart';
import 'package:agrohub_customer/features/auth/presentation/screens/splash_screen.dart';
import 'package:agrohub_customer/features/dashboard_account/providers/navigation_provider.dart';

// IMPORT SCREENS UNTUK ROUTING
import 'package:agrohub_customer/features/auth/presentation/screens/login_screen.dart';
import 'package:agrohub_customer/features/dashboard_account/presentation/screens/dashboard_customer_screen.dart';
import 'package:agrohub_customer/features/marketplace/presentation/screens/marketplace_screen.dart';
import 'package:agrohub_customer/features/cart_checkout/presentation/screens/cart_screen.dart';
import 'package:agrohub_customer/features/dashboard_account/presentation/screens/profile_screen.dart';

// SERVICES
import 'package:agrohub_customer/services/http_service.dart';
// import 'package:agrohub_customer/services/deepseek_service.dart'; // Aktifkan nanti jika service sudah siap

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // 🛠️ FIX: Menghapus 'await' karena HttpService.init() adalah fungsi synchronous (void)
  HttpService.init();
  // await DeepSeekService.init(); 
  
  runApp(const AgroHubCustomerApp());
}

class AgroHubCustomerApp extends StatelessWidget {
  const AgroHubCustomerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => UserProvider()..loadSavedAuth()),
        ChangeNotifierProvider(create: (_) => CartProvider()),
        ChangeNotifierProvider(create: (_) => NavigationProvider()),
        ChangeNotifierProvider(create: (_) => ProductProvider()),
      ],
      child: MaterialApp(
        title: 'AgroHub Customer',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          fontFamily: GoogleFonts.poppins().fontFamily,
          fontFamilyFallback: const [
            'NotoSans',
            'Roboto',
            'Arial',
            'sans-serif',
            'Segoe UI Emoji',
            'Apple Color Emoji',
            'Noto Color Emoji',
          ],
          primaryColor: const Color(0xFF1B5E20),
          scaffoldBackgroundColor: const Color(0xFFF5F7F2),
          appBarTheme: const AppBarTheme(
            backgroundColor: Colors.transparent,
            elevation: 0,
            centerTitle: true,
            iconTheme: IconThemeData(color: Colors.black87),
            titleTextStyle: TextStyle(
              color: Colors.black87,
              fontSize: 18,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        
        // 🏠 HOME: SplashScreen
        home: const SplashScreen(),

        // 📍 ROUTES
        routes: {
          '/login': (context) => const LoginScreen(),
          '/dashboard': (context) => const DashboardCustomerScreen(),
          '/marketplace': (context) => const MarketplaceScreen(),
          '/cart': (context) => const CartScreen(),
          '/profile': (context) => const ProfileScreen(),
        },
        
        // 🔥 UNKNOWN ROUTE HANDLER
        onGenerateRoute: (settings) {
          if (settings.name == '/product') {
            // Handle dynamic routes jika perlu
          }
          return null;
        },
        
        // 🔥 ERROR HANDLER
        onUnknownRoute: (settings) {
          return MaterialPageRoute(
            builder: (context) => Scaffold(
              body: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.error_outline,
                      size: 80,
                      color: Colors.red.shade300,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Halaman tidak ditemukan',
                      style: GoogleFonts.poppins(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Mohon maaf, halaman yang Anda tuju tidak tersedia',
                      style: GoogleFonts.poppins(
                        fontSize: 14,
                        color: Colors.grey.shade600,
                      ),
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.of(context).pushReplacementNamed('/dashboard');
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1B5E20),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text('Kembali ke Beranda'),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}