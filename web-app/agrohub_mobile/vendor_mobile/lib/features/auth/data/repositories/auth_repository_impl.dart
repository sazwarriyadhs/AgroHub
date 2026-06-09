import '../../../../core/services/api_client.dart';
import '../../../../core/services/token_storage.dart';

import '../../domain/repositories/auth_repository.dart';
import '../models/user_model.dart';

class AuthRepositoryImpl implements AuthRepository {
  final ApiClient apiClient;
  final TokenStorage tokenStorage;

  AuthRepositoryImpl(
    this.apiClient,
    this.tokenStorage,
  );

  // ==========================================
  // LOGIN
  // ==========================================

  @override
  Future<UserModel?> login(
    String email,
    String password,
  ) async {
    final response = await apiClient.post(
      '/public/login',
      data: {
        'email': email,
        'password': password,
      },
    );

    final data =
        Map<String, dynamic>.from(
      response['data'] ?? {},
    );

    final userMap =
        Map<String, dynamic>.from(
      data['user'] ?? {},
    );

    final token =
        data['token'] ?? '';

    userMap['token'] = token;

    await tokenStorage.saveToken(
      token,
    );

    await tokenStorage.saveUser(
      userMap,
    );

    apiClient.setAuthToken(
      token,
    );

    return UserModel.fromJson(
      userMap,
    );
  }

  // ==========================================
  // REGISTER
  // ==========================================

  @override
  Future<UserModel?> register({
    required String name,
    required String email,
    required String password,
    required String storeName,
    String? phone,
    String? businessType,
    String? nik,
    String? npwp,
    String? address,
  }) async {
    final response = await apiClient.post(
      '/public/register',
      data: {
        'name': name,
        'email': email,
        'password': password,
        'store_name': storeName,
        'phone': phone,
        'business_type': businessType,
        'nik': nik,
        'npwp': npwp,
        'address': address,
      },
    );

    final data =
        Map<String, dynamic>.from(
      response['data'] ?? {},
    );

    return UserModel.fromJson(
      data,
    );
  }

  // ==========================================
  // PROFILE
  // ==========================================

  @override
  Future<UserModel?> getProfile() async {
    try {
      final cachedUser =
          await tokenStorage.getUser();

      if (cachedUser != null) {
        return UserModel.fromJson(
          Map<String, dynamic>.from(
            cachedUser,
          ),
        );
      }

      final response =
          await apiClient.get(
        '/profile',
      );

      final data =
          Map<String, dynamic>.from(
        response['data'] ?? {},
      );

      await tokenStorage.saveUser(
        data,
      );

      return UserModel.fromJson(
        data,
      );
    } catch (_) {
      return null;
    }
  }

  // ==========================================
  // TOKEN
  // ==========================================

  @override
  Future<String?> getToken() async {
    return tokenStorage.getToken();
  }

  @override
  Future<bool> isLoggedIn() async {
    return tokenStorage.hasToken();
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  @override
  Future<void> logout() async {
    try {
      await apiClient.post(
        '/logout',
      );
    } catch (_) {}

    await tokenStorage.clearAll();

    apiClient.clearAuthToken();
  }
}