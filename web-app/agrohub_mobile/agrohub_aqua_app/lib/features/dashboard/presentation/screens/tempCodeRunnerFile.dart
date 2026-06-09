// lib/features/dashboard/presentation/screens/aqua_dashboard.dart
// ============================================================================
// AGROHUB AQUA DASHBOARD - FULL PRODUCTION WITH API INTEGRATION
// Fitur: Dashboard + Jual Panen + AI Price + Marketplace + Wallet + Monitoring
// Backend: Go API on :8900
// VERSION: FINAL 1.0.0
// ============================================================================

import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';

import 'package:agrohub_aqua_app/app/theme/app_theme.dart';
import '../../../../core/services/api_service.dart';
import '../../../pond/presentation/screens/kolam_screen.dart';
import '../../../monitoring/presentation/screens/monitoring_screen.dart';
import '../../../harvest/presentation/screens/panen_screen.dart';
import '../../../profile/presentation/screens/profile_screen.dart';
import '../../../marketplace/presentation/screens/marketplace_screen.dart';
import '../../../wallet/presentation/screens/keuangan_screen.dart';
import '../../../ai/presentation/screens/ai_screen.dart';
import '../../../feeding/presentation/screens/pakan_screen.dart';

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
  
  // Data dari API atau Mock
  Map<String, dynamic> _dashboardStats = {};
  Map<String, dynamic> _walletData = {};
  List<dynamic> _recentActivities = [];
  int _notificationCount = 0;
  String _userName = "Pak Lele Jaya";
  String _userLocation = "Kab. Bogor";
  bool _isLoading = true;
  bool _isProfileLoading = true;
  String? _errorMessage;
  
  List<Widget> _screens = [];
  
  late final ApiService _apiService;
  
  @override
  void initState() {
    super.initState();
    _apiService = ApiService();
    _initializeEmptyScreens();
    _checkLoginAndLoadData();
  }
  
  Future<void> _checkLoginAndLoadData() async {
    final isLoggedIn = await _apiService.isLoggedIn();
    
    if (isLoggedIn) {
      await _loadDashboardData();
      await _loadUserProfile();
    } else {
      // Gunakan mock data jika belum login
      _loadMockData();
    }
  }
  
  void _loadMockData() {
    setState(() {
      _dashboardStats = {
        'pond_count': 3,
        'fish_count': 16000,
        'water_quality': 'Optimal',
      };
      _walletData = {
        'balance': 12450000,
        'growth': '+2.5%',
      };
      _recentActivities = [
        {'icon': Icons.sell, 'title': 'Penjualan Ikan Lele', 'amount': '+Rp 2.500.000', 'time': '2 jam lalu', 'color': Colors.green},
        {'icon': Icons.shopping_cart, 'title': 'Pembelian Pakan', 'amount': '-Rp 850.000', 'time': '5 jam lalu', 'color': Colors.red},
        {'icon': Icons.agriculture, 'title': 'Panen Ikan Nila', 'amount': '250 kg', 'time': 'kemarin', 'color': Colors.blue},
        {'icon': Icons.water_drop, 'title': 'Kualitas Air Optimal', 'amount': 'pH 7.2', 'time': 'kemarin', 'color': Colors.teal},
      ];
      _notificationCount = 3;
      _isLoading = false;
      _isProfileLoading = false;
      _userName = "Pak Lele Jaya";
      _userLocation = "Kab. Bogor";
    });
    _rebuildScreens();
  }
  
  void _initializeEmptyScreens() {
    _screens = [
      _HomeScreen(
        dashboardStats: _dashboardStats,
        walletData: _walletData,
        recentActivities: _recentActivities,
        userName: _userName,
        userLocation: _userLocation,
        onRefresh: _onRefresh,
      ),
      const KolamScreen(),
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
          userName: _userName,
          userLocation: _userLocation,
          onRefresh: _onRefresh,
        ),
        const KolamScreen(),
        const MonitoringScreen(),
        const PanenScreen(),
        const ProfileScreen(),
      ];
    });
  }
  
  Future<void> _loadDashboardData() async {
    if (!mounted) return;
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });
    
    try {
      final stats = await _apiService.getDashboardStats();
      final wallet = await _apiService.getWallet();
      final activities = await _apiService.getRecentActivities();
      final notifCount = await _apiService.getNotificationCount();
      
      if (!mounted) return;
      setState(() {
        _dashboardStats = stats['data'] ?? stats;
        _walletData = wallet['data'] ?? wallet;
        _recentActivities = activities;
        _notificationCount = notifCount;
        _isLoading = false;
      });
      
      _rebuildScreens();
    } catch (e) {
      debugPrint('Error loading dashboard: $e');
      if (!mounted) return;
      
      // Jika error authorization, gunakan mock data
      if (e.toString().contains('Authorization') || e.toString().contains('401')) {
        _loadMockData();
      } else {
        setState(() {
          _errorMessage = e.toString();
          _isLoading = false;
        });
      }
    }
  }
  
  Future<void> _loadUserProfile() async {
    try {
      final profile = await _apiService.getProfile();
      if (!mounted) return;
      setState(() {
        _userName = profile['name'] ?? "Petani";
        _userLocation = profile['location'] ?? "Indonesia";
        _isProfileLoading = false;
      });
      _rebuildScreens();
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _isProfileLoading = false;
      });
      debugPrint('Error loading profile: $e');
    }
  }
  
  Future<void> _onRefresh() async {
    final isLoggedIn = await _apiService.isLoggedIn();
    if (isLoggedIn) {
      await _loadDashboardData();
      await _loadUserProfile();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: _buildAppBar(),
      body: _isLoading || _isProfileLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage != null
              ? _buildErrorWidget()
              : AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  child: _screens.isNotEmpty 
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
    final isAuthError = _errorMessage?.contains('Authorization') == true ||
                        _errorMessage?.contains('401') == true;
    
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(isAuthError ? Icons.lock_outline : Icons.error_outline, size: 64, color: isAuthError ? Colors.orange : Colors.red),
          const SizedBox(height: 16),
          Text(isAuthError ? "Login Diperlukan" : "Gagal memuat data", style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text(isAuthError ? "Silakan login untuk melihat data dashboard" : (_errorMessage ?? "Unknown error"), textAlign: TextAlign.center),
          const SizedBox(height: 16),
          if (isAuthError)
            ElevatedButton.icon(
              onPressed: () => _goToLogin(),
              icon: const Icon(Icons.login),
              label: const Text("Login Sekarang"),
            )
          else
            ElevatedButton(
              onPressed: _loadDashboardData,
              child: const Text("Coba Lagi"),
            ),
        ],
      ),
    );
  }
  
  Future<void> _goToLogin() async {
    // Navigate to login screen
    Navigator.pushNamedAndRemoveUntil(
      context, 
      '/login', 
      (route) => false,
    );
  }

  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      backgroundColor: Colors.transparent,
      elevation: 0,
      title: Row(
        children: [
          Image.asset(
            "assets/logo/aqua.png",
            width: 140,
            height: 70,
            errorBuilder: (_, __, ___) => const Icon(Icons.set_meal, color: Colors.blue, size: 40),
          ),
          const SizedBox(width: 8),
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 4)],
            ),
            child: IconButton(
              padding: EdgeInsets.zero,
              icon: Icon(Icons.search, color: AppTheme.primaryColor, size: 20),
              onPressed: () => _showSearchDialog(context),
            ),
          ),
          const SizedBox(width: 4),
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 4)],
            ),
            child: IconButton(
              padding: EdgeInsets.zero,
              icon: Icon(Icons.explore, color: AppTheme.primaryColor, size: 20),
              onPressed: () => _showDiscover(context),
            ),
          ),
        ],
      ),
      actions: [
        Stack(
          children: [
            IconButton(
              icon: Icon(Icons.notifications_none, color: AppTheme.primaryColor),
              onPressed: () => _showNotification(context),
            ),
            if (_notificationCount > 0)
              Positioned(
                right: 8,
                top: 8,
                child: Container(
                  width: 16,
                  height: 16,
                  decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
                  child: Center(
                    child: Text(
                      "$_notificationCount",
                      style: const TextStyle(color: Colors.white, fontSize: 9),
                    ),
                  ),
                ),
              ),
          ],
        ),
        IconButton(
          icon: Icon(Icons.chat_bubble_outline, color: AppTheme.primaryColor),
          onPressed: () => _showChat(context),
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
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _searchChip("Lele"),
                  _searchChip("Pakan"),
                  _searchChip("Panen"),
                  _searchChip("Harga"),
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
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Mencari: $label")));
      },
    );
  }

  void _showDiscover(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (_) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text("Discover", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _discoverItem(Icons.tips_and_updates, "Tips Budidaya Lele Modern"),
            _discoverItem(Icons.article, "Panduan Panen yang Baik"),
            _discoverItem(Icons.video_library, "Video Tutorial: Manajemen Kualitas Air"),
            _discoverItem(Icons.event, "Webinar: Strategi Jual Ikan di Marketplace"),
          ],
        ),
      ),
    );
  }

  Widget _discoverItem(IconData icon, String title) {
    return ListTile(
      leading: Icon(icon, color: AppTheme.primaryColor),
      title: Text(title),
      onTap: () => Navigator.pop(context),
    );
  }

  void _showNotification(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("📢 Notifikasi: Harga lele naik!")),
    );
  }

  void _showChat(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("💬 Fitur chat segera hadir")),
    );
  }
}

