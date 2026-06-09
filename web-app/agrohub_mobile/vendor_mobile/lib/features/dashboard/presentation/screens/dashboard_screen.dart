import 'dart:async';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';

import '../../../../core/constants/app_constants.dart';
import '../../../../core/services/api_client.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';


class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  String _currentTime = '';
  String _greeting = '';
  Timer? _timer;
  int _currentNavIndex = 0;

  bool _isLoading = true;

  double _totalRevenue = 0;
  int _totalOrders = 0;
  int _totalProducts = 0;
  double _avgRating = 0;

  String _aiMessage = '';

  final ApiClient _apiClient = ApiClient.instance;

  String _userName = '';
  String _userEmail = '';
  String _userCity = '';

  @override
  void initState() {
    super.initState();

    _updateDateTime();

    _timer = Timer.periodic(
      const Duration(minutes: 1),
      (_) => _updateDateTime(),
    );

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadUserProfile();
      _loadDashboardData();
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _updateDateTime() {
    final now = DateTime.now();

    _currentTime = DateFormat('HH:mm').format(now);

    final hour = now.hour;

    if (hour < 12) {
      _greeting = 'Selamat Pagi';
    } else if (hour < 15) {
      _greeting = 'Selamat Siang';
    } else if (hour < 18) {
      _greeting = 'Selamat Sore';
    } else {
      _greeting = 'Selamat Malam';
    }

    if (mounted) {
      setState(() {});
    }
  }

  Future<void> _loadUserProfile() async {
    try {
      const storage = FlutterSecureStorage();

      final token = await storage.read(
        key: AppConstants.tokenKey,
      );

      if (token == null || token.isEmpty) {
        _setDefaultProfile();
        return;
      }

      _apiClient.setAuthToken(token);

      final response = await _apiClient.get('/profile');

      if (response != null && response is Map<String, dynamic>) {
        final data = response['data'] as Map<String, dynamic>?;
        
        if (data != null && mounted) {
          setState(() {
            _userName = data['name']?.toString() ?? 'Vendor AgroHub';
            _userEmail = data['email']?.toString() ?? 'vendor@agrohub.com';
            _userCity = data['city']?.toString() ?? 'Malang, Indonesia';
          });
        } else {
          _setDefaultProfile();
        }
      } else {
        _setDefaultProfile();
      }
    } catch (e) {
      debugPrint('Error loading profile: $e');
      _setDefaultProfile();
    }
  }

  void _setDefaultProfile() {
    if (mounted) {
      setState(() {
        _userName = 'Vendor AgroHub';
        _userEmail = 'vendor@agrohub.com';
        _userCity = 'Malang, Indonesia';
      });
    }
  }

  Future<void> _loadDashboardData() async {
    if (mounted) {
      setState(() => _isLoading = true);
    }

    try {
      final authState = context.read<AuthBloc>().state;

      String? token;

      if (authState is AuthAuthenticated) {
        token = authState.user.token;
      }

      if (token == null || token.isEmpty) {
        const storage = FlutterSecureStorage();
        token = await storage.read(key: AppConstants.tokenKey);
      }

      if (token != null && token.isNotEmpty) {
        _apiClient.setAuthToken(token);
      }

      final response = await _apiClient.get(
        AppConstants.dashboardStatsEndpoint,
      );

      if (response != null && response is Map<String, dynamic>) {
        final data = response['data'] as Map<String, dynamic>? ?? response;

        if (mounted) {
          setState(() {
            _totalRevenue = double.tryParse(data['total_revenue']?.toString() ?? '0') ?? 0;
            _totalOrders = int.tryParse(data['total_orders']?.toString() ?? '0') ?? 0;
            _totalProducts = int.tryParse(data['total_products']?.toString() ?? '0') ?? 0;
            _avgRating = double.tryParse(data['avg_rating']?.toString() ?? '0') ?? 0;
            _aiMessage = (data['ai_insight']?.toString() ?? '').isNotEmpty
                ? data['ai_insight'].toString()
                : 'Demand naik 22% minggu ini';
            _isLoading = false;
          });
        }
      } else {
        _setFallbackData();
      }
    } catch (e) {
      debugPrint('Error loading dashboard: $e');
      _setFallbackData();
    }
  }

  void _setFallbackData() {
    if (mounted) {
      setState(() {
        _totalRevenue = 124500000;
        _totalOrders = 2451;
        _totalProducts = 468;
        _avgRating = 4.9;
        _aiMessage = 'Demand naik 22% minggu ini. Harga diprediksi +15%';
        _isLoading = false;
      });
    }
  }

  String _formatRevenue(double revenue) {
    if (revenue >= 1000000) {
      return 'Rp ${(revenue / 1000000).toStringAsFixed(1)}M';
    }
    return NumberFormat.currency(
      locale: 'id',
      symbol: 'Rp ',
      decimalDigits: 0,
    ).format(revenue);
  }

  String _formatNumber(int number) {
    if (number >= 1000) {
      return '${(number / 1000).toStringAsFixed(1)}K';
    }
    return number.toString();
  }

  void _navigateTo(int index, String route) {
    setState(() => _currentNavIndex = index);
    Navigator.pushNamed(context, route);
  }

  void _openAIAnalytics() {
    Navigator.pushNamed(context, '/ai-analytics');
  }

  void _viewAllActivities() {
    Navigator.pushNamed(context, '/activities');
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isSmall = size.width < 360;

    return Theme(
      data: Theme.of(context).copyWith(
        textTheme: GoogleFonts.poppinsTextTheme(Theme.of(context).textTheme),
      ),
      child: Scaffold(
        extendBody: true,
        backgroundColor: const Color(0xFF02120D),
        body: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Color(0xFF031B13),
                Color(0xFF05281C),
                Color(0xFF02120D),
              ],
            ),
          ),
          child: SafeArea(
            child: RefreshIndicator(
              color: const Color(0xFF1B5E20),
              backgroundColor: Colors.white,
              onRefresh: () async {
                await _loadUserProfile();
                await _loadDashboardData();
              },
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.fromLTRB(18, 18, 18, 120),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _enterpriseHeader(),
                    const SizedBox(height: 24),
                    _heroAnalyticsCard(revenue: _totalRevenue),
                    const SizedBox(height: 22),
                    if (_isLoading)
                      Row(
                        children: [
                          Expanded(child: _shimmerStatCard()),
                          const SizedBox(width: 14),
                          Expanded(child: _shimmerStatCard()),
                        ],
                      )
                    else ...[
                      Row(
                        children: [
                          Expanded(
                            child: _premiumStatCard(
                              title: "Revenue",
                              value: _formatRevenue(_totalRevenue),
                              growth: "+18%",
                              icon: Icons.trending_up_rounded,
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: _premiumStatCard(
                              title: "Orders",
                              value: _formatNumber(_totalOrders),
                              growth: "+12%",
                              icon: Icons.shopping_bag_rounded,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      Row(
                        children: [
                          Expanded(
                            child: _premiumStatCard(
                              title: "Products",
                              value: _formatNumber(_totalProducts),
                              growth: "+8%",
                              icon: Icons.inventory_2_rounded,
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: _premiumStatCard(
                              title: "Rating",
                              value: _avgRating.toStringAsFixed(1),
                              growth: "+0.4",
                              icon: Icons.star_rounded,
                            ),
                          ),
                        ],
                      ),
                    ],
                    const SizedBox(height: 28),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "Enterprise Menu",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: isSmall ? 18 : 22,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          decoration: BoxDecoration(
                            color: const Color(0xFF1B5E20).withOpacity(.15),
                            borderRadius: BorderRadius.circular(40),
                            border: Border.all(
                              color: const Color(0xFF1B5E20).withOpacity(.3),
                            ),
                          ),
                          child: const Row(
                            children: [
                              Icon(Icons.auto_awesome, color: Color(0xFF1B5E20), size: 16),
                              SizedBox(width: 6),
                              Text(
                                "AI Powered",
                                style: TextStyle(color: Color(0xFF1B5E20), fontSize: 11, fontWeight: FontWeight.w600),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 18),
                    GridView.count(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisCount: 2,
                      mainAxisSpacing: 16,
                      crossAxisSpacing: 16,
                      childAspectRatio: isSmall ? 0.92 : 1.05,
                      children: [
                        _enterpriseMenuCard(
                          title: "Marketplace",
                          subtitle: "Beli produk dari petani",
                          image: "assets/menu/marketplace.png",
                          icon: Icons.storefront_rounded,
                          onTap: () => _navigateTo(1, '/marketplace'),
                        ),
                        _enterpriseMenuCard(
                          title: "Products",
                          subtitle: "Kelola produk",
                          image: "assets/menu/products.png",
                          icon: Icons.inventory_2_rounded,
                          onTap: () => _navigateTo(1, '/products'),
                        ),
                        _enterpriseMenuCard(
                          title: "Orders",
                          subtitle: "Kelola pesanan",
                          image: "assets/menu/order.png",
                          icon: Icons.receipt_long_rounded,
                          onTap: () => _navigateTo(3, '/orders'),
                        ),
                        _enterpriseMenuCard(
                          title: "Inventory",
                          subtitle: "Warehouse & stock",
                          image: "assets/menu/inventory.png",
                          icon: Icons.warehouse_rounded,
                          onTap: () => _navigateTo(1, '/inventory'),
                        ),
                        _enterpriseMenuCard(
                          title: "Wallet",
                          subtitle: "Finance & payout",
                          image: "assets/menu/wallet.png",
                          icon: Icons.account_balance_wallet_rounded,
                          onTap: () => _navigateTo(1, '/wallet'),
                        ),
                        _enterpriseMenuCard(
                          title: "Analytics AI",
                          subtitle: "Insight & prediction",
                          image: "assets/menu/analitycs.png",
                          icon: Icons.auto_graph_rounded,
                          onTap: _openAIAnalytics,
                        ),
                      ],
                    ),
                    const SizedBox(height: 30),
                    _aiDoctorCard(aiMessage: _aiMessage),
                    const SizedBox(height: 26),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "Aktivitas Terbaru",
                          style: TextStyle(color: Colors.white, fontSize: isSmall ? 18 : 20, fontWeight: FontWeight.bold),
                        ),
                        GestureDetector(
                          onTap: _viewAllActivities,
                          child: const Text(
                            "Lihat Semua",
                            style: TextStyle(color: Color(0xFF1B5E20), fontSize: 13, fontWeight: FontWeight.w600),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    _activityTile(
                      icon: Icons.shopping_cart_checkout_rounded,
                      title: "Pesanan Baru Masuk",
                      subtitle: "Pak Budi membeli 120kg Cabai Merah",
                      amount: "+Rp 8.500.000",
                    ),
                    const SizedBox(height: 14),
                    _activityTile(
                      icon: Icons.payments_rounded,
                      title: "Pembayaran Diterima",
                      subtitle: "Transfer dari PT Agro Makmur",
                      amount: "+Rp 24.500.000",
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
        bottomNavigationBar: _bottomNav(isSmall),
      ),
    );
  }

  Widget _shimmerStatCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(26),
        color: Colors.white.withOpacity(.05),
        border: Border.all(color: Colors.white.withOpacity(.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 46,
            width: 46,
            decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white.withOpacity(.1)),
          ),
          const SizedBox(height: 18),
          Container(
            height: 28,
            width: double.infinity,
            decoration: BoxDecoration(color: Colors.white.withOpacity(.1), borderRadius: BorderRadius.circular(8)),
          ),
          const SizedBox(height: 4),
          Container(
            height: 16,
            width: 80,
            decoration: BoxDecoration(color: Colors.white.withOpacity(.08), borderRadius: BorderRadius.circular(8)),
          ),
          const SizedBox(height: 10),
          Container(
            height: 28,
            width: 60,
            decoration: BoxDecoration(
              color: const Color(0xFF1B5E20).withOpacity(.12),
              borderRadius: BorderRadius.circular(40),
            ),
          ),
        ],
      ),
    );
  }

  Widget _enterpriseHeader() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(30),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFFE8F5E9),
            Color(0xFFD7F5DD),
            Color(0xFFC8EFD0),
          ],
        ),
        border: Border.all(color: const Color(0xFF1B5E20).withOpacity(.18)),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(.08), blurRadius: 20, offset: const Offset(0, 10)),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 160,
            height: 80,
            color: Colors.transparent,
            child: Image.asset(
              'assets/logo/logo-agrohub.png',
              width: 160,
              height: 80,
              fit: BoxFit.contain,
              errorBuilder: (_, __, ___) {
                return const Icon(
                  Icons.agriculture_rounded,
                  color: Color(0xFF1B5E20),
                  size: 60,
                );
              },
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _greeting,
                  style: const TextStyle(color: Color(0xFF1B5E20), fontSize: 12, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 4),
                Text(
                  _userName.isNotEmpty ? _userName : "AgroHub Enterprise",
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(color: Color(0xFF10361F), fontWeight: FontWeight.w800, fontSize: 18),
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    const Icon(Icons.location_on_rounded, color: Color(0xFF1B5E20), size: 15),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        _userCity.isNotEmpty ? _userCity : "Bandung, Indonesia",
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(color: const Color(0xFF1B5E20).withOpacity(.75), fontSize: 11, fontWeight: FontWeight.w500),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Container(
                padding: const EdgeInsets.all(11),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: LinearGradient(
                    colors: [
                      const Color(0xFF1B5E20).withOpacity(.18),
                      const Color(0xFF1B5E20).withOpacity(.08),
                    ],
                  ),
                ),
                child: const Icon(Icons.notifications_active_rounded, color: Color(0xFF1B5E20), size: 22),
              ),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFF1B5E20).withOpacity(.08),
                  borderRadius: BorderRadius.circular(30),
                ),
                child: Text(
                  _currentTime,
                  style: const TextStyle(color: Color(0xFF1B5E20), fontWeight: FontWeight.w700, fontSize: 12),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _heroAnalyticsCard({
    required double revenue,
  }) {
    return Container(
      height: 240,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(36),
        image: const DecorationImage(image: AssetImage('assets/images/gmv.png'), fit: BoxFit.cover),
        boxShadow: [
          BoxShadow(color: Colors.greenAccent.withOpacity(.18), blurRadius: 40, spreadRadius: 4, offset: const Offset(0, 20)),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(36),
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Colors.black.withOpacity(.15),
                const Color(0xFF004D2C).withOpacity(.75),
                const Color(0xFF00140C).withOpacity(.96),
              ],
            ),
          ),
          child: Stack(
            children: [
              Positioned(
                right: -40,
                top: -30,
                child: Container(
                  height: 180,
                  width: 180,
                  decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white.withOpacity(.05)),
                ),
              ),
              Positioned(
                bottom: -50,
                right: -20,
                child: Container(
                  height: 200,
                  width: 200,
                  decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white.withOpacity(.04)),
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(color: Colors.white.withOpacity(.12), borderRadius: BorderRadius.circular(50)),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.auto_graph_rounded, color: Colors.white, size: 16),
                            SizedBox(width: 6),
                            Text("Enterprise Analytics", style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600)),
                          ],
                        ),
                      ),
                      const Spacer(),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white.withOpacity(.12)),
                        child: const Icon(Icons.insights_rounded, color: Colors.white),
                      ),
                    ],
                  ),
                  const Spacer(),
                  const Text("Total Pendapatan", style: TextStyle(color: Colors.white70, fontSize: 14)),
                  const SizedBox(height: 8),
                  Text(
                    NumberFormat.currency(locale: 'id', symbol: 'Rp ', decimalDigits: 0).format(revenue),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(color: Colors.white, fontSize: 34, height: 1, fontWeight: FontWeight.w800),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(color: Colors.white.withOpacity(.12), borderRadius: BorderRadius.circular(40)),
                        child: const Row(
                          children: [
                            Icon(Icons.trending_up_rounded, color: Colors.white, size: 16),
                            SizedBox(width: 6),
                            Text("+32% dari bulan lalu", style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600)),
                          ],
                        ),
                      ),
                      const Spacer(),
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white.withOpacity(.12)),
                        child: const Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 18),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _premiumStatCard({
    required String title,
    required String value,
    required String growth,
    required IconData icon,
  }) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(28),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
        child: Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(28),
            color: Colors.white.withOpacity(.06),
            border: Border.all(color: Colors.white.withOpacity(.08)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    height: 50,
                    width: 50,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(
                        colors: [
                          const Color(0xFF00C853).withOpacity(.5),
                          const Color(0xFF1B5E20).withOpacity(.25),
                        ],
                      ),
                    ),
                    child: Icon(icon, color: Colors.white),
                  ),
                  const Spacer(),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(color: Colors.greenAccent.withOpacity(.1), borderRadius: BorderRadius.circular(40)),
                    child: Text(growth, style: const TextStyle(color: Colors.greenAccent, fontSize: 11, fontWeight: FontWeight.w700)),
                  ),
                ],
              ),
              const SizedBox(height: 18),
              Text(
                value,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w800),
              ),
              const SizedBox(height: 4),
              Text(title, style: const TextStyle(color: Colors.white60, fontSize: 12)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _enterpriseMenuCard({
    required String title,
    required String subtitle,
    required String image,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(30),
        onTap: onTap,
        child: Ink(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(30),
            image: DecorationImage(image: AssetImage(image), fit: BoxFit.cover),
            boxShadow: [
              BoxShadow(color: Colors.black.withOpacity(.25), blurRadius: 18, offset: const Offset(0, 10)),
            ],
          ),
          child: Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(30),
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.black.withOpacity(.05),
                  Colors.black.withOpacity(.4),
                  Colors.black.withOpacity(.82),
                ],
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      height: 42,
                      width: 42,
                      decoration: BoxDecoration(borderRadius: BorderRadius.circular(14), color: Colors.white.withOpacity(.16)),
                      child: Icon(icon, color: Colors.white, size: 22),
                    ),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(color: Colors.white.withOpacity(.16), borderRadius: BorderRadius.circular(18)),
                      child: const Icon(Icons.arrow_outward_rounded, color: Colors.white, size: 18),
                    ),
                  ],
                ),
                const Spacer(),
                Text(
                  title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 18, shadows: [Shadow(blurRadius: 10, color: Colors.black)]),
                ),
                const SizedBox(height: 6),
                Text(
                  subtitle,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _aiDoctorCard({
    required String aiMessage,
  }) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(30),
        image: const DecorationImage(image: AssetImage('assets/images/aicard.png'), fit: BoxFit.cover),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(.25), blurRadius: 18, offset: const Offset(0, 10)),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(30),
        child: Container(
          padding: const EdgeInsets.all(22),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Colors.black.withOpacity(.2),
                Colors.black.withOpacity(.7),
              ],
            ),
          ),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white.withOpacity(.14)),
                          child: const Icon(Icons.smart_toy, color: Colors.white),
                        ),
                        const SizedBox(width: 10),
                        const Expanded(
                          child: Text(
                            "AI Doctor Pertanian",
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 22, shadows: [Shadow(blurRadius: 10, color: Colors.black)]),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    Text(
                      aiMessage,
                      style: const TextStyle(color: Colors.white, fontSize: 12, height: 1.5, shadows: [Shadow(blurRadius: 8, color: Colors.black)]),
                    ),
                    const SizedBox(height: 18),
                    GestureDetector(
                      onTap: _openAIAnalytics,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(40),
                          boxShadow: [
                            BoxShadow(color: Colors.black.withOpacity(.2), blurRadius: 8, offset: const Offset(0, 4)),
                          ],
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text("Buka AI Insight", style: TextStyle(color: Color(0xFF1B5E20), fontWeight: FontWeight.bold, fontSize: 13)),
                            SizedBox(width: 8),
                            Icon(Icons.arrow_forward_rounded, color: Color(0xFF1B5E20), size: 18),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _activityTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required String amount,
  }) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        color: Colors.white.withOpacity(.04),
        border: Border.all(color: Colors.white.withOpacity(.05)),
      ),
      child: Row(
        children: [
          Container(
            height: 54,
            width: 54,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: LinearGradient(
                colors: [
                  const Color(0xFF1B5E20).withOpacity(.4),
                  const Color(0xFF1B5E20).withOpacity(.2),
                ],
              ),
            ),
            child: Icon(icon, color: const Color(0xFF1B5E20)),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
                const SizedBox(height: 4),
                Text(subtitle, style: const TextStyle(color: Colors.white60, fontSize: 11)),
              ],
            ),
          ),
          Text(amount, style: const TextStyle(color: Color(0xFF00E676), fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _bottomNav(bool isSmall) {
    return Container(
      margin: const EdgeInsets.fromLTRB(18, 0, 18, 24),
      padding: const EdgeInsets.symmetric(horizontal: 10),
      height: isSmall ? 70 : 78,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(30),
        color: const Color(0xFFE8F5E9),
        border: Border.all(color: const Color(0xFF1B5E20).withOpacity(.3)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          GestureDetector(
            onTap: () {
              setState(() => _currentNavIndex = 0);
              Navigator.pushNamed(context, '/dashboard');
            },
            child: _navItem(Icons.home_rounded, _currentNavIndex == 0),
          ),
          GestureDetector(
            onTap: () {
              setState(() => _currentNavIndex = 1);
              Navigator.pushNamed(context, '/marketplace');
            },
            child: _navItem(Icons.storefront_rounded, _currentNavIndex == 1),
          ),
          GestureDetector(
            onTap: () {
              setState(() => _currentNavIndex = 2);
              Navigator.pushNamed(context, '/add-product');
            },
            child: Container(
              height: 58,
              width: 58,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: const LinearGradient(colors: [Color(0xFF1B5E20), Color(0xFF00C853)]),
                boxShadow: [
                  BoxShadow(color: Colors.greenAccent.withOpacity(.35), blurRadius: 16, offset: const Offset(0, 8)),
                ],
              ),
              child: const Icon(Icons.add, color: Colors.white, size: 32),
            ),
          ),
          GestureDetector(
            onTap: () {
              setState(() => _currentNavIndex = 3);
              Navigator.pushNamed(context, '/orders');
            },
            child: _navItem(Icons.receipt_long_rounded, _currentNavIndex == 3),
          ),
          GestureDetector(
            onTap: () {
              setState(() => _currentNavIndex = 4);
              Navigator.pushNamed(context, '/profile');
            },
            child: _navItem(Icons.person_rounded, _currentNavIndex == 4),
          ),
        ],
      ),
    );
  }

  Widget _navItem(IconData icon, bool active) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 250),
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: active ? const Color(0xFF1B5E20).withOpacity(.12) : Colors.transparent,
      ),
      child: Icon(
        icon,
        color: active ? const Color(0xFF1B5E20) : const Color(0xFF1B5E20).withOpacity(.5),
        size: 28,
      ),
    );
  }
}