// lib/features/profile/presentation/bloc/profile_state.dart
part of 'profile_bloc.dart';

class ProfileState extends Equatable {
  final bool isLoading;
  final bool isSubmitting;
  final String? error;
  final UserEntity? user;
  final List<AquacultureAssetEntity> assets;
  final int totalFishStock;
  final double totalBiomass;
  final double avgSurvivalRate;

  const ProfileState({
    this.isLoading = false,
    this.isSubmitting = false,
    this.error,
    this.user,
    this.assets = const [],
    this.totalFishStock = 0,
    this.totalBiomass = 0,
    this.avgSurvivalRate = 0,
  });

  factory ProfileState.initial() => const ProfileState();

  ProfileState copyWith({
    bool? isLoading,
    bool? isSubmitting,
    String? error,
    UserEntity? user,
    List<AquacultureAssetEntity>? assets,
    int? totalFishStock,
    double? totalBiomass,
    double? avgSurvivalRate,
    bool clearError = false,
  }) {
    return ProfileState(
      isLoading: isLoading ?? this.isLoading,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      error: clearError ? null : error ?? this.error,
      user: user ?? this.user,
      assets: assets ?? this.assets,
      totalFishStock: totalFishStock ?? this.totalFishStock,
      totalBiomass: totalBiomass ?? this.totalBiomass,
      avgSurvivalRate: avgSurvivalRate ?? this.avgSurvivalRate,
    );
  }

  @override
  List<Object?> get props => [
    isLoading, isSubmitting, error, user, assets,
    totalFishStock, totalBiomass, avgSurvivalRate
  ];
}
