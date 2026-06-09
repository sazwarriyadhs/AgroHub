// lib/features/activities/domain/entities/activity_entity.dart
import 'package:equatable/equatable.dart';

class ActivityEntity extends Equatable {
  final String id;
  final String title;
  final String? description;
  final String? amount;
  final DateTime createdAt;
  final String type;

  const ActivityEntity({
    required this.id,
    required this.title,
    this.description,
    this.amount,
    required this.createdAt,
    required this.type,
  });

  @override
  List<Object?> get props => [id, title, description, amount, createdAt, type];
  
  String get formattedTime {
    final diff = DateTime.now().difference(createdAt);
    if (diff.inDays > 0) return "${diff.inDays} hari lalu";
    if (diff.inHours > 0) return "${diff.inHours} jam lalu";
    if (diff.inMinutes > 0) return "${diff.inMinutes} menit lalu";
    return "Baru saja";
  }
  
  String get formattedDate {
    return '${createdAt.day}/${createdAt.month}/${createdAt.year}';
  }
}
