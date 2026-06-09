// lib/core/constants/assets_constants.dart
import 'package:flutter/material.dart';  // ✅ TAMBAHKAN INI

class AssetConstants {
  // Logo & Brand
  static const String logo = 'assets/logo/logo-agrohub.png';
  static const String logoAgrohub = 'assets/logo/logo-agrohub.png';
  
  // Images
  static const String farmer = 'assets/farmer/farmer.png';
  static const String splashBg = 'assets/images/splash_bg.png';
  static const String loginBg = 'assets/images/login_bg.png';
  
  // Additional images
  static const String aiInsight = 'assets/images/aiinsight.png';
  static const String card = 'assets/images/card.png';
  static const String dokterAi = 'assets/images/dokterai.png';
  static const String dokterChat = 'assets/images/dokterchat.png';
  static const String farmerJpg = 'assets/images/farmer.jpg';
  static const String farmer1 = 'assets/images/farmer1.webp';
  static const String farmer2 = 'assets/images/farmer2.webp';
  static const String farmer3 = 'assets/images/farmer3.webp';
  static const String farmer4 = 'assets/images/farmer4.webp';
  static const String farmer5 = 'assets/images/farmer5.webp';
  static const String gmv = 'assets/images/gmv.png';
  static const String loginBgImage = 'assets/images/login_bg.png';
  static const String splashBgImage = 'assets/images/splash_bg.png';
  
  // Panen/Harvest images
  static const String panen1 = 'assets/panen/panen1.webp';
  static const String panen2 = 'assets/panen/panen2.webp';
  static const String panen3 = 'assets/panen/panen3.webp';
  static const String communityBanner = 'assets/panen/community_banner.webp';
  
  // Menu Icons
  static const String menuProduk = 'assets/menu/produk.png';
  static const String menuOrder = 'assets/menu/order.png';
  static const String menuInsight = 'assets/menu/insight.png';
  static const String menuWallet = 'assets/menu/wallet.png';
  static const String menuKomunitas = 'assets/menu/komunitas.png';
  static const String menuAgrolive = 'assets/menu/agrolive.png';
  
  // Menu Icons (alternative folder)
  static const String menuIconProduk = 'assets/menu_icons/produk.png';
  static const String menuIconOrder = 'assets/menu_icons/order.png';
  static const String menuIconInsight = 'assets/menu_icons/insight.png';
  static const String menuIconWallet = 'assets/menu_icons/wallet.png';
  static const String menuIconKomunitas = 'assets/menu_icons/komunitas.png';
  static const String menuIconAgrolive = 'assets/menu_icons/agrolive.png';
  
  // Animations
  static const String scanningAnimation = 'assets/scanning_animation.json';
  static const String uploadAnimation = 'assets/upload_animation.json';
  
  // ==================== HELPER METHODS ====================
  
  /// Get random farmer image for testing/demo
  static String getRandomFarmerImage() {
    final images = [farmer1, farmer2, farmer3, farmer4, farmer5];
    return images[DateTime.now().millisecondsSinceEpoch % images.length];
  }
  
  /// Get panen image by index (for carousel/grid)
  static String getPanenImage(int index) {
    switch (index % 3) {
      case 0: return panen1;
      case 1: return panen2;
      default: return panen3;
    }
  }
  
  /// Get icon for quick action menu
  static IconData getQuickActionIcon(String action) {
    switch (action.toLowerCase()) {
      case 'jual':
      case 'sell':
        return Icons.sell;
      case 'beli':
      case 'buy':
        return Icons.shopping_bag;
      case 'tugas':
      case 'task':
        return Icons.assignment;
      case 'tanaman':
      case 'crop':
        return Icons.grass;
      case 'cuaca':
      case 'weather':
        return Icons.wb_sunny;
      case 'komunitas':
      case 'community':
        return Icons.people;
      default:
        return Icons.touch_app;
    }
  }
  
  /// Get category icon for crop types
  static IconData getCropIcon(String cropType) {
    switch (cropType.toLowerCase()) {
      case 'padi':
      case 'rice':
        return Icons.grass;
      case 'jagung':
      case 'corn':
        return Icons.agriculture;
      case 'cabai':
      case 'chili':
        return Icons.local_fire_department;
      case 'bawang':
      case 'onion':
        return Icons.circle;
      default:
        return Icons.eco;
    }
  }
  
  /// Get gradient for hero banner based on crop type
  static List<Color> getHeroGradient(String cropType) {
    switch (cropType.toLowerCase()) {
      case 'padi':
        return [const Color(0xFF2E7D32), const Color(0xFF1B5E20)];
      case 'jagung':
        return [const Color(0xFFF9A825), const Color(0xFFF57F17)];
      case 'cabai':
        return [const Color(0xFFD32F2F), const Color(0xFFB71C1C)];
      default:
        return [const Color(0xFF2E7D32), const Color(0xFF1B5E20)];
    }
  }
}