import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'chat_detail_screen.dart';

class ChatListScreen extends StatelessWidget {
  const ChatListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final chats = [
      {
        "name": "AI AgroHub Assistant",
        "last": "Analisis kolam Anda siap 🚀",
        "time": "Now",
        "unread": 1,
        "isAI": true,
        "online": true,
      },
      {
        "name": "Rahmat Hidayat",
        "last": "Panen lele 500kg sukses",
        "time": "5m",
        "unread": 0,
        "isAI": false,
        "online": true,
      },
      {
        "name": "Siti Nurjanah",
        "last": "Butuh pakan 50 sak",
        "time": "1h",
        "unread": 2,
        "isAI": false,
        "online": false,
      },
      {
        "name": "Dinas Perikanan",
        "last": "Pelatihan budidaya bulan ini",
        "time": "1d",
        "unread": 1,
        "isAI": false,
        "online": false,
      },
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),

      appBar: AppBar(
        title: Text(
          "💬 AgroHub Chats",
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
      ),

      body: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: chats.length,
        itemBuilder: (context, index) {
          final chat = chats[index];

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
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                  )
                ],
              ),
              child: Row(
                children: [
                  Stack(
                    children: [
                      CircleAvatar(
                        radius: 26,
                        backgroundColor: chat["isAI"] == true
                            ? Colors.blue.withOpacity(0.2)
                            : Colors.green.withOpacity(0.2),
                        child: Icon(
                          chat["isAI"] == true
                              ? Icons.auto_awesome
                              : Icons.person,
                          color: chat["isAI"] == true
                              ? Colors.blue
                              : Colors.green,
                        ),
                      ),

                      if (chat["online"] == true)
                        Positioned(
                          right: 0,
                          bottom: 0,
                          child: Container(
                            width: 10,
                            height: 10,
                            decoration: const BoxDecoration(
                              color: Colors.green,
                              shape: BoxShape.circle,
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
                        Text(
                          chat["name"].toString(),
                          style: GoogleFonts.poppins(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          chat["last"].toString(),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.poppins(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ),

                  Column(
                    children: [
                      Text(
                        chat["time"].toString(),
                        style: GoogleFonts.poppins(
                          fontSize: 10,
                          color: Colors.grey,
                        ),
                      ),
                      const SizedBox(height: 6),

                      if (chat["unread"] > 0)
                        Container(
                          padding: const EdgeInsets.all(6),
                          decoration: const BoxDecoration(
                            color: Colors.blue,
                            shape: BoxShape.circle,
                          ),
                          child: Text(
                            chat["unread"].toString(),
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
          );
        },
      ),

      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.blue,
        onPressed: () {},
        child: const Icon(Icons.chat),
      ),
    );
  }
}