// lib/features/profile/domain/usecases/update_profile.dart
import '../../data/models/user_model.dart';
import '../repositories/profile_repository.dart';

class UpdateProfile {
  final ProfileRepository _repository;

  UpdateProfile(this._repository);

  Future<UserModel> call(Map<String, dynamic> data) async {
    return await _repository.updateUserProfile(data);
  }
}
