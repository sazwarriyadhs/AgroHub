// lib/features/feeding/data/models/feeding_statistic_model.dart
import '../../domain/entities/feeding_statistic_entity.dart';

class FeedingStatisticModel extends FeedingStatisticEntity {
  const FeedingStatisticModel({
    super.fcr,
    super.totalConsumption,
    super.totalCost,
    super.averageCostPerKg,
    super.efficiency,
  });

  factory FeedingStatisticModel.fromJson(Map<String, dynamic> json) {
    return FeedingStatisticModel(
      fcr: (json['fcr'] ?? 0).toDouble(),
      totalConsumption: (json['total_consumption'] ?? 0).toDouble(),
      totalCost: (json['total_cost'] ?? 0).toDouble(),
      averageCostPerKg: (json['average_cost_per_kg'] ?? 0).toDouble(),
      efficiency: (json['efficiency'] ?? 0).toDouble(),
    );
  }
}
