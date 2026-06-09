import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

class ChatDetailScreen extends StatefulWidget {
  const ChatDetailScreen({super.key});

  @override
  State<ChatDetailScreen> createState() => _ChatDetailScreenState();
}

class _ChatDetailScreenState extends State<ChatDetailScreen> {
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  late WebSocketChannel channel;

  List<Map<String, dynamic>> messages = [];
  String streamingText = "";
  bool isTyping = false;

  @override
  void initState() {
    super.initState();

    channel = WebSocketChannel.connect(
      Uri.parse("ws://localhost:8900/ws/chat"),
    );

    channel.stream.listen((event) {
      final data = event.toString();

      if (data == "[DONE]") {
        setState(() {
          messages.add({"role": "ai", "text": streamingText});
          streamingText = "";
          isTyping = false;
        });
        _scrollBottom();
        return;
      }

      setState(() {
        streamingText += data;
        isTyping = true;
      });

      _scrollBottom();
    });

    messages.add({
      "role": "ai",
      "text": "🤖 AI AgroHub siap membantu budidaya Anda"
    });
  }

  void sendMessage() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    setState(() {
      messages.add({"role": "user", "text": text});
      _controller.clear();
    });

    channel.sink.add(text);
    _scrollBottom();
  }

  void _scrollBottom() {
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  void dispose() {
    channel.sink.close();
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "AI Chat Realtime",
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
        ),
      ),

      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(12),
              itemCount: messages.length + (isTyping ? 1 : 0),
              itemBuilder: (context, index) {
                if (index < messages.length) {
                  final msg = messages[index];

                  return Align(
                    alignment: msg["role"] == "user"
                        ? Alignment.centerRight
                        : Alignment.centerLeft,
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: msg["role"] == "user"
                            ? Colors.blue
                            : Colors.white,
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Text(
                        msg["text"],
                        style: GoogleFonts.poppins(
                          color: msg["role"] == "user"
                              ? Colors.white
                              : Colors.black,
                        ),
                      ),
                    ),
                  );
                }

                return Align(
                  alignment: Alignment.centerLeft,
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    margin: const EdgeInsets.only(bottom: 10),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Text(streamingText),
                  ),
                );
              },
            ),
          ),

          Container(
            padding: const EdgeInsets.all(10),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: const InputDecoration(
                      hintText: "Tanya AI...",
                      border: InputBorder.none,
                    ),
                  ),
                ),
                IconButton(
                  onPressed: sendMessage,
                  icon: const Icon(Icons.send, color: Colors.blue),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}