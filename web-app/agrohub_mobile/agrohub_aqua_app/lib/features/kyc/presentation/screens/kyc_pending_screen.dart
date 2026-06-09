import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class KycPendingScreen extends StatelessWidget {
  const KycPendingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Text(
          'Verifikasi sedang diperiksa admin',
          style: GoogleFonts.poppins(fontSize: 18),
        ),
      ),
    );
  }
}


