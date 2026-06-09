// lib/core/services/api_client.dart

import 'dart:async';
import 'dart:convert';

import 'package:http/http.dart' as http;

import 'token_storage.dart';

class ApiClient {
  static final ApiClient _instance =
      ApiClient._internal();

  static ApiClient get instance =>
      _instance;

  factory ApiClient() => _instance;

  ApiClient._internal();

  // ==========================================
  // BASE URL
  // ==========================================

  static const String baseUrl =
      'http://192.168.18.16:8900/api/v1';

  final http.Client _client =
      http.Client();

  String? _authToken;

  // ==========================================
  // TOKEN MANAGEMENT
  // ==========================================

  void setAuthToken(
    String token,
  ) {
    _authToken = token;
  }

  void clearAuthToken() {
    _authToken = null;
  }

  // ==========================================
  // HEADERS
  // ==========================================

  Future<Map<String, String>>
      _getHeaders() async {
    final token =
        _authToken ??
            await TokenStorage()
                .getAccessToken();

    return {
      'Content-Type':
          'application/json',

      'Accept':
          'application/json',

      if (token != null &&
          token.isNotEmpty)
        'Authorization':
            'Bearer $token',
    };
  }

  // ==========================================
  // GET
  // ==========================================

  Future<dynamic> get(
    String endpoint,
  ) async {
    try {
      final url =
          '$baseUrl$endpoint';

      print('━━━━━━━━━━━━━━');
      print('🌐 GET');
      print(url);

      final response =
          await _client
              .get(
                Uri.parse(url),
                headers:
                    await _getHeaders(),
              )
              .timeout(
                const Duration(
                  seconds: 20,
                ),
              );

      print(
        'STATUS: ${response.statusCode}',
      );

      print(
        'BODY: ${response.body}',
      );

      return _handleResponse(
        response,
      );
    } catch (e) {
      print(
        '❌ GET ERROR: $e',
      );

      rethrow;
    }
  }

  // ==========================================
  // POST
  // ==========================================

  Future<dynamic> post(
    String endpoint, {
    dynamic data,
  }) async {
    try {
      final url =
          '$baseUrl$endpoint';

      print(
          '━━━━━━━━━━━━━━');

      print(
          '🚀 POST REQUEST');

      print(
          'URL: $url');

      print(
        'BODY: ${jsonEncode(data)}',
      );

      final response =
          await _client
              .post(
                Uri.parse(url),
                headers:
                    await _getHeaders(),
                body: data != null
                    ? jsonEncode(
                        data,
                      )
                    : null,
              )
              .timeout(
                const Duration(
                  seconds: 20,
                ),
              );

      print(
        'STATUS: ${response.statusCode}',
      );

      print(
        'RESPONSE: ${response.body}',
      );

      return _handleResponse(
        response,
      );
    } catch (e) {
      print(
        '❌ POST ERROR: $e',
      );

      rethrow;
    }
  }

  // ==========================================
  // PUT
  // ==========================================

  Future<dynamic> put(
    String endpoint, {
    dynamic data,
  }) async {
    try {
      final url =
          '$baseUrl$endpoint';

      final response =
          await _client
              .put(
                Uri.parse(url),
                headers:
                    await _getHeaders(),
                body: data != null
                    ? jsonEncode(
                        data,
                      )
                    : null,
              )
              .timeout(
                const Duration(
                  seconds: 20,
                ),
              );

      return _handleResponse(
        response,
      );
    } catch (e) {
      print(
        '❌ PUT ERROR: $e',
      );

      rethrow;
    }
  }

  // ==========================================
  // DELETE
  // ==========================================

  Future<dynamic> delete(
    String endpoint,
  ) async {
    try {
      final response =
          await _client
              .delete(
                Uri.parse(
                  '$baseUrl$endpoint',
                ),
                headers:
                    await _getHeaders(),
              )
              .timeout(
                const Duration(
                  seconds: 20,
                ),
              );

      return _handleResponse(
        response,
      );
    } catch (e) {
      print(
        '❌ DELETE ERROR: $e',
      );

      rethrow;
    }
  }

  // ==========================================
  // RESPONSE HANDLER
  // ==========================================

  dynamic _handleResponse(
    http.Response response,
  ) {
    dynamic decoded;

    try {
      decoded =
          response.body.isNotEmpty
              ? jsonDecode(
                  response.body,
                )
              : {};
    } catch (_) {
      decoded = response.body;
    }

    if (response.statusCode >=
            200 &&
        response.statusCode <
            300) {
      return decoded;
    }

    throw Exception(
      decoded is Map
          ? decoded[
                  'message'] ??
              'Request failed (${response.statusCode})'
          : 'Request failed (${response.statusCode})',
    );
  }

  // ==========================================
  // DISPOSE
  // ==========================================

  void dispose() {
    _client.close();
  }
}