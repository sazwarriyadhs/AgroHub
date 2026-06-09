// lib/features/activities/domain/entities/activity_entity.dart
enum ActivityType {
  planting('🌱', 'Planting'),
  watering('💧', 'Watering'),
  fertilizing('🧪', 'Fertilizing'),
  harvesting('🌾', 'Harvesting'),
  pestControl('🐛', 'Pest Control');

  final String icon;
  final String label;
  const ActivityType(this.icon, this.label);
}

class ActivityEntity {
  final String id;
  final String title;
  final String description;
  final ActivityType type;
  final DateTime timestamp;
  final String cropId;
  final Map<String, dynamic>? metadata;

  const ActivityEntity({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.timestamp,
    required this.cropId,
    this.metadata,
  });

  String get timeAgo {
    final diff = DateTime.now().difference(timestamp);
    if (diff.inDays > 0) return '${diff.inDays} day${diff.inDays > 1 ? 's' : ''} ago';
    if (diff.inHours > 0) return '${diff.inHours} hour${diff.inHours > 1 ? 's' : ''} ago';
    if (diff.inMinutes > 0) return '${diff.inMinutes} minute${diff.inMinutes > 1 ? 's' : ''} ago';
    return 'Just now';
  }
}
