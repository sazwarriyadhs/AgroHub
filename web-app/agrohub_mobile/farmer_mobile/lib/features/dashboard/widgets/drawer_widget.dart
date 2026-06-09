// lib/features/dashboard/widgets/drawer_widget.dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../features/auth/bloc/auth_bloc.dart';
import '../../../core/routes/app_routes.dart';

class DashboardDrawer extends StatelessWidget {
  const DashboardDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Column(
        children: [
          // Header Drawer
          BlocBuilder<AuthBloc, AuthState>(
            builder: (context, state) {
              String name = 'Petani';
              String email = '';
              
              if (state is Authenticated && state.userData != null) {
                name = state.userData!['name'] ?? 'Petani';
                email = state.userData!['email'] ?? '';
              }
              
              return Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xFF1B8F3E), Color(0xFF0A4A2A)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: Column(
                  children: [
                    const CircleAvatar(
                      radius: 40,
                      backgroundColor: Colors.white,
                      child: Icon(Icons.person, color: Color(0xFF1B8F3E), size: 50),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      name,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      email,
                      style: const TextStyle(color: Colors.white70, fontSize: 12),
                    ),
                  ],
                ),
              );
            },
          ),
          
          // Menu Items
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                _DrawerItem(
                  icon: Icons.dashboard,
                  title: 'Dashboard',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.pushReplacementNamed(context, AppRoutes.dashboard);
                  },
                ),
                const Divider(),
                _DrawerItem(
                  icon: Icons.agriculture,
                  title: 'Status Tanaman',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.pushNamed(context, AppRoutes.myCrops);
                  },
                ),
                _DrawerItem(
                  icon: Icons.sell,
                  title: 'Jual Hasil Panen',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.pushNamed(context, AppRoutes.sellProduct);
                  },
                ),
                _DrawerItem(
                  icon: Icons.shopping_cart,
                  title: 'Beli Produk',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.pushNamed(context, AppRoutes.buyProduct);
                  },
                ),
                _DrawerItem(
                  icon: Icons.task,
                  title: 'Tugas Saya',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.pushNamed(context, AppRoutes.tasks);
                  },
                ),
                _DrawerItem(
                  icon: Icons.trending_up,
                  title: 'Harga Pasar',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.pushNamed(context, AppRoutes.marketPrices);
                  },
                ),
                _DrawerItem(
                  icon: Icons.history,
                  title: 'Riwayat Aktivitas',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.pushNamed(context, AppRoutes.activities);
                  },
                ),
                _DrawerItem(
                  icon: Icons.wallet,
                  title: 'Dompet Saya',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.pushNamed(context, AppRoutes.wallet);
                  },
                ),
                _DrawerItem(
                  icon: Icons.people,
                  title: 'Komunitas',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.pushNamed(context, AppRoutes.community);
                  },
                ),
                _DrawerItem(
                  icon: Icons.chat,
                  title: 'AI Assistant',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.pushNamed(context, AppRoutes.aiAssistant);
                  },
                ),
                const Divider(),
                _DrawerItem(
                  icon: Icons.person,
                  title: 'Profil Saya',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.pushNamed(context, AppRoutes.profile);
                  },
                ),
                _DrawerItem(
                  icon: Icons.settings,
                  title: 'Pengaturan',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.pushNamed(context, AppRoutes.settings);
                  },
                ),
                _DrawerItem(
                  icon: Icons.help,
                  title: 'Bantuan',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.pushNamed(context, AppRoutes.help);
                  },
                ),
                _DrawerItem(
                  icon: Icons.info,
                  title: 'Tentang Aplikasi',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.pushNamed(context, AppRoutes.about);
                  },
                ),
                const Divider(),
                _DrawerItem(
                  icon: Icons.logout,
                  title: 'Keluar',
                  onTap: () {
                    _showLogoutDialog(context);
                  },
                  color: Colors.red,
                ),
              ],
            ),
          ),
          
          // Version
          const Padding(
            padding: EdgeInsets.all(16),
            child: Text(
              'AgroHub Farmer v1.0.0',
              style: TextStyle(color: Colors.grey, fontSize: 12),
            ),
          ),
        ],
      ),
    );
  }

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Konfirmasi Keluar'),
          content: const Text('Apakah Anda yakin ingin keluar?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Batal'),
            ),
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                context.read<AuthBloc>().add(AuthLogoutRequested());
                Navigator.pushReplacementNamed(context, AppRoutes.login);
              },
              style: TextButton.styleFrom(foregroundColor: Colors.red),
              child: const Text('Keluar'),
            ),
          ],
        );
      },
    );
  }
}

class _DrawerItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;
  final Color? color;

  const _DrawerItem({
    required this.icon,
    required this.title,
    required this.onTap,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: color ?? const Color(0xFF1B8F3E), size: 24),
      title: Text(
        title,
        style: TextStyle(color: color, fontSize: 14),
      ),
      trailing: const Icon(Icons.chevron_right, size: 20, color: Colors.grey),
      onTap: onTap,
    );
  }
}