import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../shared/widgets/scaffold_with_bottom_nav.dart';

class TrackingScreen extends StatelessWidget {
  final String? shipmentId;

  const TrackingScreen({
    super.key,
    this.shipmentId,
  });

  static const Color primaryGreen =
      Color(0xff00752A);

  static const Color secondaryGreen =
      Color(0xff00A63E);

  static const Color backgroundColor =
      Color(0xffF4F7F5);

  @override
  Widget build(BuildContext context) {
    return ScaffoldWithBottomNav(
      currentIndex: 2,

      child: Scaffold(
        backgroundColor: backgroundColor,

        appBar: AppBar(
          elevation: 0,

          backgroundColor: primaryGreen,

          foregroundColor: Colors.white,

          title: Text(
            'Tracking',

            style: GoogleFonts.poppins(
              fontWeight: FontWeight.w600,
            ),
          ),

          actions: [
            IconButton(
              onPressed: () {},

              icon: const Icon(
                Icons.refresh,
              ),
            ),
          ],
        ),

        body: SingleChildScrollView(
          physics:
              const BouncingScrollPhysics(),

          child: Column(
            children: [
              // =====================================================
              // MAP PREVIEW
              // =====================================================

              Container(
                margin:
                    const EdgeInsets.all(
                  16,
                ),

                height: 240,

                decoration: BoxDecoration(
                  borderRadius:
                      BorderRadius.circular(
                    28,
                  ),

                  gradient:
                      const LinearGradient(
                    colors: [
                      primaryGreen,
                      secondaryGreen,
                    ],

                    begin:
                        Alignment.topLeft,

                    end: Alignment
                        .bottomRight,
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
                        8,
                      ),
                    ),
                  ],
                ),

                child: Stack(
                  children: [
                    Positioned.fill(
                      child: Opacity(
                        opacity: 0.08,

                        child: Icon(
                          Icons.map,
                          size: 240,
                          color:
                              Colors.white,
                        ),
                      ),
                    ),

                    Center(
                      child: Column(
                        mainAxisAlignment:
                            MainAxisAlignment
                                .center,

                        children: [
                          Container(
                            padding:
                                const EdgeInsets.all(
                              20,
                            ),

                            decoration:
                                BoxDecoration(
                              color: Colors
                                  .white
                                  .withOpacity(
                                0.18,
                              ),

                              shape:
                                  BoxShape
                                      .circle,
                            ),

                            child: const Icon(
                              Icons
                                  .location_on,

                              color:
                                  Colors.white,

                              size: 54,
                            ),
                          ),

                          const SizedBox(
                            height: 18,
                          ),

                          Text(
                            'Live Tracking',

                            style:
                                GoogleFonts
                                    .poppins(
                              color: Colors
                                  .white,

                              fontSize:
                                  22,

                              fontWeight:
                                  FontWeight
                                      .bold,
                            ),
                          ),

                          const SizedBox(
                            height: 6,
                          ),

                          Text(
                            shipmentId !=
                                    null
                                ? 'Shipment: $shipmentId'
                                : 'Shipment belum dipilih',

                            style:
                                GoogleFonts
                                    .poppins(
                              color: Colors
                                  .white70,

                              fontSize:
                                  13,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              // =====================================================
              // DRIVER CARD
              // =====================================================

              Container(
                margin:
                    const EdgeInsets.symmetric(
                  horizontal: 16,
                ),

                padding:
                    const EdgeInsets.all(
                  18,
                ),

                decoration: BoxDecoration(
                  color: Colors.white,

                  borderRadius:
                      BorderRadius.circular(
                    26,
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

                child: Row(
                  children: [
                    const CircleAvatar(
                      radius: 32,

                      backgroundImage:
                          AssetImage(
                        'assets/images/splash.png',
                      ),
                    ),

                    const SizedBox(
                      width: 16,
                    ),

                    Expanded(
                      child: Column(
                        crossAxisAlignment:
                            CrossAxisAlignment
                                .start,

                        children: [
                          Text(
                            'Budi Santoso',

                            style:
                                GoogleFonts
                                    .poppins(
                              fontSize: 18,

                              fontWeight:
                                  FontWeight
                                      .bold,
                            ),
                          ),

                          const SizedBox(
                            height: 4,
                          ),

                          Text(
                            'Driver AgroHub Express',

                            style:
                                GoogleFonts
                                    .poppins(
                              color: Colors
                                  .grey[700],

                              fontSize: 12,
                            ),
                          ),

                          const SizedBox(
                            height: 10,
                          ),

                          Row(
                            children: [
                              const Icon(
                                Icons.star,
                                color:
                                    Colors.amber,

                                size: 18,
                              ),

                              const SizedBox(
                                width: 4,
                              ),

                              Text(
                                '4.9 Rating',

                                style:
                                    GoogleFonts.poppins(
                                  fontWeight:
                                      FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                    Container(
                      padding:
                          const EdgeInsets.all(
                        12,
                      ),

                      decoration:
                          BoxDecoration(
                        color:
                            secondaryGreen
                                .withOpacity(
                          0.12,
                        ),

                        borderRadius:
                            BorderRadius.circular(
                          16,
                        ),
                      ),

                      child: const Icon(
                        Icons.call,
                        color:
                            secondaryGreen,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // =====================================================
              // TRACKING STATUS
              // =====================================================

              Container(
                margin:
                    const EdgeInsets.symmetric(
                  horizontal: 16,
                ),

                padding:
                    const EdgeInsets.all(
                  20,
                ),

                decoration: BoxDecoration(
                  color: Colors.white,

                  borderRadius:
                      BorderRadius.circular(
                    26,
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

                child: Column(
                  crossAxisAlignment:
                      CrossAxisAlignment
                          .start,

                  children: [
                    Text(
                      'Status Pengiriman',

                      style:
                          GoogleFonts.poppins(
                        fontSize: 18,

                        fontWeight:
                            FontWeight.bold,
                      ),
                    ),

                    const SizedBox(
                      height: 24,
                    ),

                    _trackingStep(
                      title:
                          'Paket Dijemput',

                      subtitle:
                          'Gudang Bandung',

                      time: '08:30',

                      isDone: true,
                    ),

                    _trackingStep(
                      title:
                          'Dalam Perjalanan',

                      subtitle:
                          'Tol Cipularang',

                      time: '10:15',

                      isDone: true,
                    ),

                    _trackingStep(
                      title:
                          'Menuju Tujuan',

                      subtitle:
                          'Jakarta Selatan',

                      time: '12:00',

                      isDone: false,
                    ),

                    _trackingStep(
                      title:
                          'Paket Terkirim',

                      subtitle:
                          'Estimasi 13:30',

                      time: '--:--',

                      isDone: false,

                      isLast: true,
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // =====================================================
              // ESTIMATION CARD
              // =====================================================

              Container(
                margin:
                    const EdgeInsets.symmetric(
                  horizontal: 16,
                ),

                padding:
                    const EdgeInsets.all(
                  20,
                ),

                decoration: BoxDecoration(
                  gradient:
                      const LinearGradient(
                    colors: [
                      primaryGreen,
                      secondaryGreen,
                    ],
                  ),

                  borderRadius:
                      BorderRadius.circular(
                    28,
                  ),
                ),

                child: Row(
                  children: [
                    Container(
                      padding:
                          const EdgeInsets.all(
                        16,
                      ),

                      decoration:
                          BoxDecoration(
                        color: Colors
                            .white
                            .withOpacity(
                          0.18,
                        ),

                        borderRadius:
                            BorderRadius.circular(
                          18,
                        ),
                      ),

                      child: const Icon(
                        Icons.access_time,
                        color: Colors.white,
                        size: 34,
                      ),
                    ),

                    const SizedBox(width: 18),

                    Expanded(
                      child: Column(
                        crossAxisAlignment:
                            CrossAxisAlignment
                                .start,

                        children: [
                          Text(
                            'Estimasi Tiba',

                            style:
                                GoogleFonts
                                    .poppins(
                              color:
                                  Colors.white70,

                              fontSize:
                                  13,
                            ),
                          ),

                          const SizedBox(
                            height: 4,
                          ),

                          Text(
                            '13:30 WIB',

                            style:
                                GoogleFonts
                                    .poppins(
                              color:
                                  Colors.white,

                              fontSize:
                                  26,

                              fontWeight:
                                  FontWeight
                                      .bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 120),
            ],
          ),
        ),
      ),
    );
  }

  // =====================================================
  // TRACKING STEP
  // =====================================================

  Widget _trackingStep({
    required String title,
    required String subtitle,
    required String time,
    required bool isDone,
    bool isLast = false,
  }) {
    return Row(
      crossAxisAlignment:
          CrossAxisAlignment.start,

      children: [
        Column(
          children: [
            Container(
              width: 22,
              height: 22,

              decoration: BoxDecoration(
                color: isDone
                    ? secondaryGreen
                    : Colors.grey[300],

                shape: BoxShape.circle,
              ),

              child: Icon(
                isDone
                    ? Icons.check
                    : Icons.circle,

                size: 12,

                color: Colors.white,
              ),
            ),

            if (!isLast)
              Container(
                width: 2,
                height: 50,
                color: isDone
                    ? secondaryGreen
                    : Colors.grey[300],
              ),
          ],
        ),

        const SizedBox(width: 14),

        Expanded(
          child: Padding(
            padding:
                const EdgeInsets.only(
              bottom: 18,
            ),

            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment
                      .start,

              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        title,

                        style:
                            GoogleFonts
                                .poppins(
                          fontWeight:
                              FontWeight
                                  .bold,

                          fontSize: 15,
                        ),
                      ),
                    ),

                    Text(
                      time,

                      style:
                          GoogleFonts
                              .poppins(
                        color:
                            Colors.grey,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 4),

                Text(
                  subtitle,

                  style:
                      GoogleFonts
                          .poppins(
                    color:
                        Colors.grey[700],

                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}