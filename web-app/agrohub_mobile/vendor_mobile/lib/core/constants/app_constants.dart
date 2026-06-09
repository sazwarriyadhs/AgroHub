// core/constants/app_constants.dart

class AppConstants {
  static const String appName = 'AgroHub Vendor';
  
  // ✅ Pilih salah satu, comment yang lain:
  
  // Untuk Real Device (HP) - pakai IP komputer
  static const String baseUrl = 'http://192.168.18.16:8900/api/v1';  // ← Tambahkan /api/v1
  
  // Untuk Chrome/Web
  // static const String baseUrl = 'http://localhost:8900/api/v1';
  
  // Untuk Emulator Android
  // static const String baseUrl = 'http://10.0.2.2:8900/api/v1';
  
  // Shared Preferences Keys
  static const String tokenKey = 'auth_token';
  static const String userKey = 'user_data';
  static const String rememberMeKey = 'remember_me';
  
  // Timeouts
  static const int connectionTimeout = 30000;
  static const int receiveTimeout = 30000;
  
  // Pagination
  static const int defaultPageSize = 10;
  static const int defaultPage = 1;
  
  // Default Credentials for Vendor
  static const String defaultEmail = 'vendor@agrohub.com';
  static const String defaultPassword = 'password123';
  
  // API Endpoints (sesuai backend Go)
  static const String loginEndpoint = '/login';  // ← Karena baseUrl sudah include /api/v1
  static const String registerEndpoint = '/register';
  static const String logoutEndpoint = '/logout';
  static const String profileEndpoint = '/profile';
  static const String dashboardStatsEndpoint = '/dashboard/stats';
  static const String productsEndpoint = '/products';
  static const String walletEndpoint = '/wallet';
  static const String storesEndpoint = '/stores';
  static const String marketPricesEndpoint = '/market/prices';
  
  // HTTP Headers
  static const String authorization = 'Authorization';
  static const String bearer = 'Bearer';
  static const String contentType = 'Content-Type';
  static const String applicationJson = 'application/json';
  
  // Error Messages
  static const String connectionError = 'Koneksi internet bermasalah';
  static const String serverError = 'Terjadi kesalahan pada server';
  static const String timeoutError = 'Koneksi timeout';
  static const String unauthorizedError = 'Sesi habis, silakan login kembali';
  
  // Success Messages
  static const String loginSuccess = 'Berhasil masuk';
  static const String logoutSuccess = 'Berhasil keluar';
  static const String saveSuccess = 'Data berhasil disimpan';
  static const String deleteSuccess = 'Data berhasil dihapus';
  
  // Product Types
  static const String productTypeFarmer = 'farmer';
  static const String productTypeVendor = 'vendor';
  static const String productTypeLivestock = 'livestock';
  static const String productTypeFishery = 'fishery';
  static const String productTypeProcessed = 'processed';
  
  // Supply Chain Stages
  static const String stageProduction = 'production';
  static const String stageProcessing = 'processing';
  static const String stageDistribution = 'distribution';
  static const String stageRetail = 'retail';
}