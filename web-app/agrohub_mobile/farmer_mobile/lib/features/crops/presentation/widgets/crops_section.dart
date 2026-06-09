// lib/features/crops/presentation/widgets/crops_section.dart

import 'package:flutter/material.dart';
import '../../../sell/models/commodity_type.dart';

class CropsSection extends StatelessWidget {
  final List<CommodityType> crops;

  const CropsSection({
    super.key,
    required this.crops,
  });

  @override
  Widget build(BuildContext context) {
    if (crops.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
        ),
        child: const Column(
          children: [
            Icon(Icons.agriculture, size: 48, color: Colors.grey),
            SizedBox(height: 12),
            Text(
              "Belum ada komoditas",
              style: TextStyle(color: Colors.grey),
            ),
            SizedBox(height: 8),
            Text(
              "Mulai jual hasil panenmu",
              style: TextStyle(fontSize: 12, color: Colors.grey),
            ),
          ],
        ),
      );
    }

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ListView.separated(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: crops.length > 3 ? 3 : crops.length,
        separatorBuilder: (_, __) => const Divider(height: 0),
        itemBuilder: (context, index) {
          final crop = crops[index];
          return ListTile(
            leading: _getCropIcon(crop.name),
            title: Text(
              crop.name,
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
            trailing: Text(
              // ✅ FIX: Handle nullable basePrice dengan default value 0
              _formatPrice(crop.basePrice ?? 0),
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: Color(0xFF1B8F3E),
              ),
            ),
            subtitle: Text(
              'Harga pasaran per ${crop.unit ?? 'kg'}',
              style: const TextStyle(fontSize: 12),
            ),
            onTap: () {
              // Navigate to crop detail or sell screen
              Navigator.pushNamed(
                context,
                '/sell',
                arguments: {'commodity': crop},
              );
            },
          );
        },
      ),
    );
  }

  // ✅ FIX: Terima double dengan default value
  String _formatPrice(double price) {
    if (price <= 0) return 'Rp 0';
    return 'Rp ${price.toStringAsFixed(0).replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
      (m) => '${m[1]}.',
    )}';
  }

  Widget _getCropIcon(String name) {
    final iconMap = {
      'Padi': '🌾',
      'Jagung': '🌽',
      'Cabai': '🌶️',
      'Bawang': '🧅',
      'Tomat': '🍅',
      'Kedelai': '🫘',
      'Beras': '🍚',
    };
    
    final icon = iconMap.entries.firstWhere(
      (e) => name.contains(e.key),
      orElse: () => const MapEntry('', '🌱'),
    ).value;
    
    return Text(icon, style: const TextStyle(fontSize: 28));
  }
}