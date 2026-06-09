// lib/features/dashboard/widgets/task/task_item.dart
import 'package:flutter/material.dart';

class TaskItem extends StatelessWidget {
  final String title;
  final String time;
  final Color color;

  const TaskItem({
    super.key,
    required this.title,
    required this.time,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Container(
            width: 3,
            height: 24,
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500)),
                Text(time, style: const TextStyle(fontSize: 9, color: Colors.black45)),
              ],
            ),
          ),
          const Icon(Icons.check_circle_outline, size: 16, color: Colors.black38),
        ],
      ),
    );
  }
}
