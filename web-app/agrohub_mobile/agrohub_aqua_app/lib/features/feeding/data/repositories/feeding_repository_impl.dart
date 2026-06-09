// lib/features/feeding/data/repositories/feeding_repository_impl.dart
import '../../domain/repositories/feeding_repository.dart';
import '../../domain/entities/feed_stock_entity.dart';
import '../../domain/entities/feeding_schedule_entity.dart';
import '../../domain/entities/feeding_statistic_entity.dart';

class FeedingRepositoryImpl implements FeedingRepository {
  FeedingRepositoryImpl();

  @override
  Future<List<FeedStockEntity>> getFeedStock() async {
    await Future.delayed(const Duration(milliseconds: 500));
    return [
      FeedStockEntity(
        id: '1',
        name: 'Pelet APN 781',
        stock: 150,
        unit: 'kg',
        price: 350000,
        supplier: 'PT AgroFeed',
        expiryDate: DateTime(2025, 1, 15),
        minStock: 50,
        category: 'Pelet',
      ),
      FeedStockEntity(
        id: '2',
        name: 'Pelet Apung 991',
        stock: 80,
        unit: 'kg',
        price: 380000,
        supplier: 'Maju Feed',
        expiryDate: DateTime(2025, 2, 20),
        minStock: 50,
        category: 'Pelet',
      ),
      FeedStockEntity(
        id: '3',
        name: 'Probiotik Cair',
        stock: 25,
        unit: 'liter',
        price: 125000,
        supplier: 'Vet Shop',
        expiryDate: DateTime(2024, 12, 10),
        minStock: 10,
        category: 'Suplemen',
      ),
      FeedStockEntity(
        id: '4',
        name: 'Vitamin C',
        stock: 10,
        unit: 'botol',
        price: 75000,
        supplier: 'Agro Vit',
        expiryDate: DateTime(2025, 1, 30),
        minStock: 5,
        category: 'Suplemen',
      ),
    ];
  }

  @override
  Future<FeedStockEntity> addFeedStock(Map<String, dynamic> data) async {
    await Future.delayed(const Duration(milliseconds: 500));
    return FeedStockEntity(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      name: data['name'],
      stock: data['stock'].toDouble(),
      unit: data['unit'] ?? 'kg',
      price: data['price'].toDouble(),
      supplier: data['supplier'],
      category: data['category'],
    );
  }

  @override
  Future<FeedStockEntity> updateFeedStock(String id, Map<String, dynamic> data) async {
    await Future.delayed(const Duration(milliseconds: 500));
    return FeedStockEntity(
      id: id,
      name: data['name'],
      stock: data['stock'].toDouble(),
      unit: data['unit'] ?? 'kg',
      price: data['price'].toDouble(),
      supplier: data['supplier'],
      category: data['category'],
    );
  }

  @override
  Future<void> deleteFeedStock(String id) async {
    await Future.delayed(const Duration(milliseconds: 500));
  }

  @override
  Future<List<FeedingScheduleEntity>> getFeedingSchedules() async {
    await Future.delayed(const Duration(milliseconds: 500));
    return [
      FeedingScheduleEntity(
        id: '1',
        pondId: '1',
        pondName: 'Kolam Lele 1',
        feedId: '1',
        feedName: 'Pelet APN 781',
        time: '08:00',
        amount: 5,
        unit: 'kg',
        isEnabled: true,
      ),
      FeedingScheduleEntity(
        id: '2',
        pondId: '1',
        pondName: 'Kolam Lele 1',
        feedId: '1',
        feedName: 'Pelet APN 781',
        time: '12:00',
        amount: 5,
        unit: 'kg',
        isEnabled: true,
      ),
      FeedingScheduleEntity(
        id: '3',
        pondId: '1',
        pondName: 'Kolam Lele 1',
        feedId: '1',
        feedName: 'Pelet APN 781',
        time: '16:00',
        amount: 5,
        unit: 'kg',
        isEnabled: true,
      ),
    ];
  }

  @override
  Future<FeedingScheduleEntity> addFeedingSchedule(Map<String, dynamic> data) async {
    await Future.delayed(const Duration(milliseconds: 500));
    return FeedingScheduleEntity(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      pondId: data['pondId'],
      pondName: data['pondName'],
      feedId: data['feedId'],
      feedName: data['feedName'],
      time: data['time'],
      amount: data['amount'].toDouble(),
      unit: data['unit'] ?? 'kg',
      isEnabled: true,
    );
  }

  @override
  Future<FeedingScheduleEntity> updateFeedingSchedule(String id, Map<String, dynamic> data) async {
    await Future.delayed(const Duration(milliseconds: 500));
    return FeedingScheduleEntity(
      id: id,
      pondId: data['pondId'],
      pondName: data['pondName'],
      feedId: data['feedId'],
      feedName: data['feedName'],
      time: data['time'],
      amount: data['amount'].toDouble(),
      unit: data['unit'] ?? 'kg',
      isEnabled: data['isEnabled'] ?? true,
    );
  }

  @override
  Future<void> deleteFeedingSchedule(String id) async {
    await Future.delayed(const Duration(milliseconds: 500));
  }

  @override
  Future<void> toggleFeedingSchedule(String id, bool isEnabled) async {
    await Future.delayed(const Duration(milliseconds: 500));
  }

  @override
  Future<FeedingStatisticEntity> getFeedingStatistics() async {
    await Future.delayed(const Duration(milliseconds: 500));
    return const FeedingStatisticEntity(
      fcr: 1.4,
      totalConsumption: 2450,
      totalCost: 8575000,
      averageCostPerKg: 8750,
      efficiency: 0.75,
    );
  }
}
