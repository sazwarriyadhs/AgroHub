// lib/features/tasks/domain/entities/task_entity.dart
enum TaskPriority {
  low('🟢', 'Low'),
  medium('🟡', 'Medium'),
  high('🔴', 'High');

  final String icon;
  final String label;
  const TaskPriority(this.icon, this.label);
}

enum TaskStatus {
  pending('⏳', 'Pending'),
  inProgress('🔄', 'In Progress'),
  completed('✅', 'Completed');

  final String icon;
  final String label;
  const TaskStatus(this.icon, this.label);
}

class TaskEntity {
  final String id;
  final String title;
  final String description;
  final TaskPriority priority;
  final TaskStatus status;
  final DateTime dueDate;
  final String cropId;
  final DateTime createdAt;

  const TaskEntity({
    required this.id,
    required this.title,
    required this.description,
    required this.priority,
    required this.status,
    required this.dueDate,
    required this.cropId,
    required this.createdAt,
  });

  bool get isOverdue => dueDate.isBefore(DateTime.now()) && status != TaskStatus.completed;
  bool get isToday => dueDate.day == DateTime.now().day;
  String get timeRemaining {
    final days = dueDate.difference(DateTime.now()).inDays;
    if (days < 0) return 'Overdue';
    if (days == 0) return 'Today';
    return '$days days left';
  }
}
