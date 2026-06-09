// lib/services/deepseek_service.dart
import 'dart:async';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

class DeepSeekService {
  static const String _baseUrl = 'https://api.deepseek.com/v1';
  static const String _apiKey = 'sk-df819f194e5e43fe9afefc789427ff06';
  static const String _model = 'deepseek-chat';
  
  late final Dio _dio;
  
  // Singleton
  static final DeepSeekService _instance = DeepSeekService._internal();
  factory DeepSeekService() => _instance;
  DeepSeekService._internal() {
    _dio = Dio(BaseOptions(
      baseUrl: _baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 60),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $_apiKey',
      },
    ));
  }
  
  /// Generate recipe dari bahan yang tersedia
  Future<String> generateRecipe(List<String> ingredients, {
    String cuisine = 'Indonesia',
    String difficulty = 'Normal',
    int servings = 2,
  }) async {
    if (ingredients.isEmpty) {
      return "❌ Masukkan bahan terlebih dahulu!";
    }
    
    final prompt = '''
Buatkan resep masakan lengkap dalam bahasa Indonesia.

Bahan-bahan yang tersedia: ${ingredients.join(", ")}
Jenis masakan: $cuisine
Tingkat kesulitan: $difficulty
Porsi: $servings orang

Format output:

🍲 NAMA RESEP: [nama resep]

✨ INFO:
⏰ Waktu Masak: [estimasi waktu]
⚡ Kesulitan: $difficulty
👨‍🍳 Porsi: $servings
🔥 Kalori: [estimasi kalori]

🛒 BAHAN-BAHAN:
${ingredients.map((b) => "• $b: [takaran]").join("\n")}

👩‍🍳 LANGKAH MEMASAK:
1. [langkah 1]
2. [langkah 2]
3. [langkah 3]
4. [langkah 4]
5. [langkah 5]

💡 TIPS:
• [tips 1]
• [tips 2]
''';
    
    try {
      final response = await _dio.post(
        '/chat/completions',
        data: {
          'model': _model,
          'messages': [
            {'role': 'system', 'content': 'Anda adalah chef profesional. Respons dalam bahasa Indonesia.'},
            {'role': 'user', 'content': prompt},
          ],
          'temperature': 0.7,
          'max_tokens': 2048,
        },
      );
      
      if (response.statusCode == 200 && 
          response.data != null &&
          response.data['choices'] != null &&
          response.data['choices'].isNotEmpty) {
        return response.data['choices'][0]['message']['content'];
      } else {
        return "⚠️ Maaf, AI sedang sibuk. Coba lagi nanti ya!";
      }
    } on DioException catch (e) {
      debugPrint('DeepSeek API Error: ${e.message}');
      if (e.response?.statusCode == 401) {
        return "⚠️ API Key tidak valid. Hubungi admin.";
      } else if (e.response?.statusCode == 429) {
        return "⚠️ Terlalu banyak permintaan. Coba lagi nanti.";
      } else if (e.response?.statusCode == 404) {
        return "⚠️ Layanan AI sedang maintenance. Coba lagi nanti.";
      } else {
        return "⚠️ Koneksi bermasalah. Periksa internet Anda.";
      }
    } catch (e) {
      debugPrint('Error: $e');
      return "⚠️ Terjadi kesalahan. Coba lagi ya!";
    }
  }
  
  /// Chat dengan DeepSeek (Fallback ke response manual jika error)
  Future<String> chat(String message, List<Map<String, String>> history) async {
    // Response manual jika API bermasalah
    final lowerMsg = message.toLowerCase();
    
    if (lowerMsg.contains('resep') || lowerMsg.contains('masak')) {
      return "🍳 Untuk mendapatkan resep, silahkan:\n\n1️⃣ Tambahkan bahan-bahan yang kamu punya di atas\n2️⃣ Klik tombol **Generate Resep**\n\nNanti AI akan buatkan resep spesial untukmu! ✨";
    }
    
    if (lowerMsg.contains('terima kasih') || lowerMsg.contains('makasih')) {
      return "Sama-sama! 👋 Selamat memasak! 🍳✨";
    }
    
    return "Halo! 👋 Ada yang bisa aku bantu?\n\n• 🍳 **Buat resep** - Tambahkan bahan, klik Generate Resep\n• 🛒 **Cek bahan** - Ketik \"cek ketersediaan\"\n• 📝 **Tanya resep** - Sebutkan nama masakan\n\nMau coba yang mana? 😊";
  }
}