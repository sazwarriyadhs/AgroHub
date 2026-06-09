// lib/core/services/token_storage.dart

import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

class TokenStorage {
  static final TokenStorage _instance =
      TokenStorage._internal();

  factory TokenStorage() => _instance;

  TokenStorage._internal();

  static const String _accessTokenKey =
      'access_token';

  static const String _refreshTokenKey =
      'refresh_token';

  static const String _userKey =
      'user_data';

  // ==========================================
  // TOKEN
  // ==========================================

  Future<void> saveToken(String token) async {
    final prefs =
        await SharedPreferences.getInstance();

    await prefs.setString(
      _accessTokenKey,
      token,
    );
  }

  Future<void> saveTokens(
    String accessToken,
    String refreshToken,
  ) async {
    final prefs =
        await SharedPreferences.getInstance();

    await prefs.setString(
      _accessTokenKey,
      accessToken,
    );

    await prefs.setString(
      _refreshTokenKey,
      refreshToken,
    );
  }

  Future<String?> getToken() async {
    final prefs =
        await SharedPreferences.getInstance();

    return prefs.getString(
      _accessTokenKey,
    );
  }

  Future<String?> getAccessToken() async {
    return getToken();
  }

  Future<String?> getRefreshToken() async {
    final prefs =
        await SharedPreferences.getInstance();

    return prefs.getString(
      _refreshTokenKey,
    );
  }

  Future<bool> hasToken() async {
    final token = await getToken();

    return token != null &&
        token.isNotEmpty;
  }

  // ==========================================
  // USER
  // ==========================================

  Future<void> saveUser(
    dynamic user,
  ) async {
    final prefs =
        await SharedPreferences.getInstance();

    if (user == null) return;

    if (user is String) {
      await prefs.setString(
        _userKey,
        user,
      );

      return;
    }

    try {
      await prefs.setString(
        _userKey,
        jsonEncode(user),
      );
    } catch (_) {
      await prefs.setString(
        _userKey,
        user.toString(),
      );
    }
  }

  Future<dynamic> getUser() async {
    final prefs =
        await SharedPreferences.getInstance();

    final raw =
        prefs.getString(_userKey);

    if (raw == null) return null;

    try {
      return jsonDecode(raw);
    } catch (_) {
      return raw;
    }
  }

  // ==========================================
  // CLEAR
  // ==========================================

  Future<void> clearTokens() async {
    final prefs =
        await SharedPreferences.getInstance();

    await prefs.remove(
      _accessTokenKey,
    );

    await prefs.remove(
      _refreshTokenKey,
    );
  }

  Future<void> clearAll() async {
    final prefs =
        await SharedPreferences.getInstance();

    await prefs.remove(
      _accessTokenKey,
    );

    await prefs.remove(
      _refreshTokenKey,
    );

    await prefs.remove(
      _userKey,
    );
  }
}