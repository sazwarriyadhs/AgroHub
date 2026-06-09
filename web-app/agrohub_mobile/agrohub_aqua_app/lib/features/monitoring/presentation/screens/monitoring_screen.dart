// lib/features/monitoring/presentation/screens/monitoring_screen.dart

import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:agrohub_aqua_app/app/theme/app_theme.dart';
import '../../../dashboard/presentation/screens/aqua_dashboard.dart';

class MonitoringScreen extends StatefulWidget {
  const MonitoringScreen({super.key});

  @override
  State<MonitoringScreen> createState() => _MonitoringScreenState();
}

class _MonitoringScreenState extends State<MonitoringScreen> {
  int _selectedPondIndex = 0;
  late Timer _timer;
  
  // Data untuk chart
  List<FlSpot> _phSpots = [];
  List<FlSpot> _temperatureSpots = [];
  List<FlSpot> _doSpots = [];
  
  // Current values
  double _currentPh = 7.2;
  double _currentTemperature = 28.5;
  double _currentDo = 5.2;
  double _currentAmmonia = 0.1;
  
  final List<Map<String, dynamic>> _ponds = [
    {"id": "1", "name": "Kolam Lele 1", "status": "Aktif"},
    {"id": "2", "name": "Kolam Nila 1", "status": "Aktif"},
    {"id": "3", "name": "Kolam Gurame", "status": "Maintenance"},
  ];
  
  final List<Map<String, dynamic>> _historyData = [
    {"time": "00:00", "ph": 7.1, "temp": 28.0, "do": 5.0},
    {"time": "04:00", "ph": 7.0, "temp": 27.8, "do": 4.8},
    {"time": "08:00", "ph": 7.2, "temp": 28.2, "do": 5.1},
    {"time": "12:00", "ph": 7.3, "temp": 28.5, "do": 5.3},
    {"time": "16:00", "ph": 7.2, "temp": 28.8, "do": 5.2},
    {"time": "20:00", "ph": 7.1, "temp": 28.3, "do": 5.0},
  ];

  @override
  void initState() {
    super.initState();
    _initChartData();
    _startRealTimeUpdate();
  }
  
  void _initChartData() {
    _phSpots = _historyData.asMap().entries.map((entry) {
      return FlSpot(entry.key.toDouble(), entry.value["ph"] as double);
    }).toList();
    
    _temperatureSpots = _historyData.asMap().entries.map((entry) {
      return FlSpot(entry.key.toDouble(), entry.value["temp"] as double);
    }).toList();
    
    _doSpots = _historyData.asMap().entries.map((entry) {
      return FlSpot(entry.key.toDouble(), entry.value["do"] as double);
    }).toList();
  }
  
