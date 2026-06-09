// lib/features/profile/presentation/screens/profile_screen.dart
// ============================================================================
// PROFILE SCREEN - FULL REALTIME DATABASE INTEGRATION
// Database: PostgreSQL - NO HARDCODED FALLBACK
// VERSION: FINAL 3.0.6 - FULLY FIXED
// ============================================================================

import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';

import 'package:agrohub_aqua_app/app/theme/app_theme.dart';

import '../../providers/profile_provider.dart';

import '../../../membership/presentation/screens/membership_card_screen.dart';
import 'package:agrohub_aqua_app/features/profile/models/membership_model.dart';

import '../../models/aquaculture_asset_model.dart';

import '../../../../core/services/api_service.dart';
import '../../../../core/services/user_session.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  int _selectedTab = 0;

  final ApiService _apiService = ApiService();

  @override
  void initState() {
    super.initState();

    Future.microtask(() async {
      if (!mounted) return;

      final provider = context.read<ProfileProvider>();

      await Future.wait([
        provider.loadUserProfile(),
        provider.loadAquacultureAssets(),
      ]);
    });
  }

  Future<void> _refreshProfile() async {
    final provider = context.read<ProfileProvider>();

    await Future.wait([
      provider.loadUserProfile(),
      provider.loadAquacultureAssets(),
    ]);
  }

  Future<void> _logout() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        title: const Text("Keluar"),
        content: const Text(
          "Apakah Anda yakin ingin keluar dari aplikasi?",
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text("Batal"),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text(
              "Keluar",
              style: TextStyle(color: Colors.red),
            ),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      await _apiService.logout();

      if (!mounted) return;

      Navigator.pushReplacementNamed(
        context,
        '/login',
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final profileProvider = context.watch<ProfileProvider>();

    final user = profileProvider.user;
    final Map<String, dynamic>? userData = user is Map<String, dynamic> ? user : null;

    final MembershipModel? membership = profileProvider.membership;
    final List<AquacultureAsset> assets = profileProvider.assets;
    final bool isLoading = profileProvider.isLoading;

    // ================= SAFE EXTRACT FROM REALTIME DATABASE =================
    final String fullName = _getFullName(userData);
    final String email = _getEmail(userData);
    final String role = _getRole(userData);
    final String farmName = _getFarmName(userData);
    final double farmSize = _getFarmSize(userData);
    final String farmAddress = _getFarmAddress(userData);
    final String phoneNumber = _getPhoneNumber(userData);
    final String address = _getAddress(userData);
    final String city = _getCity(userData);
    final String province = _getProvince(userData);
    final String membershipType = _getMembershipType(membership, userData);
    final String membershipCode = _getMembershipCode(userData);
    final int membershipPoints = _getMembershipPoints(membership, userData);
    final int farmingExperience = _getFarmingExperience(userData);
    final String farmType = _getFarmType(userData);
    final String avatar = _getAvatar(userData);
    final DateTime? memberSince = _getMemberSince(userData);
    
    // Assets stats
    final int totalFishStock = assets.fold(0, (sum, a) => sum + (a.stockCount ?? 0));
    final double totalBiomass = assets.fold(0.0, (sum, a) => sum + (a.estimatedBiomass ?? 0.0));
    final double avgSurvivalRate = assets.isEmpty
        ? 0.0
        : assets.map((a) => (a.survivalRate ?? 0).toDouble()).reduce((a, b) => a + b) / assets.length;

    return Scaffold(
      backgroundColor: const Color(0xFFF0F4F8),
      appBar: _buildAppBar(),
      body: isLoading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryColor))
          : RefreshIndicator(
              onRefresh: _refreshProfile,
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                child: Column(
                  children: [
                    _buildPremiumHeader(
                      fullName,
                      email,
                      role,
                      farmName,
                      farmSize,
                      membershipType,
                      avatar,
                      memberSince,
                    ),
                    const SizedBox(height: 16),
                    _buildMembershipCard(userData, membership, membershipType, membershipCode, membershipPoints),
                    const SizedBox(height: 20),
                    _buildStatsSection(totalFishStock, totalBiomass, avgSurvivalRate),
                    const SizedBox(height: 20),
                    _buildFarmInfoCard(farmName, farmSize, farmAddress, farmType, farmingExperience),
                    const SizedBox(height: 20),
                    _buildContactInfoCard(phoneNumber, email, address, city, province),
                    const SizedBox(height: 20),
                    _buildTabBar(),
                    const SizedBox(height: 16),
                    _buildTabContent(
                      assets,
                      membershipType,
                      membershipCode,
                      membershipPoints,
                      fullName,
                      email,
                      role,
                      farmName,
                      farmSize,
                      farmAddress,
                      phoneNumber,
                      address,
                      city,
                      province,
                      farmingExperience,
                      farmType,
                    ),
                    const SizedBox(height: 30),
                  ],
                ),
              ),
            ),
    );
  }

  AppBar _buildAppBar() {
    return AppBar(
      backgroundColor: Colors.transparent,
      elevation: 0,
      centerTitle: false,
      title: Text(
        "Profil Saya",
        style: GoogleFonts.poppins(
          fontWeight: FontWeight.bold,
          fontSize: 20,
          color: const Color(0xFF1A2B4C),
        ),
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.settings_outlined),
          onPressed: () => _showSettingsMenu(),
          color: const Color(0xFF1A2B4C),
        ),
      ],
    );
  }

  // ================= REALTIME DATA EXTRACTORS (NO HARDCODED FALLBACK) =================
  
  String _getFullName(Map<String, dynamic>? user) {
    final value = user?['full_name']?.toString().trim();
    if (value != null && value.isNotEmpty) return value;
    return UserSession.fullName ?? '-';
  }
  
  String _getEmail(Map<String, dynamic>? user) {
    return user?['email'] ?? UserSession.email ?? '-';
  }
  
  String _getRole(Map<String, dynamic>? user) {
    final value = user?['role']?.toString();
    return (value != null && value.isNotEmpty) ? value : '-';
  }
  
  String _getFarmName(Map<String, dynamic>? user) {
    final value = user?['farm_name']?.toString().trim();
    return (value != null && value.isNotEmpty) ? value : '-';
  }
  
  double _getFarmSize(Map<String, dynamic>? user) {
    final value = user?['farm_size'];
    if (value == null) return 0;
    return double.tryParse(value.toString()) ?? 0;
  }
  
  String _getFarmAddress(Map<String, dynamic>? user) {
    final value = user?['farm_address']?.toString().trim();
    return (value != null && value.isNotEmpty) ? value : '-';
  }
  
  String _getPhoneNumber(Map<String, dynamic>? user) {
    final value = user?['phone']?.toString();
    return (value != null && value.isNotEmpty) ? value : '-';
  }
  
  String _getAddress(Map<String, dynamic>? user) {
    final value = user?['address']?.toString().trim();
    return (value != null && value.isNotEmpty) ? value : '-';
  }
  
  String _getCity(Map<String, dynamic>? user) {
    final value = user?['city']?.toString().trim();
    return (value != null && value.isNotEmpty) ? value : '-';
  }
  
  String _getProvince(Map<String, dynamic>? user) {
    final value = user?['province']?.toString().trim();
    return (value != null && value.isNotEmpty) ? value : '-';
  }
  
  String _getMembershipType(MembershipModel? membership, Map<String, dynamic>? user) {
    if (membership?.membershipType != null && membership!.membershipType!.isNotEmpty) {
      return membership.membershipType!;
    }
    final value = user?['membership_type']?.toString();
    return (value != null && value.isNotEmpty) ? value : '-';
  }
  
  String _getMembershipCode(Map<String, dynamic>? user) {
    final value = user?['membership_code']?.toString();
    return (value != null && value.isNotEmpty) ? value : '-';
  }
  
  int _getMembershipPoints(MembershipModel? membership, Map<String, dynamic>? user) {
    if (membership?.points != null) return membership!.points!;
    final value = user?['loyalty_points'];
    if (value != null) return int.tryParse(value.toString()) ?? 0;
    return 0;
  }
  
  int _getFarmingExperience(Map<String, dynamic>? user) {
    final value = user?['farming_experience_years'];
    if (value != null) return int.tryParse(value.toString()) ?? 0;
    return 0;
  }
  
  String _getFarmType(Map<String, dynamic>? user) {
    final value = user?['farm_type']?.toString();
    return (value != null && value.isNotEmpty) ? value : '-';
  }
  
  String _getAvatar(Map<String, dynamic>? user) {
    final value = user?['avatar']?.toString();
    return (value != null && value.isNotEmpty) ? value : 'assets/images/nelayan.png';
  }
  
  DateTime? _getMemberSince(Map<String, dynamic>? user) {
    final value = user?['created_at'];
    if (value == null) return null;
    if (value is DateTime) return value;
    return DateTime.tryParse(value.toString());
  }

  // ================= CONVERT MEMBERSHIP TO MAP (FIXED - removed expiryDate & joinedDate) =================
  
  Map<String, dynamic>? _convertMembershipToMap(
    MembershipModel? membership,
  ) {
    if (membership == null) return null;

    return {
      'membership_type': membership.membershipType,
      'plan_name': membership.planName,
      'points': membership.points,
      'membership_code': membership.membershipCode,
      'status': membership.status,
    };
  }

  // ================= HEADER =================

  Widget _buildPremiumHeader(
    String fullName,
    String email,
    String role,
    String farmName,
    double farmSize,
    String membershipType,
    String avatar,
    DateTime? memberSince,
  ) {
    final Color levelColor = _getLevelColor(membershipType);
    final String roleDisplay = role == 'farmer' ? 'Petani' : role.toUpperCase();

    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(28),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [AppTheme.primaryColor, AppTheme.secondaryColor, AppTheme.accentColor],
        ),
        boxShadow: [BoxShadow(color: AppTheme.primaryColor.withOpacity(0.25), blurRadius: 20, offset: const Offset(0, 10))],
      ),
      child: Column(
        children: [
          CircleAvatar(
            radius: 45,
            backgroundColor: Colors.white,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(50),
              child: Image.asset(
                avatar,
                width: 84,
                height: 84,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Icon(Icons.person, color: AppTheme.primaryColor, size: 42),
              ),
            ),
          ),
          const SizedBox(height: 14),
          Text(fullName, textAlign: TextAlign.center, style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
          const SizedBox(height: 4),
          Text(email, style: GoogleFonts.poppins(fontSize: 12, color: Colors.white70)),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(color: Colors.white.withOpacity(0.15), borderRadius: BorderRadius.circular(20)),
            child: Text(roleDisplay, style: GoogleFonts.poppins(fontSize: 10, color: Colors.white70)),
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.agriculture, size: 14, color: Colors.white70),
              const SizedBox(width: 4),
              Text("$farmName • ${farmSize.toStringAsFixed(1)} Ha", style: GoogleFonts.poppins(fontSize: 11, color: Colors.white70)),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
            decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(30)),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.workspace_premium, size: 16, color: levelColor),
                const SizedBox(width: 6),
                Text(membershipType.toUpperCase(), style: GoogleFonts.poppins(color: levelColor, fontWeight: FontWeight.bold, fontSize: 12)),
              ],
            ),
          ),
          if (memberSince != null) ...[
            const SizedBox(height: 8),
            Text("Bergabung: ${DateFormat('dd MMM yyyy').format(memberSince)}", style: GoogleFonts.poppins(fontSize: 9, color: Colors.white54)),
          ],
        ],
      ),
    );
  }

  // ================= MEMBERSHIP CARD =================

  Widget _buildMembershipCard(
    Map<String, dynamic>? userData,
    MembershipModel? membership,
    String membershipType,
    String membershipCode,
    int points,
  ) {
    if (membershipType == '-' || membershipCode == '-') {
      return const SizedBox.shrink();
    }

    final Color levelColor = _getLevelColor(membershipType);

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => MembershipCardScreen(
              user: userData,
              membership: _convertMembershipToMap(membership),
            ),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(24),
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [levelColor, levelColor.withOpacity(0.8), const Color(0xFF00C2FF)],
          ),
          boxShadow: [BoxShadow(color: levelColor.withOpacity(0.25), blurRadius: 20, offset: const Offset(0, 10))],
        ),
        child: Row(
          children: [
            Container(
              width: 58,
              height: 58,
              decoration: BoxDecoration(color: Colors.white.withOpacity(0.15), shape: BoxShape.circle),
              child: const Icon(Icons.workspace_premium, color: Colors.white, size: 28),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("$membershipType Membership", style: GoogleFonts.poppins(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text("Kode: $membershipCode", style: GoogleFonts.poppins(color: Colors.white70, fontSize: 11)),
                  const SizedBox(height: 2),
                  Text("${NumberFormat("#,###").format(points)} Points", style: GoogleFonts.poppins(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.w500)),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(20)),
              child: const Text("Aktif", style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }

  // ================= FARM INFO CARD =================

  Widget _buildFarmInfoCard(String farmName, double farmSize, String farmAddress, String farmType, int experience) {
    if (farmName == '-' && farmSize == 0 && farmAddress == '-') {
      return const SizedBox.shrink();
    }

    String farmTypeDisplay = farmType == 'aquaculture' ? 'Akuakultur' : farmType;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.agriculture, color: AppTheme.primaryColor, size: 20),
              const SizedBox(width: 8),
              Text("Informasi Farm", style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.bold, color: const Color(0xFF1A2B4C))),
            ],
          ),
          const SizedBox(height: 12),
          if (farmName != '-') _infoRow("Nama Farm", farmName),
          if (farmSize > 0) _infoRow("Luas Lahan", "${farmSize.toStringAsFixed(2)} Hektar"),
          if (farmType != '-') _infoRow("Tipe Farm", farmTypeDisplay),
          if (experience > 0) _infoRow("Pengalaman", "$experience Tahun"),
          if (farmAddress != '-') ...[
            const SizedBox(height: 8),
            Text(farmAddress, style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey[600])),
          ],
        ],
      ),
    );
  }

  // ================= CONTACT INFO CARD =================

  Widget _buildContactInfoCard(String phone, String email, String address, String city, String province) {
    if (phone == '-' && email == '-' && address == '-' && city == '-' && province == '-') {
      return const SizedBox.shrink();
    }

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.contact_phone, color: AppTheme.primaryColor, size: 20),
              const SizedBox(width: 8),
              Text("Kontak & Alamat", style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.bold, color: const Color(0xFF1A2B4C))),
            ],
          ),
          const SizedBox(height: 12),
          if (phone != '-') _infoRow("No. Telepon", phone),
          if (email != '-') _infoRow("Email", email),
          if (address != '-') _infoRow("Alamat", address),
          if (city != '-') _infoRow("Kota", city),
          if (province != '-') _infoRow("Provinsi", province),
        ],
      ),
    );
  }

  Widget _infoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(width: 100, child: Text(label, style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey[600]))),
          const SizedBox(width: 8),
          Expanded(child: Text(value, style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w500, color: const Color(0xFF1A2B4C)))),
        ],
      ),
    );
  }

  // ================= STATS SECTION =================

  Widget _buildStatsSection(int fish, double biomass, double survival) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 15, offset: const Offset(0, 6))],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _stat("Ikan", NumberFormat("#,###").format(fish), Icons.set_meal),
          _divider(),
          _stat("Biomassa", "${biomass.toStringAsFixed(0)} kg", Icons.water),
          _divider(),
          _stat("Survival", "${survival.toStringAsFixed(1)}%", Icons.trending_up),
        ],
      ),
    );
  }

  Widget _divider() => Container(width: 1, height: 45, color: Colors.grey.shade300);

  Widget _stat(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, color: AppTheme.primaryColor),
        const SizedBox(height: 8),
        Text(value, style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.bold, color: const Color(0xFF1A2B4C))),
        const SizedBox(height: 4),
        Text(label, style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey[600])),
      ],
    );
  }

  // ================= TAB BAR =================

  Widget _buildTabBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          Expanded(child: _tab("Info", 0)),
          Expanded(child: _tab("Assets", 1)),
          Expanded(child: _tab("Settings", 2)),
        ],
      ),
    );
  }

  Widget _tab(String title, int index) {
    final bool selected = _selectedTab == index;
    return GestureDetector(
      onTap: () => setState(() => _selectedTab = index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        margin: const EdgeInsets.symmetric(horizontal: 4),
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: selected ? AppTheme.primaryColor : Colors.white,
          borderRadius: BorderRadius.circular(18),
          boxShadow: [
            BoxShadow(
              color: selected ? AppTheme.primaryColor.withOpacity(0.2) : Colors.black.withOpacity(0.03),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Center(
          child: Text(title, style: GoogleFonts.poppins(fontWeight: FontWeight.w600, color: selected ? Colors.white : Colors.grey[700])),
        ),
      ),
    );
  }

  Widget _buildTabContent(
    List<AquacultureAsset> assets,
    String membershipType,
    String membershipCode,
    int points,
    String fullName,
    String email,
    String role,
    String farmName,
    double farmSize,
    String farmAddress,
    String phoneNumber,
    String address,
    String city,
    String province,
    int farmingExperience,
    String farmType,
  ) {
    if (_selectedTab == 0) {
      return _buildInfoSection(
        membershipType, membershipCode, points, fullName, email, role,
        farmName, farmSize, farmAddress, phoneNumber, address, city, province,
        farmingExperience, farmType,
      );
    }
    if (_selectedTab == 1) return _buildAssets(assets);
    return _buildSettings();
  }

  // ================= INFO SECTION =================

  Widget _buildInfoSection(
    String membershipType, String membershipCode, int points,
    String fullName, String email, String role, String farmName, double farmSize,
    String farmAddress, String phoneNumber, String address, String city,
    String province, int farmingExperience, String farmType,
  ) {
    final String roleDisplay = role == 'farmer' ? 'Petani' : role.toUpperCase();
    final String farmTypeDisplay = farmType == 'aquaculture' ? 'Akuakultur' : farmType;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
      child: Column(
        children: [
          if (fullName != '-') _infoTile(Icons.person, "Nama Lengkap", fullName),
          if (email != '-') _infoTile(Icons.email, "Email", email),
          if (phoneNumber != '-') _infoTile(Icons.phone, "No. Telepon", phoneNumber),
          if (role != '-') _infoTile(Icons.badge, "Role", roleDisplay),
          if (farmName != '-') _infoTile(Icons.agriculture, "Nama Farm", farmName),
          if (farmSize > 0) _infoTile(Icons.straighten, "Luas Farm", "${farmSize.toStringAsFixed(2)} Hektar"),
          if (farmType != '-') _infoTile(Icons.category, "Tipe Farm", farmTypeDisplay),
          if (farmingExperience > 0) _infoTile(Icons.timer, "Pengalaman", "$farmingExperience Tahun"),
          if (address != '-') _infoTile(Icons.location_on, "Alamat", address),
          if (city != '-') _infoTile(Icons.location_city, "Kota", city),
          if (province != '-') _infoTile(Icons.map, "Provinsi", province),
          if (membershipType != '-') _infoTile(Icons.workspace_premium, "Membership", membershipType),
          if (membershipCode != '-') _infoTile(Icons.qr_code, "Kode Membership", membershipCode),
          if (points > 0) _infoTile(Icons.stars, "Points", NumberFormat("#,###").format(points)),
        ],
      ),
    );
  }

  Widget _infoTile(IconData icon, String title, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CircleAvatar(
            radius: 18,
            backgroundColor: AppTheme.primaryColor.withOpacity(0.1),
            child: Icon(icon, color: AppTheme.primaryColor, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey[600])),
                const SizedBox(height: 2),
                Text(value, style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w600, color: const Color(0xFF1A2B4C))),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ================= ASSETS =================

  Widget _buildAssets(List<AquacultureAsset> assets) {
    if (assets.isEmpty) {
      return Padding(
        padding: const EdgeInsets.only(top: 40),
        child: Column(
          children: [
            Icon(Icons.inventory_2_outlined, size: 60, color: Colors.grey.shade400),
            const SizedBox(height: 12),
            Text("Belum ada aset akuakultur", style: GoogleFonts.poppins(color: Colors.grey[600], fontSize: 14)),
          ],
        ),
      );
    }

    return Column(
      children: assets.map((a) {
        final species = a.species ?? 'Ikan';
        final stock = a.stockCount ?? 0;
        final biomass = a.estimatedBiomass ?? 0.0;

        return Container(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20)),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: AppTheme.primaryColor.withOpacity(0.1),
              child: Icon(Icons.set_meal, color: AppTheme.primaryColor),
            ),
            title: Text(species, style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
            subtitle: Text("$stock ekor • ${biomass.toStringAsFixed(0)} kg", style: GoogleFonts.poppins(fontSize: 12)),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16),
          ),
        );
      }).toList(),
    );
  }

  // ================= SETTINGS =================

  Widget _buildSettings() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
      child: Column(
        children: [
          _settingTile(Icons.person_outline, "Edit Profil"),
          _settingTile(Icons.lock_outline, "Privasi & Keamanan"),
          _settingTile(Icons.notifications_none, "Notifikasi"),
          _settingTile(Icons.help_outline, "Bantuan"),
          _settingTile(Icons.info_outline, "Tentang Aplikasi"),
          _settingTile(Icons.logout, "Keluar", isLogout: true),
        ],
      ),
    );
  }

  Widget _settingTile(IconData icon, String title, {bool isLogout = false}) {
    return ListTile(
      leading: Icon(icon, color: isLogout ? Colors.red : AppTheme.primaryColor),
      title: Text(title, style: GoogleFonts.poppins(color: isLogout ? Colors.red : const Color(0xFF1A2B4C), fontWeight: FontWeight.w500)),
      trailing: Icon(Icons.arrow_forward_ios, size: 16, color: isLogout ? Colors.red : Colors.grey[400]),
      onTap: () {
        if (isLogout) {
          _logout();
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text("Fitur $title akan segera tersedia"), behavior: SnackBarBehavior.floating),
          );
        }
      },
    );
  }

  // ================= DIALOGS =================

  void _showSettingsMenu() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (_) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(leading: const Icon(Icons.language), title: const Text("Bahasa"), trailing: const Text("Indonesia"), onTap: () => Navigator.pop(context)),
            ListTile(
              leading: const Icon(Icons.dark_mode),
              title: const Text("Mode Gelap"),
              trailing: Switch(value: false, onChanged: (_) {}),
              onTap: () {},
            ),
            ListTile(leading: const Icon(Icons.verified_user), title: const Text("Verifikasi Identitas"), onTap: () => Navigator.pop(context)),
          ],
        ),
      ),
    );
  }

  // ================= HELPERS =================

  Color _getLevelColor(String level) {
    switch (level.toLowerCase()) {
      case 'gold': return const Color(0xFFFFD700);
      case 'silver': return const Color(0xFFC0C0C0);
      case 'platinum': return const Color(0xFFE5E4E2);
      default: return const Color(0xFFCD7F32);
    }
  }
}