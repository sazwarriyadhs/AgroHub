import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:agrohub_customer/features/auth/providers/user_provider.dart';
import 'package:agrohub_customer/features/auth/presentation/screens/login_screen.dart';


// ✅ REMOVED: import '../main_wrapper.dart'; (tidak dipakai)

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  static const Color primaryGreen = Color(0xFF1B5E20);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7F2),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Text(
          "Profil Saya",
          style: GoogleFonts.poppins(
            color: Colors.black,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined, color: primaryGreen),
            onPressed: () => _showComingSoon('Pengaturan'),
          ),
        ],
      ),
      // ✅ OPTIMIZED: Menggunakan Selector untuk rebuild yang lebih efisien
      body: Consumer<UserProvider>(
        builder: (context, userProvider, child) {
          final user = userProvider.user;
          
          if (userProvider.isLoading && user == null) {
            return const Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(primaryGreen),
              ),
            );
          }
          
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                _buildHeader(userProvider),
                const SizedBox(height: 20),
                _buildStats(userProvider),
                const SizedBox(height: 20),
                _buildMemberBenefits(userProvider),
                const SizedBox(height: 20),
                _buildInfoCard(userProvider),
                const SizedBox(height: 20),
                _buildMenu(userProvider),
              ],
            ),
          );
        },
      ),
    );
  }

  // ================= HEADER =================
  Widget _buildHeader(UserProvider userProvider) {
    final user = userProvider.user;
    final fullName = user?.fullName ?? user?.name ?? 'Guest';
    final email = user?.email ?? '';
    final membershipTier = user?.membershipTier ?? 'bronze';
    final isVerified = user?.isVerified ?? false;
    
    // Generate avatar URL
    final avatarUrl = "https://ui-avatars.com/api/?name=${fullName.replaceAll(' ', '+')}&background=1B5E20&color=fff";
    
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF14532D), Color(0xFF22C55E)],
        ),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        children: [
          // ✅ FIXED: Avatar dengan error handling
          CircleAvatar(
            radius: 35,
            backgroundColor: Colors.white,
            child: ClipOval(
              child: Image.network(
                avatarUrl,
                fit: BoxFit.cover,
                width: 70,
                height: 70,
                errorBuilder: (_, __, ___) {
                  return Icon(
                    Icons.person,
                    size: 35,
                    color: primaryGreen,
                  );
                },
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  fullName,
                  style: GoogleFonts.poppins(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Text(
                  email,
                  style: GoogleFonts.poppins(
                    color: Colors.white70,
                    fontSize: 12,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.amber,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.star, size: 12, color: Colors.black87),
                          const SizedBox(width: 4),
                          Text(
                            membershipTier.toUpperCase(),
                            style: GoogleFonts.poppins(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: Colors.black87,
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (isVerified) ...[
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.green.shade700,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.verified, size: 10, color: Colors.white),
                            const SizedBox(width: 4),
                            Text(
                              "Verified",
                              style: GoogleFonts.poppins(
                                fontSize: 9,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          )
        ],
      ),
    );
  }

  // ================= STATS CARD =================
  Widget _buildStats(UserProvider userProvider) {
    final totalOrders = userProvider.totalOrders;
    final totalSpent = userProvider.totalSpent;
    final loyaltyPoints = userProvider.loyaltyPoints;

    // Format total spent ke Rupiah
    String formatRupiah(double amount) {
      if (amount >= 1000000) {
        return 'Rp ${(amount / 1000000).toStringAsFixed(1)}JT';
      }
      return 'Rp ${amount.toStringAsFixed(0)}';
    }

    return Row(
      children: [
        _statCard("Total Pesanan", "$totalOrders", Icons.shopping_bag_outlined),
        const SizedBox(width: 10),
        _statCard("Total Belanja", formatRupiah(totalSpent), Icons.money_outlined),
        const SizedBox(width: 10),
        _statCard("Poin", "$loyaltyPoints", Icons.card_giftcard),
      ],
    );
  }

  Widget _statCard(String title, String value, IconData icon) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          children: [
            Icon(icon, size: 20, color: primaryGreen),
            const SizedBox(height: 6),
            // ✅ FIXED: Menambahkan handling overflow
            FittedBox(
              fit: BoxFit.scaleDown,
              child: Text(
                value,
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: primaryGreen,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              title,
              style: GoogleFonts.poppins(
                fontSize: 9,
                color: Colors.grey.shade500,
              ),
              textAlign: TextAlign.center,
            )
          ],
        ),
      ),
    );
  }

  // ================= MEMBER BENEFITS =================
  Widget _buildMemberBenefits(UserProvider userProvider) {
    final membershipTier = userProvider.membershipTier;
    
    // Benefits based on membership tier
    Map<String, List<String>> benefits = {
      'bronze': ['Poin Setiap Belanja', 'Akses Flash Sale'],
      'silver': ['Poin Setiap Belanja', 'Akses Flash Sale', 'Diskon 5%'],
      'gold': ['Diskon 10%', 'Free Ongkir 5x/bulan', 'Prioritas Customer Service', 'Akses Eksklusif'],
      'platinum': ['Diskon 15%', 'Free Ongkir Unlimited', 'VIP Support', 'Undangan Event Khusus'],
    };
    
    final userBenefits = benefits[membershipTier.toLowerCase()] ?? benefits['bronze']!;
    
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.amber.shade100),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.workspace_premium, size: 18, color: Colors.amber.shade700),
              const SizedBox(width: 8),
              Text(
                "Benefit Member ${membershipTier.toUpperCase()}",
                style: GoogleFonts.poppins(
                  fontWeight: FontWeight.bold,
                  fontSize: 13,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: userBenefits.map((benefit) {
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: const Color(0xFFE8F8ED),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Text(
                  benefit,
                  style: GoogleFonts.poppins(
                    fontSize: 10,
                    color: primaryGreen,
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  // ================= INFO CARD =================
  Widget _buildInfoCard(UserProvider userProvider) {
    final user = userProvider.user;
    
    // ✅ FIXED: Menggunakan '-' sebagai default, bukan hardcoded date
    String joinDate = '-';
    if (user?.userCreatedAt != null) {
      final date = user!.userCreatedAt;
      if (date.month >= 1 && date.month <= 12) {
        joinDate = '${_getMonthName(date.month)} ${date.year}';
      }
    }
    
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Informasi Akun",
            style: GoogleFonts.poppins(
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 12),
          _infoRow(Icons.phone_android, user?.phone ?? 'Belum diisi'),
          _infoRow(Icons.location_on, 
              user?.defaultAddressLabel ?? 'Belum ada alamat'),
          _infoRow(Icons.email_outlined, user?.email ?? ''),
          _infoRow(Icons.calendar_today, "Bergabung sejak $joinDate"),
          _infoRow(Icons.verified_user,
              user?.isVerified == true ? "Akun Terverifikasi ✓" : "Belum Terverifikasi"),
        ],
      ),
    );
  }

  Widget _infoRow(IconData icon, String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 18, color: primaryGreen),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              text,
              style: GoogleFonts.poppins(fontSize: 12, height: 1.4),
            ),
          )
        ],
      ),
    );
  }

  // ================= MENU =================
  Widget _buildMenu(UserProvider userProvider) {
    final List<Map<String, dynamic>> menu = [
      {"title": "Edit Profile", "icon": Icons.edit_outlined, "route": "/edit-profile"},
      {"title": "Alamat Pengiriman", "icon": Icons.location_on_outlined, "route": "/address"},
      {"title": "Riwayat Pesanan", "icon": Icons.receipt_long_outlined, "route": "/orders"},
      {"title": "Membership", "icon": Icons.workspace_premium_outlined, "route": "/membership"},
      {"title": "Keamanan Akun", "icon": Icons.security_outlined, "route": "/security"},
      {"title": "Pusat Bantuan", "icon": Icons.help_outline, "route": "/help"},
      {"title": "Logout", "icon": Icons.logout, "route": "/logout", "isLogout": true},
    ];

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: menu.asMap().entries.map((entry) {
          int index = entry.key;
          var item = entry.value;
          bool isLast = index == menu.length - 1;
          bool isLogout = item["isLogout"] == true;
          
          return Column(
            children: [
              ListTile(
                leading: Icon(
                  item["icon"], 
                  size: 20, 
                  color: isLogout ? Colors.red : primaryGreen,
                ),
                title: Text(
                  item["title"],
                  style: GoogleFonts.poppins(
                    fontSize: 13,
                    color: isLogout ? Colors.red : Colors.black87,
                    fontWeight: isLogout ? FontWeight.w600 : FontWeight.normal,
                  ),
                ),
                trailing: isLogout 
                    ? null 
                    : const Icon(Icons.chevron_right, size: 20, color: Colors.grey),
                onTap: () => _onMenuTap(item["route"], userProvider),
              ),
              if (!isLast)
                Divider(
                  height: 1,
                  thickness: 0.5,
                  indent: 16,
                  endIndent: 16,
                  color: Colors.grey.shade200,
                ),
            ],
          );
        }).toList(),
      ),
    );
  }

  // ✅ FIXED: Menggunakan route-based navigation, bukan title-based
  void _onMenuTap(String route, UserProvider userProvider) {
    if (route == "/logout") {
      _showLogoutDialog(userProvider);
    } else {
      _navigateToRoute(route);
    }
  }

  // ✅ FIXED: Function untuk navigasi berdasarkan route
  void _navigateToRoute(String route) {
    // TODO: Implement actual navigation when screens are ready
    switch (route) {
      case "/edit-profile":
        _showComingSoon('Edit Profile');
        break;
      case "/address":
        _showComingSoon('Alamat Pengiriman');
        break;
      case "/orders":
        _showComingSoon('Riwayat Pesanan');
        break;
      case "/membership":
        _showComingSoon('Membership');
        break;
      case "/security":
        _showComingSoon('Keamanan Akun');
        break;
      case "/help":
        _showComingSoon('Pusat Bantuan');
        break;
      default:
        _showComingSoon(route);
    }
  }

  // ✅ FIXED: Logout dengan error handling yang aman
  void _showLogoutDialog(UserProvider userProvider) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(
          "Konfirmasi Logout",
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
        ),
        content: Text(
          "Apakah Anda yakin ingin keluar dari AgroHub?",
          style: GoogleFonts.poppins(),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              "Batal",
              style: GoogleFonts.poppins(color: Colors.grey),
            ),
          ),
          ElevatedButton(
            onPressed: () async {
              // Close dialog
              if (Navigator.canPop(context)) {
                Navigator.pop(context);
              }
              
              // Show loading
              showDialog(
                context: context,
                barrierDismissible: false,
                builder: (context) => const Center(
                  child: CircularProgressIndicator(),
                ),
              );
              
              try {
                // ✅ FIXED: Try-catch untuk handle error logout
                await userProvider.logout();
                
                // ✅ FIXED: Safe pop dengan pengecekan
                if (mounted && Navigator.canPop(context)) {
                  Navigator.of(context, rootNavigator: true).pop();
                }
                
                if (mounted) {
                  // Navigate to login screen
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (context) => LoginScreen()),
                    (route) => false,
                  );
                }
              } catch (e) {
                // ✅ FIXED: Handle error gracefully
                if (mounted && Navigator.canPop(context)) {
                  Navigator.of(context, rootNavigator: true).pop();
                }
                
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text("Logout gagal: ${e.toString()}"),
                      backgroundColor: Colors.red,
                      behavior: SnackBarBehavior.floating,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  );
                }
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: Text(
              "Logout",
              style: GoogleFonts.poppins(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }

  void _showComingSoon(String feature) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('✨ $feature akan segera hadir'),
        duration: const Duration(seconds: 1),
        backgroundColor: primaryGreen,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  // ✅ FIXED: Month validation untuk menghindari RangeError
  String _getMonthName(int month) {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    if (month < 1 || month > 12) {
      return 'Unknown';
    }

    return months[month - 1];
  }
}