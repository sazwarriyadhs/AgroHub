// lib/features/breeding/presentation/bloc/breeding_state.dart
part of 'breeding_bloc.dart';

class BreedingState extends Equatable {
  final bool isLoading;
  final bool isSubmitting;
  final String? error;
  final List<BreedingEntity> breedings;
  final BreedingEntity? currentBreeding;
  final Map<String, dynamic>? statistics;

  const BreedingState({
    this.isLoading = false,
    this.isSubmitting = false,
    this.error,
    this.breedings = const [],
    this.currentBreeding,
    this.statistics,
  });

  factory BreedingState.initial() => const BreedingState();

  BreedingState copyWith({
    bool? isLoading,
    bool? isSubmitting,
    String? error,
    List<BreedingEntity>? breedings,
    BreedingEntity? currentBreeding,
    Map<String, dynamic>? statistics,
    bool clearError = false,
  }) {
    return BreedingState(
      isLoading: isLoading ?? this.isLoading,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      error: clearError ? null : error ?? this.error,
      breedings: breedings ?? this.breedings,
      currentBreeding: currentBreeding ?? this.currentBreeding,
      statistics: statistics ?? this.statistics,
    );
  }

  @override
  List<Object?> get props => [
    isLoading, isSubmitting, error, breedings, currentBreeding, statistics
  ];
}
