// lib/features/breeding/domain/entities/breeding_entity.dart
part of 'package:agrohub_aqua_app/features/breeding/presentation/bloc/breeding_bloc.dart';

class BreedingEntity extends Equatable {
  final String id;
  final String fishType;
  final String batchNumber;
  final int? currentDay;
  final int? totalDays;
  final String? currentPhase;
  final int eggCount;
  final double hatchRate;
  final double survivalRate;
  final double? aiSuccessRate;
  final String? aiInsight;
  final Map<String, dynamic>? waterQuality;
  final List<BreedingStep>? timeline;
  final DateTime? startedAt;
  final DateTime? expectedHarvestDate;
  final String? status;

  const BreedingEntity({
    required this.id,
    required this.fishType,
    required this.batchNumber,
    this.currentDay,
    this.totalDays,
    this.currentPhase,
    this.eggCount = 0,
    this.hatchRate = 0,
    this.survivalRate = 0,
    this.aiSuccessRate,
    this.aiInsight,
    this.waterQuality,
    this.timeline,
    this.startedAt,
    this.expectedHarvestDate,
    this.status,
  });

  @override
  List<Object?> get props => [
    id, fishType, batchNumber, currentDay, totalDays, currentPhase,
    eggCount, hatchRate, survivalRate, aiSuccessRate, aiInsight,
    waterQuality, timeline, startedAt, expectedHarvestDate, status
  ];
  
  bool get isIncubation => currentPhase == 'incubation';
  bool get isHatching => currentPhase == 'hatching';
  bool get isLarva => currentPhase == 'larva';
  bool get isFry => currentPhase == 'fry';
  bool get isCompleted => status == 'completed';
}

class BreedingStep extends Equatable {
  final String title;
  final bool isDone;
  final DateTime? completedAt;
  
  const BreedingStep({
    required this.title,
    required this.isDone,
    this.completedAt,
  });
  
  @override
  List<Object?> get props => [title, isDone, completedAt];
}
