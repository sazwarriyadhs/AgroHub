// lib/utils/image_helper.dart
import 'package:flutter/material.dart';
import 'package:agrohub_customer/config/api_config.dart';

class ImageHelper {
  // 🔥 Base URL untuk gambar (sesuaikan dengan backend Anda)
  static String get baseImageUrl {
    // Gunakan baseUrl dari ApiConfig
    return ApiConfig.baseUrl;
  }
  
  // 🔥 Method utama untuk mendapatkan URL gambar dari product
  static String getProductImageFromMap(Map<String, dynamic> product) {
    if (product == null) return _getPlaceholderUrl();
    
    // Coba ambil dari berbagai kemungkinan field name
    String? imagePath = product['image_url'] ?? 
                        product['image'] ?? 
                        product['product_image'] ??
                        product['photo'] ??
                        product['picture'];
    
    // Jika tidak ada gambar, return placeholder
    if (imagePath == null || imagePath.isEmpty) {
      return _getPlaceholderUrl();
    }
    
    // 🔥 Jika sudah full URL (http/https), return langsung
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // 🔥 Jika path dimulai dengan '/', tambahkan baseUrl
    if (imagePath.startsWith('/')) {
      return '$baseImageUrl$imagePath';
    }
    
    // 🔥 Jika hanya nama file (tanpa slash), tambahkan baseUrl dan slash
    return '$baseImageUrl/$imagePath';
  }
  
  // 🔥 Method untuk mendapatkan URL gambar dari string path
  static String getImageUrl(String? imagePath) {
    if (imagePath == null || imagePath.isEmpty) {
      return _getPlaceholderUrl();
    }
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/')) {
      return '$baseImageUrl$imagePath';
    }
    
    return '$baseImageUrl/$imagePath';
  }
  
  // 🔥 Placeholder URL (gunakan asset lokal atau network)
  static String _getPlaceholderUrl() {
    // Option 1: Network placeholder (free)
    return 'https://via.placeholder.com/300x300?text=No+Image';
    
    // Option 2: Asset lokal (uncomment jika pakai asset)
    // return 'assets/images/placeholder_product.png';
  }
  
  // 🔥 Widget untuk menampilkan network image dengan loading dan error state
  static Widget buildNetworkImage(
    String url, {
    double? width,
    double? height,
    BoxFit fit = BoxFit.cover,
    BorderRadius borderRadius = const BorderRadius.all(Radius.circular(0)),
  }) {
    if (url.isEmpty) {
      return _buildPlaceholder(width, height, borderRadius);
    }
    
    return ClipRRect(
      borderRadius: borderRadius,
      child: Image.network(
        url,
        width: width,
        height: height,
        fit: fit,
        errorBuilder: (context, error, stackTrace) {
          print('❌ Image error: $url -> $error');
          return _buildPlaceholder(width, height, borderRadius);
        },
        loadingBuilder: (context, child, loadingProgress) {
          if (loadingProgress == null) return child;
          return _buildLoadingPlaceholder(width, height, borderRadius);
        },
      ),
    );
  }
  
  // 🔥 Widget dengan CachedNetworkImage (lebih baik untuk performa)
  // Install: flutter pub add cached_network_image
  static Widget buildCachedImage(
    String url, {
    double? width,
    double? height,
    BoxFit fit = BoxFit.cover,
    BorderRadius borderRadius = const BorderRadius.all(Radius.circular(0)),
  }) {
    // Jika ingin pakai cached_network_image, uncomment dan tambahkan dependency
    // return CachedNetworkImage(
    //   imageUrl: url,
    //   width: width,
    //   height: height,
    //   fit: fit,
    //   placeholder: (context, url) => _buildLoadingPlaceholder(width, height, borderRadius),
    //   errorWidget: (context, url, error) => _buildPlaceholder(width, height, borderRadius),
    // );
    
    // Fallback ke buildNetworkImage
    return buildNetworkImage(url, width: width, height: height, fit: fit, borderRadius: borderRadius);
  }
  
  // 🔥 Placeholder widget untuk loading
  static Widget _buildLoadingPlaceholder(double? width, double? height, BorderRadius borderRadius) {
    return ClipRRect(
      borderRadius: borderRadius,
      child: Container(
        width: width,
        height: height,
        color: Colors.grey.shade100,
        child: const Center(
          child: CircularProgressIndicator(
            strokeWidth: 2,
            valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF007A37)),
          ),
        ),
      ),
    );
  }
  
  // 🔥 Placeholder widget untuk error / no image
  static Widget _buildPlaceholder(double? width, double? height, BorderRadius borderRadius) {
    return ClipRRect(
      borderRadius: borderRadius,
      child: Container(
        width: width,
        height: height,
        color: Colors.grey.shade200,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.image_not_supported,
              size: (width ?? 50) * 0.3,
              color: Colors.grey.shade400,
            ),
            const SizedBox(height: 4),
            Text(
              'No Image',
              style: TextStyle(
                fontSize: (width ?? 50) * 0.08,
                color: Colors.grey.shade500,
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  // 🔥 Method untuk validasi URL gambar
  static bool isValidImageUrl(String? url) {
    if (url == null || url.isEmpty) return false;
    return url.startsWith('http') || url.startsWith('/');
  }
  
  // 🔥 Method untuk mendapatkan ekstensi file gambar
  static String getImageExtension(String url) {
    if (!url.contains('.')) return '';
    return url.split('.').last.toLowerCase();
  }
  
  // 🔥 Method untuk cek apakah gambar valid (jpg, png, jpeg, webp)
  static bool isSupportedImage(String url) {
    final extension = getImageExtension(url);
    const supported = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    return supported.contains(extension);
  }
}