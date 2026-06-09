import '../../domain/entities/user.dart';

class UserModel extends User {
  const UserModel({
    required super.id,
    required super.name,
    required super.email,
    super.phone,
    super.storeName,
    super.avatar,
    required super.role,
    super.isVerified,
    required super.token,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    print('📦 Parsing user from JSON: $json');
    
    final token = json['token'] ?? '';
    print('🔑 Token found: ${token.isNotEmpty ? token.substring(0, 20) + "..." : "EMPTY"}');
    
    return UserModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'],
      storeName: json['store_name'] ?? json['storeName'],
      avatar: json['avatar'],
      role: json['role'] ?? 'vendor',
      isVerified: json['is_verified'] ?? false,
      token: token,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'store_name': storeName,
      'avatar': avatar,
      'role': role,
      'is_verified': isVerified,
      'token': token,
    };
  }
}