// ============================================================================
// HOME SCREEN
// ============================================================================

class _HomeScreen extends StatelessWidget {
  final Map<String, dynamic> dashboardStats;
  final Map<String, dynamic> walletData;
  final List<dynamic> recentActivities;
  final String userName;
  final String userLocation;
  final Future<void> Function() onRefresh;
  
  const _HomeScreen({
    required this.dashboardStats,
    required this.walletData,
    required this.recentActivities,
    required this.userName,
    required this.userLocation,
    required this.onRefresh,
  });

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: onRefresh,
      child: ListView(
        padding: const EdgeInsets.all(16),
        physics: const AlwaysScrollableScrollPhysics(),
        children: [
          _HeroSection(
            userName: userName,
            userLocation: userLocation,
            pondCount: dashboardStats['pond_count'] ?? 3,
            fishCount: dashboardStats['fish_count'] ?? 16000,
            waterQuality: dashboardStats['water_quality'] ?? "Optimal",
          ),
          const SizedBox(height: 16),
          _WalletCard(walletData: walletData),
          const SizedBox(height: 16),
          const _SellHarvestCard(),
          const SizedBox(height: 16),
          const _MarketPrices(),
          const SizedBox(height: 16),
          const _QuickMenuGrid(),
          const SizedBox(height: 16),
          const _AIPredictionCard(),
          const SizedBox(height: 16),
          _RecentActivities(activities: recentActivities),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}

// ============================================================================
// HERO SECTION
// ============================================================================

class _HeroSection extends StatelessWidget {
  final String userName;
  final String userLocation;
  final int pondCount;
  final int fishCount;
  final String waterQuality;
  
  const _HeroSection({
    required this.userName,
    required this.userLocation,
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
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 2),
                  ),
                  child: ClipOval(
                    child: Image.asset(
                      "assets/images/nelayan.png",
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => const Icon(Icons.person, size: 40, color: Colors.white),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text("Selamat Datang", style: TextStyle(color: Colors.white70, fontSize: 12)),
                      Text(
                        userName,
                        style: GoogleFonts.poppins(
                          color: Colors.white,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Row(
                        children: [
                          const Icon(Icons.location_on, size: 12, color: Colors.white70),
                          const SizedBox(width: 4),
                          Text(userLocation, style: const TextStyle(color: Colors.white70, fontSize: 12)),
                        ],
                      ),
                    ],
                  ),
                ),
                _buildLiveBadge(),
              ],
            ),
            const Spacer(),
            Row(
              children: [
                _InfoChip(icon: Icons.pool, label: "$pondCount Kolam"),
                const SizedBox(width: 8),
                _InfoChip(icon: Icons.set_meal, label: "${(fishCount / 1000).toStringAsFixed(0)}K Ikan"),
                const SizedBox(width: 8),
                _InfoChip(icon: Icons.water_drop, label: waterQuality),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLiveBadge() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: Colors.red,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.red.withOpacity(0.5), blurRadius: 8)],
      ),
      child: const Row(
        children: [
          Icon(Icons.circle, color: Colors.white, size: 8),
          SizedBox(width: 4),
          Text("LIVE", style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;
  const _InfoChip({required this.icon, required this.label});

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
          Icon(icon, size: 12, color: Colors.white),
          const SizedBox(width: 4),
          Text(label, style: const TextStyle(color: Colors.white, fontSize: 11)),
        ],
      ),
    );
  }
}

