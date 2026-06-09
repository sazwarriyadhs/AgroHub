import 'package:equatable/equatable.dart';

class User extends Equatable {
  final int id;
  final String name;
  final String email;
  final String? phone;
  final String? storeName;
  final String? avatar;
  final String role;
  final bool isVerified;
  final String token;

  const User({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
    this.storeName,
    this.avatar,
    required this.role,
    this.isVerified = false,
    required this.token,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    final userData = json['data']?['user'] ?? json;
    
    return User(
      id: userData['id'] ?? 0,
      name: userData['name'] ?? '',
      email: userData['email'] ?? '',
      phone: userData['phone'],
      storeName: userData['store_name'] ?? userData['storeName'],
      avatar: userData['avatar'],
      role: userData['role'] ?? 'vendor',
      isVerified: userData['is_verified'] ?? false,
      token: json['data']?['token'] ?? json['token'] ?? '',
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

  @override
  List<Object?> get props => [
    id, name, email, phone, storeName, avatar, role, isVerified, token
  ];
}
