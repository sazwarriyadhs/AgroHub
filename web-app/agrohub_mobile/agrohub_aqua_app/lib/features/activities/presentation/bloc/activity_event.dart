// lib/features/activities/presentation/bloc/activity_event.dart
import 'package:equatable/equatable.dart';

abstract class ActivityEvent extends Equatable {
  const ActivityEvent();
  @override
  List<Object?> get props => [];
}

class LoadActivities extends ActivityEvent {
  final int? limit;
  const LoadActivities({this.limit});
  @override
  List<Object?> get props => [limit];
}

class RefreshActivities extends ActivityEvent {
  const RefreshActivities();
}
