class UserModel {
  final int id;
  final String name;
  final String email;
  final String? phone;
  final String? avatar;
  final String? photoUrl;
  final String? address;
  final String? city;
  final String? province;
  final String? postalCode;
  final double? latitude;
  final double? longitude;
  final bool isActive;
  final bool isVerified;
  final bool isVerifiedSeller;
  final String? kycStatus;
  final String userType;
  final String role;
  final String? fullName;
  final DateTime? dateOfBirth;
  final String? gender;
  final bool profileCompleted;
  final List<String> preferredCategories;
  final int totalOrders;
  final double totalSpent;
  final int loyaltyPoints;
  final bool marketingOptIn;
  final String? memberId;
  final int? membershipId;
  final DateTime? membershipExpiry;
  final DateTime createdAt;
  final DateTime? lastLoginAt;
  final DateTime? emailVerifiedAt;
  final String? referralCode;
  final int? referredBy;
  final Map<String, dynamic> preferences;
  final Map<String, dynamic> metadata;
  
  // Additional fields for UI compatibility
  int get cartItemsCount => 0;
  double get availableBalance => 0;
  double get balance => 0;
  double get holdBalance => 0;
  String get walletNumber => '';
  String get defaultAddressLabel => address ?? '';
  String get secondaryAddress => '';
  String get deliveryInstructions => '';

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
    this.avatar,
    this.photoUrl,
    this.address,
    this.city,
    this.province,
    this.postalCode,
    this.latitude,
    this.longitude,
    required this.isActive,
    required this.isVerified,
    required this.isVerifiedSeller,
    this.kycStatus,
    required this.userType,
    required this.role,
    this.fullName,
    this.dateOfBirth,
    this.gender,
    required this.profileCompleted,
    required this.preferredCategories,
    required this.totalOrders,
    required this.totalSpent,
    required this.loyaltyPoints,
    required this.marketingOptIn,
    this.memberId,
    this.membershipId,
    this.membershipExpiry,
    required this.createdAt,
    this.lastLoginAt,
    this.emailVerifiedAt,
    this.referralCode,
    this.referredBy,
    required this.preferences,
    required this.metadata,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'],
      avatar: json['avatar'],
      photoUrl: json['photo_url'],
      address: json['address'],
      city: json['city'],
      province: json['province'],
      postalCode: json['postal_code'],
      latitude: json['latitude'] != null ? (json['latitude'] as num).toDouble() : null,
      longitude: json['longitude'] != null ? (json['longitude'] as num).toDouble() : null,
      isActive: json['is_active'] ?? true,
      isVerified: json['is_verified'] ?? false,
      isVerifiedSeller: json['is_verified_seller'] ?? false,
      kycStatus: json['kyc_status'] ?? 'pending',
      userType: json['user_type'] ?? 'buyer',
      role: json['role'] ?? json['role_enum'] ?? 'farmer',
      fullName: json['full_name'],
      dateOfBirth: json['date_of_birth'] != null ? DateTime.parse(json['date_of_birth']) : null,
      gender: json['gender'],
      profileCompleted: json['profile_completed'] ?? false,
      preferredCategories: json['preferred_categories'] != null 
          ? List<String>.from(json['preferred_categories'] as List) 
          : [],
      totalOrders: json['total_orders'] ?? 0,
      totalSpent: (json['total_spent'] ?? 0).toDouble(),
      loyaltyPoints: json['loyalty_points'] ?? 0,
      marketingOptIn: json['marketing_opt_in'] ?? true,
      memberId: json['member_id'],
      membershipId: json['membership_id'],
      membershipExpiry: json['membership_expiry'] != null 
          ? DateTime.parse(json['membership_expiry']) 
          : null,
      createdAt: json['created_at'] != null 
          ? DateTime.parse(json['created_at']) 
          : DateTime.now(),
      lastLoginAt: json['last_login_at'] != null 
          ? DateTime.parse(json['last_login_at']) 
          : null,
      emailVerifiedAt: json['email_verified_at'] != null 
          ? DateTime.parse(json['email_verified_at']) 
          : null,
      referralCode: json['referral_code'],
      referredBy: json['referred_by'],
      preferences: json['preferences'] != null 
          ? Map<String, dynamic>.from(json['preferences'] as Map) 
          : {},
      metadata: json['metadata'] != null 
          ? Map<String, dynamic>.from(json['metadata'] as Map) 
          : {},
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'avatar': avatar,
      'photo_url': photoUrl,
      'address': address,
      'city': city,
      'province': province,
      'postal_code': postalCode,
      'latitude': latitude,
      'longitude': longitude,
      'is_active': isActive,
      'is_verified': isVerified,
      'is_verified_seller': isVerifiedSeller,
      'kyc_status': kycStatus,
      'user_type': userType,
      'role': role,
      'full_name': fullName,
      'date_of_birth': dateOfBirth?.toIso8601String(),
      'gender': gender,
      'profile_completed': profileCompleted,
      'preferred_categories': preferredCategories,
      'total_orders': totalOrders,
      'total_spent': totalSpent,
      'loyalty_points': loyaltyPoints,
      'marketing_opt_in': marketingOptIn,
      'member_id': memberId,
      'membership_id': membershipId,
      'membership_expiry': membershipExpiry?.toIso8601String(),
      'created_at': createdAt.toIso8601String(),
      'last_login_at': lastLoginAt?.toIso8601String(),
      'email_verified_at': emailVerifiedAt?.toIso8601String(),
      'referral_code': referralCode,
      'referred_by': referredBy,
      'preferences': preferences,
      'metadata': metadata,
    };
  }

  // Helper getters untuk UI
  String get displayName => fullName ?? name;
  
  // Alias for createdAt (for compatibility)
  DateTime get userCreatedAt => createdAt;
  
  String get membershipTier {
    if (loyaltyPoints >= 2000) return 'platinum';
    if (loyaltyPoints >= 1000) return 'gold';
    if (loyaltyPoints >= 500) return 'silver';
    return 'bronze';
  }
  
  String get formattedAddress {
    final parts = [address, city, province].where((p) => p != null && p.isNotEmpty);
    return parts.isNotEmpty ? parts.join(', ') : 'Alamat belum diisi';
  }
  
  // Helper untuk mendapatkan benefit berdasarkan tier
  List<String> getMemberBenefits() {
    switch (membershipTier) {
      case 'platinum':
        return ['Diskon 15%', 'Free Ongkir Unlimited', 'VIP Support', 'Undangan Event Khusus'];
      case 'gold':
        return ['Diskon 10%', 'Free Ongkir 5x/bulan', 'Prioritas Customer Service', 'Akses Eksklusif'];
      case 'silver':
        return ['Poin Setiap Belanja', 'Akses Flash Sale', 'Diskon 5%'];
      default:
        return ['Poin Setiap Belanja', 'Akses Flash Sale'];
    }
  }
}