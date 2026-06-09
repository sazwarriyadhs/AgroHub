// lib/features/dashboard/presentation/screens/ai_insight_screen.dart
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class AiInsightScreen extends StatefulWidget {
  const AiInsightScreen({super.key});

  @override
  State<AiInsightScreen> createState() => _AiInsightScreenState();
}

class _AiInsightScreenState extends State<AiInsightScreen> {
  bool loading = true;
  String selectedCommodity = "Cabai Merah";

  double demandGrowth = 0.22;
  double priceForecast = 0.15;
  double confidence = 0.87;

  List<String> commodities = [
    "Cabai Merah",
    "Beras",
    "Tomat",
    "Bawang Merah",
    "Jagung",
  ];

  List<double> priceCurve = [10000, 10500, 11000, 12500, 14000, 13800, 14500];

  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() => loading = false);
      }
    });
  }

  void refreshAI() {
    setState(() => loading = true);

    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() {
          demandGrowth = 0.25;
          priceForecast = 0.18;
          confidence = 0.91;
          priceCurve = [10000, 10800, 12000, 13500, 15000, 15500, 16000];
          loading = false;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF02120D),
      appBar: AppBar(
        backgroundColor: const Color(0xFF031B13),
        title: const Text(
          "AI Doctor Pertanian",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
        ),
        centerTitle: true,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.white),
            onPressed: refreshAI,
          )
        ],
      ),
      body: loading ? _loading() : _body(),
    );
  }

  Widget _loading() {
    return const Center(
      child: CircularProgressIndicator(color: Color(0xFF1B5E20)),
    );
  }

  Widget _body() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _commoditySelector(),
          const SizedBox(height: 16),
          _aiHeader(),
          const SizedBox(height: 16),
          _metricsRow(),
          const SizedBox(height: 16),
          _priceChart(),
          const SizedBox(height: 16),
          _insightBox(),
          const SizedBox(height: 16),
          _riskCard(),
          const SizedBox(height: 16),
          _recommendationCard(),
        ],
      ),
    );
  }

  Widget _commoditySelector() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: commodities.map((c) {
          final active = c == selectedCommodity;
          return GestureDetector(
            onTap: () {
              setState(() {
                selectedCommodity = c;
                loading = true;
              });
              Future.delayed(const Duration(seconds: 1), () {
                if (mounted) {
                  setState(() {
                    if (c == "Cabai Merah") {
                      demandGrowth = 0.22;
                      priceForecast = 0.15;
                      priceCurve = [10000, 10500, 11000, 12500, 14000, 13800, 14500];
                    } else if (c == "Beras") {
                      demandGrowth = 0.08;
                      priceForecast = 0.05;
                      priceCurve = [12000, 12100, 12200, 12300, 12400, 12500, 12600];
                    } else if (c == "Tomat") {
                      demandGrowth = 0.18;
                      priceForecast = 0.12;
                      priceCurve = [8000, 8500, 9000, 9500, 10000, 10500, 11000];
                    } else if (c == "Bawang Merah") {
                      demandGrowth = 0.30;
                      priceForecast = 0.25;
                      priceCurve = [25000, 26000, 27000, 28500, 30000, 31000, 32000];
                    } else {
                      demandGrowth = 0.15;
                      priceForecast = 0.10;
                      priceCurve = [5000, 5200, 5400, 5600, 5800, 6000, 6200];
                    }
                    confidence = 0.85 + (demandGrowth * 0.3);
                    loading = false;
                  });
                }
              });
            },
            child: Container(
              margin: const EdgeInsets.only(right: 10),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: active ? const Color(0xFF1B5E20) : Colors.white.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: active ? Colors.transparent : Colors.white.withOpacity(0.2),
                ),
              ),
              child: Text(
                c,
                style: TextStyle(
                  color: active ? Colors.white : Colors.white70,
                  fontWeight: active ? FontWeight.w600 : FontWeight.normal,
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _aiHeader() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(colors: [Color(0xFF1B5E20), Color(0xFF0B3D1F)]),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        children: [
          const Icon(Icons.auto_graph, color: Colors.white),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              "AI menganalisis pasar $selectedCommodity...",
              style: const TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }

  Widget _metricsRow() {
    return Row(
      children: [
        _metricCard(
          title: "Demand",
          value: "+${(demandGrowth * 100).toStringAsFixed(0)}%",
          icon: Icons.trending_up,
          color: demandGrowth > 0.2 ? Colors.green : Colors.orange,
        ),
        const SizedBox(width: 10),
        _metricCard(
          title: "Price Forecast",
          value: "+${(priceForecast * 100).toStringAsFixed(0)}%",
          icon: Icons.attach_money,
          color: priceForecast > 0.15 ? Colors.green : Colors.orange,
        ),
        const SizedBox(width: 10),
        _metricCard(
          title: "Confidence",
          value: "${(confidence * 100).toStringAsFixed(0)}%",
          icon: Icons.verified,
          color: confidence > 0.8 ? Colors.green : Colors.orange,
        ),
      ],
    );
  }

  Widget _metricCard({
    required String title,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.05),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white.withOpacity(0.08)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 8),
            Text(value, style: TextStyle(color: color, fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            Text(title, style: const TextStyle(color: Colors.white60, fontSize: 11), textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }

  Widget _priceChart() {
    return Container(
      height: 200,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("Prediksi Harga 7 Hari", style: TextStyle(color: Colors.white70, fontSize: 12)),
          const SizedBox(height: 10),
          Expanded(child: CustomPaint(painter: _ChartPainter(priceCurve), child: const SizedBox.expand())),
        ],
      ),
    );
  }

  Widget _insightBox() {
    String insightText = "";
    if (selectedCommodity == "Cabai Merah") {
      insightText = "Permintaan Cabai Merah naik 22% karena distribusi ekspor meningkat. Rekomendasi: tambah stok +30% untuk 5 hari ke depan.";
    } else if (selectedCommodity == "Beras") {
      insightText = "Harga Beras stabil dengan permintaan yang konsisten. Rekomendasi: pertahankan stok saat ini.";
    } else if (selectedCommodity == "Tomat") {
      insightText = "Musim panen Tomat akan tiba, harga diprediksi turun 5%. Rekomendasi: jual stok sekarang sebelum harga turun.";
    } else if (selectedCommodity == "Bawang Merah") {
      insightText = "Bawang Merah mengalami lonjakan permintaan 30%. Rekomendasi: tingkatkan pasokan segera.";
    } else {
      insightText = "Analisis AI menunjukkan tren positif untuk $selectedCommodity. Rekomendasi: pantau terus pergerakan pasar.";
    }
    
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(colors: [Color(0xFF0B3D1F), Color(0xFF1B5E20)]),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("💡 AI Insight", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
          const SizedBox(height: 8),
          Text(insightText, style: const TextStyle(color: Colors.white70)),
        ],
      ),
    );
  }

  Widget _riskCard() {
    String riskLevel = "LOW";
    Color riskColor = Colors.green;
    String riskMessage = "supply stable, demand increasing";
    
    if (selectedCommodity == "Cabai Merah") {
      riskLevel = "MEDIUM";
      riskColor = Colors.orange;
      riskMessage = "demand high, supply limited";
    } else if (selectedCommodity == "Bawang Merah") {
      riskLevel = "HIGH";
      riskColor = Colors.red;
      riskMessage = "price volatility, supply shortage";
    }
    
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Row(
        children: [
          Icon(Icons.warning_amber, color: riskColor),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("Risk Level: $riskLevel", style: TextStyle(color: riskColor, fontWeight: FontWeight.bold)),
                Text(riskMessage, style: const TextStyle(color: Colors.white60, fontSize: 12)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _recommendationCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1B5E20).withOpacity(0.15),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFF1B5E20).withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(color: const Color(0xFF1B5E20), borderRadius: BorderRadius.circular(12)),
            child: const Icon(Icons.lightbulb, color: Colors.white),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text("Rekomendasi AI", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(
                  "Tingkatkan stok $selectedCommodity segera untuk memaksimalkan profit",
                  style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 12),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ChartPainter extends CustomPainter {
  final List<double> data;

  _ChartPainter(this.data);

  @override
  void paint(Canvas canvas, Size size) {
    if (data.isEmpty) return;
    
    final paint = Paint()
      ..color = const Color(0xFF1B5E20)
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final fillPaint = Paint()
      ..color = const Color(0xFF1B5E20).withOpacity(0.1)
      ..style = PaintingStyle.fill;

    final path = Path();
    final fillPath = Path();

    double max = data.reduce((a, b) => a > b ? a : b);
    double min = data.reduce((a, b) => a < b ? a : b);
    
    if (max == min) {
      max = min + 1;
    }

    for (int i = 0; i < data.length; i++) {
      double x = (i / (data.length - 1)) * size.width;
      double y = size.height - ((data[i] - min) / (max - min)) * (size.height - 40) - 20;

      if (i == 0) {
        path.moveTo(x, y);
        fillPath.moveTo(x, size.height - 20);
        fillPath.lineTo(x, y);
      } else {
        path.lineTo(x, y);
        fillPath.lineTo(x, y);
      }
    }
    
    fillPath.lineTo(size.width, size.height - 20);
    fillPath.close();
    
    canvas.drawPath(fillPath, fillPaint);
    canvas.drawPath(path, paint);
    
    final dotPaint = Paint()
      ..color = const Color(0xFF1B5E20)
      ..style = PaintingStyle.fill;
    
    for (int i = 0; i < data.length; i++) {
      double x = (i / (data.length - 1)) * size.width;
      double y = size.height - ((data[i] - min) / (max - min)) * (size.height - 40) - 20;
      canvas.drawCircle(Offset(x, y), 4, dotPaint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}