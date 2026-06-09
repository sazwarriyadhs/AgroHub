// lib/features/feeding/domain/entities/feed_stock_entity.dart
import 'package:equatable/equatable.dart';

class FeedStockEntity extends Equatable {
  final String id;
  final String name;
  final double stock;
  final String unit;
  final double price;
  final String supplier;
  final DateTime? expiryDate;
  final double? minStock;
  final String? category;

  const FeedStockEntity({
    required this.id,
    required this.name,
    required this.stock,
    required this.unit,
    required this.price,
    required this.supplier,
    this.expiryDate,
    this.minStock,
    this.category,
  });

  @override
  List<Object?> get props => [id, name, stock, unit, price, supplier, expiryDate, minStock, category];
  
  bool get isLowStock => minStock != null && stock <= minStock!;
  bool get isExpiringSoon => expiryDate != null && expiryDate!.difference(DateTime.now()).inDays <= 30;
}
