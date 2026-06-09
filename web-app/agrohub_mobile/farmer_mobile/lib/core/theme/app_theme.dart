import 'package:flutter/material.dart';

class AppTheme {

  static ThemeData get lightTheme {

    return ThemeData(
      useMaterial3: true,

      primaryColor: const Color(0xff1B8F3E),

      scaffoldBackgroundColor:
          const Color(0xFFF4F7FB),

      fontFamily: "Poppins",

      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xff1B8F3E),
      ),

      appBarTheme: const AppBarTheme(
        backgroundColor: Color(0xff1B8F3E),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
    );
  }
}