import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/herd_theme.dart';

class TernakScreen extends StatefulWidget {
  const TernakScreen({super.key});

  @override
  State<TernakScreen> createState() => _TernakScreenState();
}

class _TernakScreenState extends State<TernakScreen> {
  final List<Map<String, dynamic>> _ternak = [
    {"id": "S001", "name": "Sapi Limosin", "gender": "Jantan", "age": "2 tahun", "weight": "350 kg", "health": "Sehat", "status": "Aktif"},
    {"id": "S002", "name": "Sapi Brahman", "gender": "Betina", "age": "1.5 tahun", "weight": "400 kg", "health": "Sehat", "status": "Aktif"},
    {"id": "S003", "name": "Sapi Madura", "gender": "Jantan", "age": "3 tahun", "weight": "280 kg", "health": "Sakit", "status": "Perawatan"},
    {"id": "S004", "name": "Sapi Simmental", "gender": "Betina", "age": "2.5 tahun", "weight": "420 kg", "health": "Sehat", "status": "Aktif"},
    {"id": "S005", "name": "Sapi Ongole", "gender": "Jantan", "age": "1 tahun", "weight": "220 kg", "health": "Sehat", "status": "Aktif"},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F8F2),
      appBar: AppBar(
        title: Text("Manajemen Ternak", style: GoogleFonts.poppins(fontWeight: FontWeight.bold, color: Colors.green)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(icon: const Icon(Icons.add), onPressed: () {}),
          IconButton(icon: const Icon(Icons.search), onPressed: () {}),
        ],
      ),
      body: Column(
        children: [
          _buildSummaryCard(),
          const SizedBox(height: 16),
          _buildFilterChips(),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _ternak.length,
              itemBuilder: (context, index) => _buildTernakCard(_ternak[index]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryCard() {
    int total = _ternak.length;
    int sehat = _ternak.where((t) => t["health"] == "Sehat").length;
    int sakit = _ternak.where((t) => t["health"] == "Sakit").length;
    
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
          _summaryItem(Icons.pets, "Total", total.toString()),
          _summaryItem(Icons.favorite, "Sehat", sehat.toString()),
          _summaryItem(Icons.sick, "Sakit", sakit.toString()),
        ],
      ),
    );
  }

  Widget _summaryItem(IconData icon, String label, String value) {
    return Column(
      children: [
        Icon(icon, color: Colors.white, size: 28),
        const SizedBox(height: 4),
        Text(value, style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
        Text(label, style: GoogleFonts.poppins(fontSize: 11, color: Colors.white70)),
      ],
    );
  }

  Widget _buildFilterChips() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          FilterChip(label: Text("Semua"), selected: true, onSelected: (v) {}),
          const SizedBox(width: 8),
          FilterChip(label: Text("Jantan"), selected: false, onSelected: (v) {}),
          const SizedBox(width: 8),
          FilterChip(label: Text("Betina"), selected: false, onSelected: (v) {}),
          const SizedBox(width: 8),
          FilterChip(label: Text("Sehat"), selected: false, onSelected: (v) {}),
          const SizedBox(width: 8),
          FilterChip(label: Text("Sakit"), selected: false, onSelected: (v) {}),
        ],
      ),
    );
  }

  Widget _buildTernakCard(Map<String, dynamic> ternak) {
    Color healthColor = ternak["health"] == "Sehat" ? Colors.green : Colors.red;
    
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
            width: 60, height: 60,
            decoration: BoxDecoration(
              color: Colors.green.withOpacity(0.1),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(Icons.pets, size: 30, color: Colors.green),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(ternak["name"], style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold)),
                Text("ID: ${ternak["id"]} • ${ternak["gender"]} • ${ternak["age"]}", style: GoogleFonts.poppins(fontSize: 11, color: Colors.grey[600])),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Icon(Icons.fitness_center, size: 14, color: Colors.grey[500]),
                    const SizedBox(width: 4),
                    Text(ternak["weight"], style: GoogleFonts.poppins(fontSize: 11)),
                    const SizedBox(width: 16),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: healthColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(ternak["health"], style: GoogleFonts.poppins(fontSize: 10, color: healthColor)),
                    ),
                  ],
                ),
              ],
            ),
          ),
          Icon(Icons.chevron_right, color: Colors.grey[400]),
        ],
      ),
    );
  }
}

