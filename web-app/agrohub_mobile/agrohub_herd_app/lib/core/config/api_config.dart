// lib/core/config/api_config.dart
// Untuk agrohub_herd_app

class ApiConfig {
  // 🔥 GANTI DENGAN IP KOMPUTER ANDA jika testing di device fisik
  // Cek IP dengan perintah: ipconfig (Windows) atau ifconfig (Mac/Linux)
  static const String baseUrl = 'http://localhost:8900';
  
  // Untuk emulator Android (localhost dari emulator)
  // static const String baseUrl = 'http://10.0.2.2:8900';
  
  // Untuk emulator iOS
  // static const String baseUrl = 'http://localhost:8900';
  
  // Untuk device fisik (ganti dengan IP komputer)
  // Contoh: static const String baseUrl = 'http://192.168.1.100:8900';
  
  // ================= AUTH =================
  static const String login = '/api/v1/public/login';
  static const String register = '/api/v1/public/register';
  static const String profile = '/api/v1/profile';
  static const String logout = '/api/v1/logout';
  
  // ================= DASHBOARD =================
  static const String dashboardStats = '/api/v1/dashboard/stats';
  
  // ================= MARKETPLACE =================
  static const String products = '/api/v1/products';
  static const String stores = '/api/v1/stores';
  static const String myProducts = '/api/v1/my-products';
  static const String addProduct = '/api/v1/products/add';
  static const String deleteProduct = '/api/v1/products/delete';
  
  // ================= WALLET =================
  static const String wallet = '/api/v1/wallet';
  static const String walletTransactions = '/api/v1/wallet/transactions';
  static const String topUp = '/api/v1/wallet/topup';
  static const String withdraw = '/api/v1/wallet/withdraw';
  
  // ================= COMMUNITY =================
  static const String communityFeed = '/api/v1/community/feed';
  static const String communityTrending = '/api/v1/community/trending';
  static const String communityPost = '/api/v1/community/post';
  static const String communityCreatePost = '/api/v1/community/create';
  static const String communityLike = '/api/v1/community/like';
  static const String communityComment = '/api/v1/community/comment';
  
  // ================= LIVESTOCK =================
  static const String livestockAssets = '/api/v1/livestock/assets';
  static const String livestockAdd = '/api/v1/livestock/add';
  static const String livestockDetail = '/api/v1/livestock/detail';
  static const String livestockUpdate = '/api/v1/livestock/update';
  static const String livestockDelete = '/api/v1/livestock/delete';
  
  // ================= HEALTH =================
  static const String healthRecords = '/api/v1/health/records';
  static const String healthAdd = '/api/v1/health/add';
  static const String vaccinationSchedule = '/api/v1/health/vaccination';
  
  // ================= BREEDING =================
  static const String breeding = '/api/v1/breeding';
  static const String breedingStats = '/api/v1/breeding/stats';
  static const String breedingAdd = '/api/v1/breeding/add';
  
  // ================= FEED =================
  static const String feedInventory = '/api/v1/feed/inventory';
  static const String feedAdd = '/api/v1/feed/add';
  static const String feedConsumption = '/api/v1/feed/consumption';
  
  // ================= AI =================
  static const String aiChat = '/api/v1/ai/chat';
  static const String aiInsights = '/api/v1/ai/insights';
  static const String aiPredict = '/api/v1/ai/predict';
  static const String aiHealthCheck = '/api/v1/ai/health-check';
  
  // ================= NOTIFICATION =================
  static const String notifications = '/api/v1/notifications';
  static const String notificationCount = '/api/v1/notifications/count';
  static const String markRead = '/api/v1/notifications/mark-read';
  
  // ================= MEMBERSHIP =================
  static const String membership = '/api/v1/membership';
  static const String membershipPoints = '/api/v1/membership/points';
  static const String membershipHistory = '/api/v1/membership/history';
  
  // ================= IoT =================
  static const String iotDevices = '/api/v1/iot/devices';
  static const String iotData = '/api/v1/iot/data';
  static const String iotControl = '/api/v1/iot/control';
}