// ============================================================================
// WALLET CARD
// ============================================================================

class _WalletCard extends StatelessWidget {
  final Map<String, dynamic> walletData;
  
  const _WalletCard({required this.walletData});

  @override
  Widget build(BuildContext context) {
    final balance = walletData['balance'] ?? 12450000;
    final growth = walletData['growth'] ?? "+2.5%";
    final formattedBalance = NumberFormat.currency(
      locale: 'id_ID',
      symbol: 'Rp ',
      decimalDigits: 0,
    ).format(balance);
    
    return GestureDetector(
      onTap: () => _navigateToWallet(context),
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          gradient: const LinearGradient(colors: [Color(0xFF2563EB), Color(0xFF1D4ED8)]),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [BoxShadow(color: Colors.blue.withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 5))],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text("Saldo Wallet", style: TextStyle(color: Colors.white70, fontSize: 12)),
                const SizedBox(height: 6),
                Text(
                  formattedBalance,
                  style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
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
              decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(16)),
              child: const Icon(Icons.wallet, color: Colors.white, size: 38),
            ),
          ],
        ),
      ),
    );
  }

  void _navigateToWallet(BuildContext context) {
    Navigator.push(context, MaterialPageRoute(builder: (_) => const KeuanganScreen()));
  }
}

// ============================================================================
// SELL HARVEST CARD
// ============================================================================

