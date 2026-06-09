import 'dart:async';
import 'dart:ui';

import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:agrohub_aqua_app/app/theme/app_theme.dart';

class AIScreen extends StatefulWidget {
  const AIScreen({super.key});

  @override
  State<AIScreen> createState() => _AIScreenState();
}

class _AIScreenState extends State<AIScreen>
    with SingleTickerProviderStateMixin {
  int _selectedTab = 0;

  late AnimationController _animationController;

  final ScrollController _chatScrollController = ScrollController();
  final TextEditingController _chatController = TextEditingController();

  bool _isLoading = false;

  final List<Map<String, dynamic>> _messages = [];

  List<FlSpot> _harvestPredictionSpots = [];
  List<FlSpot> _pricePredictionSpots = [];

  @override
  void initState() {
    super.initState();

    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..forward();

    _initChartData();
    _addWelcomeMessage();
  }

  @override
  void dispose() {
    _chatController.dispose();
    _chatScrollController.dispose();
    _animationController.dispose();
    super.dispose();
  }

  // =========================
  void _initChartData() {
    _harvestPredictionSpots = [
      const FlSpot(0, 100),
      const FlSpot(2, 200),
      const FlSpot(4, 400),
      const FlSpot(6, 700),
      const FlSpot(8, 1000),
    ];

    _pricePredictionSpots = [
      const FlSpot(0, 22),
      const FlSpot(2, 24),
      const FlSpot(4, 26),
      const FlSpot(6, 29),
      const FlSpot(8, 32),
    ];
  }

  void _addWelcomeMessage() {
    _messages.add({
      "isUser": false,
      "message":
          "Halo 👋\nSaya AI Aqua Assistant.\nTanya: panen, penyakit, pakan, atau harga pasar.",
      "time": DateTime.now(),
    });
  }

  Future<String> _callBackendAI(String message) async {
    await Future.delayed(const Duration(milliseconds: 800));
    return _fallbackAI(message);
  }

  Future<void> _sendMessage() async {
    final text = _chatController.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add({
        "isUser": true,
        "message": text,
        "time": DateTime.now(),
      });
      _chatController.clear();
      _isLoading = true;
    });

    _scrollBottom();

    final reply = await _callBackendAI(text);

    setState(() {
      _messages.add({
        "isUser": false,
        "message": reply,
        "time": DateTime.now(),
      });
      _isLoading = false;
    });

    _scrollBottom();
  }

  void _scrollBottom() {
    Future.delayed(const Duration(milliseconds: 120), () {
      if (_chatScrollController.hasClients) {
        _chatScrollController.animateTo(
          _chatScrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  String _fallbackAI(String msg) {
    final m = msg.toLowerCase();

    if (m.contains("panen")) {
      return "📈 Panen ±1 ton dalam 12 hari\nProfit ± Rp 25 juta";
    }
    if (m.contains("air")) {
      return "💧 pH 7.2 | DO 5.2 mg/L | Suhu 28°C (ideal)";
    }
    if (m.contains("penyakit")) {
      return "🦠 Risiko White Spot 15% → tambah garam 3–5 ppt";
    }
    if (m.contains("harga")) {
      return "💰 Harga naik ke Rp 28.000/kg minggu depan";
    }
    if (m.contains("pakan")) {
      return "🐟 Kurangi pakan 10–15% untuk efisiensi FCR";
    }

    return "🤖 AI sedang analisis data kolam...";
  }

  // ========================= UI =========================

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      backgroundColor: const Color(0xFFF3F7FC),

      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
        title: Text(
          "AI Smart Aqua",
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.bold,
            color: AppTheme.primaryColor,
          ),
        ),
      ),

      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFFF5F9FF),
              Color(0xFFEAF2FF),
              Color(0xFFF7FBFF),
            ],
          ),
        ),
        child: FadeTransition(
          opacity: _animationController,
          child: Column(
            children: [
              _buildTabBar(),
              Expanded(
                child: IndexedStack(
                  index: _selectedTab,
                  children: [
                    _buildPredictionTab(),
                    _buildRecommendationTab(),
                    _buildChatTab(),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ========================= TAB =========================

  Widget _buildTabBar() {
    return Padding(
      padding: const EdgeInsets.all(12),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(30),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.7),
              borderRadius: BorderRadius.circular(30),
              border: Border.all(color: Colors.white),
            ),
            child: Row(
              children: [
                _tab("Prediksi", 0),
                _tab("Insight", 1),
                _tab("AI Chat", 2),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _tab(String title, int index) {
    final active = _selectedTab == index;

    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _selectedTab = index),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: active ? AppTheme.primaryColor : Colors.transparent,
            borderRadius: BorderRadius.circular(24),
          ),
          child: Center(
            child: Text(
              title,
              style: GoogleFonts.poppins(
                color: active ? Colors.white : Colors.grey,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ),
      ),
    );
  }

  // ========================= CHAT =========================

  Widget _buildChatTab() {
    return Column(
      children: [
        Expanded(
          child: ListView.builder(
            controller: _chatScrollController,
            padding: const EdgeInsets.all(12),
            itemCount: _messages.length,
            itemBuilder: (context, i) {
              final msg = _messages[i];
              final isUser = msg["isUser"];

              return Align(
                alignment:
                    isUser ? Alignment.centerRight : Alignment.centerLeft,
                child: Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  constraints: const BoxConstraints(maxWidth: 280),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    gradient: isUser
                        ? LinearGradient(
                            colors: [
                              AppTheme.primaryColor,
                              Colors.blue.shade400,
                            ],
                          )
                        : null,
                    color: isUser ? null : Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        blurRadius: 10,
                      )
                    ],
                  ),
                  child: Text(
                    msg["message"],
                    style: GoogleFonts.poppins(
                      color: isUser ? Colors.white : Colors.black87,
                    ),
                  ),
                ),
              );
            },
          ),
        ),

        if (_isLoading)
          const Padding(
            padding: EdgeInsets.all(8),
            child: CircularProgressIndicator(),
          ),

        _chatInput(),
      ],
    );
  }

  Widget _chatInput() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            blurRadius: 20,
            color: Colors.black.withOpacity(0.05),
          )
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _chatController,
              onSubmitted: (_) => _sendMessage(),
              decoration: InputDecoration(
                hintText: "Tanya AI Smart Aqua...",
                border: InputBorder.none,
                hintStyle: GoogleFonts.poppins(),
              ),
            ),
          ),
          IconButton(
            onPressed: _sendMessage,
            icon: Icon(Icons.send, color: AppTheme.primaryColor),
          ),
        ],
      ),
    );
  }

  // ========================= PREDICTION =========================

  Widget _buildPredictionTab() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          _chartCard("Prediksi Panen", _harvestPredictionSpots),
          const SizedBox(height: 16),
          _chartCard("Prediksi Harga", _pricePredictionSpots),
        ],
      ),
    );
  }

  Widget _chartCard(String title, List<FlSpot> spots) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 180,
            child: LineChart(
              LineChartData(
                gridData: const FlGridData(show: false),
                titlesData: const FlTitlesData(show: false),
                borderData: FlBorderData(show: false),
                lineBarsData: [
                  LineChartBarData(
                    spots: spots,
                    isCurved: true,
                    color: AppTheme.primaryColor,
                    barWidth: 3,
                    dotData: const FlDotData(show: false),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecommendationTab() {
    return const Center(
      child: Text("Insight AI akan muncul di sini"),
    );
  }
}