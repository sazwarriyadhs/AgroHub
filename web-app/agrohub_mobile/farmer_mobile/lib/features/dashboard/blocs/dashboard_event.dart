// lib/features/dashboard/blocs/dashboard_event.dart

part of 'dashboard_bloc.dart';

@immutable
abstract class DashboardEvent {
  const DashboardEvent();
}

class FetchDashboardData extends DashboardEvent {
  const FetchDashboardData();
}

class RefreshDashboardData extends DashboardEvent {
  const RefreshDashboardData();
}