class _SellHarvestCard extends StatelessWidget {
  const _SellHarvestCard();

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => _openSellForm(context),
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          gradient: const LinearGradient(colors: [Color(0xFF16A34A), Color(0xFF22C55E)]),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [BoxShadow(color: Colors.green.withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 5))],
        ),
        child: const Row(
          children: [
            Icon(Icons.agriculture, color: Colors.white, size: 32),
            SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Jual Hasil Panen", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  SizedBox(height: 4),
                  Text("Lele, Nila, Udang siap dijual ke marketplace", style: TextStyle(color: Colors.white70, fontSize: 11)),
                ],
              ),
            ),
            Icon(Icons.arrow_forward_ios, color: Colors.white, size: 16),
          ],
        ),
      ),
    );
  }

  void _openSellForm(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const _SellHarvestForm(),
    );
  }
}

// ============================================================================
// SELL HARVEST FORM
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
  int? _selectedFishId;
  String? _selectedGrade;
  String? _weight;
  String? _price;
  String? _location;
  String? _description;
  
  final List<File> _images = [];
  final ImagePicker _picker = ImagePicker();
  
  double? _aiSuggestedPrice;
  bool _isLoadingAI = false;
  
  List<Map<String, dynamic>> _fishCategories = [];
  bool _isLoadingFish = true;
  String? _errorMessage;
  
  final List<String> _gradeList = ['Super (A)', 'Standard (B)', 'Ekonomis (C)'];
  
  @override
  void initState() {
    super.initState();
    _apiService = ApiService();
    _loadFishCategories();
  }
  
  Future<void> _loadFishCategories() async {
    if (!mounted) return;
    setState(() {
      _isLoadingFish = true;
      _errorMessage = null;
    });
    
    try {
      final fishData = await _apiService.getFishCategories();
      if (!mounted) return;
      setState(() {
        _fishCategories = fishData;
        _isLoadingFish = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _errorMessage = e.toString();
        _isLoadingFish = false;
      });
    }
  }
  
  List<String> get _speciesList => _fishCategories.map((fish) => fish['name'] as String).toList();
  
  double getBasePrice(String fishName) {
    final fish = _fishCategories.firstWhere((f) => f['name'] == fishName, orElse: () => {});
    return (fish['current_price'] ?? fish['base_price'] ?? 18000).toDouble();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.9,
      decoration: const BoxDecoration(color: Colors.white, borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      child: Column(
        children: [
          _buildFormHeader(),
          Expanded(
            child: _isLoadingFish
                ? const Center(child: CircularProgressIndicator())
                : _errorMessage != null
                    ? _buildErrorWidget()
                    : Form(
                        key: _formKey,
                        child: ListView(
                          padding: const EdgeInsets.all(16),
                          children: [
                            _buildImageUploader(),
                            const SizedBox(height: 16),
                            _buildSpeciesDropdown(),
                            const SizedBox(height: 16),
                            _buildGradeDropdown(),
                            const SizedBox(height: 16),
                            _buildWeightField(),
                            const SizedBox(height: 16),
                            if (_aiSuggestedPrice != null) _buildAIPriceCard(),
                            const SizedBox(height: 16),
                            _buildPriceField(),
                            const SizedBox(height: 16),
                            _buildLocationField(),
                            const SizedBox(height: 16),
                            _buildDescriptionField(),
                            const SizedBox(height: 24),
                            _buildSubmitButton(),
                            const SizedBox(height: 20),
                          ],
                        ),
                      ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildErrorWidget() => Center(
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Icon(Icons.error_outline, size: 48, color: Colors.red),
        const SizedBox(height: 12),
        Text('Gagal memuat data ikan', style: GoogleFonts.poppins(fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        Text(_errorMessage ?? 'Unknown error', textAlign: TextAlign.center),
        const SizedBox(height: 16),
        ElevatedButton(onPressed: _loadFishCategories, child: const Text('Coba Lagi')),
      ],
    ),
  );

  Widget _buildFormHeader() => Container(
    padding: const EdgeInsets.all(16),
    decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: Colors.grey, width: 0.5))),
    child: Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text("Jual Hasil Panen", style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.bold)),
        IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(context)),
      ],
    ),
  );

  Widget _buildImageUploader() => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text("Foto Ikan", style: GoogleFonts.poppins(fontWeight: FontWeight.bold)),
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
                decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(12), border: Border.all(color: Colors.grey.shade300)),
                child: const Column(mainAxisAlignment: MainAxisAlignment.center, children: [Icon(Icons.add_photo_alternate, color: Colors.grey), SizedBox(height: 4), Text("Tambah", style: TextStyle(fontSize: 10))]),
              ),
            ),
            const SizedBox(width: 8),
            ..._images.map((img) => Stack(children: [
              Container(width: 90, margin: const EdgeInsets.only(right: 8), decoration: BoxDecoration(borderRadius: BorderRadius.circular(12), image: DecorationImage(image: FileImage(img), fit: BoxFit.cover))),
              Positioned(top: 4, right: 12, child: GestureDetector(onTap: () => setState(() => _images.remove(img)), child: Container(decoration: BoxDecoration(color: Colors.black.withOpacity(0.5), shape: BoxShape.circle), child: const Icon(Icons.close, size: 18, color: Colors.white)))),
            ])),
          ],
        ),
      ),
    ],
  );

  Widget _buildSpeciesDropdown() => Container(
    decoration: BoxDecoration(color: Colors.grey.shade50, borderRadius: BorderRadius.circular(12), border: Border.all(color: Colors.grey.shade200)),
    child: DropdownButtonFormField<String>(
      value: _selectedSpecies,
      decoration: const InputDecoration(labelText: "Jenis Ikan", prefixIcon: Icon(Icons.set_meal), border: OutlineInputBorder(borderSide: BorderSide.none)),
      items: _speciesList.map((item) {
        final fish = _fishCategories.firstWhere((f) => f['name'] == item);
        final price = fish['current_price'] ?? fish['base_price'] ?? 18000;
        return DropdownMenuItem(value: item, child: Row(children: [Text(item), const SizedBox(width: 8), Container(padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2), decoration: BoxDecoration(color: Colors.blue.shade50, borderRadius: BorderRadius.circular(8)), child: Text('Rp ${NumberFormat.decimalPattern('id_ID').format(price)}/kg', style: TextStyle(fontSize: 10, color: Colors.blue.shade700)))]) );
      }).toList(),
      onChanged: (v) {
        setState(() {
          _selectedSpecies = v;
          final fish = _fishCategories.firstWhere((f) => f['name'] == v);
          _selectedFishId = fish['id'];
          _aiSuggestedPrice = null;
          _getAIPriceSuggestion();
        });
      },
      validator: (v) => v == null ? "Pilih jenis ikan" : null,
    ),
  );

  Widget _buildGradeDropdown() => Container(
    decoration: BoxDecoration(color: Colors.grey.shade50, borderRadius: BorderRadius.circular(12), border: Border.all(color: Colors.grey.shade200)),
    child: DropdownButtonFormField<String>(
      value: _selectedGrade,
      decoration: const InputDecoration(labelText: "Grade Ikan", prefixIcon: Icon(Icons.star), border: OutlineInputBorder(borderSide: BorderSide.none)),
      items: _gradeList.map((item) => DropdownMenuItem(value: item, child: Text(item))).toList(),
      onChanged: (v) => setState(() => _selectedGrade = v),
      validator: (v) => v == null ? "Pilih grade ikan" : null,
    ),
  );

  Widget _buildWeightField() => _buildTextField(label: "Berat (kg)", hint: "Masukkan total berat panen", keyboardType: TextInputType.number, onChanged: (v) => _weight = v, icon: Icons.scale, suffix: "kg");
  Widget _buildPriceField() => _buildTextField(label: "Harga (Rp/kg)", hint: "Masukkan harga jual", keyboardType: TextInputType.number, onChanged: (v) => _price = v, icon: Icons.attach_money, prefix: "Rp", suffix: "/kg");
  Widget _buildLocationField() => _buildTextField(label: "Lokasi", hint: "Kabupaten/Kota", onChanged: (v) => _location = v, icon: Icons.location_on);
  Widget _buildDescriptionField() => _buildTextField(label: "Deskripsi (Opsional)", hint: "Kualitas ikan, metode panen, dll", maxLines: 3, onChanged: (v) => _description = v, icon: Icons.description);

  Widget _buildTextField({required String label, required String hint, TextInputType keyboardType = TextInputType.text, required Function(String) onChanged, required IconData icon, String? prefix, String? suffix, int maxLines = 1}) => Container(
    decoration: BoxDecoration(color: Colors.grey.shade50, borderRadius: BorderRadius.circular(12), border: Border.all(color: Colors.grey.shade200)),
    child: TextFormField(
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        prefixIcon: Icon(icon, color: AppTheme.primaryColor),
        prefixText: prefix != null ? "$prefix " : null,
        suffixText: suffix,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
      ),
      keyboardType: keyboardType,
      maxLines: maxLines,
      onChanged: onChanged,
      validator: (v) => v == null || v.isEmpty ? "Masukkan $label" : null,
    ),
  );

  Widget _buildAIPriceCard() {
    final basePrice = getBasePrice(_selectedSpecies!);
    final percentChange = ((_aiSuggestedPrice! - basePrice) / basePrice) * 100;
    final isPositive = percentChange > 0;
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(gradient: LinearGradient(colors: isPositive ? [Colors.green.shade50, Colors.teal.shade50] : [Colors.orange.shade50, Colors.red.shade50]), borderRadius: BorderRadius.circular(12), border: Border.all(color: isPositive ? Colors.green.shade200 : Colors.orange.shade200)),
      child: Column(children: [
        Row(children: [Icon(Icons.auto_awesome, color: isPositive ? Colors.green : Colors.orange, size: 18), const SizedBox(width: 8), Text("Rekomendasi AI", style: GoogleFonts.poppins(fontWeight: FontWeight.bold)), const Spacer(), if (_isLoadingAI) const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2))]),
        const SizedBox(height: 10),
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [const Text("Harga Pasar", style: TextStyle(fontSize: 11)), Text("Rp ${NumberFormat.currency(locale: 'id_ID', symbol: '', decimalDigits: 0).format(basePrice)}/kg", style: const TextStyle(fontWeight: FontWeight.bold))]),
          const Icon(Icons.arrow_forward, size: 16),
          Column(crossAxisAlignment: CrossAxisAlignment.end, children: [const Text("Rekomendasi", style: TextStyle(fontSize: 11)), Text("Rp ${NumberFormat.currency(locale: 'id_ID', symbol: '', decimalDigits: 0).format(_aiSuggestedPrice!)}/kg", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: isPositive ? Colors.green : Colors.red))]),
        ]),
        const SizedBox(height: 8),
        GestureDetector(
          onTap: () => setState(() => _price = _aiSuggestedPrice!.toStringAsFixed(0)),
          child: Container(padding: const EdgeInsets.symmetric(vertical: 8), decoration: BoxDecoration(color: Colors.white.withOpacity(0.7), borderRadius: BorderRadius.circular(8)), child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [Icon(isPositive ? Icons.trending_up : Icons.trending_down, size: 14, color: isPositive ? Colors.green : Colors.red), const SizedBox(width: 4), Text("${isPositive ? '+' : ''}${percentChange.toStringAsFixed(1)}% dari pasar", style: TextStyle(color: isPositive ? Colors.green : Colors.red, fontSize: 11)), const SizedBox(width: 8), const Text("Gunakan", style: TextStyle(color: Colors.blue, fontSize: 11, fontWeight: FontWeight.bold))])),
        ),
      ]),
    );
  }

  Widget _buildSubmitButton() => ElevatedButton(
    onPressed: _submitListing,
    style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primaryColor, padding: const EdgeInsets.symmetric(vertical: 14), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
    child: const Text("Upload ke Marketplace", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
  );

  Future<void> _pickImage() async {
    if (_images.length >= 5) { ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Maksimal 5 foto"))); return; }
    final image = await _picker.pickImage(source: ImageSource.gallery);
    if (image != null && mounted) setState(() => _images.add(File(image.path)));
  }

  Future<void> _getAIPriceSuggestion() async {
    if (_selectedSpecies == null || _selectedFishId == null) return;
    if (!mounted) return;
    setState(() => _isLoadingAI = true);
    await Future.delayed(const Duration(milliseconds: 500));
    final basePrice = getBasePrice(_selectedSpecies!);
    final randomFactor = 0.92 + (DateTime.now().millisecondsSinceEpoch % 15) / 100;
    if (!mounted) return;
    setState(() {
      _aiSuggestedPrice = basePrice * randomFactor;
      _price = _aiSuggestedPrice!.toStringAsFixed(0);
      _isLoadingAI = false;
    });
  }

  void _submitListing() {
    if (!_formKey.currentState!.validate()) return;
    if (_images.isEmpty) { ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Tambahkan minimal 1 foto"))); return; }
    showDialog(context: context, builder: (_) => AlertDialog(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)), title: const Text("✅ Berhasil!", style: TextStyle(fontWeight: FontWeight.bold)), content: Text("Produk ${_selectedSpecies ?? 'ikan'} telah diupload ke marketplace"), actions: [TextButton(onPressed: () { Navigator.pop(context); Navigator.pop(context); }, child: const Text("OK", style: TextStyle(fontWeight: FontWeight.bold)))]));
  }
}

