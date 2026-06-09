// order_entity.dart
class Order {
  final String id;
  final String orderNumber;
  final String customerName;
  final double totalAmount;
  final String status;
  final DateTime createdAt;
  final List<OrderItem> items;
  
  Order({
    required this.id,
    required this.orderNumber,
    required this.customerName,
    required this.totalAmount,
    required this.status,
    required this.createdAt,
    required this.items,
  });
}

class OrderItem {
  final String id;
  final String productName;
  final int quantity;
  final double price;
  final double subtotal;
  
  OrderItem({
    required this.id,
    required this.productName,
    required this.quantity,
    required this.price,
    required this.subtotal,
  });
}
