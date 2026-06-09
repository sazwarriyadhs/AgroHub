// lib/features/membership/presentation/screens/membership_card_screen.dart

import 'dart:math';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';

class MembershipCardScreen extends StatefulWidget {
  final Map<String, dynamic>? user;
  final Map<String, dynamic>? membership;

  const MembershipCardScreen({
    super.key,
    this.user,
    this.membership,
  });

  @override
  State<MembershipCardScreen> createState() => _MembershipCardScreenState();
}

class _MembershipCardScreenState extends State<MembershipCardScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  // Data from constructor
  late Map<String, dynamic> _userData;
  late Map<String, dynamic> _membershipData;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 6),
    )..repeat();

    // Initialize data from widget parameters
    _initializeData();
  }

  void _initializeData() {
    final user = widget.user ?? {};
    final membership = widget.membership ?? {};
    
    _userData = user;
    
    final membershipType = _getMembershipTypeFromData(user, membership);
    final membershipId = _getMembershipId(user);
    
    _membershipData = {
      "membershipCode": _getMembershipCode(user, membership),
      "membershipType": membershipType,
      "planName": _getPlanName(membershipId, membershipType),
      "points": _getPoints(user, membership),
      "expiredAt": _getExpiryDate(user, membership),
      "createdAt": _getCreatedAt(user),
      "status": _getStatus(user),
    };
  }

  // ================= DATA EXTRACTORS =================
  
  String _getMembershipTypeFromData(Map<String, dynamic> user, Map<String, dynamic> membership) {
    if (membership['membership_type'] != null && membership['membership_type'].toString().isNotEmpty) {
      return membership['membership_type'].toString();
    }
    final value = user['membership_type']?.toString();
    if (value != null && value.isNotEmpty) return value;
    final roleValue = user['role']?.toString();
    if (roleValue != null && roleValue.isNotEmpty) {
      if (roleValue.toLowerCase() == 'gold') return 'Gold';
      if (roleValue.toLowerCase() == 'silver') return 'Silver';
      if (roleValue.toLowerCase() == 'platinum') return 'Platinum';
    }
    return 'Gold';
  }

  int _getMembershipId(Map<String, dynamic> user) {
    final value = user['membership_id'];
    if (value != null) return int.tryParse(value.toString()) ?? 4;
    return 4;
  }

  String _getMembershipCode(Map<String, dynamic> user, Map<String, dynamic> membership) {
    if (membership['membership_code'] != null && membership['membership_code'].toString().isNotEmpty) {
      return membership['membership_code'].toString();
    }
    final value = user['membership_code']?.toString();
    if (value != null && value.isNotEmpty) return value;
    return "AGH-${user['id'] ?? 41}-X82KQ";
  }

  String _getPlanName(int membershipId, String membershipType) {
    // Fallback to membership type based plan name
    switch (membershipType.toLowerCase()) {
      case 'gold': return "Premium Aqua Farmer";
      case 'silver': return "Professional Aqua Farmer";
      case 'platinum': return "Elite Aqua Farmer";
      default: return "Premium Aqua Farmer";
    }
  }

  int _getPoints(Map<String, dynamic> user, Map<String, dynamic> membership) {
    if (membership['points'] != null) {
      return int.tryParse(membership['points'].toString()) ?? 1250;
    }
    final value = user['loyalty_points'];
    if (value != null) return int.tryParse(value.toString()) ?? 1250;
    return 1250;
  }

  DateTime _getExpiryDate(Map<String, dynamic> user, Map<String, dynamic> membership) {
    if (membership['expiry_date'] != null) {
      final expiry = membership['expiry_date'];
      if (expiry is DateTime) return expiry;
      final parsed = DateTime.tryParse(expiry.toString());
      if (parsed != null) return parsed;
    }
    final value = user['membership_expiry'];
    if (value != null) {
      if (value is DateTime) return value;
      final parsed = DateTime.tryParse(value.toString());
      if (parsed != null) return parsed;
    }
    return DateTime.now().add(const Duration(days: 365));
  }

  DateTime _getCreatedAt(Map<String, dynamic> user) {
    final value = user['created_at'];
    if (value != null) {
      if (value is DateTime) return value;
      final parsed = DateTime.tryParse(value.toString());
      if (parsed != null) return parsed;
    }
    return DateTime.now();
  }

  String _getStatus(Map<String, dynamic> user) {
    final isActive = user['is_active'] == true;
    return isActive ? "active" : "inactive";
  }

  // ================= GETTERS =================

  String get _fullName {
    return widget.user?['full_name'] ??
        widget.user?['name'] ??
        "Nelayan Lele Demo";
  }

  String get _phone {
    return widget.user?['phone'] ?? "-";
  }

  String get _region {
    final city = widget.user?['city'] ?? "";
    final province = widget.user?['province'] ?? "";
    if (city.isEmpty && province.isEmpty) return "-";
    return "$city, $province".replaceAll(RegExp(r',\s*$'), '');
  }

  String get _farmName {
    return widget.user?['farm_name'] ?? "Farm Aqua";
  }

  String get _role {
    final role = (widget.user?['role'] ?? "farmer").toString();
    return role == 'farmer' ? 'PETANI' : role.toUpperCase();
  }

  String get _status {
    return _membershipData['status'].toString().toLowerCase() == "active"
        ? "ACTIVE"
        : "INACTIVE";
  }
  
  String get _email {
    return widget.user?['email'] ?? "-";
  }
  
  Color get _membershipColor {
    final type = _membershipData["membershipType"].toString().toLowerCase();
    switch (type) {
      case 'gold':
        return const Color(0xFFFFD700);
      case 'silver':
        return const Color(0xFFC0C0C0);
      case 'platinum':
        return const Color(0xFFE5E4E2);
      default:
        return const Color(0xFFFFD700);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF07111F),
      body: Stack(
        children: [
          // Background blur circles
          Positioned(
            top: -120,
            right: -80,
            child: _blurCircle(320, const Color(0xFF00E5FF)),
          ),
          Positioned(
            bottom: -120,
            left: -80,
            child: _blurCircle(300, const Color(0xFF7C3AED)),
          ),
          // Animated particles
          Positioned.fill(
            child: AnimatedBuilder(
              animation: _controller,
              builder: (_, __) {
                return CustomPaint(
                  painter: _ParticlesPainter(_controller.value),
                );
              },
            ),
          ),
          // Main content
          SafeArea(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.symmetric(
                horizontal: 22,
                vertical: 18,
              ),
              child: Column(
                children: [
                  _buildHeader(),
                  const SizedBox(height: 34),
                  _buildPremiumCard(),
                  const SizedBox(height: 30),
                  _buildStats(),
                  const SizedBox(height: 24),
                  _buildMemberInfo(),
                  const SizedBox(height: 24),
                  _buildBenefits(),
                  const SizedBox(height: 30),
                  _buildActionButtons(),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      children: [
        _glassButton(
          icon: Icons.arrow_back_ios_new_rounded,
          onTap: () => Navigator.pop(context),
        ),
        const Spacer(),
        ShaderMask(
          shaderCallback: (bounds) {
            return const LinearGradient(
              colors: [Colors.white, Color(0xFF67E8F9)],
            ).createShader(bounds);
          },
          child: Text(
            "Membership Card",
            style: GoogleFonts.poppins(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.w800,
            ),
          ),
        ),
        const Spacer(),
        _glassButton(
          icon: Icons.more_vert_rounded,
          onTap: () => _showMoreMenu(),
        ),
      ],
    );
  }

  Widget _buildPremiumCard() {
    final String level = _membershipData["membershipType"].toString();
    final Color cardColor = _membershipColor;
    final DateTime expiryDate = _membershipData["expiredAt"] is DateTime 
        ? _membershipData["expiredAt"] 
        : DateTime.now().add(const Duration(days: 365));

    return AnimatedBuilder(
      animation: _controller,
      builder: (_, __) {
        return Transform.rotate(
          angle: sin(_controller.value * pi * 2) * 0.01,
          child: Container(
            height: 300,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(38),
              image: const DecorationImage(
                image: AssetImage("assets/images/card_bg.png"),
                fit: BoxFit.cover,
              ),
              boxShadow: [
                BoxShadow(
                  color: cardColor.withOpacity(0.45),
                  blurRadius: 40,
                  spreadRadius: 1,
                  offset: const Offset(0, 20),
                ),
              ],
            ),
            child: Stack(
              children: [
                // Decorative circles
                Positioned(
                  top: -40,
                  left: -30,
                  child: Container(
                    width: 180,
                    height: 180,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.white.withOpacity(0.15),
                    ),
                  ),
                ),
                Positioned(
                  bottom: -50,
                  right: -50,
                  child: Container(
                    width: 220,
                    height: 220,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.black.withOpacity(0.08),
                    ),
                  ),
                ),
                // Card content
                Padding(
                  padding: const EdgeInsets.all(28),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 62,
                            height: 62,
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(20),
                              gradient: const LinearGradient(
                                colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
                              ),
                            ),
                            child: const Icon(
                              Icons.waves_rounded,
                              color: Colors.white,
                              size: 32,
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  "AGROHUB AQUA",
                                  style: GoogleFonts.poppins(
                                    fontSize: 22,
                                    fontWeight: FontWeight.w800,
                                    color: const Color(0xFF1E293B),
                                    letterSpacing: 1,
                                  ),
                                ),
                                Text(
                                  _farmName,
                                  style: GoogleFonts.poppins(
                                    fontSize: 11,
                                    color: const Color(0xFF334155),
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const Spacer(),
                      Row(
                        children: [
                          Container(
                            width: 58,
                            height: 42,
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(12),
                              gradient: const LinearGradient(
                                colors: [Color(0xFFE2E8F0), Color(0xFF94A3B8)],
                              ),
                            ),
                          ),
                          const Spacer(),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 18,
                              vertical: 10,
                            ),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(40),
                              color: Colors.white.withOpacity(0.22),
                              border: Border.all(color: Colors.white54),
                            ),
                            child: Row(
                              children: [
                                const Icon(
                                  Icons.workspace_premium_rounded,
                                  size: 18,
                                  color: Color(0xFF1E293B),
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  level.toUpperCase(),
                                  style: GoogleFonts.poppins(
                                    color: const Color(0xFF1E293B),
                                    fontWeight: FontWeight.w800,
                                    letterSpacing: 1.2,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 26),
                      Text(
                        _fullName,
                        style: GoogleFonts.poppins(
                          fontSize: 28,
                          fontWeight: FontWeight.w800,
                          color: const Color(0xFF0F172A),
                          height: 1.1,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        _membershipData["planName"].toString(),
                        style: GoogleFonts.poppins(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF334155),
                        ),
                      ),
                      const SizedBox(height: 14),
                      Text(
                        _membershipData["membershipCode"].toString(),
                        style: GoogleFonts.spaceMono(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 2,
                          color: const Color(0xFF1E293B),
                        ),
                      ),
                      const SizedBox(height: 24),
                      Row(
                        children: [
                          Expanded(
                            child: _cardBottomInfo(
                              "VALID UNTIL",
                              DateFormat('dd MMM yyyy').format(expiryDate),
                            ),
                          ),
                          Expanded(
                            child: _cardBottomInfo(
                              "POINTS",
                              NumberFormat("#,###").format(
                                _membershipData["points"],
                              ),
                            ),
                          ),
                          Expanded(
                            child: _cardBottomInfo(
                              "STATUS",
                              _status,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _cardBottomInfo(String title, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: GoogleFonts.poppins(
            fontSize: 10,
            fontWeight: FontWeight.w700,
            letterSpacing: 1.4,
            color: const Color(0xFF475569),
          ),
        ),
        const SizedBox(height: 6),
        Text(
          value,
          style: GoogleFonts.poppins(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: const Color(0xFF0F172A),
          ),
        ),
      ],
    );
  }

  Widget _buildStats() {
    return Row(
      children: [
        Expanded(
          child: _statCard(
            "Total Points",
            NumberFormat("#,###").format(_membershipData["points"]),
            Icons.stars_rounded,
            const Color(0xFF06B6D4),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _statCard(
            "Membership",
            _membershipData["membershipType"].toString(),
            Icons.workspace_premium_rounded,
            const Color(0xFF8B5CF6),
          ),
        ),
      ],
    );
  }

  Widget _statCard(String title, String value, IconData icon, Color color) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(28),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.08),
            borderRadius: BorderRadius.circular(28),
            border: Border.all(color: Colors.white12),
          ),
          child: Column(
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: LinearGradient(
                    colors: [color, color.withOpacity(0.6)],
                  ),
                ),
                child: Icon(icon, color: Colors.white, size: 30),
              ),
              const SizedBox(height: 16),
              Text(
                value,
                style: GoogleFonts.poppins(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                title,
                style: GoogleFonts.poppins(
                  color: Colors.white70,
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMemberInfo() {
    return _glassContainer(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(18),
                  gradient: const LinearGradient(
                    colors: [Color(0xFF06B6D4), Color(0xFF2563EB)],
                  ),
                ),
                child: const Icon(Icons.person_rounded, color: Colors.white),
              ),
              const SizedBox(width: 16),
              Text(
                "Member Information",
                style: GoogleFonts.poppins(
                  color: Colors.white,
                  fontWeight: FontWeight.w700,
                  fontSize: 20,
                ),
              ),
            ],
          ),
          const SizedBox(height: 28),
          _infoRow("Full Name", _fullName),
          _divider(),
          _infoRow("Email", _email),
          _divider(),
          _infoRow("Phone", _phone),
          _divider(),
          _infoRow("Region", _region),
          _divider(),
          _infoRow("Farm", _farmName),
          _divider(),
          _infoRow("Role", _role),
          _divider(),
          _infoRow("Status", _status, isActive: true),
        ],
      ),
    );
  }

  Widget _infoRow(String title, String value, {bool isActive = false}) {
    if (value.isEmpty || value == "-") return const SizedBox.shrink();
    
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 14),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: GoogleFonts.poppins(
              color: Colors.white70,
              fontWeight: FontWeight.w500,
              fontSize: 13,
            ),
          ),
          Flexible(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                color: isActive
                    ? Colors.green.withOpacity(0.18)
                    : Colors.white.withOpacity(0.06),
              ),
              child: Text(
                value,
                textAlign: TextAlign.end,
                style: GoogleFonts.poppins(
                  color: isActive ? Colors.greenAccent : Colors.white,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBenefits() {
    final String level = _membershipData["membershipType"].toString();
    final bool isGold = level.toLowerCase() == 'gold';
    final bool isPlatinum = level.toLowerCase() == 'platinum';
    
    List<Map<String, dynamic>> benefits = [
      {
        "icon": Icons.discount_rounded,
        "title": "Special Discount",
        "subtitle": isGold || isPlatinum ? "15% off all feeds" : "10% off all feeds",
        "color": const Color(0xFF06B6D4),
      },
      {
        "icon": Icons.rocket_launch_rounded,
        "title": "Priority Access",
        "subtitle": isPlatinum ? "Early access + Beta features" : "Early access features",
        "color": const Color(0xFF8B5CF6),
      },
      {
        "icon": Icons.support_agent_rounded,
        "title": "VIP Support",
        "subtitle": isPlatinum ? "24/7 dedicated support" : "24/7 support access",
        "color": const Color(0xFFF59E0B),
      },
      {
        "icon": Icons.insights_rounded,
        "title": "AI Analytics",
        "subtitle": isGold || isPlatinum ? "Advanced AI insights" : "Basic farm insights",
        "color": const Color(0xFF10B981),
      },
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Exclusive Benefits",
          style: GoogleFonts.poppins(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.w700,
          ),
        ),
        const SizedBox(height: 18),
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 16,
          crossAxisSpacing: 16,
          childAspectRatio: 1.1,
          children: benefits.map((benefit) {
            return _benefitCard(
              benefit["icon"],
              benefit["title"],
              benefit["subtitle"],
              benefit["color"],
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _benefitCard(IconData icon, String title, String subtitle, Color color) {
    return _glassContainer(
      padding: 18,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(18),
              gradient: LinearGradient(
                colors: [color, color.withOpacity(0.7)],
              ),
            ),
            child: Icon(icon, color: Colors.white, size: 28),
          ),
          const Spacer(),
          Text(
            title,
            style: GoogleFonts.poppins(
              color: Colors.white,
              fontWeight: FontWeight.w700,
              fontSize: 15,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            subtitle,
            style: GoogleFonts.poppins(
              color: Colors.white70,
              fontSize: 11,
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons() {
    return Row(
      children: [
        Expanded(
          child: _actionButton(
            "Save Card",
            Icons.download_rounded,
            const [Color(0xFF06B6D4), Color(0xFF2563EB)],
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _actionButton(
            "Share",
            Icons.share_rounded,
            const [Color(0xFF7C3AED), Color(0xFF9333EA)],
          ),
        ),
      ],
    );
  }

  Widget _actionButton(String title, IconData icon, List<Color> colors) {
    return Container(
      height: 62,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: LinearGradient(colors: colors),
        boxShadow: [
          BoxShadow(
            color: colors.first.withOpacity(0.4),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(24),
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text("$title feature coming soon"),
                behavior: SnackBarBehavior.floating,
              ),
            );
          },
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: Colors.white),
              const SizedBox(width: 10),
              Text(
                title,
                style: GoogleFonts.poppins(
                  color: Colors.white,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showMoreMenu() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.info_outline),
              title: const Text("Card Details"),
              onTap: () => Navigator.pop(context),
            ),
            ListTile(
              leading: const Icon(Icons.receipt_long),
              title: const Text("Transaction History"),
              onTap: () => Navigator.pop(context),
            ),
            ListTile(
              leading: const Icon(Icons.help_outline),
              title: const Text("Help Center"),
              onTap: () => Navigator.pop(context),
            ),
          ],
        ),
      ),
    );
  }

  Widget _glassContainer({required Widget child, double padding = 24}) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(32),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
          padding: EdgeInsets.all(padding),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(32),
            color: Colors.white.withOpacity(0.08),
            border: Border.all(color: Colors.white12),
          ),
          child: child,
        ),
      ),
    );
  }

  Widget _glassButton({
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(18),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(18),
            child: Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.08),
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: Colors.white10),
              ),
              child: Icon(icon, color: Colors.white),
            ),
          ),
        ),
      ),
    );
  }

  Widget _divider() {
    return Container(height: 1, color: Colors.white10);
  }

  Widget _blurCircle(double size, Color color) {
    return ImageFiltered(
      imageFilter: ImageFilter.blur(sigmaX: 120, sigmaY: 120),
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: color.withOpacity(0.35),
        ),
      ),
    );
  }
}

class _ParticlesPainter extends CustomPainter {
  final double animation;

  _ParticlesPainter(this.animation);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = Colors.white.withOpacity(0.08);

    for (int i = 0; i < 45; i++) {
      final dx = (size.width * (i / 45)) +
          sin(animation * pi * 2 + i) * 20;
      final dy = ((size.height / 45) * i) +
          cos(animation * pi * 2 + i) * 30;

      canvas.drawCircle(
        Offset(dx, dy),
        (i % 4 + 1).toDouble(),
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}