// lib/features/marketplace/presentation/screens/category_detail_screen.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

// ✅ FIXED IMPORTS - Gunakan package import, bukan relative path
import 'package:agrohub_customer/features/marketplace/providers/product_provider.dart';
import 'package:agrohub_customer/utils/image_helper.dart';
import 'package:agrohub_customer/features/marketplace/presentation/screens/product_detail_screen.dart';

class CategoryDetailScreen extends StatefulWidget {
  final int categoryId;
  final String categoryName;

  const CategoryDetailScreen({
    super.key,
    required this.categoryId,
    required this.categoryName,
  });

  @override
  State<CategoryDetailScreen> createState() => _CategoryDetailScreenState();
}

class _CategoryDetailScreenState extends State<CategoryDetailScreen> {
  static const Color primaryGreen = Color(0xFF1B5E20);

  String _searchQuery = '';

  List<Map<String, dynamic>> _filterProducts(List<Map<String, dynamic>> products) {
    if (_searchQuery.isEmpty) return products;

    final query = _searchQuery.toLowerCase();

    return products.where((p) {
      final name = (p['name'] ?? '').toString().toLowerCase();
      return name.contains(query);
    }).toList();
  }

  String _formatPrice(dynamic price) {
    final value = price is int ? price : (price ?? 0).toInt();
    return value.toString().replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
      (m) => '${m[1]}.',
    );
  }

  int _getFinalPrice(Map<String, dynamic> product) {
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

  int _getDiscountPercent(Map<String, dynamic> product) {
    final price = (product['price'] ?? 0).toInt();
    final finalPrice = _getFinalPrice(product);
    if (price > finalPrice) {
      return ((price - finalPrice) * 100 ~/ price);
    }
    return product['discount'] ?? 0;
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ProductProvider>(
      builder: (context, provider, child) {
        final rawProducts = provider.byCategory(widget.categoryId);
        final products = _filterProducts(rawProducts);
        final isLoading = provider.isLoading;

        return Scaffold(
          backgroundColor: const Color(0xFFF5F7F2),

          appBar: AppBar(
            backgroundColor: Colors.white,
            elevation: 0,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back, color: Colors.black87),
              onPressed: () => Navigator.pop(context),
            ),
            title: Text(
              widget.categoryName,
              style: GoogleFonts.poppins(
                color: Colors.black,
                fontWeight: FontWeight.bold,
              ),
            ),
            centerTitle: true,
          ),

          body: isLoading && products.isEmpty
              ? const Center(
                  child: CircularProgressIndicator(
                    color: primaryGreen,
                  ),
                )
              : Column(
                  children: [
                    // 🔍 SEARCH BAR
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
                      child: TextField(
                        onChanged: (value) {
                          setState(() => _searchQuery = value);
                        },
                        decoration: InputDecoration(
                          hintText: 'Cari produk di kategori ini...',
                          hintStyle: GoogleFonts.poppins(
                            fontSize: 13,
                            color: Colors.grey.shade400,
                          ),
                          prefixIcon: const Icon(Icons.search, color: Colors.grey),
                          filled: true,
                          fillColor: Colors.white,
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: primaryGreen, width: 1.5),
                          ),
                        ),
                      ),
                    ),

                    // 🔥 GRID VIEW
                    Expanded(
                      child: products.isEmpty
                          ? _buildEmptyState()
                          : GridView.builder(
                              padding: const EdgeInsets.all(16),
                              itemCount: products.length,
                              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 2,
                                childAspectRatio: 0.72, // 🛠️ Disesuaikan sedikit agar muat teks nama & harga berjarak ideal
                                crossAxisSpacing: 12,
                                mainAxisSpacing: 12,
                              ),
                              itemBuilder: (context, index) {
                                return _buildProductCard(products[index]);
                              },
                            ),
                    ),
                  ],
                ),
        );
      },
    );
  }

  // ---------------- EMPTY STATE ----------------
  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.inventory_2_outlined,
            size: 64,
            color: Colors.grey.shade400,
          ),
          const SizedBox(height: 12),
          Text(
            'Belum ada produk di kategori ini',
            style: GoogleFonts.poppins(
              fontSize: 14,
              color: Colors.grey.shade500,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Coba cek kategori lain',
            style: GoogleFonts.poppins(
              fontSize: 12,
              color: Colors.grey.shade400,
            ),
          ),
        ],
      ),
    );
  }

  // ---------------- PRODUCT CARD ----------------
  Widget _buildProductCard(Map<String, dynamic> product) {
    final imageUrl = ImageHelper.getProductImageFromMap(product);
    final finalPrice = _getFinalPrice(product);
    final originalPrice = (product['price'] ?? 0).toInt();
    final discountPercent = _getDiscountPercent(product);
    final isOnSale = discountPercent > 0;
    
    final sold = (product['sold'] ?? 0).toInt();
    final rating = (product['rating'] ?? 0).toDouble();

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => ProductDetailScreen(productData: product),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ---------------- IMAGE SECTION ----------------
            // 🛠️ FIX: Mengganti Expanded dengan AspectRatio agar aman di dalam GridView tanpa parent Flex langsung
            AspectRatio(
              aspectRatio: 1.1, // Membuat proporsi tinggi gambar pas dan konsisten
              child: ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                child: Stack(
                  children: [
                    // Product Image
                    Image.network(
                      imageUrl,
                      width: double.infinity,
                      height: double.infinity,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(
                        color: Colors.grey.shade100,
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.image_not_supported,
                              size: 40,
                              color: Colors.grey.shade400,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'No Image',
                              style: GoogleFonts.poppins(
                                fontSize: 10,
                                color: Colors.grey.shade400,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    // 🔥 DISCOUNT BADGE
                    if (isOnSale)
                      Positioned(
                        top: 8,
                        left: 8,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                          decoration: BoxDecoration(
                            color: Colors.red,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            '-$discountPercent%',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),

                    // 🔥 SOLD BADGE
                    if (sold > 0)
                      Positioned(
                        bottom: 8,
                        left: 8,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: Colors.black.withOpacity(0.6),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            'Terjual $sold',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 9,
                            ),
                          ),
                        ),
                      ),

                    // 🔥 RATING BADGE
                    if (rating > 0)
                      Positioned(
                        bottom: 8,
                        right: 8,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: Colors.amber.withOpacity(0.9),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(
                                Icons.star,
                                size: 10,
                                color: Colors.white,
                              ),
                              const SizedBox(width: 2),
                              Text(
                                rating.toStringAsFixed(1),
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 9,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),

            // ---------------- CONTENT SECTION ----------------
            // 🛠️ FIX: Menggunakan Expanded di sini untuk mendorong section harga ke paling bawah kartu secara seragam
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Product Name
                    Text(
                      product['name'] ?? '',
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.poppins(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        height: 1.3,
                      ),
                    ),

                    // Price Section
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Rp ${_formatPrice(finalPrice)}',
                          style: GoogleFonts.poppins(
                            fontSize: 13, // Sedikit disesuaikan agar tidak gampang memotong grid layout
                            fontWeight: FontWeight.bold,
                            color: primaryGreen,
                          ),
                        ),
                        if (isOnSale)
                          Text(
                            'Rp ${_formatPrice(originalPrice)}',
                            style: GoogleFonts.poppins(
                              fontSize: 10,
                              color: Colors.grey,
                              decoration: TextDecoration.lineThrough,
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
      ),
    );
  }
}