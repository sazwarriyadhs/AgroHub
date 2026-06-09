// lib/core/services/api_service.dart
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:shared_preferences/shared_preferences.dart';

// ✅ IMPORT MODELS
import '../../features/sell/models/product_category.dart';
import '../../features/sell/models/commodity_type.dart';
import '../../features/sell/models/price_suggestion.dart';
import '../../features/buy/models/vendor_product.dart';
import '../../features/profile/models/profile_model.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:8900';
  
  final http.Client _client = http.Client();
  String? _cachedToken;
  Function? onUnauthorized;

  // ==================== TOKEN MANAGEMENT ====================
  
  Future<String?> _getToken() async {
    try {
      if (_cachedToken != null && _cachedToken!.isNotEmpty) {
        return _cachedToken;
      }
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      if (token != null && token.isNotEmpty) {
        _cachedToken = token;
      }
      return token;
    } catch (e) {
      return null;
    }
  }

  Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
    _cachedToken = token;
  }

  Future<void> _clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    _cachedToken = null;
  }

  // ==================== HELPER METHODS ====================
  
  int _parseToInt(dynamic value) {
    if (value == null) return 0;
    if (value is int) return value;
    if (value is String) return int.tryParse(value) ?? 0;
    if (value is double) return value.toInt();
    return 0;
  }

  Map<String, dynamic> _toMap(Map<dynamic, dynamic> map) {
    return Map<String, dynamic>.from(map);
  }

  // ==================== GENERIC METHODS ====================
  
  Future<Map<String, dynamic>> get(String endpoint) async {
    try {
      final token = await _getToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'unauthorized': true, 'data': {}};
      }

      final response = await _client.get(
        Uri.parse('$baseUrl/api/v1$endpoint'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 401) {
        await _clearToken();
        return {'success': false, 'unauthorized': true, 'data': {}};
      }

      final body = response.body;
      if (body.isEmpty) return {'success': false, 'data': []};
      
      final decoded = jsonDecode(body);
      if (decoded is Map<String, dynamic>) return decoded;
      if (decoded is Map) return _toMap(decoded);
      return {'success': true, 'data': decoded};
    } catch (e) {
      return {'success': false, 'data': [], 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> post(String endpoint, {Map<String, dynamic>? body}) async {
    try {
      final token = await _getToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'unauthorized': true};
      }
      
      final response = await _client.post(
        Uri.parse('$baseUrl/api/v1$endpoint'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: body != null ? jsonEncode(body) : null,
      );
      
      if (response.statusCode == 401) {
        await _clearToken();
        return {'success': false, 'unauthorized': true};
      }
      
      final responseBody = response.body;
      if (responseBody.isEmpty) return {'success': false};
      
      final decoded = jsonDecode(responseBody);
      if (decoded is Map<String, dynamic>) return decoded;
      if (decoded is Map) return _toMap(decoded);
      return {'success': true, 'data': decoded};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  // ==================== AUTH METHODS ====================
  
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await _client.post(
        Uri.parse('$baseUrl/api/v1/public/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );
      
      final decoded = jsonDecode(response.body);
      final data = (decoded is Map) ? _toMap(decoded) : {'success': false};
      
      if (response.statusCode == 200) {
        String? token = data['data']?['token'] ?? data['token'] ?? data['access_token'];
        if (token != null && token.isNotEmpty) {
          await _saveToken(token);
        }
      }
      
      return {...data, 'success': response.statusCode == 200};
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  Future<void> logout() async {
    await _clearToken();
  }
  
  Future<bool> isLoggedIn() async {
    final token = await _getToken();
    return token != null && token.isNotEmpty;
  }

  void dispose() {
    _client.close();
  }

  // ==================== PROFILE METHODS ====================
  
  Future<Map<String, dynamic>> getProfile() async {
    final response = await get('/profile');
    if (response['data'] != null) {
      return response;
    }
    return {'data': _getDefaultProfile()};
  }

  Future<Map<String, dynamic>> updateProfile(Map<String, dynamic> profileData) async {
    return await post('/profile/update', body: profileData);
  }

  // ==================== WALLET METHODS ====================
  
  Future<Map<String, dynamic>> getWallet() async {
    final response = await get('/wallet');
    if (response['data'] != null) {
      return response;
    }
    return {'data': {'balance': 0}};
  }

  // ==================== DASHBOARD METHODS ====================
  
  Future<Map<String, dynamic>> getDashboardStats() async {
    final response = await get('/dashboard/stats');
    if (response['data'] != null) {
      return response;
    }
    return {'data': {'totalRevenue': 0, 'activeOrders': 0, 'pendingTasks': 0}};
  }

  Future<List<Map<String, dynamic>>> getMarketPrices() async {
    final response = await get('/public/commodity-prices');
    final data = response['data'];
    if (data is List) return List<Map<String, dynamic>>.from(data);
    return _getFallbackMarketPrices();
  }

  Future<List<Map<String, dynamic>>> getMyCrops() async {
    final response = await get('/farm/products');
    final data = response['data'];
    if (data is List) return List<Map<String, dynamic>>.from(data);
    return [];
  }

  Future<List<Map<String, dynamic>>> getFarmTasks() async {
    final response = await get('/farm/tasks');
    final data = response['data'];
    if (data is List) return List<Map<String, dynamic>>.from(data);
    return [];
  }

  // ==================== SELL MODULE ====================
  
  Future<List<ProductCategory>> getProductCategories() async {
    final response = await get('/products/categories');
    final data = response['data'] ?? [];
    if (data is! List) return [];
    return data.map((json) => ProductCategory.fromJson(_toMap(json))).toList();
  }

  Future<List<CommodityType>> getCommodityTypes(int categoryId) async {
    final response = await get('/commodities/types?category_id=$categoryId');
    final data = response['data'] ?? [];
    if (data is! List) return [];
    return data.map((json) => CommodityType.fromJson(_toMap(json))).toList();
  }

  Future<PriceSuggestion?> getPriceSuggestion(int commodityId) async {
    final response = await get('/ai/price-suggestion?commodity_id=$commodityId');
    final data = response['data'] ?? response;
    if (data is Map && data.isNotEmpty) {
      return PriceSuggestion.fromJson(_toMap(data));
    }
    return null;
  }

  Future<Map<String, dynamic>> sellProduct(Map<String, dynamic> data) async {
    return await post('/products/sell', body: data);
  }

  // ==================== FILE UPLOAD ====================
  
  Future<Map<String, dynamic>> uploadFile(File file) async {
    try {
      final token = await _getToken();
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/api/v1/upload'),
      );
      if (token != null) {
        request.headers['Authorization'] = 'Bearer $token';
      }
      request.files.add(await http.MultipartFile.fromPath(
        'file',
        file.path,
        contentType: MediaType('image', 'jpeg'),
      ));
      final streamed = await request.send();
      final response = await http.Response.fromStream(streamed);
      if (response.body.isEmpty) {
        return {'success': false};
      }
      final decoded = jsonDecode(response.body);
      if (decoded is Map) return _toMap(decoded);
      return {'success': true, 'data': decoded};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  // ==================== BUY MODULE ====================
  
  Future<List<CommodityType>> getFarmProducts() async {
    final response = await get('/farm/products');
    final data = response['data'] ?? [];
    if (data is! List) return [];
    return data.map((json) => CommodityType.fromJson(_toMap(json))).toList();
  }

  Future<List<VendorProduct>> getVendorProducts() async {
    final response = await get('/vendor/products');
    final data = response['data'] ?? [];
    if (data is! List) return [];
    return data.map((json) => VendorProduct.fromJson(_toMap(json))).toList();
  }

  // ==================== CART MODULE ====================
  
  Future<Map<String, dynamic>> addToCart({
    required int productId,
    required int quantity,
    required double price,
    String? productType,
  }) async {
    return await post('/cart/add', body: {
      'product_id': productId,
      'quantity': quantity,
      'price': price,
      'product_type': productType ?? 'farm',
    });
  }

  Future<Map<String, dynamic>> getCart() async {
    final response = await get('/cart');
    return response;
  }

  Future<Map<String, dynamic>> removeFromCart(int itemId) async {
    return await post('/cart/remove', body: {'item_id': itemId});
  }

  Future<Map<String, dynamic>> createOrder(Map<String, dynamic> data) async {
    return await post('/orders/create', body: data);
  }

  Future<List<dynamic>> getOrders() async {
    final response = await get('/orders');
    final data = response['data'];
    if (data is List) return data;
    return [];
  }

  // ==================== NOTIFICATION ====================
  
  Future<Map<String, dynamic>> getNotifications() async {
    final response = await get('/notifications');
    return response;
  }

  Future<int> getNotificationCount() async {
    final response = await get('/notifications/count');
    return response['count'] ?? 0;
  }

  // ==================== DEFAULT PROFILE ====================
  
  Map<String, dynamic> _getDefaultProfile() {
    return {
      'id': 1,
      'name': 'Rudi Hartono',
      'email': 'petani.baru@agrohub.com',
      'phone': '08123456789',
      'farmName': 'Kebun Makmur',
      'farmType': 'crop',
      'province': 'Jawa Barat',
      'city': 'Bandung',
      'landArea': 2.5,
      'verificationStatus': 'verified',
      'createdAt': DateTime.now().toIso8601String(),
    };
  }

  // ==================== FALLBACK DATA ====================
  
  List<Map<String, dynamic>> _getFallbackMarketPrices() {
    return [
      {'commodity': 'Padi GKP', 'price': 6200, 'change': 2.35, 'unit': 'kg'},
      {'commodity': 'Jagung Pipil', 'price': 5150, 'change': 1.80, 'unit': 'kg'},
      {'commodity': 'Cabai Merah', 'price': 28000, 'change': -1.20, 'unit': 'kg'},
      {'commodity': 'Bawang Merah', 'price': 32000, 'change': 0.75, 'unit': 'kg'},
    ];
  }
}