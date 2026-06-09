import 'package:flutter/material.dart';

class FleetScreen extends StatelessWidget {
  const FleetScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Fleet'),
        backgroundColor: Colors.green,
        foregroundColor: Colors.white,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.directions_car, size: 64, color: Colors.green),
            const SizedBox(height: 16),
            const Text(
              'Fleet Module',
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
