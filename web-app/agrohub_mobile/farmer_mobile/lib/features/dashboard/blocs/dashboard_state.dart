// lib/features/dashboard/blocs/dashboard_state.dart

part of 'dashboard_bloc.dart';

@immutable
abstract class DashboardState {
  const DashboardState();
}

class DashboardInitial extends DashboardState {
  const DashboardInitial();
}

class DashboardLoading extends DashboardState {
  const DashboardLoading();
}

class DashboardLoaded extends DashboardState {
  final Map<String, dynamic> stats;
  final List<Map<String, dynamic>> crops;
  final List<Map<String, dynamic>> activities;
  final List<Map<String, dynamic>> marketPrices;
  final List<Map<String, dynamic>> tasks;

  const DashboardLoaded({
    required this.stats,
    required this.crops,
    required this.activities,
    required this.marketPrices,
    required this.tasks,
  });

  DashboardLoaded copyWith({
    Map<String, dynamic>? stats,
    List<Map<String, dynamic>>? crops,
    List<Map<String, dynamic>>? activities,
    List<Map<String, dynamic>>? marketPrices,
    List<Map<String, dynamic>>? tasks,
  }) {
    return DashboardLoaded(
      stats: stats ?? this.stats,
      crops: crops ?? this.crops,
      activities: activities ?? this.activities,
      marketPrices: marketPrices ?? this.marketPrices,
      tasks: tasks ?? this.tasks,
    );
  }
}

class DashboardError extends DashboardState {
  final String message;

  const DashboardError(
    this.message,
  );
}