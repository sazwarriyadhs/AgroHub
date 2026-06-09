// lib/features/auth/presentation/screens/register_screen.dart

import 'dart:convert';

import 'package:flutter/material.dart';
import '../../screens/dashboard/herd_dashboard.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;

import '../../../../core/config/api_config.dart';
import '../../../../core/theme/herd_theme.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();

  // ================= CONTROLLER =================

  final TextEditingController _fullNameController =
      TextEditingController();

  final TextEditingController _emailController =
      TextEditingController();

  final TextEditingController _phoneController =
      TextEditingController();

  final TextEditingController _passwordController =
      TextEditingController();

  final TextEditingController _confirmPasswordController =
      TextEditingController();

  bool obscurePassword = true;
  bool obscureConfirmPassword = true;
  bool isLoading = false;

  @override
  void dispose() {
    _fullNameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  // ================= SNACKBAR =================

  void showMessage(
    String text, {
    bool success = false,
  }) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(text),
        backgroundColor:
            success ? Colors.green : Colors.red,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
        ),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  // ================= REGISTER =================

  Future<void> handleRegister() async {
    FocusScope.of(context).unfocus();

    if (!_formKey.currentState!.validate()) {
      return;
    }

    if (_passwordController.text !=
        _confirmPasswordController.text) {
      showMessage("Password tidak sama");
      return;
    }

    setState(() {
      isLoading = true;
    });

    try {
      final response = await http.post(
        Uri.parse(
          '${ApiConfig.baseUrl}${ApiConfig.register}',
        ),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'name': _fullNameController.text.trim(),
          'email': _emailController.text.trim(),
          'phone': _phoneController.text.trim(),
          'password': _passwordController.text,

          // ================= HERD =================
          'user_type': 'peternak',

          // ================= STARTER MODE =================
          'is_starter': true,

          // ================= KYC =================
          'kyc_status': 'pending',
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 ||
          response.statusCode == 201) {
        if (data['success'] == true) {
          showMessage(
            "✨ Akun berhasil dibuat",
            success: true,
          );

          await Future.delayed(
            const Duration(milliseconds: 900),
          );

          if (!mounted) return;

          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (_) => const HerdDashboard(),
            ),
          );
        } else {
          showMessage(
            data['message'] ??
                'Registrasi gagal',
          );
        }
      } else {
        showMessage(
          data['message'] ??
              'Gagal terhubung ke server',
        );
      }
    } catch (e) {
      debugPrint("REGISTER ERROR: $e");

      showMessage(
        "Server tidak dapat dihubungi",
      );
    } finally {
      if (mounted) {
        setState(() {
          isLoading = false;
        });
      }
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
              physics:
                  const BouncingScrollPhysics(),
              padding:
                  const EdgeInsets.symmetric(
                horizontal: 18,
                vertical: 12,
              ),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    // ================= BACK =================

                    Row(
                      children: [
                        IconButton(
                          onPressed: () {
                            Navigator.pop(
                              context,
                            );
                          },
                          icon: const Icon(
                            Icons
                                .arrow_back_ios_new_rounded,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 8),

                    // ================= LOGO =================

                    Hero(
                      tag: 'logo',
                      child: Image.asset(
                        'assets/logo/herd.png',
                        width: 170,
                        height: 70,
                        fit: BoxFit.contain,
                      ),
                    ),

                    const SizedBox(height: 20),

                    // ================= TITLE =================

                    Text(
                      "Mulai Peternakan Modern",
                      style:
                          GoogleFonts.poppins(
                        fontSize:
                            isSmall ? 24 : 30,
                        fontWeight:
                            FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),

                    const SizedBox(height: 8),

                    Text(
                      "Buat akun dulu, langsung bisa akses AgroHub Herd",
                      textAlign:
                          TextAlign.center,
                      style:
                          GoogleFonts.poppins(
                        fontSize: 13,
                        color:
                            Colors.white70,
                        height: 1.6,
                      ),
                    ),

                    const SizedBox(height: 28),

                    // ================= CARD =================

                    Container(
                      width: double.infinity,
                      padding:
                          const EdgeInsets.all(
                        22,
                      ),
                      decoration:
                          BoxDecoration(
                        borderRadius:
                            BorderRadius
                                .circular(32),
                        gradient:
                            const LinearGradient(
                          begin:
                              Alignment.topLeft,
                          end: Alignment
                              .bottomRight,
                          colors: [
                            Color(
                              0xFF063126,
                            ),
                            Color(
                              0xFF021A14,
                            ),
                          ],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.green
                                .withOpacity(
                              0.18,
                            ),
                            blurRadius: 30,
                            offset:
                                const Offset(
                              0,
                              15,
                            ),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          // ================= NAME =================

                          buildInput(
                            hint:
                                "Nama Lengkap",
                            icon: Icons
                                .person_outline_rounded,
                            controller:
                                _fullNameController,
                          ),

                          const SizedBox(
                            height: 18,
                          ),

                          // ================= EMAIL =================

                          buildInput(
                            hint:
                                "Email Aktif",
                            icon: Icons
                                .email_outlined,
                            controller:
                                _emailController,
                            keyboardType:
                                TextInputType
                                    .emailAddress,
                          ),

                          const SizedBox(
                            height: 18,
                          ),

                          // ================= PHONE =================

                          buildInput(
                            hint:
                                "Nomor WhatsApp",
                            icon: Icons
                                .phone_outlined,
                            controller:
                                _phoneController,
                            keyboardType:
                                TextInputType
                                    .phone,
                          ),

                          const SizedBox(
                            height: 18,
                          ),

                          // ================= PASSWORD =================

                          buildInput(
                            hint: "Password",
                            icon: Icons
                                .lock_outline_rounded,
                            controller:
                                _passwordController,
                            obscure:
                                obscurePassword,
                            suffix:
                                IconButton(
                              onPressed: () {
                                setState(() {
                                  obscurePassword =
                                      !obscurePassword;
                                });
                              },
                              icon: Icon(
                                obscurePassword
                                    ? Icons
                                        .visibility_off_outlined
                                    : Icons
                                        .visibility_outlined,
                                color:
                                    Colors.white70,
                              ),
                            ),
                          ),

                          const SizedBox(
                            height: 18,
                          ),

                          // ================= CONFIRM PASSWORD =================

                          buildInput(
                            hint:
                                "Konfirmasi Password",
                            icon: Icons
                                .lock_outline_rounded,
                            controller:
                                _confirmPasswordController,
                            obscure:
                                obscureConfirmPassword,
                            suffix:
                                IconButton(
                              onPressed: () {
                                setState(() {
                                  obscureConfirmPassword =
                                      !obscureConfirmPassword;
                                });
                              },
                              icon: Icon(
                                obscureConfirmPassword
                                    ? Icons
                                        .visibility_off_outlined
                                    : Icons
                                        .visibility_outlined,
                                color:
                                    Colors.white70,
                              ),
                            ),
                          ),

                          const SizedBox(
                            height: 28,
                          ),

                          // ================= STARTER INFO =================

                          Container(
                            padding:
                                const EdgeInsets
                                    .all(18),
                            decoration:
                                BoxDecoration(
                              gradient:
                                  LinearGradient(
                                begin: Alignment
                                    .topLeft,
                                end: Alignment
                                    .bottomRight,
                                colors: [
                                  Colors.green
                                      .withOpacity(
                                    0.12,
                                  ),
                                  Colors.blue
                                      .withOpacity(
                                    0.04,
                                  ),
                                ],
                              ),
                              borderRadius:
                                  BorderRadius
                                      .circular(
                                24,
                              ),
                              border:
                                  Border.all(
                                color: Colors
                                    .green
                                    .withOpacity(
                                  0.2,
                                ),
                              ),
                            ),
                            child: Column(
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      padding:
                                          const EdgeInsets
                                              .all(
                                        10,
                                      ),
                                      decoration:
                                          BoxDecoration(
                                        color: Colors
                                            .green
                                            .withOpacity(
                                          0.14,
                                        ),
                                        borderRadius:
                                            BorderRadius
                                                .circular(
                                          14,
                                        ),
                                      ),
                                      child:
                                          const Icon(
                                        Icons.bolt,
                                        color: Colors
                                            .green,
                                        size: 24,
                                      ),
                                    ),
                                    const SizedBox(
                                      width: 14,
                                    ),
                                    Expanded(
                                      child:
                                          Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment
                                                .start,
                                        children: [
                                          Text(
                                            "⚡ Starter Mode Aktif",
                                            style:
                                                GoogleFonts.poppins(
                                              fontSize:
                                                  14,
                                              fontWeight:
                                                  FontWeight.bold,
                                              color:
                                                  Colors.green,
                                            ),
                                          ),
                                          const SizedBox(
                                            height:
                                                4,
                                          ),
                                          Text(
                                            "Langsung masuk dashboard tanpa verifikasi.",
                                            style:
                                                GoogleFonts.poppins(
                                              fontSize:
                                                  11,
                                              color:
                                                  Colors.white70,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),

                                const SizedBox(
                                  height: 18,
                                ),

                                // ================= BENEFIT =================

                                buildFeature(
                                  "Lihat harga pasar ternak",
                                ),

                                const SizedBox(
                                  height: 10,
                                ),

                                buildFeature(
                                  "Browse marketplace ternak",
                                ),

                                const SizedBox(
                                  height: 10,
                                ),

                                buildFeature(
                                  "Baca edukasi & artikel",
                                ),

                                const SizedBox(
                                  height: 10,
                                ),

                                buildFeatureLocked(
                                  "Jual ternak & produk",
                                ),

                                const SizedBox(
                                  height: 10,
                                ),

                                buildFeatureLocked(
                                  "Wallet & transaksi",
                                ),
                              ],
                            ),
                          ),

                          const SizedBox(
                            height: 30,
                          ),

                          // ================= BUTTON =================

                          GestureDetector(
                            onTap: isLoading
                                ? null
                                : handleRegister,
                            child: AnimatedContainer(
                              duration:
                                  const Duration(
                                milliseconds:
                                    250,
                              ),
                              width:
                                  double.infinity,
                              height: 58,
                              decoration:
                                  BoxDecoration(
                                borderRadius:
                                    BorderRadius
                                        .circular(
                                  22,
                                ),
                                gradient:
                                    const LinearGradient(
                                  colors: [
                                    Color(
                                      0xFF49D17D,
                                    ),
                                    Color(
                                      0xFF1B8F3E,
                                    ),
                                  ],
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors
                                        .green
                                        .withOpacity(
                                      0.35,
                                    ),
                                    blurRadius:
                                        20,
                                    offset:
                                        const Offset(
                                      0,
                                      10,
                                    ),
                                  ),
                                ],
                              ),
                              child: Center(
                                child: isLoading
                                    ? const SizedBox(
                                        height:
                                            24,
                                        width:
                                            24,
                                        child:
                                            CircularProgressIndicator(
                                          strokeWidth:
                                              2,
                                          color: Colors
                                              .white,
                                        ),
                                      )
                                    : Text(
                                        "🚀 Mulai Sekarang",
                                        style:
                                            GoogleFonts.poppins(
                                          fontSize:
                                              16,
                                          fontWeight:
                                              FontWeight.bold,
                                          color:
                                              Colors.white,
                                        ),
                                      ),
                              ),
                            ),
                          ),

                          const SizedBox(
                            height: 22,
                          ),

                          // ================= LOGIN =================

                          Row(
                            mainAxisAlignment:
                                MainAxisAlignment
                                    .center,
                            children: [
                              Text(
                                "Sudah punya akun?",
                                style:
                                    GoogleFonts.poppins(
                                  color:
                                      Colors.white70,
                                ),
                              ),
                              TextButton(
                                onPressed: () {
                                  Navigator.pop(
                                    context,
                                  );
                                },
                                child: Text(
                                  "Masuk",
                                  style:
                                      GoogleFonts.poppins(
                                    color:
                                        const Color(
                                      0xFF8BE78B,
                                    ),
                                    fontWeight:
                                        FontWeight
                                            .bold,
                                  ),
                                ),
                              ),
                            ],
                          ),

                          const SizedBox(
                            height: 8,
                          ),

                          // ================= TERMS =================

                          Text(
                            "Dengan mendaftar, kamu menyetujui syarat & ketentuan AgroHub Herd",
                            textAlign:
                                TextAlign.center,
                            style:
                                GoogleFonts.poppins(
                              fontSize: 10,
                              color:
                                  Colors.white38,
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

          // ================= LOADING =================

          if (isLoading)
            Container(
              color:
                  Colors.black.withOpacity(0.5),
              child: const Center(
                child:
                    CircularProgressIndicator(
                  color:
                      Color(0xFF1B8F3E),
                ),
              ),
            ),
        ],
      ),
    );
  }

  // ================= INPUT =================

  Widget buildInput({
    required String hint,
    required IconData icon,
    required TextEditingController controller,
    TextInputType keyboardType =
        TextInputType.text,
    bool obscure = false,
    Widget? suffix,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(
          0.05,
        ),
        borderRadius:
            BorderRadius.circular(20),
        border: Border.all(
          color: Colors.white.withOpacity(
            0.08,
          ),
        ),
      ),
      child: TextFormField(
        controller: controller,
        obscureText: obscure,
        keyboardType: keyboardType,
        style: GoogleFonts.poppins(
          color: Colors.white,
        ),
        validator: (value) {
          if (value == null ||
              value.trim().isEmpty) {
            return "Field wajib diisi";
          }

          if (hint == "Email Aktif") {
            if (!value.contains('@')) {
              return "Email tidak valid";
            }
          }

          if (hint == "Nomor WhatsApp") {
            if (value.length < 10) {
              return "Nomor terlalu pendek";
            }
          }

          if (hint == "Password") {
            if (value.length < 6) {
              return "Minimal 6 karakter";
            }
          }

          return null;
        },
        decoration: InputDecoration(
          border: InputBorder.none,
          hintText: hint,
          hintStyle:
              GoogleFonts.poppins(
            color: Colors.white54,
          ),
          prefixIcon: Icon(
            icon,
            color: Colors.white70,
          ),
          suffixIcon: suffix,
          contentPadding:
              const EdgeInsets.symmetric(
            horizontal: 18,
            vertical: 20,
          ),
        ),
      ),
    );
  }

  // ================= FEATURE =================

  Widget buildFeature(String text) {
    return Row(
      children: [
        const Icon(
          Icons.check_circle,
          color: Colors.green,
          size: 18,
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Text(
            text,
            style: GoogleFonts.poppins(
              fontSize: 12,
              color: Colors.white70,
            ),
          ),
        ),
      ],
    );
  }

  Widget buildFeatureLocked(String text) {
    return Row(
      children: [
        const Icon(
          Icons.lock_rounded,
          color: Colors.orange,
          size: 18,
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Text(
            text,
            style: GoogleFonts.poppins(
              fontSize: 12,
              color: Colors.white54,
            ),
          ),
        ),
      ],
    );
  }
}

