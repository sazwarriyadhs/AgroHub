import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class DashboardHeader extends StatelessWidget {
  const DashboardHeader({super.key});

  static const Color primaryGreen =
      Color(0xff00752A);

  static const Color secondaryGreen =
      Color(0xff00A63E);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,

      padding: const EdgeInsets.fromLTRB(
        20,
        20,
        20,
        30,
      ),

      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [
            primaryGreen,
            secondaryGreen,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),

        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(40),
          bottomRight: Radius.circular(40),
        ),
      ),

      child: Column(
        crossAxisAlignment:
            CrossAxisAlignment.start,

        children: [
          // =====================================================
          // TOP BAR
          // =====================================================

          _buildTopBar(context),

          const SizedBox(height: 24),

          // =====================================================
          // PROFILE
          // =====================================================

          _buildProfileInfo(),

          const SizedBox(height: 20),

          // =====================================================
          // STATUS
          // =====================================================

          _buildStatusAndRating(),

          const SizedBox(height: 24),

          // =====================================================
          // HEADER IMAGE
          // =====================================================

          ClipRRect(
            borderRadius:
                BorderRadius.circular(24),

            child: Image.asset(
              'assets/header/header.png',

              width: double.infinity,

              height: 160,

              fit: BoxFit.cover,

              errorBuilder:
                  (context, error, stackTrace) {
                return Container(
                  height: 160,

                  decoration: BoxDecoration(
                    color:
                        Colors.white.withOpacity(
                      0.10,
                    ),

                    borderRadius:
                        BorderRadius.circular(
                      24,
                    ),
                  ),

                  child: const Center(
                    child: Icon(
                      Icons.image,
                      color: Colors.white,
                      size: 60,
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  // =========================================================
  // TOP BAR
  // =========================================================

  Widget _buildTopBar(BuildContext context) {
    return Row(
      children: [
        // MENU BUTTON

        _glassButton(
          icon: Icons.menu,
          onTap: () {
            Scaffold.of(context).openDrawer();
          },
        ),

        const Spacer(),

        // LOGO

        _buildLogo(),

        const Spacer(),

        // NOTIFICATION

        _buildNotificationIcon(),
      ],
    );
  }

  // =========================================================
  // LOGO
  // =========================================================

  Widget _buildLogo() {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 14,
        vertical: 10,
      ),

      decoration: BoxDecoration(
        color: Colors.white,

        borderRadius:
            BorderRadius.circular(18),

        boxShadow: [
          BoxShadow(
            blurRadius: 10,
            color: Colors.black.withOpacity(
              0.08,
            ),
          ),
        ],
      ),

      child: Image.asset(
        'assets/logo/agroexpress.png',

        height: 42,

        fit: BoxFit.contain,

        errorBuilder:
            (context, error, stackTrace) {
          return const Icon(
            Icons.store,
            size: 40,
            color: primaryGreen,
          );
        },
      ),
    );
  }

  // =========================================================
  // NOTIFICATION
  // =========================================================

  Widget _buildNotificationIcon() {
    return Stack(
      children: [
        _glassButton(
          icon: Icons.notifications_none,
          onTap: () {},
        ),

        Positioned(
          top: 10,
          right: 10,

          child: Container(
            width: 10,
            height: 10,

            decoration: const BoxDecoration(
              color: Colors.red,
              shape: BoxShape.circle,
            ),
          ),
        ),
      ],
    );
  }

  // =========================================================
  // PROFILE
  // =========================================================

  Widget _buildProfileInfo() {
    return Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment:
                CrossAxisAlignment.start,

            children: [
              Text(
                'Hello, Driver 👋',

                style: GoogleFonts.poppins(
                  color: Colors.white70,
                  fontSize: 16,
                ),
              ),

              const SizedBox(height: 8),

              Text(
                'Budi Santoso',

                style: GoogleFonts.poppins(
                  color: Colors.white,
                  fontSize: 30,
                  fontWeight:
                      FontWeight.bold,
                ),
              ),

              const SizedBox(height: 6),

              Text(
                'Senior Logistics Driver',

                style: GoogleFonts.poppins(
                  color: Colors.white70,
                  fontSize: 14,
                ),
              ),
            ],
          ),
        ),

        _buildProfileAvatar(),
      ],
    );
  }

  // =========================================================
  // PROFILE AVATAR
  // =========================================================

  Widget _buildProfileAvatar() {
    return Container(
      width: 82,
      height: 82,

      decoration: BoxDecoration(
        shape: BoxShape.circle,

        border: Border.all(
          color: Colors.greenAccent,
          width: 3,
        ),
      ),

      child: const CircleAvatar(
        backgroundImage: AssetImage(
          'assets/images/splash.png',
        ),
      ),
    );
  }

  // =========================================================
  // STATUS
  // =========================================================

  Widget _buildStatusAndRating() {
    return Row(
      children: [
        _buildStatusBadge(),

        const SizedBox(width: 10),

        _buildRatingBadge(),
      ],
    );
  }

  Widget _buildStatusBadge() {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 14,
        vertical: 10,
      ),

      decoration: BoxDecoration(
        color: Colors.white.withOpacity(
          0.15,
        ),

        borderRadius:
            BorderRadius.circular(30),
      ),

      child: Row(
        children: [
          const CircleAvatar(
            radius: 5,
            backgroundColor:
                Colors.greenAccent,
          ),

          const SizedBox(width: 8),

          Text(
            'Online',

            style: GoogleFonts.poppins(
              color: Colors.white,
              fontWeight:
                  FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRatingBadge() {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 14,
        vertical: 10,
      ),

      decoration: BoxDecoration(
        color: Colors.white.withOpacity(
          0.15,
        ),

        borderRadius:
            BorderRadius.circular(30),
      ),

      child: Row(
        children: [
          const Icon(
            Icons.star,
            color: Colors.amber,
            size: 18,
          ),

          const SizedBox(width: 6),

          Text(
            '4.9 (128)',

            style: GoogleFonts.poppins(
              color: Colors.white,
              fontWeight:
                  FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  // =========================================================
  // GLASS BUTTON
  // =========================================================

  Widget _glassButton({
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return ClipRRect(
      borderRadius:
          BorderRadius.circular(14),

      child: BackdropFilter(
        filter: ImageFilter.blur(
          sigmaX: 10,
          sigmaY: 10,
        ),

        child: InkWell(
          onTap: onTap,

          child: Container(
            padding: const EdgeInsets.all(
              10,
            ),

            decoration: BoxDecoration(
              color:
                  Colors.white.withOpacity(
                0.15,
              ),

              borderRadius:
                  BorderRadius.circular(
                14,
              ),
            ),

            child: Icon(
              icon,
              color: Colors.white,
            ),
          ),
        ),
      ),
    );
  }
}