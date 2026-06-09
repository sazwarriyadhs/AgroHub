import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

// ✅ FIXED IMPORTS - Gunakan package import
import 'package:agrohub_customer/features/marketplace/providers/product_provider.dart';
import 'package:agrohub_customer/utils/image_helper.dart';
import 'package:agrohub_customer/features/marketplace/presentation/screens/product_detail_screen.dart';

class MarketplaceScreen extends StatefulWidget {
  const MarketplaceScreen({super.key});

  @override
  State<MarketplaceScreen> createState() => _MarketplaceScreenState();
}

class _MarketplaceScreenState extends State<MarketplaceScreen> {
  String _search = '';
  String _sort = 'sold';
  bool _isLoading = true;

  static const Color primaryGreen = Color(0xFF1B5E20);
  static const Color bgColor = Color(0xFFF5F7F2);

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final provider = Provider.of<ProductProvider>(context, listen: false);
    await provider.fetchProducts();
    setState(() {
      _isLoading = false;
    });
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

  @override
  Widget build(BuildContext context) {
    return Consumer<ProductProvider>(
      builder: (context, provider, _) {
        var products = List<Map<String, dynamic>>.from(provider.products);

        // 🔍 SEARCH FILTER
        if (_search.isNotEmpty) {
          products = products
              .where((p) => (p['name'] ?? '')
                  .toString()
                  .toLowerCase()
                  .contains(_search.toLowerCase()))
              .toList();
        }

        // 📊 SORT PRODUCTS
        if (_sort == 'sold') {
          products.sort((a, b) => (b['sold'] ?? 0).compareTo(a['sold'] ?? 0));
        } else if (_sort == 'rating') {
          products.sort((a, b) => (b['rating'] ?? 0).compareTo(a['rating'] ?? 0));
        } else if (_sort == 'price_low') {
          products.sort((a, b) {
            final aPrice = _getFinalPrice(a);
            final bPrice = _getFinalPrice(b);
            return aPrice.compareTo(bPrice);
          });
        } else if (_sort == 'price_high') {
          products.sort((a, b) {
            final aPrice = _getFinalPrice(a);
            final bPrice = _getFinalPrice(b);
            return bPrice.compareTo(aPrice);
          });
        }

        return Scaffold(
          backgroundColor: bgColor,

          appBar: AppBar(
            backgroundColor: Colors.white,
            elevation: 0,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back, color: Colors.black87),
              onPressed: () => Navigator.pop(context),
            ),
            title: Text(
              "Marketplace",
              style: GoogleFonts.poppins(
                color: Colors.black,
                fontWeight: FontWeight.bold,
              ),
            ),
            centerTitle: true,
          ),

          body: _isLoading && provider.isLoading
              ? const Center(
                  child: CircularProgressIndicator(
                    color: primaryGreen,
                  ),
                )
              : Column(
                  children: [
                    // 🔍 SEARCH BAR
                    Padding(
                      padding: const EdgeInsets.all(12),
                      child: TextField(
                        onChanged: (v) => setState(() => _search = v),
                        decoration: InputDecoration(
                          hintText: "Cari produk pertanian...",
                          hintStyle: GoogleFonts.poppins(
                            fontSize: 13,
                            color: Colors.grey.shade400,
                          ),
                          prefixIcon: const Icon(Icons.search, color: Colors.grey),
                          filled: true,
                          fillColor: Colors.white,
                          contentPadding: const EdgeInsets.symmetric(vertical: 12),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: primaryGreen, width: 1.5),
                          ),
                        ),
                      ),
                    ),

                    // 📊 FILTER CHIPS
                    SizedBox(
                      height: 45,
                      child: ListView(
                        scrollDirection: Axis.horizontal,
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        children: [
                          _chip("Terlaris", "sold"),
                          _chip("Rating Tertinggi", "rating"),
                          _chip("Termurah", "price_low"),
                          _chip("Termahal", "price_high"),
                        ],
                      ),
                    ),

                    const SizedBox(height: 10),

                    // 🔥 PRODUCT GRID
                    Expanded(
                      child: products.isEmpty
                          ? _buildEmptyState()
                          : GridView.builder(
                              padding: const EdgeInsets.all(12),
                              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 2,
                                childAspectRatio: 0.72,
                                crossAxisSpacing: 12,
                                mainAxisSpacing: 12,
                              ),
                              itemCount: products.length,
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

  // 📊 FILTER CHIP WIDGET
  Widget _chip(String label, String value) {
    final active = _sort == value;

    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: ChoiceChip(
        label: Text(
          label,
          style: GoogleFonts.poppins(
            fontSize: 13,
            fontWeight: active ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
        selected: active,
        onSelected: (_) => setState(() => _sort = value),
        selectedColor: primaryGreen,
        backgroundColor: Colors.white,
        labelStyle: TextStyle(
          color: active ? Colors.white : Colors.black87,
        ),
        elevation: 0,
        pressElevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(
            color: active ? primaryGreen : Colors.grey.shade300,
            width: 1,
          ),
        ),
      ),
    );
  }

  // 🏠 EMPTY STATE
  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.search_off,
            size: 64,
            color: Colors.grey.shade400,
          ),
          const SizedBox(height: 16),
          Text(
            _search.isEmpty ? 'Tidak ada produk' : 'Produk tidak ditemukan',
            style: GoogleFonts.poppins(
              fontSize: 16,
              color: Colors.grey.shade600,
            ),
          ),
          if (_search.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(
              'Coba dengan kata kunci lain',
              style: GoogleFonts.poppins(
                fontSize: 12,
                color: Colors.grey.shade500,
              ),
            ),
          ],
        ],
      ),
    );
  }

  // 🛍️ PRODUCT CARD
  Widget _buildProductCard(Map<String, dynamic> product) {
    final imageUrl = ImageHelper.getProductImageFromMap(product);
    final finalPrice = _getFinalPrice(product);
    final originalPrice = (product['price'] ?? 0).toInt();
    final discount = (product['discount'] ?? 0).toInt();
    final isOnSale = discount > 0;
    
    final rating = (product['rating'] ?? 0).toDouble();
    final sold = (product['sold'] ?? 0).toInt();

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
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 🖼️ PRODUCT IMAGE
            Expanded(
              flex: 3,
              child: Stack(
                children: [
                  ClipRRect(
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(14)),
                    child: Image.network(
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
                  ),
                  // 🔥 DISCOUNT BADGE
                  if (isOnSale)
                    Positioned(
                      top: 8,
                      left: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 6,
                          vertical: 3,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.red,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          '-$discount%',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),

            // 📝 PRODUCT INFO
            Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.all(8),
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
                        fontWeight: FontWeight.w500,
                        height: 1.4,
                      ),
                    ),

                    const SizedBox(height: 4),

                    // Price
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Rp ${_formatPrice(finalPrice)}",
                          style: GoogleFonts.poppins(
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                            color: primaryGreen,
                          ),
                        ),
                        if (isOnSale)
                          Text(
                            "Rp ${_formatPrice(originalPrice)}",
                            style: GoogleFonts.poppins(
                              fontSize: 10,
                              color: Colors.grey,
                              decoration: TextDecoration.lineThrough,
                            ),
                          ),
                      ],
                    ),

                    const SizedBox(height: 4),

                    // Rating & Sold
                    Row(
                      children: [
                        const Icon(Icons.star, size: 12, color: Colors.amber),
                        const SizedBox(width: 2),
                        Text(
                          rating.toStringAsFixed(1),
                          style: GoogleFonts.poppins(fontSize: 10),
                        ),
                        const SizedBox(width: 8),
                        Icon(Icons.shopping_bag, size: 10, color: Colors.grey),
                        const SizedBox(width: 2),
                        Text(
                          "$sold",
                          style: GoogleFonts.poppins(fontSize: 10),
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