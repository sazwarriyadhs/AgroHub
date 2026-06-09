import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class KycVerificationScreen extends StatelessWidget {
  const KycVerificationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Verifikasi Seller',
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: Center(
        child: Text(
          'KYC Verification Screen',
          style: GoogleFonts.poppins(fontSize: 18),
        ),
      ),
    );
  }
}


