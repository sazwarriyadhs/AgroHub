import '../repositories/auth_repository.dart';
import '../entities/user.dart';

class RegisterUseCase {
  final AuthRepository repository;
  
  RegisterUseCase(this.repository);
  
  Future<User?> execute({
    required String name,
    required String email,
    required String password,
    required String storeName,
    String phone = '',
    String? businessType,
    String nik = '',
    String npwp = '',
    String? address,
  }) async {
    return await repository.register(
      name: name,
      email: email,
      password: password,
      storeName: storeName,
      phone: phone.isEmpty ? null : phone,
      businessType: businessType,
      nik: nik.isEmpty ? null : nik,
      npwp: npwp.isEmpty ? null : npwp,
      address: address,
    );
  }
}
