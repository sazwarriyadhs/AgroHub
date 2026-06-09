import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
// 1. 🔥 Pastikan import model Livestock sudah benar di sini
import 'package:agrohub_herd_app/data/models/livestock_model.dart'; 

class HerdService {
  // Jika kamu butuh representasi data monitoring, kamu bisa memanfaatkan list tipe data Livestock langsung,
  // atau membuat sub-class kecil baru jika memang struktur database backend-nya terpisah.

  /// Mengambil data seluruh ternak untuk kalkulasi statistik dashboard
  Future<List<Livestock>> getAllLivestockData() async {
    try {
      // Contoh simulasi hit API ekosistem AgroHub
      // final response = await http.get(Uri.parse('YOUR_API_URL/livestock'));
      
      // Ini mock data return yang aman dan sinkron dengan model barumu
      return [
        Livestock(id: 1, tagNumber: 'A-001', status: 'active', healthStatus: 'healthy', weight: 450.0),
        Livestock(id: 2, tagNumber: 'A-002', status: 'sick', healthStatus: 'sick', weight: 410.5),
        Livestock(id: 3, tagNumber: 'A-003', status: 'pregnant', healthStatus: 'healthy', weight: 480.0),
      ];
    } catch (e) {
      debugPrint('Error HerdService: $e');
      return [];
    }
  }
}