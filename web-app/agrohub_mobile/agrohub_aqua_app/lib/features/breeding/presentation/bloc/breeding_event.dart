// lib/features/breeding/presentation/bloc/breeding_event.dart
part of 'breeding_bloc.dart';

abstract class BreedingEvent extends Equatable {
  const BreedingEvent();
  @override
  List<Object?> get props => [];
}

class LoadBreedings extends BreedingEvent {}
class LoadBreedingDetail extends BreedingEvent {
  final String breedingId;
  const LoadBreedingDetail(this.breedingId);
  @override
  List<Object?> get props => [breedingId];
}

class CreateBreeding extends BreedingEvent {
  final Map<String, dynamic> data;
  const CreateBreeding(this.data);
  @override
  List<Object?> get props => [data];
}

class UpdateBreeding extends BreedingEvent {
  final String breedingId;
  final Map<String, dynamic> data;
  const UpdateBreeding(this.breedingId, this.data);
  @override
  List<Object?> get props => [breedingId, data];
}

class DeleteBreeding extends BreedingEvent {
  final String breedingId;
  const DeleteBreeding(this.breedingId);
  @override
  List<Object?> get props => [breedingId];
}

class AnalyzeBreeding extends BreedingEvent {
  final String breedingId;
  const AnalyzeBreeding(this.breedingId);
  @override
  List<Object?> get props => [breedingId];
}

class RecordGrowth extends BreedingEvent {
  final String breedingId;
  final double weight;
  final double length;
  const RecordGrowth({
    required this.breedingId,
    required this.weight,
    required this.length,
  });
  @override
  List<Object?> get props => [breedingId, weight, length];
}
