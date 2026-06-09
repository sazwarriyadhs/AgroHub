// features/shipments/providers/shipment_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/shipment_model.dart';
import '../services/shipment_service.dart';

final shipmentProvider = FutureProvider.family<ShipmentData?, String>((ref, id) async {
  final service = ShipmentService();
  return await service.getShipmentById(id);
});

final allShipmentsProvider = FutureProvider<List<ShipmentData>>((ref) async {
  final service = ShipmentService();
  return await service.getAllShipments();
});

// Real-time tracking untuk shipment tertentu
final liveShipmentProvider = StreamProvider.family<ShipmentData, String>((ref, id) async* {
  final service = ShipmentService();
  await for (var shipment in service.trackShipmentRealTime(id)) {
    yield shipment;
  }
});
