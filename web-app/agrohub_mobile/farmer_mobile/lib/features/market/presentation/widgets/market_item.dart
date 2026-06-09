// lib/features/dashboard/widgets/market/market_item.dart
import 'package:flutter/material.dart';

class MarketItem extends StatelessWidget {
  final String title;
  final String price;
  final String change;
  final bool isPositive;

  const MarketItem({
    super.key,
    required this.title,
    required this.price,
    required this.change,
    required this.isPositive,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(5),
            decoration: BoxDecoration(
              color: Colors.orange.withOpacity(0.1),
              borderRadius: BorderRadius.circular(6),
            ),
            child: const Icon(Icons.trending_up, size: 12, color: Color(0xFFFF8C1A)),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500)),
                Text(price, style: const TextStyle(fontSize: 9, color: Colors.black45)),
              ],
            ),
          ),
          Text(
            change,
            style: TextStyle(
              color: isPositive ? Colors.green : Colors.red,
              fontWeight: FontWeight.bold,
              fontSize: 11,
            ),
          ),
        ],
      ),
    );
  }
}
