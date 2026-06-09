// lib/features/marketplace/presentation/screens/marketplace_screen.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:dio/dio.dart';
import 'package:intl/intl.dart';

import '../../../../core/constants/app_constants.dart';
import '../../../../core/services/api_client.dart';

class MarketplaceScreen extends StatefulWidget {
  const MarketplaceScreen({super.key});

  @override
  State<MarketplaceScreen> createState() => _MarketplaceScreenState();
}

class _MarketplaceScreenState extends State<MarketplaceScreen> {
  bool _isLoading = true;
  List<dynamic> _products = [];
  String _searchQuery = '';
  String _selectedCategory = 'Semua';
  final List<String> _categories = ['Semua', 'Sayuran', 'Buah', 'Padi', 'Jagung', 'Cabai', 'Hortikultura'];

  @override
  void initState() {
    super.initState();
    _loadProducts();
  }

  Future<void> _loadProducts() async {
    setState(() => _isLoading = true);

    try {
      const storage = FlutterSecureStorage();
      final token = await storage.read(key: AppConstants.tokenKey);

      final apiClient = ApiClient();
      if (token != null && token.isNotEmpty) {
        apiClient.setAuthToken(token);
      }

      final response = await apiClient.get('/products');

      if (response.statusCode == 200) {
        final data = response.data;
        
        // Handle berbagai kemungkinan struktur response
        List<dynamic> productList = [];
        
        if (data['data'] is List) {
          productList = data['data'] as List;
        } else if (data is List) {
          productList = data;
        } else if (data['products'] is List) {
          productList = data['products'] as List;
        } else {
          productList = [];
        }
        
        // Sanitasi data: ganti null dengan default value
        final sanitizedList = productList.map((item) {
          return {
            'id': item['id'] ?? 0,
            'name': item['name']?.toString() ?? 'Produk Tidak Diketahui',
            'price': item['price'] ?? 0,
            'stock': item['stock'] ?? 0,
            'category': item['category']?.toString() ?? 'Lainnya',
            'farmer': item['farmer']?.toString() ?? item['user_name']?.toString() ?? 'Petani',
            'location': item['location']?.toString() ?? item['city']?.toString() ?? 'Indonesia',
            'image': item['image']?.toString(),
            'rating': item['rating'] ?? item['rating_avg'] ?? 0.0,
          };
        }).toList();
        
        setState(() {
          _products = sanitizedList;
          _isLoading = false;
        });
      } else {
        _setMockData();
      }
    } catch (e) {
      debugPrint('Error loading products: $e');
      _setMockData();
    }
  }

  void _setMockData() {
    setState(() {
      _products = [
        {'id': 1, 'name': 'Cabai Merah Keriting', 'price': 35000, 'stock': 150, 'category': 'Cabai', 'farmer': 'Kelompok Tani Makmur', 'location': 'Malang', 'image': null, 'rating': 4.8},
        {'id': 2, 'name': 'Bawang Merah', 'price': 28000, 'stock': 200, 'category': 'Sayuran', 'farmer': 'Tani Sejahtera', 'location': 'Brebes', 'image': null, 'rating': 4.5},
        {'id': 3, 'name': 'Beras Premium', 'price': 12000, 'stock': 500, 'category': 'Padi', 'farmer': 'Gapoktan Sumber Rezeki', 'location': 'Karawang', 'image': null, 'rating': 4.9},
        {'id': 4, 'name': 'Jagung Manis', 'price': 8000, 'stock': 300, 'category': 'Jagung', 'farmer': 'Petani Milenial', 'location': 'Lampung', 'image': null, 'rating': 4.7},
        {'id': 5, 'name': 'Tomat Cherry', 'price': 25000, 'stock': 100, 'category': 'Sayuran', 'farmer': 'Agro Lestari', 'location': 'Bandung', 'image': null, 'rating': 4.6},
      ];
      _isLoading = false;
    });
  }

