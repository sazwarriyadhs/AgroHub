import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/herd_theme.dart';

class MembershipScreen extends StatefulWidget {
  const MembershipScreen({super.key});

  @override
  State<MembershipScreen> createState() => _MembershipScreenState();
}

class _MembershipScreenState extends State<MembershipScreen>
    with TickerProviderStateMixin {  // 🔥 GANTI ke TickerProviderStateMixin
  bool _isLoading = false;
  bool _isFrontSide = true;
  bool _showConfetti = false;

  late AnimationController _flipController;
  late Animation<double> _flipAnimation;
  late AnimationController _glowController;

  // MEMBER DATA
  String _memberName = "BUDI PETERNAK";
  String _memberCode = "AGH-HRD-2026-X82KQ";
  String _joinDate = "12 Mei 2025";
  String _expiryDate = "12 Mei 2026";
  int _totalPoints = 2340;
  String _memberLevel = "Silver";

  // Level points requirement
  final Map<String, int> _levelPoints = {
    'bronze': 0,
    'silver': 1000,
    'gold': 5000,
    'platinum': 15000,
  };

  final List<Map<String, dynamic>> _benefits = [
    {"icon": Icons.discount_rounded, "title": "Diskon Spesial", "color": Colors.orange},
    {"icon": Icons.local_shipping_rounded, "title": "Gratis Ongkir", "color": Colors.green},
    {"icon": Icons.support_agent_rounded, "title": "Prioritas CS", "color": Colors.blue},
    {"icon": Icons.health_and_safety_rounded, "title": "Dokter Hewan", "color": Colors.teal},
    {"icon": Icons.school_rounded, "title": "Webinar Premium", "color": Colors.purple},
    {"icon": Icons.storefront_rounded, "title": "Fee Marketplace", "color": Colors.deepOrange},
  ];

  @override
  void initState() {
    super.initState();
    _flipController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );
    _flipAnimation = Tween<double>(begin: 0, end: pi).animate(
      CurvedAnimation(parent: _flipController, curve: Curves.easeInOut),
    );
    _glowController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _flipController.dispose();
    _glowController.dispose();
    super.dispose();
  }

  void _flipCard() {
    if (_isFrontSide) {
      _flipController.forward();
    } else {
      _flipController.reverse();
    }
    setState(() {
      _isFrontSide = !_isFrontSide;
    });
  }

  String getBadgeAsset() {
    switch (_memberLevel.toLowerCase()) {
      case 'gold':
        return 'assets/badge/gold.png';
      case 'silver':
        return 'assets/badge/silver.png';
      case 'bronze':
        return 'assets/badge/bronze.png';
      default:
        return 'assets/badge/bronze.png';
    }
  }

  Color getGlowColor() {
    switch (_memberLevel.toLowerCase()) {
      case 'gold':
        return Colors.amber;
      case 'silver':
        return Colors.grey.shade400;
      case 'bronze':
        return const Color(0xFFCD7F32);
      default:
        return Colors.green;
    }
  }

  @override
  Widget build(BuildContext context) {
    final isSmall = MediaQuery.of(context).size.width < 360;

    return Scaffold(
      backgroundColor: const Color(0xFFEFF5EC),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        title: Text(
          "Membership Card",
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold, color: Colors.green),
        ),
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new_rounded, color: Colors.green),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            onPressed: _flipCard,
            icon: Icon(Icons.flip_camera_android_rounded, color: Colors.green),
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator(color: Colors.green))
          : RefreshIndicator(
              color: Colors.green,
              onRefresh: () async => Future.delayed(const Duration(seconds: 1)),
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    _buildMembershipCard(),
                    const SizedBox(height: 20),
                    _buildStatsRow(),
                    const SizedBox(height: 20),
                    _buildBenefitsSection(isSmall),
                    const SizedBox(height: 20),
                    _buildTermsSection(),
                    const SizedBox(height: 20),
                    _buildSupportSection(),
                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ),
    );
  }

  // ================= MEMBERSHIP CARD =================
  Widget _buildMembershipCard() {
    return GestureDetector(
      onTap: _flipCard,
      child: AnimatedBuilder(
        animation: _flipAnimation,
        builder: (context, child) {
          final isFront = _flipAnimation.value < pi / 2;
          return Transform(
            alignment: Alignment.center,
            transform: Matrix4.identity()
              ..setEntry(3, 2, 0.001)
              ..rotateY(_flipAnimation.value),
            child: isFront
                ? _buildFrontCard()
                : Transform(
                    alignment: Alignment.center,
                    transform: Matrix4.rotationY(pi),
                    child: _buildBackCard(),
                  ),
          );
        },
      ),
    );
  }

  // ================= FRONT CARD =================
  Widget _buildFrontCard() {
    return LayoutBuilder(
      builder: (context, constraints) {
        final cardWidth = constraints.maxWidth;
        final scale = cardWidth / 380;

        return AspectRatio(
          aspectRatio: 1.58,
          child: Container(
            width: double.infinity,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(30),
              boxShadow: [
                BoxShadow(
                  color: Colors.green.withOpacity(0.35),
                  blurRadius: 30,
                  offset: const Offset(0, 15),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(30),
              child: Stack(
                children: [
                  Positioned.fill(
                    child: Image.asset(
                      'assets/images/depan.png',
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(color: Colors.green),
                    ),
                  ),
                  Positioned.fill(
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.centerLeft,
                          end: Alignment.centerRight,
                          colors: [
                            Colors.black.withOpacity(0.28),
                            Colors.transparent,
                          ],
                        ),
                      ),
                    ),
                  ),
                  // BADGE PREMIUM
                  Positioned(
                    top: 12 * scale,
                    right: 12 * scale,
                    child: AnimatedBuilder(
                      animation: _glowController,
                      builder: (context, child) {
                        return Container(
                          decoration: BoxDecoration(
                            boxShadow: [
                              BoxShadow(
                                color: getGlowColor().withOpacity(0.45),
                                blurRadius: 20 + (10 * _glowController.value),
                                spreadRadius: 2,
                              ),
                            ],
                          ),
                          child: Image.asset(
                            getBadgeAsset(),
                            width: 58 * scale,
                            fit: BoxFit.contain,
                            errorBuilder: (_, __, ___) => Container(
                              width: 58 * scale,
                              height: 58 * scale,
                              decoration: BoxDecoration(
                                color: getGlowColor(),
                                shape: BoxShape.circle,
                              ),
                              child: Icon(Icons.star, color: Colors.white, size: 30 * scale),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  FittedBox(
                    fit: BoxFit.scaleDown,
                    alignment: Alignment.topLeft,
                    child: SizedBox(
                      width: 380,
                      height: 240,
                      child: Padding(
                        padding: EdgeInsets.all(18 * scale),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                SizedBox(
                                  width: 100 * scale,
                                  height: 50 * scale,
                                  child: Image.asset(
                                    'assets/logo/herd.png',
                                    fit: BoxFit.contain,
                                    errorBuilder: (_, __, ___) => Icon(Icons.pets, size: 30 * scale, color: Colors.white),
                                  ),
                                ),
                                const Spacer(),
                              ],
                            ),
                            const Spacer(),
                            Text(
                              "DIGITAL MEMBER CARD",
                              style: GoogleFonts.poppins(
                                fontSize: 9 * scale,
                                letterSpacing: 1.5,
                                color: Colors.white.withOpacity(0.85),
                              ),
                            ),
                            SizedBox(height: 4 * scale),
                            Text(
                              "PETERNAK INDONESIA",
                              style: GoogleFonts.poppins(
                                fontSize: 20 * scale,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            SizedBox(height: 12 * scale),
                            // MEMBER CODE
                            Container(
                              padding: EdgeInsets.all(10 * scale),
                              decoration: BoxDecoration(
                                color: Colors.black.withOpacity(0.45),
                                borderRadius: BorderRadius.circular(16 * scale),
                              ),
                              child: Row(
                                children: [
                                  Icon(Icons.qr_code_rounded, color: Colors.white, size: 22 * scale),
                                  SizedBox(width: 8 * scale),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          "Kode Membership",
                                          style: GoogleFonts.poppins(fontSize: 8 * scale, color: Colors.white.withOpacity(0.75)),
                                        ),
                                        SizedBox(height: 2 * scale),
                                        Text(
                                          _memberCode,
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                          style: GoogleFonts.poppins(fontSize: 12 * scale, fontWeight: FontWeight.bold, color: Colors.white),
                                        ),
                                      ],
                                    ),
                                  ),
                                  IconButton(
                                    onPressed: () async {
                                      await Clipboard.setData(ClipboardData(text: _memberCode));
                                      if (!mounted) return;
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        const SnackBar(content: Text("Kode membership disalin"), duration: Duration(seconds: 1)),
                                      );
                                    },
                                    icon: Icon(Icons.copy_rounded, color: Colors.white, size: 16 * scale),
                                  ),
                                ],
                              ),
                            ),
                            SizedBox(height: 10 * scale),
                            // INFO ROW 1
                            Row(
                              children: [
                                Expanded(child: _buildInfoItem("Nama Member", _memberName, scale)),
                                Expanded(child: _buildInfoItem("Bergabung", _joinDate, scale)),
                              ],
                            ),
                            SizedBox(height: 8 * scale),
                            // INFO ROW 2
                            Row(
                              children: [
                                Expanded(child: _buildInfoItem("Berlaku Hingga", _expiryDate, scale)),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        "Total Points",
                                        style: GoogleFonts.poppins(fontSize: 8 * scale, color: Colors.white.withOpacity(0.8)),
                                      ),
                                      Row(
                                        children: [
                                          Text(
                                            "$_totalPoints",
                                            style: GoogleFonts.poppins(fontSize: 18 * scale, fontWeight: FontWeight.bold, color: Colors.white),
                                          ),
                                          SizedBox(width: 4 * scale),
                                          Text("pts", style: GoogleFonts.poppins(fontSize: 8 * scale, color: Colors.white.withOpacity(0.8))),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            SizedBox(height: 10 * scale),
                            // TAGLINE
                            Container(
                              width: double.infinity,
                              padding: EdgeInsets.symmetric(vertical: 8 * scale, horizontal: 12 * scale),
                              decoration: BoxDecoration(
                                color: Colors.black.withOpacity(0.45),
                                borderRadius: BorderRadius.circular(14 * scale),
                              ),
                              child: Text(
                                "Semua solusi peternakan modern dalam satu genggaman",
                                textAlign: TextAlign.center,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: GoogleFonts.poppins(fontSize: 8 * scale, color: Colors.white.withOpacity(0.9)),
                              ),
                            ),
                            SizedBox(height: 8 * scale),
                            // FLIP HINT
                            Center(
                              child: Container(
                                padding: EdgeInsets.symmetric(horizontal: 8 * scale, vertical: 3 * scale),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.14),
                                  borderRadius: BorderRadius.circular(20 * scale),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(Icons.touch_app_rounded, size: 10 * scale, color: Colors.white.withOpacity(0.8)),
                                    SizedBox(width: 4 * scale),
                                    Text("Tap card to flip", style: GoogleFonts.poppins(fontSize: 7 * scale, color: Colors.white.withOpacity(0.8))),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  // ================= BACK CARD =================
  Widget _buildBackCard() {
    return LayoutBuilder(
      builder: (context, constraints) {
        final cardWidth = constraints.maxWidth;
        final scale = cardWidth / 380;

        return AspectRatio(
          aspectRatio: 1.58,
          child: Container(
            width: double.infinity,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(30),
              boxShadow: [
                BoxShadow(
                  color: Colors.green.withOpacity(0.35),
                  blurRadius: 30,
                  offset: const Offset(0, 15),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(30),
              child: Stack(
                children: [
                  Positioned.fill(
                    child: Image.asset(
                      'assets/images/belakang.png',
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(color: Colors.green),
                    ),
                  ),
                  Positioned.fill(child: Container(color: Colors.black.withOpacity(0.15))),
                  FittedBox(
                    fit: BoxFit.scaleDown,
                    alignment: Alignment.center,
                    child: SizedBox(
                      width: 380,
                      height: 240,
                      child: Padding(
                        padding: EdgeInsets.all(16 * scale),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Spacer(),
                            SizedBox(
                              width: 80 * scale,
                              height: 40 * scale,
                              child: Image.asset(
                                'assets/logo/herd.png',
                                fit: BoxFit.contain,
                                errorBuilder: (_, __, ___) => Icon(Icons.pets, size: 30 * scale, color: Colors.white),
                              ),
                            ),
                            SizedBox(height: 16 * scale),
                            Container(
                              width: 100 * scale,
                              height: 100 * scale,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(16 * scale),
                              ),
                              child: Icon(Icons.qr_code_rounded, size: 70 * scale, color: Colors.black),
                            ),
                            SizedBox(height: 12 * scale),
                            Text(
                              _memberCode,
                              style: GoogleFonts.poppins(fontSize: 11 * scale, fontWeight: FontWeight.bold, letterSpacing: 1.5, color: Colors.white),
                            ),
                            SizedBox(height: 12 * scale),
                            _buildGlassPanel(
                              child: Column(
                                children: [
                                  Text("Customer Care", style: GoogleFonts.poppins(fontSize: 9 * scale, color: Colors.white.withOpacity(0.8))),
                                  Text("0811 1234 5678", style: GoogleFonts.poppins(fontSize: 13 * scale, fontWeight: FontWeight.bold, color: Colors.white)),
                                ],
                              ),
                            ),
                            SizedBox(height: 8 * scale),
                            _buildGlassPanel(
                              child: Center(child: Text("www.agrohub.id", style: GoogleFonts.poppins(fontSize: 10 * scale, color: Colors.white))),
                            ),
                            SizedBox(height: 8 * scale),
                            Container(
                              padding: EdgeInsets.symmetric(horizontal: 8 * scale, vertical: 3 * scale),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.14),
                                borderRadius: BorderRadius.circular(20 * scale),
                              ),
                              child: Text("Tap card to flip", style: GoogleFonts.poppins(fontSize: 7 * scale, color: Colors.white.withOpacity(0.8))),
                            ),
                            const Spacer(),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildInfoItem(String title, String value, double scale) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: GoogleFonts.poppins(fontSize: 8 * scale, color: Colors.white.withOpacity(0.8))),
        const SizedBox(height: 2),
        Text(value, style: GoogleFonts.poppins(fontSize: 11 * scale, fontWeight: FontWeight.w600, color: Colors.white)),
      ],
    );
  }

  Widget _buildGlassPanel({required Widget child}) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.45),
        borderRadius: BorderRadius.circular(14),
      ),
      child: child,
    );
  }

  // ================= STATS ROW =================
  Widget _buildStatsRow() {
    return Row(
      children: [
        Expanded(child: _buildStatCard(icon: Icons.workspace_premium_rounded, title: "Level", value: _memberLevel.toUpperCase())),
        const SizedBox(width: 16),
        Expanded(child: _buildStatCard(icon: Icons.stars_rounded, title: "Points", value: "$_totalPoints")),
      ],
    );
  }

  Widget _buildStatCard({required IconData icon, required String title, required String value}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(color: Colors.green.withOpacity(0.1), borderRadius: BorderRadius.circular(14)),
            child: Icon(icon, color: Colors.green, size: 22),
          ),
          const SizedBox(height: 8),
          Text(title, style: GoogleFonts.poppins(fontSize: 11, color: Colors.grey[600])),
          const SizedBox(height: 2),
          Text(value, style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.green)),
        ],
      ),
    );
  }

  // ================= BENEFITS =================
  Widget _buildBenefitsSection(bool isSmall) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.verified_rounded, color: Colors.green),
              const SizedBox(width: 8),
              Text("Keuntungan Member", style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.green)),
            ],
          ),
          const SizedBox(height: 16),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _benefits.length,
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: isSmall ? 1 : 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 2.8,
            ),
            itemBuilder: (context, index) {
              final item = _benefits[index];
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                decoration: BoxDecoration(
                  color: (item["color"] as Color).withOpacity(0.08),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: (item["color"] as Color).withOpacity(0.15)),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: (item["color"] as Color).withOpacity(0.15),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(item["icon"], size: 16, color: item["color"]),
                    ),
                    const SizedBox(width: 10),
                    Expanded(child: Text(item["title"], style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w500))),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  // ================= TERMS =================
  Widget _buildTermsSection() {
    return ExpansionTile(
      tilePadding: const EdgeInsets.symmetric(horizontal: 20),
      collapsedBackgroundColor: Colors.white,
      backgroundColor: Colors.white,
      collapsedShape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      title: Text("Ketentuan Membership", style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.green)),
      leading: Icon(Icons.info_outline_rounded, color: Colors.green),
      childrenPadding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
      children: [
        _buildTerm("Kartu membership bersifat pribadi dan tidak dapat dipindahtangankan."),
        const SizedBox(height: 10),
        _buildTerm("Tunjukkan kartu membership untuk mendapatkan benefit."),
        const SizedBox(height: 10),
        _buildTerm("Point membership bertambah otomatis dari transaksi."),
      ],
    );
  }

  Widget _buildTerm(String text) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(Icons.check_circle_rounded, size: 16, color: Colors.green),
        const SizedBox(width: 8),
        Expanded(child: Text(text, style: GoogleFonts.poppins(fontSize: 11, color: Colors.grey[700], height: 1.5))),
      ],
    );
  }

  // ================= SUPPORT =================
  Widget _buildSupportSection() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            decoration: BoxDecoration(
              gradient: LinearGradient(colors: [Colors.green, Colors.green.withOpacity(0.8)]),
              borderRadius: BorderRadius.circular(18),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.download_rounded, color: Colors.white, size: 16),
                const SizedBox(width: 8),
                Text("Download Aplikasi", style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.white)),
              ],
            ),
          ),
          const SizedBox(height: 20),
          Divider(color: Colors.grey[200]),
          const SizedBox(height: 18),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(color: Colors.green.withOpacity(0.1), borderRadius: BorderRadius.circular(14)),
                child: const Icon(Icons.support_agent_rounded, color: Colors.green, size: 22),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Customer Care", style: GoogleFonts.poppins(fontSize: 11, color: Colors.grey[600])),
                  Text("0811 1234 5678", style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.green)),
                ],
              ),
            ],
          ),
          const SizedBox(height: 18),
          Divider(color: Colors.grey[200]),
          const SizedBox(height: 12),
          Text("AgroHub Herd", style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.green)),
          const SizedBox(height: 4),
          Text("www.agrohub.id", style: GoogleFonts.poppins(fontSize: 11, color: Colors.grey[600])),
        ],
      ),
    );
  }
}
