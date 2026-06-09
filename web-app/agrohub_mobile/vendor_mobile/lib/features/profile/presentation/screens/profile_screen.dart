// lib/features/profile/presentation/screens/profile_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/constants/app_constants.dart';
import '../../../../core/services/api_client.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _isLoading = true;
  String _userName = '';
  String _userEmail = '';
  String _userPhone = '';
  String _userCity = '';
  String _userProvince = '';
  String _userAvatar = '';
  bool _isVerified = false;
  String _farmName = '';

  @override
  void initState() {
    super.initState();
    _loadUserProfile();
  }

  Future<void> _loadUserProfile() async {
    setState(() => _isLoading = true);

    try {
      const storage = FlutterSecureStorage();
      final token = await storage.read(key: AppConstants.tokenKey);

      if (token == null || token.isEmpty) {
        _setDefaultProfile();
        return;
      }

      final apiClient = ApiClient();
      apiClient.setAuthToken(token);

      final response = await apiClient.get('/profile');

      if (response.statusCode == 200 && response.data is Map<String, dynamic>) {
        final data = response.data['data'] as Map<String, dynamic>;

        if (mounted) {
          setState(() {
            _userName = data['name']?.toString() ?? 'Vendor AgroHub';
            _userEmail = data['email']?.toString() ?? 'vendor@agrohub.com';
            _userPhone = data['phone']?.toString() ?? '';
            _userCity = data['city']?.toString() ?? 'Malang';
            _userProvince = data['province']?.toString() ?? 'Jawa Timur';
            _userAvatar = data['avatar']?.toString() ?? '';
            _isVerified = data['is_verified'] == true;
            _farmName = data['farm_name']?.toString() ?? 'AgroHub Official Farm';
            _isLoading = false;
          });
        }
      } else {
        _setDefaultProfile();
      }
    } catch (e) {
      debugPrint('Error loading profile: $e');
      _setDefaultProfile();
    }
  }

  void _setDefaultProfile() {
    if (mounted) {
      setState(() {
        _userName = 'Vendor AgroHub';
        _userEmail = 'vendor@agrohub.com';
        _userPhone = '08123456789';
        _userCity = 'Malang';
        _userProvince = 'Jawa Timur';
        _isVerified = true;
        _farmName = 'AgroHub Official Farm';
        _isLoading = false;
      });
    }
  }

  Future<void> _logout(BuildContext context) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Logout'),
        content: const Text('Apakah Anda yakin ingin keluar?'),
        backgroundColor: const Color(0xFF052E24),
        titleTextStyle: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
        contentTextStyle: const TextStyle(color: Colors.white70),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Batal', style: TextStyle(color: Colors.white54)),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Logout', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );

    if (confirm == true && context.mounted) {
      const storage = FlutterSecureStorage();
      await storage.delete(key: AppConstants.tokenKey);
      ApiClient.instance.clearAuthToken();
      
      if (context.mounted) {
        Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
      }
    }
  }

  // ✅ FITUR 1: Navigasi ke halaman Info Toko / Store Profile
  void _navigateToStoreProfile() {
    Navigator.pushNamed(context, '/store-profile');
  }

  // ✅ FITUR 2: Navigasi ke halaman Ganti Password
  void _navigateToChangePassword() {
    Navigator.pushNamed(context, '/change-password');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF021A14),
      appBar: AppBar(
        title: const Text('Profil', style: TextStyle(color: Colors.white)),
        centerTitle: true,
        backgroundColor: const Color(0xFF021A14),
        elevation: 0,
      ),
      body: RefreshIndicator(
        color: const Color(0xFF1B8F3E),
        onRefresh: _loadUserProfile,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              if (_isLoading)
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Column(
                    children: [
                      CircleAvatar(radius: 50, backgroundColor: Color(0xFF1B8F3E), child: CircularProgressIndicator(color: Colors.white)),
                      SizedBox(height: 12),
                      SizedBox(width: 150, child: LinearProgressIndicator()),
                      SizedBox(height: 8),
                      SizedBox(width: 200, child: LinearProgressIndicator()),
                    ],
                  ),
                )
              else
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: Colors.white.withOpacity(0.08)),
                  ),
                  child: Column(
                    children: [
                      CircleAvatar(
                        radius: 50,
                        backgroundColor: const Color(0xFF1B8F3E),
                        child: _userAvatar.isNotEmpty
                            ? null
                            : const Icon(Icons.store, size: 50, color: Colors.white),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        _userName,
                        style: GoogleFonts.poppins(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _userEmail,
                        style: GoogleFonts.poppins(color: Colors.white70),
                      ),
                      if (_userPhone.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(
                          _userPhone,
                          style: GoogleFonts.poppins(color: Colors.white60, fontSize: 14),
                        ),
                      ],
                      if (_userCity.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(
                          '$_userCity, $_userProvince',
                          style: GoogleFonts.poppins(color: Colors.white60, fontSize: 14),
                        ),
                      ],
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                        decoration: BoxDecoration(
                          color: _isVerified ? Colors.green.withOpacity(0.2) : Colors.orange.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          _isVerified ? 'Verified Seller' : 'Unverified',
                          style: TextStyle(
                            color: _isVerified ? Colors.greenAccent : Colors.orangeAccent,
                          ),
                        ),
                      ),
                      if (_farmName.isNotEmpty) ...[
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.blue.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            _farmName,
                            style: const TextStyle(color: Colors.blueAccent, fontSize: 12),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              const SizedBox(height: 16),
              _menuItem(
                context,
                icon: Icons.store,
                title: 'Info Toko',
                subtitle: 'Kelola profil toko',
                onTap: _navigateToStoreProfile,
              ),
              _menuItem(
                context,
                icon: Icons.security,
                title: 'Keamanan',
                subtitle: 'Ubah password',
                onTap: _navigateToChangePassword,
              ),
              _menuItem(
                context,
                icon: Icons.logout,
                title: 'Logout',
                subtitle: 'Keluar dari aplikasi',
                isLogout: true,
                onTap: () => _logout(context),
              ),
            ],
          ),
        ),
      ),
    );
  }
  
  Widget _menuItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    bool isLogout = false,
    VoidCallback? onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: ListTile(
        leading: Icon(icon, color: isLogout ? Colors.red : Colors.greenAccent),
        title: Text(
          title,
          style: GoogleFonts.poppins(color: isLogout ? Colors.red : Colors.white),
        ),
        subtitle: Text(
          subtitle,
          style: GoogleFonts.poppins(color: Colors.white54, fontSize: 12),
        ),
        trailing: Icon(isLogout ? Icons.logout : Icons.chevron_right, color: Colors.white54),
        onTap: onTap,
      ),
    );
  }
}