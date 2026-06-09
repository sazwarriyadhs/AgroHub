// lib/core/config/api_config.dart
class ApiConfig {
  static const String baseUrl = 'http://localhost:8900';
  static const String baseUrlSocket = 'http://localhost:8900';
  
  // Auth
  static const String login = '/api/v1/public/login';
  static const String register = '/api/v1/public/register';
  static const String profile = '/api/v1/profile';
  
  // Pond
  static const String pond = '/api/v1/aquaculture/pond';
  static const String pondAdd = '/api/v1/aquaculture/pond/add';
  static const String pondDetail = '/api/v1/aquaculture/pond/detail';
  
  // Water Quality
  static const String waterQuality = '/api/v1/aquaculture/water-quality';
  
  // Monitoring
  static const String monitoring = '/api/v1/aquaculture/monitoring';
  static const String realtime = '/api/v1/aquaculture/realtime';
  
  // AI
  static const String aiChat = '/api/v1/ai/chat';
  static const String aiPrediction = '/api/v1/ai/prediction';
  
  // Feeding
  static const String feeding = '/api/v1/aquaculture/feeding';
  static const String feedingSchedule = '/api/v1/aquaculture/feeding/schedule';
  
  // Harvest
  static const String harvest = '/api/v1/aquaculture/harvest';
  static const String harvestEstimation = '/api/v1/aquaculture/harvest/estimation';
  
  // Marketplace
  static const String products = '/api/v1/products';
  static const String addProduct = '/api/v1/products/add';
  
  // Wallet
  static const String wallet = '/api/v1/wallet';
  static const String transactions = '/api/v1/wallet/transactions';
}