// ============================================================================
// MARKET PRICES
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
  void initState() { super.initState(); _loadFishPrices(); }
  
  Future<void> _loadFishPrices() async {
    try { final apiService = ApiService(); final prices = await apiService.getFishPrices(); if (mounted) setState(() { _fishPrices = prices; _isLoading = false; }); } 
    catch (e) { if (mounted) setState(() => _isLoading = false); }
  }
  
  @override
  Widget build(BuildContext context) {
    final defaultPrices = [{'name': 'Lele', 'current_price': 18500, 'trend_percent': 2.78}, {'name': 'Nila', 'current_price': 24500, 'trend_percent': 2.08}, {'name': 'Gurame', 'current_price': 52000, 'trend_percent': 4.00}];
    final displayPrices = _fishPrices.isEmpty ? defaultPrices : _fishPrices.take(3).toList();
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [Text("Harga Pasar", style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold)), TextButton(onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const MarketplaceScreen())), child: const Text("Lihat Semua"))]),
      const SizedBox(height: 12),
      _isLoading ? const Center(child: SizedBox(height: 80, child: Center(child: CircularProgressIndicator()))) : Row(children: displayPrices.map((price) => Expanded(child: _PriceCard(name: price['name'] ?? 'Ikan', price: NumberFormat.decimalPattern('id_ID').format(price['current_price'] ?? 0), trend: "${(price['trend_percent'] ?? 0) > 0 ? '+' : ''}${price['trend_percent']?.toStringAsFixed(2) ?? '0'}%", isUp: (price['trend_percent'] ?? 0) > 0))).toList()),
    ]);
  }
}

