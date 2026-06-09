// lib/features/orders/data/models/order_model.dart
class OrderModel {
  final int id;
  final String orderNumber;
  final List<OrderItem> items;
  final double totalAmount;
  final String status;
  final String paymentStatus;
  final String shippingStatus;
  final DateTime createdAt;
  final DateTime? shippedAt;
  final DateTime? deliveredAt;
  final String? trackingNumber;
  
  OrderModel({
    required this.id,
    required this.orderNumber,
    required this.items,
    required this.totalAmount,
    required this.status,
    required this.paymentStatus,
    required this.shippingStatus,
    required this.createdAt,
    this.shippedAt,
    this.deliveredAt,
    this.trackingNumber,
  });
}

class OrderItem {
  final int productId;
  final String productName;
  final int quantity;
  final double price;
  final String image;
  
  OrderItem({
    required this.productId,
    required this.productName,
    required this.quantity,
    required this.price,
    required this.image,
  });
}
