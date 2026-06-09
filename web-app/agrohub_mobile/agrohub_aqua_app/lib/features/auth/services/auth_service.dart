// ==========================================================
// LOGIN SERVICE
// lib/features/auth/services/auth_service.dart
// ==========================================================

import 'dart:convert';
import 'package:http/http.dart' as http;

import '../../../core/services/user_session.dart';

class AuthService {
  static const String baseUrl =
      "http://YOUR-IP:8080/api/v1";

  static Future<bool> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse("$baseUrl/auth/login"),
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonEncode({
          "email": email,
          "password": password,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        final user = data['data']['user'];

        UserSession.setUser({
          "id": user["id"],
          "full_name": user["full_name"],
          "username": user["username"],
          "email": user["email"],
          "avatar": user["avatar"],
          "membership_type":
              user["membership_type"] ?? "Gold",
          "membership_code":
              user["membership_code"] ??
                  "AGH-2026-DEMO",
        });

        return true;
      }

      return false;
    } catch (e) {
      return false;
    }
  }
}