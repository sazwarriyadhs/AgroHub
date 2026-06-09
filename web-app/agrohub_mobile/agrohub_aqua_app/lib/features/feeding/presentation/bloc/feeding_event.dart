// lib/features/feeding/presentation/bloc/feeding_event.dart
import 'package:equatable/equatable.dart';

abstract class FeedingEvent extends Equatable {
  const FeedingEvent();
  @override
  List<Object?> get props => [];
}

class LoadAllFeedingData extends FeedingEvent {
  const LoadAllFeedingData();
}

class AddFeedStockEvent extends FeedingEvent {
  final Map<String, dynamic> data;
  const AddFeedStockEvent(this.data);
  @override
  List<Object?> get props => [data];
}

class DeleteFeedStockEvent extends FeedingEvent {
  final String feedId;
  const DeleteFeedStockEvent(this.feedId);
  @override
  List<Object?> get props => [feedId];
}

class ToggleFeedingScheduleEvent extends FeedingEvent {
  final String scheduleId;
  final bool isEnabled;
  const ToggleFeedingScheduleEvent(this.scheduleId, this.isEnabled);
  @override
  List<Object?> get props => [scheduleId, isEnabled];
}

class ClearFeedingError extends FeedingEvent {
  const ClearFeedingError();
}
