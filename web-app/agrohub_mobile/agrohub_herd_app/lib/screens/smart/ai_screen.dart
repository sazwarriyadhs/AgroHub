import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/herd_theme.dart';

class AIScreen extends StatefulWidget {
  const AIScreen({super.key});

  @override
  State<AIScreen> createState() => _AIScreenState();
}

class _AIScreenState extends State<AIScreen> {
  final TextEditingController _chatController = TextEditingController();
  final List<Map<String, dynamic>> _messages = [];
  bool _isLoading = false;
  final ScrollController _scrollController = ScrollController();

  final List<Map<String, dynamic>> _insights = [
    {
      "title": "Prediksi Profit",
      "value": "+18%",
      "icon": Icons.trending_up,
      "color": Colors.green,
      "description": "Dibandingkan bulan lalu"
    },
    {
      "title": "Kesehatan Ternak",
      "value": "92%",
      "icon": Icons.health_and_safety,
      "color": Colors.blue,
      "description": "Tingkat kesehatan"
    },
    {
      "title": "Efisiensi Pakan",
      "value": "85%",
      "icon": Icons.restaurant,
      "color": Colors.orange,
      "description": "Konversi pakan"
    },
    {
      "title": "Harga Jual",
      "value": "Rp 21 JT",
      "icon": Icons.attach_money,
      "color": Colors.green,
      "description": "Rata-rata per ekor"
    },
  ];

  @override
  void initState() {
    super.initState();
    _addWelcomeMessage();
  }

  void _addWelcomeMessage() {
    _messages.add({
      "isUser": false,
      "message": "Halo! Saya Asisten AI AgroHub. Saya bisa membantu:\n\n• Prediksi kesehatan ternak\n• Estimasi profit panen\n• Rekomendasi pakan terbaik\n• Analisis pasar ternak\n\nAda yang bisa saya bantu?",
    });
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _sendMessage() {
    if (_chatController.text.trim().isEmpty) return;
    
    final userMessage = _chatController.text.trim();
    setState(() {
      _messages.add({"isUser": true, "message": userMessage});
      _chatController.clear();
      _isLoading = true;
    });
    _scrollToBottom();
    
    // Simulasi AI response
    Future.delayed(const Duration(seconds: 1), () {
      if (mounted) {
        setState(() {
          _messages.add({
            "isUser": false,
            "message": _getAIResponse(userMessage),
          });
          _isLoading = false;
        });
        _scrollToBottom();
      }
    });
  }

  String _getAIResponse(String message) {
    message = message.toLowerCase();
    
    if (message.contains("profit") || message.contains("untung")) {
      return "Berdasarkan data ternak Anda, prediksi profit bulan ini naik 18% menjadi Rp 49.000.000. Rekomendasi: jual 5 ekor sapi dengan bobot 400kg+ untuk hasil maksimal.";
    } else if (message.contains("kesehatan") || message.contains("sakit")) {
      return "Status kesehatan ternak: 115 sehat, 8 sakit. Rekomendasi: Segera vaksinasi untuk 3 ekor sapi di Kandang Barat.";
    } else if (message.contains("pakan")) {
      return "Stok pakan saat ini 70%. Rekomendasi pakan terbaik: Konsentrat premium dari PT AgroFeed. Efisiensi konversi pakan meningkat 15%.";
    } else if (message.contains("harga") || message.contains("jual")) {
      return "Harga pasar terkini:\n• Sapi Limosin: Rp 18-20 Juta\n• Sapi Brahman: Rp 20-23 Juta\n• Sapi Madura: Rp 15-17 Juta\n\nTren: Naik 5% dari bulan lalu.";
    } else {
      return "Terima kasih pertanyaannya. Saya akan analisis data ternak Anda. Hasil analisis akan dikirim dalam 5 menit. Ada yang lain yang bisa saya bantu?";
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F8F2),
      appBar: AppBar(
        title: Text(
          "AI Smart Assistant",
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.bold,
            color: Colors.green,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.history),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          // Insights Grid - dengan tinggi tetap
          Container(
            height: 140,
            margin: const EdgeInsets.all(12),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: _insights.length,
              itemBuilder: (context, index) {
                final insight = _insights[index];
                return Container(
                  width: 160,
                  margin: const EdgeInsets.only(right: 12),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: (insight["color"] as Color).withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(
                          insight["icon"] as IconData,
                          color: insight["color"] as Color,
                          size: 20,
                        ),
                      ),
                      const Spacer(),
                      Text(
                        insight["title"] as String,
                        style: GoogleFonts.poppins(
                          fontSize: 11,
                          color: Colors.grey[600],
                        ),
                      ),
                      Text(
                        insight["value"] as String,
                        style: GoogleFonts.poppins(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        insight["description"] as String,
                        style: GoogleFonts.poppins(
                          fontSize: 9,
                          color: Colors.grey[500],
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          // Chat Messages - Expanded agar memenuhi sisa ruang
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final message = _messages[index];
                return _buildChatBubble(message);
              },
            ),
          ),
          // Loading Indicator
          if (_isLoading)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  SizedBox(
                    width: 16,
                    height: 16,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.green,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Text(
                    "AI sedang berpikir...",
                    style: GoogleFonts.poppins(
                      fontSize: 11,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),
          // Chat Input
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 8,
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _chatController,
                    style: GoogleFonts.poppins(fontSize: 14),
                    decoration: InputDecoration(
                      hintText: "Tanya AI AgroHub...",
                      hintStyle: GoogleFonts.poppins(color: Colors.grey[400], fontSize: 13),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide.none,
                      ),
                      filled: true,
                      fillColor: Colors.grey[100],
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                    onSubmitted: (_) => _sendMessage(),
                  ),
                ),
                const SizedBox(width: 10),
                Container(
                  decoration: BoxDecoration(
                    color: Colors.green,
                    shape: BoxShape.circle,
                  ),
                  child: IconButton(
                    icon: const Icon(Icons.send, color: Colors.white, size: 20),
                    onPressed: _sendMessage,
                    padding: const EdgeInsets.all(10),
                    constraints: const BoxConstraints(),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChatBubble(Map<String, dynamic> message) {
    final isUser = message["isUser"] as bool;
    
    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.75,
        ),
        decoration: BoxDecoration(
          color: isUser ? Colors.green : Colors.white,
          borderRadius: BorderRadius.circular(18).copyWith(
            topRight: const Radius.circular(18),
            bottomRight: isUser ? const Radius.circular(4) : const Radius.circular(18),
            bottomLeft: isUser ? const Radius.circular(18) : const Radius.circular(4),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.03),
              blurRadius: 4,
            ),
          ],
        ),
        child: Text(
          message["message"] as String,
          style: GoogleFonts.poppins(
            fontSize: 13,
            color: isUser ? Colors.white : Colors.black87,
            height: 1.4,
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _chatController.dispose();
    _scrollController.dispose();
    super.dispose();
  }
}

