import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class TokenStorage {
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  static const String _tokenKey = 'auth_token';
  static const String _userDataKey = 'user_data';

  // =====================
  // TOKEN
  // =====================

  Future<String?> getToken() async {
    return await _storage.read(key: _tokenKey);
  }

  Future<void> saveToken(String token) async {
    await _storage.write(key: _tokenKey, value: token);
  }

  Future<void> deleteToken() async {
    await _storage.delete(key: _tokenKey);
  }

  // =====================
  // USER DATA (FIXED)
  // =====================

  Future<void> saveUserData(Map<String, dynamic> userData) async {
    await _storage.write(
      key: _userDataKey,
      value: jsonEncode(userData),
    );
  }

  Future<Map<String, dynamic>?> getUserData() async {
    final data = await _storage.read(key: _userDataKey);

    if (data == null || data.isEmpty) return null;

    try {
      return jsonDecode(data) as Map<String, dynamic>;
    } catch (e) {
      return null;
    }
  }

  Future<void> deleteUserData() async {
    await _storage.delete(key: _userDataKey);
  }

  // =====================
  // CLEAR ALL (LOGOUT)
  // =====================

  Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}