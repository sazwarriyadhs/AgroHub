// lib/features/harvest/domain/entities/harvest_entity.dart
part of 'package:agrohub_aqua_app/features/harvest/presentation/bloc/harvest_bloc.dart';

class HarvestEntity extends Equatable {
  final String id;
  final String pondName;
  final String pondId;
  final String fishType; // Lele, Nila, Gurame, dll
  final DateTime harvestDate;
  final double estimatedWeight;
  final double? actualWeight;
  final double? sellingPrice;
  final double? totalValue;
  final String status; // scheduled, in_progress, completed, cancelled
  final DateTime createdAt;

  const HarvestEntity({
    required this.id,
    required this.pondName,
    required this.pondId,
    required this.fishType,
    required this.harvestDate,
    required this.estimatedWeight,
    this.actualWeight,
    this.sellingPrice,
    this.totalValue,
    required this.status,
    required this.createdAt,
  });

  @override
  List<Object?> get props => [
    id, pondName, pondId, fishType, harvestDate, 
    estimatedWeight, actualWeight, sellingPrice, totalValue, status, createdAt
  ];
  
  bool get isCompleted => status == 'completed';
  bool get isScheduled => status == 'scheduled';
  bool get isInProgress => status == 'in_progress';
}
