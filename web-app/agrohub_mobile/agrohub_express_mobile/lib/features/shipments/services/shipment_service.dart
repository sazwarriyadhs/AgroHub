// features/shipments/services/shipment_service.dart
import '../models/shipment_model.dart';

class ShipmentService {
  Future<ShipmentData?> getShipmentById(String id) async {
    await Future.delayed(const Duration(milliseconds: 500));
    
    return ShipmentData(
      id: int.tryParse(id) ?? 1,
      deliveryType: DeliveryType.regular,
      cargoType: CargoType.general,
      fragile: false,
      temperatureRequired: false,
      liveAnimal: false,
      status: ShipmentStatus.inTransit,
    );
  }

  Future<ShipmentData?> getActiveShipment() async {
    await Future.delayed(const Duration(milliseconds: 500));
    return ShipmentData(
      id: 123,
      deliveryType: DeliveryType.regular,
      cargoType: CargoType.general,
      fragile: false,
      temperatureRequired: false,
      liveAnimal: false,
      status: ShipmentStatus.inTransit,
    );
  }

  Future<ShipmentData> updateShipmentStatus(
    String shipmentId,
    ShipmentStatus newStatus, {
    String? notes,
  }) async {
    await Future.delayed(const Duration(milliseconds: 500));
    return ShipmentData(
      id: int.tryParse(shipmentId) ?? 0,
      deliveryType: DeliveryType.regular,
      cargoType: CargoType.general,
      fragile: false,
      temperatureRequired: false,
      liveAnimal: false,
      status: newStatus,
    );
  }
}