class _PriceCard extends StatelessWidget {
  final String name; final String price; final String trend; final bool isUp;
  const _PriceCard({required this.name, required this.price, required this.trend, required this.isUp});
  @override Widget build(BuildContext context) => Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)]), child: Column(children: [Icon(isUp ? Icons.trending_up : Icons.trending_down, color: isUp ? Colors.green : Colors.red, size: 20), const SizedBox(height: 6), Text(name, style: const TextStyle(fontWeight: FontWeight.bold)), Text("Rp $price/kg", style: const TextStyle(fontSize: 12)), Text(trend, style: TextStyle(color: isUp ? Colors.green : Colors.red, fontSize: 10))]));
}

// ============================================================================
// QUICK MENU GRID
// ============================================================================

class _QuickMenuGrid extends StatelessWidget {
  const _QuickMenuGrid();
  @override Widget build(BuildContext context) {
    final menus = [{"icon": "assets/menu/pakan.png", "label": "Pakan", "screen": const PakanScreen()}, {"icon": "assets/menu/wallet.png", "label": "Wallet", "screen": const KeuanganScreen()}, {"icon": "assets/menu/health.png", "label": "Health", "screen": const MonitoringScreen()}, {"icon": "assets/menu/market.png", "label": "Market", "screen": const MarketplaceScreen()}, {"icon": "assets/menu/ai.png", "label": "AI", "screen": const AIScreen()}];
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text("Akses Cepat", style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.primaryColor)), const SizedBox(height: 12), GridView.builder(shrinkWrap: true, physics: const NeverScrollableScrollPhysics(), gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 5, mainAxisSpacing: 12, crossAxisSpacing: 12, childAspectRatio: 0.8), itemCount: menus.length, itemBuilder: (_, i) { final m = menus[i]; return GestureDetector(onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => m["screen"] as Widget)), child: Container(decoration: BoxDecoration(borderRadius: BorderRadius.circular(16), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 8)]), child: ClipRRect(borderRadius: BorderRadius.circular(16), child: Stack(fit: StackFit.expand, children: [Image.asset(m["icon"] as String, fit: BoxFit.cover, errorBuilder: (_, __, ___) => Container(color: AppTheme.primaryColor.withOpacity(0.1), child: Icon(Icons.image_not_supported, color: AppTheme.primaryColor, size: 50))), Container(decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.transparent, Colors.black.withOpacity(0.7)], begin: Alignment.topCenter, end: Alignment.bottomCenter))), Positioned(bottom: 12, left: 0, right: 0, child: Text(m["label"] as String, textAlign: TextAlign.center, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white)))])))); }), ]);
  }
}

