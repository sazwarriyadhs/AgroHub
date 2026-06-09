// lib/features/sell/presentation/sell_product_screen.dart

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'dart:typed_data';

import '../../../core/services/api_service.dart';
import '../models/product_category.dart';
import '../models/commodity_type.dart';
import '../models/price_suggestion.dart';
import '../../dashboard/presentation/farmer_bottom_navigation.dart';

class SellProductScreen extends StatefulWidget {
  const SellProductScreen({super.key});

  @override
  State<SellProductScreen> createState() => _SellProductScreenState();
}

class _SellProductScreenState extends State<SellProductScreen> {
  final ApiService _apiService = ApiService();
  final ImagePicker _picker = ImagePicker();

  // DATA
  List<ProductCategory> categories = [];
  List<CommodityType> commodities = [];
  PriceSuggestion? priceSuggestion;

  ProductCategory? selectedCategory;
  CommodityType? selectedCommodity;

  // FORM
  final qtyController = TextEditingController();
  final priceController = TextEditingController();
  final descController = TextEditingController();

  // Untuk web compatibility
  File? imageFile;
  Uint8List? imageBytes;
  bool isUploading = false;

  bool loading = false;
  bool submitting = false;

  @override
  void initState() {
    super.initState();
    
    qtyController.addListener(() {
      if (mounted) setState(() {});
    });
    
    priceController.addListener(() {
      if (mounted) setState(() {});
    });
    
    _loadCategories();
  }

  @override
  void dispose() {
    qtyController.dispose();
    priceController.dispose();
    descController.dispose();
    _apiService.dispose();
    super.dispose();
  }

  // =========================
  // LOAD CATEGORIES
  // =========================
  Future<void> _loadCategories() async {
    setState(() => loading = true);

    try {
      final res = await _apiService.getProductCategories();
      
      setState(() {
        categories = res;
      });
    } catch (e) {
      _showError("Gagal load kategori: $e");
    } finally {
      setState(() => loading = false);
    }
  }

  // =========================
  // LOAD COMMODITIES BY CATEGORY
  // =========================
  Future<void> _loadCommodities(int categoryId) async {
    setState(() => loading = true);

    try {
      final res = await _apiService.getCommodityTypes(categoryId);

      setState(() {
        commodities = res;
        priceSuggestion = null;
      });
    } catch (e) {
      _showError("Gagal load komoditas: $e");
    } finally {
      setState(() => loading = false);
    }
  }

  // =========================
  // LOAD PRICE SUGGESTION (FIXED)
  // =========================
  Future<void> _loadPriceSuggestion(int commodityId) async {
    try {
      final suggestion = await _apiService.getPriceSuggestion(commodityId);
      
      setState(() {
        priceSuggestion = suggestion;
        // ✅ FIX: Gunakan null check dengan ?. dan fallback value
        if (suggestion != null) {
          final suggestedPrice = suggestion.suggestedPrice ?? 
                                 suggestion.marketPrice ?? 
                                 suggestion.predictedPrice ?? 0;
          priceController.text = suggestedPrice.toStringAsFixed(0);
        }
      });
    } catch (e) {
      _showError("Gagal load rekomendasi harga: $e");
    }
  }

  // =========================
  // PICK IMAGE - WEB COMPATIBLE
  // =========================
  Future<void> _pickImage() async {
    try {
      final img = await _picker.pickImage(
        source: ImageSource.gallery,
        imageQuality: 80,
      );
      
      if (img != null) {
        final bytes = await img.readAsBytes();
        
        setState(() {
          imageFile = File(img.path);
          imageBytes = bytes;
        });
      }
    } catch (e) {
      _showError("Gagal pilih gambar: $e");
    }
  }

  // =========================
  // UPLOAD IMAGE - WEB SAFE (FIXED)
  // =========================
  Future<String?> _uploadImage() async {
    if (imageFile == null) return null;
    
    setState(() => isUploading = true);
    
    try {
      // ✅ FIX: Hanya 1 parameter (file)
      final upload = await _apiService.uploadFile(imageFile!);
      
      if (upload['success'] == true) {
        return upload['data']?['url'] ?? upload['url'];
      }
      return null;
    } catch (e) {
      print('Error uploading image: $e');
      return null;
    } finally {
      setState(() => isUploading = false);
    }
  }

