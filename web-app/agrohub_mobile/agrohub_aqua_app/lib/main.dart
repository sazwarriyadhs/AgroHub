// lib/main.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

import 'app/theme/app_theme.dart';
import 'app/routes/app_routes.dart';
import 'features/dashboard/presentation/screens/aqua_dashboard.dart';
import 'features/auth/presentation/screens/login_screen.dart';
import 'features/splash/presentation/screens/splash_screen.dart';
import 'core/services/api_service.dart';

// PROVIDERS
import 'features/profile/providers/profile_provider.dart';
import 'features/auth/providers/auth_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final apiService = ApiService();
  final loggedInStatus = await apiService.isLoggedIn();

  runApp(AgroHubAquaApp(isLoggedIn: loggedInStatus));
}

class AgroHubAquaApp extends StatelessWidget {
  final bool isLoggedIn;

  const AgroHubAquaApp({super.key, required this.isLoggedIn});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        // ✅ FIXED: ProfileProvider tanpa parameter (gunakan internal service)
        ChangeNotifierProvider(
          create: (_) => ProfileProvider(),
        ),
        ChangeNotifierProvider(
          create: (_) => AuthProvider(),
        ),
      ],
      child: MaterialApp(
        title: 'AgroHub Aqua',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          fontFamily: GoogleFonts.poppins().fontFamily,
          primaryColor: AppTheme.primaryColor,
          colorScheme: ColorScheme.fromSeed(
            seedColor: AppTheme.primaryColor,
            primary: AppTheme.primaryColor,
            secondary: AppTheme.secondaryColor,
            error: AppTheme.errorColor,
          ),
          scaffoldBackgroundColor: AppTheme.backgroundColor,
        ),
        initialRoute: AppRoutes.splash,
        onGenerateRoute: (settings) {
          switch (settings.name) {
            case AppRoutes.splash:
              return MaterialPageRoute(
                builder: (_) => SplashScreen(isLoggedIn: isLoggedIn),
              );

            case AppRoutes.login:
              return MaterialPageRoute(
                builder: (_) => const LoginScreen(),
              );

            case AppRoutes.dashboard:
              return MaterialPageRoute(
                builder: (_) => const AquaDashboard(),
              );

            default:
              return MaterialPageRoute(
                builder: (_) =>
                    isLoggedIn ? const AquaDashboard() : const LoginScreen(),
              );
          }
        },
      ),
    );
  }
}