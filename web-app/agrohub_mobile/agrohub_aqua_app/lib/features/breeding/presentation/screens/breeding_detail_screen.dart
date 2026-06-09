// lib/features/breeding/presentation/screens/breeding_detail_screen.dart
// ============================================================================
// BREEDING DETAIL SCREEN - WITH BLOC INTEGRATION
// Version: 1.0.0 - Full BLoC Integration
// ============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';

import '../../../../../core/services/api_service.dart';
import '../bloc/breeding_bloc.dart';
import '../bloc/breeding_event.dart';
import '../bloc/breeding_state.dart';
import '../../../dashboard/presentation/screens/aqua_dashboard.dart';

class BreedingDetailScreen extends StatelessWidget {
  final String breedingId;
  
  const BreedingDetailScreen({
    super.key, 
    required this.breedingId,
  });

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => BreedingBloc(
        apiService: context.read<ApiService>(),
      )..add(LoadBreedingDetail(breedingId)),
      child: const _BreedingDetailView(),
    );
  }
}

class _BreedingDetailView extends StatelessWidget {
  const _BreedingDetailView();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FB),
      appBar: _buildAppBar(context),
      body: BlocConsumer<BreedingBloc, BreedingState>(
        listenWhen: (previous, current) => previous.error != current.error,
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
          if (state.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          
          if (state.error != null && state.currentBreeding == null) {
            return _buildErrorWidget(context, state.error!);
          }
          
          final breeding = state.currentBreeding;
          if (breeding == null) {
            return _buildEmptyWidget(context);
          }
          
          return RefreshIndicator(
            onRefresh: () async {
              context.read<BreedingBloc>().add(LoadBreedingDetail(breeding.id));
            },
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _HeaderCard(breeding: breeding),
                  const SizedBox(height: 20),
                  _AIPredictionCard(breeding: breeding),
                  const SizedBox(height: 20),
                  _KPIRow(breeding: breeding),
                  const SizedBox(height: 20),
                  _TimelineSection(breeding: breeding),
                  const SizedBox(height: 20),
                  _WaterQualityCard(breeding: breeding),
                  const SizedBox(height: 20),
                  _ActionPanel(breeding: breeding),
                  const SizedBox(height: 20),
                  _GrowthHistoryCard(breeding: breeding),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
  
  PreferredSizeWidget _buildAppBar(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.transparent,
      elevation: 0,
      foregroundColor: Colors.black,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back_ios_new),
        onPressed: () => Navigator.pop(context),
      ),
      title: Text(
        "🐟 Breeding Intelligence",
        style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
      ),
      centerTitle: true,
      actions: [
        IconButton(
          icon: const Icon(Icons.refresh),
          onPressed: () {
            context.read<BreedingBloc>().add(LoadBreedingDetail(
              context.read<BreedingBloc>().state.currentBreeding?.id ?? ''
            ));
          },
        ),
      ],
    );
  }
  
  Widget _buildErrorWidget(BuildContext context, String error) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error_outline, size: 64, color: Colors.red),
          const SizedBox(height: 16),
          Text("Error", style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text(error, textAlign: TextAlign.center),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () {
              context.read<BreedingBloc>().add(const LoadBreedings());
              Navigator.pop(context);
            },
            child: const Text("Kembali"),
          ),
        ],
      ),
    );
  }
  
  Widget _buildEmptyWidget(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.pets, size: 64, color: Colors.grey),
          const SizedBox(height: 16),
          Text("Tidak ada data breeding", style: GoogleFonts.poppins(fontSize: 16)),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("Kembali"),
          ),
        ],
      ),
    );
  }
}

// ============================================================================
// HEADER CARD
// ============================================================================

class _HeaderCard extends StatelessWidget {
  final BreedingEntity breeding;
  
  const _HeaderCard({required this.breeding});

  @override
  Widget build(BuildContext context) {
    final currentDay = breeding.currentDay ?? 0;
    final totalDays = breeding.totalDays ?? 28;
    final phase = _getPhaseName(breeding.currentPhase);
    final progress = currentDay / totalDays;
    
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF00C6FF), Color(0xFF0072FF)],
        ),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  "${breeding.fishType} Batch #${breeding.batchNumber}",
                  style: GoogleFonts.poppins(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  phase,
                  style: GoogleFonts.poppins(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            "Status: ${breeding.status?.toUpperCase() ?? 'ACTIVE'}",
            style: GoogleFonts.poppins(color: Colors.white70, fontSize: 12),
          ),
          const SizedBox(height: 12),
          LinearProgressIndicator(
            value: progress,
            backgroundColor: Colors.white.withOpacity(0.3),
            valueColor: const AlwaysStoppedAnimation(Colors.white),
          ),
          const SizedBox(height: 8),
          Text(
            "Day $currentDay / $totalDays Lifecycle",
            style: GoogleFonts.poppins(color: Colors.white, fontSize: 12),
          ),
        ],
      ),
    );
  }
  
  String _getPhaseName(String? phase) {
    switch (phase) {
      case 'incubation': return 'INCUBATION';
      case 'hatching': return 'HATCHING';
      case 'larva': return 'LARVA GROWTH';
      case 'fry': return 'FRY STAGE';
      default: return 'BREEDING';
    }
  }
}

