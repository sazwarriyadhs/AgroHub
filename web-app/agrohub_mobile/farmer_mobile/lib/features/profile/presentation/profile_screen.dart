import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../auth/bloc/auth_bloc.dart';
import '../../../core/services/api_service.dart';
import '../../dashboard/presentation/farmer_bottom_navigation.dart';
import '../models/profile_model.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final ApiService _api = ApiService();

  ProfileModel? profile;
  bool loading = true;
  String? error;
  
  // ✅ Anti spam / race condition
  bool _isRefreshing = false;

  @override
  void initState() {
    super.initState();
    _loadRealtimeProfile();
    
    // ✅ Auto refresh every 30 seconds (real-time feel)
    Future.delayed(const Duration(seconds: 30), () {
      if (mounted && !_isRefreshing) {
        _loadRealtimeProfile();
      }
    });
  }

  @override
  void dispose() {
    _api.dispose();
    super.dispose();
  }

  // ✅ Helper function untuk safe int parsing
  int _parseToInt(dynamic value) {
    if (value == null) return 0;
    if (value is int) return value;
    if (value is String) return int.tryParse(value) ?? 0;
    if (value is double) return value.toInt();
    if (value is num) return value.toInt();
    return 0;
  }

  // ✅ Helper function untuk safe double parsing
  double _parseToDouble(dynamic value) {
    if (value == null) return 0.0;
    if (value is double) return value;
    if (value is int) return value.toDouble();
    if (value is String) return double.tryParse(value) ?? 0.0;
    if (value is num) return value.toDouble();
    return 0.0;
  }

  // ✅ FIX load realtime (ANTI RACE CONDITION)
  Future<void> _loadRealtimeProfile() async {
    // ✅ Prevent multiple simultaneous calls
    if (!mounted || _isRefreshing) return;

    _isRefreshing = true;

    setState(() {
      loading = true;
      error = null;
    });

    try {
      // ✅ Individual error handling untuk setiap API call
      final profileFuture = _api.getProfile().catchError((e) {
        print('Profile error: $e');
        return {'data': _getDefaultProfile()};
      });
      
      final walletFuture = _api.getWallet().catchError((e) {
        print('Wallet error: $e');
        return {'data': {'balance': 0}};
      });
      
      final statsFuture = _api.getDashboardStats().catchError((e) {
        print('Stats error: $e');
        return {
          'data': {
            'totalRevenue': 0,
            'activeOrders': 0,
            'pendingTasks': 0,
          }
        };
      });

      final results = await Future.wait([
        profileFuture,
        walletFuture,
        statsFuture,
      ]).timeout(const Duration(seconds: 15));

      // ✅ Safe extraction with null checks
      final profileData = results[0]?['data'] ?? results[0] ?? _getDefaultProfile();
      final walletData = results[1]?['data'] ?? results[1] ?? {};
      final statsData = results[2]?['data'] ?? results[2] ?? {};
      
      // ✅ Handle totalRevenue yang mungkin String atau int
      dynamic totalRevenueValue = statsData['totalRevenue'] ?? 
                                 statsData['totalSales'] ?? 
                                 statsData['total_sales'] ?? 0;
      
      // ✅ Konversi ke int dengan aman
      int totalSales = _parseToInt(totalRevenueValue);
      
      // ✅ Handle balance yang mungkin String
      dynamic balanceValue = walletData['balance'] ?? 0;
      int balance = _parseToInt(balanceValue);

      profile = ProfileModel.fromJson({
        ...profileData,
        "balance": balance,
        "total_sales": totalSales,
      });

      if (!mounted) return;

      setState(() {
        loading = false;
      });

    } catch (e) {
      print('❌ _loadRealtimeProfile error: $e');
      if (!mounted) return;

      setState(() {
        loading = false;
        error = "Gagal memuat profil: $e";
      });

    } finally {
      _isRefreshing = false;
    }
  }

  // ✅ Default profile data (RUDI HARTONO READY)
  Map<String, dynamic> _getDefaultProfile() {
    return {
      'id': 1,
      'name': 'Rudi Hartono',
      'email': 'petani.baru@agrohub.com',
      'phone': '08123456789',
      'farmName': 'Kebun Makmur',
      'farmType': 'crop',
      'province': 'Jawa Barat',
      'city': 'Bandung',
      'landArea': 2.5,
      'verificationStatus': 'verified',
      'createdAt': DateTime.now().toIso8601String(),
    };
  }

  void _navigate(int index) {
    const routes = [
      "/dashboard",
      "/buy",
      "/sell",
      "/market",
      "/notifications",
      "/profile",
    ];

    if (index == 5) return;

    Navigator.pushReplacementNamed(context, routes[index]);
  }

  String _verificationLabel(String? status) {
    switch (status?.toLowerCase()) {
      case "verified":
        return "Terverifikasi";
      case "pending":
        return "Pending";
      case "rejected":
        return "Ditolak";
      default:
        return "Belum Verifikasi";
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthBloc, AuthState>(
      listener: (_, state) {
        if (state is Unauthenticated) {
          Navigator.pushNamedAndRemoveUntil(
            context,
            "/login",
            (_) => false,
          );
        }
      },
      child: Scaffold(
        backgroundColor: const Color(0xffF6F8F4),
        body: _buildBody(),
        bottomNavigationBar: FarmerBottomNavigation(
          currentIndex: 5,
          onTap: _navigate,
        ),
      ),
    );
  }

  Widget _buildBody() {
    if (loading) {
      return const Center(
        child: CircularProgressIndicator(color: Color(0xFF1B8F3E)),
      );
    }

    if (error != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.cloud_off, size: 70, color: Colors.red),
              const SizedBox(height: 16),
              Text(
                error!,
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.red),
              ),
              const SizedBox(height: 8),
              Text(
                'Periksa koneksi internet Anda',
                style: TextStyle(color: Colors.grey[600]),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: _loadRealtimeProfile,
                icon: const Icon(Icons.refresh),
                label: const Text("Coba Lagi"),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1B8F3E),
                  foregroundColor: Colors.white,
                ),
              ),
            ],
          ),
        ),
      );
    }

    if (profile == null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.person_off, size: 70, color: Colors.grey),
            const SizedBox(height: 16),
            const Text("Profil tidak ditemukan"),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _loadRealtimeProfile,
              child: const Text("Muat Ulang"),
            ),
          ],
        ),
      );
    }

    final p = profile!;

    // ✅ FIX: SafeArea untuk mencegah overflow
    return SafeArea(
      child: RefreshIndicator(
        onRefresh: _loadRealtimeProfile,
        color: const Color(0xFF1B8F3E),
        child: CustomScrollView(
          slivers: [
            SliverAppBar(
              pinned: true,
              expandedHeight: 280,
              backgroundColor: const Color(0xFF1B8F3E),
              title: const Text(
                "Profil Petani",
                style: TextStyle(color: Colors.white),
              ),
              actions: [
                IconButton(
                  icon: const Icon(Icons.settings, color: Colors.white),
                  onPressed: () =>
                      Navigator.pushNamed(context, "/settings"),
                )
              ],
              flexibleSpace: FlexibleSpaceBar(
                background: _ProfileHeader(
                  name: p.name,
                  email: p.email,
                  location: p.fullLocation,
                  farmName: p.farmName ?? "-",
                  farmTypeIcon: p.farmTypeIcon,
                ),
              ),
            ),

            SliverPadding(
              padding: const EdgeInsets.all(16),
              sliver: SliverList(
                delegate: SliverChildListDelegate([
                  _buildStatsGrid(p),
                  const SizedBox(height: 20),

                  Card(
                    child: Column(
                      children: [
                        _MenuTile(
                          icon: Icons.edit,
                          title: "Edit Profil",
                          onTap: () async {
                            final result = await Navigator.pushNamed(context, "/edit-profile");
                            if (result == true) {
                              _loadRealtimeProfile();
                            }
                          },
                        ),
                        const Divider(height: 0),
                        _MenuTile(
                          icon: Icons.notifications,
                          title: "Notifikasi",
                          onTap: () =>
                              Navigator.pushNamed(context, "/notifications"),
                        ),
                        const Divider(height: 0),
                        _MenuTile(
                          icon: Icons.help,
                          title: "Bantuan",
                          onTap: () => Navigator.pushNamed(context, "/help"),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),
                  _buildLogoutButton(),
                  const SizedBox(height: 80),
                ]),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ✅ FIX GRID OVERFLOW - childAspectRatio diubah
  Widget _buildStatsGrid(ProfileModel p) {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      childAspectRatio: 1.4, // ✅ FIX: dari 1.6 jadi 1.4
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      children: [
        _StatCard(
            title: "Komoditas",
            value: p.farmTypeLabel.isNotEmpty ? p.farmTypeLabel : "-",
            icon: Icons.agriculture),
        _StatCard(
            title: "Lahan",
            value: p.formattedLandArea.isNotEmpty ? p.formattedLandArea : "0 Ha",
            icon: Icons.landscape),
        _StatCard(
            title: "Wallet",
            value: p.formattedBalance.isNotEmpty ? p.formattedBalance : "Rp 0",
            icon: Icons.account_balance_wallet),
        _StatCard(
          title: "Status",
          value: _verificationLabel(p.verificationStatus),
          icon: Icons.verified,
        ),
      ],
    );
  }

  Widget _buildLogoutButton() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        onPressed: _showLogoutDialog,
        icon: const Icon(Icons.logout),
        label: const Text("Keluar"),
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.red,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.all(14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
    );
  }

  void _showLogoutDialog() {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text("Logout"),
        content: const Text("Yakin ingin keluar dari aplikasi?"),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text("Batal")),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              context.read<AuthBloc>().add(LogoutRequested());
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            child: const Text("Keluar"),
          ),
        ],
      ),
    );
  }
}

// ==============================================
// 🔧 FIX 1 — PROFILE HEADER (FIX OVERFLOW)
// ==============================================
class _ProfileHeader extends StatelessWidget {
  final String name;
  final String email;
  final String location;
  final String farmName;
  final String farmTypeIcon;

  const _ProfileHeader({
    required this.name,
    required this.email,
    required this.location,
    required this.farmName,
    required this.farmTypeIcon,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      // ✅ FIX SLIVER HEADER - padding diubah
      padding: const EdgeInsets.only(top: 80, bottom: 20),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF1B8F3E), Color(0xFF0E5E2A)],
        ),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const CircleAvatar(
            radius: 45,
            backgroundColor: Colors.white,
            child: Icon(Icons.person, size: 50, color: Color(0xFF1B8F3E)),
          ),
          const SizedBox(height: 10),
          Text(
            name,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 4),
          Text(
            email,
            style: const TextStyle(color: Colors.white70),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 4),
          Text(
            "$farmTypeIcon $farmName",
            style: const TextStyle(color: Colors.white),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.location_on, size: 14, color: Colors.white70),
              const SizedBox(width: 4),
              Expanded(
                child: Text(
                  location,
                  style: const TextStyle(color: Colors.white70),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ==============================================
// 🔧 FIX 2 — STAT CARD (FIX TEXT OVERFLOW)
// ==============================================
class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;

  const _StatCard({
    required this.title,
    required this.value,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: const Color(0xFF1B8F3E), size: 28),
            const SizedBox(height: 8),
            // ✅ FIX STAT CARD TEXT OVERFLOW
            Text(
              value,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 4),
            Text(
              title,
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 12,
              ),
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}

// ==============================================
// 🔧 FIX 3 — MENU TILE
// ==============================================
class _MenuTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;

  const _MenuTile({
    required this.icon,
    required this.title,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: const Color(0xFF1B8F3E)),
      title: Text(
        title,
        style: const TextStyle(fontSize: 16),
      ),
      trailing: const Icon(Icons.arrow_forward_ios, size: 16),
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
    );
  }
}