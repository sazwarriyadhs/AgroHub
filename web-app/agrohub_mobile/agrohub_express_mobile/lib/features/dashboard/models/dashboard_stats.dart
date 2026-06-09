// lib/features/shipments/models/shipment_model.dart (Tambahkan di bagian bawah)
import 'package:flutter/material.dart';

// ... (kode yang sudah ada tetap dipertahankan)

// Extension untuk backward compatibility
extension ShipmentDataSimple on ShipmentData {
  // Constructor sederhana untuk development
  static ShipmentData simple({
    required String id,
    required String customer,
    required String route,
    required String status,
    required String eta,
    required String distance,
    VoidCallback? onViewRoute,
  }) {
    return ShipmentData(
      id: int.tryParse(id.replaceAll(RegExp(r'[^0-9]'), '')) ?? 0,
      deliveryType: DeliveryType.regular,
      cargoType: CargoType.general,
      fragile: false,
      temperatureRequired: false,
      liveAnimal: false,
      status: ShipmentStatus.fromString(status.toLowerCase()),
      onViewRoute: onViewRoute,
    );
  }
}

// Simple class untuk backward compatibility (sementara)
class SimpleShipment {
  final String id;
  final String customer;
  final String route;
  final String status;
  final String eta;
  final String distance;
  final VoidCallback? onViewRoute;

  const SimpleShipment({
    required this.id,
    required this.customer,
    required this.route,
    required this.status,
    required this.eta,
    required this.distance,
    this.onViewRoute,
  });
}
