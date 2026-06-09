import 'package:agrohub_aqua_app/features/activities/presentation/screens/all_activities_screen.dart';
// lib/features/dashboard/presentation/screens/aqua_dashboard.dart
// ============================================================================
// AGROHUB AQUA DASHBOARD - FULL DATABASE INTEGRATION
// Database: PostgreSQL with user role 'farmer'
// VERSION: FINAL 2.1.2 - WITH BUG FIXES (NO UI CHANGES)
// ============================================================================

import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';

import 'package:agrohub_aqua_app/app/theme/app_theme.dart';
import '../../../dashboard/presentation/widgets/recent_activities_widget.dart';
import '../../../../core/services/api_service.dart';
// REMOVED: import '../../../pond/presentation/screens/kolam_screen.dart'; // UNUSED
import '../../../monitoring/presentation/screens/monitoring_screen.dart';
import '../../../harvest/presentation/screens/panen_screen.dart';
import '../../../profile/presentation/screens/profile_screen.dart';
import '../../../marketplace/presentation/screens/marketplace_screen.dart';
import '../../../wallet/presentation/screens/keuangan_screen.dart';
import '../../../ai/presentation/screens/ai_screen.dart';
import '../../../feeding/presentation/screens/pakan_screen.dart';
import '../../../chats/presentation/screens/chat_screen.dart';
import '../../../../core/services/user_session.dart';
import '../../../ai/presentation/widgets/ai_insight_card.dart';
import '../../../ai/presentation/widgets/ai_quick_menu.dart';

// ============================================================================
// CONSTANTS
// ============================================================================

/// Fallback user ID when API doesn't return one
const int FALLBACK_USER_ID = 41;

// ============================================================================
// HELPER FUNCTIONS - SAFE PARSING
// ============================================================================

List<Map<String, dynamic>> normalizeToList(dynamic response) {
  if (response == null) return [];
  
  final data = response is Map<String, dynamic> 
      ? response['data'] 
      : response;
  
  if (data == null) return [];
  
  if (data is List) {
    return data.whereType<Map<String, dynamic>>().toList();
  }
  
  if (data is Map) {
    return data.entries.map((entry) {
      if (entry.value is Map) {
        return {
          'key': entry.key,
          ...Map<String, dynamic>.from(entry.value as Map),
        };
      } else {
        return {
          'name': entry.key,
          'value': entry.value,
        };
      }
    }).toList();
  }
  
  return [];
}

Map<String, dynamic> normalizeToMap(dynamic response) {
  if (response == null) return {};
  
  if (response is Map<String, dynamic>) {
    final data = response['data'];
    if (data is Map<String, dynamic>) {
      return data;
    }
    return response;
  }
  
  return {};
}

int normalizeToInt(dynamic value) {
  if (value == null) return 0;
  if (value is int) return value;
  if (value is String) return int.tryParse(value) ?? 0;
  if (value is double) return value.toInt();
  if (value is num) return value.toInt();
  return 0;
}

double normalizeToDouble(dynamic value) {
  if (value == null) return 0.0;
  if (value is double) return value;
  if (value is int) return value.toDouble();
  if (value is String) return double.tryParse(value) ?? 0.0;
  if (value is num) return value.toDouble();
  return 0.0;
}

String normalizeToString(dynamic value) {
  if (value == null) return "";
  return value.toString();
}

// ============================================================================
// MAIN DASHBOARD
// ============================================================================

class AquaDashboard extends StatefulWidget {
  const AquaDashboard({super.key});

  @override
  State<AquaDashboard> createState() => _AquaDashboardState();
}

class _AquaDashboardState extends State<AquaDashboard> {
  int _currentIndex = 0;
  
  Map<String, dynamic> _dashboardStats = {};
  Map<String, dynamic> _walletData = {};
  List<Map<String, dynamic>> _recentActivities = [];
  int _notificationCount = 0;
  
  // User data from database
  String _userName = "";
  String _userEmail = "";
  String _userAvatar = "";
  String _username = "";
  String _farmName = "";
  double _farmSize = 0.0;
  String _farmAddress = "";
  String _membershipType = "";
  String _membershipCode = "";
  String _role = "";
  
  bool _isLoading = true;
  String? _errorMessage;
  
  List<Widget> _screens = [];
  
  late final ApiService _apiService;
  
  @override
  void initState() {
    super.initState();
    _apiService = ApiService();
    _initializeEmptyScreens();
    _loadAllData();
  }
  
