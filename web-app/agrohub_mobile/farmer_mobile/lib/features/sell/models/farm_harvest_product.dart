// lib/features/sell/models/farm_harvest_product.dart

class FarmHarvestProduct {
  final int id;
  final String name;
  final String category;
  final String categorySlug;
  final double avgMarketPrice;
  final String unit;
  final String? imageUrl;
  final String? description;
  final DateTime? harvestDate;
  final double? stockEstimation;
  final String? freshnessStatus;
  final String? qualityGrade;

  FarmHarvestProduct({
    required this.id,
    required this.name,
    required this.category,
    required this.categorySlug,
    required this.avgMarketPrice,
    this.unit = 'kg',
    this.imageUrl,
    this.description,
    this.harvestDate,
    this.stockEstimation,
    this.freshnessStatus,
    this.qualityGrade,
  });

  factory FarmHarvestProduct.fromJson(Map<String, dynamic> json) {
    return FarmHarvestProduct(
      id: json['id'] ?? json['product_id'] ?? 0,
      name: json['name'] ?? json['product_name'] ?? '',
      category: json['category'] ?? json['category_name'] ?? '',
      categorySlug: json['category_slug'] ?? '',
      avgMarketPrice: (json['price'] ?? json['avg_market_price'] ?? 0).toDouble(),
      unit: json['unit'] ?? 'kg',
      imageUrl: json['image_url'],
      description: json['description'],
      harvestDate: json['harvest_date'] != null 
          ? DateTime.tryParse(json['harvest_date']) 
          : null,
      stockEstimation: json['stock_estimation']?.toDouble(),
      freshnessStatus: json['freshness_status'],
      qualityGrade: json['quality_grade'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'category': category,
      'category_slug': categorySlug,
      'avg_market_price': avgMarketPrice,
      'unit': unit,
      'image_url': imageUrl,
      'description': description,
      'harvest_date': harvestDate?.toIso8601String(),
      'stock_estimation': stockEstimation,
      'freshness_status': freshnessStatus,
      'quality_grade': qualityGrade,
    };
  }

  // Helper methods
  String get formattedPrice {
    return 'Rp ${avgMarketPrice.toStringAsFixed(0).replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
      (m) => '${m[1]}.',
    )}';
  }

  String get formattedStock {
    if (stockEstimation == null) return '-';
    return '${stockEstimation!.toStringAsFixed(0)} $unit';
  }

  String get categoryIcon {
    switch (category.toLowerCase()) {
      case 'padi':
        return '🌾';
      case 'jagung':
        return '🌽';
      case 'cabai':
        return '🌶️';
      case 'tomat':
        return '🍅';
      case 'sayur':
      case 'sayuran':
        return '🥬';
      case 'buah':
        return '🍎';
      default:
        return '🌱';
    }
  }

  Color get categoryColor {
    switch (category.toLowerCase()) {
      case 'padi':
        return Colors.green;
      case 'jagung':
        return Colors.amber;
      case 'cabai':
        return Colors.red;
      case 'tomat':
        return Colors.orange;
      case 'sayur':
      case 'sayuran':
        return Colors.lightGreen;
      case 'buah':
        return Colors.deepOrange;
      default:
        return Colors.green;
    }
  }
}

// Extension untuk List FarmHarvestProduct
extension FarmHarvestProductList on List<FarmHarvestProduct> {
  double get totalValue {
    return fold(0, (sum, item) => sum + (item.stockEstimation ?? 0) * item.avgMarketPrice);
  }

  double get totalStock {
    return fold(0, (sum, item) => sum + (item.stockEstimation ?? 0));
  }

  Map<String, List<FarmHarvestProduct>> groupByCategory() {
    final Map<String, List<FarmHarvestProduct>> grouped = {};
    for (final product in this) {
      grouped.putIfAbsent(product.category, () => []).add(product);
    }
    return grouped;
  }
}