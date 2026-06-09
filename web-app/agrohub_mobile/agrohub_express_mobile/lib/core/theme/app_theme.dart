import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static ThemeData lightTheme = ThemeData(

    useMaterial3: true,

    scaffoldBackgroundColor: const Color(0xffF4F5F7),

    colorScheme: ColorScheme.fromSeed(
      seedColor: const Color(0xff00752A),
    ),

    textTheme: GoogleFonts.poppinsTextTheme(),

    appBarTheme: const AppBarTheme(
      centerTitle: false,
      elevation: 0,
      backgroundColor: Colors.transparent,
    ),

    navigationBarTheme: NavigationBarThemeData(

      backgroundColor: Colors.white,

      indicatorColor: Colors.green.shade100,

      labelTextStyle:
          WidgetStateProperty.all(

        const TextStyle(
          fontWeight: FontWeight.w600,
        ),
      ),
    ),
  );
}
