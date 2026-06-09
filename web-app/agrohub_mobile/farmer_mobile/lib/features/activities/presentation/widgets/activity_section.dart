import 'package:flutter/material.dart';

class ActivitySection extends StatelessWidget {
  final List<dynamic> activities;

  const ActivitySection({super.key, required this.activities});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Aktivitas Terkini',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          if (activities.isEmpty)
            const Center(
              child: Padding(
                padding: EdgeInsets.all(32),
                child: Text('Belum ada aktivitas'),
              ),
            )
          else
            ...activities.map((activity) => ListTile(
              leading: CircleAvatar(
                backgroundColor: _getStatusColor(activity['status']),
                child: Icon(
                  _getStatusIcon(activity['status']),
                  size: 16,
                  color: Colors.white,
                ),
              ),
              title: Text(activity['title'] ?? ''),
              subtitle: Text(activity['time'] ?? ''),
              dense: true,
            )),
        ],
      ),
    );
  }

  Color _getStatusColor(String? status) {
    switch (status) {
      case 'completed': return Colors.green;
      case 'pending': return Colors.orange;
      default: return Colors.grey;
    }
  }

  IconData _getStatusIcon(String? status) {
    switch (status) {
      case 'completed': return Icons.check;
      case 'pending': return Icons.access_time;
      default: return Icons.circle;
    }
  }
}
