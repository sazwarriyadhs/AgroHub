import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/herd_theme.dart';
import '../auth/login_screen.dart';

class ManajemenScreen extends StatelessWidget {
  const ManajemenScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F8F2),
      appBar: AppBar(
        title: Text(
          "Manajemen Farm",
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.bold,
            color: Colors.green,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildProfileCard(),
          const SizedBox(height: 20),
          _buildSectionTitle("Pengaturan Umum"),
          const SizedBox(height: 12),
          _buildSettingsTile(Icons.person_outline, "Profil Peternak", "Edit informasi profil Anda"),
          _buildSettingsTile(Icons.storefront_outlined, "Informasi Farm", "Nama farm, lokasi, kontak"),
          _buildSettingsTile(Icons.notifications_outlined, "Notifikasi", "Atur notifikasi dan alert"),
          const SizedBox(height: 20),
          _buildSectionTitle("Data & Laporan"),
          const SizedBox(height: 12),
          _buildSettingsTile(Icons.download_outlined, "Backup Data", "Backup ke cloud / lokal"),
          _buildSettingsTile(Icons.insert_drive_file_outlined, "Export Laporan", "PDF, Excel, CSV"),
          _buildSettingsTile(Icons.delete_outline, "Hapus Data", "Hapus data ternak & transaksi", isWarning: true),
          const SizedBox(height: 20),
          _buildSectionTitle("Dukungan"),
          const SizedBox(height: 12),
          _buildSettingsTile(Icons.help_outline, "Pusat Bantuan", "FAQ & Tutorial"),
          _buildSettingsTile(Icons.chat_bubble_outline, "Hubungi Kami", "CS: 0812-3456-7890"),
          _buildSettingsTile(Icons.info_outline, "Tentang Aplikasi", "Versi 1.0.0"),
          const SizedBox(height: 40),
          _buildLogoutButton(context),
        ],
      ),
    );
  }

  Widget _buildProfileCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1B5E20), Color(0xFF43A047)],
        ),
        borderRadius: BorderRadius.circular(28),
      ),
      child: Row(
        children: [
          Container(
            width: 70, height: 70,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
            ),
            child: const Icon(Icons.person, size: 40, color: Colors.green),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("Pak Andi", style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
                Text("Farm Herd Jaya", style: GoogleFonts.poppins(fontSize: 13, color: Colors.white70)),
                Container(
                  margin: const EdgeInsets.only(top: 8),
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.white24,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text("Premium Member", style: GoogleFonts.poppins(fontSize: 10, color: Colors.white)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(title, style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.bold));
  }

  Widget _buildSettingsTile(IconData icon, String title, String subtitle, {bool isWarning = false}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
      ),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: isWarning ? Colors.red.withOpacity(0.1) : Colors.green.withOpacity(0.1),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Icon(icon, color: isWarning ? Colors.red : Colors.green, size: 24),
        ),
        title: Text(title, style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 15, color: isWarning ? Colors.red : Colors.black87)),
        subtitle: Text(subtitle, style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey[600])),
        trailing: Icon(Icons.chevron_right, color: isWarning ? Colors.red : Colors.grey[400]),
      ),
    );
  }

  Widget _buildLogoutButton(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.red.shade200),
      ),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: Colors.red.withOpacity(0.1),
            borderRadius: BorderRadius.circular(16),
          ),
          child: const Icon(Icons.logout, color: Colors.red, size: 24),
        ),
        title: Text(
          "Logout",
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.w600,
            fontSize: 15,
            color: Colors.red,
          ),
        ),
        trailing: Icon(Icons.chevron_right, color: Colors.red.shade300),
        onTap: () {
          showDialog(
            context: context,
            builder: (ctx) => AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
              title: Text("Konfirmasi Logout", style: GoogleFonts.poppins(fontWeight: FontWeight.bold)),
              content: Text("Apakah Anda yakin ingin keluar?", style: GoogleFonts.poppins()),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(ctx),
                  child: Text("Batal", style: GoogleFonts.poppins(color: Colors.grey)),
                ),
                ElevatedButton(
                  onPressed: () {
                    Navigator.pop(ctx);
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (_) => const LoginScreen()),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: Text("Logout", style: GoogleFonts.poppins(color: Colors.white)),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

