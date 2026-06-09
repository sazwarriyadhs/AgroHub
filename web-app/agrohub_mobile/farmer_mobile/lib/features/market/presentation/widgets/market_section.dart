// lib/features/market/presentation/widgets/market_section.dart

import 'package:flutter/material.dart';

class MarketSection extends StatelessWidget {
  final List<Map<String, dynamic>> prices;

  const MarketSection({
    super.key,
    required this.prices,
  });

  @override
  Widget build(BuildContext context) {
    if (prices.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
        ),
        child: const Column(
          children: [
            Icon(Icons.trending_down, size: 48, color: Colors.grey),
            SizedBox(height: 12),
            Text(
              "Belum ada data harga pasar",
              style: TextStyle(color: Colors.grey),
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
        itemCount: prices.length > 5 ? 5 : prices.length,
        separatorBuilder: (_, __) => const Divider(height: 0),
        itemBuilder: (context, index) {
          final item = prices[index];
          return ListTile(
            leading: _getCommodityIcon(item['commodity'] ?? ''),
            title: Text(
              item['commodity'] ?? '-',
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
            trailing: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  _formatPrice(item['price'] ?? 0),
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: _getPriceColor(item['change']),
                  ),
                ),
                if (item['change'] != null)
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        (item['change'] >= 0) ? Icons.arrow_upward : Icons.arrow_downward,
                        size: 12,
                        color: _getPriceColor(item['change']),
                      ),
                      const SizedBox(width: 2),
                      Text(
                        '${item['change'].abs().toStringAsFixed(2)}%',
                        style: TextStyle(
                          fontSize: 10,
                          color: _getPriceColor(item['change']),
                        ),
                      ),
                    ],
                  ),
              ],
            ),
            subtitle: Text(
              'Per ${item['unit'] ?? 'kg'}',
              style: const TextStyle(fontSize: 12),
            ),
          );
        },
      ),
    );
  }

  String _formatPrice(dynamic price) {
    final value = price is double ? price : (price ?? 0).toDouble();
    return 'Rp ${value.toStringAsFixed(0).replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
      (m) => '${m[1]}.',
    )}';
  }

  Color _getPriceColor(dynamic change) {
    if (change == null) return Colors.grey;
    final value = change is double ? change : (change ?? 0).toDouble();
    return value >= 0 ? Colors.green : Colors.red;
  }

  Widget _getCommodityIcon(String commodity) {
    final iconMap = {
      'Padi': '🌾',
      'Jagung': '🌽',
      'Cabai': '🌶️',
      'Bawang': '🧅',
      'Kedelai': '🫘',
      'Tomat': '🍅',
    };
    
    final icon = iconMap.entries.firstWhere(
      (e) => commodity.contains(e.key),
      orElse: () => const MapEntry('', '🌱'),
    ).value;
    
    return Text(icon, style: const TextStyle(fontSize: 28));
  }
}