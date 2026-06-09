// lib/features/profile/models/membership_model.dart
class MembershipModel {
  final int id;
  final int? userId;
  final num? price;
  final num? adminFee;
  final num? withdrawLimit;
  final String? status;
  final DateTime? expiredAt;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final int? maxProducts;
  final int? commissionFee;
  final bool? featuredStore;
  final bool? prioritySupport;
  final List<String>? benefits;
  final bool? isActive;
  final String? membershipCode;
  final int? points;

  MembershipModel({
    required this.id,
    this.userId,
    this.price,
    this.adminFee,
    this.withdrawLimit,
    this.status,
    this.expiredAt,
    this.createdAt,
    this.updatedAt,
    this.maxProducts,
    this.commissionFee,
    this.featuredStore,
    this.prioritySupport,
    this.benefits,
    this.isActive,
    this.membershipCode,
    this.points,
  });

  // Helper untuk mendapatkan level berdasarkan poin
  String get membershipType {
    final pointValue = points ?? 0;
    if (pointValue >= 5000) return 'Platinum';
    if (pointValue >= 2000) return 'Gold';
    if (pointValue >= 500) return 'Silver';
    return 'Bronze';
  }

  // Helper untuk mendapatkan nama plan
  String get planName {
    if (membershipCode?.contains('PREMIUM') == true) return 'Premium';
    if (membershipCode?.contains('GOLD') == true) return 'Gold Member';
    return 'Standard Member';
  }

  factory MembershipModel.fromJson(Map<String, dynamic> json) {
    return MembershipModel(
      id: json['id'] ?? 0,
      userId: json['user_id'],
      price: json['price'] is String ? num.tryParse(json['price']) : json['price'],
      adminFee: json['admin_fee'] is String ? num.tryParse(json['admin_fee']) : json['admin_fee'],
      withdrawLimit: json['withdraw_limit'] is String 
          ? num.tryParse(json['withdraw_limit']) 
          : json['withdraw_limit'],
      status: json['status'],
      expiredAt: json['expired_at'] != null ? DateTime.parse(json['expired_at']) : null,
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
      updatedAt: json['updated_at'] != null ? DateTime.parse(json['updated_at']) : null,
      maxProducts: json['max_products'],
      commissionFee: json['commission_fee'],
      featuredStore: json['featured_store'],
      prioritySupport: json['priority_support'],
      benefits: json['benefits'] != null ? List<String>.from(json['benefits']) : null,
      isActive: json['is_active'],
      membershipCode: json['membership_code'],
      points: json['points'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'price': price,
      'admin_fee': adminFee,
      'withdraw_limit': withdrawLimit,
      'status': status,
      'expired_at': expiredAt?.toIso8601String(),
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
      'max_products': maxProducts,
      'commission_fee': commissionFee,
      'featured_store': featuredStore,
      'priority_support': prioritySupport,
      'benefits': benefits,
      'is_active': isActive,
      'membership_code': membershipCode,
      'points': points,
    };
  }
}