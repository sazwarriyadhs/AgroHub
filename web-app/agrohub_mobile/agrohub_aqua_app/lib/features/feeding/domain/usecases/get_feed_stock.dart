// lib/features/feeding/domain/usecases/get_feed_stock.dart
import '../../data/models/feed_stock_model.dart';
import '../repositories/feeding_repository.dart';

class GetFeedStock {
  final FeedingRepository _repository;

  GetFeedStock(this._repository);

  Future<List<FeedStockModel>> call() async {
    return await _repository.getFeedStock();
  }
}
