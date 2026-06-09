// lib/features/activities/data/repositories/activity_repository_impl.dart
import 'dart:convert';
import '../../domain/repositories/activity_repository.dart';
import '../models/activity_model.dart';
import '../../../../core/services/api_service.dart';

class ActivityRepositoryImpl implements ActivityRepository {
  final ApiService _apiService;

  ActivityRepositoryImpl(this._apiService);

  // ============================================
  // EXTRACT PAYLOAD SAFELY
  // ============================================
  dynamic _extractPayload(dynamic response) {
    if (response is List) return response;

    if (response is Map) {
      return response['data'] ?? response;
    }

    return [];
  }

  // ============================================
  // NORMALIZE TO LIST<MAP>
  // ============================================
  List<Map<String, dynamic>> _normalize(dynamic rawData) {
    if (rawData is List) {
      return rawData
          .whereType<Map>()
          .map((e) => Map<String, dynamic>.from(e))
          .toList();
    }

    if (rawData is Map) {
      return [Map<String, dynamic>.from(rawData)];
    }

    if (rawData is String) {
      try {
        final decoded = jsonDecode(rawData);

        if (decoded is List) {
          return decoded
              .whereType<Map>()
              .map((e) => Map<String, dynamic>.from(e))
              .toList();
        }

        if (decoded is Map) {
          return [Map<String, dynamic>.from(decoded)];
        }
      } catch (_) {}
    }

    return [];
  }

  @override
  Future<List<ActivityModel>> getActivities({int? limit}) async {
    try {
      final response = await _apiService.getRecentActivities();

      // STEP 1: extract payload
      final raw = _extractPayload(response);

      // STEP 2: normalize to List<Map>
      final normalized = _normalize(raw);

      // STEP 3: map to model
      List<ActivityModel> activities = normalized
          .map((e) => ActivityModel.fromJson(e))
          .toList();

      // STEP 4: apply limit
      if (limit != null && limit > 0 && activities.length > limit) {
        activities = activities.take(limit).toList();
      }

      return activities;
    } catch (e) {
      print('❌ getActivities error: $e');
      return [];
    }
  }

  @override
  Future<ActivityModel> addActivity(Map<String, dynamic> data) async {
    return ActivityModel(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: data['title'] ?? '',
      description: data['description'],
      amount: data['amount'],
      createdAt: DateTime.now(),
      type: data['type'] ?? 'info',
    );
  }
}