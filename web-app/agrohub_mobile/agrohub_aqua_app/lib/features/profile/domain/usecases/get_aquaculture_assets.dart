// lib/features/profile/domain/usecases/get_aquaculture_assets.dart
import '../../data/models/aquaculture_asset_model.dart';
import '../repositories/profile_repository.dart';

class GetAquacultureAssets {
  final ProfileRepository _repository;

  GetAquacultureAssets(this._repository);

  Future<List<AquacultureAssetModel>> call() async {
    return await _repository.getAquacultureAssets();
  }
}
