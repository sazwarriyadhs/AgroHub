// lib/features/auth/presentation/screens/forgot_password_screen.dart

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() =>
      _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState
    extends State<ForgotPasswordScreen> {
  final TextEditingController _emailController =
      TextEditingController();

  bool isLoading = false;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  Future<void> sendResetLink() async {
    if (_emailController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Email atau nomor WhatsApp wajib diisi',
          ),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() => isLoading = true);

    // ================= SIMULASI API =================

    await Future.delayed(const Duration(seconds: 2));

    setState(() => isLoading = false);

    if (mounted) {
      showDialog(
        context: context,
        builder: (context) {
          return Dialog(
            backgroundColor: const Color(0xFF052E24),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(28),
            ),
            child: Padding(
              padding: const EdgeInsets.all(28),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    height: 80,
                    width: 80,
                    decoration: BoxDecoration(
                      color:
                          const Color(0xFF45C15C)
                              .withOpacity(0.15),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.mark_email_read_rounded,
                      color: Color(0xFF45C15C),
                      size: 42,
                    ),
                  ),

                  const SizedBox(height: 20),

                  Text(
                    'Link Reset Terkirim',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.poppins(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 12),

                  Text(
                    'Silakan cek email atau WhatsApp Anda untuk melakukan reset password akun vendor AgroHub.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.poppins(
                      color: Colors.white70,
                      fontSize: 13,
                      height: 1.7,
                    ),
                  ),

                  const SizedBox(height: 28),

                  GestureDetector(
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.pop(context);
                    },
                    child: Container(
                      width: double.infinity,
                      height: 56,
                      decoration: BoxDecoration(
                        borderRadius:
                            BorderRadius.circular(18),
                        gradient:
                            const LinearGradient(
                          colors: [
                            Color(0xFF45C15C),
                            Color(0xFF1B8F3E),
                          ],
                        ),
                      ),
                      child: Center(
                        child: Text(
                          'Kembali ke Login',
                          style:
                              GoogleFonts.poppins(
                            color: Colors.white,
                            fontWeight:
                                FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
                      height: 330,
                      width: double.infinity,
                      decoration: const BoxDecoration(
                        borderRadius: BorderRadius.only(
                          bottomLeft:
                              Radius.circular(40),
                          bottomRight:
                              Radius.circular(40),
                        ),
                        image: DecorationImage(
                          image: AssetImage(
                            'assets/images/login_bg.png',
                          ),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),

                    Container(
                      height: 330,
                      decoration: BoxDecoration(
                        borderRadius:
                            const BorderRadius.only(
                          bottomLeft:
                              Radius.circular(40),
                          bottomRight:
                              Radius.circular(40),
                        ),
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.black
                                .withOpacity(0.2),
                            Colors.black
                                .withOpacity(0.75),
                          ],
                        ),
                      ),
                    ),

                    SafeArea(
                      child: Padding(
                        padding:
                            const EdgeInsets.all(20),
                        child: Row(
                          children: [
                            GestureDetector(
                              onTap: () {
                                Navigator.pop(
                                    context);
                              },
                              child: Container(
                                padding:
                                    const EdgeInsets
                                        .all(12),
                                decoration:
                                    BoxDecoration(
                                  color: Colors.white
                                      .withOpacity(
                                          0.12),
                                  borderRadius:
                                      BorderRadius
                                          .circular(
                                              16),
                                ),
                                child: const Icon(
                                  Icons
                                      .arrow_back_ios_new,
                                  color:
                                      Colors.white,
                                  size: 18,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    Positioned(
                      bottom: 35,
                      left: 24,
                      right: 24,
                      child: Column(
                        children: [
                          Container(
                            height: 95,
                            width: 95,
                            decoration:
                                BoxDecoration(
                              borderRadius:
                                  BorderRadius
                                      .circular(
                                          28),
                              color:
                                  Colors.white,
                            ),
                            child: const Icon(
                              Icons.lock_reset,
                              color: Color(
                                  0xFF1B8F3E),
                              size: 50,
                            ),
                          ),

                          const SizedBox(
                              height: 20),

                          Text(
                            'Lupa Password?',
                            style:
                                GoogleFonts
                                    .poppins(
                              color:
                                  Colors.white,
                              fontSize: 30,
                              fontWeight:
                                  FontWeight
                                      .bold,
                            ),
                          ),

                          const SizedBox(
                              height: 10),

                          Text(
                            'Masukkan email atau WhatsApp\nuntuk reset password vendor',
                            textAlign:
                                TextAlign.center,
                            style:
                                GoogleFonts
                                    .poppins(
                              color:
                                  Colors.white70,
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
                    margin:
                        const EdgeInsets.symmetric(
                            horizontal: 20),
                    padding:
                        const EdgeInsets.all(28),
                    decoration: BoxDecoration(
                      borderRadius:
                          BorderRadius.circular(
                              34),
                      gradient:
                          const LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          Color(0xFF052E24),
                          Color(0xFF021A14),
                        ],
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.green
                              .withOpacity(0.25),
                          blurRadius: 30,
                          offset:
                              const Offset(
                                  0, 15),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        Align(
                          alignment:
                              Alignment.centerLeft,
                          child: Text(
                            'Recovery Account',
                            style:
                                GoogleFonts
                                    .poppins(
                              color:
                                  Colors.white,
                              fontWeight:
                                  FontWeight
                                      .bold,
                              fontSize: 18,
                            ),
                          ),
                        ),

                        const SizedBox(
                            height: 22),

                        buildInput(
                          controller:
                              _emailController,
                          hint:
                              'Email atau nomor WhatsApp',
                          icon: Icons
                              .email_outlined,
                        ),

                        const SizedBox(
                            height: 34),

                        GestureDetector(
                          onTap: isLoading
                              ? null
                              : sendResetLink,
                          child: Container(
                            width:
                                double.infinity,
                            height: 62,
                            decoration:
                                BoxDecoration(
                              borderRadius:
                                  BorderRadius
                                      .circular(
                                          22),
                              gradient:
                                  const LinearGradient(
                                colors: [
                                  Color(
                                      0xFF45C15C),
                                  Color(
                                      0xFF1B8F3E),
                                ],
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors
                                      .green
                                      .withOpacity(
                                          0.4),
                                  blurRadius: 20,
                                  offset:
                                      const Offset(
                                          0,
                                          10),
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
                                      'Kirim Link Reset',
                                      style:
                                          GoogleFonts
                                              .poppins(
                                        color: Colors
                                            .white,
                                        fontWeight:
                                            FontWeight
                                                .bold,
                                        fontSize:
                                            18,
                                      ),
                                    ),
                            ),
                          ),
                        ),

                        const SizedBox(
                            height: 28),

                        Text(
                          'Pastikan email atau nomor WhatsApp\nmasih aktif dan dapat menerima notifikasi.',
                          textAlign:
                              TextAlign.center,
                          style:
                              GoogleFonts.poppins(
                            color:
                                Colors.white54,
                            fontSize: 12,
                            height: 1.7,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
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
    required TextEditingController controller,
    required String hint,
    required IconData icon,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius:
            BorderRadius.circular(20),
        border: Border.all(
          color: Colors.white
              .withOpacity(0.08),
        ),
      ),
      child: TextField(
        controller: controller,
        style: GoogleFonts.poppins(
          color: Colors.white,
        ),
        decoration: InputDecoration(
          border: InputBorder.none,
          contentPadding:
              const EdgeInsets.symmetric(
            vertical: 22,
          ),
          prefixIcon: Icon(
            icon,
            color: Colors.white70,
          ),
          hintText: hint,
          hintStyle:
              GoogleFonts.poppins(
            color: Colors.white54,
          ),
        ),
      ),
    );
  }
}
