import 'package:flutter/foundation.dart';

class ApiConfig {
  ApiConfig._();

  // =========================
  // ENVIRONMENT
  // =========================

  static const bool isProduction = false;

  static String get baseUrl {
    if (isProduction) {
      return 'https://api.agrohub.id';
    }

    if (kIsWeb) {
      return 'http://localhost:8900';
    }

    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        // emulator android
        return 'http://10.0.2.2:8900';

      case TargetPlatform.iOS:
        // ios simulator
        return 'http://localhost:8900';

      default:
        return 'http://192.168.1.10:8900';
    }
  }

  // =========================
  // API VERSION
  // =========================

  static const String v1 = "/api/v1";

  // =========================
  // AUTH
  // =========================

  static const String login =
      "$v1/public/login";

  static const String register =
      "$v1/public/register";

  static const String logout =
      "$v1/logout";

  // =========================
  // PROFILE
  // =========================

  static const String profile =
      "$v1/profile";

  static const String wallet =
      "$v1/wallet";

  // =========================
  // PRODUCT
  // =========================

  static const String products =
      "$v1/public/products";

  static const String categories =
      "$v1/public/categories";

  static const String flashSale =
      "$v1/public/products/flash-sale";

  static const String featured =
      "$v1/public/products/featured";

  static const String nearby =
      "$v1/public/products/nearby";

  // =========================
  // CART
  // =========================

  static const String cartAdd =
      "$v1/cart/add";

  static const String cart =
      "$v1/cart";

  // =========================
  // URL BUILDER
  // =========================

  static String url(
    String endpoint,
  ) {
    return "$baseUrl$endpoint";
  }
}