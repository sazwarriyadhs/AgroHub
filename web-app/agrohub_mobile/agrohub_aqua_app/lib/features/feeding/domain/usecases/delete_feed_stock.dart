// lib/features/feeding/domain/usecases/delete_feed_stock.dart
import '../repositories/feeding_repository.dart';

class DeleteFeedStock {
  final FeedingRepository _repository;

  DeleteFeedStock(this._repository);

  Future<void> call(String id) async {
    return await _repository.deleteFeedStock(id);
  }
}
