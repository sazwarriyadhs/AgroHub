import 'package:flutter/material.dart';
import 'package:agrohub_customer/services/http_service.dart';
import 'package:agrohub_customer/config/api_config.dart';
import 'package:agrohub_customer/utils/image_helper.dart';
import 'package:agrohub_customer/features/marketplace/models/product_model.dart';

class ProductProvider extends ChangeNotifier {
  // ==================== DATA STORES ====================
  List<Map<String, dynamic>> _products = [];
  List<Map<String, dynamic>> _categories = [];
  List<Map<String, dynamic>> _bestSellingProducts = [];
  List<Map<String, dynamic>> _flashSaleProducts = [];
  List<Map<String, dynamic>> _homeFeedProducts = [];
  final Map<int, List<Map<String, dynamic>>> _popularProductsByCategory = {};
  
  // ==================== STATE ====================
  bool _isLoading = false;
  bool _isLoadingCategories = false;
  bool _isLoadingPopular = false;
  String? _error;
  
  // Cache untuk menghindari reload berulang
  DateTime? _lastFetchTime;
  static const Duration _cacheDuration = Duration(minutes: 5);
  
  // ==================== GETTERS ====================
  List<Map<String, dynamic>> get products => _products;
  List<Map<String, dynamic>> get categories => _categories;
  List<Map<String, dynamic>> get bestSellingProducts => _bestSellingProducts;
  List<Map<String, dynamic>> get flashSaleProducts => _flashSaleProducts;
  List<Map<String, dynamic>> get homeFeedProducts => _homeFeedProducts;
  Map<int, List<Map<String, dynamic>>> get popularProductsByCategory => _popularProductsByCategory;
  
  bool get isLoading => _isLoading;
  bool get isLoadingCategories => _isLoadingCategories;
  bool get isLoadingPopular => _isLoadingPopular;
  String? get error => _error;
  
  // Check if cache is still valid
  bool get hasValidCache {
    if (_lastFetchTime == null) return false;
    return DateTime.now().difference(_lastFetchTime!) < _cacheDuration;
  }
  
  // ==================== HELPER METHODS ====================
  
  String getProductImage(Map<String, dynamic> product) {
    return ImageHelper.getProductImageFromMap(product);
  }
  
  int getFinalPrice(Map<String, dynamic> product) {
    final price = (product['price'] ?? 0).toInt();
    final discount = (product['discount'] ?? 0).toInt();
    if (discount > 0) {
      return price - ((price * discount) ~/ 100);
    }
    final flashPrice = product['flash_sale_price'];
    if (flashPrice != null && flashPrice > 0) {
      return flashPrice.toInt();
    }
    return price;
  }
  
  int getDiscountPercent(Map<String, dynamic> product) {
    final discount = (product['discount'] ?? 0).toInt();
    if (discount > 0 && discount <= 100) return discount;
    return 0;
  }
  
  bool isOnSale(Map<String, dynamic> product) {
    return getDiscountPercent(product) > 0;
  }
  
  double getRating(Map<String, dynamic> product) {
    return (product['rating'] ?? 0).toDouble();
  }
  
  List<Map<String, dynamic>> byCategory(int categoryId) {
    return _products
        .where((p) => (p['category_id'] ?? 0).toInt() == categoryId)
        .toList();
  }
  
  List<Map<String, dynamic>> getPopularByCategory(int categoryId) {
    return _popularProductsByCategory[categoryId] ?? [];
  }
  
  List<Map<String, dynamic>> byCategoryName(String categoryName) {
    final category = _categories.firstWhere(
      (c) => c['name'].toString().toLowerCase() == categoryName.toLowerCase(),
      orElse: () => {},
    );
    final categoryId = category['id'] ?? 0;
    return byCategory(categoryId);
  }
  
