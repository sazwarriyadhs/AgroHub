import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../bloc/auth_bloc.dart';
import '../../../core/routes/app_routes.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  Timer? _timer;

  late AnimationController _controller;
  late Animation<double> _fadeAnim;
  late Animation<double> _scaleAnim;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1800),
    );

    _fadeAnim = Tween<double>(
      begin: 0,
      end: 1,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeOut,
      ),
    );

    _scaleAnim = Tween<double>(
      begin: 0.8,
      end: 1,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.elasticOut,
      ),
    );

    _controller.forward();

    _timer = Timer(const Duration(seconds: 3), () {
      if (!mounted) return;

      context.read<AuthBloc>().add(
            CheckAuthStatus(),
          );
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _controller.dispose();
    super.dispose();
  }

  void _navigate(AuthState state) {
    if (!mounted) return;

    if (state is Authenticated) {
      Navigator.pushReplacementNamed(
        context,
        AppRoutes.dashboard,
      );
    } else {
      Navigator.pushReplacementNamed(
        context,
        AppRoutes.login,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocListener<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is Authenticated ||
              state is Unauthenticated ||
              state is AuthError) {
            _navigate(state);
          }
        },
        child: Stack(
          fit: StackFit.expand,
          children: [

            /// Background Image
            Image.asset(
              "assets/images/splash_bg.png",
              fit: BoxFit.cover,
            ),

            /// Overlay
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.black.withOpacity(.25),
                    const Color(0xFF0A4A2A).withOpacity(.92),
                  ],
                ),
              ),
            ),

            /// Content
            SafeArea(
              child: Center(
                child: FadeTransition(
                  opacity: _fadeAnim,
                  child: ScaleTransition(
                    scale: _scaleAnim,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [

                        Container(
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(.12),
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: Colors.white24,
                            ),
                          ),
                          child: const Icon(
                            Icons.agriculture,
                            size: 90,
                            color: Colors.white,
                          ),
                        ),

                        const SizedBox(height: 28),

                        const Text(
                          "AgroHub Farmer",
                          style: TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                            letterSpacing: 1,
                          ),
                        ),

                        const SizedBox(height: 8),

                        Text(
                          "Smart Farming • Smart Market",
                          style: TextStyle(
                            color: Colors.white.withOpacity(.85),
                            fontSize: 15,
                          ),
                        ),

                        const SizedBox(height: 50),

                        SizedBox(
                          width: 28,
                          height: 28,
                          child: CircularProgressIndicator(
                            strokeWidth: 3,
                            color: Colors.white.withOpacity(.95),
                          ),
                        ),

                        const SizedBox(height: 16),

                        Text(
                          "Loading ecosystem...",
                          style: TextStyle(
                            color: Colors.white.withOpacity(.7),
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            /// Footer
            Positioned(
              bottom: 30,
              left: 0,
              right: 0,
              child: Text(
                "Version 1.0 Enterprise",
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.white.withOpacity(.55),
                  fontSize: 11,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}