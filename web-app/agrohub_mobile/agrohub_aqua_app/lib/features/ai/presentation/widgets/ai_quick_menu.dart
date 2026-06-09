import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AiQuickMenu extends StatelessWidget {
  final Function(String) onTap;

  const AiQuickMenu({
    super.key,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final items = [
      {"title": "Chat AI", "icon": Icons.chat, "key": "chat"},
      {"title": "Prediksi", "icon": Icons.show_chart, "key": "panen"},
      {"title": "Penyakit", "icon": Icons.bug_report, "key": "penyakit"},
      {"title": "Harga", "icon": Icons.attach_money, "key": "harga"},
      {"title": "Air Kolam", "icon": Icons.water_drop, "key": "air"},
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: items.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        mainAxisSpacing: 10,
        crossAxisSpacing: 10,
        childAspectRatio: 1,
      ),
      itemBuilder: (context, i) {
        final item = items[i];

        return GestureDetector(
          onTap: () => onTap(item["key"] as String),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                )
              ],
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(item["icon"] as IconData, color: Colors.blue),
                const SizedBox(height: 8),
                Text(
                  item["title"] as String,
                  style: GoogleFonts.poppins(fontSize: 11),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}