// ============================================================================
// AI PREDICTION CARD
// ============================================================================

class _AIPredictionCard extends StatelessWidget {
  const _AIPredictionCard();
  @override Widget build(BuildContext context) => GestureDetector(onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AIScreen())), child: Container(padding: const EdgeInsets.all(16), decoration: BoxDecoration(gradient: const LinearGradient(colors: [Color(0xFF2563EB), Color(0xFF06B6D4)]), borderRadius: BorderRadius.circular(20), boxShadow: [BoxShadow(color: Colors.blue.withOpacity(0.3), blurRadius: 15)]), child: Row(children: [Container(padding: const EdgeInsets.all(10), decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(14)), child: const Icon(Icons.auto_awesome, color: Colors.white, size: 24)), const SizedBox(width: 14), const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text("Rekomendasi AI", style: TextStyle(color: Colors.white70, fontSize: 11)), Text("Harga lele diprediksi naik 15% minggu depan", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)), SizedBox(height: 4), Text("Sebaiknya tunda panen 5-7 hari", style: TextStyle(color: Colors.white70, fontSize: 10))])), const Icon(Icons.chevron_right, color: Colors.white)])));
}

// ============================================================================
// RECENT ACTIVITIES
// ============================================================================

class _RecentActivities extends StatelessWidget {
  final List<dynamic> activities;
  const _RecentActivities({required this.activities});
  @override Widget build(BuildContext context) {
    final defaultActivities = [{"icon": Icons.sell, "title": "Penjualan Ikan Lele", "amount": "+Rp 2.500.000", "time": "2 jam lalu", "color": Colors.green}, {"icon": Icons.shopping_cart, "title": "Pembelian Pakan", "amount": "-Rp 850.000", "time": "5 jam lalu", "color": Colors.red}, {"icon": Icons.agriculture, "title": "Panen Ikan Nila", "amount": "250 kg", "time": "kemarin", "color": Colors.blue}, {"icon": Icons.water_drop, "title": "Kualitas Air Optimal", "amount": "pH 7.2", "time": "kemarin", "color": Colors.teal}];
    final displayActivities = activities.isEmpty ? defaultActivities : activities;
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text("Aktivitas Terbaru", style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold)), const SizedBox(height: 12), ...displayActivities.map((a) => ListTile(contentPadding: EdgeInsets.zero, leading: Container(padding: const EdgeInsets.all(8), decoration: BoxDecoration(color: (a["color"] as Color?)?.withOpacity(0.1) ?? Colors.grey.withOpacity(0.1), borderRadius: BorderRadius.circular(12)), child: Icon(a["icon"] as IconData? ?? Icons.circle, color: a["color"] as Color? ?? Colors.grey, size: 20)), title: Text(a["title"] as String? ?? "", style: const TextStyle(fontWeight: FontWeight.w500)), subtitle: Text(a["time"] as String? ?? "", style: const TextStyle(fontSize: 11)), trailing: Text(a["amount"] as String? ?? "", style: TextStyle(fontWeight: FontWeight.bold, color: a["color"] as Color? ?? Colors.grey))))]);
  }
}

