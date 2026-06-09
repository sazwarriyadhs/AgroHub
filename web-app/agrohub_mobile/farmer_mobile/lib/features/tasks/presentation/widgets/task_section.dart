import 'package:flutter/material.dart';

class TaskSection extends StatelessWidget {
  final List<dynamic> tasks;

  const TaskSection({super.key, required this.tasks});

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
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Tugas Saya',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              Text(
                'Lihat semua →',
                style: TextStyle(color: Colors.green, fontSize: 12),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ...tasks.map((task) => ListTile(
            leading: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: _getPriorityColor(task['priority']).withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                Icons.check_circle_outline,
                size: 20,
                color: _getPriorityColor(task['priority']),
              ),
            ),
            title: Text(task['title'] ?? ''),
            subtitle: Text(task['dueDate'] ?? ''),
            trailing: Chip(
              label: Text(
                task['priority'] ?? 'medium',
                style: const TextStyle(fontSize: 10),
              ),
              backgroundColor: _getPriorityColor(task['priority']).withOpacity(0.2),
              padding: EdgeInsets.zero,
            ),
            dense: true,
          )),
        ],
      ),
    );
  }

  Color _getPriorityColor(String? priority) {
    switch (priority?.toLowerCase()) {
      case 'high': return Colors.red;
      case 'medium': return Colors.orange;
      case 'low': return Colors.green;
      default: return Colors.grey;
    }
  }
}
