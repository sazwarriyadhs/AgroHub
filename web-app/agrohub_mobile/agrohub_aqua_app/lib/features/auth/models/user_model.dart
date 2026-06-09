// lib/features/auth/models/user_model.dart
class UserModel {
  final int id;
  final String? name;
  final String? fullName;
  final String? email;
  final String? phone;
  final String? role;
  final String? address;
  final String? city;
  final String? province;
  final bool? isActive;
  final DateTime? createdAt;

  UserModel({
    required this.id,
    this.name,
    this.fullName,
    this.email,
    this.phone,
    this.role,
    this.address,
    this.city,
    this.province,
    this.isActive,
    this.createdAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? 0,
      name: json['name'],
      fullName: json['full_name'] ?? json['name'],
      email: json['email'],
      phone: json['phone'],
      role: json['role'],
      address: json['address'],
      city: json['city'],
      province: json['province'],
      isActive: json['is_active'],
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
    );
  }
}