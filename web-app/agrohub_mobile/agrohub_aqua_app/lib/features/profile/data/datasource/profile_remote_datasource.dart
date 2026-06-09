// lib/features/profile/data/datasource/profile_remote_datasource.dart
import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../../../../../core/services/api_service.dart';
import '../models/user_model.dart';
import '../models/aquaculture_asset_model.dart';

class ProfileRemoteDatasource {
  final ApiService _apiService;

  ProfileRemoteDatasource(this._apiService);

  Future<UserModel> getUserProfile() async {
    try {
      final response = await _apiService.getProfile();
      return UserModel.fromJson(response);
    } catch (e) {
      debugPrint('Error fetching user profile: $e');
      rethrow;
    }
  }

  Future<UserModel> updateUserProfile(Map<String, dynamic> data) async {
    try {
      final response = await _apiService.updateProfile(data);
      return UserModel.fromJson(response);
    } catch (e) {
      debugPrint('Error updating user profile: $e');
      rethrow;
    }
  }

  Future<List<AquacultureAssetModel>> getAquacultureAssets() async {
    try {
      final response = await _apiService.getAquacultureAssets();
      final List<dynamic> data = response is List ? response : (response['data'] ?? []);
      return data.map((item) => AquacultureAssetModel.fromJson(item)).toList();
    } catch (e) {
      debugPrint('Error fetching aquaculture assets: $e');
      return [];
    }
  }

  Future<void> updateMembership(String membershipCode) async {
    try {
      await _apiService.updateMembership(membershipCode);
    } catch (e) {
      debugPrint('Error updating membership: $e');
      rethrow;
    }
  }

  Future<void> uploadAvatar(String imagePath) async {
    try {
      await _apiService.uploadAvatar(imagePath);
    } catch (e) {
      debugPrint('Error uploading avatar: $e');
      rethrow;
    }
  }
}
