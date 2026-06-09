// features/products/data/models/product_category_model.dart

class ProductCategoryModel {
  final int id;
  final String name;
  final int? parentId;
  final String? slug;
  final String? aiCategoryType;
  final DateTime? createdAt;

  ProductCategoryModel({
    required this.id,
    required this.name,
    this.parentId,
    this.slug,
    this.aiCategoryType,
    this.createdAt,
  });

  factory ProductCategoryModel.fromJson(Map<String, dynamic> json) {
    return ProductCategoryModel(
      id: json['id'] as int,
      name: json['name'] as String,
      parentId: json['parent_id'] as int?,
      slug: json['slug'] as String?,
      aiCategoryType: json['ai_category_type'] as String?,
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'parent_id': parentId,
      'slug': slug,
      'ai_category_type': aiCategoryType,
      'created_at': createdAt?.toIso8601String(),
    };
  }
}
