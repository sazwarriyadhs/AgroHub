// lib/features/feeding/data/models/feeding_schedule_model.dart
import '../../domain/entities/feeding_schedule_entity.dart';

class FeedingScheduleModel extends FeedingScheduleEntity {
  const FeedingScheduleModel({
    required super.id,
    required super.pondId,
    required super.pondName,
    required super.feedId,
    required super.feedName,
    required super.time,
    required super.amount,
    required super.unit,
    required super.isEnabled,
  });

  factory FeedingScheduleModel.fromJson(Map<String, dynamic> json) {
    return FeedingScheduleModel(
      id: json['id']?.toString() ?? '',
      pondId: json['pond_id']?.toString() ?? '',
      pondName: json['pond_name'] ?? '',
      feedId: json['feed_id']?.toString() ?? '',
      feedName: json['feed_name'] ?? '',
      time: json['time'] ?? '08:00',
      amount: (json['amount'] ?? 0).toDouble(),
      unit: json['unit'] ?? 'kg',
      isEnabled: json['is_enabled'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'pond_id': pondId,
      'pond_name': pondName,
      'feed_id': feedId,
      'feed_name': feedName,
      'time': time,
      'amount': amount,
      'unit': unit,
      'is_enabled': isEnabled,
    };
  }
}
