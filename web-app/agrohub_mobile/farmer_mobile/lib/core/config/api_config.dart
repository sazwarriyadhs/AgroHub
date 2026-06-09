// lib/core/config/api_config.dart
import 'package:flutter/foundation.dart';

class ApiConfig {
  static String get baseUrl {
    if (kIsWeb) {
      return "http://localhost:8900/api/v1";
    } else {
      return "http://10.0.2.2:8900/api/v1";
    }
  }
  
  // Auth
  static const String login = "/public/login";
  static const String register = "/public/register";
  static const String logout = "/logout";
  static const String profile = "/profile";
  
  // Dashboard
  static const String dashboardStats = "/dashboard/stats";
  
  // Products
  static const String products = "/public/products";
  static const String farmProducts = "/farm/products";
  
  // Market
  static const String commodityPrices = "/public/commodity-prices";
  
  // Others
  static const String notifications = "/notifications";
  static const String activities = "/activities/recent";
}