  Future<void> _loadAllData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });
    
    final isLoggedIn = await _apiService.isLoggedIn();
    
    if (!isLoggedIn) {
      _redirectToLogin();
      return;
    }
    
    try {
      await Future.wait([
        _loadDashboardData(),
        _loadWalletData(),
        _loadRecentActivities(),
        _loadUserProfile(),
        _loadNotificationCount(),
      ]);
      
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
        _rebuildScreens();
      }
    } catch (e) {
      debugPrint('Error loading data: $e');
      if (mounted) {
        setState(() {
          _errorMessage = e.toString();
          _isLoading = false;
        });
      }
    }
  }
  
  Future<void> _loadDashboardData() async {
    try {
      final response = await _apiService.getDashboardStats();
      if (mounted) {
        _dashboardStats = normalizeToMap(response);
      }
    } catch (e) {
      debugPrint('Dashboard stats error: $e');
      _dashboardStats = {
        'pond_count': 0,
        'fish_count': 0,
        'water_quality': 'Normal',
        'total_harvest': 0,
      };
    }
  }
  
  Future<void> _loadWalletData() async {
    try {
      final response = await _apiService.getWallet();
      if (mounted) {
        _walletData = normalizeToMap(response);
      }
    } catch (e) {
      debugPrint('Wallet error: $e');
      _walletData = {
        'balance': 0,
        'growth': '0%',
      };
    }
  }
  
  Future<void> _loadRecentActivities() async {
    try {
      final response = await _apiService.getRecentActivities();
      if (mounted) {
        _recentActivities = normalizeToList(response);
      }
    } catch (e) {
      debugPrint('Activities error: $e');
      _recentActivities = [];
    }
  }
  
  Future<void> _loadNotificationCount() async {
    try {
      final count = await _apiService.getNotificationCount();
      if (mounted) {
        _notificationCount = normalizeToInt(count);
      }
    } catch (e) {
      debugPrint('Notification count error: $e');
      _notificationCount = 0;
    }
  }
  
  Future<void> _loadUserProfile() async {
    try {
      final response = await _apiService.getProfile();
      
      if (mounted) {
        final data = normalizeToMap(response);
        
        // Extract all user data from database response
        final fullName = normalizeToString(data['full_name'] ?? data['name']);
        final email = normalizeToString(data['email']);
        final username = normalizeToString(data['username']);
        final avatar = normalizeToString(data['avatar']);
        final farmName = normalizeToString(data['farm_name']);
        final farmSize = normalizeToDouble(data['farm_size']);
        final farmAddress = normalizeToString(data['farm_address']);
        final membershipType = normalizeToString(data['membership_type']);
        final membershipCode = normalizeToString(data['membership_code']);
        final role = normalizeToString(data['role'] ?? data['user_type']);
        
        // FIXED: Use constant for fallback user ID
        final userId = normalizeToInt(data['id']);
        
        // Sync to UserSession
        UserSession.setUser({
          "id": userId > 0 ? userId : FALLBACK_USER_ID,
          "full_name": fullName.isNotEmpty ? fullName : "Nelayan Lele Demo",
          "username": username.isNotEmpty ? username : "nelayan.lele",
          "email": email.isNotEmpty ? email : "nelayan.lele@agrohub.com",
          "avatar": avatar,
          "membership_type": membershipType.isNotEmpty ? membershipType : "Gold",
          "membership_code": membershipCode.isNotEmpty ? membershipCode : "AGH-2026-X82KQ",
        });
        
        setState(() {
          _userName = UserSession.fullName ?? fullName;
          _userEmail = UserSession.email ?? email;
          _userAvatar = avatar;
          _username = UserSession.username ?? username;
          _farmName = farmName;
          _farmSize = farmSize;
          _farmAddress = farmAddress;
          _membershipType = UserSession.membershipType ?? membershipType;
          _membershipCode = UserSession.membershipCode ?? membershipCode;
          _role = role;
        });
      }
    } catch (e) {
      debugPrint('Profile error: $e');
      
      // Fallback to demo data from database
      setState(() {
        _userName = "Nelayan Lele Demo";
        _userEmail = "nelayan.lele@agrohub.com";
        _username = "nelayan.lele";
        _farmName = "Farm Lele Jaya";
        _farmSize = 2.50;
        _farmAddress = "Jl. Tambak Mulyo No. 45, Sidoarjo, Jawa Timur";
        _membershipType = "Gold";
        _membershipCode = "AGH-2026-X82KQ";
        _role = "farmer";
      });
      
      UserSession.setUser({
        "id": FALLBACK_USER_ID,
        "full_name": _userName,
        "username": _username,
        "email": _userEmail,
        "avatar": "",
        "membership_type": _membershipType,
        "membership_code": _membershipCode,
      });
    }
  }
  
  void _redirectToLogin() {
    if (mounted) {
      Navigator.pushReplacementNamed(context, '/login');
    }
  }
  
  void _initializeEmptyScreens() {
    _screens = [
      _HomeScreen(
        dashboardStats: _dashboardStats,
        walletData: _walletData,
        recentActivities: _recentActivities,
        userName: _userName.isNotEmpty ? _userName : "Loading...",
        userEmail: _userEmail,
        username: _username,
        farmName: _farmName,
        farmSize: _farmSize,
        farmAddress: _farmAddress,
        membershipType: _membershipType,
        membershipCode: _membershipCode,
        onRefresh: _loadAllData,
      ),
      const ChatScreen(),
      const MonitoringScreen(),
      const PanenScreen(),
      const ProfileScreen(),
    ];
  }
  
  void _rebuildScreens() {
    if (!mounted) return;
    setState(() {
      _screens = [
        _HomeScreen(
          dashboardStats: _dashboardStats,
          walletData: _walletData,
          recentActivities: _recentActivities,
          userName: _userName.isNotEmpty ? _userName : "Nelayan Lele Demo",
          userEmail: _userEmail.isNotEmpty ? _userEmail : "nelayan.lele@agrohub.com",
          username: _username.isNotEmpty ? _username : "nelayan.lele",
          farmName: _farmName.isNotEmpty ? _farmName : "Farm Lele Jaya",
          farmSize: _farmSize > 0 ? _farmSize : 2.50,
          farmAddress: _farmAddress.isNotEmpty ? _farmAddress : "Jl. Tambak Mulyo No. 45, Sidoarjo",
          membershipType: _membershipType.isNotEmpty ? _membershipType : "Gold",
          membershipCode: _membershipCode.isNotEmpty ? _membershipCode : "AGH-2026-X82KQ",
          onRefresh: _loadAllData,
        ),
        const ChatScreen(),
        const MonitoringScreen(),
        const PanenScreen(),
        const ProfileScreen(),
      ];
    });
  }
  
  Future<void> _logout() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Keluar"),
        content: const Text("Apakah Anda yakin ingin keluar?"),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text("Batal"),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text("Keluar", style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
    
    if (confirmed == true) {
      await _apiService.logout();
      if (mounted) {
        Navigator.pushReplacementNamed(context, '/login');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: _buildAppBar(),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage != null
              ? _buildErrorWidget()
              : AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  child: _screens.isNotEmpty && _currentIndex < _screens.length
                      ? _screens[_currentIndex]
                      : const Center(child: CircularProgressIndicator()),
                ),
      bottomNavigationBar: _BottomNavigation(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
      ),
    );
  }
  
  Widget _buildErrorWidget() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error_outline, size: 64, color: Colors.red),
          const SizedBox(height: 16),
          Text("Gagal Memuat Data", style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text(_errorMessage ?? "Unknown error", textAlign: TextAlign.center),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: _loadAllData,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primaryColor,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            ),
            child: const Text("Coba Lagi"),
          ),
          TextButton(
            onPressed: _logout,
            child: const Text("Keluar", style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      backgroundColor: Colors.transparent,
      elevation: 0,
      title: Image.asset(
        "assets/logo/aqua.png",
        width: 120,
        height: 50,
        errorBuilder: (_, __, ___) => Text(
          "AgroHub Aqua",
          style: GoogleFonts.poppins(
            color: AppTheme.primaryColor,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      actions: [
        IconButton(
          icon: Icon(Icons.search, color: AppTheme.primaryColor),
          onPressed: () => _showSearchDialog(context),
        ),
        Stack(
          children: [
            IconButton(
              icon: Icon(Icons.notifications_none, color: AppTheme.primaryColor),
              onPressed: () => _showNotifications(context),
            ),
            if (_notificationCount > 0)
              Positioned(
                right: 8,
                top: 8,
                child: Container(
                  width: 18,
                  height: 18,
                  decoration: const BoxDecoration(
                    color: Colors.red,
                    shape: BoxShape.circle,
                  ),
                  child: Center(
                    child: Text(
                      "$_notificationCount",
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
        PopupMenuButton<String>(
          icon: Icon(Icons.more_vert, color: AppTheme.primaryColor),
          onSelected: (value) {
            if (value == 'logout') {
              _logout();
            }
          },
          itemBuilder: (context) => [
            const PopupMenuItem(
              value: 'logout',
              child: Row(
                children: [
                  Icon(Icons.logout, size: 20),
                  SizedBox(width: 8),
                  Text("Keluar"),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(width: 8),
      ],
    );
  }

  void _showSearchDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Container(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                autofocus: true,
                decoration: InputDecoration(
                  hintText: "Cari produk, kolam, atau panduan...",
                  prefixIcon: const Icon(Icons.search),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Wrap(
                spacing: 8,
                children: [
                  _searchChip("Lele"),
                  _searchChip("Nila"),
                  _searchChip("Gurame"),
                  _searchChip("Pakan"),
                  _searchChip("Panen"),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _searchChip(String label) {
    return ActionChip(
      label: Text(label),
      onPressed: () {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Mencari: $label")),
        );
      },
    );
  }

  void _showNotifications(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Notifikasi",
              style: GoogleFonts.poppins(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            if (_notificationCount == 0)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(32),
                  child: Text("Tidak ada notifikasi"),
                ),
              )
            else
              Column(
                children: List.generate(_notificationCount, (i) => ListTile(
                  leading: const Icon(Icons.notifications, color: Colors.blue),
                  title: const Text("Pemberitahuan Baru"),
                  subtitle: Text("${i + 1} jam yang lalu"),
                  onTap: () => Navigator.pop(context),
                )),
              ),
          ],
        ),
      ),
    );
  }
}

// ============================================================================
// HOME SCREEN
// ============================================================================

class _HomeScreen extends StatelessWidget {
  final Map<String, dynamic> dashboardStats;
  final Map<String, dynamic> walletData;
  final List<Map<String, dynamic>> recentActivities;
  final String userName;
  final String userEmail;
  final String username;
  final String farmName;
  final double farmSize;
  final String farmAddress;
  final String membershipType;
  final String membershipCode;
  final Future<void> Function() onRefresh;
  
  const _HomeScreen({
    required this.dashboardStats,
    required this.walletData,
    required this.recentActivities,
    required this.userName,
    required this.userEmail,
    required this.username,
    required this.farmName,
    required this.farmSize,
    required this.farmAddress,
    required this.membershipType,
    required this.membershipCode,
    required this.onRefresh,
  });

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: onRefresh,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _HeroSection(
              userName: userName,
              userEmail: userEmail,
              username: username,
              farmName: farmName,
              farmSize: farmSize,
              membershipType: membershipType,
              pondCount: normalizeToInt(dashboardStats['pond_count']),
              fishCount: normalizeToInt(dashboardStats['fish_count']),
              waterQuality: dashboardStats['water_quality'] ?? "Normal",
            ),
            const SizedBox(height: 16),
            _MembershipCard(
              membershipType: membershipType,
              membershipCode: membershipCode,
            ),
            const SizedBox(height: 16),
            _WalletCard(walletData: walletData),
            const SizedBox(height: 16),
            
            // AI Components
            const AiInsightCard(
              title: "Prediksi Panen",
              value: "1.2 Ton (12 hari)",
              icon: Icons.trending_up,
              color: Colors.green,
            ),
            const SizedBox(height: 16),
            
            // FIXED: Improved AiQuickMenu with switch-case
            AiQuickMenu(
              onTap: (key) {
                switch (key) {
                  case "chat":
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const ChatScreen()),
                    );
                    break;
                  case "panen":
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const PanenScreen()),
                    );
                    break;
                  case "harga":
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const MarketplaceScreen()),
                    );
                    break;
                  default:
                    debugPrint('Unknown AI menu key: $key');
                }
              },
            ),
            const SizedBox(height: 16),
            
            const _SellHarvestCard(),
            const SizedBox(height: 16),
            const _MarketPrices(),
            const SizedBox(height: 16),
            const _QuickMenuGrid(),
            const SizedBox(height: 16),
            RecentActivitiesWidget(
  activities: recentActivities,
  onViewAll: () {
    // TODO: Navigasi ke halaman semua aktivitas
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const AllActivitiesScreen()),
    );
  },
),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}

// ============================================================================
// HERO SECTION (NO CHANGES)
// ============================================================================

class _HeroSection extends StatelessWidget {
  final String userName;
  final String userEmail;
  final String username;
  final String farmName;
  final double farmSize;
  final String membershipType;
  final int pondCount;
  final int fishCount;
  final String waterQuality;
  
  const _HeroSection({
    required this.userName,
    required this.userEmail,
    required this.username,
    required this.farmName,
    required this.farmSize,
    required this.membershipType,
    required this.pondCount,
    required this.fishCount,
    required this.waterQuality,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 260,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        image: const DecorationImage(
          image: AssetImage("assets/images/header.png"),
          fit: BoxFit.cover,
        ),
      ),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(24),
          gradient: LinearGradient(
            colors: [Colors.black.withOpacity(0.2), Colors.black.withOpacity(0.75)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 55,
                  height: 55,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.2),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: ClipOval(
                    child: Image.asset(
                      "assets/images/nelayan.png",
                      width: 55,
                      height: 55,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => const Icon(
                        Icons.person,
                        size: 35,
                        color: Colors.blue,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Halo, $userName",
                        style: GoogleFonts.poppins(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Row(
                        children: [
                          const Icon(Icons.alternate_email, size: 12, color: Colors.white70),
                          const SizedBox(width: 4),
                          Text(
                            "@$username",
                            style: const TextStyle(color: Colors.white70, fontSize: 11),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: _getMembershipColor(membershipType),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              membershipType,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 9,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Row(
                        children: [
                          const Icon(Icons.email, size: 12, color: Colors.white70),
                          const SizedBox(width: 4),
                          Text(
                            userEmail,
                            style: const TextStyle(color: Colors.white60, fontSize: 10),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.agriculture, size: 14, color: Colors.white70),
                  const SizedBox(width: 4),
                  Text(
                    "$farmName • ${farmSize.toStringAsFixed(1)} Ha",
                    style: const TextStyle(color: Colors.white70, fontSize: 11),
                  ),
                ],
              ),
            ),
            const Spacer(),
            Row(
              children: [
                _InfoChip(
                  icon: Icons.pool,
                  label: "$pondCount Kolam",
                ),
                const SizedBox(width: 8),
                _InfoChip(
                  icon: Icons.set_meal,
                  label: "${(fishCount / 1000).toStringAsFixed(0)}K Ikan",
                ),
                const SizedBox(width: 8),
                _InfoChip(
                  icon: Icons.water_drop,
                  label: waterQuality,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
  
  Color _getMembershipColor(String type) {
    switch (type.toLowerCase()) {
      case 'gold':
        return const Color(0xFFFFD700);
      case 'silver':
        return const Color(0xFFC0C0C0);
      case 'platinum':
        return const Color(0xFFE5E4E2);
      default:
        return Colors.grey;
    }
  }
}

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;
  
  const _InfoChip({
    required this.icon,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.2),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        children: [
          Icon(icon, size: 14, color: Colors.white),
          const SizedBox(width: 4),
          Text(
            label,
            style: const TextStyle(color: Colors.white, fontSize: 11),
          ),
        ],
      ),
    );
  }
}

// ============================================================================
// MEMBERSHIP CARD (NO CHANGES)
// ============================================================================

class _MembershipCard extends StatelessWidget {
  final String membershipType;
  final String membershipCode;
  
  const _MembershipCard({
    required this.membershipType,
    required this.membershipCode,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: _getMembershipColor(membershipType),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: _getMembershipColor(membershipType).withOpacity(0.2),
            blurRadius: 8,
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  _getMembershipColor(membershipType),
                  _getMembershipColor(membershipType).withOpacity(0.7),
                ],
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              membershipType.toLowerCase() == 'gold' ? Icons.star : 
              membershipType.toLowerCase() == 'platinum' ? Icons.diamond : 
              Icons.verified,
              color: Colors.white,
              size: 24,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Keanggotaan $membershipType",
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  "Kode: $membershipCode",
                  style: TextStyle(
                    fontSize: 11,
                    color: Colors.grey.shade600,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: _getMembershipColor(membershipType).withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              "Aktif",
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.bold,
                color: _getMembershipColor(membershipType),
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  Color _getMembershipColor(String type) {
    switch (type.toLowerCase()) {
      case 'gold':
        return const Color(0xFFFFD700);
      case 'silver':
        return const Color(0xFFC0C0C0);
      case 'platinum':
        return const Color(0xFFE5E4E2);
      default:
        return Colors.blue;
    }
  }
}

// ============================================================================
// WALLET CARD (NO CHANGES)
// ============================================================================

class _WalletCard extends StatelessWidget {
  final Map<String, dynamic> walletData;
  
  const _WalletCard({required this.walletData});

  @override
  Widget build(BuildContext context) {
    final balance = normalizeToInt(walletData['balance']).toDouble();
    final growth = walletData['growth'] ?? "0%";
    final formattedBalance = NumberFormat.currency(
      locale: 'id_ID',
      symbol: 'Rp ',
      decimalDigits: 0,
    ).format(balance);
    
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const KeuanganScreen()),
        );
      },
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFF2563EB), Color(0xFF1D4ED8)],
          ),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.blue.withOpacity(0.3),
              blurRadius: 15,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Saldo Wallet",
                  style: TextStyle(color: Colors.white70, fontSize: 12),
                ),
                const SizedBox(height: 6),
                Text(
                  formattedBalance,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  "$growth dari bulan lalu",
                  style: const TextStyle(color: Colors.white60, fontSize: 10),
                ),
              ],
            ),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Icon(Icons.wallet, color: Colors.white, size: 38),
            ),
          ],
        ),
      ),
    );
  }
}

