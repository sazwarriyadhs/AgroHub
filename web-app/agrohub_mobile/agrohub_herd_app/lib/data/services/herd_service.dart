// lib/data/services/herd_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/herd_model.dart';
import '../../core/constants/herd_constants.dart';

class HerdService {
  Future<List<HerdModel>> getHerdList() async {
    try {
      // TODO: Implement API call
      // final response = await http.get(Uri.parse('${HerdConstants.baseUrl}${HerdConstants.herdEndpoint}'));
      // if (response.statusCode == 200) {
      //   final List data = json.decode(response.body);
      //   return data.map((json) => HerdModel.fromJson(json)).toList();
      // }
      
      // Mock data for now
      await Future.delayed(const Duration(seconds: 1));
      return [
        HerdModel(
          id: '1',
          name: 'Sapi Brahman',
          type: 'Sapi Potong',
          gender: 'Jantan',
          weight: 450.5,
          birthDate: DateTime(2022, 3, 15),
          healthStatus: 'Sehat',
          rfidTag: 'RFID001',
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
      ];
    } catch (e) {
      throw Exception('Failed to load herd data: $e');
    }
  }
  
  Future<HerdModel> addHerd(HerdModel herd) async {
    // TODO: Implement API call
    await Future.delayed(const Duration(seconds: 1));
    return herd;
  }
  
  Future<HerdModel> updateHerd(HerdModel herd) async {
    // TODO: Implement API call
    await Future.delayed(const Duration(seconds: 1));
    return herd;
  }
  
  Future<void> deleteHerd(String id) async {
    // TODO: Implement API call
    await Future.delayed(const Duration(seconds: 1));
  }
}
