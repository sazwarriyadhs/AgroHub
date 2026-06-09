// lib/features/auth/presentation/screens/register_screen.dart

import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import '../bloc/auth_bloc.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();

  // ================= CONTROLLERS =================
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _storeController = TextEditingController();
  final TextEditingController _businessTypeController = TextEditingController();
  final TextEditingController _nikController = TextEditingController();
  final TextEditingController _npwpController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  // ================= STATES =================
  bool obscurePassword = true;
  bool isLoading = false;

  File? ktpImage;
  File? selfieKtpImage;

  final ImagePicker _picker = ImagePicker();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _storeController.dispose();
    _businessTypeController.dispose();
    _nikController.dispose();
    _npwpController.dispose();
    _addressController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  // ================= PICK IMAGE =================
  Future<void> pickImage(bool isSelfie) async {
    final picked = await _picker.pickImage(
      source: ImageSource.camera,
      imageQuality: 70,
    );

    if (picked != null) {
      setState(() {
        if (isSelfie) {
          selfieKtpImage = File(picked.path);
        } else {
          ktpImage = File(picked.path);
        }
      });
    }
  }

  // ================= REGISTER =================
  void registerVendor() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    if (ktpImage == null || selfieKtpImage == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Upload KTP dan selfie wajib'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() => isLoading = true);

    // ✅ PANGGIL API REGISTER VIA BLOC
    context.read<AuthBloc>().add(
      RegisterRequested(
        name: _nameController.text.trim(),
        email: _emailController.text.trim(),
        password: _passwordController.text.trim(),
        storeName: _storeController.text.trim(),
        phone: _phoneController.text.trim(),
        businessType: _businessTypeController.text.trim(),
        nik: _nikController.text.trim(),
        npwp: _npwpController.text.trim(),
        address: _addressController.text.trim(),
      ),
    );

    // Simulasi loading, nanti di bloc listener
    await Future.delayed(const Duration(seconds: 2));

    setState(() => isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthBloc, AuthState>(
      listener: (context, state) {
        if (state is AuthLoading) {
          setState(() => isLoading = true);
        } else if (state is AuthAuthenticated) {
          setState(() => isLoading = false);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Registrasi vendor berhasil! Silakan login'),
              backgroundColor: Colors.green,
            ),
          );
          Navigator.pushReplacementNamed(context, '/login');
        } else if (state is AuthError) {
          setState(() => isLoading = false);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message),
              backgroundColor: Colors.red,
            ),
          );
        }
      },
      child: Scaffold(
        backgroundColor: const Color(0xFF021A14),
        body: Stack(
          children: [
            SingleChildScrollView(
              child: Column(
                children: [
                  // ================= HEADER =================
                  Stack(
                    children: [
                      Container(
                        height: 320,
                        width: double.infinity,
                        decoration: const BoxDecoration(
                          borderRadius: BorderRadius.only(
                            bottomLeft: Radius.circular(40),
                            bottomRight: Radius.circular(40),
                          ),
                          image: DecorationImage(
                            image: AssetImage('assets/images/login_bg.png'),
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                      Container(
                        height: 320,
                        decoration: BoxDecoration(
                          borderRadius: const BorderRadius.only(
                            bottomLeft: Radius.circular(40),
                            bottomRight: Radius.circular(40),
                          ),
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.black.withOpacity(0.15),
                              Colors.black.withOpacity(0.75),
                            ],
                          ),
                        ),
                      ),
                      SafeArea(
                        child: Padding(
                          padding: const EdgeInsets.all(20),
                          child: Row(
                            children: [
                              GestureDetector(
                                onTap: () {
                                  Navigator.pop(context);
                                },
                                child: Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.12),
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                  child: const Icon(
                                    Icons.arrow_back_ios_new,
                                    color: Colors.white,
                                    size: 18,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      Positioned(
                        bottom: 30,
                        left: 24,
                        right: 24,
                        child: Column(
                          children: [
                            Container(
                              height: 95,
                              width: 95,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(28),
                                color: Colors.white,
                              ),
                              child: const Icon(
                                Icons.storefront_rounded,
                                color: Color(0xFF1B8F3E),
                                size: 48,
                              ),
                            ),
                            const SizedBox(height: 18),
                            Text(
                              'Daftar Vendor AgroHub',
                              textAlign: TextAlign.center,
                              style: GoogleFonts.poppins(
                                color: Colors.white,
                                fontSize: 28,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 10),
                            Text(
                              'Gabung menjadi vendor resmi AgroHub\nuntuk menjual produk pertanian modern',
                              textAlign: TextAlign.center,
                              style: GoogleFonts.poppins(
                                color: Colors.white70,
                                fontSize: 14,
                                height: 1.6,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  // ================= FORM =================
                  Transform.translate(
                    offset: const Offset(0, -35),
                    child: Container(
                      margin: const EdgeInsets.symmetric(horizontal: 20),
                      padding: const EdgeInsets.all(28),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(34),
                        gradient: const LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            Color(0xFF052E24),
                            Color(0xFF021A14),
                          ],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.green.withOpacity(0.25),
                            blurRadius: 30,
                            offset: const Offset(0, 15),
                          ),
                        ],
                      ),
                      child: Form(
                        key: _formKey,
                        child: Column(
                          children: [
                            // OWNER
                            buildInput(
                              controller: _nameController,
                              hint: 'Nama lengkap owner',
                              icon: Icons.person_outline,
                            ),
                            const SizedBox(height: 18),
                            buildInput(
                              controller: _emailController,
                              hint: 'Email bisnis',
                              icon: Icons.email_outlined,
                            ),
                            const SizedBox(height: 18),
                            buildInput(
                              controller: _phoneController,
                              hint: 'Nomor WhatsApp',
                              icon: Icons.phone_android_outlined,
                            ),
                            const SizedBox(height: 18),
                            // STORE
                            buildInput(
                              controller: _storeController,
                              hint: 'Nama usaha / toko vendor',
                              icon: Icons.storefront_outlined,
                            ),
                            const SizedBox(height: 18),
                            buildInput(
                              controller: _businessTypeController,
                              hint: 'Jenis usaha vendor',
                              icon: Icons.category_outlined,
                            ),
                            const SizedBox(height: 18),
                            // LEGAL
                            buildInput(
                              controller: _nikController,
                              hint: 'NIK KTP',
                              icon: Icons.badge_outlined,
                            ),
                            const SizedBox(height: 18),
                            buildInput(
                              controller: _npwpController,
                              hint: 'NPWP (opsional)',
                              icon: Icons.receipt_long,
                            ),
                            const SizedBox(height: 18),
                            buildInput(
                              controller: _addressController,
                              hint: 'Alamat gudang / toko',
                              icon: Icons.location_on_outlined,
                              maxLines: 3,
                            ),
                            const SizedBox(height: 18),
                            // PASSWORD
                            buildInput(
                              controller: _passwordController,
                              hint: 'Password',
                              icon: Icons.lock_outline,
                              obscure: obscurePassword,
                              suffix: IconButton(
                                onPressed: () {
                                  setState(() {
                                    obscurePassword = !obscurePassword;
                                  });
                                },
                                icon: Icon(
                                  obscurePassword
                                      ? Icons.visibility_off
                                      : Icons.visibility,
                                  color: Colors.white70,
                                ),
                              ),
                            ),
                            const SizedBox(height: 32),
                            // KYC
                            Align(
                              alignment: Alignment.centerLeft,
                              child: Text(
                                'Verifikasi Vendor (KYC)',
                                style: GoogleFonts.poppins(
                                  color: Colors.white,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            const SizedBox(height: 18),
                            Row(
                              children: [
                                Expanded(
                                  child: buildUploadCard(
                                    title: 'Foto KTP Owner',
                                    icon: Icons.credit_card,
                                    image: ktpImage,
                                    onTap: () => pickImage(false),
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: buildUploadCard(
                                    title: 'Selfie + KTP',
                                    icon: Icons.face,
                                    image: selfieKtpImage,
                                    onTap: () => pickImage(true),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 34),
                            // BUTTON
                            GestureDetector(
                              onTap: isLoading ? null : registerVendor,
                              child: Container(
                                width: double.infinity,
                                height: 64,
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(22),
                                  gradient: const LinearGradient(
                                    colors: [
                                      Color(0xFF45C15C),
                                      Color(0xFF1B8F3E),
                                    ],
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.green.withOpacity(0.4),
                                      blurRadius: 20,
                                      offset: const Offset(0, 10),
                                    ),
                                  ],
                                ),
                                child: Center(
                                  child: isLoading
                                      ? const SizedBox(
                                          height: 24,
                                          width: 24,
                                          child: CircularProgressIndicator(
                                            strokeWidth: 2,
                                            color: Colors.white,
                                          ),
                                        )
                                      : Text(
                                          'Daftar Sebagai Vendor',
                                          style: GoogleFonts.poppins(
                                            color: Colors.white,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 18,
                                          ),
                                        ),
                                ),
                              ),
                            ),
                            const SizedBox(height: 26),
                            // FOOTER
                            Text(
                              'Data vendor akan diverifikasi oleh tim AgroHub\nuntuk menjaga keamanan transaksi marketplace',
                              textAlign: TextAlign.center,
                              style: GoogleFonts.poppins(
                                color: Colors.white54,
                                fontSize: 12,
                                height: 1.7,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            // LOADING
            if (isLoading)
              Container(
                color: Colors.black.withOpacity(0.5),
                child: const Center(
                  child: CircularProgressIndicator(
                    color: Color(0xFF1B8F3E),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  // ================= INPUT =================
  Widget buildInput({
    required TextEditingController controller,
    required String hint,
    required IconData icon,
    bool obscure = false,
    Widget? suffix,
    int maxLines = 1,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Colors.white.withOpacity(0.08),
        ),
      ),
      child: TextFormField(
        controller: controller,
        obscureText: obscure,
        maxLines: maxLines,
        style: GoogleFonts.poppins(color: Colors.white),
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Field wajib diisi';
          }
          return null;
        },
        decoration: InputDecoration(
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(vertical: 22),
          prefixIcon: Icon(icon, color: Colors.white70),
          suffixIcon: suffix,
          hintText: hint,
          hintStyle: GoogleFonts.poppins(color: Colors.white54),
        ),
      ),
    );
  }

  // ================= UPLOAD CARD =================
  Widget buildUploadCard({
    required String title,
    required IconData icon,
    required File? image,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 170,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: Colors.white.withOpacity(0.08)),
          color: Colors.white.withOpacity(0.04),
        ),
        child: image != null
            ? ClipRRect(
                borderRadius: BorderRadius.circular(22),
                child: Image.file(image, fit: BoxFit.cover),
              )
            : Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1B8F3E).withOpacity(0.15),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(icon, color: const Color(0xFF8BE78B), size: 34),
                  ),
                  const SizedBox(height: 14),
                  Text(
                    title,
                    style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Tap untuk upload',
                    style: GoogleFonts.poppins(color: Colors.white54, fontSize: 11),
                  ),
                ],
              ),
      ),
    );
  }
}
