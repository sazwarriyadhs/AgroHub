// lib/features/dashboard/presentation/dashboard_header.dart

import 'dart:ui';
import 'package:flutter/material.dart';
import '../../../core/constants/assets_constants.dart';

class DashboardHeader extends StatelessWidget {
  const DashboardHeader({super.key});

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    final isMobile = width < 700;

    return Container(
      width: double.infinity,
      constraints: BoxConstraints(
        minHeight: isMobile ? 180 : 165,
      ),
      // ✅ HAPUS decoration image, ganti dengan background putih polos
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(28),
        color: Color(0xFFE8F5E9),
        boxShadow: [
          BoxShadow(
            blurRadius: 18,
            color: Colors.black.withOpacity(.06),
            offset: const Offset(0, 6),
          )
        ],
      ),
      // ✅ HAPUS ClipRRect dan BackdropFilter, ganti dengan Container biasa
      child: Container(
        padding: EdgeInsets.symmetric(
          horizontal: isMobile ? 18 : 28,
          vertical: isMobile ? 16 : 18,
        ),
        child: isMobile ? _mobileLayout() : _desktopLayout(),
      ),
    );
  }

  Widget _desktopLayout() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Expanded(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              // Logo AgroHub
              Image.asset(
                AssetConstants.logo,
                height: 50,
                width: 150,
                fit: BoxFit.contain,
                errorBuilder: (_, __, ___) => const SizedBox(),
              ),
              const SizedBox(height: 16),
              const Text(
                "Halo, Rudi Hartono 👨‍🌾",
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Color(0xff2E7D32),
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                "Selamat bertani hari ini 🌱",
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.black54,
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                "Pantau panen, cuaca, dan penjualanmu",
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.black45,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(width: 20),
        Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const _WeatherCard(),
            const SizedBox(height: 10),
            Row(
              children: [
                const _NotificationIcon(),
                const SizedBox(width: 12),
                Container(
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: Colors.green,
                      width: 2,
                    ),
                  ),
                  child: CircleAvatar(
                    radius: 24,
                    backgroundImage: AssetImage(AssetConstants.farmer),
                    onBackgroundImageError: (_, __) {},
                    child: const Icon(Icons.person, color: Colors.white),
                  ),
                ),
              ],
            )
          ],
        )
      ],
    );
  }

  Widget _mobileLayout() {
    return Row(
      children: [
        CircleAvatar(
          radius: 24,
          backgroundImage: AssetImage(AssetConstants.farmer),
          onBackgroundImageError: (_, __) {},
          child: const Icon(Icons.person, color: Colors.white, size: 24),
        ),
        const SizedBox(width: 12),
        const Expanded(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Halo, Rudi 👨‍🌾",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.green,
                ),
              ),
              SizedBox(height: 3),
              Text(
                "Selamat bertani 🌱",
                style: TextStyle(fontSize: 12),
              ),
            ],
          ),
        ),
        const _NotificationIcon(),
      ],
    );
  }
}

class _WeatherCard extends StatelessWidget {
  const _WeatherCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 14,
        vertical: 8,
      ),
      decoration: BoxDecoration(
        color: Colors.grey.withOpacity(0.1),
        borderRadius: BorderRadius.circular(18),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: const [
          Icon(
            Icons.wb_sunny,
            color: Colors.orange,
            size: 20,
          ),
          SizedBox(width: 8),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "28°C",
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              Text(
                "Cerah",
                style: TextStyle(fontSize: 11),
              ),
            ],
          )
        ],
      ),
    );
  }
}

class _NotificationIcon extends StatelessWidget {
  const _NotificationIcon();

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: const BoxDecoration(
            color: Colors.white,
            shape: BoxShape.circle,
          ),
          child: const Icon(
            Icons.notifications,
            color: Colors.green,
            size: 20,
          ),
        ),
        const Positioned(
          right: 0,
          top: 0,
          child: CircleAvatar(
            radius: 8,
            backgroundColor: Colors.red,
            child: Text(
              "3",
              style: TextStyle(
                color: Colors.white,
                fontSize: 9,
              ),
            ),
          ),
        )
      ],
    );
  }
}