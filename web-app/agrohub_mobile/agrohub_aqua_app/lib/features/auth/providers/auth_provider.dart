// lib/features/auth/providers/auth_provider.dart
import 'package:flutter/material.dart';

class AuthProvider extends ChangeNotifier {
  bool _isAuthenticated = true;
  String? _token;
  Map<String, dynamic>? _user;

  bool get isAuthenticated => _isAuthenticated;
  String? get token => _token;
  Map<String, dynamic>? get user => _user;

  void setAuth(String token, Map<String, dynamic> user) {
    _token = token;
    _user = user;
    _isAuthenticated = true;
    notifyListeners();
  }

  void logout() {
    _token = null;
    _user = null;
    _isAuthenticated = false;
    notifyListeners();
  }
}