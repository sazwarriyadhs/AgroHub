// lib/features/feeding/domain/usecases/get_feeding_statistics.dart
import '../../data/models/feeding_statistic_model.dart';
import '../repositories/feeding_repository.dart';

class GetFeedingStatistics {
  final FeedingRepository _repository;

  GetFeedingStatistics(this._repository);

  Future<FeedingStatisticModel> call({String? period}) async {
    return await _repository.getFeedingStatistics(period: period);
  }
}
