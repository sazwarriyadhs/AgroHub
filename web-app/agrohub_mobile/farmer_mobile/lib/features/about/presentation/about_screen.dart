// lib/features/about/presentation/about_screen.dart
import 'package:flutter/material.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tentang Aplikasi'),
        backgroundColor: const Color(0xFF1B8F3E),
        foregroundColor: Colors.white,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.agriculture, size: 80, color: Color(0xFF1B8F3E)),
              const SizedBox(height: 20),
              const Text(
                'AgroHub Farmer',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              const Text('Version 1.0.0'),
              const SizedBox(height: 16),
              const Text(
                'Aplikasi untuk membantu petani menjual hasil panen dan membeli kebutuhan pertanian.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey),
              ),
              const SizedBox(height: 32),
              const Text('© 2024 AgroHub. All rights reserved.'),
            ],
          ),
        ),
      ),
    );
  }
}
