import '../entities/user.dart';

abstract class AuthRepository {
  Future<User?> login(String email, String password);
  
  Future<User?> register({
    required String name,
    required String email,
    required String password,
    required String storeName,
    String? phone,
    String? businessType,
    String? nik,
    String? npwp,
    String? address,
  });
  
  Future<User?> getProfile();
  
  Future<String?> getToken();
  
  Future<bool> isLoggedIn();
  
  Future<void> logout();
}