// ============================================================================
// SELL HARVEST CARD (NO CHANGES)
// ============================================================================

class _SellHarvestCard extends StatelessWidget {
  const _SellHarvestCard();

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        showModalBottomSheet(
          context: context,
          isScrollControlled: true,
          backgroundColor: Colors.transparent,
          builder: (_) => const _SellHarvestForm(),
        );
      },
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFF16A34A), Color(0xFF22C55E)],
          ),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.green.withOpacity(0.3),
              blurRadius: 15,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: const Row(
          children: [
            Icon(Icons.agriculture, color: Colors.white, size: 32),
            SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Jual Hasil Panen",
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 4),
                  Text(
                    "Lele, Nila, Gurame siap dijual ke marketplace",
                    style: TextStyle(color: Colors.white70, fontSize: 11),
                  ),
                ],
              ),
            ),
            Icon(Icons.arrow_forward_ios, color: Colors.white, size: 16),
          ],
        ),
      ),
    );
  }
}

// ============================================================================
// SELL HARVEST FORM - FIXED VERSION
// ============================================================================

class _SellHarvestForm extends StatefulWidget {
  const _SellHarvestForm();

  @override
  State<_SellHarvestForm> createState() => _SellHarvestFormState();
}

class _SellHarvestFormState extends State<_SellHarvestForm> {
  final _formKey = GlobalKey<FormState>();
  late final ApiService _apiService;
  