  // =========================
  // SUBMIT SELL
  // =========================
  Future<void> _submit() async {
    if (selectedCategory == null) {
      _showError("Pilih kategori komoditas dulu");
      return;
    }
    if (selectedCommodity == null) {
      _showError("Pilih hasil panen kamu");
      return;
    }
    if (qtyController.text.isEmpty) {
      _showError("Masukkan jumlah panen");
      return;
    }
    if (priceController.text.isEmpty) {
      _showError("Masukkan harga jual");
      return;
    }

    setState(() => submitting = true);

    try {
      String? imageUrl;
      
      if (imageFile != null) {
        imageUrl = await _uploadImage();
      }

      final data = {
        "farmer_id": await _getFarmerId(),
        "category_id": selectedCategory!.id,
        "commodity_type_id": selectedCommodity!.id,
        "quantity_kg": double.tryParse(qtyController.text) ?? 0,
        "price_per_kg": double.tryParse(priceController.text) ?? 0,
        "market_reference_price": priceSuggestion?.marketPrice ?? 0,
        "image_url": imageUrl,
        "location": "Bogor, Jawa Barat",
        "grade": "A",
        "description": descController.text,
      };

      await _apiService.sellProduct(data);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("✅ Panen berhasil dipublish ke marketplace!"),
            backgroundColor: Colors.green,
          ),
        );
        