// ============================================================================
// AI PREDICTION CARD
// ============================================================================

class _AIPredictionCard extends StatelessWidget {
  final BreedingEntity breeding;
  
  const _AIPredictionCard({required this.breeding});

  @override
  Widget build(BuildContext context) {
    final successRate = breeding.aiSuccessRate ?? 0.89;
    final isHigh = successRate >= 0.7;
    final statusText = successRate >= 0.7 ? "High" : (successRate >= 0.5 ? "Medium" : "Low");
    final statusColor = successRate >= 0.7 ? Colors.green : (successRate >= 0.5 ? Colors.orange : Colors.red);
    
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 5),
          )
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.auto_awesome, color: Color(0xFF0072FF), size: 24),
              const SizedBox(width: 8),
              Text(
                "AI Success Prediction",
                style: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 14),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("Success Probability", style: GoogleFonts.poppins(fontSize: 12)),
              Text(
                "${(successRate * 100).toStringAsFixed(0)}% ($statusText)",
                style: GoogleFonts.poppins(
                  color: statusColor,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          LinearProgressIndicator(
            value: successRate,
            minHeight: 8,
            backgroundColor: Colors.grey[200],
            valueColor: AlwaysStoppedAnimation(statusColor),
          ),
          const SizedBox(height: 12),
          Text(
            breeding.aiInsight ?? "Water quality optimal, mortality risk low. Recommend maintain oxygen > 6 mg/L.",
            style: GoogleFonts.poppins(color: Colors.grey[600], fontSize: 11),
          ),
        ],
      ),
    );
  }
}

// ============================================================================
// KPI ROW
// ============================================================================

class _KPIRow extends StatelessWidget {
  final BreedingEntity breeding;
  
  const _KPIRow({required this.breeding});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _MiniStat(
            title: "Egg Count",
            value: NumberFormat("#,###").format(breeding.eggCount),
            icon: Icons.egg,
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _MiniStat(
            title: "Hatch Rate",
            value: "${breeding.hatchRate.toStringAsFixed(0)}%",
            icon: Icons.egg_outlined,
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _MiniStat(
            title: "Survival",
            value: "${breeding.survivalRate.toStringAsFixed(0)}%",
            icon: Icons.trending_up,
          ),
        ),
      ],
    );
  }
}

class _MiniStat extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  
  const _MiniStat({
    required this.title,
    required this.value,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          Icon(icon, color: const Color(0xFF0072FF), size: 24),
          const SizedBox(height: 6),
          Text(
            value,
            style: GoogleFonts.poppins(
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            title,
            style: GoogleFonts.poppins(color: Colors.grey[600], fontSize: 10),
          ),
        ],
      ),
    );
  }
}

// ============================================================================
// TIMELINE SECTION
// ============================================================================

class _TimelineSection extends StatelessWidget {
  final BreedingEntity breeding;
  
  const _TimelineSection({required this.breeding});

  @override
  Widget build(BuildContext context) {
    final timeline = breeding.timeline ?? [];
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Lifecycle Timeline",
          style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.03),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            children: timeline.map((step) => _TimelineStep(step: step)).toList(),
          ),
        ),
      ],
    );
  }
}

class _TimelineStep extends StatelessWidget {
  final BreedingStep step;
  
  const _TimelineStep({required this.step});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(
        step.isDone ? Icons.check_circle : Icons.radio_button_unchecked,
        color: step.isDone ? Colors.green : Colors.grey[400],
        size: 22,
      ),
      title: Text(
        step.title,
        style: GoogleFonts.poppins(
          fontWeight: step.isDone ? FontWeight.w600 : FontWeight.w400,
          color: step.isDone ? const Color(0xFF1A2B4C) : Colors.grey[600],
        ),
      ),
      trailing: step.completedAt != null
          ? Text(
              DateFormat('dd MMM').format(step.completedAt!),
              style: GoogleFonts.poppins(fontSize: 10, color: Colors.grey[500]),
            )
          : null,
    );
  }
}

// ============================================================================
// WATER QUALITY CARD
// ============================================================================

class _WaterQualityCard extends StatelessWidget {
  final BreedingEntity breeding;
  
  const _WaterQualityCard({required this.breeding});

