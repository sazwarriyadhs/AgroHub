// lib/features/profile/domain/entities/aquaculture_asset_entity.dart
part of 'package:agrohub_aqua_app/features/profile/presentation/bloc/profile_bloc.dart';

class AquacultureAssetEntity extends Equatable {
  final String id;
  final String userId;
  final String? species;
  final int? stockCount;
  final double? estimatedBiomass;
  final double? survivalRate;
  final String? pondId;
  final String? pondName;
  final DateTime? lastUpdated;

  const AquacultureAssetEntity({
    required this.id,
    required this.userId,
    this.species,
    this.stockCount,
    this.estimatedBiomass,
    this.survivalRate,
    this.pondId,
    this.pondName,
    this.lastUpdated,
  });

  @override
  List<Object?> get props => [
    id, userId, species, stockCount, estimatedBiomass, survivalRate, pondId, pondName, lastUpdated
  ];
}