        // Reset form
        setState(() {
          selectedCategory = null;
          selectedCommodity = null;
          commodities = [];
          priceSuggestion = null;
          qtyController.clear();
          priceController.clear();
          descController.clear();
          imageFile = null;
          imageBytes = null;
        });
      }
    } catch (e) {
      _showError("Gagal submit: $e");
    } finally {
      setState(() => submitting = false);
    }
  }

  Future<int> _getFarmerId() async {
    // TODO: Ambil dari shared preferences / user profile
    return 8;
  }

  // =========================
  // UI
  // =========================
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Jual Hasil Panen"),
        backgroundColor: Colors.green,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      bottomNavigationBar: const FarmerBottomNavigation(
        currentIndex: 2,
      ),
      body: loading
          ? const Center(
              child: CircularProgressIndicator(),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildHeader(),
                  const SizedBox(height: 20),

                  _buildCategoryDropdown(),

                  const SizedBox(height: 16),

                  if (commodities.isNotEmpty)
                    _buildCommodityDropdown(),

                  const SizedBox(height: 16),

                  if (priceSuggestion != null)
                    _buildPriceSuggestion(),

                  const SizedBox(height: 16),

                  _buildImageUploader(),

                  if (isUploading)
                    const Padding(
                      padding: EdgeInsets.all(8.0),
                      child: LinearProgressIndicator(),
                    ),

                  const SizedBox(height: 16),

                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: qtyController,
                          keyboardType: TextInputType.number,
                          decoration: const InputDecoration(
                            labelText: "📦 Jumlah Panen (kg)",
                            border: OutlineInputBorder(),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: TextField(
                          controller: priceController,
                          keyboardType: TextInputType.number,
                          decoration: const InputDecoration(
                            labelText: "💰 Harga Jual (Rp/kg)",
                            border: OutlineInputBorder(),
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 8),

                  if (priceSuggestion != null)
                    Padding(
                      padding: const EdgeInsets.only(left: 8),
                      child: Text(
                        "💡 Petani lain biasanya jual di kisaran ${priceSuggestion!.formattedSuggested}",
                        style: TextStyle(
                          fontSize: 11,
                          color: Colors.grey[600],
                        ),
                      ),
                    ),

                  const SizedBox(height: 16),

                  _buildTotalPreview(),

                  const SizedBox(height: 16),

                  TextField(
                    controller: descController,
                    maxLines: 2,
                    decoration: const InputDecoration(
                      labelText: "📝 Catatan Panen (opsional)",
                      hintText: "Contoh: Hasil panen segar, langsung dari kebun",
                      border: OutlineInputBorder(),
                    ),
                  ),

                  const SizedBox(height: 24),

                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: (submitting || isUploading) ? null : _submit,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: submitting
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : const Text(
                              "Jual Panen Sekarang",
                              style: TextStyle(fontSize: 16),
                            ),
                    ),
                  ),

                  const SizedBox(height: 100),
                ],
              ),
            ),
    );
  }

  // =========================
  // SEPARATE DROPDOWN WIDGETS
  // =========================
  
  Widget _buildCategoryDropdown() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("📂 Kategori Komoditas", style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
        const SizedBox(height: 8),
        DropdownButtonFormField<ProductCategory>(
          value: selectedCategory,
          isExpanded: true,
          hint: const Text("Pilih kategori"),
          decoration: InputDecoration(
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          ),
          items: categories.map((e) {
            return DropdownMenuItem<ProductCategory>(
              value: e,
              child: Text("${_getCategoryIcon(e.name)} ${e.name}"),
            );
          }).toList(),
          onChanged: (val) {
            setState(() {
              selectedCategory = val;
              selectedCommodity = null;
              commodities = [];
              priceSuggestion = null;
              priceController.clear();
            });

            if (val != null) {
              _loadCommodities(val.id);
            }
          },
        ),
      ],
    );
  }

  Widget _buildCommodityDropdown() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("🌱 Hasil Panen Kamu", style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
        const SizedBox(height: 8),
        DropdownButtonFormField<CommodityType>(
          value: selectedCommodity,
          isExpanded: true,
          hint: const Text("Pilih hasil panen"),
          decoration: InputDecoration(
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          ),
          items: commodities.map((e) {
            return DropdownMenuItem<CommodityType>(
              value: e,
              child: Text(e.name),
            );
          }).toList(),
          onChanged: (val) {
            setState(() {
              selectedCommodity = val;
              priceController.clear();
              priceSuggestion = null;
            });

            if (val != null) {
              _loadPriceSuggestion(val.id);
            }
          },
        ),
      ],
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.green.shade50, Colors.green.shade100],
        ),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          const Icon(Icons.agriculture, size: 32, color: Colors.green),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Jual Hasil Panen',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.green,
                  ),
                ),
                Text(
                  'Dapatkan harga terbaik dengan rekomendasi harga pasar',
                  style: TextStyle(fontSize: 12, color: Colors.grey[700]),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPriceSuggestion() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.green[50],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.green[200]!),
      ),
      child: Row(
        children: [
          const Icon(Icons.lightbulb, color: Colors.green, size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "💡 Rekomendasi Harga Pasar",
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: Colors.green[700],
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  priceSuggestion?.formattedSuggested ?? "Rp 0",
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Colors.green,
                  ),
                ),
                Text(
                  "Kisaran: ${_formatPrice(priceSuggestion?.minPrice ?? 0)} - ${_formatPrice(priceSuggestion?.maxPrice ?? 0)} / kg",
                  style: TextStyle(fontSize: 10, color: Colors.grey[600]),
                ),
              ],
            ),
          ),
          TextButton(
            onPressed: () {
              if (priceSuggestion != null) {
                final suggestedPrice = priceSuggestion!.suggestedPrice ?? 
                                       priceSuggestion!.marketPrice ?? 
                                       priceSuggestion!.predictedPrice ?? 0;
                setState(() {
                  priceController.text = suggestedPrice.toStringAsFixed(0);
                });
              }
            },
            style: TextButton.styleFrom(
              backgroundColor: Colors.green[100],
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: const Text("Pakai", style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildImageUploader() {
    return GestureDetector(
      onTap: _pickImage,
      child: Container(
        height: 150,
        width: double.infinity,
        decoration: BoxDecoration(
          color: Colors.grey[100],
          border: Border.all(color: Colors.grey[300]!),
          borderRadius: BorderRadius.circular(12),
        ),
        child: imageBytes != null
            ? Stack(
                fit: StackFit.expand,
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.memory(
                      imageBytes!,
                      fit: BoxFit.cover,
                    ),
                  ),
                  Positioned(
                    top: 8,
                    right: 8,
                    child: GestureDetector(
                      onTap: () => setState(() {
                        imageFile = null;
                        imageBytes = null;
                      }),
                      child: Container(
                        decoration: BoxDecoration(
                          color: Colors.black54,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(
                          Icons.close,
                          color: Colors.white,
                          size: 20,
                        ),
                      ),
                    ),
                  ),
                ],
              )
            : Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.add_photo_alternate,
                      size: 48, color: Colors.grey[400]),
                  const SizedBox(height: 8),
                  Text(
                    'Tap untuk upload foto',
                    style: TextStyle(color: Colors.grey[600]),
                  ),
                  Text(
                    'JPG, PNG, maks 5MB',
                    style: TextStyle(color: Colors.grey[400], fontSize: 10),
                  ),
                ],
              ),
      ),
    );
  }

  Widget _buildTotalPreview() {
    final qty = double.tryParse(qtyController.text) ?? 0;
    final price = double.tryParse(priceController.text) ?? 0;
    final total = qty * price;

    if (qty <= 0 || price <= 0) return const SizedBox.shrink();

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.green[50],
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.green[200]!),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text(
            '💰 Total Pendapatan:',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                'Rp ${_formatPrice(total)}',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Colors.green,
                  fontSize: 16,
                ),
              ),
              Text(
                '${qty.toStringAsFixed(0)} kg × Rp ${_formatPrice(price)}/kg',
                style: TextStyle(fontSize: 11, color: Colors.grey[600]),
              ),
            ],
          ),
        ],
      ),
    );
  }

  String _getCategoryIcon(String categoryName) {
    switch (categoryName.toLowerCase()) {
      case 'padi':
        return '🌾';
      case 'jagung':
        return '🌽';
      case 'cabai':
        return '🌶️';
      case 'tomat':
        return '🍅';
      case 'sayuran':
        return '🥬';
      case 'buah':
        return '🍎';
      default:
        return '🌱';
    }
  }

  String _formatPrice(double price) {
    return price.toStringAsFixed(0).replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
      (m) => '${m[1]}.',
    );
  }

  void _showError(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg),
        backgroundColor: Colors.red,
      ),
    );
  }
}