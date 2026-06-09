// lib/features/feeding/domain/usecases/add_feed_stock.dart
import '../../data/models/feed_stock_model.dart';
import '../repositories/feeding_repository.dart';

class AddFeedStock {
  final FeedingRepository _repository;

  AddFeedStock(this._repository);

  Future<FeedStockModel> call(Map<String, dynamic> data) async {
    return await _repository.addFeedStock(data);
  }
}
