// lib/features/dashboard/widgets/dashboard_header_new.dart

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../auth/bloc/auth_bloc.dart';
import '../../../core/constants/assets_constants.dart';

class DashboardHeaderNew extends StatelessWidget {
  const DashboardHeaderNew({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthBloc, AuthState>(
      builder: (context, state) {
        String name = "Budi Santoso";
        String location = "Kec. Ngemplak, Kab. Sleman";
        
        if (state is Authenticated && state.userData != null) {
          name = state.userData!['name'] ?? "Budi Santoso";
          location = state.userData!['location'] ?? "Kec. Ngemplak, Kab. Sleman";
        }
        
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ========== BARIS ATAS: LOGO + NOTIFIKASI + WALLET ==========
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Logo AgroHub 175x75
                  Image.asset(
                    AssetConstants.logo,
                    height: 75,
                    width: 175,
                    fit: BoxFit.contain,
                    errorBuilder: (_, __, ___) => Container(
                      height: 75,
                      width: 175,
                      decoration: BoxDecoration(
                        color: const Color(0xFF2E7D32).withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.agriculture, size: 50, color: Color(0xFF2E7D32)),
                    ),
                  ),
                  // Kolom Kanan: Notifikasi + Wallet Mini
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      // Notifikasi Icon
                      Stack(
                        clipBehavior: Clip.none,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.notifications_outlined, size: 28, color: Colors.grey),
                            onPressed: () {
                              Navigator.pushNamed(context, '/notifications');
                            },
                          ),
                          Positioned(
                            right: 8,
                            top: 8,
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
                      ),
                      const SizedBox(height: 4),
                      // Wallet Mini Card
                      GestureDetector(
                        onTap: () {
                          Navigator.pushNamed(context, '/wallet');
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFF2E7D32), Color(0xFF1B5E20)],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(
                                Icons.account_balance_wallet,
                                size: 18,
                                color: Colors.white,
                              ),
                              const SizedBox(width: 8),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    "Saldo Wallet",
                                    style: TextStyle(
                                      color: Colors.white70,
                                      fontSize: 10,
                                    ),
                                  ),
                                  const Text(
                                    "Rp 250.000",
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 14,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              
              const SizedBox(height: 16),
              
              // ========== SELAMAT PAGI & NAMA ==========
              const Text(
                "Selamat pagi,",
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                name,
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF2E7D32),
                ),
              ),
              const SizedBox(height: 4),
              
              // ========== LOKASI ==========
              Row(
                children: [
                  const Icon(Icons.location_on, size: 14, color: Colors.grey),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      location,
                      style: const TextStyle(fontSize: 12, color: Colors.grey),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}