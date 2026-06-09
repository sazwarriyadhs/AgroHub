import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter/gestures.dart';
import '../bloc/auth_bloc.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/routes/app_routes.dart';
import '../../../../core/services/api_client.dart';  // ✅ Tambahkan import

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool obscureText = true;
  bool isLoading = false;
  
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _emailController.text = AppConstants.defaultEmail;
    _passwordController.text = AppConstants.defaultPassword;
    
    // Debug
    debugPrint('🌐 BaseUrl: ${AppConstants.baseUrl}');
    debugPrint('📍 Login Endpoint: ${AppConstants.loginEndpoint}');
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleLogin() {
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();

    debugPrint('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    debugPrint('🔐 LOGIN ATTEMPT');
    debugPrint('📧 Email: $email');
    debugPrint('🌐 URL: ${AppConstants.baseUrl}${AppConstants.loginEndpoint}');
    debugPrint('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (email.isEmpty) {
      _showSnackbar('Email atau nomor WhatsApp tidak boleh kosong');
      return;
    }

    if (password.isEmpty) {
      _showSnackbar('Password tidak boleh kosong');
      return;
    }

    context.read<AuthBloc>().add(LoginRequested(email, password));
  }

  void _showSnackbar(String message, {bool isError = true}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? Colors.red : Colors.green,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthBloc, AuthState>(
      listener: (context, state) async {
        debugPrint('📢 AuthState: $state');
        
        if (state is AuthLoading) {
          setState(() => isLoading = true);
        } else if (state is AuthAuthenticated) {
          setState(() => isLoading = false);
          
          debugPrint('✅ Login Success: ${state.user.email}');
          debugPrint('🔑 Token: ${state.user.token.substring(0, state.user.token.length > 20 ? 20 : state.user.token.length)}...');
          
          const storage = FlutterSecureStorage();
          
          if (state.user.token.isNotEmpty) {
            await storage.write(
              key: AppConstants.tokenKey,
              value: state.user.token,
            );
            
            // ✅ Set token ke ApiClient
            ApiClient.instance.setAuthToken(state.user.token);
            
            debugPrint('✅ Token saved to storage and ApiClient');
          } else {
            debugPrint('❌ Token is empty!');
            _showSnackbar('Token kosong, silakan coba lagi');
            return;
          }
          
          if (mounted) {
            Navigator.pushReplacementNamed(context, AppRoutes.dashboard);
          }
        } else if (state is AuthError) {
          setState(() => isLoading = false);
          debugPrint('❌ AuthError: ${state.message}');
          _showSnackbar(state.message);
        }
      },
      child: Scaffold(
        backgroundColor: const Color(0xFF021A14),
        body: Stack(
          children: [
            SingleChildScrollView(
              child: Column(
                children: [
                  Stack(
                    children: [
                      SizedBox(
                        height: 420,
                        width: double.infinity,
                        child: ClipRRect(
                          borderRadius: const BorderRadius.only(
                            bottomLeft: Radius.circular(40),
                            bottomRight: Radius.circular(40),
                          ),
                          child: Image.asset(
                            'assets/images/login_bg.png',
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                      Container(
                        height: 420,
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
                              Colors.black.withOpacity(0.55),
                            ],
                          ),
                        ),
                      ),
                      Positioned(
                        top: 300,
                        left: 0,
                        right: 0,
                        child: Center(
                          child: SizedBox(
                            height: 80,
                            width: 180,
                            child: Image.asset(
                              'assets/logo/logo-agrohub.png',
                              fit: BoxFit.contain,
                              errorBuilder: (context, error, stackTrace) {
                                return const Icon(
                                  Icons.eco,
                                  color: Colors.white,
                                  size: 50,
                                );
                              },
                            ),
                          ),
                        ),
                      ),
                      Positioned(
                        top: 140,
                        left: 24,
                        right: 24,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            _floatingBadge(
                              icon: Icons.trending_up,
                              title: 'AI Insight',
                              subtitle: 'Penjualan lebih cerdas',
                            ),
                            _floatingBadge(
                              icon: Icons.eco,
                              title: 'Sehat Alami',
                              subtitle: 'Produk berkualitas',
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  Transform.translate(
                    offset: const Offset(0, -40),
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
                      child: Column(
                        children: [
                          const SizedBox(height: 20),
                          Text(
                            'Agrohub Mobile App',
                            style: GoogleFonts.poppins(
                              color: Colors.white,
                              fontSize: 28,
                              fontWeight: FontWeight.normal,
                            ),
                          ),
                          const SizedBox(height: 10),
                          Text(
                            'Platform pertanian modern untuk\npetani masa depan',
                            textAlign: TextAlign.center,
                            style: GoogleFonts.poppins(
                              color: Colors.white70,
                              fontSize: 15,
                              height: 1.6,
                            ),
                          ),
                          const SizedBox(height: 36),
                          _inputField(
                            hint: 'Email atau nomor WhatsApp',
                            icon: Icons.email_outlined,
                            controller: _emailController,
                          ),
                          const SizedBox(height: 18),
                          _inputField(
                            hint: 'Password',
                            icon: Icons.lock_outline,
                            obscure: obscureText,
                            controller: _passwordController,
                            suffix: IconButton(
                              onPressed: () {
                                setState(() {
                                  obscureText = !obscureText;
                                });
                              },
                              icon: Icon(
                                obscureText
                                    ? Icons.visibility_off_outlined
                                    : Icons.visibility_outlined,
                                color: Colors.white70,
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),
                          Align(
                            alignment: Alignment.centerRight,
                            child: GestureDetector(
                              onTap: () {
                                Navigator.pushNamed(context, AppRoutes.forgotPassword);
                              },
                              child: Text(
                                'Lupa password?',
                                style: GoogleFonts.poppins(
                                  color: const Color(0xFF8BE78B),
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 28),
                          GestureDetector(
                            onTap: isLoading ? null : _handleLogin,
                            child: Container(
                              width: double.infinity,
                              height: 62,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(20),
                                gradient: isLoading
                                    ? const LinearGradient(
                                        colors: [
                                          Color(0xFF1B8F3E),
                                          Color(0xFF0F6D2E),
                                        ],
                                      )
                                    : const LinearGradient(
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
                                  )
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
                                    : const Text(
                                        'Masuk',
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 20,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 30),
                          Row(
                            children: [
                              Expanded(
                                child: Divider(
                                  color: Colors.white.withOpacity(0.15),
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 12),
                                child: Text(
                                  'atau masuk dengan',
                                  style: GoogleFonts.poppins(
                                    color: Colors.white60,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                              Expanded(
                                child: Divider(
                                  color: Colors.white.withOpacity(0.15),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 24),
                          Row(
                            children: [
                              Expanded(
                                child: _socialButton(
                                  title: 'Google',
                                  icon: Icons.g_mobiledata,
                                ),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: _socialButton(
                                  title: 'WhatsApp',
                                  icon: Icons.wechat,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 30),
                          RichText(
                            text: TextSpan(
                              children: [
                                TextSpan(
                                  text: 'Belum punya akun? ',
                                  style: GoogleFonts.poppins(
                                    color: Colors.white70,
                                    fontSize: 14,
                                  ),
                                ),
                                TextSpan(
                                  text: 'Daftar sekarang',
                                  style: GoogleFonts.poppins(
                                    color: const Color(0xFF8BE78B),
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                  ),
                                  recognizer: TapGestureRecognizer()
                                    ..onTap = () {
                                      Navigator.pushNamed(context, AppRoutes.register);
                                    },
                                ),
                              ],
                            ),
                          )
                        ],
                      ),
                    ),
                  )
                ],
              ),
            ),
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

  Widget _inputField({
    required String hint,
    required IconData icon,
    bool obscure = false,
    Widget? suffix,
    TextEditingController? controller,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Colors.white.withOpacity(0.08),
        ),
      ),
      child: TextField(
        controller: controller,
        obscureText: obscure,
        style: GoogleFonts.poppins(
          color: Colors.white,
        ),
        decoration: InputDecoration(
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(vertical: 22),
          prefixIcon: Icon(
            icon,
            color: Colors.white70,
          ),
          suffixIcon: suffix,
          hintText: hint,
          hintStyle: GoogleFonts.poppins(
            color: Colors.white54,
          ),
        ),
      ),
    );
  }

  Widget _socialButton({
    required String title,
    required IconData icon,
  }) {
    return Container(
      height: 58,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: Colors.white.withOpacity(0.08),
        ),
        color: Colors.white.withOpacity(0.03),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            color: Colors.white,
          ),
          const SizedBox(width: 10),
          Text(
            title,
            style: GoogleFonts.poppins(
              color: Colors.white,
              fontWeight: FontWeight.w600,
            ),
          )
        ],
      ),
    );
  }

  Widget _floatingBadge({
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 14,
        vertical: 12,
      ),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.88),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: const BoxDecoration(
              color: Color(0xFFD8F3DC),
              shape: BoxShape.circle,
            ),
            child: Icon(
              icon,
              color: const Color(0xFF1B8F3E),
              size: 20,
            ),
          ),
          const SizedBox(width: 10),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: GoogleFonts.poppins(
                  color: const Color(0xFF1B4332),
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
              Text(
                subtitle,
                style: GoogleFonts.poppins(
                  color: Colors.black54,
                  fontSize: 10,
                ),
              ),
            ],
          )
        ],
      ),
    );
  }
}