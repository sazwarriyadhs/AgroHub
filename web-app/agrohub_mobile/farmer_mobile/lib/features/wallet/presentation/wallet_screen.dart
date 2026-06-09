// lib/features/wallet/presentation/wallet_screen.dart
import 'package:flutter/material.dart';
import '../../dashboard/presentation/farmer_bottom_navigation.dart';

class WalletScreen extends StatefulWidget {
  const WalletScreen({super.key});

  @override
  State<WalletScreen> createState() => _WalletScreenState();
}

class _WalletScreenState extends State<WalletScreen> {
  int _currentIndex = 2;

  void _onTabChanged(int index) {
    setState(() => _currentIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dompet Saya'),
        backgroundColor: const Color(0xFF1B8F3E),
        foregroundColor: Colors.white,
      ),

      // =========================
      // BODY
      // =========================
      body: Column(
        children: [
          // WALLET CARD
          Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF1B8F3E), Color(0xFF0A4A2A)],
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              children: [
                const Text(
                  'Total Saldo',
                  style: TextStyle(color: Colors.white70, fontSize: 14),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Rp 2.500.000',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),

                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () {},
                        icon: const Icon(Icons.arrow_upward),
                        label: const Text('Top Up'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: const Color(0xFF1B8F3E),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () {},
                        icon: const Icon(Icons.arrow_downward),
                        label: const Text('Withdraw'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: const Color(0xFF1B8F3E),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          const Padding(
            padding: EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Riwayat Transaksi',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                Text(
                  'Lihat Semua',
                  style: TextStyle(color: Color(0xFF1B8F3E)),
                ),
              ],
            ),
          ),

          Expanded(
            child: ListView(
              children: const [
                _TransactionItem(
                  icon: Icons.sell,
                  title: 'Penjualan Padi',
                  amount: '+ Rp 520.000',
                  date: 'Hari ini',
                  isIncome: true,
                ),
                _TransactionItem(
                  icon: Icons.shopping_cart,
                  title: 'Beli Pupuk NPK',
                  amount: '- Rp 150.000',
                  date: 'Kemarin',
                  isIncome: false,
                ),
                _TransactionItem(
                  icon: Icons.payment,
                  title: 'Top Up Saldo',
                  amount: '+ Rp 500.000',
                  date: '3 hari lalu',
                  isIncome: true,
                ),
              ],
            ),
          ),
        ],
      ),

      // =========================
      // GLOBAL BOTTOM NAV (FIX)
      // =========================
      bottomNavigationBar: FarmerBottomNavigation(
        currentIndex: _currentIndex,
        onTap: _onTabChanged,
      ),
    );
  }
}

// =========================
// TRANSACTION ITEM
// =========================
class _TransactionItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String amount;
  final String date;
  final bool isIncome;

  const _TransactionItem({
    required this.icon,
    required this.title,
    required this.amount,
    required this.date,
    required this.isIncome,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: CircleAvatar(
        backgroundColor:
            isIncome ? Colors.green.shade100 : Colors.red.shade100,
        child: Icon(
          icon,
          color: isIncome ? Colors.green : Colors.red,
        ),
      ),
      title: Text(title),
      subtitle: Text(date),
      trailing: Text(
        amount,
        style: TextStyle(
          fontWeight: FontWeight.bold,
          color: isIncome ? Colors.green : Colors.red,
        ),
      ),
    );
  }
}