// lib/features/dashboard/presentation/dashboard_content.dart
import 'package:flutter/material.dart';
import '../blocs/dashboard_bloc.dart';
import '../widgets/stats/stats_grid.dart';
import '../widgets/crops/crops_section.dart';
import '../widgets/activity/activity_section.dart';
import '../widgets/task/task_section.dart';
import '../widgets/market/market_section.dart';

class DashboardContent extends StatelessWidget {
  final DashboardState state;

  const DashboardContent({super.key, required this.state});

  @override
  Widget build(BuildContext context) {
    // Mock data default
    List<Map<String, dynamic>> crops = [
      {'name': 'Padi', 'age_days': 45, 'health_percentage': 75},
      {'name': 'Cabai Merah', 'age_days': 60, 'health_percentage': 60},
      {'name': 'Tomat', 'age_days': 30, 'health_percentage': 40},
      {'name': 'Jagung', 'age_days': 35, 'health_percentage': 80},
    ];

    return Column(
      children: [
        const StatsGrid(),
        const SizedBox(height: 24),
        CropsSection(crops: crops),
        const SizedBox(height: 24),
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Expanded(child: ActivitySection()),
            SizedBox(width: 16),
            Expanded(child: TaskSection()),
            SizedBox(width: 16),
            Expanded(child: MarketSection()),
          ],
        ),
      ],
    );
  }
}