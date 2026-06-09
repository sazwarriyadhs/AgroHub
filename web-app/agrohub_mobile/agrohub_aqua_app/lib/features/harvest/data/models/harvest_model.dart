// lib/features/harvest/data/models/harvest_model.dart
import '../../domain/entities/harvest_entity.dart';

class HarvestModel extends HarvestEntity {
  const HarvestModel({
    required super.id,
    required super.pondName,
    required super.pondId,
    required super.fishType,
    required super.harvestDate,
    required super.estimatedWeight,
    super.actualWeight,
    super.sellingPrice,
    super.totalValue,
    required super.status,
    required super.createdAt,
  });

  factory HarvestModel.fromJson(Map<String, dynamic> json) {
    return HarvestModel(
      id: json['id']?.toString() ?? '',
      pondName: json['pond_name'] ?? '',
      pondId: json['pond_id']?.toString() ?? '',
      fishType: json['fish_type'] ?? 'Lele',
      harvestDate: json['harvest_date'] != null 
          ? DateTime.parse(json['harvest_date']) 
          : DateTime.now(),
      estimatedWeight: (json['estimated_weight'] ?? 0).toDouble(),
      actualWeight: json['actual_weight']?.toDouble(),
      sellingPrice: json['selling_price']?.toDouble(),
      totalValue: json['total_value']?.toDouble(),
      status: json['status'] ?? 'scheduled',
      createdAt: json['created_at'] != null 
          ? DateTime.parse(json['created_at']) 
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'pond_name': pondName,
      'pond_id': pondId,
      'fish_type': fishType,
      'harvest_date': harvestDate.toIso8601String(),
      'estimated_weight': estimatedWeight,
      'actual_weight': actualWeight,
      'selling_price': sellingPrice,
      'total_value': totalValue,
      'status': status,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
