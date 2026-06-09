import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class KycSuccessScreen extends StatelessWidget {
  const KycSuccessScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Text(
          'Seller Verified 🎉',
          style: GoogleFonts.poppins(fontSize: 20),
        ),
      ),
    );
  }
}


