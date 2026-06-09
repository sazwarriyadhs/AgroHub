import 'package:flutter/material.dart';
import '../../../core/constants/assets_constants.dart';

class GmvCard extends StatelessWidget {
  const GmvCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 200,
      width: double.infinity,

      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(28),
        boxShadow: [
          BoxShadow(
            color: Colors.green.withOpacity(.25),
            blurRadius: 18,
            offset: const Offset(0, 8),
          ),
        ],

        image: DecorationImage(
          image: AssetImage(
            AssetConstants.gmv,
          ),

          fit: BoxFit.cover,

          colorFilter: ColorFilter.mode(
            Colors.green.withOpacity(.72),
            BlendMode.darken,
          ),
        ),

        gradient: const LinearGradient(
          colors: [
            Color(0xff1B8F3E),
            Color(0xff35C85F),
          ],
        ),
      ),

      child: Padding(
        padding: const EdgeInsets.all(24),

        child: Row(
          children: [

            Container(
              padding: const EdgeInsets.all(14),

              decoration: BoxDecoration(
                color: Colors.white.withOpacity(.18),
                borderRadius: BorderRadius.circular(18),
              ),

              child: const Icon(
                Icons.trending_up,
                color: Colors.white,
                size: 38,
              ),
            ),

            const SizedBox(width: 20),

            Expanded(
              child: Column(
                mainAxisAlignment:
                    MainAxisAlignment.center,

                crossAxisAlignment:
                    CrossAxisAlignment.start,

                children: [

                  const Text(
                    "GMV Penjualan",

                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 14,
                    ),
                  ),

                  const SizedBox(height: 8),

                  const Text(
                    "Rp 24.750.000",

                    style: TextStyle(
                      fontSize: 40,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),

                  const SizedBox(height: 8),

                  Row(
                    children: [

                      const Icon(
                        Icons.trending_up,
                        color: Colors.white,
                        size: 16,
                      ),

                      const SizedBox(width: 5),

                      const Text(
                        "+12.5%",

                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),

                      Text(
                        " dibanding bulan lalu",

                        style: TextStyle(
                          color: Colors.white.withOpacity(.8),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            Column(
              mainAxisAlignment:
                  MainAxisAlignment.center,

              children: [

                _badge(
                  Icons.receipt,
                  "156 Transaksi",
                ),

                const SizedBox(height: 10),

                _badge(
                  Icons.shopping_bag,
                  "320kg Terjual",
                ),
              ],
            )
          ],
        ),
      ),
    );
  }

  Widget _badge(
    IconData icon,
    String text,
  ) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 14,
        vertical: 10,
      ),

      decoration: BoxDecoration(
        color: Colors.white.withOpacity(.18),

        borderRadius:
            BorderRadius.circular(18),
      ),

      child: Row(
        children: [

          Icon(
            icon,
            color: Colors.white,
            size: 14,
          ),

          const SizedBox(width: 6),

          Text(
            text,

            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w600,
            ),
          )
        ],
      ),
    );
  }
}