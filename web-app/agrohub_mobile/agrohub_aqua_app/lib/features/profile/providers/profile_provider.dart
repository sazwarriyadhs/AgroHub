// lib/features/profile/providers/profile_provider.dart

import 'package:flutter/material.dart';
import '../services/profile_service.dart';
import '../models/membership_model.dart';
import '../models/aquaculture_asset_model.dart';

class ProfileProvider extends ChangeNotifier {
  final ProfileService _profileService = ProfileService();
  
  dynamic _user;
  MembershipModel? _membership;
  List<AquacultureAsset> _assets = [];
  bool _isLoading = false;

  dynamic get user => _user;
  MembershipModel? get membership => _membership;
  List<AquacultureAsset> get assets => _assets;
  bool get isLoading => _isLoading;

  Future<void> loadUserProfile() async {
    _isLoading = true;
    notifyListeners();
    
    try {
      _user = await _profileService.getUserProfile();
    } catch (e) {
      debugPrint("Error loading user profile in provider: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadAquacultureAssets() async {
    _isLoading = true;
    notifyListeners();
    
    try {
      _assets = await _profileService.getAquacultureAssets();
    } catch (e) {
      debugPrint("Error loading assets in provider: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}