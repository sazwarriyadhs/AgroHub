import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  static const Color primaryGreen =
      Color(0xff00752A);

  static const Color secondaryGreen =
      Color(0xff00A63E);

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: const Color(0xffF4F7F5),

      child: Column(
        children: [
          // =====================================================
          // HEADER
          // =====================================================

          Container(
            width: double.infinity,

            padding: const EdgeInsets.fromLTRB(
              24,
              60,
              24,
              24,
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
                bottomLeft: Radius.circular(32),
                bottomRight: Radius.circular(32),
              ),
            ),

            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment.start,

              children: [
                ClipRRect(
                  borderRadius:
                      BorderRadius.circular(100),

                  child: BackdropFilter(
                    filter: ImageFilter.blur(
                      sigmaX: 10,
                      sigmaY: 10,
                    ),

                    child: Container(
                      decoration: BoxDecoration(
                        border: Border.all(
                          color: Colors.white,
                          width: 3,
                        ),

                        shape: BoxShape.circle,
                      ),

                      child: const CircleAvatar(
                        radius: 36,

                        backgroundImage: AssetImage(
                          'assets/images/splash.png',
                        ),
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 16),

                Text(
                  'Budi Santoso',
                  style: GoogleFonts.poppins(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 4),

                Text(
                  'Senior Driver',
                  style: GoogleFonts.poppins(
                    color: Colors.white70,
                    fontSize: 14,
                  ),
                ),

                const SizedBox(height: 14),

                Container(
                  padding:
                      const EdgeInsets.symmetric(
                    horizontal: 14,
                    vertical: 7,
                  ),

                  decoration: BoxDecoration(
                    color:
                        Colors.white.withOpacity(0.15),

                    borderRadius:
                        BorderRadius.circular(40),
                  ),

                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.circle,
                        color: Colors.greenAccent,
                        size: 12,
                      ),

                      const SizedBox(width: 8),

                      Text(
                        'Online',
                        style: GoogleFonts.poppins(
                          color: Colors.white,
                          fontWeight:
                              FontWeight.w600,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // =====================================================
          // MENU
          // =====================================================

          Expanded(
            child: ListView(
              padding:
                  const EdgeInsets.symmetric(
                horizontal: 12,
              ),

              children: [
                _drawerItem(
                  context,
                  icon: Icons.dashboard_outlined,
                  title: 'Dashboard',
                  route: '/',
                ),

                _drawerItem(
                  context,
                  icon:
                      Icons.inventory_2_outlined,
                  title: 'Shipments',
                  route: '/shipments',
                ),

                _drawerItem(
                  context,
                  icon: Icons.map_outlined,
                  title: 'Tracking',
                  route: '/tracking',
                ),

                _drawerItem(
                  context,
                  icon:
                      Icons.people_outline,
                  title: 'Drivers',
                  route: '/drivers',
                ),

                _drawerItem(
                  context,
                  icon:
                      Icons.directions_car_outlined,
                  title: 'Fleet',
                  route: '/fleet',
                ),

                _drawerItem(
                  context,
                  icon:
                      Icons.attach_money_outlined,
                  title: 'Earnings',
                  route: '/earnings',
                ),

                _drawerItem(
                  context,
                  icon:
                      Icons.person_outline,
                  title: 'Profile',
                  route: '/profile',
                ),

                const Padding(
                  padding:
                      EdgeInsets.symmetric(
                    vertical: 16,
                  ),
                  child: Divider(),
                ),

                _drawerItem(
                  context,
                  icon:
                      Icons.settings_outlined,
                  title: 'Settings',
                  route: '/settings',
                ),

                _drawerItem(
                  context,
                  icon:
                      Icons.support_agent_outlined,
                  title: 'Support',
                  route: '/support',
                ),

                const SizedBox(height: 20),

                // =====================================================
                // LOGOUT
                // =====================================================

                Container(
                  margin:
                      const EdgeInsets.symmetric(
                    horizontal: 6,
                  ),

                  decoration: BoxDecoration(
                    color:
                        Colors.red.withOpacity(0.08),

                    borderRadius:
                        BorderRadius.circular(18),
                  ),

                  child: ListTile(
                    leading: const Icon(
                      Icons.logout,
                      color: Colors.red,
                    ),

                    title: Text(
                      'Logout',
                      style:
                          GoogleFonts.poppins(
                        color: Colors.red,
                        fontWeight:
                            FontWeight.w600,
                      ),
                    ),

                    onTap: () {
                      Navigator.pop(context);

                      context.go('/login');
                    },
                  ),
                ),

                const SizedBox(height: 30),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // =========================================================
  // DRAWER ITEM
  // =========================================================

  Widget _drawerItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String route,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),

      child: Material(
        color: Colors.transparent,

        child: InkWell(
          borderRadius:
              BorderRadius.circular(18),

          onTap: () {
            Navigator.pop(context);

            context.go(route);
          },

          child: Container(
            padding:
                const EdgeInsets.symmetric(
              horizontal: 14,
              vertical: 14,
            ),

            decoration: BoxDecoration(
              borderRadius:
                  BorderRadius.circular(18),
            ),

            child: Row(
              children: [
                Container(
                  padding:
                      const EdgeInsets.all(10),

                  decoration: BoxDecoration(
                    color: secondaryGreen
                        .withOpacity(0.10),

                    borderRadius:
                        BorderRadius.circular(14),
                  ),

                  child: Icon(
                    icon,
                    color: secondaryGreen,
                    size: 22,
                  ),
                ),

                const SizedBox(width: 14),

                Expanded(
                  child: Text(
                    title,
                    style:
                        GoogleFonts.poppins(
                      fontSize: 14,
                      fontWeight:
                          FontWeight.w500,
                    ),
                  ),
                ),

                const Icon(
                  Icons.chevron_right,
                  color: Colors.grey,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}