// 🔥 AGROHUB DASHBOARD - FINAL FULL FIXED VERSION
// Menggunakan ProductCard widget yang reusable

import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

// IMPORTS
import 'package:agrohub_customer/features/auth/providers/user_provider.dart';
import 'package:agrohub_customer/features/marketplace/providers/product_provider.dart';
import 'package:agrohub_customer/utils/asset_helper.dart';
import 'package:agrohub_customer/utils/image_helper.dart';
import 'package:agrohub_customer/features/marketplace/presentation/widgets/product_card.dart';

import 'package:agrohub_customer/features/cart_checkout/presentation/screens/cart_screen.dart';
import 'package:agrohub_customer/features/marketplace/presentation/screens/flash_sale_screen.dart';
import 'package:agrohub_customer/features/dashboard_account/presentation/screens/notification_screen.dart';
import 'package:agrohub_customer/features/cart_checkout/presentation/screens/orders_screen.dart';
import 'package:agrohub_customer/features/marketplace/presentation/screens/search_screen.dart';
import 'package:agrohub_customer/features/marketplace/presentation/screens/product_detail_screen.dart';
import 'package:agrohub_customer/features/ai_smart/presentation/screens/ai_recipe_screen.dart';

class DashboardCustomerScreen extends StatefulWidget {
  const DashboardCustomerScreen({super.key});

  @override
  State<DashboardCustomerScreen> createState() => _DashboardCustomerScreenState();
}

class _DashboardCustomerScreenState extends State<DashboardCustomerScreen> {
  Timer? _countdownTimer;
  int _flashSaleSeconds = 2 * 60 * 60 + 18 * 60 + 45;
  
  final int couponsCount = 5;
  final String currentLocation = "Bandung, Jawa Barat";
  final String temperature = "26°C";

  final PageController _bannerController = PageController();

  final Color agroPrimaryGreen = const Color(0xFF007A37); 
  final Color agroLightBg = const Color(0xFFF8FBF9);      
  final Color agroTextDark = const Color(0xFF1A1A1A);

  @override
  void initState() {
    super.initState();
    _startCountdown();
    _loadDashboardData();
  }

