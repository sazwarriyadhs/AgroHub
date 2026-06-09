// features/products/data/models/product_model.dart

class ProductModel {
  final int id;
  final String name;
  final String? description;
  final String? category;
  final double price;
  final int stock;
  final String? imageUrl;
  final List<String> images;
  final String? videoUrl;
  final List<String> tags;
  final String status;
  final int soldCount;
  final int viewCount;
  final double ratingAvg;
  final int ratingCount;
  final bool isFeatured;
  final bool isFlashSale;
  final double? flashSalePrice;
  final DateTime? flashSaleStart;
  final DateTime? flashSaleEnd;
  final int discountPercent;
  final List<dynamic> wholesalePrices;
  final List<dynamic> variants;
  final int storeId;
  final String? slug;
  final double? weight;
  final double? width;
  final double? height;
  final double? length;
  final int? minimumOrder;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final int? approvedBy;
  final DateTime? approvedAt;
  final DateTime? publishedAt;
  final String? productType;
  final Map<String, dynamic> aiMetadata;
  final String? supplyChainStage;

  ProductModel({
    required this.id,
    required this.name,
    this.description,
    this.category,
    required this.price,
    required this.stock,
    this.imageUrl,
    this.images = const [],
    this.videoUrl,
    this.tags = const [],
    this.status = 'active',
    this.soldCount = 0,
    this.viewCount = 0,
    this.ratingAvg = 0,
    this.ratingCount = 0,
    this.isFeatured = false,
    this.isFlashSale = false,
    this.flashSalePrice,
    this.flashSaleStart,
    this.flashSaleEnd,
    this.discountPercent = 0,
    this.wholesalePrices = const [],
    this.variants = const [],
    required this.storeId,
    this.slug,
    this.weight,
    this.width,
    this.height,
    this.length,
    this.minimumOrder,
    this.createdAt,
    this.updatedAt,
    this.approvedBy,
    this.approvedAt,
    this.publishedAt,
    this.productType,
    this.aiMetadata = const {},
    this.supplyChainStage,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['id'] as int,
      name: json['name'] as String,
      description: json['description'] as String?,
      category: json['category'] as String?,
      price: (json['price'] as num).toDouble(),
      stock: json['stock'] as int,
      imageUrl: json['image_url'] as String?,
      images: (json['images'] as List<dynamic>?)?.cast<String>() ?? [],
      videoUrl: json['video_url'] as String?,
      tags: (json['tags'] as List<dynamic>?)?.cast<String>() ?? [],
      status: json['status'] as String? ?? 'active',
      soldCount: json['sold_count'] as int? ?? 0,
      viewCount: json['view_count'] as int? ?? 0,
      ratingAvg: (json['rating_avg'] as num?)?.toDouble() ?? 0,
      ratingCount: json['rating_count'] as int? ?? 0,
      isFeatured: json['is_featured'] as bool? ?? false,
      isFlashSale: json['is_flash_sale'] as bool? ?? false,
      flashSalePrice: (json['flash_sale_price'] as num?)?.toDouble(),
      flashSaleStart: json['flash_sale_start'] != null ? DateTime.parse(json['flash_sale_start']) : null,
      flashSaleEnd: json['flash_sale_end'] != null ? DateTime.parse(json['flash_sale_end']) : null,
      discountPercent: json['discount_percent'] as int? ?? 0,
      wholesalePrices: json['wholesale_prices'] as List<dynamic>? ?? [],
      variants: json['variants'] as List<dynamic>? ?? [],
      storeId: json['store_id'] as int,
      slug: json['slug'] as String?,
      weight: (json['weight'] as num?)?.toDouble(),
      width: (json['width'] as num?)?.toDouble(),
      height: (json['height'] as num?)?.toDouble(),
      length: (json['length'] as num?)?.toDouble(),
      minimumOrder: json['minimum_order'] as int?,
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
      updatedAt: json['updated_at'] != null ? DateTime.parse(json['updated_at']) : null,
      approvedBy: json['approved_by'] as int?,
      approvedAt: json['approved_at'] != null ? DateTime.parse(json['approved_at']) : null,
      publishedAt: json['published_at'] != null ? DateTime.parse(json['published_at']) : null,
      productType: json['product_type'] as String?,
      aiMetadata: json['ai_metadata'] as Map<String, dynamic>? ?? {},
      supplyChainStage: json['supply_chain_stage'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'description': description,
      'category': category,
      'price': price,
      'stock': stock,
      'image_url': imageUrl,
      'images': images,
      'video_url': videoUrl,
      'tags': tags,
      'weight': weight,
      'width': width,
      'height': height,
      'length': length,
      'minimum_order': minimumOrder,
      'store_id': storeId,
    };
  }

  // Helper: harga setelah diskon
  double get finalPrice {
    if (isFlashSale && flashSalePrice != null) {
      return flashSalePrice!;
    }
    if (discountPercent > 0) {
      return price * (1 - discountPercent / 100);
    }
    return price;
  }

  // Helper: apakah sedang diskon
  bool get isOnSale {
    if (isFlashSale && flashSalePrice != null) {
      final now = DateTime.now();
      if (flashSaleStart != null && flashSaleEnd != null) {
        return now.isAfter(flashSaleStart!) && now.isBefore(flashSaleEnd!);
      }
      return true;
    }
    return discountPercent > 0;
  }

  // Helper: persentase diskon
  int get discountPercentage {
    if (isOnSale) {
      if (isFlashSale && flashSalePrice != null) {
        return ((price - flashSalePrice!) / price * 100).round();
      }
      return discountPercent;
    }
    return 0;
  }
}
