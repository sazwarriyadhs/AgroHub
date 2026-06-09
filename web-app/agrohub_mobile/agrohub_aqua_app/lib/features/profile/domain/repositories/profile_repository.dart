// lib/features/profile/domain/repositories/profile_repository.dart
import '../../data/models/user_model.dart';
import '../../data/models/aquaculture_asset_model.dart';

abstract class ProfileRepository {
  Future<UserModel> getUserProfile();
  Future<UserModel> updateUserProfile(Map<String, dynamic> data);
  Future<List<AquacultureAssetModel>> getAquacultureAssets();
  Future<void> updateMembership(String membershipCode);
  Future<void> uploadAvatar(String imagePath);
}
