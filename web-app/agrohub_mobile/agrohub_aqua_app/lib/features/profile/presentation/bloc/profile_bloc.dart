// lib/features/profile/presentation/bloc/profile_bloc.dart
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../../../../core/services/api_service.dart';
import '../../../domain/usecases/get_user_profile.dart';
import '../../../domain/usecases/get_aquaculture_assets.dart';
import '../../../domain/usecases/update_profile.dart';
import '../../../data/repositories/profile_repository_impl.dart';
import '../../../data/datasource/profile_remote_datasource.dart';
import '../../../data/models/user_model.dart';
import '../../../data/models/aquaculture_asset_model.dart';

part 'profile_event.dart';
part 'profile_state.dart';

class ProfileBloc extends Bloc<ProfileEvent, ProfileState> {
  late final GetUserProfile _getUserProfile;
  late final GetAquacultureAssets _getAquacultureAssets;
  late final UpdateProfile _updateProfile;

  ProfileBloc({required ApiService apiService})
    : super(ProfileState.initial()) {
    // Setup dependencies
    final datasource = ProfileRemoteDatasource(apiService);
    final repository = ProfileRepositoryImpl(datasource);
    _getUserProfile = GetUserProfile(repository);
    _getAquacultureAssets = GetAquacultureAssets(repository);
    _updateProfile = UpdateProfile(repository);

    on<LoadAllProfileData>(_onLoadAllProfileData);
    on<LoadUserProfile>(_onLoadUserProfile);
    on<LoadAquacultureAssets>(_onLoadAquacultureAssets);
    on<UpdateUserProfile>(_onUpdateUserProfile);
    on<UpdateAvatar>(_onUpdateAvatar);
    on<UpdateMembership>(_onUpdateMembership);
    on<ClearProfileError>(_onClearError);
  }

  Future<void> _onLoadAllProfileData(
    LoadAllProfileData event,
    Emitter<ProfileState> emit,
  ) async {
    emit(state.copyWith(isLoading: true, clearError: true));

    try {
      final userFuture = _getUserProfile();
      final assetsFuture = _getAquacultureAssets();

      final results = await Future.wait([userFuture, assetsFuture]);
      final user = results[0] as UserModel;
      final assets = results[1] as List<AquacultureAssetModel>;

      final totalFishStock = assets.fold(0, (sum, a) => sum + (a.stockCount ?? 0));
      final totalBiomass = assets.fold(0.0, (sum, a) => sum + (a.estimatedBiomass ?? 0.0));
      final avgSurvivalRate = assets.isEmpty
          ? 0.0
          : assets.map((a) => (a.survivalRate ?? 0).toDouble()).reduce((a, b) => a + b) / assets.length;

      emit(state.copyWith(
        isLoading: false,
        user: user,
        assets: assets,
        totalFishStock: totalFishStock,
        totalBiomass: totalBiomass,
        avgSurvivalRate: avgSurvivalRate,
      ));
    } catch (e) {
      emit(state.copyWith(
        isLoading: false,
        error: e.toString(),
      ));
    }
  }

  Future<void> _onLoadUserProfile(
    LoadUserProfile event,
    Emitter<ProfileState> emit,
  ) async {
    emit(state.copyWith(isLoading: true));

    try {
      final user = await _getUserProfile();
      emit(state.copyWith(
        isLoading: false,
        user: user,
      ));
    } catch (e) {
      emit(state.copyWith(
        isLoading: false,
        error: e.toString(),
      ));
    }
  }

  Future<void> _onLoadAquacultureAssets(
    LoadAquacultureAssets event,
    Emitter<ProfileState> emit,
  ) async {
    emit(state.copyWith(isLoading: true));

    try {
      final assets = await _getAquacultureAssets();
      
      final totalFishStock = assets.fold(0, (sum, a) => sum + (a.stockCount ?? 0));
      final totalBiomass = assets.fold(0.0, (sum, a) => sum + (a.estimatedBiomass ?? 0.0));
      final avgSurvivalRate = assets.isEmpty
          ? 0.0
          : assets.map((a) => (a.survivalRate ?? 0).toDouble()).reduce((a, b) => a + b) / assets.length;

      emit(state.copyWith(
        isLoading: false,
        assets: assets,
        totalFishStock: totalFishStock,
        totalBiomass: totalBiomass,
        avgSurvivalRate: avgSurvivalRate,
      ));
    } catch (e) {
      emit(state.copyWith(
        isLoading: false,
        error: e.toString(),
      ));
    }
  }

  Future<void> _onUpdateUserProfile(
    UpdateUserProfile event,
    Emitter<ProfileState> emit,
  ) async {
    emit(state.copyWith(isSubmitting: true, clearError: true));

    try {
      final updatedUser = await _updateProfile(event.data);
      emit(state.copyWith(
        isSubmitting: false,
        user: updatedUser,
      ));
    } catch (e) {
      emit(state.copyWith(
        isSubmitting: false,
        error: e.toString(),
      ));
      rethrow;
    }
  }

  Future<void> _onUpdateAvatar(
    UpdateAvatar event,
    Emitter<ProfileState> emit,
  ) async {
    emit(state.copyWith(isSubmitting: true));

    try {
      // TODO: Implement avatar upload API
      // await _updateAvatar.call(event.imagePath);
      
      emit(state.copyWith(isSubmitting: false));
      add(const LoadUserProfile()); // Refresh user data
    } catch (e) {
      emit(state.copyWith(
        isSubmitting: false,
        error: e.toString(),
      ));
      rethrow;
    }
  }

  Future<void> _onUpdateMembership(
    UpdateMembership event,
    Emitter<ProfileState> emit,
  ) async {
    emit(state.copyWith(isSubmitting: true));

    try {
      // TODO: Implement membership update API
      // await _updateMembership.call(event.membershipCode);
      
      emit(state.copyWith(isSubmitting: false));
      add(const LoadUserProfile()); // Refresh user data
    } catch (e) {
      emit(state.copyWith(
        isSubmitting: false,
        error: e.toString(),
      ));
      rethrow;
    }
  }

  void _onClearError(
    ClearProfileError event,
    Emitter<ProfileState> emit,
  ) {
    emit(state.copyWith(clearError: true));
  }
}
