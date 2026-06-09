// lib/features/activities/presentation/bloc/activity_state.dart
import 'package:equatable/equatable.dart';
import '../../data/models/activity_model.dart';

class ActivityState extends Equatable {
  final bool isLoading;
  final bool isRefreshing;
  final String? error;
  final List<ActivityModel> activities;

  const ActivityState({
    this.isLoading = false,
    this.isRefreshing = false,
    this.error,
    this.activities = const [],
  });

  factory ActivityState.initial() => const ActivityState();

  ActivityState copyWith({
    bool? isLoading,
    bool? isRefreshing,
    String? error,
    List<ActivityModel>? activities,
    bool clearError = false,
  }) {
    return ActivityState(
      isLoading: isLoading ?? this.isLoading,
      isRefreshing: isRefreshing ?? this.isRefreshing,
      error: clearError ? null : error ?? this.error,
      activities: activities ?? this.activities,
    );
  }

  @override
  List<Object?> get props => [isLoading, isRefreshing, error, activities];
}
