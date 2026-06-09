import 'dart:convert';
import 'package:http/http.dart' as http;

class AIRemoteDatasource {
  final String baseUrl;

  AIRemoteDatasource({required this.baseUrl});

  // =========================
  // GENERAL CHAT
  // =========================
  Future<String> chat(String message) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/v1/ai/chat'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        "message": message,
      }),
    );

    final data = jsonDecode(response.body);
    return data["reply"] ?? "";
  }

  // =========================
  // DISEASE DETECTION
  // =========================
  Future<String> detectDisease({
    required String module,
    required String entityId,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/v1/public/ai/disease-check'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        "module": module,
        "entity_id": entityId,
      }),
    );

    final data = jsonDecode(response.body);
    return data["data"]?.toString() ?? "";
  }

  // =========================
  // MARKET INSIGHT
  // =========================
  Future<String> marketInsight(String commodityId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/v1/public/ai/market-insight'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        "commodity_id": commodityId,
      }),
    );

    final data = jsonDecode(response.body);
    return data["data"]?.toString() ?? "";
  }

  // =========================
  // GENERIC ANALYZE (AQUA / HERD / FARM)
  // =========================
  Future<String> analyze({
    required String module,
    required String entityId,
    required String message,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/v1/ai/analyze'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        "module": module,
        "entity_id": entityId,
        "message": message,
      }),
    );

    final data = jsonDecode(response.body);
    return data["data"] ?? "";
  }
}