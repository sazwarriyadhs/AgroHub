// lib/features/dashboard/models/dashboard_stats.dart

class DashboardStats {
  final double totalRevenue;
  final int totalOrders;
  final int totalProducts;
  final double avgRating;

  DashboardStats({
    this.totalRevenue = 0,
    this.totalOrders = 0,
    this.totalProducts = 0,
    this.avgRating = 0,
  });

  factory DashboardStats.fromJson(Map<String, dynamic> json) {
    return DashboardStats(
      totalRevenue: (json['totalRevenue'] ?? json['total_revenue'] ?? 0).toDouble(),
      totalOrders: json['totalOrders'] ?? json['total_orders'] ?? 0,
      totalProducts: json['totalProducts'] ?? json['total_products'] ?? 0,
      avgRating: (json['avgRating'] ?? json['avg_rating'] ?? 0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'totalRevenue': totalRevenue,
      'totalOrders': totalOrders,
      'totalProducts': totalProducts,
      'avgRating': avgRating,
    };
  }
}