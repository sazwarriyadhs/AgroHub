import 'package:agrohub_customer/config/api_config.dart';
import 'dart:async';
import 'dart:ui';

import 'package:flutter/material.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  late AnimationController _progressController;
  late AnimationController _floatingController;

  @override
  void initState() {
    super.initState();

    _progressController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 4),
    )..forward();

    _floatingController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat(reverse: true);

    Timer(const Duration(seconds: 3), () {
      if (mounted) {
        Navigator.pushReplacementNamed(context, '/login');
      }
    });
  }

  @override
  void dispose() {
    _progressController.dispose();
    _floatingController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Scaffold(
      body: Stack(
        children: [
          /// BACKGROUND IMAGE
          SizedBox(
            width: double.infinity,
            height: double.infinity,
            child: Image.asset(
              "assets/images/splash_bg.png",
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Color(0xFFE8F5E9),
                        Color(0xFFC8E6C9),
                        Color(0xFF021A14),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),

          /// DARK OVERLAY
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.white.withOpacity(0.15),
                  Colors.black.withOpacity(0.15),
                  const Color(0xFF012B16),
                ],
              ),
            ),
          ),

          /// FLOATING LEAVES
          ...List.generate(
            6,
            (index) => AnimatedBuilder(
              animation: _floatingController,
              builder: (context, child) {
                return Positioned(
                  top: 80 + (index * 120) + (_floatingController.value * 10),
                  left: index.isEven ? 20 : size.width - 60,
                  child: Transform.rotate(
                    angle: _floatingController.value,
                    child: Icon(
                      Icons.eco,
                      color: Colors.green.shade300.withOpacity(0.7),
                      size: 28,
                    ),
                  ),
                );
              },
            ),
          ),

          /// CONTENT
          SafeArea(
            child: Column(
              children: [
                const Spacer(),

                /// LOGO
                Hero(
                  tag: "logo",
                  child: Image.asset(
                    "assets/logo/logo-agrohub.png",
                    width: 230,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        width: 230,
                        height: 230,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: const Color(0xFF1B8F3E).withOpacity(0.2),
                        ),
                        child: const Icon(
                          Icons.agriculture,
                          color: Color(0xFF1B8F3E),
                          size: 100,
                        ),
                      );
                    },
                  ),
                ),

                const SizedBox(height: 20),

                /// TITLE
                ShaderMask(
                  shaderCallback: (bounds) {
                    return const LinearGradient(
                      colors: [
                        Color(0xFF1B8E3E),
                        Color(0xFFFF8C1A),
                      ],
                    ).createShader(bounds);
                  },
                  child: const Text(
                    "Smart customer Mobile App",
                    style: TextStyle(
                      fontSize: 34,
                      fontWeight: FontWeight.normal,
                      color: Colors.white,
                      letterSpacing: 1,
                    ),
                  ),
                ),

                const SizedBox(height: 8),

                const Text(
                  "Connecting Farmers to Markets",
                  style: TextStyle(
                    fontSize: 18,
                    color: Colors.white70,  // FIX: lebih jelas
                    fontWeight: FontWeight.w500,
                  ),
                ),

                const Spacer(),

                /// GLASS CARD
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 28),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(32),
                    child: BackdropFilter(
                      filter: ImageFilter.blur(
                        sigmaX: 12,
                        sigmaY: 12,
                      ),
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 24,
                          vertical: 36,
                        ),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(32),
                          color: Colors.green.shade900.withOpacity(0.35),
                          border: Border.all(
                            color: Colors.white.withOpacity(0.15),
                          ),
                        ),
                        child: Column(
                          children: [
                            /// ICON
                            Container(
                              width: 80,
                              height: 80,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                gradient: LinearGradient(
                                  colors: [
                                    Colors.green.shade300,
                                    Colors.green.shade700,
                                  ],
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.greenAccent.withOpacity(0.5),
                                    blurRadius: 20,
                                    spreadRadius: 2,
                                  ),
                                ],
                              ),
                              child: const Icon(
                                Icons.eco,
                                color: Colors.white,
                                size: 42,
                              ),
                            ),

                            const SizedBox(height: 28),

                            /// TEXT
                            const Text(
                              "Pertanian Maju, customer Petanian Sejahtera,",
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 22,
                                color: Colors.white,
                                fontWeight: FontWeight.w500,
                              ),
                            ),

                            const SizedBox(height: 6),

                            Text(
                              "Indonesia Hebat",
                              style: TextStyle(
                                fontSize: 28,
                                fontWeight: FontWeight.bold,
                                color: Colors.green.shade300,
                              ),
                            ),

                            const SizedBox(height: 40),

                            /// PROGRESS BAR
                            AnimatedBuilder(
                              animation: _progressController,
                              builder: (context, child) {
                                return Column(
                                  children: [
                                    Stack(
                                      children: [
                                        Container(
                                          height: 14,
                                          width: double.infinity,
                                          decoration: BoxDecoration(
                                            borderRadius: BorderRadius.circular(30),
                                            border: Border.all(
                                              color: Colors.green.shade700,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          height: 14,
                                          width: (size.width - 56) * _progressController.value, // FIXED
                                          decoration: BoxDecoration(
                                            borderRadius: BorderRadius.circular(30),
                                            gradient: LinearGradient(
                                              colors: [
                                                Colors.lightGreenAccent,
                                                Colors.greenAccent.shade400,
                                                Colors.white,
                                              ],
                                            ),
                                            boxShadow: [
                                              BoxShadow(
                                                color: Colors.greenAccent.withOpacity(0.7),
                                                blurRadius: 15,
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),

                                    const SizedBox(height: 24),

                                    Text(
                                      "Memuat...",
                                      style: TextStyle(
                                        color: Colors.green.shade300,
                                        fontSize: 20,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ],
                                );
                              },
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 50),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

