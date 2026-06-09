// lib/features/profile/services/profile_service.dart

import 'package:flutter/foundation.dart';
import 'package:agrohub_aqua_app/core/services/api_service.dart';
import '../models/aquaculture_asset_model.dart';
import '../models/membership_model.dart';
import '../../../core/services/user_session.dart';

class ProfileService {
  final ApiService _apiService = ApiService();

  // ================= USER PROFILE =================
  
  Future<Map<String, dynamic>> getUserProfile() async {
    try {
      final response = await _apiService.getProfile();
      
      final data = response is Map<String, dynamic>
          ? (response['data'] ?? response)
          : {};
      
      // Sync to UserSession
      UserSession.setUser({
        "id": data['id'] ?? 41,
        "full_name": data['full_name'] ?? data['name'] ?? "Nelayan Lele Demo",
        "username": data['username'] ?? "nelayan.lele",
        "email": data['email'] ?? "nelayan.lele@agrohub.com",
        "avatar": data['avatar'] ?? "",
        "membership_type": _getMembershipType(data['membership_id']),
        "membership_code": data['membership_code'] ?? "AGH-${data['id'] ?? 41}-X82KQ",
      });
      
      return {
        "id": data['id'] ?? 41,
        "full_name": data['full_name'] ?? data['name'] ?? "Nelayan Lele Demo",
        "name": data['name'] ?? "Pak Lele Jaya",
        "email": data['email'] ?? "nelayan.lele@agrohub.com",
        "phone": data['phone'] ?? "081234567894",
        "address": data['address'] ?? "Desa Perikanan, Jawa Barat",
        "city": data['city'] ?? "Blitar",
        "province": data['province'] ?? "Jawa Timur",
        "role": data['role'] ?? "farmer",
        "user_type": data['user_type'] ?? "farmer",
        "is_active": data['is_active'] ?? true,
        "created_at": data['created_at'],
        "farm_name": data['farm_name'] ?? "Farm Lele Jaya",
        "farm_size": data['farm_size'] ?? 2.50,
        "farm_address": data['farm_address'] ?? "Jl. Tambak Mulyo No. 45, Sidoarjo, Jawa Timur",
        "farm_type": data['farm_type'] ?? "aquaculture",
        "farming_experience_years": data['farming_experience_years'] ?? 8,
        "membership_id": data['membership_id'] ?? 4,
        "membership_code": data['membership_code'] ?? "AGH-41-X82KQ",
        "loyalty_points": data['loyalty_points'] ?? 1250,
        "uuid": data['uuid'] ?? "3dad8f13-0a23-48bd-a3bb-753372486adc",
      };
    } catch (e) {
      debugPrint("Error loading user profile: $e");
      
      // Return fallback data from database
      return {
        "id": 41,
        "full_name": "Nelayan Lele Demo",
        "name": "Pak Lele Jaya",
        "email": "nelayan.lele@agrohub.com",
        "phone": "081234567894",
        "address": "Desa Perikanan, Jawa Barat",
        "city": "Blitar",
        "province": "Jawa Timur",
        "role": "farmer",
        "user_type": "farmer",
        "is_active": true,
        "created_at": DateTime(2026, 5, 20).toIso8601String(),
        "farm_name": "Farm Lele Jaya",
        "farm_size": 2.50,
        "farm_address": "Jl. Tambak Mulyo No. 45, Sidoarjo, Jawa Timur",
        "farm_type": "aquaculture",
        "farming_experience_years": 8,
        "membership_id": 4,
        "membership_code": "AGH-41-X82KQ",
        "loyalty_points": 1250,
        "uuid": "3dad8f13-0a23-48bd-a3bb-753372486adc",
      };
    }
  }

  // ================= AQUACULTURE ASSETS =================
  
  Future<List<AquacultureAsset>> getAquacultureAssets() async {
    try {
      // Return default assets directly (API endpoint not available yet)
      return _getDefaultAssets();
    } catch (e) {
      debugPrint("Error loading aquaculture assets: $e");
      return _getDefaultAssets();
    }
  }

  List<AquacultureAsset> _getDefaultAssets() {
    return [
      AquacultureAsset(
        id: 1,
        fishCategoryId: 1,
        species: "Lele",
        systemType: "Kolam Terpal",
        stockCount: 5000,
        estimatedBiomass: 1250.5,
        survivalRate: 92,
        status: "active",
      ),
      AquacultureAsset(
        id: 2,
        fishCategoryId: 2,
        species: "Nila",
        systemType: "Kolam Bioflok",
        stockCount: 3500,
        estimatedBiomass: 875.2,
        survivalRate: 88,
        status: "active",
      ),
      AquacultureAsset(
        id: 3,
        fishCategoryId: 3,
        species: "Gurame",
        systemType: "Kolam Tanah",
        stockCount: 2000,
        estimatedBiomass: 620.8,
        survivalRate: 85,
        status: "active",
      ),
    ];
  }

  // ================= MEMBERSHIP HELPERS =================
  
  String _getMembershipType(dynamic id) {
    switch (id) {
      case 1:
        return "Silver";
      case 2:
        return "Gold";
      case 3:
        return "Platinum";
      case 4:
        return "Gold";
      default:
        return "Gold";
    }
  }
}