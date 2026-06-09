// lib/features/activities/data/models/activity_model.dart
import 'package:equatable/equatable.dart';

class ActivityModel extends Equatable {
  final String id;
  final String title;
  final String? description;
  final String? amount;
  final DateTime createdAt;
  final String type;

  const ActivityModel({
    required this.id,
    required this.title,
    this.description,
    this.amount,
    required this.createdAt,
    required this.type,
  });

  @override
  List<Object?> get props => [id, title, description, amount, createdAt, type];
  
  factory ActivityModel.fromJson(Map<String, dynamic> json) {
    return ActivityModel(
      id: _toStringSafe(json['id']) ?? DateTime.now().millisecondsSinceEpoch.toString(),
      title: _toStringSafe(json['title']) ?? _toStringSafe(json['description']) ?? 'Aktivitas',
      description: _toStringSafe(json['description']),
      amount: _toStringSafe(json['amount']),
      createdAt: _toDateTimeSafe(json['created_at']) ?? DateTime.now(),
      type: _toStringSafe(json['type']) ?? 'info',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'amount': amount,
      'created_at': createdAt.toIso8601String(),
      'type': type,
    };
  }
  
  String get formattedTime {
    final diff = DateTime.now().difference(createdAt);
    if (diff.inDays > 0) return "${diff.inDays} hari lalu";
    if (diff.inHours > 0) return "${diff.inHours} jam lalu";
    if (diff.inMinutes > 0) return "${diff.inMinutes} menit lalu";
    return "Baru saja";
  }
  
  // ============================================
  // SAFE TYPE CONVERTERS
  // ============================================
  static String? _toStringSafe(dynamic value) {
    if (value == null) return null;
    if (value is String) return value;
    return value.toString();
  }
  
  static DateTime? _toDateTimeSafe(dynamic value) {
    if (value == null) return null;
    if (value is DateTime) return value;
    if (value is String) {
      try {
        return DateTime.parse(value);
      } catch (_) {
        return null;
      }
    }
    return null;
  }
}
