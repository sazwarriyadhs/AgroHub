// lib/features/feeding/presentation/screens/pakan_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:agrohub_aqua_app/app/theme/app_theme.dart';
import '../bloc/feeding_bloc.dart';
import '../bloc/feeding_event.dart';
import '../bloc/feeding_state.dart';
import '../../domain/entities/feed_stock_entity.dart';
import '../../domain/entities/feeding_schedule_entity.dart';

class PakanScreen extends StatelessWidget {
  const PakanScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => FeedingBloc()..add(const LoadAllFeedingData()),
      child: const _PakanScreenView(),
    );
  }
}

class _PakanScreenView extends StatefulWidget {
  const _PakanScreenView();

  @override
  State<_PakanScreenView> createState() => _PakanScreenViewState();
}

class _PakanScreenViewState extends State<_PakanScreenView> {
  int _selectedTab = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF3F6FB),
      appBar: AppBar(
        title: Text(
          "Manajemen Pakan",
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.bold,
            color: AppTheme.primaryColor,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _showAddFeedDialog(context),
          ),
        ],
      ),
      body: BlocConsumer<FeedingBloc, FeedingState>(
        listener: (context, state) {
          if (state.error != null) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.error!),
                backgroundColor: Colors.red,
                behavior: SnackBarBehavior.floating,
              ),
            );
          }
        },
        builder: (context, state) {
          if (state.isLoading && state.feedStock.isEmpty) {
            return const Center(child: CircularProgressIndicator());
          }

          return RefreshIndicator(
            onRefresh: () async {
              context.read<FeedingBloc>().add(const LoadAllFeedingData());
            },
            child: Column(
              children: [
                _buildTabBar(),
                Expanded(
                  child: IndexedStack(
                    index: _selectedTab,
                    children: [
                      _buildStockTab(context, state),
                      _buildScheduleTab(context, state),
                      _buildStatisticsTab(state),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildTabBar() {
    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(28),
      ),
      child: Row(
        children: [
          _buildTab("Stok", 0),
          _buildTab("Jadwal", 1),
          _buildTab("Statistik", 2),
        ],
      ),
    );
  }

  Widget _buildTab(String title, int index) {
    final isSelected = _selectedTab == index;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _selectedTab = index),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? AppTheme.primaryColor : Colors.transparent,
            borderRadius: BorderRadius.circular(24),
          ),
          child: Text(
            title,
            textAlign: TextAlign.center,
            style: GoogleFonts.poppins(
              color: isSelected ? Colors.white : Colors.grey[600],
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
              fontSize: 13,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStockTab(BuildContext context, FeedingState state) {
    if (state.feedStock.isEmpty) {
      return const Center(
        child: Text("Belum ada stok pakan"),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: state.feedStock.length,
      itemBuilder: (context, index) {
        final feed = state.feedStock[index];
        return _buildStockCard(feed);
      },
    );
  }

  Widget _buildStockCard(FeedStockEntity feed) {
    final isLowStock = feed.isLowStock;
    final isExpiringSoon = feed.isExpiringSoon;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  color: AppTheme.primaryColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Icon(Icons.restaurant, color: AppTheme.primaryColor, size: 28),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      feed.name,
                      style: GoogleFonts.poppins(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Text(
                          "Stok: ${_formatNumber(feed.stock)} ${feed.unit}",
                          style: GoogleFonts.poppins(
                            fontSize: 12,
                            color: isLowStock ? Colors.red : Colors.grey[600],
                          ),
                        ),
                        if (isExpiringSoon) ...[
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.orange.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              "Exp: ${DateFormat('dd/MM/yyyy').format(feed.expiryDate!)}",
                              style: GoogleFonts.poppins(fontSize: 9, color: Colors.orange),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    _formatCurrency(feed.price),
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.primaryColor,
                    ),
                  ),
                  Text(
                    feed.supplier,
                    style: GoogleFonts.poppins(fontSize: 10, color: Colors.grey[500]),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () => _reorderFeed(feed),
                  child: const Text("Pesan Ulang"),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: () => _showFeedDetail(feed),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryColor,
                  ),
                  child: const Text("Detail"),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildScheduleTab(BuildContext context, FeedingState state) {
    if (state.feedingSchedules.isEmpty) {
      return const Center(
        child: Text("Belum ada jadwal pakan"),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: state.feedingSchedules.length,
      itemBuilder: (context, index) {
        final schedule = state.feedingSchedules[index];
        return _buildScheduleCard(schedule);
      },
    );
  }

  Widget _buildScheduleCard(FeedingScheduleEntity schedule) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: AppTheme.primaryColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(Icons.schedule, color: AppTheme.primaryColor, size: 30),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  schedule.timeDisplay,
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  "Jumlah: ${_formatNumber(schedule.amount)} ${schedule.unit} • ${schedule.pondName}",
                  style: GoogleFonts.poppins(
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
                Text(
                  "Pakan: ${schedule.feedName}",
                  style: GoogleFonts.poppins(
                    fontSize: 10,
                    color: Colors.grey[500],
                  ),
                ),
              ],
            ),
          ),
          Switch(
            value: schedule.isEnabled,
            onChanged: (val) => _toggleSchedule(schedule.id, val),
            activeColor: AppTheme.primaryColor,
          ),
        ],
      ),
    );
  }

  Widget _buildStatisticsTab(FeedingState state) {
    final stats = state.statistics;
    if (stats == null) {
      return const Center(child: CircularProgressIndicator());
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          _buildStatCard(
            title: "Feed Conversion Ratio (FCR)",
            value: stats.fcr.toStringAsFixed(2),
            subtitle: "Standar: 1.2 - 1.6",
            status: _getFCRStatus(stats.fcr),
            statusColor: _getFCRColor(stats.fcr),
          ),
          const SizedBox(height: 16),
          _buildStatCard(
            title: "Total Konsumsi Pakan",
            value: "${_formatNumber(stats.totalConsumption)} kg",
            subtitle: "Bulan ini",
            status: "${((stats.totalConsumption / 3000) * 100).toStringAsFixed(0)}% dari target",
            statusColor: Colors.orange,
          ),
          const SizedBox(height: 16),
          _buildStatCard(
            title: "Efisiensi Biaya",
            value: _formatCurrency(stats.averageCostPerKg),
            subtitle: "Rata-rata per kg",
            status: stats.efficiencyStatus,
            statusColor: stats.efficiencyColor,
          ),
          const SizedBox(height: 16),
          _buildStatCard(
            title: "Total Stok Pakan",
            value: "${_formatNumber(state.totalFeedStock)} kg",
            subtitle: "Nilai: ${_formatCurrency(state.totalFeedValue)}",
            status: "${state.lowStockCount} item low stock",
            statusColor: state.lowStockCount > 0 ? Colors.red : Colors.green,
          ),
          const SizedBox(height: 16),
          _buildStatCard(
            title: "Jadwal Aktif",
            value: "${state.activeScheduleCount} jadwal",
            subtitle: "Dari ${state.feedingSchedules.length} total",
            status: "Berjalan",
            statusColor: Colors.green,
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard({
    required String title,
    required String value,
    required String subtitle,
    required String status,
    required Color statusColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 8)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey[600])),
          const SizedBox(height: 8),
          Text(value, style: GoogleFonts.poppins(fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(subtitle, style: GoogleFonts.poppins(fontSize: 11, color: Colors.grey[500])),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: statusColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              status,
              style: GoogleFonts.poppins(fontSize: 10, color: statusColor, fontWeight: FontWeight.w500),
            ),
          ),
        ],
      ),
    );
  }

  void _showAddFeedDialog(BuildContext context) {
    final nameController = TextEditingController();
    final stockController = TextEditingController();
    final priceController = TextEditingController();
    final supplierController = TextEditingController();

    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text("Tambah Stok Pakan"),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameController,
                decoration: const InputDecoration(labelText: "Nama Pakan"),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: stockController,
                decoration: const InputDecoration(labelText: "Jumlah Stok"),
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 12),
              TextField(
                controller: priceController,
                decoration: const InputDecoration(labelText: "Harga per Unit"),
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 12),
              TextField(
                controller: supplierController,
                decoration: const InputDecoration(labelText: "Supplier"),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Batal")),
          ElevatedButton(
            onPressed: () {
              final data = {
                'name': nameController.text,
                'stock': double.tryParse(stockController.text) ?? 0,
                'price': double.tryParse(priceController.text) ?? 0,
                'supplier': supplierController.text,
                'unit': 'kg',
              };
              context.read<FeedingBloc>().add(AddFeedStockEvent(data));
              Navigator.pop(context);
            },
            child: const Text("Simpan"),
          ),
        ],
      ),
    );
  }

  void _showFeedDetail(FeedStockEntity feed) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(feed.name),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _detailRow("Stok", "${_formatNumber(feed.stock)} ${feed.unit}"),
            const SizedBox(height: 8),
            _detailRow("Harga", _formatCurrency(feed.price)),
            const SizedBox(height: 8),
            _detailRow("Supplier", feed.supplier),
            if (feed.expiryDate != null) ...[
              const SizedBox(height: 8),
              _detailRow("Expired", DateFormat('dd MMM yyyy').format(feed.expiryDate!)),
            ],
            if (feed.category != null) ...[
              const SizedBox(height: 8),
              _detailRow("Kategori", feed.category!),
            ],
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Tutup")),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _reorderFeed(feed);
            },
            child: const Text("Pesan Ulang"),
          ),
        ],
      ),
    );
  }

  Widget _detailRow(String label, String value) {
    return Row(
      children: [
        SizedBox(
          width: 80,
          child: Text(label, style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey[600])),
        ),
        Text(":", style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey[600])),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            value,
            style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w500),
          ),
        ),
      ],
    );
  }

  void _reorderFeed(FeedStockEntity feed) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text("Pesan ulang ${feed.name}"),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _toggleSchedule(String scheduleId, bool isEnabled) {
    context.read<FeedingBloc>().add(ToggleFeedingScheduleEvent(scheduleId, isEnabled));
  }

  String _getFCRStatus(double fcr) {
    if (fcr <= 1.2) return "Excellent";
    if (fcr <= 1.6) return "Good";
    if (fcr <= 2.0) return "Fair";
    return "Poor";
  }

  Color _getFCRColor(double fcr) {
    if (fcr <= 1.2) return Colors.green;
    if (fcr <= 1.6) return Colors.lightGreen;
    if (fcr <= 2.0) return Colors.orange;
    return Colors.red;
  }

  String _formatNumber(double value) {
    return NumberFormat("#,###.##").format(value);
  }

  String _formatCurrency(double amount) {
    final formatter = NumberFormat.currency(
      locale: 'id_ID',
      symbol: 'Rp ',
      decimalDigits: 0,
    );
    return formatter.format(amount);
  }
}
