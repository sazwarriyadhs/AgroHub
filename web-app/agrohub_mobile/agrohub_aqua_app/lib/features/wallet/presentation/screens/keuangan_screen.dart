// lib/features/wallet/presentation/screens/keuangan_screen.dart

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';

import '../../../../app/theme/app_theme.dart';

class KeuanganScreen extends StatefulWidget {
  const KeuanganScreen({super.key});

  @override
  State<KeuanganScreen> createState() => _KeuanganScreenState();
}

class _KeuanganScreenState extends State<KeuanganScreen> {
  int _selectedTab = 0;
  int? _selectedTopUp;

  final double _balance = 25000000;
  final double _holdBalance = 500000;
  final double _totalIncome = 125000000;
  final double _totalExpense = 100000000;

  final List<Map<String, dynamic>> _transactions = [
    {
      "id": "TRX001",
      "type": "income",
      "title": "Penjualan Ikan Lele",
      "amount": 15000000,
      "date": "20 Mei 2024",
      "status": "success",
      "icon": Icons.shopping_cart,
    },
    {
      "id": "TRX002",
      "type": "expense",
      "title": "Pembelian Pakan",
      "amount": 3500000,
      "date": "18 Mei 2024",
      "status": "success",
      "icon": Icons.restaurant,
    },
    {
      "id": "TRX003",
      "type": "income",
      "title": "Penjualan Bibit Ikan",
      "amount": 5000000,
      "date": "15 Mei 2024",
      "status": "success",
      "icon": Icons.set_meal,
    },
    {
      "id": "TRX004",
      "type": "expense",
      "title": "Peralatan Kolam",
      "amount": 1250000,
      "date": "12 Mei 2024",
      "status": "success",
      "icon": Icons.build,
    },
    {
      "id": "TRX005",
      "type": "income",
      "title": "Penjualan Gurame",
      "amount": 8500000,
      "date": "10 Mei 2024",
      "status": "pending",
      "icon": Icons.water,
    },
  ];