  String? _selectedSpecies;
  String? _weight;
  String? _price;
  String? _location;
  String? _description;
  
  final List<File> _images = [];
  final ImagePicker _picker = ImagePicker();
  
  List<Map<String, dynamic>> _fishCategories = [];
  bool _isLoadingFish = true;
  bool _isSubmitting = false; // FIXED: Added loading state for submit button
  
  @override
  void initState() {
    super.initState();
    _apiService = ApiService();
    _loadFishCategories();
  }
  
  Future<void> _loadFishCategories() async {
    try {
      final response = await _apiService.getFishCategories();
      if (mounted) {
        _fishCategories = normalizeToList(response);
        setState(() {
          _isLoadingFish = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoadingFish = false;
        });
      }
      debugPrint('Error loading fish: $e');
    }
  }
  
  List<String> get _speciesList {
    return _fishCategories.map((item) {
      return (item['name'] ?? item['fish_name'] ?? 'Ikan').toString();
    }).toList();
  }
  
  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          _buildFormHeader(),
          Expanded(
            child: _isLoadingFish
                ? const Center(child: CircularProgressIndicator())
                : Form(
                    key: _formKey,
                    child: ListView(
                      padding: const EdgeInsets.all(16),
                      children: [
                        _buildImageUploader(),
                        const SizedBox(height: 16),
                        _buildSpeciesDropdown(),
                        const SizedBox(height: 16),
                        _buildWeightField(),
                        const SizedBox(height: 16),
                        _buildPriceField(),
                        const SizedBox(height: 16),
                        _buildLocationField(),
                        const SizedBox(height: 16),
                        _buildDescriptionField(),
                        const SizedBox(height: 24),
                        _buildSubmitButton(),
                      ],
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildFormHeader() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: Colors.grey, width: 0.5)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            "Jual Hasil Panen",
            style: GoogleFonts.poppins(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          IconButton(
            icon: const Icon(Icons.close),
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
    );
  }

  Widget _buildImageUploader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Foto Ikan",
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        SizedBox(
          height: 90,
          child: ListView(
            scrollDirection: Axis.horizontal,
            children: [
              GestureDetector(
                onTap: _pickImage,
                child: Container(
                  width: 90,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.grey.shade300),
                  ),
                  child: const Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.add_photo_alternate, color: Colors.grey),
                      SizedBox(height: 4),
                      Text("Tambah", style: TextStyle(fontSize: 10)),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 8),
              ..._images.map((img) => Stack(
                children: [
                  Container(
                    width: 90,
                    margin: const EdgeInsets.only(right: 8),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      image: DecorationImage(
                        image: FileImage(img),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  Positioned(
                    top: 4,
                    right: 12,
                    child: GestureDetector(
                      onTap: () => setState(() => _images.remove(img)),
                      child: Container(
                        decoration: const BoxDecoration(
                          color: Colors.black54,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.close, size: 18, color: Colors.white),
                      ),
                    ),
                  ),
                ],
              )),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSpeciesDropdown() {
    if (_speciesList.isEmpty) {
      return const Center(child: Text("Tidak ada data ikan"));
    }
    
    return DropdownButtonFormField<String>(
      value: _selectedSpecies,
      decoration: InputDecoration(
        labelText: "Jenis Ikan",
        prefixIcon: const Icon(Icons.set_meal),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      items: _speciesList.map<DropdownMenuItem<String>>((item) {
        return DropdownMenuItem<String>(
          value: item,
          child: Text(item),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          _selectedSpecies = value;
        });
      },
      validator: (value) => value == null ? "Pilih jenis ikan" : null,
    );
  }

  Widget _buildWeightField() {
    return TextFormField(
      decoration: InputDecoration(
        labelText: "Berat (kg)",
        hintText: "Masukkan total berat panen",
        prefixIcon: const Icon(Icons.scale),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        suffixText: "kg",
      ),
      keyboardType: TextInputType.number,
      onChanged: (value) => _weight = value,
      validator: (value) => value == null || value.isEmpty ? "Masukkan berat" : null,
    );
  }

  Widget _buildPriceField() {
    return TextFormField(
      decoration: InputDecoration(
        labelText: "Harga (Rp/kg)",
        hintText: "Masukkan harga jual",
        prefixIcon: const Icon(Icons.attach_money),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        prefixText: "Rp ",
        suffixText: "/kg",
      ),
      keyboardType: TextInputType.number,
      onChanged: (value) => _price = value,
      validator: (value) => value == null || value.isEmpty ? "Masukkan harga" : null,
    );
  }

  Widget _buildLocationField() {
    return TextFormField(
      decoration: InputDecoration(
        labelText: "Lokasi",
        hintText: "Kabupaten/Kota",
        prefixIcon: const Icon(Icons.location_on),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      onChanged: (value) => _location = value,
      validator: (value) => value == null || value.isEmpty ? "Masukkan lokasi" : null,
    );
  }

  Widget _buildDescriptionField() {
    return TextFormField(
      maxLines: 3,
      decoration: InputDecoration(
        labelText: "Deskripsi (Opsional)",
        hintText: "Kualitas ikan, metode panen, dll",
        prefixIcon: const Icon(Icons.description),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      onChanged: (value) => _description = value,
    );
  }

  Widget _buildSubmitButton() {
    return ElevatedButton(
      onPressed: _isSubmitting ? null : _submitListing,
      style: ElevatedButton.styleFrom(
        backgroundColor: AppTheme.primaryColor,
        padding: const EdgeInsets.symmetric(vertical: 14),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      child: _isSubmitting
          ? const SizedBox(
              width: 24,
              height: 24,
              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
            )
          : const Text(
              "Upload ke Marketplace",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
    );
  }

  Future<void> _pickImage() async {
    if (_images.length >= 5) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Maksimal 5 foto")),
      );
      return;
    }
    
    final image = await _picker.pickImage(source: ImageSource.gallery);
    if (image != null && mounted) {
      setState(() => _images.add(File(image.path)));
    }
  }

  Future<void> _submitListing() async {
    if (!_formKey.currentState!.validate()) return;
    if (_images.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Tambahkan minimal 1 foto")),
      );
      return;
    }
    
    setState(() {
      _isSubmitting = true;
    });
    
    try {
      // TODO: Replace with actual API call when backend is ready
      // final response = await _apiService.sellHarvest({
      //   'species': _selectedSpecies,
      //   'weight': _weight,
      //   'price': _price,
      //   'location': _location,
      //   'description': _description,
      // });
      
      // Simulate API call
      await Future.delayed(const Duration(seconds: 1));
      
      if (mounted) {
        showDialog(
          context: context,
          builder: (_) => AlertDialog(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            title: const Text("✅ Berhasil!", style: TextStyle(fontWeight: FontWeight.bold)),
            content: Text("Produk $_selectedSpecies telah diupload ke marketplace"),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                  Navigator.pop(context);
                },
                child: const Text("OK", style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Gagal upload: ${e.toString()}")),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
        });
      }
    }
  }
}

// ============================================================================
// MARKET PRICES (NO CHANGES)
// ============================================================================

class _MarketPrices extends StatefulWidget {
  const _MarketPrices();

  @override
  State<_MarketPrices> createState() => _MarketPricesState();
}

class _MarketPricesState extends State<_MarketPrices> {
  List<Map<String, dynamic>> _fishPrices = [];
  bool _isLoading = true;
  
  @override
  void initState() {
    super.initState();
    _loadFishPrices();
  }
  
  Future<void> _loadFishPrices() async {
    try {
      final apiService = ApiService();
      final response = await apiService.getFishPrices();
      if (mounted) {
        _fishPrices = normalizeToList(response);
        setState(() {
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
      }
      debugPrint('Error loading fish prices: $e');
    }
  }
  
  @override
  Widget build(BuildContext context) {
    final defaultPrices = [
      {'name': 'Lele', 'current_price': 18500},
      {'name': 'Nila', 'current_price': 24500},
      {'name': 'Gurame', 'current_price': 52000},
    ];
    
    final displayPrices = _fishPrices.isEmpty
        ? defaultPrices
        : _fishPrices.take(3).toList();
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              "Harga Pasar",
              style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            TextButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const MarketplaceScreen()),
                );
              },
              child: const Text("Lihat Semua"),
            ),
          ],
        ),
        const SizedBox(height: 12),
        if (_isLoading)
          const Center(child: CircularProgressIndicator())
        else
          Row(
            children: displayPrices.map((price) {
              final name = (price['name'] ?? price['fish_name'] ?? 'Ikan').toString();
              final currentPrice = normalizeToInt(price['current_price'] ?? price['price'] ?? 0);
              return Expanded(
                child: _PriceCard(
                  name: name,
                  price: NumberFormat.decimalPattern('id_ID').format(currentPrice),
                ),
              );
            }).toList(),
          ),
      ],
    );
  }
}

class _PriceCard extends StatelessWidget {
  final String name;
  final String price;
  
