// lib/features/live/livescreen.dart

import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

import '../../core/services/api_service.dart';

class LiveScreen extends StatefulWidget {
  const LiveScreen({super.key});

  @override
  State<LiveScreen> createState() => _LiveScreenState();
}

class _LiveScreenState extends State<LiveScreen> {
  final titleController = TextEditingController();
  final streamKeyController = TextEditingController();
  final messageController = TextEditingController();

  final ApiService apiService = ApiService();

  WebSocketChannel? channel;
  StreamSubscription? wsSubscription;

  bool isLive = false;
  bool loadingProducts = true;

  int viewerCount = 0;
  int productCount = 0;

  List<dynamic> products = [];

  final List<Map<String, dynamic>> messages = [];

  @override
  void initState() {
    super.initState();
    loadProducts();
  }

  Future<void> loadProducts() async {
    try {
      final result = await apiService.getFarmProducts();

      if (!mounted) return;

      setState(() {
        products = result;
        productCount = result.length;
        loadingProducts = false;
      });
    } catch (_) {
      if (!mounted) return;

      setState(() {
        productCount = 0;
        loadingProducts = false;
      });
    }
  }

  Future<void> openYoutubeStudio() async {
    final uri = Uri.parse(
      "https://studio.youtube.com",
    );

    if (await canLaunchUrl(uri)) {
      await launchUrl(
        uri,
        mode: LaunchMode.externalApplication,
      );
    }
  }

  Future<void> startLive() async {
    if (isLive) return;

    if (titleController.text.trim().isEmpty) {
      snack("Masukkan judul live");
      return;
    }

    if (streamKeyController.text.trim().isEmpty) {
      snack("Masukkan Youtube Stream Key");
      return;
    }

    setState(() {
      isLive = true;
      viewerCount = 0;
    });

    messages.add({
      "user": "System",
      "message": "🎥 Live dimulai",
      "system": true,
    });

    try {
      channel = WebSocketChannel.connect(
        Uri.parse(
          "ws://10.0.2.2:8900/ws/chat",
        ),
      );

      wsSubscription =
          channel!.stream.listen(
        (event) {
          final data =
              jsonDecode(event);

          if (!mounted) return;

          if (data["type"] ==
              "viewer_count") {
            setState(() {
              viewerCount =
                  data["count"] ?? 0;
            });
          }

          if (data["type"] ==
              "message") {
            setState(() {
              messages.add({
                "user":
                    data["user"] ??
                        "User",
                "message":
                    data["message"],
                "system": false,
              });
            });
          }
        },
        onError: (_) {
          snack(
            "Websocket error",
          );
        },
      );

      snack(
        "Live dimulai 🚀",
      );
    } catch (_) {
      snack(
        "Gagal konek websocket",
      );
    }
  }

  Future<void> stopLive() async {
    await wsSubscription?.cancel();
    await channel?.sink.close();

    if (!mounted) return;

    setState(() {
      isLive = false;
      viewerCount = 0;
    });

    messages.add({
      "user": "System",
      "message": "📴 Live selesai",
      "system": true,
    });
  }

  void sendMessage() {
    if (messageController.text
        .trim()
        .isEmpty) {
      return;
    }

    final payload = {
      "type": "message",
      "user": "Petani",
      "message":
          messageController.text,
    };

    channel?.sink.add(
      jsonEncode(payload),
    );

    messageController.clear();
  }

  void snack(String msg) {
    if (!mounted) return;

    ScaffoldMessenger.of(context)
        .showSnackBar(
      SnackBar(
        content: Text(msg),
      ),
    );
  }

  @override
  void dispose() {
    wsSubscription?.cancel();
    channel?.sink.close();

    titleController.dispose();
    streamKeyController.dispose();
    messageController.dispose();

    super.dispose();
  }

  @override
  Widget build(
    BuildContext context,
  ) {
    return Scaffold(
      backgroundColor:
          const Color(
        0xffF4F6F8,
      ),

      appBar: AppBar(
        title:
            const Text(
          "AgroLive",
        ),
        backgroundColor:
            Colors.green,
        foregroundColor:
            Colors.white,
      ),

      body: Column(
        children: [

          Container(
            margin:
                const EdgeInsets.all(
              20,
            ),

            padding:
                const EdgeInsets.all(
              24,
            ),

            decoration:
                BoxDecoration(
              borderRadius:
                  BorderRadius.circular(
                24,
              ),

              gradient:
                  LinearGradient(
                colors: isLive
                    ? [
                        Colors.red,
                        Colors.redAccent
                      ]
                    : [
                        Colors.green,
                        Colors.greenAccent
                      ],
              ),
            ),

            child: Column(
              children: [

                Icon(
                  isLive
                      ? Icons.live_tv
                      : Icons.videocam,
                  color:
                      Colors.white,
                  size: 60,
                ),

                const SizedBox(
                    height: 10),

                Text(
                  isLive
                      ? "SEDANG LIVE"
                      : "Belum Live",

                  style:
                      const TextStyle(
                    color:
                        Colors.white,
                    fontSize: 24,
                    fontWeight:
                        FontWeight.bold,
                  ),
                ),

                const SizedBox(
                    height: 8),

                Text(
                  "$viewerCount viewer",
                  style:
                      const TextStyle(
                    color:
                        Colors.white,
                  ),
                )
              ],
            ),
          ),

          Padding(
            padding:
                const EdgeInsets.symmetric(
              horizontal: 20,
            ),

            child: Column(
              children: [

                TextField(
                  controller:
                      titleController,

                  enabled:
                      !isLive,

                  decoration:
                      const InputDecoration(
                    labelText:
                        "Judul Live",
                  ),
                ),

                const SizedBox(
                    height: 14),

                TextField(
                  controller:
                      streamKeyController,

                  enabled:
                      !isLive,

                  obscureText:
                      true,

                  decoration:
                      const InputDecoration(
                    labelText:
                        "Youtube Stream Key",
                  ),
                ),

                const SizedBox(
                    height: 14),

                SizedBox(
                  width:
                      double.infinity,

                  child:
                      ElevatedButton(
                    onPressed:
                        isLive
                            ? stopLive
                            : startLive,

                    child: Text(
                      isLive
                          ? "Stop Live"
                          : "Mulai Live",
                    ),
                  ),
                ),

                const SizedBox(
                    height: 10),

                SizedBox(
                  width:
                      double.infinity,

                  child:
                      OutlinedButton(
                    onPressed:
                        openYoutubeStudio,

                    child:
                        const Text(
                      "Open Youtube Studio",
                    ),
                  ),
                )
              ],
            ),
          ),

          const SizedBox(
              height: 20),

          Expanded(
            child:
                ListView.builder(
              itemCount:
                  messages.length,

              itemBuilder:
                  (_, i) {
                final m =
                    messages[i];

                return ListTile(
                  title:
                      Text(
                    m["message"],
                  ),

                  subtitle:
                      Text(
                    m["user"],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}