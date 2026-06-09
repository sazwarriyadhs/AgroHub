// lib/features/feeding/domain/usecases/add_feeding_schedule.dart
import '../../data/models/feeding_schedule_model.dart';
import '../repositories/feeding_repository.dart';

class AddFeedingSchedule {
  final FeedingRepository _repository;

  AddFeedingSchedule(this._repository);

  Future<FeedingScheduleModel> call(Map<String, dynamic> data) async {
    return await _repository.addFeedingSchedule(data);
  }
}