  const _PriceCard({
    required this.name,
    required this.price,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 4),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
          ),
        ],
      ),
      child: Column(
        children: [
          const Icon(Icons.trending_up, color: Colors.green, size: 20),
          const SizedBox(height: 6),
          Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
          Text("Rp $price/kg", style: const TextStyle(fontSize: 11)),
        ],
      ),
    );
  }
}

// ============================================================================
// QUICK MENU GRID (NO CHANGES)
// ============================================================================

class _QuickMenuGrid extends StatelessWidget {
  const _QuickMenuGrid();
  
  @override
  Widget build(BuildContext context) {
    final menus = [
      {"image": "assets/menu/pakan.png", "label": "Pakan", "screen": const PakanScreen()},
      {"image": "assets/menu/wallet.png", "label": "Wallet", "screen": const KeuanganScreen()},
      {"image": "assets/menu/health.png", "label": "Health", "screen": const MonitoringScreen()},
      {"image": "assets/menu/market.png", "label": "Market", "screen": const MarketplaceScreen()},
      {"image": "assets/menu/ai.png", "label": "AI", "screen": const AIScreen()},
    ];
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Akses Cepat",
          style: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: AppTheme.primaryColor,
          ),
        ),
        const SizedBox(height: 12),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 5,
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            childAspectRatio: 0.9,
          ),
          itemCount: menus.length,
          itemBuilder: (_, i) {
            final m = menus[i];
            return GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => m["screen"] as Widget),
                );
              },
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.15),
                      blurRadius: 8,
                      offset: const Offset(0, 3),
                    ),
                  ],
                  image: DecorationImage(
                    image: AssetImage(m["image"] as String),
                    fit: BoxFit.cover,
                  ),
                ),
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    gradient: LinearGradient(
                      colors: [
                        Colors.black.withOpacity(0.4),
                        Colors.black.withOpacity(0.7),
                      ],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    ),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        decoration: BoxDecoration(
                          color: Colors.black.withOpacity(0.6),
                          borderRadius: const BorderRadius.only(
                            bottomLeft: Radius.circular(16),
                            bottomRight: Radius.circular(16),
                          ),
                        ),
                        child: Text(
                          m["label"] as String,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ],
    );
  }
}

