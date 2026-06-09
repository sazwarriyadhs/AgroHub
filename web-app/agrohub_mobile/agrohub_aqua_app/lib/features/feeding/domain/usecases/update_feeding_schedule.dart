// lib/features/feeding/domain/usecases/update_feeding_schedule.dart
import '../../data/models/feeding_schedule_model.dart';
import '../repositories/feeding_repository.dart';

class UpdateFeedingSchedule {
  final FeedingRepository _repository;

  UpdateFeedingSchedule(this._repository);

  Future<FeedingScheduleModel> call(String id, Map<String, dynamic> data) async {
    return await _repository.updateFeedingSchedule(id, data);
  }
}
