import 'package:flutter/material.dart';

class BreedingCard extends StatelessWidget {
  final String title;
  final String species;
  final String status;
  final double progress;
  final int eggCount;
  final double hatchRate;

  const BreedingCard({
    super.key,
    required this.title,
    required this.species,
    required this.status,
    required this.progress,
    required this.eggCount,
    required this.hatchRate,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: LinearGradient(
          colors: [
            Colors.white,
            Colors.blue.shade50,
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 12,
            offset: const Offset(0, 6),
          )
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [

          // 🔥 HEADER ROW
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [

              // TITLE
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    "🐟 $species",
                    style: const TextStyle(
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),

              // STATUS CHIP
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: _statusColor(status).withOpacity(0.15),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  status,
                  style: TextStyle(
                    color: _statusColor(status),
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),

          // 📊 PROGRESS BAR
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: LinearProgressIndicator(
              value: progress,
              minHeight: 8,
              backgroundColor: Colors.grey.shade200,
              valueColor: AlwaysStoppedAnimation(
                _statusColor(status),
              ),
            ),
          ),

          const SizedBox(height: 12),

          // 📈 KPI ROW
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [

              _KpiMini(
                label: "Egg",
                value: "$eggCount",
                icon: Icons.egg,
              ),

              _KpiMini(
                label: "Progress",
                value: "${(progress * 100).toInt()}%",
                icon: Icons.show_chart,
              ),

              _KpiMini(
                label: "Hatch",
                value: "${hatchRate.toStringAsFixed(0)}%",
                icon: Icons.verified,
              ),
            ],
          ),
        ],
      ),
    );
  }

  // 🎨 STATUS COLOR ENGINE
  Color _statusColor(String status) {
    switch (status.toLowerCase()) {
      case "incubation":
        return Colors.orange;
      case "hatching":
        return Colors.green;
      case "success":
        return Colors.blue;
      case "critical":
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}

//
// ===============================
// MINI KPI WIDGET
// ===============================
//
class _KpiMini extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;

  const _KpiMini({
    required this.label,
    required this.value,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, size: 18, color: Colors.blueGrey),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            color: Colors.grey,
          ),
        ),
      ],
    );
  }
}