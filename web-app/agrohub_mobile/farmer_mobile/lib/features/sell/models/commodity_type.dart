// lib/features/sell/models/commodity_type.dart
class CommodityType {
  final int id;
  final String name;
  final int categoryId;
  final double? basePrice;
  final String? unit;

  CommodityType({
    required this.id,
    required this.name,
    required this.categoryId,
    this.basePrice,
    this.unit,
  });

  factory CommodityType.fromJson(Map<String, dynamic> json) {
    return CommodityType(
      id: json['id'] ?? 0,
      name: json['name'] ?? json['commodity_name'] ?? '',
      categoryId: json['category_id'] ?? 0,
      basePrice: json['base_price']?.toDouble(),
      unit: json['unit'] ?? 'kg',
    );
  }
}
