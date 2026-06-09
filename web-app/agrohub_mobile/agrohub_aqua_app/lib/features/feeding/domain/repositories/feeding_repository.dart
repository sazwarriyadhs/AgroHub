// lib/features/feeding/domain/repositories/feeding_repository.dart
import '../../domain/entities/feed_stock_entity.dart';
import '../../domain/entities/feeding_schedule_entity.dart';
import '../../domain/entities/feeding_statistic_entity.dart';

abstract class FeedingRepository {
  Future<List<FeedStockEntity>> getFeedStock();
  Future<FeedStockEntity> addFeedStock(Map<String, dynamic> data);
  Future<FeedStockEntity> updateFeedStock(String id, Map<String, dynamic> data);
  Future<void> deleteFeedStock(String id);
  
  Future<List<FeedingScheduleEntity>> getFeedingSchedules();
  Future<FeedingScheduleEntity> addFeedingSchedule(Map<String, dynamic> data);
  Future<FeedingScheduleEntity> updateFeedingSchedule(String id, Map<String, dynamic> data);
  Future<void> deleteFeedingSchedule(String id);
  Future<void> toggleFeedingSchedule(String id, bool isEnabled);
  
  Future<FeedingStatisticEntity> getFeedingStatistics();
}
