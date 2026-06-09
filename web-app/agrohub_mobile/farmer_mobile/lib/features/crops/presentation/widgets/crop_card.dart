// lib/features/dashboard/widgets/crops/crop_card.dart
import 'package:flutter/material.dart';
import '../../../../core/constants/assets_constants.dart';

class CropCard extends StatelessWidget {
  final String title;
  final int age;
  final int health;

  const CropCard({
    super.key,
    required this.title,
    required this.age,
    required this.health,
  });

  @override
  Widget build(BuildContext context) {
    final color = health >= 70 ? Colors.green : (health >= 40 ? Colors.orange : Colors.red);

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
            child: Image.asset(
              AssetConstants.panen1,
              height: 130,
              width: double.infinity,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  height: 130,
                  color: Colors.green.shade100,
                  child: const Center(
                    child: Icon(Icons.agriculture, size: 40, color: Colors.green),
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 2),
                Text("Umur  hari", style: const TextStyle(fontSize: 11, color: Colors.black54)),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: LinearProgressIndicator(
                          value: health / 100,
                          minHeight: 6,
                          backgroundColor: Colors.grey.shade200,
                          color: color,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text("%", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: color)),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
