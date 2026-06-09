import 'dart:convert';
import 'package:http/http.dart' as http;

class AIService {
  final String baseUrl;

  AIService({required this.baseUrl});

  Future<String> chat({
    required String message,
    required String module,
    required String entityId,
  }) async {
    final url = Uri.parse("$baseUrl/api/v1/ai/chat");

    final res = await http.post(
      url,
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonEncode({
        "message": message,
        "module": module,
        "entity_id": entityId,
      }),
    );

    if (res.statusCode != 200) {
      throw Exception("AI API Error: ${res.body}");
    }

    final data = jsonDecode(res.body);

    return data["data"]["response"] ?? "No response";
  }
}