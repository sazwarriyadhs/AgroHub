import 'dart:convert';
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class DeepSeekService {
  // Pindahkan API Key ke constructor atau environment variable untuk keamanan tinggi
  final String apiKey;
  
  // Endpoint resmi DeepSeek API V3
  static const String _baseUrl = 'https://api.deepseek.com/v1/chat/completions';
  
  final bool useMockData;
  final http.Client _client;

  DeepSeekService({
    this.apiKey = 'YOUR_DEEPSEEK_API_KEY', // Ganti dengan String kosong jika memakai dotenv/flavor
    this.useMockData = true,
    http.Client? client,
  }) : _client = client ?? http.Client();

  /// Generate recipe berdasarkan daftar bahan masakan
  Future<String> generateRecipe(List<String> ingredients) async {
    if (ingredients.isEmpty) {
      return '⚠️ Masukkan bahan-bahan terlebih dahulu di kulkas pintar Anda.';
    }
    
    if (useMockData) {
      // Delay buatan sebesar 1.5 detik agar animasi loading di UI tampak natural
      await Future.delayed(const Duration(milliseconds: 1500));
      return _generateMockRecipe(ingredients);
    }
    
    try {
      final response = await _callDeepSeekAPI(
        prompt: _buildRecipePrompt(ingredients),
        systemInstruction: 'Anda adalah Executive Chef AI dari AgroHub. Tugas Anda meramu resep masakan yang lezat, presisi, bernilai jual, dan terstruktur rapi menggunakan format Markdown tebal.',
        maxTokens: 800,
      );
      return _parseResponse(response);
    } catch (e) {
      debugPrint('🚨 [DeepSeek API Error]: $e');
      return _generateFallbackRecipe(ingredients);
    }
  }
  
  /// Mengambil data insight pergerakan harga komoditas pasar pasar induk
  Future<String> getMarketInsight(String commodity) async {
    if (commodity.isEmpty) {
      return '⚠️ Masukkan nama komoditas pertanian terlebih dahulu.';
    }
    
    if (useMockData) {
      await Future.delayed(const Duration(milliseconds: 1500));
      return _generateMockMarketInsight(commodity);
    }
    
    try {
      final response = await _callDeepSeekAPI(
        prompt: _buildMarketPrompt(commodity),
        systemInstruction: 'Anda adalah Analis Data Komoditas Pertanian Senior di AgroHub. Berikan analisis tren ekonomi makro pasar pangan dengan data yang tajam, taktis, dan mudah dipahami petani maupun pedagang.',
        maxTokens: 600,
      );
      return _parseResponse(response);
    } catch (e) {
      debugPrint('🚨 [DeepSeek API Error]: $e');
      return _generateFallbackMarketInsight(commodity);
    }
  }
  
  /// Core HTTP POST Caller ke DeepSeek Gateway dengan Network Timeout Management
  Future<String> _callDeepSeekAPI({
    required String prompt,
    required String systemInstruction,
    required int maxTokens,
  }) async {
    if (apiKey == 'YOUR_DEEPSEEK_API_KEY' || apiKey.isEmpty) {
      throw Exception('API Key DeepSeek belum dikonfigurasi dengan benar.');
    }

    // Menggunakan timeout 15 detik agar aplikasi responsif saat jaringan lambat
    return await _client.post(
      Uri.parse(_baseUrl),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $apiKey',
      },
      body: jsonEncode({
        'model': 'deepseek-chat', // DeepSeek otomatis mengarahkan ini ke model V3 terbaru mereka
        'messages': [
          {'role': 'system', 'content': systemInstruction},
          {'role': 'user', 'content': prompt}
        ],
        'temperature': 0.5, // Diturunkan ke 0.5 agar output AI lebih patuh pada format struktur
        'max_tokens': maxTokens,
      }),
    ).then((res) {
      if (res.statusCode == 200) return res.body;
      throw Exception('DeepSeek API Error (Status: ${res.statusCode})');
    }).timeout(
      const Duration(seconds: 15),
      onTimeout: () => throw TimeoutException('Koneksi ke server AgroHub AI terputus. Silakan coba sesaat lagi.'),
    );
  }
  
  String _buildRecipePrompt(List<String> ingredients) {
    return '''
Saya punya bahan dasar: ${ingredients.join(", ")}.
Racikkan 1 menu resep masakan yang menggugah selera berdasarkan bahan di atas.

Wajib gunakan struktur output Markdown persis seperti di bawah ini:
# 🍽️ [NAMA REAKSI MENU]
*Estimasi Waktu: 30 Menit | Porsi Pas*

### 🛒 Bahan yang Diperlukan:
- [Bahan utama beserta takaran ideal]

### 🍳 Langkah Pembuatan:
1. **Persiapan:** [Langkah awal]
2. **Proses Masak:** [Langkah inti]

### 💡 Tips Rahasia Chef AgroHub:
- [Tips trik optimasi rasa masakan]
''';
  }
  
  String _buildMarketPrompt(String commodity) {
    return '''
Buatkan ringkasan analisis pasar komoditas pangan: "$commodity" untuk regional Indonesia.

Gunakan format laporan eksekutif berikut:
### 📈 Analisis Tren Harga Hari Ini
[Uraian singkat pergerakan grafik pasar]

### 🔍 Faktor Utama Penggerak Pasar
- **Sisi Pasokan:** [Kondisi panen/cuaca]
- **Sisi Permintaan:** [Kebutuhan retail/konsumen]

### 🔮 Prediksi Arah Harga (1 Bulan Ke Depan)
[Ulasan proyeksi pasar]

### 💼 Rekomendasi Aksi Niaga
- [Langkah strategis mitigasi risiko/keuntungan]
''';
  }
  
  /// Parser tunggal yang aman untuk mengekstrak pesan teks dari skema JSON DeepSeek
  String _parseResponse(String responseBody) {
    try {
      final data = jsonDecode(responseBody);
      return data['choices'][0]['message']['content'].toString().trim();
    } catch (e) {
      return '❌ Gagal memecahkan enkripsi data resep AI. Silakan ulangi langkah Anda.';
    }
  }
  
  String _generateMockRecipe(List<String> ingredients) {
    return '''
# 🍽️ Tumis ${ingredients[0]} Gurih Kaya Rempah
*Estimasi Waktu: 15 Menit | Porsi Pas*

### 🛒 Bahan yang Diperlukan:
- **${ingredients.join(" & ")}** (Secukupnya, potong serasi)
- 3 Siung Bawang Merah & 2 Siung Bawang Putih (Iris tipis)
- 2 Sendok makan kecap bumbu pilihan AgroHub
- Garam, lada putih hancuran, dan minyak kelapa sawit secukupnya

### 🍳 Langkah Pembuatan:
1. **Persiapan:** Panaskan minyak secukupnya di atas wajan anti lengket dengan api sedang. Tumis duet duo bawang hingga mengeluarkan aroma harum keemasan.
2. **Proses Masak:** Masukkan bahan utama masakan Anda secara perlahan. Tuangkan kecap manis, garam, beserta lada. Aduk merata hingga bumbu meresap sempurna, angkat sajikan hangat.

### 💡 Tips Rahasia Chef AgroHub:
- Supaya masakan terlihat segar merona, masukkan potongan cabai merah besar di detik-detik akhir sebelum kompor dimatikan!
''';
  }
  
  String _generateMockMarketInsight(String commodity) {
    return '''
### 📈 Analisis Tren Harga Hari Ini
Harga rata-rata nasional untuk komoditas **$commodity** saat ini merangkak naik sekitar **+4.2%** dari kurva indeks minggu lalu akibat pergeseran jalur logistik antar pulau.

### 🔍 Faktor Utama Penggerak Pasar
- **Sisi Pasokan:** Penurunan volume panen sekunder di wilayah sentra produksi akibat perubahan curah hujan harian.
- **Sisi Permintaan:** Konsumsi rumah tangga terpantau melonjak konstan menjelang persiapan hari libur akhir pekan.

### 🔮 Prediksi Arah Harga (1 Bulan Ke Depan)
Diproyeksikan harga komoditas akan menyentuh titik ekuilibrium baru dengan potensi kenaikan tipis **5-7%** sebelum kembali melandai di minggu ketiga bulan depan.

### 💼 Rekomendasi Aksi Niaga
- **Bagi Petani:** Tunda penjualan sistem tebas tengkulak, disarankan langsung distribusi via ekosistem digital pasar AgroHub untuk margin keuntungan bersih 20% lebih tinggi.
''';
  }
  
  String _generateFallbackRecipe(List<String> ingredients) {
    return '# 🍳 Menu Darurat Dapur\n\nBahan Anda: ${ingredients.join(", ")}.\n\n*Server AI sedang sibuk meracik bumbu, silakan tumis bahan dengan bawang putih dan garam untuk hidangan instan darurat rasa nikmat.*';
  }
  
  String _generateFallbackMarketInsight(String commodity) {
    return '### 📊 Info Pasar $commodity\n\nKoneksi satelit AI AgroHub terhambat. Tren harga $commodity terpantau bergerak dalam koridor normal dan aman dalam 24 jam terakhir.';
  }
}