  final List<Map<String, dynamic>> _topUps = [
    {"amount": 50000, "bonus": 0},
    {"amount": 100000, "bonus": 2000},
    {"amount": 250000, "bonus": 7500},
    {"amount": 500000, "bonus": 20000},
    {"amount": 1000000, "bonus": 50000},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF3F6FB),

      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
        title: Text(
          "Dompet Digital",
          style: GoogleFonts.poppins(
            color: AppTheme.primaryColor,
            fontWeight: FontWeight.bold,
          ),
        ),
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: AppTheme.primaryColor),
          onPressed: () => Navigator.pop(context),
        ),
      ),

      body: Column(
        children: [
          _balanceCard(),
          const SizedBox(height: 16),
          _tabBar(),

          Expanded(
            child: IndexedStack(
              index: _selectedTab,
              children: [
                _overview(),
                _history(),
                _topUp(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _balanceCard() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(28),
        gradient: LinearGradient(
          colors: [
            AppTheme.primaryColor,
            AppTheme.primaryColor.withValues(alpha: .7),
          ],
        ),
      ),

      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [

          Text(
            "Total Saldo",
            style: GoogleFonts.poppins(
              color: Colors.white70,
            ),
          ),

          const SizedBox(height: 8),

          Text(
            _money(_balance),
            style: GoogleFonts.poppins(
              color: Colors.white,
              fontSize: 30,
              fontWeight: FontWeight.bold,
            ),
          ),

          const SizedBox(height: 20),

          Row(
            children: [
              Expanded(
                child: _balanceInfo(
                  "Dapat Ditarik",
                  _money(_balance - _holdBalance),
                ),
              ),

              Expanded(
                child: _balanceInfo(
                  "Diproses",
                  _money(_holdBalance),
                ),
              ),
            ],
          ),

          const SizedBox(height: 18),

          Row(
            children: [

              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    setState(() => _selectedTab = 2);
                  },
                  icon: const Icon(Icons.add),
                  label: const Text("Top Up"),
                ),
              ),

              const SizedBox(width: 12),

              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.download),
                  label: const Text("Withdraw"),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _balanceInfo(String title, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [

        Text(
          title,
          style: GoogleFonts.poppins(
            color: Colors.white70,
            fontSize: 11,
          ),
        ),

        Text(
          value,
          style: GoogleFonts.poppins(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _tabBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),

      child: Row(
        children: [
          _tab("Overview", 0),
          _tab("Riwayat", 1),
          _tab("Top Up", 2),
        ],
      ),
    );
  }

  Widget _tab(String title, int index) {
    final selected = _selectedTab == index;

    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() => _selectedTab = index);
        },

        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 4),
          padding: const EdgeInsets.symmetric(vertical: 14),

          decoration: BoxDecoration(
            color: selected
                ? AppTheme.primaryColor
                : Colors.white,

            borderRadius: BorderRadius.circular(20),
          ),

          child: Text(
            title,
            textAlign: TextAlign.center,

            style: GoogleFonts.poppins(
              color: selected
                  ? Colors.white
                  : Colors.grey,
            ),
          ),
        ),
      ),
    );
  }

  Widget _overview() {
    return ListView(
      padding: const EdgeInsets.all(16),

      children: [

        Row(
          children: [

            Expanded(
              child: _statCard(
                "Pemasukan",
                _money(_totalIncome),
                Icons.trending_up,
                Colors.green,
              ),
            ),

            const SizedBox(width: 16),

            Expanded(
              child: _statCard(
                "Pengeluaran",
                _money(_totalExpense),
                Icons.trending_down,
                Colors.red,
              ),
            ),
          ],
        ),

        const SizedBox(height: 20),

        ..._transactions.take(3).map(_transactionItem),
      ],
    );
  }

  Widget _history() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _transactions.length,
      itemBuilder: (_, i) {
        return _transactionItem(_transactions[i]);
      },
    );
  }

  Widget _topUp() {
    return GridView.builder(
      padding: const EdgeInsets.all(16),

      itemCount: _topUps.length,

      gridDelegate:
          const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 2,
        crossAxisSpacing: 14,
        mainAxisSpacing: 14,
      ),

      itemBuilder: (_, i) {

        final item = _topUps[i];

        final selected = _selectedTopUp == i;

        return GestureDetector(
          onTap: () {
            setState(() {
              _selectedTopUp = i;
            });
          },

          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),

              border: Border.all(
                color: selected
                    ? AppTheme.primaryColor
                    : Colors.grey.shade300,
              ),
            ),

            child: Center(
              child: Column(
                mainAxisAlignment:
                    MainAxisAlignment.center,

                children: [

                  Text(
                    _money(
                      (item["amount"] as int).toDouble(),
                    ),
                  ),

                  Text(
                    "Bonus ${item["bonus"]}",
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _statCard(
    String title,
    String value,
    IconData icon,
    Color color,
  ) {
    return Container(
      padding: const EdgeInsets.all(18),

      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
      ),

      child: Column(
        children: [

          Icon(icon, color: color),

          const SizedBox(height: 10),

          Text(
            value,
            style: GoogleFonts.poppins(
              fontWeight: FontWeight.bold,
            ),
          ),

          Text(title),
        ],
      ),
    );
  }

  Widget _transactionItem(
    Map<String, dynamic> tx,
  ) {
    final income = tx["type"] == "income";

    final amount =
        (tx["amount"] as num).toDouble();

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),

      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
      ),

      child: Row(
        children: [

          Icon(
            tx["icon"] as IconData,
            color: AppTheme.primaryColor,
          ),

          const SizedBox(width: 16),

          Expanded(
            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment.start,

              children: [

                Text(tx["title"]),

                Text(
                  tx["date"],
                  style: GoogleFonts.poppins(
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ),

          Text(
            "${income ? '+' : '-'} ${_money(amount)}",

            style: TextStyle(
              color:
                  income ? Colors.green : Colors.red,
            ),
          ),
        ],
      ),
    );
  }

  String _money(double value) {
    return NumberFormat.currency(
      locale: "id_ID",
      symbol: "Rp ",
      decimalDigits: 0,
    ).format(value);
  }
}