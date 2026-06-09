// lib/features/dashboard/presentation/widgets/recent_activities_widget.dart
// ============================================================================
// RECENT ACTIVITIES WIDGET
// Menampilkan daftar aktivitas terbaru user
// ============================================================================

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../../app/theme/app_theme.dart';

class RecentActivitiesWidget extends StatelessWidget {
  final List<Map<String, dynamic>> activities;
  final VoidCallback? onViewAll;
  
  const RecentActivitiesWidget({
    super.key,
    required this.activities,
    this.onViewAll,
  });

  @override
  Widget build(BuildContext context) {
    if (activities.isEmpty) {
      return _buildEmptyState();
    }
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildHeader(),
        const SizedBox(height: 12),
        ...activities.take(5).map((activity) => _buildActivityItem(activity)),
        if (activities.length > 5) _buildViewAllButton(),
      ],
    );
  }
  
  Widget _buildHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          "Aktivitas Terbaru",
          style: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: const Color(0xFF1A2B4C),
          ),
        ),
        if (onViewAll != null && activities.length > 5)
          TextButton(
            onPressed: onViewAll,
            child: Text(
              "Lihat Semua",
              style: GoogleFonts.poppins(
                fontSize: 12,
                color: AppTheme.primaryColor,
              ),
            ),
          ),
      ],
    );
  }
  
  Widget _buildEmptyState() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Aktivitas Terbaru",
          style: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: const Color(0xFF1A2B4C),
          ),
        ),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(32),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            children: [
              Icon(
                Icons.history_outlined,
                size: 48,
                color: Colors.grey[400],
              ),
              const SizedBox(height: 12),
              Text(
                "Belum ada aktivitas",
                style: GoogleFonts.poppins(
                  fontSize: 14,
                  color: Colors.grey[500],
                ),
              ),
              Text(
                "Mulai aktifitas Anda di AgroHub",
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  color: Colors.grey[400],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
  
  Widget _buildActivityItem(Map<String, dynamic> activity) {
    final title = activity['title'] ?? activity['description'] ?? 'Aktivitas';
    final amount = activity['amount'] ?? activity['value'] ?? '';
    final time = activity['created_at'] ?? activity['time'] ?? 'Baru saja';
    final type = activity['type'] ?? 'info';
    
    final icon = _getIconForType(type);
    final color = _getColorForType(type);
    
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Container(
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
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 22),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title.toString(),
                    style: GoogleFonts.poppins(
                      fontWeight: FontWeight.w500,
                      fontSize: 13,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Icon(Icons.access_time, size: 10, color: Colors.grey[500]),
                      const SizedBox(width: 4),
                      Text(
                        _formatTime(time),
                        style: GoogleFonts.poppins(
                          fontSize: 10,
                          color: Colors.grey[500],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            if (amount.isNotEmpty)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  amount.toString(),
                  style: GoogleFonts.poppins(
                    fontWeight: FontWeight.bold,
                    fontSize: 11,
                    color: color,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildViewAllButton() {
    return Center(
      child: TextButton(
        onPressed: onViewAll,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              "Lihat Semua Aktivitas",
              style: GoogleFonts.poppins(
                fontSize: 12,
                color: AppTheme.primaryColor,
              ),
            ),
            const SizedBox(width: 4),
            Icon(Icons.arrow_forward_ios, size: 10, color: AppTheme.primaryColor),
          ],
        ),
      ),
    );
  }
  
  IconData _getIconForType(String type) {
    switch (type) {
      case 'income': return Icons.arrow_downward;
      case 'expense': return Icons.arrow_upward;
      case 'success': return Icons.check_circle;
      case 'warning': return Icons.warning_amber;
      case 'error': return Icons.error;
      default: return Icons.circle_notifications;
    }
  }
  
  Color _getColorForType(String type) {
    switch (type) {
      case 'income': return Colors.green;
      case 'expense': return Colors.red;
      case 'success': return Colors.green;
      case 'warning': return Colors.orange;
      case 'error': return Colors.red;
      default: return AppTheme.primaryColor;
    }
  }
  
  String _formatTime(dynamic time) {
    if (time == null) return "Baru saja";
    
    if (time is DateTime) {
      final diff = DateTime.now().difference(time);
      if (diff.inDays > 0) return "${diff.inDays} hari lalu";
      if (diff.inHours > 0) return "${diff.inHours} jam lalu";
      if (diff.inMinutes > 0) return "${diff.inMinutes} menit lalu";
      return "Baru saja";
    }
    
    if (time is String) {
      try {
        final date = DateTime.parse(time);
        final diff = DateTime.now().difference(date);
        if (diff.inDays > 0) return "${diff.inDays} hari lalu";
        if (diff.inHours > 0) return "${diff.inHours} jam lalu";
        if (diff.inMinutes > 0) return "${diff.inMinutes} menit lalu";
        return "Baru saja";
      } catch (_) {
        return time;
      }
    }
    
    return time.toString();
  }
}
