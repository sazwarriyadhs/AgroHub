import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:agrohub_aqua_app/features/dashboard/presentation/screens/aqua_dashboard.dart';
import 'package:agrohub_aqua_app/core/services/api_service.dart';
import 'package:agrohub_aqua_app/app/theme/app_theme.dart';

class AgroHubAquaApp extends StatelessWidget {
  const AgroHubAquaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AgroHub Aqua',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        fontFamily: GoogleFonts.poppins().fontFamily,
        primaryColor: AppTheme.primaryColor,
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppTheme.primaryColor,
          primary: AppTheme.primaryColor,
        ),
        appBarTheme: const AppBarTheme(
          elevation: 0,
          centerTitle: false,
          backgroundColor: Colors.transparent,
          foregroundColor: Colors.black87,
        ),
        scaffoldBackgroundColor: const Color(0xFFF4F7FC),
      ),
      home: const AquaDashboard(),
    );
  }
}
