// lib/features/dashboard/presentation/widgets/recent_activities_usage_example.dart
// ============================================================================
// CONTOH PENGGUNAAN RecentActivitiesWidget
// ============================================================================

/*
CARA MENGGUNAKAN RecentActivitiesWidget:

1. IMPORT:
   import '../../../widgets/recent_activities_widget.dart';

2. DI DALAM BUILDER (StatefulWidget/StatelessWidget):
   
   // Dengan data dari API
   RecentActivitiesWidget(
     activities: recentActivities,
     onViewAll: () {
       // Navigasi ke halaman semua aktivitas
       Navigator.push(
         context,
         MaterialPageRoute(builder: (_) => const AllActivitiesScreen()),
       );
     },
   )

3. DATA FORMAT YANG DIDUKUNG:
   
   {
     "title": "Pembelian Pakan",
     "description": "Membeli pakan 50 kg",
     "amount": "Rp 350.000",
     "created_at": "2024-01-15T10:30:00",
     "type": "expense"  // income, expense, success, warning, error, info
   }

4. TYPE DAN WARNA:
   - income  → hijau (arrow down)
   - expense → merah (arrow up)
   - success → hijau (check circle)
   - warning → orange (warning)
   - error   → merah (error)
   - info    → biru (notification)

5. FITUR:
   - Empty state jika tidak ada data
   - Format waktu otomatis (hari/jam/menit yang lalu)
   - Hanya tampil 5 item pertama
   - Tombol "Lihat Semua" jika lebih dari 5 item
*/
