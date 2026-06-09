// lib/features/feeding/presentation/bloc/feeding_bloc.dart
import 'package:flutter_bloc/flutter_bloc.dart';
import 'feeding_event.dart';
import 'feeding_state.dart';
import '../../domain/entities/feed_stock_entity.dart';
import '../../domain/entities/feeding_schedule_entity.dart';
import '../../data/repositories/feeding_repository_impl.dart';
import '../../domain/entities/feeding_statistic_entity.dart';

class FeedingBloc extends Bloc<FeedingEvent, FeedingState> {
  final FeedingRepositoryImpl _repository;

  FeedingBloc() : _repository = FeedingRepositoryImpl(), super(FeedingState.initial()) {
    on<LoadAllFeedingData>(_onLoadAllFeedingData);
    on<AddFeedStockEvent>(_onAddFeedStock);
    on<DeleteFeedStockEvent>(_onDeleteFeedStock);
    on<ToggleFeedingScheduleEvent>(_onToggleFeedingSchedule);
    on<ClearFeedingError>(_onClearError);
  }

  Future<void> _onLoadAllFeedingData(
    LoadAllFeedingData event,
    Emitter<FeedingState> emit,
  ) async {
    emit(state.copyWith(isLoading: true, clearError: true));

    try {
      final results = await Future.wait([
        _repository.getFeedStock(),
        _repository.getFeedingSchedules(),
        _repository.getFeedingStatistics(),
      ]);

      final feedStock = results[0] as List<FeedStockEntity>;
      final schedules = results[1] as List<FeedingScheduleEntity>;
      final statistics = results[2] as FeedingStatisticEntity;

      emit(state.copyWith(
        isLoading: false,
        feedStock: feedStock,
        feedingSchedules: schedules,
        statistics: statistics,
      ));
    } catch (e) {
      emit(state.copyWith(
        isLoading: false,
        error: e.toString(),
      ));
    }
  }

  Future<void> _onAddFeedStock(
    AddFeedStockEvent event,
    Emitter<FeedingState> emit,
  ) async {
    emit(state.copyWith(isSubmitting: true, clearError: true));

    try {
      final newFeed = await _repository.addFeedStock(event.data);
      emit(state.copyWith(
        isSubmitting: false,
        feedStock: [newFeed, ...state.feedStock],
      ));
    } catch (e) {
      emit(state.copyWith(
        isSubmitting: false,
        error: e.toString(),
      ));
    }
  }

  Future<void> _onDeleteFeedStock(
    DeleteFeedStockEvent event,
    Emitter<FeedingState> emit,
  ) async {
    emit(state.copyWith(isSubmitting: true));

    try {
      await _repository.deleteFeedStock(event.feedId);
      emit(state.copyWith(
        isSubmitting: false,
        feedStock: state.feedStock.where((f) => f.id != event.feedId).toList(),
      ));
    } catch (e) {
      emit(state.copyWith(
        isSubmitting: false,
        error: e.toString(),
      ));
    }
  }

  Future<void> _onToggleFeedingSchedule(
    ToggleFeedingScheduleEvent event,
    Emitter<FeedingState> emit,
  ) async {
    emit(state.copyWith(isSubmitting: true));

    try {
      await _repository.toggleFeedingSchedule(event.scheduleId, event.isEnabled);
      
      final updatedSchedules = state.feedingSchedules.map((s) {
        if (s.id == event.scheduleId) {
          return FeedingScheduleEntity(
            id: s.id,
            pondId: s.pondId,
            pondName: s.pondName,
            feedId: s.feedId,
            feedName: s.feedName,
            time: s.time,
            amount: s.amount,
            unit: s.unit,
            isEnabled: event.isEnabled,
          );
        }
        return s;
      }).toList();
      
      emit(state.copyWith(
        isSubmitting: false,
        feedingSchedules: updatedSchedules,
      ));
    } catch (e) {
      emit(state.copyWith(
        isSubmitting: false,
        error: e.toString(),
      ));
    }
  }

  void _onClearError(
    ClearFeedingError event,
    Emitter<FeedingState> emit,
  ) {
    emit(state.copyWith(clearError: true));
  }
}