  void _startRealTimeUpdate() {
    _timer = Timer.periodic(const Duration(seconds: 3), (timer) {
      if (mounted) {
        setState(() {
          // Simulasi perubahan nilai real-time
          _currentPh = 7.0 + (DateTime.now().second % 5) / 10;
          _currentTemperature = 28.0 + (DateTime.now().second % 4) / 10;
          _currentDo = 5.0 + (DateTime.now().second % 3) / 10;
          _currentAmmonia = 0.05 + (DateTime.now().second % 10) / 100;
        });
      }
    });
  }
  
  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }
  
  Color _getPhColor(double ph) {
    if (ph < 6.5) return Colors.red;
    if (ph > 8.5) return Colors.red;
    if (ph < 7.0 || ph > 8.0) return Colors.orange;
    return Colors.green;
  }
  
  Color _getTempColor(double temp) {
    if (temp < 25 || temp > 32) return Colors.red;
    if (temp < 26 || temp > 30) return Colors.orange;
    return Colors.green;
  }
  
  Color _getDoColor(double doValue) {
    if (doValue < 3) return Colors.red;
    if (doValue < 4) return Colors.orange;
    return Colors.green;
  }
  
  String _getStatusText(double value, String type) {
    if (type == "ph") {
      if (value < 6.5) return "Asam";
      if (value > 8.5) return "Basa";
      if (value < 7.0 || value > 8.0) return "Normal -";
      return "Optimal";
    }
    if (type == "temp") {
      if (value < 25 || value > 32) return "Kritis";
      if (value < 26 || value > 30) return "Waspada";
      return "Optimal";
    }
    if (type == "do") {
      if (value < 3) return "Kritis";
      if (value < 4) return "Waspada";
      return "Optimal";
    }
    return "Normal";
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF3F6FB),
      appBar: AppBar(
        title: Text(
          "Monitoring Kualitas Air",
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.bold,
            color: AppTheme.primaryColor,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: AppTheme.primaryColor),
          onPressed: () => Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (_) => const AquaDashboard()),
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              setState(() {
                _initChartData();
              });
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildPondSelector(),
            const SizedBox(height: 20),
            _buildCurrentStatus(),
            const SizedBox(height: 20),
            _buildChartCard(),
            const SizedBox(height: 20),
            _buildHistoryTable(),
            const SizedBox(height: 20),
            _buildAIRecommendation(),
          ],
        ),
      ),
    );
  }
  
  Widget _buildPondSelector() {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: _ponds.asMap().entries.map((entry) {
          final index = entry.key;
          final pond = entry.value;
          final isSelected = _selectedPondIndex == index;
          return Expanded(
            child: GestureDetector(
              onTap: () => setState(() => _selectedPondIndex = index),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: isSelected ? AppTheme.primaryColor : Colors.transparent,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  children: [
                    Text(
                      pond["name"],
                      style: GoogleFonts.poppins(
                        color: isSelected ? Colors.white : Colors.grey[600],
                        fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                        fontSize: 13,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: pond["status"] == "Aktif" ? Colors.green : Colors.orange,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
  
  Widget _buildCurrentStatus() {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      crossAxisSpacing: 16,
      mainAxisSpacing: 16,
      childAspectRatio: 1.5,
      children: [
        _buildStatusCard(
          title: "pH Air",
          value: _currentPh.toStringAsFixed(1),
          unit: "",
          icon: Icons.science,
          color: _getPhColor(_currentPh),
          status: _getStatusText(_currentPh, "ph"),
        ),
        _buildStatusCard(
          title: "Suhu Air",
          value: _currentTemperature.toStringAsFixed(1),
          unit: "°C",
          icon: Icons.thermostat,
          color: _getTempColor(_currentTemperature),
          status: _getStatusText(_currentTemperature, "temp"),
        ),
        _buildStatusCard(
          title: "Oksigen Terlarut",
          value: _currentDo.toStringAsFixed(1),
          unit: "mg/L",
          icon: Icons.bubble_chart,
          color: _getDoColor(_currentDo),
          status: _getStatusText(_currentDo, "do"),
        ),
        _buildStatusCard(
          title: "Amonia",
          value: _currentAmmonia.toStringAsFixed(2),
          unit: "ppm",
          icon: Icons.warning,
          color: _currentAmmonia > 0.2 ? Colors.red : Colors.green,
          status: _currentAmmonia > 0.2 ? "Berbahaya" : "Aman",
        ),
      ],
    );
  }
  
  Widget _buildStatusCard({
    required String title,
    required String value,
    required String unit,
    required IconData icon,
    required Color color,
    required String status,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: color, size: 20),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  status,
                  style: GoogleFonts.poppins(
                    fontSize: 9,
                    color: color,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                value,
                style: GoogleFonts.poppins(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
              const SizedBox(width: 4),
              Text(
                unit,
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            title,
            style: GoogleFonts.poppins(
              fontSize: 11,
              color: Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildChartCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.show_chart, color: AppTheme.primaryColor),
              const SizedBox(width: 8),
              Text(
                "Grafik Kualitas Air (24 Jam)",
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: 200,
            child: LineChart(
              LineChartData(
                gridData: FlGridData(show: true),
                titlesData: FlTitlesData(
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      getTitlesWidget: (value, meta) {
                        if (value.toInt() >= 0 && value.toInt() < _historyData.length) {
                          return Text(
                            _historyData[value.toInt()]["time"],
                            style: const TextStyle(fontSize: 10),
                          );
                        }
                        return const Text("");
                      },
                    ),
                  ),
                  leftTitles: AxisTitles(
                    sideTitles: SideTitles(showTitles: true),
                  ),
                ),
                borderData: FlBorderData(show: false),
                lineBarsData: [
                  LineChartBarData(
                    spots: _phSpots,
                    isCurved: true,
                    color: Colors.blue,
                    barWidth: 3,
                    dotData: FlDotData(show: false),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _buildChartLegend(Colors.blue, "pH"),
              const SizedBox(width: 16),
              _buildChartLegend(Colors.red, "Suhu"),
              const SizedBox(width: 16),
              _buildChartLegend(Colors.green, "DO"),
            ],
          ),
        ],
      ),
    );
  }
  
  Widget _buildChartLegend(Color color, String label) {
    return Row(
      children: [
        Container(
          width: 12,
          height: 12,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 4),
        Text(
          label,
          style: GoogleFonts.poppins(fontSize: 11),
        ),
      ],
    );
  }
  
  Widget _buildHistoryTable() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.history, color: AppTheme.primaryColor),
              const SizedBox(width: 8),
              Text(
                "Riwayat Pengukuran",
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: DataTable(
              columnSpacing: 20,
              columns: const [
                DataColumn(label: Text("Waktu")),
                DataColumn(label: Text("pH")),
                DataColumn(label: Text("Suhu")),
                DataColumn(label: Text("DO")),
                DataColumn(label: Text("Status")),
              ],
              rows: _historyData.reversed.map((data) {
                final ph = data["ph"] as double;
                final status = ph >= 6.5 && ph <= 8.5 ? "Normal" : "Kritis";
                return DataRow(cells: [
                  DataCell(Text(data["time"])),
                  DataCell(Text(data["ph"].toString())),
                  DataCell(Text("${data["temp"]}°C")),
                  DataCell(Text(data["do"].toString())),
                  DataCell(
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: status == "Normal" ? Colors.green.withOpacity(0.1) : Colors.red.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        status,
                        style: TextStyle(
                          color: status == "Normal" ? Colors.green : Colors.red,
                          fontSize: 10,
                        ),
                      ),
                    ),
                  ),
                ]);
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildAIRecommendation() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppTheme.primaryColor, AppTheme.primaryColor.withOpacity(0.7)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Icon(Icons.auto_awesome, color: Colors.white, size: 24),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "AI Rekomendasi",
                  style: GoogleFonts.poppins(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  "Kualitas air stabil. Pertahankan kondisi ini untuk hasil panen optimal.",
                  style: GoogleFonts.poppins(
                    color: Colors.white70,
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}


