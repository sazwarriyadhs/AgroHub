// lib/features/wallet/presentation/screens/wallet_screen.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class WalletScreen extends StatelessWidget {
  const WalletScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF021A14),
      appBar: AppBar(title: const Text('Dompet'), centerTitle: true),
      body: Column(
        children: [
          Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(gradient: const LinearGradient(colors: [Color(0xFF1B8F3E), Color(0xFF0F6D2E)]), borderRadius: BorderRadius.circular(20)),
            child: Column(
              children: [
                const Text('Saldo', style: TextStyle(color: Colors.white70)),
                const SizedBox(height: 8),
                Text('Rp 12.500.000', style: GoogleFonts.poppins(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold)),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(child: _walletButton('Top Up', Icons.add)),
                    const SizedBox(width: 12),
                    Expanded(child: _walletButton('Tarik', Icons.arrow_upward, outlined: true)),
                  ],
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: 5,
              itemBuilder: (context, index) => Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: Colors.white.withOpacity(0.05), borderRadius: BorderRadius.circular(12)),
                child: Row(
                  children: [
                    Icon(index % 2 == 0 ? Icons.arrow_downward : Icons.arrow_upward, color: index % 2 == 0 ? Colors.green : Colors.red),
                    const SizedBox(width: 12),
                    Expanded(child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(index % 2 == 0 ? 'Top Up' : 'Penarikan', style: GoogleFonts.poppins(color: Colors.white)),
                        Text(' hari lalu', style: GoogleFonts.poppins(color: Colors.white54, fontSize: 11)),
                      ],
                    )),
                    Text(index % 2 == 0 ? '+Rp 100.000' : '-Rp 50.000', style: GoogleFonts.poppins(color: index % 2 == 0 ? Colors.green : Colors.red)),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _walletButton(String label, IconData icon, {bool outlined = false}) {
    return outlined
        ? OutlinedButton.icon(onPressed: () {}, icon: Icon(icon), label: Text(label), style: OutlinedButton.styleFrom(foregroundColor: Colors.white, side: const BorderSide(color: Colors.white)))
        : ElevatedButton.icon(onPressed: () {}, icon: Icon(icon), label: Text(label), style: ElevatedButton.styleFrom(backgroundColor: Colors.white, foregroundColor: Colors.green));
  }
}
