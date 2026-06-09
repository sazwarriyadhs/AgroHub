// lib/features/dashboard/presentation/quick_actions_section.dart
import 'package:flutter/material.dart';

class QuickActionsSection extends StatelessWidget {
  const QuickActionsSection({super.key});

  @override
  Widget build(BuildContext context) {
    final items = [
      {"title": "Jual", "icon": Icons.store, "color": Colors.green, "route": "/sell"},
      {"title": "Beli", "icon": Icons.shopping_cart, "color": Colors.orange, "route": "/buy"},
      {"title": "Panen", "icon": Icons.agriculture, "color": Colors.brown, "route": "/crops"},
      {"title": "AI", "icon": Icons.smart_toy, "color": Colors.blue, "route": "/ai"},
      {"title": "Wallet", "icon": Icons.account_balance_wallet, "color": Colors.purple, "route": "/wallet"},
      {"title": "Live", "icon": Icons.live_tv, "color": Colors.red, "route": "/live"},
    ];

    return SizedBox(
      height: 95,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: items.length,
        itemBuilder: (_, i) {
          final item = items[i];
          return GestureDetector(
            onTap: () {
              _handleNavigation(context, item['route'] as String, item['title'] as String);
            },
            child: Container(
              width: 90,
              margin: const EdgeInsets.only(right: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(18),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.1),
                    spreadRadius: 1,
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircleAvatar(
                    radius: 24,
                    backgroundColor: (item["color"] as Color).withOpacity(0.15),
                    child: Icon(
                      item["icon"] as IconData,
                      color: item["color"] as Color,
                      size: 28,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    item["title"] as String,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  void _handleNavigation(BuildContext context, String route, String title) {
    // ✅ Navigate ke screen yang sesuai
    switch (route) {
      case '/sell':
        Navigator.pushNamed(context, '/sell');
        break;
      case '/buy':
        Navigator.pushNamed(context, '/buy');
        break;
      case '/crops':
        Navigator.pushNamed(context, '/crops');
        break;
      case '/ai':
        Navigator.pushNamed(context, '/ai');
        break;
      case '/wallet':
        Navigator.pushNamed(context, '/wallet');
        break;
      case '/live':
        // ✅ LIVE STREAMING - AKTIF!
        Navigator.pushNamed(context, '/live');
        break;
      default:
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Fitur $title sedang dalam pengembangan'),
            backgroundColor: Colors.orange,
            duration: const Duration(seconds: 2),
          ),
        );
    }
  }
}