  List<dynamic> get _filteredProducts {
    var filtered = _products;
    
    if (_selectedCategory != 'Semua') {
      filtered = filtered.where((p) {
        final category = p['category']?.toString().toLowerCase() ?? '';
        return category == _selectedCategory.toLowerCase();
      }).toList();
    }
    
    if (_searchQuery.isNotEmpty) {
      filtered = filtered.where((p) {
        final name = p['name']?.toString().toLowerCase() ?? '';
        final farmer = p['farmer']?.toString().toLowerCase() ?? '';
        final query = _searchQuery.toLowerCase();
        return name.contains(query) || farmer.contains(query);
      }).toList();
    }
    
    return filtered;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF021A14),
      appBar: AppBar(
        title: Text(
          'Marketplace',
          style: GoogleFonts.poppins(
            color: Colors.white,
            fontWeight: FontWeight.w600,
          ),
        ),
        centerTitle: true,
        backgroundColor: const Color(0xFF021A14),
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.shopping_cart_outlined, color: Colors.white),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Fitur keranjang segera hadir')),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(16),
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.05),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withOpacity(0.1)),
              ),
              child: TextField(
                onChanged: (value) => setState(() => _searchQuery = value),
                style: GoogleFonts.poppins(color: Colors.white),
                decoration: InputDecoration(
                  prefixIcon: const Icon(Icons.search, color: Colors.white54),
                  hintText: 'Cari produk atau petani...',
                  hintStyle: GoogleFonts.poppins(color: Colors.white54),
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.all(16),
                  suffixIcon: _searchQuery.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear, color: Colors.white54),
                          onPressed: () => setState(() => _searchQuery = ''),
                        )
                      : null,
                ),
              ),
            ),
          ),

          // Category Filter
          SizedBox(
            height: 45,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _categories.length,
              itemBuilder: (context, index) {
                final category = _categories[index];
                final isSelected = _selectedCategory == category;
                
                return Padding(
                  padding: const EdgeInsets.only(right: 12),
                  child: FilterChip(
                    label: Text(category),
                    selected: isSelected,
                    onSelected: (_) => setState(() => _selectedCategory = category),
                    backgroundColor: Colors.white.withOpacity(0.05),
                    selectedColor: const Color(0xFF1B8F3E),
                    labelStyle: GoogleFonts.poppins(
                      color: isSelected ? Colors.white : Colors.white70,
                    ),
                    shape: StadiumBorder(
                      side: BorderSide(
                        color: isSelected ? Colors.transparent : Colors.white.withOpacity(0.2),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          const SizedBox(height: 16),

          // Product List
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator(color: Color(0xFF1B8F3E)))
                : _filteredProducts.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.search_off, size: 64, color: Colors.white.withOpacity(0.3)),
                            const SizedBox(height: 16),
                            Text(
                              'Produk tidak ditemukan',
                              style: GoogleFonts.poppins(color: Colors.white54),
                            ),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _loadProducts,
                        color: const Color(0xFF1B8F3E),
                        child: ListView.builder(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          itemCount: _filteredProducts.length,
                          itemBuilder: (context, index) {
                            final product = _filteredProducts[index];
                            return _productCard(product);
                          },
                        ),
                      ),
          ),
        ],
      ),
    );
  }

  Widget _productCard(Map<String, dynamic> product) {
    // Safe get values with default
    final name = product['name']?.toString() ?? 'Produk';
    final price = (product['price'] ?? 0).toDouble();
    final stock = product['stock'] ?? 0;
    final farmer = product['farmer']?.toString() ?? 'Petani';
    final location = product['location']?.toString() ?? 'Indonesia';
    final rating = (product['rating'] ?? 0.0).toDouble();
    final category = product['category']?.toString() ?? 'Lainnya';
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Row(
        children: [
          // Product Image Placeholder
          Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.1),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(20),
                bottomLeft: Radius.circular(20),
              ),
            ),
            child: Center(
              child: Icon(Icons.image, color: Colors.white38, size: 40),
            ),
          ),
          
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: GoogleFonts.poppins(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Icon(Icons.store, size: 12, color: Colors.white.withOpacity(0.5)),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          farmer,
                          style: GoogleFonts.poppins(
                            color: Colors.white.withOpacity(0.5),
                            fontSize: 11,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      Icon(Icons.location_on, size: 12, color: Colors.white.withOpacity(0.5)),
                      const SizedBox(width: 4),
                      Text(
                        location,
                        style: GoogleFonts.poppins(
                          color: Colors.white.withOpacity(0.5),
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(Icons.star, size: 14, color: rating >= 4.0 ? Colors.amber : Colors.white54),
                      const SizedBox(width: 4),
                      Text(
                        rating.toStringAsFixed(1),
                        style: GoogleFonts.poppins(
                          color: Colors.white70,
                          fontSize: 12,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        width: 4,
                        height: 4,
                        decoration: const BoxDecoration(
                          color: Colors.white38,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Stok: $stock',
                        style: GoogleFonts.poppins(
                          color: Colors.white70,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Rp ${NumberFormat('#,###').format(price)}',
                        style: GoogleFonts.poppins(
                          color: const Color(0xFF1B8F3E),
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('$name ditambahkan ke keranjang'),
                              backgroundColor: Colors.green,
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF1B8F3E),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          minimumSize: const Size(90, 35),
                        ),
                        child: const Text(
                          'Beli',
                          style: TextStyle(color: Colors.white),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}