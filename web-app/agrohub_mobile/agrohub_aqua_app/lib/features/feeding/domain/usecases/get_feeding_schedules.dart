// lib/features/feeding/domain/usecases/get_feeding_schedules.dart
import '../../data/models/feeding_schedule_model.dart';
import '../repositories/feeding_repository.dart';

class GetFeedingSchedules {
  final FeedingRepository _repository;

  GetFeedingSchedules(this._repository);

  Future<List<FeedingScheduleModel>> call() async {
    return await _repository.getFeedingSchedules();
  }
}
