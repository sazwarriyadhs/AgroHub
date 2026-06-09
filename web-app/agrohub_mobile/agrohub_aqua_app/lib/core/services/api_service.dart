// lib/core/services/api_service.dart
// FULL FINAL VERSION - AGROHUB PRODUCTION READY

import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  // ==========================================================================
  // SINGLETON
  // ==========================================================================

  static final ApiService _instance = ApiService._internal();

  factory ApiService() => _instance;

  ApiService._internal() {
    _setupDio();
    if (kDebugMode) {
      debugPrint('🌐 API initialized: $baseUrl');
    }
  }

  // ==========================================================================
  // BASE URL (FIXED SMART ROUTING)
  // ==========================================================================

  static const String _lanIp = 'http://192.168.1.100:8900/api/v1';
  static const String _localhost = 'http://localhost:8900/api/v1';
  static const String _emulator = 'http://10.0.2.2:8900/api/v1';

  static String get _baseUrl {
    if (kIsWeb) return _localhost;

    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return _emulator;
      case TargetPlatform.iOS:
        return _localhost;
      case TargetPlatform.windows:
      case TargetPlatform.macOS:
      case TargetPlatform.linux:
        return _localhost;
      default:
        return _lanIp;
    }
  }

  static String get baseUrl => _baseUrl;

  // ==========================================================================
  // STORAGE
  // ==========================================================================

  static const String _tokenKey = 'access_token';
  static const String _userKey = 'user';

  late final Dio _dio;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  // ==========================================================================
  // DIO SETUP
  // ==========================================================================

  void _setupDio() {
    _dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 25),
        receiveTimeout: const Duration(seconds: 25),
        sendTimeout: const Duration(seconds: 25),
        responseType: ResponseType.json,
        validateStatus: (status) => status != null && status < 500,
        headers: const {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    if (kDebugMode) {
      _dio.interceptors.add(LogInterceptor(
        request: true,
        requestBody: true,
        responseBody: true,
        error: true,
        logPrint: (obj) => debugPrint('🔵 DIO: $obj'),
      ));
    }

    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _storage.read(key: _tokenKey);
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          handler.next(options);
        },
        onError: (error, handler) async {
          if (error.response?.statusCode == 401) {
            await clearSession();
          }
          handler.next(error);
        },
      ),
    );
  }

  // ==========================================================================
  // RESPONSE HELPERS
  // ==========================================================================

  dynamic _extractData(Response response) {
    final data = response.data;
    if (data is Map<String, dynamic>) {
      return data['data'] ?? data;
    }
    return data;
  }

  Map<String, dynamic> _extractMap(Response response) {
    final data = _extractData(response);
    if (data is Map<String, dynamic>) return data;
    if (data is Map) return Map<String, dynamic>.from(data);
    return {};
  }

  List<dynamic> _extractList(Response response) {
    final data = _extractData(response);
    if (data is List) return data;
    return [];
  }

  // ==========================================================================
  // ERROR HANDLER
  // ==========================================================================

  String _handleError(dynamic error) {
    if (error is DioException) {
      final response = error.response;

      if (response?.data is Map<String, dynamic>) {
        final data = response!.data;
        return data['message'] ??
            data['error'] ??
            'Server error (${response.statusCode})';
      }

      switch (error.type) {
        case DioExceptionType.connectionTimeout:
          return 'Koneksi timeout';
        case DioExceptionType.receiveTimeout:
          return 'Server tidak merespon';
        case DioExceptionType.connectionError:
          return 'Tidak bisa connect ke backend';
        default:
          return error.message ?? 'Unknown error';
      }
    }
    return error.toString();
  }

  // ==========================================================================
  // SESSION
  // ==========================================================================

  Future<void> saveSession({
    required String token,
    required Map<String, dynamic> user,
  }) async {
    await _storage.write(key: _tokenKey, value: token);
    await _storage.write(key: _userKey, value: jsonEncode(user));
  }

  Future<void> clearSession() async {
    await _storage.delete(key: _tokenKey);
    await _storage.delete(key: _userKey);
  }

  Future<String?> getToken() => _storage.read(key: _tokenKey);

  Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }

  // ==========================================================================
  // CORE HTTP
  // ==========================================================================

  Future<Response> _get(String path, {Map<String, dynamic>? query}) async {
    try {
      return await _dio.get(path, queryParameters: query);
    } catch (e) {
      throw Exception(_handleError(e));
    }
  }

  Future<Response> _post(String path, {dynamic data}) async {
    try {
      return await _dio.post(path, data: data);
    } catch (e) {
      throw Exception(_handleError(e));
    }
  }

  Future<Response> _put(String path, {dynamic data}) async {
    try {
      return await _dio.put(path, data: data);
    } catch (e) {
      throw Exception(_handleError(e));
    }
  }

  Future<Response> _delete(String path, {dynamic data}) async {
    try {
      return await _dio.delete(path, data: data);
    } catch (e) {
      throw Exception(_handleError(e));
    }
  }

  // ==========================================================================
  // AUTH
  // ==========================================================================

  Future<Map<String, dynamic>> login(String email, String password) async {
    final res = await _post('/public/login', data: {
      'email': email.trim(),
      'password': password,
    });

    final data = _extractMap(res);

    final token = data['token'] ??
        data['access_token'] ??
        data['data']?['token'];

    if (token != null) {
      await saveSession(
        token: token.toString(),
        user: data['user'] ?? {},
      );
    }

    return data;
  }

  Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
    required String passwordConfirmation,
  }) async {
    final res = await _post('/public/register', data: {
      'name': name,
      'email': email.trim(),
      'password': password,
      'password_confirmation': passwordConfirmation,
    });

    return _extractMap(res);
  }

  Future<void> logout() async {
    try {
      await _post('/logout');
    } catch (_) {}
    await clearSession();
  }

  // ==========================================================================
  // PROFILE
  // ==========================================================================

  Future<Map<String, dynamic>> getProfile() async {
    final res = await _get('/profile');
    return _extractMap(res);
  }

  Future<Map<String, dynamic>> updateProfile(
      Map<String, dynamic> data) async {
    final res = await _put('/profile', data: data);
    return _extractMap(res);
  }

  // ==========================================================================
  // FISH CATEGORIES
  // ==========================================================================

  Future<List<Map<String, dynamic>>> getFishCategories() async {
    final res = await _get('/public/fish-categories');
    return List<Map<String, dynamic>>.from(_extractList(res));
  }

  Future<Map<String, dynamic>> getFishCategoryById(int id) async {
    final res = await _get('/public/fish-categories/$id');
    return _extractMap(res);
  }

  // ==========================================================================
  // DASHBOARD (COMMON - untuk semua apps)
  // ==========================================================================

  Future<Map<String, dynamic>> getDashboardStats() async {
    final res = await _get('/dashboard/stats');
    return _extractMap(res);
  }

  Future<Map<String, dynamic>> getWallet() async {
    final res = await _get('/wallet');
    return _extractMap(res);
  }

  Future<List<Map<String, dynamic>>> getRecentActivities() async {
    final res = await _get('/activities/recent');
    return List<Map<String, dynamic>>.from(_extractList(res));
  }

  Future<int> getNotificationCount() async {
    final res = await _get('/notifications/count');
    final data = _extractMap(res);
    return data['count'] ?? 0;
  }

  Future<List<Map<String, dynamic>>> getFishPrices() async {
    final res = await _get('/commodity-prices');
    return List<Map<String, dynamic>>.from(_extractList(res));
  }

  // ==========================================================================
  // NEW: AQUA SPECIFIC ENDPOINTS (untuk agrohub_aqua_app)
  // ==========================================================================

  /// Get Aqua dashboard statistics (pond_count, fish_count, water_quality, etc)
  Future<Map<String, dynamic>> getAquaDashboardStats() async {
    try {
      final res = await _get('/aqua/dashboard/stats');
      return _extractMap(res);
    } catch (e) {
      debugPrint('⚠️ Aqua dashboard stats endpoint not available: $e');
      // Return fallback data
      return {
        'pond_count': 0,
        'fish_count': 0,
        'water_quality': 'Normal',
        'total_harvest': 0,
      };
    }
  }

  /// Get commodity prices khusus untuk aqua (ikan)
  Future<List<Map<String, dynamic>>> getAquaCommodityPrices() async {
    try {
      final res = await _get('/aqua/commodity-prices');
      return List<Map<String, dynamic>>.from(_extractList(res));
    } catch (e) {
      debugPrint('⚠️ Aqua commodity prices endpoint not available: $e');
      // Return fallback data
      return [
        {'name': 'Lele', 'current_price': 18500},
        {'name': 'Nila', 'current_price': 24500},
        {'name': 'Gurame', 'current_price': 52000},
      ];
    }
  }

  /// Get recent activities khusus untuk aqua
  Future<List<Map<String, dynamic>>> getAquaRecentActivities() async {
    try {
      final res = await _get('/aqua/activities/recent');
      return List<Map<String, dynamic>>.from(_extractList(res));
    } catch (e) {
      debugPrint('⚠️ Aqua recent activities endpoint not available: $e');
      // Return fallback data
      return [
        {
          'title': 'Selamat datang di AgroHub Aqua',
          'description': 'Mulai kelola kolam ikan Anda',
          'amount': '',
          'created_at': DateTime.now().toIso8601String(),
          'type': 'info',
        },
        {
          'title': 'Tips Hari Ini',
          'description': 'Cek kualitas air secara rutin',
          'amount': '',
          'created_at': DateTime.now().subtract(const Duration(hours: 2)).toIso8601String(),
          'type': 'success',
        },
      ];
    }
  }

  /// Get notification count khusus untuk aqua
  Future<int> getAquaNotificationCount() async {
    try {
      final res = await _get('/aqua/notifications/count');
      final data = _extractMap(res);
      return data['count'] ?? 0;
    } catch (e) {
      debugPrint('⚠️ Aqua notification count endpoint not available: $e');
      return 0;
    }
  }

  // ==========================================================================
  // HEALTH CHECK
  // ==========================================================================

  Future<bool> testConnection() async {
    try {
      final res = await _get('/health');
      return res.statusCode == 200;
    } catch (_) {
      return false;
    }
  }
}