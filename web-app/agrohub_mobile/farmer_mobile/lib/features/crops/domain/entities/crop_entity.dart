// lib/features/crops/domain/entities/crop_entity.dart
enum CropStatus {
  planting('🌱', 'Planting'),
  growing('🌿', 'Growing'),
  harvesting('🌾', 'Harvesting'),
  harvested('✅', 'Harvested');

  final String icon;
  final String label;
  const CropStatus(this.icon, this.label);
}

class CropEntity {
  final String id;
  final String name;
  final String variety;
  final DateTime plantingDate;
  final double area;
  final CropStatus status;
  final int healthScore;
  final String imageUrl;

  const CropEntity({
    required this.id,
    required this.name,
    required this.variety,
    required this.plantingDate,
    required this.area,
    required this.status,
    required this.healthScore,
    this.imageUrl = '',
  });

  int get ageInDays => DateTime.now().difference(plantingDate).inDays;
  bool get isHealthy => healthScore >= 70;
  bool get needsAttention => healthScore < 50 && healthScore >= 30;
  bool get isCritical => healthScore < 30;
  String get formattedArea => '${area.toStringAsFixed(1)} ha';
}
