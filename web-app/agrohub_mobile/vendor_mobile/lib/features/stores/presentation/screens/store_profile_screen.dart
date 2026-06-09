// lib/features/store/presentation/screens/store_profile_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/constants/app_constants.dart';
import '../../../../core/services/api_client.dart';

class StoreProfileScreen extends StatefulWidget {
  const StoreProfileScreen({super.key});

  @override
  State<StoreProfileScreen> createState() => _StoreProfileScreenState();
}

class _StoreProfileScreenState extends State<StoreProfileScreen> {
  bool _isLoading = true;
  String _farmName = '';
  String _farmAddress = '';
  String _farmSize = '';
  String _businessLicense = '';
  String _bankName = '';
  String _bankAccountNumber = '';
  String _bankAccountName = '';

  @override
  void initState() {
    super.initState();
    _loadStoreProfile();
  }

  Future<void> _loadStoreProfile() async {
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
            _farmName = data['farm_name']?.toString() ?? 'AgroHub Official Farm';
            _farmAddress = data['address']?.toString() ?? '';
            _farmSize = data['farm_size']?.toString() ?? '';
            _businessLicense = data['business_license_number']?.toString() ?? '';
            _bankName = data['bank_name']?.toString() ?? '';
            _bankAccountNumber = data['bank_account_number']?.toString() ?? '';
            _bankAccountName = data['bank_account_name']?.toString() ?? '';
            _isLoading = false;
          });
        }
      } else {
        _setDefaultProfile();
      }
    } catch (e) {
      debugPrint('Error loading store profile: $e');
      _setDefaultProfile();
    }
  }

  void _setDefaultProfile() {
    if (mounted) {
      setState(() {
        _farmName = 'AgroHub Official Farm';
        _farmAddress = 'Jl. Raya Pertanian No. 123, Malang';
        _farmSize = '50 Hektar';
        _businessLicense = '1234567890';
        _bankName = 'Bank BCA';
        _bankAccountNumber = '1234567890';
        _bankAccountName = 'Vendor AgroHub';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF021A14),
      appBar: AppBar(
        title: const Text('Info Toko', style: TextStyle(color: Colors.white)),
        centerTitle: true,
        backgroundColor: const Color(0xFF021A14),
        elevation: 0,
      ),
      body: RefreshIndicator(
        color: const Color(0xFF1B8F3E),
        onRefresh: _loadStoreProfile,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              if (_isLoading)
                const Center(child: CircularProgressIndicator())
              else
                Column(
                  children: [
                    _infoCard(
                      icon: Icons.store,
                      title: 'Nama Toko',
                      value: _farmName,
                    ),
                    const SizedBox(height: 12),
                    _infoCard(
                      icon: Icons.location_on,
                      title: 'Alamat',
                      value: _farmAddress,
                    ),
                    const SizedBox(height: 12),
                    _infoCard(
                      icon: Icons.agriculture,
                      title: 'Luas Lahan',
                      value: _farmSize,
                    ),
                    const SizedBox(height: 12),
                    _infoCard(
                      icon: Icons.business,
                      title: 'Nomor Izin Usaha',
                      value: _businessLicense,
                    ),
                    const SizedBox(height: 12),
                    _infoCard(
                      icon: Icons.account_balance,
                      title: 'Bank',
                      value: _bankName,
                    ),
                    const SizedBox(height: 12),
                    _infoCard(
                      icon: Icons.credit_card,
                      title: 'Nomor Rekening',
                      value: _bankAccountNumber,
                    ),
                    const SizedBox(height: 12),
                    _infoCard(
                      icon: Icons.person,
                      title: 'Atas Nama',
                      value: _bankAccountName,
                    ),
                  ],
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _infoCard({
    required IconData icon,
    required String title,
    required String value,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFF1B8F3E).withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: const Color(0xFF1B8F3E), size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.poppins(
                    color: Colors.white60,
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value.isNotEmpty ? value : '-',
                  style: GoogleFonts.poppins(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}