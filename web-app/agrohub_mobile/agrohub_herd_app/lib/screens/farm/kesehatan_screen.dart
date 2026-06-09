import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/herd_theme.dart';

class KesehatanScreen extends StatefulWidget {
  const KesehatanScreen({super.key});

  @override
  State<KesehatanScreen> createState() => _KesehatanScreenState();
}

class _KesehatanScreenState extends State<KesehatanScreen> {
  int _selectedTab = 0;
  
  final List<Map<String, dynamic>> _vaksinasi = [
    {"name": "Sapi Limosin", "date": "20 Mei 2024", "type": "PMK", "status": "Sudah"},
    {"name": "Sapi Brahman", "date": "18 Mei 2024", "type": "Anthrax", "status": "Sudah"},
    {"name": "Sapi Madura", "date": "25 Mei 2024", "type": "PMK", "status": "Jadwal"},
    {"name": "Sapi Simmental", "date": "22 Mei 2024", "type": "Anthrax", "status": "Sudah"},
    {"name": "Sapi Ongole", "date": "28 Mei 2024", "type": "PMK", "status": "Jadwal"},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F8F2),
      appBar: AppBar(
        title: Text("Kesehatan Ternak", style: GoogleFonts.poppins(fontWeight: FontWeight.bold, color: Colors.green)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(icon: const Icon(Icons.add), onPressed: () {}),
        ],
      ),
      body: Column(
        children: [
          _buildHealthStats(),
          const SizedBox(height: 16),
          _buildTabBar(),
          Expanded(
            child: IndexedStack(
              index: _selectedTab,
              children: [
                _buildVaksinasiTab(),
                _buildPenyakitTab(),
                _buildRekamMedisTab(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHealthStats() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(colors: [Color(0xFF1B5E20), Color(0xFF43A047)]),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _statItem(Icons.favorite, "Sehat", "115"),
          _statItem(Icons.sick, "Sakit", "8"),
          _statItem(Icons.vaccines, "Vaksinasi", "124"),
        ],
      ),
    );
  }

  Widget _statItem(IconData icon, String label, String value) {
    return Column(
      children: [
        Icon(icon, color: Colors.white, size: 28),
        const SizedBox(height: 4),
        Text(value, style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
        Text(label, style: GoogleFonts.poppins(fontSize: 11, color: Colors.white70)),
      ],
    );
  }

  Widget _buildTabBar() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(28),
      ),
      child: Row(
        children: [
          _buildTab("Vaksinasi", 0),
          _buildTab("Penyakit", 1),
          _buildTab("Rekam Medis", 2),
        ],
      ),
    );
  }

  Widget _buildTab(String title, int index) {
    final isSelected = _selectedTab == index;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _selectedTab = index),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? Colors.green : Colors.transparent,
            borderRadius: BorderRadius.circular(24),
          ),
          child: Text(
            title,
            textAlign: TextAlign.center,
            style: GoogleFonts.poppins(
              color: isSelected ? Colors.white : Colors.grey[600],
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildVaksinasiTab() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _vaksinasi.length,
      itemBuilder: (context, index) {
        final item = _vaksinasi[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Row(
            children: [
              Container(
                width: 50, height: 50,
                decoration: BoxDecoration(
                  color: Colors.green.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(Icons.vaccines, color: Colors.green),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(item["name"], style: GoogleFonts.poppins(fontWeight: FontWeight.bold)),
                    Text("${item["type"]} • ${item["date"]}", style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey[600])),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: item["status"] == "Sudah" ? Colors.green.withOpacity(0.1) : Colors.orange.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(item["status"], style: GoogleFonts.poppins(fontSize: 11, color: item["status"] == "Sudah" ? Colors.green : Colors.orange)),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildPenyakitTab() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.health_and_safety, size: 80, color: Colors.grey[300]),
          const SizedBox(height: 16),
          Text("Tidak ada data penyakit", style: GoogleFonts.poppins(color: Colors.grey[600])),
        ],
      ),
    );
  }

  Widget _buildRekamMedisTab() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.assignment, size: 80, color: Colors.grey[300]),
          const SizedBox(height: 16),
          Text("Belum ada rekam medis", style: GoogleFonts.poppins(color: Colors.grey[600])),
        ],
      ),
    );
  }
}