  @override
  Widget build(BuildContext context) {
    final waterQuality = breeding.waterQuality ?? {};
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Water Quality",
          style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.03),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            children: [
              _WaterRow(
                label: "pH",
                value: waterQuality['ph']?.toString() ?? "7.2",
                status: _getPhStatus(waterQuality['ph']),
              ),
              const Divider(height: 16),
              _WaterRow(
                label: "Dissolved Oxygen",
                value: "${waterQuality['oxygen'] ?? 6.5} mg/L",
                status: _getOxygenStatus(waterQuality['oxygen']),
              ),
              const Divider(height: 16),
              _WaterRow(
                label: "Temperature",
                value: "${waterQuality['temperature'] ?? 28} °C",
                status: _getTempStatus(waterQuality['temperature']),
              ),
              const Divider(height: 16),
              _WaterRow(
                label: "Ammonia",
                value: "${waterQuality['ammonia'] ?? 0.2} mg/L",
                status: _getAmmoniaStatus(waterQuality['ammonia']),
              ),
            ],
          ),
        ),
      ],
    );
  }
  
  String _getPhStatus(double? ph) {
    if (ph == null) return "Unknown";
    if (ph >= 6.5 && ph <= 8.5) return "Good";
    if (ph < 6.5) return "Low";
    return "High";
  }
  
  String _getOxygenStatus(double? oxygen) {
    if (oxygen == null) return "Unknown";
    if (oxygen >= 6) return "Optimal";
    if (oxygen >= 4) return "Normal";
    return "Critical";
  }
  
  String _getTempStatus(double? temp) {
    if (temp == null) return "Unknown";
    if (temp >= 26 && temp <= 30) return "Optimal";
    if (temp >= 24 && temp <= 32) return "Normal";
    return "Warning";
  }
  
  String _getAmmoniaStatus(double? ammonia) {
    if (ammonia == null) return "Unknown";
    if (ammonia < 0.5) return "Safe";
    if (ammonia < 1.0) return "Monitor";
    return "Danger";
  }
}

class _WaterRow extends StatelessWidget {
  final String label;
  final String value;
  final String status;
  
  const _WaterRow({
    required this.label,
    required this.value,
    required this.status,
  });

  @override
  Widget build(BuildContext context) {
    final statusColor = status == "Optimal" || status == "Good" || status == "Safe"
        ? Colors.green
        : (status == "Normal" || status == "Monitor" ? Colors.orange : Colors.red);
    
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: GoogleFonts.poppins(fontSize: 13)),
          Text(value, style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w500)),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: statusColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              status,
              style: GoogleFonts.poppins(
                fontSize: 10,
                color: statusColor,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ============================================================================
// ACTION PANEL
// ============================================================================

class _ActionPanel extends StatelessWidget {
  final BreedingEntity breeding;
  
  const _ActionPanel({required this.breeding});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: ElevatedButton.icon(
            onPressed: () => _analyze(context),
            icon: const Icon(Icons.analytics, size: 18),
            label: const Text("AI Analyze"),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF0072FF),
              padding: const EdgeInsets.symmetric(vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: OutlinedButton.icon(
            onPressed: () => _recordGrowth(context),
            icon: const Icon(Icons.note_add, size: 18),
            label: const Text("Record"),
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ),
      ],
    );
  }
  
  void _analyze(BuildContext context) {
    context.read<BreedingBloc>().add(AnalyzeBreeding(breeding.id));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text("AI analysis in progress..."),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
  
  void _recordGrowth(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => _GrowthRecordDialog(breeding: breeding),
    );
  }
}

// ============================================================================
// GROWTH RECORD DIALOG
// ============================================================================

class _GrowthRecordDialog extends StatefulWidget {
  final BreedingEntity breeding;
  
  const _GrowthRecordDialog({required this.breeding});

  @override
  State<_GrowthRecordDialog> createState() => _GrowthRecordDialogState();
}

class _GrowthRecordDialogState extends State<_GrowthRecordDialog> {
  final _formKey = GlobalKey<FormState>();
  final _weightController = TextEditingController();
  final _lengthController = TextEditingController();
  
  @override
  void dispose() {
    _weightController.dispose();
    _lengthController.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text("Record Growth"),
      content: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextFormField(
              controller: _weightController,
              decoration: const InputDecoration(
                labelText: "Weight (grams)",
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
              validator: (v) => v == null || v.isEmpty ? "Required" : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _lengthController,
              decoration: const InputDecoration(
                labelText: "Length (cm)",
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
              validator: (v) => v == null || v.isEmpty ? "Required" : null,
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text("Cancel"),
        ),
        ElevatedButton(
          onPressed: () => _submit(context),
          child: const Text("Save"),
        ),
      ],
    );
  }
  
  void _submit(BuildContext context) {
    if (_formKey.currentState!.validate()) {
      final weight = double.parse(_weightController.text);
      final length = double.parse(_lengthController.text);
      
      context.read<BreedingBloc>().add(RecordGrowth(
        breedingId: widget.breeding.id,
        weight: weight,
        length: length,
      ));
      
      Navigator.pop(context);
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Growth recorded successfully")),
      );
    }
  }
}

// ============================================================================
// GROWTH HISTORY CARD
// ============================================================================

class _GrowthHistoryCard extends StatelessWidget {
  final BreedingEntity breeding;
  
  const _GrowthHistoryCard({required this.breeding});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Growth History",
          style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.03),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: const Center(
            child: Text(
              "No growth records yet.\nRecord your first growth measurement.",
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey),
            ),
          ),
        ),
      ],
    );
  }
}