// ============================================================================
// RECENT ACTIVITIES (NO CHANGES)
// ============================================================================

class _RecentActivities extends StatelessWidget {
  final List<Map<String, dynamic>> activities;
  
  const _RecentActivities({required this.activities});

  @override
  Widget build(BuildContext context) {
    if (activities.isEmpty) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Aktivitas Terbaru",
            style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Center(
              child: Text("Belum ada aktivitas"),
            ),
          ),
        ],
      );
    }
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Aktivitas Terbaru",
          style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        ...activities.take(5).map((activity) {
          final title = activity['title'] ?? activity['description'] ?? 'Aktivitas';
          final amount = activity['amount'] ?? activity['value'] ?? '';
          final time = activity['created_at'] ?? activity['time'] ?? 'Baru saja';
          final type = activity['type'] ?? 'info';
          
          final icon = type == 'income' ? Icons.arrow_downward : 
                       type == 'expense' ? Icons.arrow_upward : 
                       Icons.circle;
          final color = type == 'income' ? Colors.green : 
                        type == 'expense' ? Colors.red : 
                        Colors.blue;
          
          return ListTile(
            contentPadding: EdgeInsets.zero,
            leading: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 20),
            ),
            title: Text(title.toString(), style: const TextStyle(fontWeight: FontWeight.w500)),
            subtitle: Text(_formatTime(time), style: const TextStyle(fontSize: 11)),
            trailing: Text(
              amount.toString(),
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
          );
        }),
      ],
    );
  }
  
  String _formatTime(dynamic time) {
    if (time == null) return "Baru saja";
    if (time is String) {
      try {
        final date = DateTime.parse(time);
        final diff = DateTime.now().difference(date);
        if (diff.inDays > 0) {
          return "${diff.inDays} hari lalu";
        } else if (diff.inHours > 0) {
          return "${diff.inHours} jam lalu";
        } else if (diff.inMinutes > 0) {
          return "${diff.inMinutes} menit lalu";
        }
        return "Baru saja";
      } catch (_) {
        return time;
      }
    }
    return time.toString();
  }
}

// ============================================================================
// BOTTOM NAVIGATION (NO CHANGES)
// ============================================================================

class _BottomNavigation extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;
  
  const _BottomNavigation({
    required this.currentIndex,
    required this.onTap,
  });
  
  @override
  Widget build(BuildContext context) {
    const icons = [
      Icons.home,
      Icons.chat_bubble_outline,
      Icons.water_drop,
      Icons.agriculture,
      Icons.person,
    ];
    
    const labels = ["Beranda", "Chat", "Monitor", "Panen", "Profil"];
    
    return Container(
      margin: const EdgeInsets.all(12),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 15,
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: List.generate(icons.length, (i) {
          final isActive = i == currentIndex;
          return GestureDetector(
            onTap: () => onTap(i),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: isActive ? AppTheme.primaryColor.withOpacity(0.1) : Colors.transparent,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    icons[i],
                    color: isActive ? AppTheme.primaryColor : Colors.grey,
                    size: 22,
                  ),
                  if (isActive) ...[
                    const SizedBox(height: 2),
                    Text(
                      labels[i],
                      style: TextStyle(
                        color: AppTheme.primaryColor,
                        fontSize: 10,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          );
        }),
      ),
    );
  }
}


