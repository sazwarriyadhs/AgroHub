// lib/core/services/api_response.dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiResponse {
  final bool success;
  final dynamic data;
  final String message;
  final int statusCode;

  ApiResponse({
    required this.success,
    this.data,
    required this.message,
    required this.statusCode,
  });

  factory ApiResponse.fromHttpResponse(http.Response response) {
    try {
      final Map<String, dynamic> json = jsonDecode(response.body);
      return ApiResponse(
        success: response.statusCode >= 200 && response.statusCode < 300,
        data: json['data'],
        message: json['message'] ?? response.reasonPhrase ?? 'Unknown error',
        statusCode: response.statusCode,
      );
    } catch (e) {
      return ApiResponse.error('Failed to parse response: $e', response.statusCode);
    }
  }

  factory ApiResponse.error(String message, int statusCode) {
    return ApiResponse(
      success: false,
      data: null,
      message: message,
      statusCode: statusCode,
    );
  }
}