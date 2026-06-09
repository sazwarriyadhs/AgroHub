import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/herd_theme.dart';

class PakanScreen extends StatefulWidget {
  const PakanScreen({super.key});

  @override
  State<PakanScreen> createState() => _PakanScreenState();
}

class _PakanScreenState extends State<PakanScreen> {
  final List<Map<String, dynamic>> _pakan = [
    {"name": "Konsentrat Premium", "stock": 150, "unit": "kg", "price": "Rp 350.000", "supplier": "PT AgroFeed", "status": "Cukup"},
    {"name": "Rumput Gajah", "stock": 500, "unit": "kg", "price": "Rp 150.000", "supplier": "Peternak Lokal", "status": "Stok Aman"},
    {"name": "Vitamin Ternak", "stock": 25, "unit": "botol", "price": "Rp 125.000", "supplier": "Vet Shop", "status": "Habis"},
    {"name": "Jerami Fermentasi", "stock": 200, "unit": "kg", "price": "Rp 200.000", "supplier": "Agro Indah", "status": "Cukup"},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F8F2),
      appBar: AppBar(
        title: Text("Manajemen Pakan", style: GoogleFonts.poppins(fontWeight: FontWeight.bold, color: Colors.green)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(icon: const Icon(Icons.add), onPressed: () {}),
        ],
      ),
      body: Column(
        children: [
          _buildStockSummary(),
          const SizedBox(height: 16),
          _buildRestokCard(),
          const SizedBox(height: 16),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _pakan.length,
              itemBuilder: (context, index) => _buildPakanCard(_pakan[index]),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        backgroundColor: Colors.green,
        child: const Icon(Icons.shopping_cart),
      ),
    );
  }

  Widget _buildStockSummary() {
    int totalStock = _pakan.fold(0, (sum, item) => sum + (item["stock"] as int));
    
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
          _summaryItem(Icons.inventory, "Total Stok", "$totalStock kg"),
          _summaryItem(Icons.restaurant, "Jenis Pakan", _pakan.length.toString()),
          _summaryItem(Icons.warning, "Stok Habis", "1"),
        ],
      ),
    );
  }

  Widget _summaryItem(IconData icon, String label, String value) {
    return Column(
      children: [
        Icon(icon, color: Colors.white, size: 28),
        const SizedBox(height: 4),
        Text(value, style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
        Text(label, style: GoogleFonts.poppins(fontSize: 10, color: Colors.white70)),
      ],
    );
  }

  Widget _buildRestokCard() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.orange.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.orange.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.orange.withOpacity(0.2),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Icon(Icons.warning, color: Colors.orange),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("Perlu Restok!", style: GoogleFonts.poppins(fontWeight: FontWeight.bold)),
                Text("Vitamin ternak habis. Segera pesan.", style: GoogleFonts.poppins(fontSize: 11, color: Colors.grey[600])),
              ],
            ),
          ),
          ElevatedButton(
            onPressed: () {},
            style: ElevatedButton.styleFrom(backgroundColor: Colors.orange),
            child: Text("Pesan", style: GoogleFonts.poppins(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  Widget _buildPakanCard(Map<String, dynamic> pakan) {
    Color statusColor;
    switch (pakan["status"]) {
      case "Habis": statusColor = Colors.red; break;
      case "Stok Aman": statusColor = Colors.green; break;
      default: statusColor = Colors.orange;
    }
    
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                width: 50, height: 50,
                decoration: BoxDecoration(
                  color: Colors.green.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(Icons.restaurant, color: Colors.green),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(pakan["name"], style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold)),
                    Text("${pakan["stock"]} ${pakan["unit"]} • ${pakan["supplier"]}", style: GoogleFonts.poppins(fontSize: 11, color: Colors.grey[600])),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(pakan["status"], style: GoogleFonts.poppins(fontSize: 10, color: statusColor)),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () {},
                  style: OutlinedButton.styleFrom(side: BorderSide(color: Colors.green)),
                  child: Text("Detail", style: GoogleFonts.poppins(color: Colors.green)),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                  child: Text("Pesan", style: GoogleFonts.poppins(color: Colors.white)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

