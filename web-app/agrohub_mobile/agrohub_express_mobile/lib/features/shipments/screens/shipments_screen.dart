import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../shared/widgets/scaffold_with_bottom_nav.dart';

class ShipmentsScreen extends StatelessWidget {
  const ShipmentsScreen({super.key});

  static const Color primaryGreen =
      Color(0xff00752A);

  static const Color secondaryGreen =
      Color(0xff00A63E);

  static const Color backgroundColor =
      Color(0xffF4F7F5);

  @override
  Widget build(BuildContext context) {
    return ScaffoldWithBottomNav(
      currentIndex: 1,

      child: Scaffold(
        backgroundColor: backgroundColor,

        appBar: AppBar(
          elevation: 0,

          backgroundColor: primaryGreen,

          foregroundColor: Colors.white,

          title: Text(
            'Pengiriman',
            style: GoogleFonts.poppins(
              fontWeight: FontWeight.w600,
            ),
          ),

          actions: [
            IconButton(
              onPressed: () {},

              icon: const Icon(
                Icons.search,
              ),
            ),

            IconButton(
              onPressed: () {},

              icon: const Icon(
                Icons.filter_list,
              ),
            ),
          ],
        ),

        body: ListView.builder(
          padding: const EdgeInsets.all(16),

          physics:
              const BouncingScrollPhysics(),

          itemCount: 8,

          itemBuilder: (context, index) {
            final statuses = [
              'Pickup',
              'Dalam Perjalanan',
              'Menuju Gudang',
              'Terkirim',
            ];

            final status =
                statuses[index %
                    statuses.length];

            final statusColor =
                _getStatusColor(status);

            return Container(
              margin:
                  const EdgeInsets.only(
                bottom: 16,
              ),

              decoration: BoxDecoration(
                color: Colors.white,

                borderRadius:
                    BorderRadius.circular(
                  24,
                ),

                boxShadow: [
                  BoxShadow(
                    color: Colors.black
                        .withOpacity(
                      0.04,
                    ),

                    blurRadius: 12,

                    offset:
                        const Offset(
                      0,
                      6,
                    ),
                  ),
                ],
              ),

              child: InkWell(
                borderRadius:
                    BorderRadius.circular(
                  24,
                ),

                onTap: () {
                  ScaffoldMessenger.of(
                    context,
                  ).showSnackBar(
                    SnackBar(
                      backgroundColor:
                          primaryGreen,

                      content: Text(
                        'Detail Pengiriman #SHP-00${index + 1}',
                        style:
                            GoogleFonts.poppins(),
                      ),
                    ),
                  );
                },

                child: Padding(
                  padding:
                      const EdgeInsets.all(
                    18,
                  ),

                  child: Column(
                    children: [
                      // =========================================
                      // TOP
                      // =========================================

                      Row(
                        children: [
                          Container(
                            width: 60,
                            height: 60,

                            decoration:
                                BoxDecoration(
                              color:
                                  secondaryGreen
                                      .withOpacity(
                                0.10,
                              ),

                              borderRadius:
                                  BorderRadius.circular(
                                18,
                              ),
                            ),

                            child: Padding(
                              padding:
                                  const EdgeInsets.all(
                                10,
                              ),

                              child:
                                  Image.asset(
                                'assets/icons/mobil.png',

                                fit:
                                    BoxFit.contain,

                                errorBuilder: (
                                  context,
                                  error,
                                  stackTrace,
                                ) {
                                  return const Icon(
                                    Icons
                                        .local_shipping,

                                    color:
                                        secondaryGreen,
                                  );
                                },
                              ),
                            ),
                          ),

                          const SizedBox(
                            width: 14,
                          ),

                          Expanded(
                            child: Column(
                              crossAxisAlignment:
                                  CrossAxisAlignment
                                      .start,

                              children: [
                                Text(
                                  '#SHP-00${index + 1}',

                                  style:
                                      GoogleFonts.poppins(
                                    fontSize:
                                        16,

                                    fontWeight:
                                        FontWeight
                                            .bold,
                                  ),
                                ),

                                const SizedBox(
                                  height:
                                      4,
                                ),

                                Text(
                                  'Bandung → Jakarta',

                                  style:
                                      GoogleFonts.poppins(
                                    color:
                                        Colors
                                            .grey[700],

                                    fontSize:
                                        12,
                                  ),
                                ),
                              ],
                            ),
                          ),

                          Container(
                            padding:
                                const EdgeInsets.symmetric(
                              horizontal:
                                  12,

                              vertical:
                                  6,
                            ),

                            decoration:
                                BoxDecoration(
                              color:
                                  statusColor
                                      .withOpacity(
                                0.12,
                              ),

                              borderRadius:
                                  BorderRadius.circular(
                                30,
                              ),
                            ),

                            child: Text(
                              status,

                              style:
                                  GoogleFonts.poppins(
                                color:
                                    statusColor,

                                fontSize:
                                    11,

                                fontWeight:
                                    FontWeight
                                        .w600,
                              ),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(
                        height: 18,
                      ),

                      // =========================================
                      // INFO
                      // =========================================

                      Row(
                        children: [
                          _infoItem(
                            Icons.access_time,
                            '08:30',
                          ),

                          const SizedBox(
                            width: 20,
                          ),

                          _infoItem(
                            Icons.route,
                            '8.6 km',
                          ),

                          const Spacer(),

                          Text(
                            'Rp 150.000',

                            style:
                                GoogleFonts.poppins(
                              fontSize:
                                  16,

                              color:
                                  primaryGreen,

                              fontWeight:
                                  FontWeight
                                      .bold,
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(
                        height: 18,
                      ),

                      // =========================================
                      // BUTTON
                      // =========================================

                      SizedBox(
                        width:
                            double.infinity,

                        child:
                            ElevatedButton.icon(
                          onPressed: () {},

                          icon: const Icon(
                            Icons.navigation,
                            size: 18,
                          ),

                          label: Text(
                            'Lihat Tracking',

                            style:
                                GoogleFonts.poppins(
                              fontWeight:
                                  FontWeight
                                      .w600,
                            ),
                          ),

                          style:
                              ElevatedButton.styleFrom(
                            elevation:
                                0,

                            backgroundColor:
                                secondaryGreen,

                            foregroundColor:
                                Colors.white,

                            padding:
                                const EdgeInsets.symmetric(
                              vertical:
                                  14,
                            ),

                            shape:
                                RoundedRectangleBorder(
                              borderRadius:
                                  BorderRadius.circular(
                                16,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  // =========================================================
  // STATUS COLOR
  // =========================================================

  static Color _getStatusColor(
    String status,
  ) {
    switch (status) {
      case 'Pickup':
        return Colors.orange;

      case 'Dalam Perjalanan':
        return Colors.blue;

      case 'Menuju Gudang':
        return Colors.purple;

      case 'Terkirim':
        return Colors.green;

      default:
        return Colors.grey;
    }
  }

  // =========================================================
  // INFO ITEM
  // =========================================================

  Widget _infoItem(
    IconData icon,
    String text,
  ) {
    return Row(
      children: [
        Icon(
          icon,
          size: 16,
          color: Colors.grey[600],
        ),

        const SizedBox(width: 6),

        Text(
          text,

          style: GoogleFonts.poppins(
            fontSize: 12,
            color: Colors.grey[700],
          ),
        ),
      ],
    );
  }
}