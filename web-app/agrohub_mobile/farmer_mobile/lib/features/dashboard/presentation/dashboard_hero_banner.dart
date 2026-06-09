// lib/features/dashboard/presentation/dashboard_hero_banner.dart

import 'package:flutter/material.dart';
import '../../../core/constants/assets_constants.dart';

class DashboardHeroBanner extends StatefulWidget {
  const DashboardHeroBanner({super.key});

  @override
  State<DashboardHeroBanner> createState() => _DashboardHeroBannerState();
}

class _DashboardHeroBannerState extends State<DashboardHeroBanner> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<Map<String, dynamic>> _heroItems = [
    {
      'image': AssetConstants.panen1,
      'title': 'Panen hari ini,\nuntung hari esok.',
      'subtitle': 'Kelola usaha tani lebih baik bersama AgroHub.',
      'cta': 'Lihat Tips Hari Ini',
      'route': '/ai',
      'icon': Icons.auto_awesome,
    },
    {
      'image': AssetConstants.panen2,
      'title': 'Jual Hasil Panen\nLangsung ke Pembeli',
      'subtitle': 'Dapatkan harga terbaik untuk hasil panen Anda.',
      'cta': 'Mulai Jual',
      'route': '/sell',
      'icon': Icons.sell,
    },
    {
      'image': AssetConstants.panen3,
      'title': 'Pantau Cuaca\nReal-time',
      'subtitle': 'Informasi cuaca akurat untuk pertanian Anda.',
      'cta': 'Lihat Cuaca',
      'route': '/weather',
      'icon': Icons.wb_sunny,
    },
  ];

  @override
  void initState() {
    super.initState();
    _startAutoSlide();
  }

  void _startAutoSlide() {
    Future.delayed(const Duration(seconds: 5), () {
      if (_pageController.hasClients && mounted) {
        int nextPage = _currentPage + 1;
        if (nextPage >= _heroItems.length) {
          nextPage = 0;
        }
        _pageController.animateToPage(
          nextPage,
          duration: const Duration(milliseconds: 500),
          curve: Curves.easeInOut,
        );
        _startAutoSlide();
      }
    });
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          height: 180,
          child: PageView.builder(
            controller: _pageController,
            onPageChanged: (index) {
              setState(() {
                _currentPage = index;
              });
            },
            itemCount: _heroItems.length,
            itemBuilder: (context, index) {
              final item = _heroItems[index];
              return _buildHeroItem(context, item);
            },
          ),
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(
            _heroItems.length,
            (index) => AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              margin: const EdgeInsets.symmetric(horizontal: 4),
              width: _currentPage == index ? 20 : 8,
              height: 8,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(4),
                color: _currentPage == index
                    ? const Color(0xFF2E7D32)
                    : Colors.grey.withOpacity(0.4),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildHeroItem(BuildContext context, Map<String, dynamic> item) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          image: DecorationImage(
            image: AssetImage(item['image']),
            fit: BoxFit.cover,
            colorFilter: ColorFilter.mode(
              Colors.black.withOpacity(0.35),
              BlendMode.darken,
            ),
          ),
        ),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            gradient: LinearGradient(
              begin: Alignment.bottomCenter,
              end: Alignment.topCenter,
              colors: [
                Colors.black.withOpacity(0.7),
                Colors.transparent,
              ],
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              Text(
                item['title'],
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                item['subtitle'],
                style: const TextStyle(
                  color: Colors.white70,
                  fontSize: 12,
                ),
              ),
              const SizedBox(height: 12),
              GestureDetector(
                onTap: () {
                  Navigator.pushNamed(context, item['route']);
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        item['icon'],
                        size: 14,
                        color: const Color(0xFF2E7D32),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        item['cta'],
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: Color(0xFF2E7D32),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}