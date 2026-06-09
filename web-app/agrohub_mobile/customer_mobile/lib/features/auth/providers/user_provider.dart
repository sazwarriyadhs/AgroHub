import 'dart:convert'; // Untuk jsonDecode dan jsonEncode
import 'package:shared_preferences/shared_preferences.dart'; // Untuk SharedPreferences
import 'package:flutter/material.dart';
// GANTI IMPORT YANG MERAH DENGAN JALUR ABSOLUT INI:
import 'package:agrohub_customer/services/auth_service.dart';
import 'package:agrohub_customer/services/http_service.dart';
import 'package:agrohub_customer/features/auth/models/user_model.dart';

class UserProvider extends ChangeNotifier {
  UserModel? _user;
  String? _token;
  bool _isLoading = false;
  String? _error;

  UserModel? get user => _user;
  String? get token => _token;
  bool get isLoading => _isLoading;
  String? get error => _error;

  bool get isLoggedIn => _token != null && _user != null;

  String get username => _user?.fullName ?? _user?.name ?? 'Guest';
  String get email => _user?.email ?? '';
  int get cartItemCount => _user?.cartItemsCount ?? 0;
  String get membershipTier => _user?.membershipTier ?? 'bronze';
  int get loyaltyPoints => _user?.loyaltyPoints ?? 0;
  double get totalSpent => _user?.totalSpent ?? 0;
  int get totalOrders => _user?.totalOrders ?? 0;
  double get balance => _user?.availableBalance ?? 0;

  double get pointsProgress {
    if (_user == null) return 0.0;

    switch (_user!.membershipTier.toLowerCase()) {
      case 'bronze':
        return (_user!.loyaltyPoints / 500).clamp(0.0, 1.0);
      case 'silver':
        return ((_user!.loyaltyPoints - 500) / 500).clamp(0.0, 1.0);
      case 'gold':
        return ((_user!.loyaltyPoints - 1000) / 1000).clamp(0.0, 1.0);
      default:
        return 1.0;
    }
  }

  String get pointsText {
    if (_user == null) return '0 / 500 points';

    switch (_user!.membershipTier.toLowerCase()) {
      case 'bronze':
        return '${_user!.loyaltyPoints} / 500 points';
      case 'silver':
        final toGold = 1000 - _user!.loyaltyPoints;
        return '$toGold points to Gold';
      case 'gold':
        final toPlatinum = 2000 - _user!.loyaltyPoints;
        return '$toPlatinum points to Platinum';
      default:
        return '${_user!.loyaltyPoints} points';
    }
  }

  UserProvider() {
    HttpService.init();
    _loadSavedData();
  }

  Future<void> loadSavedAuth() async {
    await _loadSavedData();
  }

  Future<void> _loadSavedData() async {
    try {
      final prefs = await SharedPreferences.getInstance();

      _token = prefs.getString('auth_token');

      final userData = prefs.getString('user_data');
      if (userData != null) {
        _user = UserModel.fromJson(jsonDecode(userData));
      }

      notifyListeners();

      if (_token != null && _user == null) {
        await fetchUserProfile();
      }
    } catch (e) {
      _error = 'Failed to load saved session';
      notifyListeners();
    }
  }

  Future<bool> fetchUserProfile() async {
    if (_token == null) return false;

    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await AuthService.getProfile(_token!);

      if (response['success'] == true) {
        final userJson = response['user'];

        _user = UserModel.fromJson(userJson);

        await _saveUserData();

        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = response['message'] ?? 'Failed to fetch profile';
      }
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<void> _saveUserData() async {
    if (_user == null) return;

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
      'user_data',
      jsonEncode(_user!.toJson()),
    );
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await AuthService.login(email, password);

      if (result['success'] == true) {
        _token = result['token'];
        _user = UserModel.fromJson(result['user']);

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', _token!);
        await _saveUserData();

        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = result['message'] ?? 'Login failed';
      }
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<void> logout() async {
    _token = null;
    _user = null;
    _error = null;

    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    await prefs.remove('user_data');

    notifyListeners();
  }

  Future<void> refreshUserData() async {
    await fetchUserProfile();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}