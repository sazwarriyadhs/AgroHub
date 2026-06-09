import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class MarketInsightScreen extends StatefulWidget {
  const MarketInsightScreen({super.key});

  @override
  State<MarketInsightScreen> createState() => _MarketInsightScreenState();
}

class _MarketInsightScreenState extends State<MarketInsightScreen> {
  bool _isNotified = false;

  void _toggleNotification() {
    setState(() {
      _isNotified = !_isNotified;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          _isNotified 
              ? '🔔 Mantap! Kami akan kabari kamu begitu fitur ini rilis.' 
              : 'Pemberitahuan dibatalkan.',
          style: GoogleFonts.poppins(fontSize: 13),
        ),
        behavior: SnackBarBehavior.floating,
        backgroundColor: _isNotified ? const Color(0xFF2E7D32) : Colors.grey.shade800,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAF7),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Text(
          "Insight Harga Pasar",
          style: GoogleFonts.poppins(
            color: const Color(0xFF1D271F),
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Badge Status
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: const Color(0xE1E8F8ED),
                  borderRadius: BorderRadius.circular(30),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.auto_awesome, size: 14, color: Color(0xFF2E7D32)),
                    const SizedBox(width: 6),
                    Text(
                      "FITUR BARU SNEAK PEEK",
                      style: GoogleFonts.poppins(
                        fontSize: 11,
                        color: const Color(0xFF2E7D32),
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.8,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),

              // Main Glowing Chart Icon Visual
              Center(
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    Container(
                      width: 140,
                      height: 140,
                      decoration: BoxDecoration(
                        color: const Color(0xFF2E7D32).withOpacity(0.04),
                        shape: BoxShape.circle,
                      ),
                    ),
                    Container(
                      width: 110,
                      height: 110,
                      decoration: BoxDecoration(
                        color: const Color(0xFF2E7D32).withOpacity(0.08),
                        shape: BoxShape.circle,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF2E7D32).withOpacity(0.1),
                            blurRadius: 25,
                            offset: const Offset(0, 12),
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.analytics_outlined,
                        size: 54,
                        color: Color(0xFF2E7D32),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),

              // Typography
              Text(
                "Pantau Harga Komoditas",
                textAlign: TextAlign.center,
                style: GoogleFonts.poppins(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF1D271F),
                ),
              ),
              const SizedBox(height: 10),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Text(
                  "Segera hadir grafik fluktuasi harga bahan pangan real-time langsung dari pasar induk terbesar.",
                  textAlign: TextAlign.center,
                  style: GoogleFonts.poppins(
                    fontSize: 13,
                    color: Colors.grey.shade600,
                    height: 1.5,
                  ),
                ),
              ),
              const SizedBox(height: 36),

              // Feature Teaser Cards
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.grey.shade200),
                ),
                child: Column(
                  children: [
                    _buildTeaserItem(
                      icon: Icons.trending_up_rounded,
                      title: "Analisis Tren Naik/Turun",
                      subtitle: "Prediksi harga pasar modal AI untuk seminggu ke depan.",
                    ),
                    const Divider(height: 24, thickness: 0.8),
                    _buildTeaserItem(
                      icon: Icons.notifications_active_outlined,
                      title: "Notifikasi Batas Harga",
                      subtitle: "Ping otomatis saat harga ayam atau daging menyentuh titik termurah.",
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 40),

              // Interactive Action Button
              SizedBox(
                width: double.infinity,
                height: 54,
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  child: ElevatedButton(
                    onPressed: _toggleNotification,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _isNotified ? const Color(0xFF1D271F) : const Color(0xFF2E7D32),
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          _isNotified ? Icons.check_circle : Icons.notifications_none_rounded,
                          color: Colors.white,
                          size: 20,
                        ),
                        const SizedBox(width: 10),
                        Text(
                          _isNotified ? "Sudah Terdaftar" : "Ingatkan Saya Jikalau Rilis",
                          style: GoogleFonts.poppins(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
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
  }

  Widget _buildTeaserItem({
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: const Color(0xFF2E7D32).withOpacity(0.06),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: const Color(0xFF2E7D32), size: 22),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: GoogleFonts.poppins(
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF1D271F),
                ),
              ),
              const SizedBox(height: 2),
              Text(
                subtitle,
                style: GoogleFonts.poppins(
                  fontSize: 11,
                  color: Colors.grey.shade500,
                ),
              ),
            ],
          ),
        )
      ],
    );
  }
}