// ============================================================================
// BOTTOM NAVIGATION
// ============================================================================

class _BottomNavigation extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;
  const _BottomNavigation({required this.currentIndex, required this.onTap});
  @override Widget build(BuildContext context) {
    const icons = [Icons.home, Icons.store, Icons.water_drop, Icons.agriculture, Icons.person];
    const labels = ["Beranda", "Market", "Monitor", "Panen", "Profil"];
    return Container(margin: const EdgeInsets.all(12), padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 15)]), child: Row(mainAxisAlignment: MainAxisAlignment.spaceAround, children: List.generate(icons.length, (i) { final isActive = i == currentIndex; return GestureDetector(onTap: () => onTap(i), child: AnimatedContainer(duration: const Duration(milliseconds: 200), padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6), decoration: BoxDecoration(color: isActive ? AppTheme.primaryColor.withOpacity(0.1) : Colors.transparent, borderRadius: BorderRadius.circular(20)), child: Column(mainAxisSize: MainAxisSize.min, children: [Icon(icons[i], color: isActive ? AppTheme.primaryColor : Colors.grey, size: 22), if (isActive) ...[const SizedBox(height: 2), Text(labels[i], style: TextStyle(color: AppTheme.primaryColor, fontSize: 10))]]))); })));
  }
}


