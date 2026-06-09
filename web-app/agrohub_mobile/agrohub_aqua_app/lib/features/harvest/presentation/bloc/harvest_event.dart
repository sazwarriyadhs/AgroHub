// lib/features/harvest/presentation/bloc/harvest_event.dart
part of 'harvest_bloc.dart';

abstract class HarvestEvent extends Equatable {
  const HarvestEvent();
  @override
  List<Object?> get props => [];
}

class LoadHarvestData extends HarvestEvent {}

class LoadUpcomingHarvest extends HarvestEvent {}
class LoadHarvestHistory extends HarvestEvent {}
class LoadHarvestStatistics extends HarvestEvent {}

class AddHarvestSchedule extends HarvestEvent {
  final Map<String, dynamic> harvestData;
  const AddHarvestSchedule(this.harvestData);
  @override
  List<Object?> get props => [harvestData];
}

class StartHarvest extends HarvestEvent {
  final String harvestId;
  const StartHarvest(this.harvestId);
  @override
  List<Object?> get props => [harvestId];
}

class CompleteHarvest extends HarvestEvent {
  final String harvestId;
  final double actualWeight;
  final double sellingPrice;
  
  const CompleteHarvest({
    required this.harvestId,
    required this.actualWeight,
    required this.sellingPrice,
  });
  
  @override
  List<Object?> get props => [harvestId, actualWeight, sellingPrice];
}

class CancelHarvest extends HarvestEvent {
  final String harvestId;
  const CancelHarvest(this.harvestId);
  @override
  List<Object?> get props => [harvestId];
}
