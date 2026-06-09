import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

// ✅ FIXED IMPORTS - Gunakan package import
import 'package:agrohub_customer/features/marketplace/providers/product_provider.dart';
import 'package:agrohub_customer/utils/image_helper.dart';
import 'package:agrohub_customer/features/marketplace/presentation/screens/product_detail_screen.dart';

class PreOrderScreen extends StatelessWidget {
  const PreOrderScreen({super.key});

  static const Color primaryGreen = Color(0xFF1B5E20);
  static const Color bgColor = Color(0xFFF5F7F2);

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
        // 🔥 Pre-order logic: produk dengan stok terbatas (≤ 50) atau bisa dari flag khusus
        final preOrderProducts = provider.products.where((p) {
          final stock = (p['stock'] ?? 0).toInt();
          final isPreOrder = p['is_pre_order'] ?? false;
          // Stok < 50 ATAU flag is_pre_order = true
          return stock < 50 || isPreOrder;
        }).toList();

        // Sort by stock (most urgent first)
        preOrderProducts.sort((a, b) {
          final aStock = (a['stock'] ?? 0).toInt();
          final bStock = (b['stock'] ?? 0).toInt();
          return aStock.compareTo(bStock);
        });

        final isLoading = provider.isLoading;

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
              "Pre-Order",
              style: GoogleFonts.poppins(
                color: Colors.black,
                fontWeight: FontWeight.bold,
              ),
            ),
            centerTitle: true,
          ),

          body: isLoading && preOrderProducts.isEmpty
              ? const Center(
                  child: CircularProgressIndicator(
                    color: primaryGreen,
                  ),
                )
              : preOrderProducts.isEmpty
                  ? _buildEmptyState()
                  : ListView.builder(
                      padding: const EdgeInsets.all(12),
                      itemCount: preOrderProducts.length,
                      itemBuilder: (context, index) {
                        return _buildProductCard(context, preOrderProducts[index]);
                      },
                    ),
        );
      },
    );
  }

  // 🏠 EMPTY STATE
  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.inbox_outlined,
            size: 64,
            color: Colors.grey.shade400,
          ),
          const SizedBox(height: 16),
          Text(
            "Belum ada produk Pre-Order",
            style: GoogleFonts.poppins(
              fontSize: 16,
              color: Colors.grey.shade600,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            "Cek lagi nanti ya!",
            style: GoogleFonts.poppins(
              fontSize: 12,
              color: Colors.grey.shade500,
            ),
          ),
        ],
      ),
    );
  }

  // 🛍️ PRODUCT CARD
  Widget _buildProductCard(BuildContext context, Map<String, dynamic> product) {
    final imageUrl = ImageHelper.getProductImageFromMap(product);
    final finalPrice = _getFinalPrice(product);
    final originalPrice = (product['price'] ?? 0).toInt();
    final discount = (product['discount'] ?? 0).toInt();
    final isOnSale = discount > 0;
    
    final stock = (product['stock'] ?? 0).toInt();
    final sold = (product['sold'] ?? 0).toInt();
    final rating = (product['rating'] ?? 0).toDouble();
    
    // Hitung progress pre-order (target asumsi 100 unit)
    final preOrderTarget = 100;
    final progress = (sold / preOrderTarget).clamp(0.0, 1.0);
    final isUrgent = stock < 20;

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
        margin: const EdgeInsets.only(bottom: 12),
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
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 🖼️ PRODUCT IMAGE
            ClipRRect(
              borderRadius: const BorderRadius.horizontal(
                left: Radius.circular(14),
              ),
              child: Image.network(
                imageUrl,
                width: 110,
                height: 130,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Container(
                  width: 110,
                  height: 130,
                  color: Colors.grey.shade200,
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

            // 📝 PRODUCT INFO
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Product Name
                    Text(
                      product['name'] ?? '',
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.poppins(
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                        height: 1.3,
                      ),
                    ),

                    const SizedBox(height: 8),

                    // Price Section
                    Row(
                      children: [
                        Text(
                          "Rp ${_formatPrice(finalPrice)}",
                          style: GoogleFonts.poppins(
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                            color: primaryGreen,
                          ),
                        ),
                        if (isOnSale) ...[
                          const SizedBox(width: 8),
                          Text(
                            "Rp ${_formatPrice(originalPrice)}",
                            style: GoogleFonts.poppins(
                              fontSize: 11,
                              color: Colors.grey,
                              decoration: TextDecoration.lineThrough,
                            ),
                          ),
                        ],
                      ],
                    ),

                    const SizedBox(height: 8),

                    // Stock Info
                    Row(
                      children: [
                        Icon(
                          Icons.inventory,
                          size: 14,
                          color: isUrgent ? Colors.red : Colors.grey.shade600,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          "Stok tersisa: $stock",
                          style: GoogleFonts.poppins(
                            fontSize: 11,
                            color: isUrgent ? Colors.red : Colors.grey.shade600,
                            fontWeight: isUrgent ? FontWeight.bold : FontWeight.normal,
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 8),

                    // Pre-order Progress Bar
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              "Progress Pre-Order",
                              style: GoogleFonts.poppins(
                                fontSize: 10,
                                color: Colors.grey.shade600,
                              ),
                            ),
                            Text(
                              "${(progress * 100).toInt()}%",
                              style: GoogleFonts.poppins(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: primaryGreen,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        LinearProgressIndicator(
                          value: progress,
                          backgroundColor: Colors.grey.shade200,
                          color: primaryGreen,
                          borderRadius: BorderRadius.circular(4),
                          minHeight: 6,
                        ),
                      ],
                    ),

                    const SizedBox(height: 8),

                    // Badges Row
                    Row(
                      children: [
                        // PRE-ORDER BADGE
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.orange.shade50,
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(
                              color: Colors.orange.shade200,
                              width: 0.5,
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.schedule,
                                size: 10,
                                color: Colors.orange.shade700,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                "PRE-ORDER",
                                style: GoogleFonts.poppins(
                                  fontSize: 9,
                                  color: Colors.orange.shade700,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),

                        const Spacer(),

                        // Rating
                        if (rating > 0)
                          Row(
                            children: [
                              const Icon(Icons.star, size: 12, color: Colors.amber),
                              const SizedBox(width: 2),
                              Text(
                                rating.toStringAsFixed(1),
                                style: GoogleFonts.poppins(
                                  fontSize: 10,
                                  color: Colors.grey.shade600,
                                ),
                              ),
                            ],
                          ),

                        const SizedBox(width: 8),

                        // Sold Count
                        Row(
                          children: [
                            Icon(Icons.shopping_bag, size: 10, color: Colors.grey.shade600),
                            const SizedBox(width: 2),
                            Text(
                              "$sold",
                              style: GoogleFonts.poppins(
                                fontSize: 10,
                                color: Colors.grey.shade600,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),

                    // Urgent Warning
                    if (isUrgent)
                      Padding(
                        padding: const EdgeInsets.only(top: 8),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.red.shade50,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.warning_amber_rounded,
                                size: 12,
                                color: Colors.red.shade700,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                "Stok hampir habis!",
                                style: GoogleFonts.poppins(
                                  fontSize: 10,
                                  color: Colors.red.shade700,
                                  fontWeight: FontWeight.w500,
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
          ],
        ),
      ),
    );
  }
}