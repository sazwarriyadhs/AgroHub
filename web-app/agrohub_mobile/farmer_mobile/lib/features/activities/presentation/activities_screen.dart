// lib/features/activities/presentation/activities_screen.dart
import 'package:flutter/material.dart';

class ActivitiesScreen extends StatefulWidget {
  const ActivitiesScreen({super.key});

  @override
  State<ActivitiesScreen> createState() => _ActivitiesScreenState();
}

class _ActivitiesScreenState extends State<ActivitiesScreen> {
  List<Map<String, dynamic>> _activities = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadActivities();
  }

  Future<void> _loadActivities() async {
    setState(() => _isLoading = true);
    await Future.delayed(const Duration(seconds: 1));
    setState(() {
      _activities = [
        {'icon': Icons.water_drop, 'color': Colors.blue, 'title': 'Penyiraman tanaman padi', 'time': 'Hari ini, 06:30', 'type': 'irrigation'},
        {'icon': Icons.grass, 'color': Colors.green, 'title': 'Pemupukan cabai merah', 'time': 'Kemarin, 16:45', 'type': 'fertilizer'},
        {'icon': Icons.bug_report, 'color': Colors.orange, 'title': 'Pengendalian hama tomat', 'time': 'Kemarin, 09:20', 'type': 'pest'},
        {'icon': Icons.sell, 'color': Colors.green, 'title': 'Menjual padi 100kg', 'time': 'Kemarin, 08:00', 'type': 'sell'},
        {'icon': Icons.shopping_cart, 'color': Color(0xFFFF8C1A), 'title': 'Membeli pupuk NPK', 'time': '2 hari lalu, 14:30', 'type': 'buy'},
        {'icon': Icons.agriculture, 'color': Colors.brown, 'title': 'Pemeriksaan lahan jagung', 'time': '2 hari lalu, 08:10', 'type': 'inspect'},
      ];
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Riwayat Aktivitas'),
        backgroundColor: const Color(0xFF9C27B0),
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () {},
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadActivities,
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: _activities.length,
                itemBuilder: (context, index) {
                  final activity = _activities[index];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    child: ListTile(
                      leading: CircleAvatar(
                        backgroundColor: (activity['color'] as Color).withOpacity(0.1),
                        child: Icon(activity['icon'], color: activity['color']),
                      ),
                      title: Text(activity['title']),
                      subtitle: Text(activity['time']),
                      trailing: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade200,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          activity['type'].toUpperCase(),
                          style: const TextStyle(fontSize: 10),
                        ),
                      ),
                    ),
                  );
                },
              ),
      ),
    );
  }
}
