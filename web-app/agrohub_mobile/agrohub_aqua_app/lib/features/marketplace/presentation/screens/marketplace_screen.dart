// lib/features/marketplace/presentation/screens/marketplace_screen.dart
// FULL FIXED VERSION - OVERFLOW FIX + SELL ACTIVE + KYC CONNECTED

import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';

import 'package:agrohub_aqua_app/app/theme/app_theme.dart';
import '../../../../core/config/api_config.dart';
import '../../../../core/storage/token_storage.dart';
import '../../../dashboard/presentation/screens/aqua_dashboard.dart';
import '../../../kyc/presentation/screens/kyc_verification_screen.dart';

class MarketplaceScreen extends StatefulWidget {
  final int initialTab;

  const MarketplaceScreen({
    super.key,
    this.initialTab = 0,
  });

  @override
  State<MarketplaceScreen> createState() =>
      _MarketplaceScreenState();
}

class _MarketplaceScreenState
    extends State<MarketplaceScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;

  bool _isLoading = true;

  // AKTIFKAN SELLER DEFAULT
  bool _isVerified = true;

  int _selectedFilter = 0;

  final ImagePicker _picker = ImagePicker();

  File? _selectedImage;

  final TextEditingController _searchController =
      TextEditingController();

  final TextEditingController _productNameController =
      TextEditingController();

  final TextEditingController _productPriceController =
      TextEditingController();

  final TextEditingController _productStockController =
      TextEditingController();

  final TextEditingController _productDescController =
      TextEditingController();

  String _selectedCategory = "Ikan Hidup";

  String _selectedLocation = "Jawa Timur";

  final List<String> _filters = [
    "Semua",
    "Ikan",
    "Bibit",
    "Pakan",
    "Peralatan",
    "Obat",
  ];

  final List<Map<String, dynamic>> _categories = [
    {
      "name": "Ikan Hidup",
      "icon": Icons.set_meal_rounded,
      "type": "ikan",
    },
    {
      "name": "Bibit Ikan",
      "icon": Icons.water_drop_rounded,
      "type": "bibit",
    },
    {
      "name": "Pakan Ikan",
      "icon": Icons.restaurant_rounded,
      "type": "pakan",
    },
    {
      "name": "Peralatan",
      "icon": Icons.build_circle_rounded,
      "type": "alat",
    },
    {
      "name": "Obat Ikan",
      "icon": Icons.medication_rounded,
      "type": "obat",
    },
  ];

  final List<String> _locations = [
    "Jawa Timur",
    "Jawa Barat",
    "Jawa Tengah",
    "DKI Jakarta",
    "Bali",
    "Lampung",
    "Sulawesi Selatan",
  ];

  final List<Map<String, dynamic>> _products = [
    {
      "id": "1",
      "name": "Lele Dumbo Premium",
      "priceStr": "Rp 25.000/kg",
      "location": "Jawa Timur",
      "stock": 450,
      "category": "Ikan Hidup",
      "image": Icons.set_meal_rounded,
      "seller": "Farm Lele Nusantara",
      "description":
          "Lele segar kualitas premium siap kirim.",
      "type": "ikan",
      "rating": 4.9,
      "sold": 1200,
    },
    {
      "id": "2",
      "name": "Pelet Apung 781",
      "priceStr": "Rp 350.000/sak",
      "location": "Jawa Tengah",
      "stock": 88,
      "category": "Pakan Ikan",
      "image": Icons.restaurant_rounded,
      "seller": "Feed Supplier Indo",
      "description":
          "Pakan ikan protein tinggi premium.",
      "type": "pakan",
      "rating": 4.8,
      "sold": 540,
    },
  ];

  final List<Map<String, dynamic>> _myProducts = [];

  final List<Map<String, dynamic>> _orders = [
    {
      "product": "Lele Dumbo Premium",
      "buyer": "Budi Santoso",
      "price": "Rp 1.250.000",
      "status": "Diproses",
    },
  ];

  @override
  void initState() {
    super.initState();

    _tabController = TabController(
      length: 3,
      vsync: this,
      initialIndex: widget.initialTab,
    );

    _checkVerificationStatus();
  }

  @override
  void dispose() {
    _tabController.dispose();

    _searchController.dispose();

    _productNameController.dispose();
    _productPriceController.dispose();
    _productStockController.dispose();
    _productDescController.dispose();

    super.dispose();
  }

  Future<void> _checkVerificationStatus() async {
    try {
      final token = await TokenStorage.getToken();

      if (token != null) {
        final response = await http.get(
          Uri.parse(
            '${ApiConfig.baseUrl}/api/v1/user/profile',
          ),
          headers: {
            'Authorization': 'Bearer $token',
          },
        );

        if (response.statusCode == 200) {
          final data = jsonDecode(response.body);

          setState(() {
            _isVerified =
                data['is_verified'] ?? true;
          });
        }
      }
    } catch (_) {
      _isVerified = true;
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),

      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,

        leading: IconButton(
          icon:
              const Icon(Icons.arrow_back_ios_new_rounded),
          color: AppTheme.primaryColor,
          onPressed: () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (_) =>
                    const AquaDashboard(),
              ),
            );
          },
        ),

        title: Text(
          "Aqua Marketplace",
          style: GoogleFonts.poppins(
            color: AppTheme.primaryColor,
            fontWeight: FontWeight.bold,
          ),
        ),

        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(70),
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 10,
            ),
            child: Container(
              height: 52,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius:
                    BorderRadius.circular(18),
              ),
              child: TextField(
                controller: _searchController,
                decoration: InputDecoration(
                  hintText: "Cari produk...",
                  border: InputBorder.none,
                  prefixIcon:
                      const Icon(Icons.search_rounded),
                  hintStyle:
                      GoogleFonts.poppins(),
                ),
              ),
            ),
          ),
        ),
      ),

      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(),
            )
          : Column(
              children: [
                _buildTopStats(),

                const SizedBox(height: 10),

                _buildTabs(),

                Expanded(
                  child: TabBarView(
                    controller: _tabController,
                    children: [
                      _buildMarketplaceTab(),
                      _buildSellTab(),
                      _buildOrdersTab(),
                    ],
                  ),
                ),
              ],
            ),

      floatingActionButton:
          FloatingActionButton.extended(
        backgroundColor: AppTheme.primaryColor,
        onPressed: () {
          _tabController.animateTo(1);
        },
        icon:
            const Icon(Icons.add_business_rounded),
        label: Text(
          "Jual",
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  Widget _buildTopStats() {
    return Padding(
      padding:
          const EdgeInsets.symmetric(horizontal: 16),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          borderRadius:
              BorderRadius.circular(28),
          gradient: LinearGradient(
            colors: [
              AppTheme.primaryColor,
              AppTheme.primaryColor.withOpacity(
                0.7,
              ),
            ],
          ),
        ),
        child: Row(
          children: [
            Expanded(
              child: _buildStatItem(
                "Produk",
                "${_products.length}+",
                Icons.inventory_2_rounded,
              ),
            ),
            Expanded(
              child: _buildStatItem(
                "Seller",
                "1.2K",
                Icons.storefront_rounded,
              ),
            ),
            Expanded(
              child: _buildStatItem(
                "Transaksi",
                "24K",
                Icons.shopping_bag_rounded,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(
    String title,
    String value,
    IconData icon,
  ) {
    return Column(
      children: [
        Icon(
          icon,
          color: Colors.white,
        ),
        const SizedBox(height: 8),
        Text(
          value,
          style: GoogleFonts.poppins(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          title,
          style: GoogleFonts.poppins(
            color: Colors.white70,
            fontSize: 11,
          ),
        ),
      ],
    );
  }

  Widget _buildTabs() {
    return Container(
      margin: const EdgeInsets.symmetric(
        horizontal: 16,
      ),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius:
            BorderRadius.circular(22),
      ),
      child: TabBar(
        controller: _tabController,
        indicator: BoxDecoration(
          color: AppTheme.primaryColor,
          borderRadius:
              BorderRadius.circular(18),
        ),
        labelColor: Colors.white,
        unselectedLabelColor: Colors.grey,
        tabs: const [
          Tab(text: "Belanja"),
          Tab(text: "Jual"),
          Tab(text: "Pesanan"),
        ],
      ),
    );
  }

  Widget _buildMarketplaceTab() {
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _products.length,
      gridDelegate:
          const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 14,
        mainAxisSpacing: 14,
        childAspectRatio: 0.68,
      ),
      itemBuilder: (context, index) {
        return _buildProductCard(
          _products[index],
        );
      },
    );
  }

  Widget _buildProductCard(
    Map<String, dynamic> product,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius:
            BorderRadius.circular(24),
      ),
      child: Column(
        children: [
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: AppTheme.primaryColor
                    .withOpacity(0.08),
                borderRadius:
                    const BorderRadius.vertical(
                  top: Radius.circular(24),
                ),
              ),
              child: Center(
                child: Icon(
                  product["image"],
                  size: 60,
                  color: AppTheme.primaryColor,
                ),
              ),
            ),
          ),

          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment.start,
              children: [
                Text(
                  product["name"],
                  maxLines: 1,
                  overflow:
                      TextOverflow.ellipsis,
                  style: GoogleFonts.poppins(
                    fontWeight:
                        FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 4),

                Text(
                  product["priceStr"],
                  style: GoogleFonts.poppins(
                    color:
                        AppTheme.primaryColor,
                    fontWeight:
                        FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 10),

                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      _showBuyDialog(product);
                    },
                    style:
                        ElevatedButton.styleFrom(
                      backgroundColor:
                          AppTheme.primaryColor,
                    ),
                    child: const Text("Beli"),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSellTab() {
    if (!_isVerified) {
      return _buildVerificationNeeded();
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          _buildSellerBanner(),

          const SizedBox(height: 20),

          _buildAddProductForm(),

          const SizedBox(height: 20),

          if (_myProducts.isNotEmpty)
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                "Produk Saya",
                style: GoogleFonts.poppins(
                  fontWeight:
                      FontWeight.bold,
                  fontSize: 18,
                ),
              ),
            ),

          const SizedBox(height: 12),

          ..._myProducts.map(
            (e) => _buildMyProductCard(e),
          ),
        ],
      ),
    );
  }

  Widget _buildVerificationNeeded() {
    return LayoutBuilder(
      builder: (context, constraints) {
        return SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: ConstrainedBox(
            constraints: BoxConstraints(
              minHeight:
                  constraints.maxHeight - 48,
            ),
            child: Center(
              child: Container(
                width: double.infinity,
                constraints:
                    const BoxConstraints(
                  maxWidth: 520,
                ),
                padding:
                    const EdgeInsets.all(26),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius:
                      BorderRadius.circular(
                    32,
                  ),
                ),
                child: Column(
                  mainAxisSize:
                      MainAxisSize.min,
                  children: [
                    Container(
                      padding:
                          const EdgeInsets.all(
                        20,
                      ),
                      decoration:
                          BoxDecoration(
                        color: AppTheme
                            .primaryColor
                            .withOpacity(0.1),
                        shape:
                            BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons
                            .verified_user_rounded,
                        size: 56,
                        color:
                            AppTheme.primaryColor,
                      ),
                    ),

                    const SizedBox(
                        height: 20),

                    Text(
                      "Verifikasi Seller",
                      style:
                          GoogleFonts.poppins(
                        fontWeight:
                            FontWeight.bold,
                        fontSize: 22,
                      ),
                    ),

                    const SizedBox(
                        height: 12),

                    Text(
                      "Verifikasi akun untuk mulai jualan.",
                      textAlign:
                          TextAlign.center,
                      style:
                          GoogleFonts.poppins(
                        color:
                            Colors.grey[600],
                      ),
                    ),

                    const SizedBox(
                        height: 24),

                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () async {
                          final result =
                              await Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) =>
                                  const KycVerificationScreen(),
                            ),
                          );

                          if (result ==
                              true) {
                            setState(() {
                              _isVerified =
                                  true;
                            });
                          }
                        },
                        style:
                            ElevatedButton.styleFrom(
                          backgroundColor:
                              AppTheme
                                  .primaryColor,
                          minimumSize:
                              const Size(
                            double.infinity,
                            54,
                          ),
                        ),
                        child: const Text(
                          "Verifikasi Sekarang",
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildSellerBanner() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        borderRadius:
            BorderRadius.circular(28),
        gradient: LinearGradient(
          colors: [
            Colors.blue.shade700,
            AppTheme.primaryColor,
          ],
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: Text(
              "Jual hasil budidaya lebih mudah 🚀",
              style: GoogleFonts.poppins(
                color: Colors.white,
                fontWeight:
                    FontWeight.bold,
                fontSize: 18,
              ),
            ),
          ),
          const Icon(
            Icons.storefront_rounded,
            color: Colors.white,
            size: 36,
          ),
        ],
      ),
    );
  }

  Widget _buildAddProductForm() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius:
            BorderRadius.circular(28),
      ),
      child: Column(
        children: [
          GestureDetector(
            onTap: _pickImage,
            child: Container(
              width: double.infinity,
              height: 180,
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius:
                    BorderRadius.circular(
                  22,
                ),
              ),
              child: _selectedImage != null
                  ? ClipRRect(
                      borderRadius:
                          BorderRadius.circular(
                        22,
                      ),
                      child: Image.file(
                        _selectedImage!,
                        fit: BoxFit.cover,
                      ),
                    )
                  : Column(
                      mainAxisAlignment:
                          MainAxisAlignment
                              .center,
                      children: [
                        Icon(
                          Icons
                              .add_photo_alternate_rounded,
                          size: 48,
                          color:
                              Colors.grey[500],
                        ),
                        const SizedBox(
                            height: 10),
                        Text(
                          "Upload Foto Produk",
                          style:
                              GoogleFonts
                                  .poppins(),
                        ),
                      ],
                    ),
            ),
          ),

          const SizedBox(height: 18),

          _buildInput(
            controller:
                _productNameController,
            hint: "Nama produk",
            icon:
                Icons.inventory_2_rounded,
          ),

          const SizedBox(height: 16),

          _buildInput(
            controller:
                _productPriceController,
            hint: "Harga",
            icon:
                Icons.payments_rounded,
            keyboardType:
                TextInputType.number,
          ),

          const SizedBox(height: 16),

          _buildInput(
            controller:
                _productStockController,
            hint: "Stok",
            icon:
                Icons.warehouse_rounded,
            keyboardType:
                TextInputType.number,
          ),

          const SizedBox(height: 16),

          _buildDropdownCategory(),

          const SizedBox(height: 16),

          _buildDropdownLocation(),

          const SizedBox(height: 16),

          TextField(
            controller:
                _productDescController,
            maxLines: 4,
            decoration: InputDecoration(
              hintText:
                  "Deskripsi produk",
              border:
                  OutlineInputBorder(
                borderRadius:
                    BorderRadius.circular(
                  18,
                ),
              ),
            ),
          ),

          const SizedBox(height: 24),

          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _saveProduct,
              style:
                  ElevatedButton.styleFrom(
                backgroundColor:
                    AppTheme.primaryColor,
                minimumSize:
                    const Size(
                  double.infinity,
                  54,
                ),
              ),
              child: const Text(
                "Simpan Produk",
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInput({
    required TextEditingController
        controller,
    required String hint,
    required IconData icon,
    TextInputType? keyboardType,
  }) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      decoration: InputDecoration(
        hintText: hint,
        prefixIcon: Icon(icon),
        border: OutlineInputBorder(
          borderRadius:
              BorderRadius.circular(18),
        ),
      ),
    );
  }

  Widget _buildDropdownCategory() {
    return DropdownButtonFormField<String>(
      value: _selectedCategory,
      decoration: InputDecoration(
        border: OutlineInputBorder(
          borderRadius:
              BorderRadius.circular(18),
        ),
      ),
      items: _categories.map((e) {
        return DropdownMenuItem<String>(
          value: e["name"],
          child: Text(e["name"]),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          _selectedCategory = value!;
        });
      },
    );
  }

  Widget _buildDropdownLocation() {
    return DropdownButtonFormField<String>(
      value: _selectedLocation,
      decoration: InputDecoration(
        border: OutlineInputBorder(
          borderRadius:
              BorderRadius.circular(18),
        ),
      ),
      items: _locations.map((e) {
        return DropdownMenuItem<String>(
          value: e,
          child: Text(e),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          _selectedLocation = value!;
        });
      },
    );
  }

  Widget _buildMyProductCard(
    Map<String, dynamic> product,
  ) {
    return Container(
      margin:
          const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius:
            BorderRadius.circular(24),
      ),
      child: Row(
        children: [
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              color: AppTheme.primaryColor
                  .withOpacity(0.1),
              borderRadius:
                  BorderRadius.circular(
                18,
              ),
            ),
            child: product["imagePath"] !=
                    null
                ? ClipRRect(
                    borderRadius:
                        BorderRadius
                            .circular(18),
                    child: Image.file(
                      File(
                        product["imagePath"],
                      ),
                      fit: BoxFit.cover,
                    ),
                  )
                : Icon(
                    product["image"],
                    color:
                        AppTheme.primaryColor,
                  ),
          ),

          const SizedBox(width: 14),

          Expanded(
            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment.start,
              children: [
                Text(
                  product["name"],
                  style:
                      GoogleFonts.poppins(
                    fontWeight:
                        FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 6),

                Text(
                  product["priceStr"],
                  style:
                      GoogleFonts.poppins(
                    color:
                        AppTheme.primaryColor,
                    fontWeight:
                        FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOrdersTab() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _orders.length,
      itemBuilder: (context, index) {
        final order = _orders[index];

        return Container(
          margin:
              const EdgeInsets.only(bottom: 14),
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius:
                BorderRadius.circular(24),
          ),
          child: Row(
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: AppTheme.primaryColor
                      .withOpacity(0.1),
                  borderRadius:
                      BorderRadius.circular(
                    18,
                  ),
                ),
                child: const Icon(
                  Icons.shopping_bag_rounded,
                  color: AppTheme.primaryColor,
                ),
              ),

              const SizedBox(width: 14),

              Expanded(
                child: Column(
                  crossAxisAlignment:
                      CrossAxisAlignment.start,
                  children: [
                    Text(
                      order["product"],
                      style:
                          GoogleFonts.poppins(
                        fontWeight:
                            FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 6),

                    Text(
                      order["price"],
                      style:
                          GoogleFonts.poppins(
                        color:
                            AppTheme.primaryColor,
                        fontWeight:
                            FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _pickImage() async {
    final picked = await _picker.pickImage(
      source: ImageSource.gallery,
      imageQuality: 80,
    );

    if (picked != null) {
      setState(() {
        _selectedImage = File(picked.path);
      });
    }
  }

  void _saveProduct() {
    if (_productNameController.text.isEmpty ||
        _productPriceController.text.isEmpty ||
        _productStockController.text.isEmpty) {
      _showError(
        "Lengkapi semua data produk",
      );
      return;
    }

    final categoryData =
        _categories.firstWhere(
      (e) => e["name"] ==
          _selectedCategory,
    );

    final product = {
      "name":
          _productNameController.text,
      "priceStr":
          "Rp ${_productPriceController.text}",
      "stock":
          _productStockController.text,
      "image": categoryData["icon"],
      "imagePath":
          _selectedImage?.path,
    };

    setState(() {
      _myProducts.insert(0, product);

      _products.insert(0, {
        ...product,
        "location": _selectedLocation,
        "seller": "Seller Saya",
        "description":
            _productDescController.text,
        "rating": 5.0,
        "sold": 0,
      });
    });

    _clearForm();

    _showSuccess(
      "Produk berhasil ditambahkan",
    );
  }

  void _clearForm() {
    _productNameController.clear();
    _productPriceController.clear();
    _productStockController.clear();
    _productDescController.clear();

    setState(() {
      _selectedImage = null;
    });
  }

  void _showBuyDialog(
    Map<String, dynamic> product,
  ) {
    showDialog(
      context: context,
      builder: (_) {
        return AlertDialog(
          title: Text(
            "Checkout",
            style: GoogleFonts.poppins(
              fontWeight: FontWeight.bold,
            ),
          ),
          content: Text(
            "Beli ${product["name"]} ?",
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: const Text("Batal"),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);

                _showSuccess(
                  "Pesanan berhasil dibuat",
                );
              },
              child: const Text("Beli"),
            ),
          ],
        );
      },
    );
  }

  void _showSuccess(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.green,
        behavior:
            SnackBarBehavior.floating,
      ),
    );
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        behavior:
            SnackBarBehavior.floating,
      ),
    );
  }
}


