// lib/features/orders/presentation/screens/order_screen.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class OrderScreen extends StatelessWidget {
  const OrderScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF021A14),
      appBar: AppBar(title: const Text('Pesanan'), centerTitle: true),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: 5,
        itemBuilder: (context, index) => Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: Colors.white.withOpacity(0.05), borderRadius: BorderRadius.circular(16)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Order #ORD00', style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.w600)),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(color: Colors.orange.withOpacity(0.2), borderRadius: BorderRadius.circular(12)),
                    child: const Text('Processing', style: TextStyle(color: Colors.orange, fontSize: 10)),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text('Total: Rp ', style: GoogleFonts.poppins(color: Colors.greenAccent)),
              Text(' items', style: GoogleFonts.poppins(color: Colors.white54, fontSize: 12)),
            ],
          ),
        ),
      ),
    );
  }
}
