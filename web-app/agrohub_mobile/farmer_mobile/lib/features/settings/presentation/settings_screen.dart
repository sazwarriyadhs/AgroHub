// lib/features/settings/presentation/settings_screen.dart
import 'package:flutter/material.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pengaturan'),
        backgroundColor: const Color(0xFF1B8F3E),
        foregroundColor: Colors.white,
      ),
      body: ListView(
        children: [
          const SizedBox(height: 16),
          _SettingsGroup(
            title: 'Preferensi',
            children: [
              SwitchListTile(
                title: const Text('Notifikasi Push'),
                subtitle: const Text('Terima notifikasi pesanan dan promo'),
                value: true,
                onChanged: (_) {},
              ),
              SwitchListTile(
                title: const Text('Mode Gelap'),
                subtitle: const Text('Tampilan aplikasi mode gelap'),
                value: false,
                onChanged: (_) {},
              ),
            ],
          ),
          _SettingsGroup(
            title: 'Pengaturan Lainnya',
            children: [
              _SettingsItem(
                icon: Icons.language,
                title: 'Bahasa',
                subtitle: 'Indonesia',
                onTap: () {},
              ),
              _SettingsItem(
                icon: Icons.storage,
                title: 'Penggunaan Data',
                subtitle: 'Optimalkan penggunaan data',
                onTap: () {},
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _SettingsGroup extends StatelessWidget {
  final String title;
  final List<Widget> children;

  const _SettingsGroup({required this.title, required this.children});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Text(
            title,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Colors.grey,
            ),
          ),
        ),
        ...children,
        const SizedBox(height: 8),
      ],
    );
  }
}

class _SettingsItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _SettingsItem({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: const Color(0xFF1B8F3E)),
      title: Text(title),
      subtitle: Text(subtitle),
      trailing: const Icon(Icons.chevron_right, color: Colors.grey),
      onTap: onTap,
    );
  }
}
