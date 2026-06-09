import 'package:flutter/material.dart';

void main() {
  runApp(const AgroHubApp());
}

class AgroHubApp extends StatelessWidget {
  const AgroHubApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'AgroHub Mobile',
      theme: ThemeData(
        fontFamily: 'Inter',
        primaryColor: const Color(0xFF15803D),
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  Widget statCard(String title, String value, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(14),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(value,
                style: const TextStyle(
                    fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 4),
            Text(title,
                style: const TextStyle(fontSize: 11, color: Colors.grey)),
          ],
        ),
      ),
    );
  }

  Widget menuItem(IconData icon, String title) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.green.shade50,
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: Colors.green.shade700),
        ),
        const SizedBox(height: 6),
        Text(title, style: const TextStyle(fontSize: 11)),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      body: SafeArea(
        child: Column(
          children: [

            // 🔥 HEADER
            Container(
              padding: const EdgeInsets.all(20),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF15803D), Color(0xFF22C55E)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text("AgroHub Seller",
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold)),
                  SizedBox(height: 6),
                  Text("Halo, Tani Jaya 👋",
                      style: TextStyle(color: Colors.white, fontSize: 16)),
                  Text("Selamat datang kembali!",
                      style: TextStyle(color: Colors.white70, fontSize: 12)),
                ],
              ),
            ),

            // 🔥 CONTENT
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  children: [

                    // 💰 SALES CARD
                    Container(
                      margin: const EdgeInsets.all(16),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.05),
                            blurRadius: 10,
                          )
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text("Total Penjualan Hari Ini",
                              style: TextStyle(fontSize: 12, color: Colors.grey)),
                          SizedBox(height: 6),
                          Text("Rp 3.750.000",
                              style: TextStyle(
                                  fontSize: 22, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),

                    // 📊 STATS
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Row(
                        children: [
                          statCard("Pesanan", "124", Colors.blue),
                          const SizedBox(width: 8),
                          statCard("Produk", "56", Colors.green),
                          const SizedBox(width: 8),
                          statCard("Rating", "4.8", Colors.orange),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // 🔲 MENU GRID
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: GridView.count(
                        shrinkWrap: true,
                        crossAxisCount: 4,
                        crossAxisSpacing: 10,
                        mainAxisSpacing: 10,
                        physics: const NeverScrollableScrollPhysics(),
                        children: [
                          menuItem(Icons.add, "Produk"),
                          menuItem(Icons.shopping_bag, "Pesanan"),
                          menuItem(Icons.bar_chart, "Laporan"),
                          menuItem(Icons.chat, "Chat"),
                          menuItem(Icons.campaign, "Promo"),
                          menuItem(Icons.smart_toy, "AI"),
                          menuItem(Icons.settings, "Setting"),
                          menuItem(Icons.person, "Akun"),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // 🤖 AI CARD
                    Container(
                      margin: const EdgeInsets.all(16),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            Colors.green.shade400,
                            Colors.green.shade600
                          ],
                        ),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        children: const [
                          Icon(Icons.eco, color: Colors.white, size: 40),
                          SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              "AI Dokter Tanaman\nDiagnosa penyakit via foto",
                              style: TextStyle(
                                  color: Colors.white, fontSize: 13),
                            ),
                          )
                        ],
                      ),
                    ),

                    const SizedBox(height: 80),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),

      // 🔥 BOTTOM NAV
      bottomNavigationBar: BottomNavigationBar(
        selectedItemColor: Colors.green,
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: "Beranda"),
          BottomNavigationBarItem(icon: Icon(Icons.list), label: "Pesanan"),
          BottomNavigationBarItem(icon: Icon(Icons.store), label: "Produk"),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: "Akun"),
        ],
      ),
    );
  }
}

