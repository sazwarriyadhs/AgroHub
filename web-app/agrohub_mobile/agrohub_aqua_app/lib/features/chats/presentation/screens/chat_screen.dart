import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'chat_detail_screen.dart';

class ChatScreen extends StatelessWidget {
  const ChatScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),

      appBar: AppBar(
        title: Text(
          'Pesan',
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {},
          ),
        ],
      ),

      body: Column(
        children: [
          _buildHeader(),

          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                _chatItem(
                  context,
                  name: 'AI AgroHub Assistant',
                  message: 'Analisis kolam Anda siap 🚀',
                  time: 'Now',
                  unread: 1,
                  isAI: true,
                  online: true,
                  color: Colors.blue,
                ),
                const SizedBox(height: 12),

                _chatItem(
                  context,
                  name: 'Rahmat Hidayat',
                  message: 'Panen lele 500kg sukses',
                  time: '5m',
                  unread: 0,
                  isAI: false,
                  online: true,
                  color: Colors.green,
                ),
                const SizedBox(height: 12),

                _chatItem(
                  context,
                  name: 'Siti Nurjanah',
                  message: 'Butuh pakan 50 sak',
                  time: '1h',
                  unread: 2,
                  isAI: false,
                  online: false,
                  color: Colors.purple,
                ),
                const SizedBox(height: 12),

                _chatItem(
                  context,
                  name: 'Dinas Perikanan',
                  message: 'Pelatihan budidaya bulan ini',
                  time: '1d',
                  unread: 1,
                  isAI: false,
                  online: false,
                  color: Colors.red,
                ),
              ],
            ),
          ),
        ],
      ),

      floatingActionButton: FloatingActionButton(
        backgroundColor: const Color(0xFF2563EB),
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Chat baru coming soon 🚀")),
          );
        },
        child: const Icon(Icons.chat),
      ),
    );
  }

  // =========================
  // HEADER
  // =========================
  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      color: Colors.white,
      child: Row(
        children: [
          const Icon(Icons.circle, size: 10, color: Colors.green),
          const SizedBox(width: 8),
          Text(
            "Online",
            style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey),
          ),
          const Spacer(),
          Text(
            "10 unread messages",
            style: GoogleFonts.poppins(
              fontSize: 12,
              color: Colors.orange,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  // =========================
  // CHAT ITEM FIXED (NO ERROR)
  // =========================
  Widget _chatItem(
    BuildContext context, {
    required String name,
    required String message,
    required String time,
    required int unread,
    required bool online,
    required bool isAI,
    required Color color,
  }) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => const ChatDetailScreen(),
          ),
        );
      },
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 12,
            )
          ],
        ),
        child: Row(
          children: [
            Stack(
              children: [
                CircleAvatar(
                  radius: 26,
                  backgroundColor: color.withOpacity(0.15),
                  child: Icon(
                    isAI ? Icons.smart_toy : Icons.person,
                    color: color,
                  ),
                ),

                if (online)
                  Positioned(
                    bottom: 2,
                    right: 2,
                    child: Container(
                      width: 10,
                      height: 10,
                      decoration: const BoxDecoration(
                        color: Colors.green,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),

                if (isAI)
                  Positioned(
                    right: 0,
                    bottom: 0,
                    child: Container(
                      padding: const EdgeInsets.all(2),
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.auto_awesome,
                        size: 12,
                        color: Colors.blue,
                      ),
                    ),
                  ),
              ],
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
                          name,
                          style: GoogleFonts.poppins(
                            fontWeight:
                                unread > 0 ? FontWeight.bold : FontWeight.w600,
                          ),
                        ),
                      ),
                      Text(
                        time,
                        style: GoogleFonts.poppins(
                          fontSize: 10,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 4),

                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          message,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.poppins(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                      ),

                      if (unread > 0)
                        Container(
                          margin: const EdgeInsets.only(left: 8),
                          padding: const EdgeInsets.all(6),
                          decoration: const BoxDecoration(
                            color: Colors.blue,
                            shape: BoxShape.circle,
                          ),
                          child: Text(
                            unread.toString(),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                            ),
                          ),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}