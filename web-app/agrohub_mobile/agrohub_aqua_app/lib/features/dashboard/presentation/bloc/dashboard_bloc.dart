// lib/features/dashboard/presentation/bloc/dashboard_bloc.dart
import 'dart:developer';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/services/api_service.dart';
import '../../../../core/services/user_session.dart';
import '../../../auth/models/user_model.dart';

part 'dashboard_event.dart';
part 'dashboard_state.dart';

class DashboardBloc extends Bloc<DashboardEvent, DashboardState> {
  final ApiService _apiService;
  final UserSession _userSession;

  DashboardBloc({
    required ApiService apiService,
    required UserSession userSession,
  }) : _apiService = apiService,
       _userSession = userSession,
       super(DashboardState.initial()) {
    on<LoadDashboardData>(_onLoadDashboardData);
    on<RefreshDashboard>(_onRefreshDashboard);
    on<UpdateNotificationCount>(_onUpdateNotificationCount);
    on<LoadWalletOnly>(_onLoadWalletOnly);
    on<LoadActivitiesOnly>(_onLoadActivitiesOnly);
    on<LoadProfileOnly>(_onLoadProfileOnly);
  }

  /// Load all dashboard data in parallel
  Future<void> _onLoadDashboardData(
    LoadDashboardData event,
    Emitter<DashboardState> emit,
  ) async {
    // Skip if already loaded (unless force refresh)
    if (!event.forceRefresh && !state.isLoading && state.user != null) {
      return;
    }

    emit(state.copyWith(
      isLoading: true,
      error: null,
      isRefreshing: event.forceRefresh,
    ));

    try {
      // Run all API calls in parallel for better performance
      final results = await Future.wait([
        _apiService.getDashboardStats(),
        _apiService.getWallet(),
        _apiService.getRecentActivities(),
        _loadUserProfile(),
        _apiService.getNotificationCount(),
      ]);

      final stats = _normalizeMap(results[0]);
      final wallet = _normalizeMap(results[1]);
      final activities = _normalizeList(results[2]);
      final userData = results[3] as Map<String, dynamic>;
      final notifCount = _toInt(results[4]);

      // Extract user data
      final userName = _toString(userData['full_name'] ?? userData['name']);
      final userEmail = _toString(userData['email']);
      final username = _toString(userData['username']);
      final userAvatar = _toString(userData['avatar']);
      final farmName = _toString(userData['farm_name']);
      final farmSize = _toDouble(userData['farm_size']);
      final farmAddress = _toString(userData['farm_address']);
      final membershipType = _toString(userData['membership_type']);
      final membershipCode = _toString(userData['membership_code']);
      final role = _toString(userData['role'] ?? userData['user_type']);

      emit(state.copyWith(
        isLoading: false,
        isRefreshing: false,
        stats: stats,
        wallet: wallet,
        recentActivities: activities,
        notificationCount: notifCount,
        userName: userName,
        userEmail: userEmail,
        username: username,
        userAvatar: userAvatar,
        farmName: farmName,
        farmSize: farmSize,
        farmAddress: farmAddress,
        membershipType: membershipType,
        membershipCode: membershipCode,
        role: role,
        error: null,
      ));
    } catch (e, stackTrace) {
      log('DashboardBloc error', error: e, stackTrace: stackTrace);
      emit(state.copyWith(
        isLoading: false,
        isRefreshing: false,
        error: e.toString(),
      ));
    }
  }

  Future<void> _onRefreshDashboard(
    RefreshDashboard event,
    Emitter<DashboardState> emit,
  ) async {
    add(LoadDashboardData(forceRefresh: true));
  }

  Future<void> _onUpdateNotificationCount(
    UpdateNotificationCount event,
    Emitter<DashboardState> emit,
  ) async {
    emit(state.copyWith(notificationCount: event.count));
  }

  Future<void> _onLoadWalletOnly(
    LoadWalletOnly event,
    Emitter<DashboardState> emit,
  ) async {
    try {
      final wallet = await _apiService.getWallet();
      emit(state.copyWith(
        wallet: _normalizeMap(wallet),
        lastUpdated: DateTime.now(),
      ));
    } catch (e) {
      log('Error loading wallet', error: e);
    }
  }

  Future<void> _onLoadActivitiesOnly(
    LoadActivitiesOnly event,
    Emitter<DashboardState> emit,
  ) async {
    try {
      final activities = await _apiService.getRecentActivities();
      emit(state.copyWith(
        recentActivities: _normalizeList(activities),
        lastUpdated: DateTime.now(),
      ));
    } catch (e) {
      log('Error loading activities', error: e);
    }
  }

  Future<void> _onLoadProfileOnly(
    LoadProfileOnly event,
    Emitter<DashboardState> emit,
  ) async {
    try {
      final userData = await _loadUserProfile();
      emit(state.copyWith(
        userName: _toString(userData['full_name'] ?? userData['name']),
        userEmail: _toString(userData['email']),
        username: _toString(userData['username']),
        farmName: _toString(userData['farm_name']),
        farmSize: _toDouble(userData['farm_size']),
        membershipType: _toString(userData['membership_type']),
        membershipCode: _toString(userData['membership_code']),
        lastUpdated: DateTime.now(),
      ));
    } catch (e) {
      log('Error loading profile', error: e);
    }
  }

  // ==========================================================================
  // PRIVATE HELPERS
  // ==========================================================================

  Future<Map<String, dynamic>> _loadUserProfile() async {
    try {
      final response = await _apiService.getProfile();
      return _normalizeMap(response);
    } catch (e) {
      log('Profile API error', error: e);
      // Return fallback data
      return {
        'full_name': 'Nelayan Lele Demo',
        'email': 'nelayan.lele@agrohub.com',
        'username': 'nelayan.lele',
        'farm_name': 'Farm Lele Jaya',
        'farm_size': 2.5,
        'farm_address': 'Jl. Tambak Mulyo No. 45, Sidoarjo',
        'membership_type': 'Gold',
        'membership_code': 'AGH-2026-X82KQ',
        'role': 'farmer',
      };
    }
  }

  Map<String, dynamic> _normalizeMap(dynamic data) {
    if (data == null) return {};
    if (data is Map<String, dynamic>) {
      final innerData = data['data'];
      if (innerData is Map<String, dynamic>) return innerData;
      return data;
    }
    return {};
  }

  List<Map<String, dynamic>> _normalizeList(dynamic data) {
    if (data == null) return [];
    final responseData = data is Map<String, dynamic> ? data['data'] : data;
    if (responseData is List) {
      return responseData.whereType<Map<String, dynamic>>().toList();
    }
    return [];
  }

  int _toInt(dynamic value) {
    if (value == null) return 0;
    if (value is int) return value;
    if (value is String) return int.tryParse(value) ?? 0;
    if (value is double) return value.toInt();
    return 0;
  }

  double _toDouble(dynamic value) {
    if (value == null) return 0.0;
    if (value is double) return value;
    if (value is int) return value.toDouble();
    if (value is String) return double.tryParse(value) ?? 0.0;
    return 0.0;
  }

  String _toString(dynamic value) {
    if (value == null) return "";
    return value.toString();
  }
}