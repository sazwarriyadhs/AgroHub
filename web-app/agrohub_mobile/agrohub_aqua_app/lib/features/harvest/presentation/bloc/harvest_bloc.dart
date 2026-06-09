// lib/features/harvest/presentation/bloc/harvest_bloc.dart
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:agrohub_aqua_app/core/services/api_service.dart';
import '../../../data/models/harvest_model.dart';

part 'harvest_event.dart';
part 'harvest_state.dart';

class HarvestBloc extends Bloc<HarvestEvent, HarvestState> {
  final ApiService _apiService;
  
  HarvestBloc({required ApiService apiService})
    : _apiService = apiService,
      super(HarvestState.initial()) {
    on<LoadHarvestData>(_onLoadHarvestData);
    on<AddHarvestSchedule>(_onAddHarvestSchedule);
    on<StartHarvest>(_onStartHarvest);
    on<CompleteHarvest>(_onCompleteHarvest);
    on<CancelHarvest>(_onCancelHarvest);
  }
  
  Future<void> _onLoadHarvestData(
    LoadHarvestData event,
    Emitter<HarvestState> emit,
  ) async {
    emit(state.copyWith(isLoading: true, clearError: true));
    
    try {
      // Mock data untuk ikan air tawar
      final now = DateTime.now();
      
      final upcomingHarvest = [
        HarvestModel(
          id: '1',
          pondName: 'Kolam Lele 1',
          pondId: 'pond_1',
          fishType: 'Lele',
          harvestDate: now.add(const Duration(days: 7)),
          estimatedWeight: 850,
          status: 'scheduled',
          createdAt: now,
        ),
        HarvestModel(
          id: '2',
          pondName: 'Kolam Nila 1',
          pondId: 'pond_2',
          fishType: 'Nila',
          harvestDate: now.add(const Duration(days: 14)),
          estimatedWeight: 500,
          status: 'scheduled',
          createdAt: now,
        ),
      ];
      
      final harvestHistory = [
        HarvestModel(
          id: '3',
          pondName: 'Kolam Gurame',
          pondId: 'pond_3',
          fishType: 'Gurame',
          harvestDate: now.subtract(const Duration(days: 30)),
          estimatedWeight: 300,
          actualWeight: 320,
          sellingPrice: 35000,
          totalValue: 11200000,
          status: 'completed',
          createdAt: now.subtract(const Duration(days: 45)),
        ),
        HarvestModel(
          id: '4',
          pondName: 'Kolam Lele 2',
          pondId: 'pond_4',
          fishType: 'Lele',
          harvestDate: now.subtract(const Duration(days: 60)),
          estimatedWeight: 700,
          actualWeight: 680,
          sellingPrice: 25000,
          totalValue: 17000000,
          status: 'completed',
          createdAt: now.subtract(const Duration(days: 75)),
        ),
      ];
      
      emit(state.copyWith(
        isLoading: false,
        upcomingHarvest: upcomingHarvest,
        harvestHistory: harvestHistory,
        totalHarvestThisMonth: 1000,
        totalValueThisMonth: 28200000,
        totalHarvestAllTime: 2450,
        totalValueAllTime: 61200000,
      ));
    } catch (e) {
      emit(state.copyWith(
        isLoading: false,
        error: e.toString(),
      ));
    }
  }
  
  Future<void> _onAddHarvestSchedule(
    AddHarvestSchedule event,
    Emitter<HarvestState> emit,
  ) async {
    emit(state.copyWith(isSubmitting: true));
    
    try {
      // TODO: Implement API call
      await Future.delayed(const Duration(seconds: 1));
      
      final newHarvest = HarvestModel(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        pondName: event.harvestData['pondName'],
        pondId: event.harvestData['pondId'],
        fishType: event.harvestData['fishType'],
        harvestDate: event.harvestData['harvestDate'],
        estimatedWeight: event.harvestData['estimatedWeight'],
        status: 'scheduled',
        createdAt: DateTime.now(),
      );
      
      emit(state.copyWith(
        isSubmitting: false,
        upcomingHarvest: [newHarvest, ...state.upcomingHarvest],
      ));
    } catch (e) {
      emit(state.copyWith(
        isSubmitting: false,
        error: e.toString(),
      ));
      rethrow;
    }
  }
  
  Future<void> _onStartHarvest(
    StartHarvest event,
    Emitter<HarvestState> emit,
  ) async {
    emit(state.copyWith(isSubmitting: true));
    
    try {
      // TODO: Implement API call
      await Future.delayed(const Duration(seconds: 1));
      
      final updatedHarvest = state.upcomingHarvest.map((harvest) {
        if (harvest.id == event.harvestId) {
          return HarvestModel(
            id: harvest.id,
            pondName: harvest.pondName,
            pondId: harvest.pondId,
            fishType: harvest.fishType,
            harvestDate: harvest.harvestDate,
            estimatedWeight: harvest.estimatedWeight,
            status: 'in_progress',
            createdAt: harvest.createdAt,
          );
        }
        return harvest;
      }).toList();
      
      emit(state.copyWith(
        isSubmitting: false,
        upcomingHarvest: updatedHarvest,
      ));
    } catch (e) {
      emit(state.copyWith(
        isSubmitting: false,
        error: e.toString(),
      ));
      rethrow;
    }
  }
  
  Future<void> _onCompleteHarvest(
    CompleteHarvest event,
    Emitter<HarvestState> emit,
  ) async {
    emit(state.copyWith(isSubmitting: true));
    
    try {
      // TODO: Implement API call
      await Future.delayed(const Duration(seconds: 1));
      
      HarvestEntity? completedHarvest;
      final updatedUpcoming = state.upcomingHarvest.where((harvest) {
        if (harvest.id == event.harvestId) {
          completedHarvest = harvest;
          return false;
        }
        return true;
      }).toList();
      
      if (completedHarvest != null) {
        final completed = HarvestModel(
          id: completedHarvest.id,
          pondName: completedHarvest.pondName,
          pondId: completedHarvest.pondId,
          fishType: completedHarvest.fishType,
          harvestDate: completedHarvest.harvestDate,
          estimatedWeight: completedHarvest.estimatedWeight,
          actualWeight: event.actualWeight,
          sellingPrice: event.sellingPrice,
          totalValue: event.actualWeight * event.sellingPrice,
          status: 'completed',
          createdAt: completedHarvest.createdAt,
        );
        
        emit(state.copyWith(
          isSubmitting: false,
          upcomingHarvest: updatedUpcoming,
          harvestHistory: [completed, ...state.harvestHistory],
        ));
      } else {
        emit(state.copyWith(isSubmitting: false));
      }
    } catch (e) {
      emit(state.copyWith(
        isSubmitting: false,
        error: e.toString(),
      ));
      rethrow;
    }
  }
  
  Future<void> _onCancelHarvest(
    CancelHarvest event,
    Emitter<HarvestState> emit,
  ) async {
    emit(state.copyWith(isSubmitting: true));
    
    try {
      // TODO: Implement API call
      await Future.delayed(const Duration(seconds: 1));
      
      final updatedHarvest = state.upcomingHarvest.where(
        (harvest) => harvest.id != event.harvestId
      ).toList();
      
      emit(state.copyWith(
        isSubmitting: false,
        upcomingHarvest: updatedHarvest,
      ));
    } catch (e) {
      emit(state.copyWith(
        isSubmitting: false,
        error: e.toString(),
      ));
      rethrow;
    }
  }
}
