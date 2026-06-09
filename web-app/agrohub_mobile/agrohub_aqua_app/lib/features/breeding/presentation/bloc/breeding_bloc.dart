// lib/features/breeding/presentation/bloc/breeding_bloc.dart
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../../../../core/services/api_service.dart';
import '../../../domain/entities/breeding_entity.dart';

part 'breeding_event.dart';
part 'breeding_state.dart';

class BreedingBloc extends Bloc<BreedingEvent, BreedingState> {
  final ApiService _apiService;

  BreedingBloc({required ApiService apiService})
    : _apiService = apiService,
      super(BreedingState.initial()) {
    on<LoadBreedings>(_onLoadBreedings);
    on<LoadBreedingDetail>(_onLoadBreedingDetail);
    on<CreateBreeding>(_onCreateBreeding);
    on<UpdateBreeding>(_onUpdateBreeding);
    on<DeleteBreeding>(_onDeleteBreeding);
    on<AnalyzeBreeding>(_onAnalyzeBreeding);
    on<RecordGrowth>(_onRecordGrowth);
  }

  Future<void> _onLoadBreedings(
    LoadBreedings event,
    Emitter<BreedingState> emit,
  ) async {
    emit(state.copyWith(isLoading: true, clearError: true));

    try {
      // TODO: Implement API call
      // final response = await _apiService.getBreedings();
      
      // Mock data untuk demo
      final mockBreedings = [
        BreedingEntity(
          id: '1',
          fishType: 'Lele',
          batchNumber: '12',
          currentDay: 14,
          totalDays: 28,
          currentPhase: 'incubation',
          eggCount: 48200,
          hatchRate: 87,
          survivalRate: 92,
          aiSuccessRate: 0.89,
          aiInsight: 'Water quality optimal, mortality risk low',
          waterQuality: {
            'ph': 7.2,
            'oxygen': 6.5,
            'temperature': 28,
            'ammonia': 0.2,
          },
          status: 'active',
        ),
      ];

      emit(state.copyWith(
        isLoading: false,
        breedings: mockBreedings,
      ));
    } catch (e) {
      emit(state.copyWith(
        isLoading: false,
        error: e.toString(),
      ));
    }
  }

  Future<void> _onLoadBreedingDetail(
    LoadBreedingDetail event,
    Emitter<BreedingState> emit,
  ) async {
    emit(state.copyWith(isLoading: true, clearError: true));

    try {
      // TODO: Implement API call
      // final response = await _apiService.getBreedingDetail(event.breedingId);
      
      // Mock data untuk demo
      final mockBreeding = BreedingEntity(
        id: event.breedingId,
        fishType: 'Lele',
        batchNumber: '12',
        currentDay: 14,
        totalDays: 28,
        currentPhase: 'incubation',
        eggCount: 48200,
        hatchRate: 87,
        survivalRate: 92,
        aiSuccessRate: 0.89,
        aiInsight: 'Water quality optimal, mortality risk low. Recommend maintain oxygen > 6 mg/L.',
        waterQuality: {
          'ph': 7.2,
          'oxygen': 6.5,
          'temperature': 28,
          'ammonia': 0.2,
        },
        timeline: [
          const BreedingStep(title: 'Egg Fertilization', isDone: true),
          const BreedingStep(title: 'Incubation', isDone: true),
          const BreedingStep(title: 'Hatching', isDone: false),
          const BreedingStep(title: 'Larva Growth', isDone: false),
          const BreedingStep(title: 'Fry Stage', isDone: false),
        ],
        startedAt: DateTime.now().subtract(const Duration(days: 14)),
        expectedHarvestDate: DateTime.now().add(const Duration(days: 14)),
        status: 'active',
      );

      emit(state.copyWith(
        isLoading: false,
        currentBreeding: mockBreeding,
      ));
    } catch (e) {
      emit(state.copyWith(
        isLoading: false,
        error: e.toString(),
      ));
    }
  }

  Future<void> _onCreateBreeding(
    CreateBreeding event,
    Emitter<BreedingState> emit,
  ) async {
    emit(state.copyWith(isSubmitting: true, clearError: true));

    try {
      // TODO: Implement API call
      // final response = await _apiService.createBreeding(event.data);
      
      emit(state.copyWith(isSubmitting: false));
    } catch (e) {
      emit(state.copyWith(
        isSubmitting: false,
        error: e.toString(),
      ));
      rethrow;
    }
  }

  Future<void> _onUpdateBreeding(
    UpdateBreeding event,
    Emitter<BreedingState> emit,
  ) async {
    emit(state.copyWith(isSubmitting: true, clearError: true));

    try {
      // TODO: Implement API call
      // final response = await _apiService.updateBreeding(event.breedingId, event.data);
      
      emit(state.copyWith(isSubmitting: false));
      add(LoadBreedingDetail(event.breedingId));
    } catch (e) {
      emit(state.copyWith(
        isSubmitting: false,
        error: e.toString(),
      ));
      rethrow;
    }
  }

  Future<void> _onDeleteBreeding(
    DeleteBreeding event,
    Emitter<BreedingState> emit,
  ) async {
    emit(state.copyWith(isSubmitting: true));

    try {
      // TODO: Implement API call
      // await _apiService.deleteBreeding(event.breedingId);
      
      emit(state.copyWith(isSubmitting: false));
      add(const LoadBreedings());
    } catch (e) {
      emit(state.copyWith(
        isSubmitting: false,
        error: e.toString(),
      ));
      rethrow;
    }
  }

  Future<void> _onAnalyzeBreeding(
    AnalyzeBreeding event,
    Emitter<BreedingState> emit,
  ) async {
    emit(state.copyWith(isSubmitting: true));

    try {
      // TODO: Implement AI analysis API
      // final analysis = await _apiService.analyzeBreeding(event.breedingId);
      
      await Future.delayed(const Duration(seconds: 1));
      
      // Refresh data after analysis
      add(LoadBreedingDetail(event.breedingId));
      emit(state.copyWith(isSubmitting: false));
    } catch (e) {
      emit(state.copyWith(
        isSubmitting: false,
        error: e.toString(),
      ));
      rethrow;
    }
  }

  Future<void> _onRecordGrowth(
    RecordGrowth event,
    Emitter<BreedingState> emit,
  ) async {
    emit(state.copyWith(isSubmitting: true));

    try {
      // TODO: Implement API call
      // await _apiService.recordGrowth(event.breedingId, {
      //   'weight': event.weight,
      //   'length': event.length,
      // });
      
      await Future.delayed(const Duration(seconds: 1));
      
      // Refresh data after recording
      add(LoadBreedingDetail(event.breedingId));
      emit(state.copyWith(isSubmitting: false));
    } catch (e) {
      emit(state.copyWith(
        isSubmitting: false,
        error: e.toString(),
      ));
      rethrow;
    }
  }
}
