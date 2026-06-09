// core/providers/metric_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/metric_data.dart';
import '../../features/shipments/services/shipment_service.dart';

final metricProvider = StreamProvider<List<MetricData>>((ref) async* {
  // Real-time stream dari backend
  final service = ShipmentService();
  
  // Simulasi stream (ganti dengan WebSocket real nanti)
  await for (var data in service.getRealTimeMetrics()) {
    yield data;
  }
});

// Fallback static data untuk development
final staticMetricsProvider = Provider<List<MetricData>>((ref) {
  return const [
    MetricData(
      icon: Icons.inventory,
      color: Colors.green,
      value: "8",
      title: "Pengiriman",
      subtitle: "+2 kemarin",
    ),
    MetricData(
      icon: Icons.schedule,
      color: Colors.orange,
      value: "3",
      title: "Berjalan",
      subtitle: "Progress",
    ),
    MetricData(
      icon: Icons.check,
      color: Colors.blue,
      value: "5",
      title: "Selesai",
      subtitle: "80%",
    ),
    MetricData(
      icon: Icons.payments,
      color: Colors.purple,
      value: "Rp450K",
      title: "Pendapatan",
      subtitle: "+12%",
    ),
    MetricData(
      icon: Icons.route,
      color: Colors.green,
      value: "120km",
      title: "Distance",
      subtitle: "+15km",
    ),
    MetricData(
      icon: Icons.star,
      color: Colors.red,
      value: "4.9",
      title: "Rating",
      subtitle: "128 ulasan",
    ),
  ];
});
