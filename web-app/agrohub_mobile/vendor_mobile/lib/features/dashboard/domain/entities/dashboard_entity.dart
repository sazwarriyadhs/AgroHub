// dashboard_entity.dart
class DashboardStats {
  final int totalOrders;
  final int pendingOrders;
  final int completedOrders;
  final double totalRevenue;
  final double todayRevenue;
  final int totalProducts;
  final int lowStockProducts;
  final double averageRating;
  
  DashboardStats({
    required this.totalOrders,
    required this.pendingOrders,
    required this.completedOrders,
    required this.totalRevenue,
    required this.todayRevenue,
    required this.totalProducts,
    required this.lowStockProducts,
    required this.averageRating,
  });
}

class RecentActivity {
  final String id;
  final String type;
  final String title;
  final String message;
  final DateTime timestamp;
  final String? orderId;
  
  RecentActivity({
    required this.id,
    required this.type,
    required this.title,
    required this.message,
    required this.timestamp,
    this.orderId,
  });
}
