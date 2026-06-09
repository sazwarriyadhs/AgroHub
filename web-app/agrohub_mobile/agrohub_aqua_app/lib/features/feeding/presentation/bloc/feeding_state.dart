// lib/features/feeding/presentation/bloc/feeding_state.dart
import 'package:equatable/equatable.dart';
import '../../domain/entities/feed_stock_entity.dart';
import '../../domain/entities/feeding_schedule_entity.dart';
import '../../domain/entities/feeding_statistic_entity.dart';

class FeedingState extends Equatable {
  final bool isLoading;
  final bool isSubmitting;
  final String? error;
  final List<FeedStockEntity> feedStock;
  final List<FeedingScheduleEntity> feedingSchedules;
  final FeedingStatisticEntity? statistics;
  final int selectedTab;

  const FeedingState({
    this.isLoading = false,
    this.isSubmitting = false,
    this.error,
    this.feedStock = const [],
    this.feedingSchedules = const [],
    this.statistics,
    this.selectedTab = 0,
  });

  factory FeedingState.initial() => const FeedingState();

  FeedingState copyWith({
    bool? isLoading,
    bool? isSubmitting,
    String? error,
    List<FeedStockEntity>? feedStock,
    List<FeedingScheduleEntity>? feedingSchedules,
    FeedingStatisticEntity? statistics,
    int? selectedTab,
    bool clearError = false,
  }) {
    return FeedingState(
      isLoading: isLoading ?? this.isLoading,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      error: clearError ? null : error ?? this.error,
      feedStock: feedStock ?? this.feedStock,
      feedingSchedules: feedingSchedules ?? this.feedingSchedules,
      statistics: statistics ?? this.statistics,
      selectedTab: selectedTab ?? this.selectedTab,
    );
  }

  @override
  List<Object?> get props => [
    isLoading, isSubmitting, error, feedStock, feedingSchedules, statistics, selectedTab
  ];
  
  int get lowStockCount => feedStock.where((f) => f.isLowStock).length;
  int get activeScheduleCount => feedingSchedules.where((s) => s.isEnabled).length;
  double get totalFeedStock => feedStock.fold(0, (sum, f) => sum + f.stock);
  double get totalFeedValue => feedStock.fold(0, (sum, f) => sum + (f.stock * f.price));
}
