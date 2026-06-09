// lib/features/auth/services/auth_service.dart
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  static const String _tokenKey = 'auth_token';
  static const String _userIdKey = 'user_id';
  static const String _userRoleKey = 'user_role';

  Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  Future<void> saveUserId(String userId) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userIdKey, userId);
  }

  Future<String?> getUserId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_userIdKey);
  }

  Future<void> saveUserRole(String role) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userRoleKey, role);
  }

  Future<String?> getUserRole() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_userRoleKey);
  }

  Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_userIdKey);
    await prefs.remove(_userRoleKey);
  }

  Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }

  Future<UserData?> getCurrentUser() async {
    // Return dummy user
    return UserData(
      name: 'Budi Santoso',
      role: 'Driver',
      rating: '4.9',
      totalReviews: '128',
      isOnline: true,
      avatarUrl: '',
    );
  }

  Future<BrandConfig?> getBranding() async {
    return BrandConfig(
      headerImageUrl: '',
      logoUrl: '',
    );
  }
}

// Simple classes
class UserData {
  final String name;
  final String role;
  final String rating;
  final String totalReviews;
  final bool isOnline;
  final String avatarUrl;

  UserData({
    required this.name,
    required this.role,
    required this.rating,
    required this.totalReviews,
    required this.isOnline,
    required this.avatarUrl,
  });
}

class BrandConfig {
  final String headerImageUrl;
  final String logoUrl;

  BrandConfig({
    required this.headerImageUrl,
    required this.logoUrl,
  });
}
