// lib/features/feeding/domain/entities/feeding_schedule_entity.dart
import 'package:equatable/equatable.dart';

class FeedingScheduleEntity extends Equatable {
  final String id;
  final String pondId;
  final String pondName;
  final String feedId;
  final String feedName;
  final String time;
  final double amount;
  final String unit;
  final bool isEnabled;

  const FeedingScheduleEntity({
    required this.id,
    required this.pondId,
    required this.pondName,
    required this.feedId,
    required this.feedName,
    required this.time,
    required this.amount,
    required this.unit,
    required this.isEnabled,
  });

  @override
  List<Object?> get props => [id, pondId, pondName, feedId, feedName, time, amount, unit, isEnabled];
  
  String get timeDisplay {
    final parts = time.split(':');
    if (parts.length == 2) {
      final hour = int.parse(parts[0]);
      final minute = parts[1];
      final period = hour >= 12 ? 'PM' : 'AM';
      final displayHour = hour > 12 ? hour - 12 : (hour == 0 ? 12 : hour);
      return '$displayHour:$minute $period';
    }
    return time;
  }
}
