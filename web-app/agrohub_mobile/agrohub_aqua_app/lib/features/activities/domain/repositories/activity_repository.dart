// lib/features/activities/domain/repositories/activity_repository.dart
import '../../data/models/activity_model.dart';

abstract class ActivityRepository {
  Future<List<ActivityModel>> getActivities({int? limit});
  Future<ActivityModel> addActivity(Map<String, dynamic> data);
}
