// lib/features/profile/data/models/aquaculture_asset_model.dart
import '../../domain/entities/aquaculture_asset_entity.dart';

class AquacultureAssetModel extends AquacultureAssetEntity {
  const AquacultureAssetModel({
    required super.id,
    required super.userId,
    super.species,
    super.stockCount,
    super.estimatedBiomass,
    super.survivalRate,
    super.pondId,
    super.pondName,
    super.lastUpdated,
  });

  factory AquacultureAssetModel.fromJson(Map<String, dynamic> json) {
    return AquacultureAssetModel(
      id: json['id']?.toString() ?? '',
      userId: json['user_id']?.toString() ?? '',
      species: json['species'],
      stockCount: json['stock_count'] != null ? int.tryParse(json['stock_count'].toString()) : null,
      estimatedBiomass: json['estimated_biomass'] != null ? double.tryParse(json['estimated_biomass'].toString()) : null,
      survivalRate: json['survival_rate'] != null ? double.tryParse(json['survival_rate'].toString()) : null,
      pondId: json['pond_id']?.toString(),
      pondName: json['pond_name'],
      lastUpdated: json['last_updated'] != null ? DateTime.tryParse(json['last_updated']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'species': species,
      'stock_count': stockCount,
      'estimated_biomass': estimatedBiomass,
      'survival_rate': survivalRate,
      'pond_id': pondId,
      'pond_name': pondName,
      'last_updated': lastUpdated?.toIso8601String(),
    };
  }
}
