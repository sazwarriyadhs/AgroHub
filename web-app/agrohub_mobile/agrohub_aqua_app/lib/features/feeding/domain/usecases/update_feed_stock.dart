// lib/features/feeding/domain/usecases/update_feed_stock.dart
import '../../data/models/feed_stock_model.dart';
import '../repositories/feeding_repository.dart';

class UpdateFeedStock {
  final FeedingRepository _repository;

  UpdateFeedStock(this._repository);

  Future<FeedStockModel> call(String id, Map<String, dynamic> data) async {
    return await _repository.updateFeedStock(id, data);
  }
}
