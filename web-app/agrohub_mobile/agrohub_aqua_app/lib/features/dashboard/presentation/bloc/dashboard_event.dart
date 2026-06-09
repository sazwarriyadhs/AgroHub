// lib/features/dashboard/presentation/bloc/dashboard_event.dart
part of 'dashboard_bloc.dart';

abstract class DashboardEvent extends Equatable {
  const DashboardEvent();
  
  @override
  List<Object?> get props => [];
}

/// Load initial dashboard data
class LoadDashboardData extends DashboardEvent {
  final bool forceRefresh;
  
  const LoadDashboardData({this.forceRefresh = false});
  
  @override
  List<Object?> get props => [forceRefresh];
}

/// Refresh dashboard (pull to refresh)
class RefreshDashboard extends DashboardEvent {}

/// Update notification count
class UpdateNotificationCount extends DashboardEvent {
  final int count;
  
  const UpdateNotificationCount(this.count);
  
  @override
  List<Object?> get props => [count];
}

/// Load specific section only
class LoadWalletOnly extends DashboardEvent {}
class LoadActivitiesOnly extends DashboardEvent {}
class LoadProfileOnly extends DashboardEvent {}