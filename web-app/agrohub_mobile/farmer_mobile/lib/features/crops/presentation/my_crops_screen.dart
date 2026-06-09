// lib/features/crops/presentation/my_crops_screen.dart
import 'package:flutter/material.dart';
import '../../dashboard/presentation/farmer_bottom_navigation.dart';

class MyCropsScreen extends StatelessWidget {
  const MyCropsScreen({super.key});

  static const List<Map<String, String>> crops = [
    {
      'name': 'Padi',
      'age': '45 hari',
      'health': '75%',
      'status': 'Sehat'
    },
    {
      'name': 'Cabai Merah',
      'age': '60 hari',
      'health': '60%',
      'status': 'Perlu Perhatian'
    },
    {
      'name': 'Tomat',
      'age': '30 hari',
      'health': '80%',
      'status': 'Sehat'
    },
    {
      'name': 'Jagung',
      'age': '35 hari',
      'health': '40%',
      'status': 'Kritis'
    },
  ];

  Color _statusColor(String status) {
    switch (status) {
      case 'Sehat':
        return Colors.green;
      case 'Perlu Perhatian':
        return Colors.orange;
      default:
        return Colors.red;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Status Tanaman'),
        backgroundColor: const Color(0xFF1B8F3E),
        foregroundColor: Colors.white,
      ),

      // ✅ ADD BOTTOM NAV
      bottomNavigationBar: const FarmerBottomNavigation(
        currentIndex: 0, // dashboard/crops (sesuaikan routing kamu)
      ),

      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: crops.length,
        itemBuilder: (context, index) {
          final crop = crops[index];

          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: const Icon(
                Icons.agriculture,
                color: Color(0xFF1B8F3E),
              ),
              title: Text(crop['name'] ?? '-'),
              subtitle: Text(
                'Umur: ${crop['age']} • Kesehatan: ${crop['health']}',
              ),
              trailing: Chip(
                label: Text(
                  crop['status'] ?? '-',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                  ),
                ),
                backgroundColor: _statusColor(
                  crop['status'] ?? '',
                ),
              ),
              onTap: () {},
            ),
          );
        },
      ),
    );
  }
}