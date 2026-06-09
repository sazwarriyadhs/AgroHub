// lib/features/feeding/domain/usecases/delete_feeding_schedule.dart
import '../repositories/feeding_repository.dart';

class DeleteFeedingSchedule {
  final FeedingRepository _repository;

  DeleteFeedingSchedule(this._repository);

  Future<void> call(String id) async {
    return await _repository.deleteFeedingSchedule(id);
  }
}
