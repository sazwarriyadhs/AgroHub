import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:agrohub_aqua_app/app/theme/app_theme.dart';

class WaterQualityCard extends StatelessWidget {
  final String label;
  final String value;
  final String status;
  final IconData icon;

  const WaterQualityCard({
    super.key,
    required this.label,
    required this.value,
    required this.status,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    Color getStatusColor() {
      switch (status.toLowerCase()) {
        case 'normal':
        case 'good':
        case 'optimal':
        case 'safe':
          return AquaTheme.success;
        case 'warning':
          return AquaTheme.warning;
        case 'danger':
          return Colors.red;
        default:
          return AquaTheme.success;
      }
    }

    return Expanded(
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 4),
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: AquaTheme.primary.withOpacity(0.05),
          borderRadius: BorderRadius.circular(14),
        ),
        child: Column(
          children: [
            Icon(icon, color: AquaTheme.primary, size: 20),
            const SizedBox(height: 4),
            Text(
              label,
              style: GoogleFonts.poppins(fontSize: 11, color: Colors.grey[600]),
            ),
            const SizedBox(height: 4),
            Text(
              value,
              style: GoogleFonts.poppins(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: AquaTheme.primary,
              ),
            ),
            Text(
              status,
              style: GoogleFonts.poppins(fontSize: 9, color: getStatusColor()),
            ),
          ],
        ),
      ),
    );
  }
}



