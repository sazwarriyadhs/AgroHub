// lib/features/profile/domain/usecases/get_user_profile.dart
import '../../data/models/user_model.dart';
import '../repositories/profile_repository.dart';

class GetUserProfile {
  final ProfileRepository _repository;

  GetUserProfile(this._repository);

  Future<UserModel> call() async {
    return await _repository.getUserProfile();
  }
}
