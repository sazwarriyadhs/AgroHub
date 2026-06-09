import 'package:flutter/material.dart';

class DriversScreen extends StatelessWidget {
  const DriversScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Drivers'),
        backgroundColor: Colors.green,
        foregroundColor: Colors.white,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.people, size: 64, color: Colors.green),
            const SizedBox(height: 16),
            const Text(
              'Drivers Module',
              style: TextStyle(fontSize: 24),
            ),
            const SizedBox(height: 8),
            const Text('Coming Soon'),
          ],
        ),
      ),
    );
  }
}
