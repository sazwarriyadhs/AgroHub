// lib/features/sell/models/product_category.dart
class ProductCategory {
  final int id;
  final String name;
  final String slug;
  final String? icon;

  ProductCategory({
    required this.id,
    required this.name,
    required this.slug,
    this.icon,
  });

  factory ProductCategory.fromJson(Map<String, dynamic> json) {
    return ProductCategory(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      slug: json['slug'] ?? '',
      icon: json['icon'],
    );
  }
}
