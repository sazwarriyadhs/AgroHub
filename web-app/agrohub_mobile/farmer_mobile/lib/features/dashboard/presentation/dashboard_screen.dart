// lib/features/dashboard/presentation/dashboard_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../blocs/dashboard_bloc.dart';
import 'dashboard_header.dart';
import 'dashboard_hero_banner.dart';
import 'quick_actions_section.dart';
import 'farmer_bottom_navigation.dart';
import '../widgets/stats/stats_grid.dart';
import '../../market/presentation/widgets/market_section.dart';
import '../../crops/presentation/widgets/crops_section.dart';
import '../models/dashboard_stats.dart';
import '../../sell/models/commodity_type.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> with AutomaticKeepAliveClientMixin {
  int currentIndex = 0;

  // ✅ Cache data agar tidak parsing ulang di setiap frame build
  DashboardStats? _cachedStats;
  List<Map<String, dynamic>>? _cachedMarketPrices;
  List<CommodityType>? _cachedCrops;
  dynamic _lastStatsData;
  dynamic _lastMarketData;
  dynamic _lastCropsData;

  @override
  bool get wantKeepAlive => true; // ✅ Keep state when tab is changed

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  void _fetchData() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        context.read<DashboardBloc>().add(FetchDashboardData());
      }
    });
  }

  Future<void> _refresh() async {
    if (mounted) {
      // ✅ Clear cache on refresh
      _cachedStats = null;
      _cachedMarketPrices = null;
      _cachedCrops = null;
      _lastStatsData = null;
      _lastMarketData = null;
      _lastCropsData = null;
      context.read<DashboardBloc>().add(FetchDashboardData());
    }
  }

  // ================= PARSING HELPERS WITH CACHING =================
  
  DashboardStats _parseStats(dynamic data) {
    if (data == _lastStatsData && _cachedStats != null) return _cachedStats!;
    _lastStatsData = data;
    
    if (data is DashboardStats) {
      _cachedStats = data;
    } else if (data is Map<String, dynamic>) {
      _cachedStats = DashboardStats(
        totalRevenue: _toDouble(data['totalRevenue'] ?? data['total_revenue']),
        totalOrders: _toInt(data['totalOrders'] ?? data['total_orders']),
        totalProducts: _toInt(data['totalProducts'] ?? data['total_products']),
        avgRating: _toDouble(data['avgRating'] ?? data['avg_rating']),
      );
    } else {
      _cachedStats = DashboardStats(
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        avgRating: 0,
      );
    }
    return _cachedStats!;
  }

  List<Map<String, dynamic>> _parseMarketPrices(dynamic data) {
    if (data == _lastMarketData && _cachedMarketPrices != null) return _cachedMarketPrices!;
    _lastMarketData = data;

    if (data is List) {
      _cachedMarketPrices = data.map((e) {
        if (e is Map<String, dynamic>) return e;
        if (e is Map) return Map<String, dynamic>.from(e);
        return <String, dynamic>{};
      }).toList();
    } else {
      _cachedMarketPrices = [];
    }
    return _cachedMarketPrices!;
  }

  List<CommodityType> _parseCrops(dynamic data) {
    if (data == _lastCropsData && _cachedCrops != null) return _cachedCrops!;
    _lastCropsData = data;

    if (data is List) {
      _cachedCrops = data.map((e) {
        if (e is CommodityType) return e;
        if (e is Map<String, dynamic>) return CommodityType.fromJson(e);
        if (e is Map) return CommodityType.fromJson(Map<String, dynamic>.from(e));
        return CommodityType(
          id: 0,
          name: '',
          categoryId: 0,
          basePrice: 0,
          unit: 'kg',
        );
      }).toList();
    } else {
      _cachedCrops = [];
    }
    return _cachedCrops!;
  }

  double _toDouble(dynamic value) {
    if (value == null) return 0.0;
    if (value is double) return value;
    if (value is int) return value.toDouble();
    if (value is String) return double.tryParse(value) ?? 0.0;
    return 0.0;
  }

  int _toInt(dynamic value) {
    if (value == null) return 0;
    if (value is int) return value;
    if (value is double) return value.toInt();
    if (value is String) return int.tryParse(value) ?? 0;
    return 0;
  }

  // ================= NAVIGATION HELPERS =================
  
  void _onNavigationTap(int index) {
    setState(() {
      currentIndex = index;
    });

    // ✅ Using pushReplacementNamed to prevent stack buildup
    switch (index) {
      case 0:
        // Already on dashboard
        break;
      case 1:
        Navigator.pushReplacementNamed(context, "/market");
        break;
      case 2:
        Navigator.pushReplacementNamed(context, "/sell");
        break;
      case 3:
        Navigator.pushReplacementNamed(context, "/notifications");
        break;
      case 4:
        Navigator.pushReplacementNamed(context, "/profile");
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    super.build(context); // ✅ Required for AutomaticKeepAliveClientMixin
    
    return Scaffold(
      backgroundColor: const Color(0xFF1B8F3E),
      body: AnnotatedRegion<SystemUiOverlayStyle>(
        value: SystemUiOverlayStyle.light.copyWith(
          statusBarColor: Colors.transparent,
          statusBarIconBrightness: Brightness.light,
        ),
        child: SafeArea(
          top: false,
          child: BlocBuilder<DashboardBloc, DashboardState>(
            builder: (context, state) {
              if (state is DashboardLoading) {
                return _loadingState();
              }

              if (state is DashboardError) {
                return _errorState(state.message);
              }

              if (state is! DashboardLoaded) {
                return const SizedBox.shrink();
              }

              final stats = _parseStats(state.stats);
              final marketPrices = _parseMarketPrices(state.marketPrices);
              final crops = _parseCrops(state.crops);

              return RefreshIndicator(
                onRefresh: _refresh,
                color: const Color(0xFF1B8F3E),
                backgroundColor: Colors.white,
                edgeOffset: 80,
                child: CustomScrollView(
                  physics: const AlwaysScrollableScrollPhysics(
                    parent: BouncingScrollPhysics(),
                  ),
                  slivers: [
                    /// 🟢 TOP AREA (GREEN BACKGROUND)
                    SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.only(top: 60, bottom: 24),
                        child: Column(
                          children: [
                            const DashboardHeader(),
                            const SizedBox(height: 20),
                            const Padding(
                              padding: EdgeInsets.symmetric(horizontal: 18),
                              child: DashboardHeroBanner(),
                            ),
                            const SizedBox(height: 20),
                            const Padding(
                              padding: EdgeInsets.symmetric(horizontal: 18),
                              child: QuickActionsSection(),
                            ),
                          ],
                        ),
                      ),
                    ),

                    /// ⚪ WHITE CONTENT AREA
                    SliverToBoxAdapter(
                      child: Container(
                        decoration: BoxDecoration(
                          color: const Color(0xFFF5F7FA),
                          borderRadius: const BorderRadius.only(
                            topLeft: Radius.circular(30),
                            topRight: Radius.circular(30),
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.05),
                              blurRadius: 10,
                              offset: const Offset(0, -5),
                            ),
                          ],
                        ),
                        child: Padding(
                          padding: const EdgeInsets.fromLTRB(20, 24, 20, 100),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              _sectionTitle("Statistik Farm", Icons.analytics),
                              const SizedBox(height: 16),
                              StatsGrid(stats: stats),
                              
                              const SizedBox(height: 32),
                              _sectionTitle("Harga Pasar", Icons.trending_up),
                              const SizedBox(height: 16),
                              MarketSection(prices: marketPrices),
                              
                              const SizedBox(height: 32),
                              _sectionTitle("Komoditas Saya", Icons.agriculture),
                              const SizedBox(height: 16),
                              CropsSection(crops: crops),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ),
      bottomNavigationBar: FarmerBottomNavigation(
        currentIndex: currentIndex,
        onTap: _onNavigationTap,
      ),
    );
  }

  Widget _sectionTitle(String title, IconData icon) {
    return Row(
      children: [
        Container(
          width: 4,
          height: 20,
          decoration: BoxDecoration(
            color: const Color(0xFF1B8F3E),
            borderRadius: BorderRadius.circular(4),
          ),
        ),
        const SizedBox(width: 12),
        Icon(icon, size: 20, color: const Color(0xFF1B8F3E)),
        const SizedBox(width: 8),
        Text(
          title,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Color(0xFF2C3E50),
          ),
        ),
      ],
    );
  }

  Widget _loadingState() {
    return const Scaffold(
      backgroundColor: Color(0xFF1B8F3E),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(color: Colors.white),
            SizedBox(height: 16),
            Text(
              "Memuat data pertanian...",
              style: TextStyle(color: Colors.white70, fontSize: 14),
            ),
          ],
        ),
      ),
    );
  }

  Widget _errorState(String message) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: const BoxDecoration(
                    color: Color(0xFFFEE2E2),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.cloud_off_rounded,
                    size: 64,
                    color: Color(0xFFEF4444),
                  ),
                ),
                const SizedBox(height: 24),
                const Text(
                  "Gagal Memuat Data",
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1F2937),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  message,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    color: Color(0xFF6B7280),
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: _refresh,
                    icon: const Icon(Icons.refresh_rounded),
                    label: const Text("Coba Lagi"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF1B8F3E),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 0,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}