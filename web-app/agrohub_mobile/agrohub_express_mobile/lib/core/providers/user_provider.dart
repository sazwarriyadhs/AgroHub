import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class UserProvider with ChangeNotifier {
  String? _token;
  bool _isLoading = false;
  Map<String, dynamic>? _driverProfile;

  String? get token => _token;
  bool get isLoading => _isLoading;
  Map<String, dynamic>? get driverProfile => _driverProfile;
  bool get isAuthenticated => _token != null;

  // Fungsi penanganan login utama ke API backend Go
  Future<Map<String, dynamic>> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    // Gunakan 'http://10.0.2.2:8900' jika kamu menguji menggunakan Emulator Android bawaan
    final url = Uri.parse('http://localhost:8900/api/v1/public/login');

    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      final Map<String, dynamic> responseData = jsonDecode(response.body);

      if (response.statusCode == 200) {
        _token = responseData['token'];
        
        // Simpan data user jika backend langsung mengembalikan payload user
        _driverProfile = responseData['user']; 
        
        _isLoading = false;
        notifyListeners();
        
        return {'success': true, 'message': 'Login berhasil'};
      } else {
        _isLoading = false;
        notifyListeners();
        return {'success': false, 'message': responseData['error'] ?? 'Login gagal'};
      }
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      return {'success': false, 'message': 'Tidak dapat terhubung ke server: $e'};
    }
  }

  // Fungsi logout untuk menghapus session token
  void logout() {
    _token = null;
    _driverProfile = null;
    notifyListeners();
  }
}
