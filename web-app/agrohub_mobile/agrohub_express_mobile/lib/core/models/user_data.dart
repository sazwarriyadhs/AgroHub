// core/models/user_data.dart
class UserData {
  final String id;
  final String name;
  final String role;
  final String rating;
  final String totalReviews;
  final bool isOnline;
  final String avatarUrl;
  final String email;
  final String phone;

  const UserData({
    required this.id,
    required this.name,
    required this.role,
    required this.rating,
    required this.totalReviews,
    required this.isOnline,
    required this.avatarUrl,
    required this.email,
    required this.phone,
  });

  factory UserData.fromJson(Map<String, dynamic> json) {
    return UserData(
      id: json['id'] ?? '',
      name: json['name'] ?? 'User',
      role: json['role'] ?? 'Driver',
      rating: json['rating']?.toString() ?? '4.9',
      totalReviews: json['total_reviews']?.toString() ?? '0',
      isOnline: json['is_online'] ?? true,
      avatarUrl: json['avatar_url'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
    );
  }
}
