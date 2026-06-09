import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../shared/widgets/scaffold_with_bottom_nav.dart';

class EarningsScreen extends StatelessWidget {
  const EarningsScreen({super.key});

  static const Color primaryGreen =
      Color(0xff00752A);

  static const Color secondaryGreen =
      Color(0xff00A63E);

  static const Color backgroundColor =
      Color(0xffF4F7F5);

  @override
  Widget build(BuildContext context) {
    return ScaffoldWithBottomNav(
      currentIndex: 3,

      child: Scaffold(
        backgroundColor: backgroundColor,

        appBar: AppBar(
          elevation: 0,

          backgroundColor: primaryGreen,

          foregroundColor: Colors.white,

          title: Text(
            'Pendapatan',

            style: GoogleFonts.poppins(
              fontWeight: FontWeight.w600,
            ),
          ),

          actions: [
            IconButton(
              onPressed: () {},

              icon: const Icon(
                Icons.calendar_month,
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
                // TOTAL EARNINGS CARD
                // =====================================================

                Container(
                  width: double.infinity,

                  padding:
                      const EdgeInsets.all(
                    24,
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

                        blurRadius: 20,

                        offset:
                            const Offset(
                          0,
                          10,
                        ),
                      ),
                    ],
                  ),

                  child: Column(
                    crossAxisAlignment:
                        CrossAxisAlignment
                            .start,

                    children: [
                      Row(
                        children: [
                          Container(
                            padding:
                                const EdgeInsets.all(
                              14,
                            ),

                            decoration:
                                BoxDecoration(
                              color: Colors
                                  .white
                                  .withOpacity(
                                0.16,
                              ),

                              borderRadius:
                                  BorderRadius.circular(
                                18,
                              ),
                            ),

                            child: const Icon(
                              Icons.wallet,
                              color:
                                  Colors.white,

                              size: 30,
                            ),
                          ),

                          const Spacer(),

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
                              color: Colors
                                  .white
                                  .withOpacity(
                                0.15,
                              ),

                              borderRadius:
                                  BorderRadius.circular(
                                30,
                              ),
                            ),

                            child: Text(
                              '+18%',

                              style:
                                  GoogleFonts.poppins(
                                color:
                                    Colors.white,

                                fontWeight:
                                    FontWeight
                                        .w600,
                              ),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(
                        height: 24,
                      ),

                      Text(
                        'Total Pendapatan',

                        style:
                            GoogleFonts
                                .poppins(
                          color:
                              Colors.white70,

                          fontSize: 14,
                        ),
                      ),

                      const SizedBox(
                        height: 8,
                      ),

                      Text(
                        'Rp 1.250.000',

                        style:
                            GoogleFonts
                                .poppins(
                          color:
                              Colors.white,

                          fontSize: 34,

                          fontWeight:
                              FontWeight
                                  .bold,
                        ),
                      ),

                      const SizedBox(
                        height: 8,
                      ),

                      Text(
                        'Bulan Juni 2024',

                        style:
                            GoogleFonts
                                .poppins(
                          color:
                              Colors.white70,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 22),

                // =====================================================
                // STATS
                // =====================================================

                Row(
                  children: [
                    Expanded(
                      child: _statsCard(
                        title:
                            'Pengiriman',

                        value: '42',

                        icon:
                            Icons.local_shipping,

                        color:
                            Colors.orange,
                      ),
                    ),

                    const SizedBox(width: 14),

                    Expanded(
                      child: _statsCard(
                        title: 'Bonus',

                        value:
                            'Rp 250K',

                        icon:
                            Icons.stars,

                        color:
                            Colors.amber,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 24),

                // =====================================================
                // TRANSACTION TITLE
                // =====================================================

                Row(
                  children: [
                    Text(
                      'Riwayat Transaksi',

                      style:
                          GoogleFonts.poppins(
                        fontSize: 18,

                        fontWeight:
                            FontWeight.bold,
                      ),
                    ),

                    const Spacer(),

                    TextButton(
                      onPressed: () {},

                      child: const Text(
                        'Lihat Semua',
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 10),

                // =====================================================
                // TRANSACTION LIST
                // =====================================================

                ...List.generate(
                  8,
                  (index) =>
                      _transactionCard(
                    shipment:
                        '#SHP-00${index + 1}',

                    date:
                        '${index + 1} Juni 2024',

                    amount:
                        'Rp ${(75 + (index * 10))}.000',

                    status:
                        index % 2 == 0
                            ? 'Selesai'
                            : 'Diproses',
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
  // STATS CARD
  // =====================================================

  Widget _statsCard({
    required String title,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(18),

      decoration: BoxDecoration(
        color: Colors.white,

        borderRadius:
            BorderRadius.circular(24),

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
          Container(
            padding:
                const EdgeInsets.all(12),

            decoration: BoxDecoration(
              color:
                  color.withOpacity(0.12),

              borderRadius:
                  BorderRadius.circular(
                16,
              ),
            ),

            child: Icon(
              icon,
              color: color,
            ),
          ),

          const SizedBox(height: 16),

          Text(
            value,

            style:
                GoogleFonts.poppins(
              fontSize: 24,

              fontWeight:
                  FontWeight.bold,
            ),
          ),

          const SizedBox(height: 4),

          Text(
            title,

            style:
                GoogleFonts.poppins(
              color: Colors.grey[700],

              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  // =====================================================
  // TRANSACTION CARD
  // =====================================================

  Widget _transactionCard({
    required String shipment,
    required String date,
    required String amount,
    required String status,
  }) {
    final bool completed =
        status == 'Selesai';

    return Container(
      margin:
          const EdgeInsets.only(
        bottom: 14,
      ),

      padding:
          const EdgeInsets.all(18),

      decoration: BoxDecoration(
        color: Colors.white,

        borderRadius:
            BorderRadius.circular(24),

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

      child: Row(
        children: [
          Container(
            width: 58,
            height: 58,

            decoration: BoxDecoration(
              color:
                  secondaryGreen
                      .withOpacity(0.10),

              borderRadius:
                  BorderRadius.circular(
                18,
              ),
            ),

            child: const Icon(
              Icons.local_shipping,
              color: secondaryGreen,
            ),
          ),

          const SizedBox(width: 14),

          Expanded(
            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment
                      .start,

              children: [
                Text(
                  shipment,

                  style:
                      GoogleFonts.poppins(
                    fontWeight:
                        FontWeight.bold,

                    fontSize: 15,
                  ),
                ),

                const SizedBox(height: 4),

                Text(
                  date,

                  style:
                      GoogleFonts.poppins(
                    color:
                        Colors.grey[700],

                    fontSize: 12,
                  ),
                ),

                const SizedBox(height: 10),

                Container(
                  padding:
                      const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 5,
                  ),

                  decoration:
                      BoxDecoration(
                    color: completed
                        ? Colors.green
                            .withOpacity(
                            0.12,
                          )
                        : Colors.orange
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
                      color: completed
                          ? Colors.green
                          : Colors.orange,

                      fontSize: 11,

                      fontWeight:
                          FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),

          Text(
            amount,

            style:
                GoogleFonts.poppins(
              color: primaryGreen,

              fontWeight:
                  FontWeight.bold,

              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }
}