  List<Map<String, dynamic>> searchProducts(String query) {
    if (query.isEmpty) return [];
    final lowerQuery = query.toLowerCase();
    return _products.where((product) {
      final name = (product['name'] ?? '').toLowerCase();
      final category = (product['category_name'] ?? '').toLowerCase();
      return name.contains(lowerQuery) || category.contains(lowerQuery);
    }).toList();
  }
  
  List<Map<String, dynamic>> get topRatedProducts {
    final sorted = List<Map<String, dynamic>>.from(_products);
    sorted.sort((a, b) {
      final aRating = (a['rating'] ?? 0).toDouble();
      final bRating = (b['rating'] ?? 0).toDouble();
      return bRating.compareTo(aRating);
    });
    return sorted.take(5).toList();
  }
  
  // ==================== API CALLS ====================
  
  /// 🔥 MAIN FETCH - Mengambil semua data dashboard secara paralel
  Future<void> fetchDashboardData({bool forceRefresh = false}) async {
    // Check cache first
    if (!forceRefresh && hasValidCache && _products.isNotEmpty) {
      print('✅ Using cached dashboard data');
      return;
    }
    
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      // Menjalankan fetch secara paralel untuk performa maksimal
      await Future.wait([
        fetchProducts(forceRefresh: forceRefresh),
        fetchCategories(forceRefresh: forceRefresh),
        fetchPopularProductsByCategory(forceRefresh: forceRefresh),
      ]);
      
      _lastFetchTime = DateTime.now();
      print('✅ Dashboard data loaded successfully');
      print('✅ Products: ${_products.length}');
      print('✅ Categories: ${_categories.length}');
      print('✅ Best selling: ${_bestSellingProducts.length}');
      print('✅ Flash sale: ${_flashSaleProducts.length}');
    } catch (e) {
      _error = e.toString();
      print('❌ Error loading dashboard: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  /// 🔥 Fetch Utama Produk & Normalisasi Data
  Future<void> fetchProducts({bool forceRefresh = false}) async {
    // Skip if cache is valid
    if (!forceRefresh && hasValidCache && _products.isNotEmpty) {
      return;
    }
    
    try {
      final response = await HttpService.get(
        '${ApiConfig.products}?sort=best_selling&limit=30'
      );
      
      if (response.statusCode == 200) {
        final data = response.data;
        final List productsData = data['data'] ?? data;
        
        _products = productsData.map((item) {
          // Melakukan deep copy map untuk menghindari kontaminasi memori
          final Map<String, dynamic> product = Map<String, dynamic>.from(item);
          
          // Normalisasi data
          product['sold_count'] = (product['sold'] ?? 0).toInt();
          product['rating_avg'] = (product['rating'] ?? 0).toDouble();
          product['discount_percent'] = (product['discount'] ?? 0).toInt();
          product['is_flash_sale'] = product['discount_percent'] > 0;
          product['final_price'] = getFinalPrice(product);
          
          return product;
        }).toList();
        
        // Distribusikan data hasil normalisasi ke penampung masing-masing
        _updateBestSellingProducts();
        _updateFlashSaleProducts();
        _updateHomeFeedProducts();
        
        print('✅ Products fetched and normalized: ${_products.length}');
      } else {
        throw Exception('Failed to load products: ${response.statusCode}');
      }
    } catch (e) {
      print('❌ Error fetching products: $e');
      rethrow;
    }
  }
  
  /// 🔥 Fetch Kategori
  Future<void> fetchCategories({bool forceRefresh = false}) async {
    // Skip if cache is valid
    if (!forceRefresh && _categories.isNotEmpty) {
      return;
    }
    
    _isLoadingCategories = true;
    notifyListeners();
    
    try {
      final response = await HttpService.get(ApiConfig.categories);
      
      if (response.statusCode == 200) {
        final data = response.data;
        final List categoriesData = data['data'] ?? data;
        
        _categories = categoriesData.map((item) {
          return Map<String, dynamic>.from(item);
        }).toList();
        
        print('✅ Categories fetched: ${_categories.length}');
      } else {
        throw Exception('Failed to load categories: ${response.statusCode}');
      }
    } catch (e) {
      print('❌ Error fetching categories: $e');
    } finally {
      _isLoadingCategories = false;
      notifyListeners();
    }
  }
  
  /// 🔥 Fetch Populer per Kategori (Query #6)
  Future<void> fetchPopularProductsByCategory({bool forceRefresh = false}) async {
    // Skip if cache is valid
    if (!forceRefresh && _popularProductsByCategory.isNotEmpty) {
      return;
    }
    
    _isLoadingPopular = true;
    notifyListeners();
    
    try {
      final response = await HttpService.get(
        '${ApiConfig.products}?group_by_category=true&limit_per_category=3'
      );
      
      if (response.statusCode == 200) {
        final data = response.data;
        final Map<String, dynamic> groupedData = Map<String, dynamic>.from(data['data'] ?? {});
        
        _popularProductsByCategory.clear();
        
        groupedData.forEach((key, value) {
          final categoryId = int.tryParse(key) ?? 0;
          final List productsList = value as List;
          
          _popularProductsByCategory[categoryId] = productsList.map((item) {
            final product = Map<String, dynamic>.from(item);
            product['final_price'] = getFinalPrice(product);
            return product;
          }).toList();
        });
        
        print('✅ Popular products by category loaded: ${_popularProductsByCategory.length} categories');
      } else {
        _generatePopularProductsFromProducts();
      }
    } catch (e) {
      print('❌ Error fetching popular products: $e');
      _generatePopularProductsFromProducts(); // Fallback otomatis
    } finally {
      _isLoadingPopular = false;
      notifyListeners();
    }
  }
  
  /// 🔥 Fetch single category products
  Future<List<Map<String, dynamic>>> fetchCategoryProducts(int categoryId) async {
    try {
      final response = await HttpService.get(
        '${ApiConfig.products}?category_id=$categoryId&limit=20'
      );
      
      if (response.statusCode == 200) {
        final data = response.data;
        final List productsData = data['data'] ?? data;
        return productsData.map((item) => Map<String, dynamic>.from(item)).toList();
      }
    } catch (e) {
      print('❌ Error fetching category products: $e');
    }
    return byCategory(categoryId);
  }

  // ==================== FALLBACK METHODS ====================
  
  void _updateBestSellingProducts() {
    // Membuat list baru berisi salinan map yang mandiri
    final List<Map<String, dynamic>> sorted = _products.map((e) => Map<String, dynamic>.from(e)).toList();
    
    sorted.sort((a, b) {
      final int bSold = b['sold_count'] ?? 0;
      final int aSold = a['sold_count'] ?? 0;
      if (bSold != aSold) return bSold.compareTo(aSold);
      
      final double bRating = b['rating_avg'] ?? 0.0;
      final double aRating = a['rating_avg'] ?? 0.0;
      if (bRating != aRating) return bRating.compareTo(aRating);
      
      final int bDiscount = b['discount_percent'] ?? 0;
      final int aDiscount = a['discount_percent'] ?? 0;
      return bDiscount.compareTo(aDiscount);
    });
    
    _bestSellingProducts = sorted.take(10).toList();
  }
  
  void _updateFlashSaleProducts() {
    final filtered = _products
        .where((p) => (p['discount_percent'] ?? 0) > 0)
        .map((e) => Map<String, dynamic>.from(e))
        .toList();
    
    filtered.sort((a, b) {
      final int bDiscount = b['discount_percent'] ?? 0;
      final int aDiscount = a['discount_percent'] ?? 0;
      if (bDiscount != aDiscount) return bDiscount.compareTo(aDiscount);
      
      final int bSold = b['sold_count'] ?? 0;
      final int aSold = a['sold_count'] ?? 0;
      return bSold.compareTo(aSold);
    });
    
    _flashSaleProducts = filtered.take(10).toList();
  }
  
  void _updateHomeFeedProducts() {
    final List<Map<String, dynamic>> sorted = _products.map((e) => Map<String, dynamic>.from(e)).toList();
    
    sorted.sort((a, b) {
      final int aSold = a['sold_count'] ?? 0;
      final int bSold = b['sold_count'] ?? 0;
      
      // Prioritaskan best seller (>50 sold)
      if (bSold > 50 && aSold <= 50) return 1; 
      if (aSold > 50 && bSold <= 50) return -1;
      
      // Kemudian produk dengan diskon
      final int aDiscount = a['discount_percent'] ?? 0;
      final int bDiscount = b['discount_percent'] ?? 0;
      if (bDiscount > 0 && aDiscount == 0) return 1;
      if (aDiscount > 0 && bDiscount == 0) return -1;
      
      // Terakhir berdasarkan sold
      return bSold.compareTo(aSold);
    });
    
    _homeFeedProducts = sorted.take(30).toList();
  }
  
  void _generatePopularProductsFromProducts() {
    _popularProductsByCategory.clear();
    final Map<int, List<Map<String, dynamic>>> grouped = {};
    
    for (var product in _products) {
      final categoryId = (product['category_id'] ?? 0).toInt();
      if (categoryId == 0) continue;
      
      if (!grouped.containsKey(categoryId)) {
        grouped[categoryId] = [];
      }
      grouped[categoryId]!.add(Map<String, dynamic>.from(product));
    }
    
    grouped.forEach((categoryId, productsList) {
      productsList.sort((a, b) {
        final int bSold = b['sold_count'] ?? 0;
        final int aSold = a['sold_count'] ?? 0;
        return bSold.compareTo(aSold);
      });
      
      _popularProductsByCategory[categoryId] = productsList.take(3).toList();
    });
    
    print('⚠️ Fallback: Berhasil generate popular products dari lokal memory');
  }
  
  // ==================== SINGLE PRODUCT ====================
  
  Future<Map<String, dynamic>?> getProductById(int id) async {
    try {
      // Cari di lokal cache dulu biar instan
      return _products.firstWhere((p) => p['id'] == id);
    } catch (e) {
      // Jika tidak ada di cache, tembak API spesifik
      try {
        final response = await HttpService.get('${ApiConfig.products}/$id');
        if (response.statusCode == 200) {
          final data = response.data;
          final productData = data['data'] ?? data;
          if (productData is Map<String, dynamic>) {
            final product = Map<String, dynamic>.from(productData);
            product['final_price'] = getFinalPrice(product);
            return product;
          }
        }
      } catch (apiError) {
        print('❌ Error fetching product id $id dari API: $apiError');
      }
      return null;
    }
  }
  
  // ==================== UTILITY ====================
  
  void clearError() {
    _error = null;
    notifyListeners();
  }
  
  // 🔥 FIXED: Refresh method that returns Future
  Future<void> refresh() async {
    await fetchDashboardData(forceRefresh: true);
  }
  
  // Optional: Manual refresh for specific sections
  Future<void> refreshProducts() async {
    await fetchProducts(forceRefresh: true);
  }
  
  Future<void> refreshCategories() async {
    await fetchCategories(forceRefresh: true);
  }
  
  Future<void> refreshPopularProducts() async {
    await fetchPopularProductsByCategory(forceRefresh: true);
  }
  
  // Clear all cache
  void clearCache() {
    _products.clear();
    _categories.clear();
    _bestSellingProducts.clear();
    _flashSaleProducts.clear();
    _homeFeedProducts.clear();
    _popularProductsByCategory.clear();
    _lastFetchTime = null;
    notifyListeners();
  }
  
  // Get product count by category
  Map<int, int> getProductCountByCategory() {
    final Map<int, int> countMap = {};
    for (var product in _products) {
      final categoryId = (product['category_id'] ?? 0).toInt();
      if (categoryId > 0) {
        countMap[categoryId] = (countMap[categoryId] ?? 0) + 1;
      }
    }
    return countMap;
  }
}