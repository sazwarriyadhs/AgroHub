// lib/features/dashboard/presentation/bloc/dashboard_state.dart
part of 'dashboard_bloc.dart';

class DashboardState extends Equatable {
  final bool isLoading;
  final bool isRefreshing;
  final String? error;
  
  // Data sections
  final Map<String, dynamic> stats;
  final Map<String, dynamic> wallet;
  final List<Map<String, dynamic>> recentActivities;
  
  // User data
  final UserModel? user;
  final String userName;
  final String userEmail;
  final String username;
  final String userAvatar;
  
  // Farm data
  final String farmName;
  final double farmSize;
  final String farmAddress;
  
  // Membership data
  final String membershipType;
  final String membershipCode;
  final String role;
  
  // Notifications
  final int notificationCount;
  
  // Last update timestamp
  final DateTime? lastUpdated;

  const DashboardState({
    this.isLoading = true,
    this.isRefreshing = false,
    this.error,
    this.stats = const {
      'pond_count': 0,
      'fish_count': 0,
      'water_quality': 'Normal',
      'total_harvest': 0,
    },
    this.wallet = const {
      'balance': 0,
      'growth': '0%',
    },
    this.recentActivities = const [],
    this.user,
    this.userName = "",
    this.userEmail = "",
    this.username = "",
    this.userAvatar = "",
    this.farmName = "",
    this.farmSize = 0.0,
    this.farmAddress = "",
    this.membershipType = "",
    this.membershipCode = "",
    this.role = "",
    this.notificationCount = 0,
    this.lastUpdated,
  });

  factory DashboardState.initial() => const DashboardState();

  DashboardState copyWith({
    bool? isLoading,
    bool? isRefreshing,
    String? error,
    Map<String, dynamic>? stats,
    Map<String, dynamic>? wallet,
    List<Map<String, dynamic>>? recentActivities,
    UserModel? user,
    String? userName,
    String? userEmail,
    String? username,
    String? userAvatar,
    String? farmName,
    double? farmSize,
    String? farmAddress,
    String? membershipType,
    String? membershipCode,
    String? role,
    int? notificationCount,
    DateTime? lastUpdated,
    bool clearError = false,
  }) {
    return DashboardState(
      isLoading: isLoading ?? this.isLoading,
      isRefreshing: isRefreshing ?? this.isRefreshing,
      error: clearError ? null : error ?? this.error,
      stats: stats ?? this.stats,
      wallet: wallet ?? this.wallet,
      recentActivities: recentActivities ?? this.recentActivities,
      user: user ?? this.user,
      userName: userName ?? this.userName,
      userEmail: userEmail ?? this.userEmail,
      username: username ?? this.username,
      userAvatar: userAvatar ?? this.userAvatar,
      farmName: farmName ?? this.farmName,
      farmSize: farmSize ?? this.farmSize,
      farmAddress: farmAddress ?? this.farmAddress,
      membershipType: membershipType ?? this.membershipType,
      membershipCode: membershipCode ?? this.membershipCode,
      role: role ?? this.role,
      notificationCount: notificationCount ?? this.notificationCount,
      lastUpdated: lastUpdated ?? DateTime.now(),
    );
  }

  @override
  List<Object?> get props => [
    isLoading,
    isRefreshing,
    error,
    stats,
    wallet,
    recentActivities,
    user,
    userName,
    userEmail,
    username,
    userAvatar,
    farmName,
    farmSize,
    farmAddress,
    membershipType,
    membershipCode,
    role,
    notificationCount,
    lastUpdated,
  ];
}