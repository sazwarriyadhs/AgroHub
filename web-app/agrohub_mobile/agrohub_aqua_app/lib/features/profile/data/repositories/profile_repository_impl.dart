// lib/features/profile/data/repositories/profile_repository_impl.dart
import '../../domain/repositories/profile_repository.dart';
import '../datasource/profile_remote_datasource.dart';
import '../models/user_model.dart';
import '../models/aquaculture_asset_model.dart';

class ProfileRepositoryImpl implements ProfileRepository {
  final ProfileRemoteDatasource _datasource;

  ProfileRepositoryImpl(this._datasource);

  @override
  Future<UserModel> getUserProfile() async {
    return await _datasource.getUserProfile();
  }

  @override
  Future<UserModel> updateUserProfile(Map<String, dynamic> data) async {
    return await _datasource.updateUserProfile(data);
  }

  @override
  Future<List<AquacultureAssetModel>> getAquacultureAssets() async {
    return await _datasource.getAquacultureAssets();
  }

  @override
  Future<void> updateMembership(String membershipCode) async {
    return await _datasource.updateMembership(membershipCode);
  }

  @override
  Future<void> uploadAvatar(String imagePath) async {
    return await _datasource.uploadAvatar(imagePath);
  }
}
