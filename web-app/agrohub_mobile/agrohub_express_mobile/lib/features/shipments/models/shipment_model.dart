import 'package:flutter/material.dart';

enum ShipmentStatus {
  pending,
  waitingPickup,
  pickedUp,
  inTransit,
  arrivedHub,
  outForDelivery,
  delivered,
  failed,
  returned,
  cancelled;

  String get displayName {
    switch (this) {
      case ShipmentStatus.pending: return 'Pending';
      case ShipmentStatus.waitingPickup: return 'Menunggu Pickup';
      case ShipmentStatus.pickedUp: return 'Sudah Diambil';
      case ShipmentStatus.inTransit: return 'Dalam Perjalanan';
      case ShipmentStatus.arrivedHub: return 'Tiba di Hub';
      case ShipmentStatus.outForDelivery: return 'Sedang Dikirim';
      case ShipmentStatus.delivered: return 'Terkirim';
      case ShipmentStatus.failed: return 'Gagal';
      case ShipmentStatus.returned: return 'Dikembalikan';
      case ShipmentStatus.cancelled: return 'Dibatalkan';
    }
  }

  Color get color {
    switch (this) {
      case ShipmentStatus.pending: return Colors.grey;
      case ShipmentStatus.waitingPickup: return Colors.orange;
      case ShipmentStatus.pickedUp: return Colors.blue;
      case ShipmentStatus.inTransit: return Colors.purple;
      case ShipmentStatus.arrivedHub: return Colors.cyan;
      case ShipmentStatus.outForDelivery: return Colors.green;
      case ShipmentStatus.delivered: return Colors.green;
      case ShipmentStatus.failed: return Colors.red;
      case ShipmentStatus.returned: return Colors.amber;
      case ShipmentStatus.cancelled: return Colors.red;
    }
  }
}

enum DeliveryType {
  regular,
  sameDay,
  nextDay,
  instant,
  cargo;

  String get displayName {
    switch (this) {
      case DeliveryType.regular: return 'Regular';
      case DeliveryType.sameDay: return 'Same Day';
      case DeliveryType.nextDay: return 'Next Day';
      case DeliveryType.instant: return 'Instant';
      case DeliveryType.cargo: return 'Cargo';
    }
  }
}

enum CargoType {
  general,
  food,
  medicine,
  electronics,
  fragile,
  liveAnimal,
  temperatureControlled;

  String get displayName {
    switch (this) {
      case CargoType.general: return 'General';
      case CargoType.food: return 'Makanan';
      case CargoType.medicine: return 'Obat-obatan';
      case CargoType.electronics: return 'Elektronik';
      case CargoType.fragile: return 'Rentan Pecah';
      case CargoType.liveAnimal: return 'Hewan Hidup';
      case CargoType.temperatureControlled: return 'Suhu Terjaga';
    }
  }
}

class ShipmentData {
  final int id;
  final String? shipmentCode;
  final DeliveryType deliveryType;
  final CargoType cargoType;
  final bool fragile;
  final bool temperatureRequired;
  final bool liveAnimal;
  final ShipmentStatus status;
  final double? weightKg;
  final int? maxTemperature;
  final DateTime? estimatedArrival;
  final DateTime? deliveredAt;

  const ShipmentData({
    required this.id,
    this.shipmentCode,
    required this.deliveryType,
    required this.cargoType,
    required this.fragile,
    required this.temperatureRequired,
    required this.liveAnimal,
    required this.status,
    this.weightKg,
    this.maxTemperature,
    this.estimatedArrival,
    this.deliveredAt,
  });
}

extension ShipmentDataExtension on ShipmentData {
  String get displayId {
    return shipmentCode ?? '#SHP-';
  }
}
