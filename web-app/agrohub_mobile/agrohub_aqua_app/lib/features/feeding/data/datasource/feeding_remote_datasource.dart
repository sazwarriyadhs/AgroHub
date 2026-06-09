// lib/features/feeding/data/datasource/feeding_remote_datasource.dart
import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../../../../../core/services/api_service.dart';
import '../models/feed_stock_model.dart';
import '../models/feeding_schedule_model.dart';
import '../models/feeding_statistic_model.dart';

class FeedingRemoteDatasource {
  final ApiService _apiService;

  FeedingRemoteDatasource(this._apiService);

  // ========== FEED STOCK ==========
  
  Future<List<FeedStockModel>> getFeedStock() async {
    try {
      final response = await _apiService.getFeedStock();
      final List<dynamic> data = response is List ? response : (response['data'] ?? []);
      return data.map((item) => FeedStockModel.fromJson(item)).toList();
    } catch (e) {
      debugPrint('Error fetching feed stock: $e');
      return [];
    }
  }

  Future<FeedStockModel> addFeedStock(Map<String, dynamic> data) async {
    try {
      final response = await _apiService.addFeedStock(data);
      return FeedStockModel.fromJson(response['data']);
    } catch (e) {
      debugPrint('Error adding feed stock: $e');
      rethrow;
    }
  }

  Future<FeedStockModel> updateFeedStock(String id, Map<String, dynamic> data) async {
    try {
      final response = await _apiService.updateFeedStock(id, data);
      return FeedStockModel.fromJson(response['data']);
    } catch (e) {
      debugPrint('Error updating feed stock: $e');
      rethrow;
    }
  }

  Future<void> deleteFeedStock(String id) async {
    try {
      await _apiService.deleteFeedStock(id);
    } catch (e) {
      debugPrint('Error deleting feed stock: $e');
      rethrow;
    }
  }

  // ========== FEEDING SCHEDULE ==========
  
  Future<List<FeedingScheduleModel>> getFeedingSchedules() async {
    try {
      final response = await _apiService.getFeedingSchedules();
      final List<dynamic> data = response is List ? response : (response['data'] ?? []);
      return data.map((item) => FeedingScheduleModel.fromJson(item)).toList();
    } catch (e) {
      debugPrint('Error fetching feeding schedules: $e');
      return [];
    }
  }

  Future<FeedingScheduleModel> addFeedingSchedule(Map<String, dynamic> data) async {
    try {
      final response = await _apiService.addFeedingSchedule(data);
      return FeedingScheduleModel.fromJson(response['data']);
    } catch (e) {
      debugPrint('Error adding feeding schedule: $e');
      rethrow;
    }
  }

  Future<FeedingScheduleModel> updateFeedingSchedule(String id, Map<String, dynamic> data) async {
    try {
      final response = await _apiService.updateFeedingSchedule(id, data);
      return FeedingScheduleModel.fromJson(response['data']);
    } catch (e) {
      debugPrint('Error updating feeding schedule: $e');
      rethrow;
    }
  }

  Future<void> deleteFeedingSchedule(String id) async {
    try {
      await _apiService.deleteFeedingSchedule(id);
    } catch (e) {
      debugPrint('Error deleting feeding schedule: $e');
      rethrow;
    }
  }

  Future<void> toggleFeedingSchedule(String id, bool isEnabled) async {
    try {
      await _apiService.toggleFeedingSchedule(id, isEnabled);
    } catch (e) {
      debugPrint('Error toggling feeding schedule: $e');
      rethrow;
    }
  }

  // ========== STATISTICS ==========
  
  Future<FeedingStatisticModel> getFeedingStatistics({String? period}) async {
    try {
      final response = await _apiService.getFeedingStatistics(period: period);
      final data = response is Map ? response['data'] : response;
      return FeedingStatisticModel.fromJson(data ?? {});
    } catch (e) {
      debugPrint('Error fetching feeding statistics: $e');
      return const FeedingStatisticModel();
    }
  }
}
