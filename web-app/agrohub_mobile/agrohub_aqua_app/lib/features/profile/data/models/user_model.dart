// lib/features/profile/data/models/user_model.dart
import '../../domain/entities/user_entity.dart';

class UserModel extends UserEntity {
  const UserModel({
    required super.id,
    required super.fullName,
    required super.email,
    super.username,
    super.phone,
    super.role,
    super.avatar,
    super.farmName,
    super.farmSize,
    super.farmAddress,
    super.farmType,
    super.farmingExperienceYears,
    super.membershipType,
    super.membershipCode,
    super.loyaltyPoints,
    super.address,
    super.city,
    super.province,
    super.isVerified,
    super.createdAt,
    super.updatedAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id']?.toString() ?? '',
      fullName: json['full_name'] ?? json['name'] ?? '',
      email: json['email'] ?? '',
      username: json['username'],
      phone: json['phone'],
      role: json['role'],
      avatar: json['avatar'],
      farmName: json['farm_name'],
      farmSize: json['farm_size'] != null ? double.tryParse(json['farm_size'].toString()) : null,
      farmAddress: json['farm_address'],
      farmType: json['farm_type'],
      farmingExperienceYears: json['farming_experience_years'] != null ? int.tryParse(json['farming_experience_years'].toString()) : null,
      membershipType: json['membership_type'],
      membershipCode: json['membership_code'],
      loyaltyPoints: json['loyalty_points'] != null ? int.tryParse(json['loyalty_points'].toString()) : null,
      address: json['address'],
      city: json['city'],
      province: json['province'],
      isVerified: json['is_verified'],
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at']) : null,
      updatedAt: json['updated_at'] != null ? DateTime.tryParse(json['updated_at']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'full_name': fullName,
      'email': email,
      'username': username,
      'phone': phone,
      'role': role,
      'avatar': avatar,
      'farm_name': farmName,
      'farm_size': farmSize,
      'farm_address': farmAddress,
      'farm_type': farmType,
      'farming_experience_years': farmingExperienceYears,
      'membership_type': membershipType,
      'membership_code': membershipCode,
      'loyalty_points': loyaltyPoints,
      'address': address,
      'city': city,
      'province': province,
      'is_verified': isVerified,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }
}
