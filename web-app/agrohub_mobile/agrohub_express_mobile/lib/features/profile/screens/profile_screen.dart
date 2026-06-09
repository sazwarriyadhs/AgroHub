import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../shared/widgets/scaffold_with_bottom_nav.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  static const Color primaryGreen =
      Color(0xff00752A);

  static const Color secondaryGreen =
      Color(0xff00A63E);

  static const Color backgroundColor =
      Color(0xffF4F7F5);

  @override
  Widget build(BuildContext context) {
    return ScaffoldWithBottomNav(
      currentIndex: 4,

      child: Scaffold(
        backgroundColor: backgroundColor,

        appBar: AppBar(
          elevation: 0,

          backgroundColor: primaryGreen,

          foregroundColor: Colors.white,

          title: Text(
            'Profil',

            style: GoogleFonts.poppins(
              fontWeight: FontWeight.w600,
            ),
          ),

          actions: [
            IconButton(
              onPressed: () {},

              icon: const Icon(
                Icons.edit_outlined,
              ),
            ),
          ],
        ),

        body: SingleChildScrollView(
          physics:
              const BouncingScrollPhysics(),

          child: Padding(
            padding:
                const EdgeInsets.all(16),

            child: Column(
              children: [
                // =====================================================
                // PROFILE HEADER
                // =====================================================

                Container(
                  width: double.infinity,

                  padding:
                      const EdgeInsets.all(
                    28,
                  ),

                  decoration: BoxDecoration(
                    gradient:
                        const LinearGradient(
                      colors: [
                        primaryGreen,
                        secondaryGreen,
                      ],

                      begin:
                          Alignment.topLeft,

                      end:
                          Alignment.bottomRight,
                    ),

                    borderRadius:
                        BorderRadius.circular(
                      30,
                    ),

                    boxShadow: [
                      BoxShadow(
                        color: Colors.green
                            .withOpacity(
                          0.25,
                        ),

                        blurRadius: 18,

                        offset:
                            const Offset(
                          0,
                          10,
                        ),
                      ),
                    ],
                  ),

                  child: Column(
                    children: [
                      Container(
                        padding:
                            const EdgeInsets.all(
                          4,
                        ),

                        decoration:
                            BoxDecoration(
                          shape:
                              BoxShape.circle,

                          border: Border.all(
                            color:
                                Colors.white,

                            width: 3,
                          ),
                        ),

                        child:
                            const CircleAvatar(
                          radius: 52,

                          backgroundImage:
                              AssetImage(
                            'assets/images/splash.png',
                          ),
                        ),
                      ),

                      const SizedBox(
                        height: 18,
                      ),

                      Text(
                        'Budi Santoso',

                        style:
                            GoogleFonts
                                .poppins(
                          color:
                              Colors.white,

                          fontSize: 26,

                          fontWeight:
                              FontWeight
                                  .bold,
                        ),
                      ),

                      const SizedBox(
                        height: 6,
                      ),

                      Text(
                        'Driver ID: DRV-001',

                        style:
                            GoogleFonts
                                .poppins(
                          color:
                              Colors.white70,
                        ),
                      ),

                      const SizedBox(
                        height: 18,
                      ),

                      Row(
                        mainAxisAlignment:
                            MainAxisAlignment
                                .center,

                        children: [
                          _profileBadge(
                            icon: Icons.star,
                            text: '4.9',
                          ),

                          const SizedBox(
                            width: 10,
                          ),

                          _profileBadge(
                            icon:
                                Icons.local_shipping,
                            text: '124 Trip',
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // =====================================================
                // ACCOUNT INFO
                // =====================================================

                _sectionCard(
                  title: 'Informasi Akun',

                  child: Column(
                    children: [
                      _profileTile(
                        icon: Icons.phone,
                        title: 'Phone',
                        subtitle:
                            '+62 812-3456-7890',
                      ),

                      _divider(),

                      _profileTile(
                        icon: Icons.email,
                        title: 'Email',
                        subtitle:
                            'budi@agrohub.com',
                      ),

                      _divider(),

                      _profileTile(
                        icon:
                            Icons.location_on,
                        title: 'Address',
                        subtitle:
                            'Jakarta, Indonesia',
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // =====================================================
                // VEHICLE INFO
                // =====================================================

                _sectionCard(
                  title: 'Kendaraan',

                  child: Column(
                    children: [
                      _profileTile(
                        icon:
                            Icons.local_shipping,
                        title:
                            'Vehicle Type',
                        subtitle:
                            'Truck Box Medium',
                      ),

                      _divider(),

                      _profileTile(
                        icon: Icons.badge,
                        title:
                            'License Plate',
                        subtitle:
                            'B 9021 AGH',
                      ),

                      _divider(),

                      _profileTile(
                        icon:
                            Icons.verified,
                        title:
                            'Driver Status',
                        subtitle:
                            'Verified Driver',
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // =====================================================
                // SETTINGS
                // =====================================================

                _sectionCard(
                  title: 'Pengaturan',

                  child: Column(
                    children: [
                      _menuTile(
                        icon:
                            Icons.notifications,
                        title:
                            'Notifikasi',
                      ),

                      _divider(),

                      _menuTile(
                        icon: Icons.security,
                        title:
                            'Keamanan Akun',
                      ),

                      _divider(),

                      _menuTile(
                        icon:
                            Icons.help_outline,
                        title:
                            'Pusat Bantuan',
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // =====================================================
                // LOGOUT BUTTON
                // =====================================================

                SizedBox(
                  width: double.infinity,

                  child:
                      ElevatedButton.icon(
                    onPressed: () {
                      ScaffoldMessenger.of(
                        context,
                      ).showSnackBar(
                        SnackBar(
                          backgroundColor:
                              Colors.red,

                          content: Text(
                            'Logout feature coming soon',

                            style:
                                GoogleFonts.poppins(),
                          ),
                        ),
                      );
                    },

                    icon: const Icon(
                      Icons.logout,
                    ),

                    label: Text(
                      'Logout',

                      style:
                          GoogleFonts.poppins(
                        fontWeight:
                            FontWeight.w600,
                      ),
                    ),

                    style:
                        ElevatedButton.styleFrom(
                      backgroundColor:
                          Colors.red,

                      foregroundColor:
                          Colors.white,

                      elevation: 0,

                      padding:
                          const EdgeInsets.symmetric(
                        vertical: 16,
                      ),

                      shape:
                          RoundedRectangleBorder(
                        borderRadius:
                            BorderRadius.circular(
                          18,
                        ),
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 120),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // =====================================================
  // PROFILE BADGE
  // =====================================================

  Widget _profileBadge({
    required IconData icon,
    required String text,
  }) {
    return Container(
      padding:
          const EdgeInsets.symmetric(
        horizontal: 14,
        vertical: 8,
      ),

      decoration: BoxDecoration(
        color:
            Colors.white.withOpacity(
          0.15,
        ),

        borderRadius:
            BorderRadius.circular(30),
      ),

      child: Row(
        children: [
          Icon(
            icon,
            color: Colors.white,
            size: 16,
          ),

          const SizedBox(width: 6),

          Text(
            text,

            style:
                GoogleFonts.poppins(
              color: Colors.white,

              fontWeight:
                  FontWeight.w600,

              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  // =====================================================
  // SECTION CARD
  // =====================================================

  Widget _sectionCard({
    required String title,
    required Widget child,
  }) {
    return Container(
      width: double.infinity,

      padding:
          const EdgeInsets.all(20),

      decoration: BoxDecoration(
        color: Colors.white,

        borderRadius:
            BorderRadius.circular(26),

        boxShadow: [
          BoxShadow(
            color:
                Colors.black.withOpacity(
              0.04,
            ),

            blurRadius: 12,

            offset: const Offset(0, 6),
          ),
        ],
      ),

      child: Column(
        crossAxisAlignment:
            CrossAxisAlignment.start,

        children: [
          Text(
            title,

            style:
                GoogleFonts.poppins(
              fontSize: 17,

              fontWeight:
                  FontWeight.bold,
            ),
          ),

          const SizedBox(height: 18),

          child,
        ],
      ),
    );
  }

  // =====================================================
  // PROFILE TILE
  // =====================================================

  Widget _profileTile({
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    return ListTile(
      contentPadding:
          EdgeInsets.zero,

      leading: Container(
        padding:
            const EdgeInsets.all(12),

        decoration: BoxDecoration(
          color:
              secondaryGreen
                  .withOpacity(0.10),

          borderRadius:
              BorderRadius.circular(
            16,
          ),
        ),

        child: Icon(
          icon,
          color: secondaryGreen,
        ),
      ),

      title: Text(
        title,

        style:
            GoogleFonts.poppins(
          fontWeight:
              FontWeight.w600,
        ),
      ),

      subtitle: Text(
        subtitle,

        style:
            GoogleFonts.poppins(
          color: Colors.grey[700],
        ),
      ),
    );
  }

  // =====================================================
  // MENU TILE
  // =====================================================

  Widget _menuTile({
    required IconData icon,
    required String title,
  }) {
    return ListTile(
      contentPadding:
          EdgeInsets.zero,

      leading: Container(
        padding:
            const EdgeInsets.all(12),

        decoration: BoxDecoration(
          color:
              secondaryGreen
                  .withOpacity(0.10),

          borderRadius:
              BorderRadius.circular(
            16,
          ),
        ),

        child: Icon(
          icon,
          color: secondaryGreen,
        ),
      ),

      title: Text(
        title,

        style:
            GoogleFonts.poppins(
          fontWeight:
              FontWeight.w600,
        ),
      ),

      trailing: const Icon(
        Icons.arrow_forward_ios,
        size: 16,
      ),

      onTap: () {},
    );
  }

  // =====================================================
  // DIVIDER
  // =====================================================

  Widget _divider() {
    return Divider(
      color: Colors.grey.shade200,
      height: 24,
    );
  }
}