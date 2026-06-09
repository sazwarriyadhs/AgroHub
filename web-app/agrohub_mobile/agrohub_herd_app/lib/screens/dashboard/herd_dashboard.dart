import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../providers/herd_provider.dart';
import '../../core/routes/app_routes.dart';

class HerdDashboard extends StatefulWidget {
  const HerdDashboard({super.key});

  @override
  State<HerdDashboard> createState() => _HerdDashboardState();
}

class _HerdDashboardState extends State<HerdDashboard> {
  int _selectedBottomNavIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<HerdProvider>().loadDashboardData();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1B5E20),
      body: Stack(
        children: [
          Container(
            height: 290,
            decoration: const BoxDecoration(
              color: Color(0xFFE8F5E9),
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(36),
                bottomRight: Radius.circular(36),
              ),
            ),
          ),
          SafeArea(
            child: RefreshIndicator(
              onRefresh: () async {
                await context.read<HerdProvider>().refreshData();
              },
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildCustomAppBar(),
                    const SizedBox(height: 10),
                    _buildHeroCard(),
                    const SizedBox(height: 16),
                    _buildStatsRow(),
                    const SizedBox(height: 16),
                    _buildMarketInsight(),
                    const SizedBox(height: 24),
                    _buildMenuSection(context),
                    const SizedBox(height: 20),
                    _buildRecentActivity(),
                    const SizedBox(height: 100),
                  ],
                ),
              ),
            ),
          ),
          Positioned(
            bottom: 96,
            right: 16,
            child: FloatingActionButton.extended(
              backgroundColor: const Color(0xFFE8F5E9),
              elevation: 4,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(30),
              ),
              icon: const Icon(Icons.add, color: Color(0xFF1B5E20)),
              label: Text(
                "Tambah Ternak",
                style: GoogleFonts.poppins(
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF1B5E20),
                ),
              ),
              onPressed: () {
                Navigator.pushNamed(context, AppRoutes.tambahTernak);
              },
            ),
          ),
        ],
      ),
      bottomNavigationBar: _buildBottomNavigationBar(),
    );
  }

  Widget _buildCustomAppBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              const Icon(Icons.eco, color: Color(0xFF1B5E20), size: 28),
              const SizedBox(width: 8),
              Text(
                'AgroHub',
                style: GoogleFonts.poppins(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                  color: const Color(0xFF1B5E20),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                margin: const EdgeInsets.only(left: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFF1B5E20),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  'HERD',
                  style: GoogleFonts.poppins(
                    fontSize: 8,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.notifications_none, color: Color(0xFF1B5E20), size: 28),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("Fitur notifikasi segera hadir")),
                  );
                },
              ),
              Positioned(
                right: 6,
                top: 6,
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: const BoxDecoration(
                    color: Color(0xFFE53935),
                    shape: BoxShape.circle,
                  ),
                  constraints: const BoxConstraints(
                    minWidth: 16,
                    minHeight: 16,
                  ),
                  child: const Text(
                    '3',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              )
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildHeroCard() {
    return Consumer<HerdProvider>(
      builder: (context, provider, _) {
        final stats = provider.stats;
        final total = stats?.totalTernak ?? 0;
        final totalValue = stats?.totalNilai ?? 0;
        
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: GestureDetector(
            onTap: () {
              Navigator.pushNamed(context, AppRoutes.ternak);
            },
            child: Container(
              height: 180,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.15),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(24),
                child: Stack(
                  children: [
                    Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [const Color(0xFF1B5E20), const Color(0xFF2E7D32)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                      ),
                    ),
                    Positioned.fill(
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [Colors.black.withOpacity(0.4), Colors.transparent],
                            begin: Alignment.bottomLeft,
                            end: Alignment.topRight,
                          ),
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(6),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.2),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(Icons.pets, size: 20, color: Colors.white),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                "Herd Overview",
                                style: GoogleFonts.poppins(
                                  color: Colors.white.withOpacity(0.9),
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          if (provider.isLoading)
                            const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          else
                            Text(
                              "$total Ternak",
                              style: GoogleFonts.poppins(
                                color: Colors.white,
                                fontSize: 26,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          const SizedBox(height: 8),
                          Text(
                            "Estimasi nilai",
                            style: GoogleFonts.poppins(
                              color: Colors.white.withOpacity(0.8),
                              fontSize: 12,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(30),
                            ),
                            child: Text(
                              provider.isLoading ? "Loading..." : _formatCurrency(totalValue),
                              style: GoogleFonts.poppins(
                                color: const Color(0xFF1B5E20),
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
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
          ),
        );
      },
    );
  }

  Widget _buildStatsRow() {
    return Consumer<HerdProvider>(
      builder: (context, provider, _) {
        final stats = provider.stats;
        
        if (provider.isLoading && stats == null) {
          return const Padding(
            padding: EdgeInsets.symmetric(horizontal: 12),
            child: LinearProgressIndicator(),
          );
        }
        
        final statItems = [
          {
            "title": "Sehat", 
            "value": "${stats?.sehat ?? 0}", 
            "percent": _calculatePercentage(stats?.sehat ?? 0, stats?.totalTernak ?? 1), 
            "icon": Icons.favorite, 
            "color": const Color(0xFF2E7D32), 
            "bg": const Color(0xFFE8F5E9)
          },
          {
            "title": "Sakit", 
            "value": "${stats?.sakit ?? 0}", 
            "percent": _calculatePercentage(stats?.sakit ?? 0, stats?.totalTernak ?? 1), 
            "icon": Icons.sick, 
            "color": const Color(0xFFC62828), 
            "bg": const Color(0xFFFFEBEE)
          },
          {
            "title": "Bunting", 
            "value": "${stats?.bunting ?? 0}", 
            "percent": _calculatePercentage(stats?.bunting ?? 0, stats?.totalTernak ?? 1), 
            "icon": Icons.pregnant_woman, 
            "color": const Color(0xFFEF6C00), 
            "bg": const Color(0xFFFFF3E0)
          },
          {
            "title": "Jantan", 
            "value": "${stats?.jantan ?? 0}", 
            "percent": "${stats?.jantan ?? 0}", 
            "icon": Icons.male, 
            "color": const Color(0xFF1565C0), 
            "bg": const Color(0xFFE3F2FD)
          },
        ];

        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Row(
            children: statItems.map((stat) {
              return Expanded(
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 4),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 6,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: stat["bg"] as Color,
                          shape: BoxShape.circle,
                        ),
                        child: Icon(stat["icon"] as IconData, color: stat["color"] as Color, size: 22),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        stat["value"] as String,
                        style: GoogleFonts.poppins(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      Text(
                        stat["title"] as String,
                        style: GoogleFonts.poppins(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey[700],
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        stat["percent"] as String,
                        style: GoogleFonts.poppins(
                          fontSize: 9,
                          color: Colors.grey[500],
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        );
      },
    );
  }

  String _calculatePercentage(int value, int total) {
    if (total == 0) return "0%";
    final percentage = (value * 100 / total).round();
    return "$percentage%";
  }

  Widget _buildMarketInsight() {
    return Consumer<HerdProvider>(
      builder: (context, provider, _) {
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: GestureDetector(
            onTap: () {
              Navigator.pushNamed(context, AppRoutes.marketplace);
            },
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: const BoxDecoration(
                      color: Color(0xFF1B5E20),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.trending_up, color: Colors.white, size: 24),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              "Insight Pasar",
                              style: GoogleFonts.poppins(
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                                color: const Color(0xFF1B5E20),
                              ),
                            ),
                            const SizedBox(width: 4),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: const Color(0xFFE8F5E9),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                "H+${_getDayOffset()}",
                                style: GoogleFonts.poppins(
                                  fontSize: 9,
                                  fontWeight: FontWeight.w600,
                                  color: const Color(0xFF1B5E20),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 2),
                        Text(
                          "Harga sapi naik 8% minggu ini. Waktu tepat untuk jual ternak 🚀",
                          style: GoogleFonts.poppins(fontSize: 11, color: Colors.black87),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFE8F5E9),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFC8E6C9)),
                    ),
                    child: Row(
                      children: [
                        Text(
                          "Lihat",
                          style: GoogleFonts.poppins(
                            color: const Color(0xFF1B5E20),
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const Icon(Icons.chevron_right, size: 14, color: Color(0xFF1B5E20)),
                      ],
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

  int _getDayOffset() {
    final now = DateTime.now();
    final epoch = DateTime(2024, 1, 1);
    return now.difference(epoch).inDays % 30;
  }

  Widget _buildMenuSection(BuildContext context) {
    final menus = [
      {"title": "Ternak", "icon": Icons.pets, "route": AppRoutes.ternak, "subtitle": "Data ternak"},
      {"title": "Kesehatan", "icon": Icons.health_and_safety, "route": AppRoutes.kesehatan, "subtitle": "Riwayat & vaksin"},
      {"title": "Pakan", "icon": Icons.grain, "route": AppRoutes.pakan, "subtitle": "Manajemen pakan"},
      {"title": "Keuangan", "icon": Icons.account_balance_wallet, "route": AppRoutes.keuangan, "subtitle": "Pemasukan"},
      {"title": "Market", "icon": Icons.storefront, "route": AppRoutes.marketplace, "subtitle": "Beli & jual"},
      {"title": "AI Advisor", "icon": Icons.smart_toy_outlined, "route": AppRoutes.ai, "subtitle": "Konsultasi"},
      {"title": "Komunitas", "icon": Icons.groups, "route": AppRoutes.komunitas, "subtitle": "Forum"},
      {"title": "Profil", "icon": Icons.person_outline, "route": AppRoutes.profile, "subtitle": "Akun"},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 18),
          child: Row(
            children: [
              Container(
                width: 4,
                height: 16,
                color: const Color(0xFFE8F5E9),
              ),
              const SizedBox(width: 8),
              Text(
                "Menu Utama",
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 4,
              mainAxisSpacing: 16,
              crossAxisSpacing: 4,
              childAspectRatio: 0.85,
            ),
            itemCount: menus.length,
            itemBuilder: (context, index) {
              final menu = menus[index];
              return GestureDetector(
                onTap: () {
                  HapticFeedback.lightImpact();
                  Navigator.pushNamed(context, menu["route"] as String);
                },
                child: Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 4,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Icon(menu["icon"] as IconData, size: 28, color: const Color(0xFF1B5E20)),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      menu["title"] as String,
                      style: GoogleFonts.poppins(
                        fontWeight: FontWeight.w600,
                        fontSize: 11,
                        color: Colors.white,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    Text(
                      menu["subtitle"] as String,
                      style: GoogleFonts.poppins(
                        fontSize: 8,
                        color: const Color(0xFFC8E6C9),
                      ),
                      textAlign: TextAlign.center,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildRecentActivity() {
    return Consumer<HerdProvider>(
      builder: (context, provider, _) {
        final activities = provider.recentActivities;
        
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 18),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 4,
                        height: 16,
                        color: const Color(0xFFE8F5E9),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        "Aktivitas Terkini",
                        style: GoogleFonts.poppins(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                  TextButton(
                    onPressed: () {
                      Navigator.pushNamed(context, AppRoutes.aktivitas);
                    },
                    child: Text(
                      "Lihat Semua",
                      style: GoogleFonts.poppins(
                        color: const Color(0xFFC8E6C9),
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            if (provider.isLoadingActivities)
              const Padding(
                padding: EdgeInsets.all(16),
                child: Center(child: CircularProgressIndicator()),
              )
            else if (activities.isEmpty)
              Padding(
                padding: const EdgeInsets.all(32),
                child: Center(
                  child: Column(
                    children: [
                      Icon(Icons.inbox, size: 48, color: Colors.grey[400]),
                      const SizedBox(height: 8),
                      Text(
                        "Belum ada aktivitas",
                        style: GoogleFonts.poppins(
                          color: Colors.white70,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              )
            else
              ...activities.map((activity) => _buildActivityRow(activity)),
          ],
        );
      },
    );
  }

  Widget _buildActivityRow(Map<String, dynamic> activity) {
    return GestureDetector(
      onTap: () {
        if (activity['route'] != null) {
          Navigator.pushNamed(context, activity['route']);
        }
      },
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(14),
          ),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: (activity['color'] as Color?)?.withOpacity(0.1) ?? const Color(0xFFE8F5E9),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(
                  activity['icon'] ?? Icons.pets,
                  color: activity['color'] ?? const Color(0xFF1B5E20),
                  size: 28,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            activity['title'] as String,
                            style: GoogleFonts.poppins(
                              fontWeight: FontWeight.bold,
                              fontSize: 13,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: (activity['color'] as Color).withOpacity(0.1),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            activity['status'] as String,
                            style: GoogleFonts.poppins(
                              fontSize: 9,
                              color: activity['color'] as Color,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      activity['desc'] as String,
                      style: GoogleFonts.poppins(fontSize: 11, color: Colors.grey[600]),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      activity['time'] as String,
                      style: GoogleFonts.poppins(fontSize: 10, color: Colors.grey[400]),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right, color: Colors.grey, size: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBottomNavigationBar() {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      backgroundColor: Colors.white,
      selectedItemColor: const Color(0xFF1B5E20),
      unselectedItemColor: Colors.grey,
      currentIndex: _selectedBottomNavIndex,
      onTap: (index) {
        setState(() {
          _selectedBottomNavIndex = index;
        });
        
        switch (index) {
          case 0:
            // Already on dashboard
            break;
          case 1:
            Navigator.pushNamed(context, AppRoutes.ternak);
            break;
          case 2:
            Navigator.pushNamed(context, AppRoutes.marketplace);
            break;
          case 3:
            Navigator.pushNamed(context, AppRoutes.profile);
            break;
        }
      },
      selectedLabelStyle: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w500),
      unselectedLabelStyle: GoogleFonts.poppins(fontSize: 11),
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Home'),
        BottomNavigationBarItem(icon: Icon(Icons.pets), label: 'Ternak'),
        BottomNavigationBarItem(icon: Icon(Icons.storefront), label: 'Market'),
        BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Profil'),
      ],
    );
  }

  String _formatCurrency(double amount) {
    final formatter = NumberFormat.currency(
      locale: 'id_ID',
      symbol: 'Rp ',
      decimalDigits: 0,
    );
    return formatter.format(amount);
  }
}