// lib/features/marketplace/domain/entities/product_entity.dart
part of 'package:agrohub_aqua_app/features/marketplace/presentation/bloc/marketplace_bloc.dart';

class ProductEntity extends Equatable {
  final String id;
  final String name;
  final int price;
  final int stock;
  final String category;
  final String location;
  final String? description;
  final String? imageUrl;
  final DateTime createdAt;

  const ProductEntity({
    required this.id,
    required this.name,
    required this.price,
    required this.stock,
    required this.category,
    required this.location,
    this.description,
    this.imageUrl,
    required this.createdAt,
  });

  @override
  List<Object?> get props => [
    id, name, price, stock, category, location, description, imageUrl, createdAt
  ];
}
