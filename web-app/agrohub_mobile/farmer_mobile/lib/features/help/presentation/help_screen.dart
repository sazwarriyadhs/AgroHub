// lib/features/help/presentation/help_screen.dart
import 'package:flutter/material.dart';

class HelpScreen extends StatelessWidget {
  const HelpScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Bantuan'),
        backgroundColor: const Color(0xFF1B8F3E),
        foregroundColor: Colors.white,
      ),
      body: ListView(
        children: [
          _HelpItem(
            question: 'Cara menjual produk?',
            answer: '1. Buka menu Jual Hasil Panen\n2. Klik Tambah Produk\n3. Isi data produk\n4. Publish ke marketplace',
          ),
          _HelpItem(
            question: 'Bagaimana cara top up saldo?',
            answer: '1. Buka menu Dompet\n2. Klik Top Up\n3. Pilih metode pembayaran\n4. Konfirmasi pembayaran',
          ),
          _HelpItem(
            question: 'Laporan penjualan?',
            answer: 'Lihat di menu Dashboard bagian statistik penjualan',
          ),
        ],
      ),
    );
  }
}

class _HelpItem extends StatelessWidget {
  final String question;
  final String answer;

  const _HelpItem({required this.question, required this.answer});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(12),
      child: ExpansionTile(
        title: Text(question, style: const TextStyle(fontWeight: FontWeight.bold)),
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Text(answer),
          ),
        ],
      ),
    );
  }
}
