// lib/features/harvest/presentation/bloc/harvest_state.dart
part of 'harvest_bloc.dart';

class HarvestState extends Equatable {
  final bool isLoading;
  final bool isSubmitting;
  final String? error;
  final List<HarvestEntity> upcomingHarvest;
  final List<HarvestEntity> harvestHistory;
  
  // Statistics
  final double totalHarvestThisMonth;
  final double totalValueThisMonth;
  final double totalHarvestAllTime;
  final double totalValueAllTime;
  final Map<String, double> monthlyData;
  
  const HarvestState({
    this.isLoading = false,
    this.isSubmitting = false,
    this.error,
    this.upcomingHarvest = const [],
    this.harvestHistory = const [],
    this.totalHarvestThisMonth = 0,
    this.totalValueThisMonth = 0,
    this.totalHarvestAllTime = 0,
    this.totalValueAllTime = 0,
    this.monthlyData = const {},
  });
  
  factory HarvestState.initial() => const HarvestState();
  
  HarvestState copyWith({
    bool? isLoading,
    bool? isSubmitting,
    String? error,
    List<HarvestEntity>? upcomingHarvest,
    List<HarvestEntity>? harvestHistory,
    double? totalHarvestThisMonth,
    double? totalValueThisMonth,
    double? totalHarvestAllTime,
    double? totalValueAllTime,
    Map<String, double>? monthlyData,
    bool clearError = false,
  }) {
    return HarvestState(
      isLoading: isLoading ?? this.isLoading,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      error: clearError ? null : error ?? this.error,
      upcomingHarvest: upcomingHarvest ?? this.upcomingHarvest,
      harvestHistory: harvestHistory ?? this.harvestHistory,
      totalHarvestThisMonth: totalHarvestThisMonth ?? this.totalHarvestThisMonth,
      totalValueThisMonth: totalValueThisMonth ?? this.totalValueThisMonth,
      totalHarvestAllTime: totalHarvestAllTime ?? this.totalHarvestAllTime,
      totalValueAllTime: totalValueAllTime ?? this.totalValueAllTime,
      monthlyData: monthlyData ?? this.monthlyData,
    );
  }
  
  @override
  List<Object?> get props => [
    isLoading, isSubmitting, error, upcomingHarvest, harvestHistory,
    totalHarvestThisMonth, totalValueThisMonth, totalHarvestAllTime, totalValueAllTime, monthlyData
  ];
}
