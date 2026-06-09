// lib/features/auth/presentation/screens/register_screen.dart

import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:agrohub_aqua_app/app/theme/app_theme.dart';
import '../../../../core/config/api_config.dart';
import '../../../dashboard/presentation/screens/aqua_dashboard.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();

  // Controllers
  final TextEditingController _fullNameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController = TextEditingController();
  final TextEditingController _farmNameController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();

  bool obscurePassword = true;
  bool obscureConfirmPassword = true;
  bool isLoading = false;
  String _selectedFarmType = 'aquaculture';

  // 🔥 PERBAIKI: Hapus "icon:" yang salah
  final List<Map<String, dynamic>> _farmTypes = [
    {"value": "aquaculture", "label": "Budidaya Ikan Air Tawar", "icon": Icons.set_meal},
    {"value": "shrimp", "label": "Budidaya Udang", "icon": Icons.pets},
    {"value": "crab", "label": "Budidaya Kepiting", "icon": Icons.pest_control},
  ];

  @override
  void dispose() {
    _fullNameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _farmNameController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  void showMessage(String text, {bool success = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(text),
        backgroundColor: success ? Colors.green : Colors.red,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  Future<void> handleRegister() async {
    FocusScope.of(context).unfocus();

    if (!_formKey.currentState!.validate()) {
      return;
    }

    if (_passwordController.text != _confirmPasswordController.text) {
      showMessage("Password tidak sama");
      return;
    }

    setState(() => isLoading = true);

    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.register}'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': _fullNameController.text.trim(),
          'email': _emailController.text.trim(),
          'phone': _phoneController.text.trim(),
          'password': _passwordController.text,
          'user_type': 'farmer',
          'farm_type': _selectedFarmType,
          'farm_name': _farmNameController.text.trim(),
          'address': _addressController.text.trim(),
          'is_starter': true,
          'kyc_status': 'pending',
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 || response.statusCode == 201) {
        if (data['success'] == true) {
          showMessage("✨ Selamat! Akun berhasil dibuat", success: true);
          
          Future.delayed(const Duration(seconds: 1), () {
            if (mounted) {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (_) => const AquaDashboard()),
              );
            }
          });
        } else {
          showMessage(data['message'] ?? 'Registrasi gagal');
        }
      } else {
        showMessage(data['message'] ?? 'Gagal terhubung ke server');
      }
    } catch (e) {
      debugPrint('Register error: $e');
      showMessage('Gagal terhubung ke server. Periksa koneksi internet.');
    } finally {
      if (mounted) setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isSmall = size.width < 360;

    return Scaffold(
      backgroundColor: const Color(0xFF031B15),
      body: Stack(
        children: [
          SafeArea(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.all(18),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    const SizedBox(height: 10),

                    // Back Button
                    Row(
                      children: [
                        IconButton(
                          onPressed: () => Navigator.pop(context),
                          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),

                    // Logo
                    Hero(
                      tag: 'logo',
                      child: Container(
                        width: 160,
                        height: 70,
                        child: Image.asset(
                          'assets/logo/aqua.png',
                          width: 160,
                          height: 70,
                          fit: BoxFit.contain,
                          errorBuilder: (_, __, ___) => Icon(Icons.set_meal, size: 50, color: Colors.white),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Title
                    Text(
                      "Mulai Budidaya Modern",
                      style: GoogleFonts.poppins(
                        fontSize: isSmall ? 24 : 28,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 8),

                    Text(
                      "Buat akun dulu, langsung bisa pakai!",
                      textAlign: TextAlign.center,
                      style: GoogleFonts.poppins(
                        fontSize: 13,
                        color: Colors.white70,
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 28),

                    // Form Card
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(22),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(32),
                        gradient: const LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            Color(0xFF063126),
                            Color(0xFF021A14),
                          ],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.primaryColor.withOpacity(0.18),
                            blurRadius: 30,
                            offset: const Offset(0, 15),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          // Nama Lengkap
                          _buildInput(
                            hint: "Nama Lengkap",
                            icon: Icons.person_outline_rounded,
                            controller: _fullNameController,
                          ),
                          const SizedBox(height: 18),

                          // Email
                          _buildInput(
                            hint: "Email Aktif",
                            icon: Icons.email_outlined,
                            controller: _emailController,
                            keyboardType: TextInputType.emailAddress,
                          ),
                          const SizedBox(height: 18),

                          // Nomor WhatsApp
                          _buildInput(
                            hint: "Nomor WhatsApp",
                            icon: Icons.phone_outlined,
                            controller: _phoneController,
                            keyboardType: TextInputType.phone,
                          ),
                          const SizedBox(height: 18),

                          // Nama Farm/Kolam
                          _buildInput(
                            hint: "Nama Farm/Kolam",
                            icon: Icons.set_meal,
                            controller: _farmNameController,
                          ),
                          const SizedBox(height: 18),

                          // Jenis Budidaya
                          _buildFarmTypeDropdown(),
                          const SizedBox(height: 18),

                          // Alamat
                          _buildInput(
                            hint: "Alamat Lengkap",
                            icon: Icons.location_on_outlined,
                            controller: _addressController,
                            maxLines: 2,
                          ),
                          const SizedBox(height: 18),

                          // Password
                          _buildInput(
                            hint: "Password",
                            icon: Icons.lock_outline_rounded,
                            controller: _passwordController,
                            obscure: obscurePassword,
                            suffix: IconButton(
                              onPressed: () => setState(() => obscurePassword = !obscurePassword),
                              icon: Icon(
                                obscurePassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                                color: Colors.white70,
                              ),
                            ),
                          ),
                          const SizedBox(height: 18),

                          // Konfirmasi Password
                          _buildInput(
                            hint: "Konfirmasi Password",
                            icon: Icons.lock_outline_rounded,
                            controller: _confirmPasswordController,
                            obscure: obscureConfirmPassword,
                            suffix: IconButton(
                              onPressed: () => setState(() => obscureConfirmPassword = !obscureConfirmPassword),
                              icon: Icon(
                                obscureConfirmPassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                                color: Colors.white70,
                              ),
                            ),
                          ),
                          const SizedBox(height: 28),

                          // Starter Mode Info
                          Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                                colors: [
                                  AppTheme.primaryColor.withOpacity(0.12),
                                  Colors.blue.withOpacity(0.04),
                                ],
                              ),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: AppTheme.primaryColor.withOpacity(0.2)),
                            ),
                            child: Column(
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.all(10),
                                      decoration: BoxDecoration(
                                        color: AppTheme.primaryColor.withOpacity(0.14),
                                        borderRadius: BorderRadius.circular(14),
                                      ),
                                      child: const Icon(Icons.bolt, color: AppTheme.primaryColor, size: 24),
                                    ),
                                    const SizedBox(width: 14),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            "⚡ Mode Starter Aktif",
                                            style: GoogleFonts.poppins(
                                              fontSize: 14,
                                              fontWeight: FontWeight.bold,
                                              color: AppTheme.primaryColor,
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            "Langsung masuk dashboard tanpa verifikasi.",
                                            style: GoogleFonts.poppins(
                                              fontSize: 11,
                                              color: Colors.white70,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 16),
                                _buildFeature("✅ Lihat data kolam & monitoring"),
                                const SizedBox(height: 10),
                                _buildFeature("✅ Lihat kualitas air real-time"),
                                const SizedBox(height: 10),
                                _buildFeature("✅ Baca edukasi budidaya"),
                                const SizedBox(height: 10),
                                _buildFeatureLocked("🔒 Jual hasil panen di marketplace"),
                                const SizedBox(height: 10),
                                _buildFeatureLocked("🔒 AI Prediksi panen & penyakit"),
                              ],
                            ),
                          ),
                          const SizedBox(height: 30),

                          // Tombol Daftar
                          GestureDetector(
                            onTap: isLoading ? null : handleRegister,
                            child: Container(
                              width: double.infinity,
                              height: 56,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(22),
                                gradient: const LinearGradient(
                                  colors: [Color(0xFF49D17D), Color(0xFF1B8F3E)],
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.green.withOpacity(0.35),
                                    blurRadius: 20,
                                    offset: const Offset(0, 10),
                                  ),
                                ],
                              ),
                              child: Center(
                                child: isLoading
                                    ? const SizedBox(
                                        width: 24,
                                        height: 24,
                                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                      )
                                    : Text(
                                        "🚀 Mulai Budidaya",
                                        style: GoogleFonts.poppins(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.white,
                                        ),
                                      ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 20),

                          // Login Link
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                "Sudah punya akun? ",
                                style: GoogleFonts.poppins(color: Colors.white70),
                              ),
                              GestureDetector(
                                onTap: () => Navigator.pop(context),
                                child: Text(
                                  "Masuk",
                                  style: GoogleFonts.poppins(
                                    color: const Color(0xFF8BE78B),
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),

                          // Terms
                          Text(
                            "Dengan mendaftar, kamu menyetujui syarat & ketentuan AgroHub Aqua",
                            textAlign: TextAlign.center,
                            style: GoogleFonts.poppins(
                              fontSize: 10,
                              color: Colors.white38,
                              height: 1.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ),
          ),

          // Loading Overlay
          if (isLoading)
            Container(
              color: Colors.black.withOpacity(0.5),
              child: const Center(
                child: CircularProgressIndicator(color: AppTheme.primaryColor),
              ),
            ),
        ],
      ),
    );
  }

  // ================= INPUT WIDGET =================
  Widget _buildInput({
    required String hint,
    required IconData icon,
    required TextEditingController controller,
    TextInputType keyboardType = TextInputType.text,
    bool obscure = false,
    Widget? suffix,
    int maxLines = 1,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: TextFormField(
        controller: controller,
        obscureText: obscure,
        keyboardType: keyboardType,
        maxLines: maxLines,
        style: GoogleFonts.poppins(color: Colors.white),
        validator: (value) {
          if (value == null || value.isEmpty) return "Yuk diisi dulu";
          if (hint == "Email Aktif" && !value.contains('@')) return "Email tidak valid";
          if (hint == "Nomor WhatsApp" && value.length < 10) return "Nomor terlalu pendek";
          if (hint == "Password" && value.length < 6) return "Minimal 6 karakter ya";
          return null;
        },
        decoration: InputDecoration(
          border: InputBorder.none,
          hintText: hint,
          hintStyle: GoogleFonts.poppins(color: Colors.white54),
          prefixIcon: Icon(icon, color: Colors.white70),
          suffixIcon: suffix,
          contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 18),
        ),
      ),
    );
  }

  // ================= FARM TYPE DROPDOWN =================
  Widget _buildFarmTypeDropdown() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: DropdownButtonFormField<String>(
        value: _selectedFarmType,
        dropdownColor: const Color(0xFF063126),
        style: GoogleFonts.poppins(color: Colors.white),
        decoration: InputDecoration(
          border: InputBorder.none,
          prefixIcon: Icon(Icons.agriculture, color: Colors.white70), // 🔥 Ganti Icons.farm_rounded
          contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
        ),
        items: _farmTypes.map<DropdownMenuItem<String>>((type) {
          return DropdownMenuItem<String>(
            value: type['value'] as String,
            child: Row(
              children: [
                Icon(type['icon'] as IconData, color: Colors.white70, size: 20),
                const SizedBox(width: 12),
                Text(type['label'] as String, style: GoogleFonts.poppins(color: Colors.white)),
              ],
            ),
          );
        }).toList(),
        onChanged: (value) => setState(() => _selectedFarmType = value!),
        validator: (value) => value == null ? 'Pilih jenis budidaya' : null,
      ),
    );
  }

  // ================= FEATURE WIDGETS =================
  Widget _buildFeature(String text) {
    return Row(
      children: [
        Icon(Icons.check_circle, color: Colors.green, size: 16),
        const SizedBox(width: 10),
        Expanded(
          child: Text(
            text.replaceFirst('✅ ', ''),
            style: GoogleFonts.poppins(fontSize: 11, color: Colors.white70),
          ),
        ),
      ],
    );
  }

  Widget _buildFeatureLocked(String text) {
    return Row(
      children: [
        Icon(Icons.lock_rounded, color: Colors.orange, size: 16),
        const SizedBox(width: 10),
        Expanded(
          child: Text(
            text.replaceFirst('🔒 ', ''),
            style: GoogleFonts.poppins(fontSize: 11, color: Colors.white54),
          ),
        ),
      ],
    );
  }
}


