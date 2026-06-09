// lib/features/cart/models/cart_model.dart

class CartModel {
  final int id;
  final int userId;
  final List<CartItemModel> items;
  final DateTime createdAt;
  final DateTime updatedAt;

  CartModel({
    required this.id,
    required this.userId,
    required this.items,
    required this.createdAt,
    required this.updatedAt,
  });

  double get totalPrice {
    double total = 0;
    for (var item in items) {
      total += item.subtotal;
    }
    return total;
  }

  int get itemCount => items.length;

  factory CartModel.fromJson(Map<String, dynamic> json) {
    final itemsList = json['items'] as List? ?? [];
    return CartModel(
      id: json['id'] ?? 0,
      userId: json['user_id'] ?? 0,
      items: itemsList.map((item) => CartItemModel.fromJson(item)).toList(),
      createdAt: DateTime.tryParse(json['created_at']?.toString() ?? '') ?? DateTime.now(),
      updatedAt: DateTime.tryParse(json['updated_at']?.toString() ?? '') ?? DateTime.now(),
    );
  }
}

class CartItemModel {
  final int id;
  final int cartId;
  final int productId;
  final int quantity;
  final ProductModel? product;
  final DateTime createdAt;

  CartItemModel({
    required this.id,
    required this.cartId,
    required this.productId,
    required this.quantity,
    this.product,
    required this.createdAt,
  });

  double get subtotal {
    if (product != null) {
      return product!.price * quantity;
    }
    return 0;
  }

  String get productName => product?.name ?? 'Produk';
  double get productPrice => product?.price ?? 0;
  String get productUnit => product?.unit ?? 'kg';
  String get productIcon => _getIconForProduct(productName);

  String _getIconForProduct(String name) {
    if (name.contains('Padi') || name.contains('Beras')) return '🌾';
    if (name.contains('Jagung')) return '🌽';
    if (name.contains('Cabai')) return '🌶️';
    if (name.contains('Tomat')) return '🍅';
    if (name.contains('Pupuk')) return '🧪';
    if (name.contains('Pestisida')) return '🐛';
    if (name.contains('Benih')) return '🌱';
    if (name.contains('Pompa')) return '🔧';
    return '📦';
  }

  factory CartItemModel.fromJson(Map<String, dynamic> json) {
    return CartItemModel(
      id: json['id'] ?? 0,
      cartId: json['cart_id'] ?? 0,
      productId: json['product_id'] ?? 0,
      quantity: json['quantity'] ?? 1,
      product: json['product'] != null ? ProductModel.fromJson(json['product']) : null,
      createdAt: DateTime.tryParse(json['created_at']?.toString() ?? '') ?? DateTime.now(),
    );
  }
}

class ProductModel {
  final int id;
  final String name;
  final double price;
  final String unit;
  final int? categoryId;
  final String? imageUrl;

  ProductModel({
    required this.id,
    required this.name,
    required this.price,
    required this.unit,
    this.categoryId,
    this.imageUrl,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? 'Produk',
      price: (json['price'] ?? 0).toDouble(),
      unit: json['unit'] ?? 'kg',
      categoryId: json['category_id'],
      imageUrl: json['image_url'],
    );
  }
}