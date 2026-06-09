import 'package:flutter/foundation.dart';
import '../repositories/auth_repository.dart';
import '../entities/user.dart';

class LoginUseCase {
  final AuthRepository repository;
  
  LoginUseCase(this.repository);
  
  Future<User?> execute(String email, String password) async {
    debugPrint('📞 LoginUseCase.execute called');
    final result = await repository.login(email, password);
    debugPrint('📞 Repository returned: ${result != null ? result.email : "null"}');
    return result;
  }
}