  void _startCountdown() {
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_flashSaleSeconds > 0) {
        setState(() {
          _flashSaleSeconds--;
        });
      } else {
        timer.cancel();
      }
    });
  }

  void _loadDashboardData() {
    Future.microtask(() {
      final productProvider = Provider.of<ProductProvider>(context, listen: false);
      productProvider.fetchDashboardData();
    });
  }

  String _formatCountdown(int seconds) {
    int hours = seconds ~/ 3600;
    int minutes = (seconds % 3600) ~/ 60;
    int secs = seconds % 60;
    return '${hours.toString().padLeft(2, '0')} : ${minutes.toString().padLeft(2, '0')} : ${secs.toString().padLeft(2, '0')}';
  }

  String _formatPrice(dynamic price) {
    final value = price is int ? price : (price ?? 0).toInt();
    return value.toString().replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
      (m) => '${m[1]}.'
    );
  }
  
  int _getFinalPrice(dynamic product) {
    final price = (product['price'] ?? 0).toInt();
    final discount = (product['discount'] ?? 0).toInt();
    if (discount > 0) {
      return price - ((price * discount) ~/ 100);
    }
    return price;
  }

  @override
  void dispose() {
    _countdownTimer?.cancel();
    _bannerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<UserProvider>(
      builder: (context, userProvider, child) {
        return Consumer<ProductProvider>(
          builder: (context, productProvider, child) {
            final String customerName = userProvider.username.isNotEmpty 
                ? userProvider.username 
                : "Tri Endah Ariwati";
            
            final bestSellingProducts = productProvider.bestSellingProducts;
            final flashSaleProducts = productProvider.flashSaleProducts;
            final categories = productProvider.categories;
            final popularByCategory = productProvider.popularProductsByCategory;
            final isLoading = productProvider.isLoading;
            
            if (isLoading && bestSellingProducts.isEmpty) {
              return Scaffold(
                backgroundColor: agroLightBg,
                body: const Center(
                  child: CircularProgressIndicator(
                    color: Color(0xFF007A37),
                  ),
                ),
              );
            }
            
            return Scaffold(
              backgroundColor: agroLightBg,
              body: SafeArea(
                child: RefreshIndicator(
                  onRefresh: () async {
                    await productProvider.refresh();
                  },
                  color: agroPrimaryGreen,
                  child: CustomScrollView(
                    physics: const BouncingScrollPhysics(),
                    slivers: [
                      SliverToBoxAdapter(child: _buildTopLogoHeader(userProvider)),
                      SliverToBoxAdapter(child: _buildGreenGreetingBanner(customerName, userProvider)),
                      SliverToBoxAdapter(child: _buildPromoBannerSlider()),
                      SliverToBoxAdapter(child: _buildCategories(categories)),
                      SliverToBoxAdapter(child: _buildFlashSaleSection(flashSaleProducts)),
                      SliverToBoxAdapter(child: _buildBestSellingSection(bestSellingProducts)),
                      SliverToBoxAdapter(child: _buildCategoryBasedProducts(popularByCategory, categories)),
                      SliverToBoxAdapter(child: _buildNearbyStores()),
                      SliverToBoxAdapter(child: _buildAIRecipeCard()),
                      const SliverToBoxAdapter(child: SizedBox(height: 30)),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  // ==================== UI COMPONENTS ====================

  Widget _buildTopLogoHeader(UserProvider userProvider) {
    return Padding(
      padding: const EdgeInsets.only(left: 16, right: 16, top: 12, bottom: 8),
      child: Column(
        children: [
          Row(
            children: [
              Image.asset(
                AssetHelper.logo,
                width: 140,
                height: 55,
                fit: BoxFit.contain,
                errorBuilder: (_, __, ___) => Text(
                  "AgroHub",
                  style: GoogleFonts.poppins(fontSize: 24, fontWeight: FontWeight.bold, color: agroPrimaryGreen),
                ),
              ),
              const Spacer(),
              Stack(
                children: [
                  IconButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => NotificationScreen()),
                      );
                    },
                    icon: const Icon(Icons.notifications_none_rounded, color: Colors.black87, size: 26),
                  ),
                  Positioned(
                    right: 6,
                    top: 6,
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
                      child: const Text("12", style: TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold)),
                    ),
                  )
                ],
              ),
              Stack(
                children: [
                  IconButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => CartScreen()),
                      );
                    },
                    icon: const Icon(Icons.shopping_cart_outlined, color: Colors.black87, size: 26),
                  ),
                  Positioned(
                    right: 6,
                    top: 6,
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
                      child: Text(
                        "${userProvider.cartItemCount}",
                        style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold),
                      ),
                    ),
                  )
                ],
              ),
              const SizedBox(width: 4),
              const CircleAvatar(
                radius: 18,
                backgroundColor: Colors.green,
                child: Icon(Icons.person, color: Colors.white, size: 20),
              ),
            ],
          ),
          const SizedBox(height: 12),
          InkWell(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => SearchScreen()),
              );
            },
            child: Container(
              height: 46,
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Row(
                children: [
                  Icon(Icons.search, color: Colors.grey.shade400),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      "Cari produk pertanian, peternakan, perikanan...",
                      style: GoogleFonts.poppins(color: Colors.grey.shade400, fontSize: 13),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  Icon(Icons.filter_center_focus_rounded, color: agroPrimaryGreen),
                ],
              ),
            ),
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Icon(Icons.location_on, size: 16, color: agroPrimaryGreen),
              const SizedBox(width: 4),
              Text("Kirim ke: ", style: GoogleFonts.poppins(fontSize: 12, color: Colors.black54)),
              Text(currentLocation, style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.black87)),
              Icon(Icons.keyboard_arrow_down, size: 16, color: agroPrimaryGreen),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: Colors.orange.withOpacity(0.08), borderRadius: BorderRadius.circular(20)),
                child: Row(
                  children: [
                    const Icon(Icons.wb_sunny, size: 14, color: Colors.orange),
                    const SizedBox(width: 4),
                    Text(temperature, style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.orange.shade800)),
                  ],
                ),
              )
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildGreenGreetingBanner(String customerName, UserProvider userProvider) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          gradient: const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF005C29), Color(0xFF00963F)],
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Halo, $customerName! 👋",
              style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 2),
            Text(
              "Selamat berbelanja di AgroHub\nPlatform pertanian terpercaya",
              style: GoogleFonts.poppins(fontSize: 12, color: Colors.white70),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                InkWell(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => OrdersScreen()),
                    );
                  },
                  child: _miniBannerCard(Icons.shopping_bag, "${userProvider.totalOrders}", "Pesanan Aktif")
                ),
                InkWell(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => CartScreen()),
                    );
                  },
                  child: _miniBannerCard(Icons.shopping_cart, "${userProvider.cartItemCount}", "Keranjang")
                ),
                _miniBannerCard(Icons.stars, "${userProvider.loyaltyPoints}", "Poin Saya"),
                _miniBannerCard(Icons.local_offer, "$couponsCount", "Kupon Saya"),
              ],
            )
          ],
        ),
      ),
    );
  }

  Widget _miniBannerCard(IconData icon, String value, String label) {
    return Container(
      width: 78,
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
      child: Column(
        children: [
          Icon(icon, size: 20, color: agroPrimaryGreen),
          const SizedBox(height: 4),
          Text(value, style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.black87)),
          Text(label, style: GoogleFonts.poppins(fontSize: 8, color: Colors.black54), textAlign: TextAlign.center, maxLines: 1),
        ],
      ),
    );
  }

  Widget _buildPromoBannerSlider() {
    final List<Map<String, dynamic>> banners = [
      {"title": "Diskon Spesial\nProduk Segar", "subtitle": "Hemat hingga 50%", "color": Colors.amber, "image": AssetHelper.banner1},
      {"title": "Flash Sale\nMeriah", "subtitle": "Diskon 20%", "color": Colors.orange, "image": AssetHelper.banner2},
      {"title": "Gratis Ongkir", "subtitle": "Minimal belanja Rp 100k", "color": Colors.green, "image": AssetHelper.banner3},
    ];

    return Column(
      children: [
        SizedBox(
          height: 155,
          child: PageView.builder(
            controller: _bannerController,
            itemCount: banners.length,
            itemBuilder: (context, index) {
              final banner = banners[index];
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    image: DecorationImage(
                      image: AssetImage(banner["image"]),
                      fit: BoxFit.cover,
                    ),
                  ),
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(20),
                      gradient: LinearGradient(
                        begin: Alignment.centerLeft,
                        end: Alignment.centerRight,
                        colors: [Colors.black.withOpacity(0.55), Colors.transparent],
                      ),
                    ),
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(color: Colors.amber, borderRadius: BorderRadius.circular(8)),
                                child: Text("PROMO SPESIAL", style: GoogleFonts.poppins(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.black)),
                              ),
                              const SizedBox(height: 6),
                              Text(banner["title"], style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                              Text(banner["subtitle"], style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w500, color: banner["color"])),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 8),
        SmoothPageIndicator(
          controller: _bannerController,
          count: banners.length,
          effect: WormEffect(
            activeDotColor: agroPrimaryGreen,
            dotColor: Colors.grey.shade300,
            dotHeight: 7,
            dotWidth: 7,
            spacing: 6,
          ),
        ),
        const SizedBox(height: 12),
      ],
    );
  }

  Widget _buildCategories(List<dynamic> categories) {
    if (categories.isEmpty) {
      return _buildLoadingCategories();
    }
    
    final List<Map<String, String>> categoryDisplay = [];
    
    for (var cat in categories) {
      final name = cat['name'] ?? '';
      categoryDisplay.add({
        "name": name,
        "icon": _getCategoryIcon(name),
      });
    }

    return SizedBox(
      height: 90,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: categoryDisplay.length > 10 ? 10 : categoryDisplay.length,
        itemBuilder: (context, index) {
          final cat = categoryDisplay[index];
          return Padding(
            padding: const EdgeInsets.only(right: 14),
            child: Column(
              children: [
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                    boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 4, offset: const Offset(0, 2))],
                  ),
                  child: Center(child: Text(cat["icon"]!, style: const TextStyle(fontSize: 24))),
                ),
                const SizedBox(height: 6),
                Text(cat["name"]!, style: GoogleFonts.poppins(fontSize: 11, color: Colors.black87, fontWeight: FontWeight.w500)),
              ],
            ),
          );
        },
      ),
    );
  }
  
  String _getCategoryIcon(String categoryName) {
    const iconMap = {
      'sayuran': '🥬', 'buah': '🍎', 'beras': '🍚', 'padi': '🌾',
      'daging': '🥩', 'ayam': '🍗', 'ikan': '🐟', 'bumbu': '🧄',
      'susu': '🥛', 'organik': '🌿', 'pupuk': '🌱', 'bibit': '🌰',
      'alat': '🔧', 'ternak': '🐄', 'perikanan': '🐠'
    };
    
    for (var entry in iconMap.entries) {
      if (categoryName.toLowerCase().contains(entry.key)) {
        return entry.value;
      }
    }
    return '🌾';
  }
  
  Widget _buildLoadingCategories() {
    return SizedBox(
      height: 90,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: 8,
        itemBuilder: (context, index) {
          return Padding(
            padding: const EdgeInsets.only(right: 14),
            child: Column(
              children: [
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                    boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 4, offset: const Offset(0, 2))],
                  ),
                  child: const Center(child: CircularProgressIndicator(strokeWidth: 2)),
                ),
                const SizedBox(height: 6),
                Container(width: 40, height: 8, color: Colors.grey.shade200),
              ],
            ),
          );
        },
      ),
    );
  }

  // 🔥 FLASH SALE SECTION - Menggunakan ProductCard
  Widget _buildFlashSaleSection(List<dynamic> flashProducts) {
    if (flashProducts.isEmpty) {
      return const Padding(
        padding: EdgeInsets.all(16),
        child: Center(
          child: Text(
            "Tidak ada produk flash sale saat ini",
            style: TextStyle(color: Colors.grey),
          ),
        ),
      );
    }

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Row(
            children: [
              Text("🔥 Flash Sale", style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold, color: agroTextDark)),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: Colors.green.shade50, borderRadius: BorderRadius.circular(6)),
                child: Text(_formatCountdown(_flashSaleSeconds), style: GoogleFonts.robotoMono(color: agroPrimaryGreen, fontWeight: FontWeight.bold, fontSize: 12)),
              ),
              const Spacer(),
              InkWell(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => FlashSaleScreen()),
                  );
                },
                child: Row(
                  children: [
                    Text("Lihat Semua", style: GoogleFonts.poppins(fontSize: 12, color: agroPrimaryGreen, fontWeight: FontWeight.w500)),
                    Icon(Icons.chevron_right, size: 16, color: agroPrimaryGreen),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 220,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: flashProducts.length > 5 ? 5 : flashProducts.length,
              itemBuilder: (context, index) {
                final product = flashProducts[index];
                return Padding(
                  padding: const EdgeInsets.only(right: 12),
                  child: ProductCard(
                    product: product,
                    cardWidth: 150,
                    imageHeight: 110,
                    showSoldBadge: false,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ProductDetailScreen(productData: product),
                        ),
                      );
                    },
                  ),
                );
              },
            ),
          )
        ],
      ),
    );
  }

  // 🔥 BEST SELLING SECTION - Menggunakan ProductCard
  Widget _buildBestSellingSection(List<dynamic> products) {
    if (products.isEmpty) {
      return const SizedBox.shrink();
    }

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Row(
            children: [
              Icon(Icons.trending_up, color: agroPrimaryGreen, size: 20),
              const SizedBox(width: 8),
              Text("Produk Terlaris", style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold, color: agroTextDark)),
              const Spacer(),
              InkWell(
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Menampilkan semua produk terlaris')),
                  );
                },
                child: Row(
                  children: [
                    Text("Lihat Semua", style: GoogleFonts.poppins(fontSize: 12, color: agroPrimaryGreen, fontWeight: FontWeight.w500)),
                    Icon(Icons.chevron_right, size: 16, color: agroPrimaryGreen),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 240,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: products.length > 10 ? 10 : products.length,
              itemBuilder: (context, index) {
                final product = products[index];
                return Padding(
                  padding: const EdgeInsets.only(right: 12),
                  child: ProductCard(
                    product: product,
                    cardWidth: 160,
                    imageHeight: 120,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ProductDetailScreen(productData: product),
                        ),
                      );
                    },
                  ),
                );
              },
            ),
          )
        ],
      ),
    );
  }
  
  // 🔥 CATEGORY BASED PRODUCTS - Menggunakan ProductCard
  Widget _buildCategoryBasedProducts(Map<int, List<dynamic>> popularByCategory, List<dynamic> categories) {
    if (popularByCategory.isEmpty || categories.isEmpty) {
      return const SizedBox.shrink();
    }
    
    final topCategories = categories.take(3).toList();
    
    return Column(
      children: topCategories.map((category) {
        final categoryId = category['id'];
        final categoryName = category['name'];
        final products = popularByCategory[categoryId] ?? [];
        
        if (products.isEmpty) return const SizedBox.shrink();
        
        return Padding(
          padding: const EdgeInsets.only(bottom: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Text(_getCategoryIcon(categoryName), style: const TextStyle(fontSize: 18)),
                        const SizedBox(width: 8),
                        Text(
                          categoryName,
                          style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold, color: agroTextDark),
                        ),
                      ],
                    ),
                    TextButton(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Lihat semua produk $categoryName')),
                        );
                      },
                      child: Text(
                        "Lihat Semua",
                        style: GoogleFonts.poppins(fontSize: 12, color: agroPrimaryGreen),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                height: 200,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: products.length > 4 ? 4 : products.length,
                  itemBuilder: (context, index) {
                    final product = products[index];
                    return Padding(
                      padding: const EdgeInsets.only(right: 12),
                      child: ProductCard(
                        product: product,
                        cardWidth: 130,
                        imageHeight: 100,
                        showSoldBadge: true,
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => ProductDetailScreen(productData: product),
                            ),
                          );
                        },
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildNearbyStores() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("📍 Toko Terdekat", style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold, color: agroTextDark)),
              InkWell(
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Lihat semua toko terdekat')),
                  );
                },
                child: Text("Lihat Semua", style: GoogleFonts.poppins(fontSize: 12, color: agroPrimaryGreen)),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 4)],
            ),
            child: Row(
              children: [
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(color: Colors.green.shade50, borderRadius: BorderRadius.circular(12)),
                  child: Icon(Icons.storefront, color: agroPrimaryGreen, size: 28),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("Tani Makmur Jaya", style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.bold, color: agroTextDark)),
                      const SizedBox(height: 2),
                      Text("📍 800 m  •  ⭐ 4.8 (120 ulasan)", style: GoogleFonts.poppins(fontSize: 11, color: Colors.grey.shade600)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // 🔥 AI RECIPE CARD
  Widget _buildAIRecipeCard() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => AIRecipeScreen()),
          );
        },
        borderRadius: BorderRadius.circular(24),
        child: Container(
          height: 140,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(24),
            image: DecorationImage(
              image: AssetImage(AssetHelper.aiRecipeBg),
              fit: BoxFit.cover,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.2),
                blurRadius: 20,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(24),
              gradient: LinearGradient(
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
                colors: [
                  Colors.black.withOpacity(0.6),
                  Colors.transparent,
                ],
              ),
            ),
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(16),
                      color: Colors.white.withOpacity(0.2),
                    ),
                    child: const Center(
                      child: Icon(
                        Icons.auto_awesome,
                        color: Colors.white,
                        size: 30,
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                "AI POWERED",
                                style: GoogleFonts.poppins(
                                  fontSize: 9,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Text(
                          "AI Recipe Engine",
                          style: GoogleFonts.poppins(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          "Masukkan bahan, AI buatkan resep!",
                          style: GoogleFonts.poppins(
                            fontSize: 10,
                            color: Colors.white70,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(
                                Icons.auto_awesome,
                                size: 12,
                                color: Color(0xFF1B5E20),
                              ),
                              const SizedBox(width: 4),
                              Text(
                                "Coba Sekarang",
                                style: GoogleFonts.poppins(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w600,
                                  color: const Color(0xFF1B5E20),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}