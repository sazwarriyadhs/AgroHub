// lib/features/buy/models/vendor_product.dart

class VendorProduct {
  final int id;
  final String name;

  /// fertilizer | pesticide | seed | tool | equipment
  final String category;

  final double price;
  final String unit;

  final String? imageUrl;
  final int stock;

  final String vendorName;

  /// optional (buat AI / rekomendasi nanti)
  final double? discount;
  final bool isActive;

  VendorProduct({
    required this.id,
    required this.name,
    required this.category,
    required this.price,
    required this.unit,
    this.imageUrl,
    required this.stock,
    required this.vendorName,
    this.discount,
    this.isActive = true,
  });

  factory VendorProduct.fromJson(Map<String, dynamic> json) {
    return VendorProduct(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      category: json['category'] ?? 'tool',
      price: (json['price'] ?? 0).toDouble(),
      unit: json['unit'] ?? 'pcs',
      imageUrl: json['image_url'],
      stock: json['stock'] ?? 0,
      vendorName: json['vendor_name'] ?? 'Vendor',
      discount: json['discount']?.toDouble(),
      isActive: json['is_active'] ?? true,
    );
  }

  /// 💰 formatted price
  String get formattedPrice {
    final finalPrice = discountedPrice;

    return 'Rp ${finalPrice.toStringAsFixed(0).replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
      (m) => '${m[1]}.',
    )}';
  }

  /// 🔥 pricing logic (IMPORTANT FOR AGRO ECOSYSTEM)
  double get discountedPrice {
    if (discount == null || discount == 0) return price;
    return price - (price * discount! / 100);
  }

  /// 🧠 category icon (UI only)
  String get categoryIcon {
    switch (category.toLowerCase()) {
      case 'fertilizer':
        return '🧪';
      case 'pesticide':
        return '🐛';
      case 'seed':
        return '🌱';
      case 'tool':
        return '🔧';
      case 'equipment':
        return '⚙️';
      default:
        return '📦';
    }
  }

  /// 🧠 stock status (buat UX)
  String get stockStatus {
    if (stock <= 0) return 'Habis';
    if (stock < 5) return 'Stok Menipis';
    return 'Tersedia';
  }
}