// lib/features/market/domain/entities/price_entity.dart
class PriceEntity {
  final String id;
  final String name;
  final double price;
  final double change;
  final String unit;
  final DateTime updatedAt;
  final String category;

  const PriceEntity({
    required this.id,
    required this.name,
    required this.price,
    required this.change,
    required this.unit,
    required this.updatedAt,
    required this.category,
  });

  String get formattedPrice => 'Rp ${price.toStringAsFixed(0)}';
  bool get isIncreasing => change > 0;
  Color get changeColor => change >= 0 ? Colors.green : Colors.red;
}
