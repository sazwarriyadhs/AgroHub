// lib/features/activities/presentation/bloc/activity_bloc.dart
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/services/api_service.dart';
import '../../data/repositories/activity_repository_impl.dart';
import 'activity_event.dart';
import 'activity_state.dart';

class ActivityBloc extends Bloc<ActivityEvent, ActivityState> {
  final ActivityRepositoryImpl _repository;

  ActivityBloc({required ApiService apiService})
    : _repository = ActivityRepositoryImpl(apiService),
      super(ActivityState.initial()) {
    on<LoadActivities>(_onLoadActivities);
    on<RefreshActivities>(_onRefreshActivities);
  }

  Future<void> _onLoadActivities(
    LoadActivities event,
    Emitter<ActivityState> emit,
  ) async {
    emit(state.copyWith(isLoading: true, clearError: true));

    try {
      final activities = await _repository.getActivities(limit: event.limit);
      emit(state.copyWith(
        isLoading: false,
        activities: activities,
      ));
    } catch (e) {
      print('ERROR in _onLoadActivities: $e');
      emit(state.copyWith(
        isLoading: false,
        error: e.toString(),
      ));
    }
  }

  Future<void> _onRefreshActivities(
    RefreshActivities event,
    Emitter<ActivityState> emit,
  ) async {
    emit(state.copyWith(isRefreshing: true));

    try {
      final activities = await _repository.getActivities();
      emit(state.copyWith(
        isRefreshing: false,
        activities: activities,
      ));
    } catch (e) {
      print('ERROR in _onRefreshActivities: $e');
      emit(state.copyWith(
        isRefreshing: false,
        error: e.toString(),
      ));
    }
  }
}
