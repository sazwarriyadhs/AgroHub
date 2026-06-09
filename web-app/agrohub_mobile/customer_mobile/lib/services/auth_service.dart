import 'package:dio/dio.dart';
import '../config/api_config.dart';
import 'package:agrohub_customer/features/auth/models/user_model.dart';
import 'http_service.dart';

class AuthService {
  static Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await HttpService.post(
        ApiConfig.login,
        data: {
          'email': email,
          'password': password,
        },
      );

      print('📦 Raw response: ${response.data}');

      if (response.statusCode == 200) {
        final data = response.data;
        
        // Handle response structure: data['data'] contains token and user
        final responseData = data['data'] ?? data;
        final token = responseData['token'];
        final userData = responseData['user'] ?? responseData;
        
        print('✅ Token: $token');
        print('✅ User data: $userData');
        
        // Build complete user map with defaults
        Map<String, dynamic> userMap = {};
        if (userData is Map) {
          userMap = Map<String, dynamic>.from(userData);
          
          // Add missing required fields with defaults
          userMap['full_name'] = userMap['name'] ?? userMap['full_name'] ?? userMap['fullName'];
          userMap['total_orders'] = userMap['total_orders'] ?? 0;
          userMap['total_spent'] = (userMap['total_spent'] ?? 0).toDouble();
          userMap['loyalty_points'] = userMap['loyalty_points'] ?? 0;
          userMap['is_verified'] = userMap['is_verified'] ?? false;
          userMap['is_active'] = userMap['is_active'] ?? true;
          userMap['is_verified_seller'] = userMap['is_verified_seller'] ?? false;
          userMap['kyc_status'] = userMap['kyc_status'] ?? 'pending';
          userMap['user_type'] = userMap['role'] ?? userMap['user_type'] ?? 'customer';
          userMap['role'] = userMap['role'] ?? userMap['role_enum'] ?? 'customer';
          userMap['profile_completed'] = userMap['profile_completed'] ?? false;
          userMap['preferred_categories'] = userMap['preferred_categories'] ?? [];
          userMap['marketing_opt_in'] = userMap['marketing_opt_in'] ?? true;
          userMap['preferences'] = userMap['preferences'] ?? {};
          userMap['metadata'] = userMap['metadata'] ?? {};
          userMap['created_at'] = userMap['created_at'] ?? DateTime.now().toIso8601String();
        }
        
        // ✅ PERBAIKAN: Kembalikan Map, BUKAN UserModel
        return {
          'success': true,
          'token': token,
          'user': userMap,  // ← Kembalikan Map, bukan UserModel
        };
      } else {
        return {
          'success': false,
          'message': response.data['message'] ?? 'Login failed',
        };
      }
    } on DioException catch (e) {
      print('❌ DioError: ${e.message}');
      print('❌ Response: ${e.response?.data}');
      return {
        'success': false,
        'message': e.response?.data['message'] ?? e.message ?? 'Network error occurred',
      };
    } catch (e) {
      print('❌ Error: $e');
      return {
        'success': false,
        'message': e.toString(),
      };
    }
  }

  static Future<Map<String, dynamic>> getProfile(String token) async {
    try {
      final response = await HttpService.get(ApiConfig.profile);

      if (response.statusCode == 200) {
        final data = response.data;
        final userData = data['data'] ?? data['user'] ?? data;
        
        Map<String, dynamic> userMap = {};
        if (userData is Map) {
          userMap = Map<String, dynamic>.from(userData);
        }
        
        // ✅ PERBAIKAN: Kembalikan Map, BUKAN UserModel
        return {
          'success': true,
          'user': userMap,  // ← Kembalikan Map, bukan UserModel
        };
      } else {
        return {
          'success': false,
          'message': response.data['message'] ?? 'Failed to load profile',
        };
      }
    } on DioException catch (e) {
      return {
        'success': false,
        'message': e.response?.data['message'] ?? 'Network error occurred',
      };
    }
  }
}