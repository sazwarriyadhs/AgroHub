// lib/features/feeding/data/models/feed_stock_model.dart
import '../../domain/entities/feed_stock_entity.dart';

class FeedStockModel extends FeedStockEntity {
  const FeedStockModel({
    required super.id,
    required super.name,
    required super.stock,
    required super.unit,
    required super.price,
    required super.supplier,
    super.expiryDate,
    super.minStock,
    super.category,
  });

  factory FeedStockModel.fromJson(Map<String, dynamic> json) {
    return FeedStockModel(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      stock: (json['stock'] ?? 0).toDouble(),
      unit: json['unit'] ?? 'kg',
      price: (json['price'] ?? 0).toDouble(),
      supplier: json['supplier'] ?? '',
      expiryDate: json['expiry_date'] != null ? DateTime.tryParse(json['expiry_date']) : null,
      minStock: json['min_stock'] != null ? (json['min_stock']).toDouble() : null,
      category: json['category'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'stock': stock,
      'unit': unit,
      'price': price,
      'supplier': supplier,
      'expiry_date': expiryDate?.toIso8601String(),
      'min_stock': minStock,
      'category': category,
    };
  }
}
