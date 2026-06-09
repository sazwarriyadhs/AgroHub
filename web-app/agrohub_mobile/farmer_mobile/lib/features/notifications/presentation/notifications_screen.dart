import 'package:flutter/material.dart';

import '../../dashboard/presentation/farmer_bottom_navigation.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() =>
      _NotificationsScreenState();
}

class _NotificationsScreenState
    extends State<NotificationsScreen> {

  final List<Map<String, dynamic>> notifications = [
    {
      "title": "Harga Cabai Naik",
      "desc": "Harga cabai merah naik 8% hari ini",
      "time": "5 menit",
      "icon": Icons.trending_up,
      "unread": true,
    },
    {
      "title": "Panen Siap Dijual",
      "desc": "Jagung di lahan blok A siap dipanen",
      "time": "30 menit",
      "icon": Icons.agriculture,
      "unread": true,
    },
    {
      "title": "Pesanan Baru",
      "desc": "Ada pembelian produk baru",
      "time": "1 jam",
      "icon": Icons.shopping_cart,
      "unread": false,
    },
    {
      "title": "Reminder Tugas",
      "desc": "Jangan lupa penyemprotan hari ini",
      "time": "2 jam",
      "icon": Icons.task_alt,
      "unread": false,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(
        0xFFF4F7FB,
      ),

      appBar: AppBar(
        elevation: 0,
        backgroundColor: const Color(
          0xFF1B8F3E,
        ),
        foregroundColor: Colors.white,

        leading: Navigator.canPop(context)
            ? IconButton(
                icon: const Icon(
                  Icons.arrow_back_ios,
                ),
                onPressed: () {
                  Navigator.pop(context);
                },
              )
            : IconButton(
                icon: const Icon(
                  Icons.home,
                ),
                onPressed: () {
                  Navigator.pushReplacementNamed(
                    context,
                    "/dashboard",
                  );
                },
              ),

        title: const Text(
          "Notifikasi",
          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),

        actions: [
          TextButton(
            onPressed: () {},
            child: const Text(
              "Tandai semua",
              style: TextStyle(
                color: Colors.white,
              ),
            ),
          )
        ],
      ),

      body: notifications.isEmpty
          ? const Center(
              child: Text(
                "Belum ada notifikasi",
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(
                16,
              ),
              itemCount: notifications.length,
              itemBuilder: (
                context,
                index,
              ) {
                final item =
                    notifications[index];

                return Container(
                  margin:
                      const EdgeInsets.only(
                    bottom: 12,
                  ),
                  decoration:
                      BoxDecoration(
                    color: Colors.white,
                    borderRadius:
                        BorderRadius.circular(
                      18,
                    ),
                    boxShadow: [
                      BoxShadow(
                        blurRadius: 8,
                        color: Colors.black
                            .withOpacity(
                          .05,
                        ),
                      )
                    ],
                  ),
                  child: ListTile(
                    contentPadding:
                        const EdgeInsets.all(
                      12,
                    ),

                    leading:
                        CircleAvatar(
                      radius: 24,
                      backgroundColor:
                          Colors.green
                              .shade100,
                      child: Icon(
                        item["icon"],
                        color:
                            Colors.green,
                      ),
                    ),

                    title: Text(
                      item["title"],
                      style:
                          const TextStyle(
                        fontWeight:
                            FontWeight.w700,
                      ),
                    ),

                    subtitle: Padding(
                      padding:
                          const EdgeInsets.only(
                        top: 6,
                      ),
                      child: Text(
                        item["desc"],
                      ),
                    ),

                    trailing: Column(
                      mainAxisAlignment:
                          MainAxisAlignment
                              .center,
                      children: [
                        Text(
                          item["time"],
                          style:
                              const TextStyle(
                            fontSize: 11,
                          ),
                        ),

                        const SizedBox(
                          height: 6,
                        ),

                        if (item["unread"])
                          Container(
                            width: 10,
                            height: 10,
                            decoration:
                                const BoxDecoration(
                              color:
                                  Colors.green,
                              shape: BoxShape
                                  .circle,
                            ),
                          ),
                      ],
                    ),
                  ),
                );
              },
            ),

      bottomNavigationBar:
          const FarmerBottomNavigation(
        currentIndex: 4,
      ),
    );
  }
}