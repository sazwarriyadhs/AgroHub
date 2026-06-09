// lib/features/feeding/domain/usecases/toggle_feeding_schedule.dart
import '../repositories/feeding_repository.dart';

class ToggleFeedingSchedule {
  final FeedingRepository _repository;

  ToggleFeedingSchedule(this._repository);

  Future<void> call(String id, bool isEnabled) async {
    return await _repository.toggleFeedingSchedule(id, isEnabled);
  }
}
