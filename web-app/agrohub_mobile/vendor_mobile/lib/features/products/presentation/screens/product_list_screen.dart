// lib/features/products/presentation/screens/product_list_screen.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ProductListScreen extends StatelessWidget {
  const ProductListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF021A14),
      appBar: AppBar(title: const Text('Produk Saya'), centerTitle: true),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: 5,
        itemBuilder: (context, index) => Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            children: [
              Container(width: 60, height: 60, decoration: BoxDecoration(color: Colors.green.withOpacity(0.2), borderRadius: BorderRadius.circular(12)),
                child: const Icon(Icons.inventory, color: Colors.white)),
              const SizedBox(width: 12),
              Expanded(child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Produk ', style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.w600)),
                  Text('Rp ', style: GoogleFonts.poppins(color: Colors.greenAccent)),
                  Text('Stok:  kg', style: GoogleFonts.poppins(color: Colors.white54, fontSize: 12)),
                ],
              )),
              Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(color: Colors.green.withOpacity(0.2), borderRadius: BorderRadius.circular(20)),
                child: const Text('Active', style: TextStyle(fontSize: 11, color: Colors.greenAccent))),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => Navigator.pushNamed(context, '/add-product'),
        backgroundColor: const Color(0xFF1B8F3E),
        child: const Icon(Icons.add),
      ),
    );
  }
}
