// lib/features/marketplace/presentation/screens/jual_screen.dart
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';

import 'package:agrohub_aqua_app/app/theme/app_theme.dart';
import '../../../../core/services/api_service.dart';
import '../bloc/marketplace_bloc.dart';
import '../../../dashboard/presentation/screens/aqua_dashboard.dart';

class JualScreen extends StatelessWidget {
  const JualScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => MarketplaceBloc(
        apiService: context.read<ApiService>(),
      )..add(const LoadMyProducts()),
      child: const _JualScreenView(),
    );
  }
}

class _JualScreenView extends StatefulWidget {
  const _JualScreenView();

  @override
  State<_JualScreenView> createState() => _JualScreenViewState();
}

class _JualScreenViewState extends State<_JualScreenView> {
  bool _isAddingProduct = false;

  final _formKey = GlobalKey<FormState>();

  // IMAGE
  XFile? _selectedImage;
  final ImagePicker _picker = ImagePicker();

  // FORM
  final TextEditingController _productNameController = TextEditingController();
  final TextEditingController _productPriceController = TextEditingController();
  final TextEditingController _productStockController = TextEditingController();
  final TextEditingController _productDescController = TextEditingController();

  String _selectedCategory = "Ikan Hidup";
  String _selectedLocation = "Jawa Timur";

  final List<Map<String, dynamic>> _categories = [
    {"name": "Ikan Hidup", "icon": Icons.set_meal, "color": Colors.blue},
    {"name": "Bibit Ikan", "icon": Icons.water, "color": Colors.green},
    {"name": "Pakan Ikan", "icon": Icons.restaurant, "color": Colors.orange},
    {"name": "Peralatan", "icon": Icons.build, "color": Colors.purple},
    {"name": "Obat Ikan", "icon": Icons.medical_services, "color": Colors.red},
  ];

  final List<String> _locations = [
    "Aceh", "Sumatera Utara", "DKI Jakarta", "Jawa Barat",
    "Jawa Tengah", "Jawa Timur", "Bali", "Sulawesi Selatan", "Papua",
  ];

  @override
  void dispose() {
    _productNameController.dispose();
    _productPriceController.dispose();
    _productStockController.dispose();
    _productDescController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FB),
      appBar: _buildAppBar(),
      floatingActionButton: !_isAddingProduct
          ? FloatingActionButton.extended(
              backgroundColor: AppTheme.primaryColor,
              onPressed: () => setState(() => _isAddingProduct = true),
              icon: const Icon(Icons.add),
              label: Text("Tambah Produk", style: GoogleFonts.poppins()),
            )
          : null,
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 300),
        child: _isAddingProduct
            ? _buildAddProductForm()
            : _buildProductList(),
      ),
    );
  }

  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      backgroundColor: Colors.white,
      elevation: 0,
      centerTitle: true,
      leading: IconButton(
        icon: Icon(Icons.arrow_back_ios_new, color: AppTheme.primaryColor),
        onPressed: () => Navigator.pop(context),
      ),
      title: Text(
        "Jual Produk",
        style: GoogleFonts.poppins(
          color: AppTheme.primaryColor,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildProductList() {
    return BlocBuilder<MarketplaceBloc, MarketplaceState>(
      builder: (context, state) {
        if (state.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }

        if (state.myProducts.isEmpty) {
          return Center(
            child: Padding(
              padding: const EdgeInsets.all(30),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.storefront_outlined, size: 100, color: Colors.grey.shade300),
                  const SizedBox(height: 20),
                  Text("Belum ada produk", style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 10),
                  Text(
                    "Mulai jual hasil panen ikanmu sekarang 🚀",
                    textAlign: TextAlign.center,
                    style: GoogleFonts.poppins(color: Colors.grey.shade600),
                  ),
                ],
              ),
            ),
          );
        }

        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: state.myProducts.length,
          itemBuilder: (context, index) {
            final product = state.myProducts[index];
            return _buildProductCard(product, index);
          },
        );
      },
    );
  }

  Widget _buildProductCard(ProductEntity product, int index) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 12, offset: const Offset(0, 4)),
        ],
      ),
      child: Row(
        children: [
          _buildProductImage(product.imageUrl),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(product.name, maxLines: 1, overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 15)),
                const SizedBox(height: 6),
                Text(_formatRupiah(product.price),
                    style: GoogleFonts.poppins(color: AppTheme.primaryColor, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                Text("${product.category} • ${product.location}",
                    style: GoogleFonts.poppins(fontSize: 11, color: Colors.grey.shade600)),
                const SizedBox(height: 4),
                Text("Stok ${product.stock}",
                    style: GoogleFonts.poppins(fontSize: 11, color: Colors.grey.shade600)),
              ],
            ),
          ),
          BlocBuilder<MarketplaceBloc, MarketplaceState>(
            builder: (context, state) {
              return IconButton(
                onPressed: state.isSubmitting ? null : () => _confirmDeleteProduct(product.id, context),
                icon: state.isSubmitting && state.myProducts[index].id == product.id
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
                    : const Icon(Icons.delete_outline, color: Colors.red),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildProductImage(String? imageUrl) {
    if (imageUrl == null || imageUrl.isEmpty) {
      return Container(
        width: 90, height: 90,
        decoration: BoxDecoration(
          color: AppTheme.primaryColor.withOpacity(0.08),
          borderRadius: BorderRadius.circular(18),
        ),
        child: Icon(Icons.image_outlined, color: AppTheme.primaryColor, size: 34),
      );
    }

    return ClipRRect(
      borderRadius: BorderRadius.circular(18),
      child: kIsWeb
          ? Image.network(imageUrl, width: 90, height: 90, fit: BoxFit.cover)
          : Image.file(File(imageUrl), width: 90, height: 90, fit: BoxFit.cover),
    );
  }

  Widget _buildAddProductForm() {
    return BlocListener<MarketplaceBloc, MarketplaceState>(
      listener: (context, state) {
        if (!state.isSubmitting && _isAddingProduct) {
          setState(() {
            _isAddingProduct = false;
            _clearForm();
          });
          _showSuccessDialog();
        }
        if (state.error != null && state.error!.isNotEmpty) {
          _showSnackbar(state.error!);
          context.read<MarketplaceBloc>().add(const LoadMyProducts());
        }
      },
      child: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text("Tambah Produk", style: GoogleFonts.poppins(fontSize: 24, fontWeight: FontWeight.bold)),
              const SizedBox(height: 24),
              _buildImageUploader(),
              const SizedBox(height: 30),
              _buildInput(controller: _productNameController, label: "Nama Produk", hint: "Contoh: Lele Segar", icon: Icons.shopping_bag_outlined),
              const SizedBox(height: 18),
              _buildCategoryDropdown(),
              const SizedBox(height: 18),
              _buildInput(controller: _productPriceController, label: "Harga", hint: "25000", keyboard: TextInputType.number, icon: Icons.payments_outlined),
              const SizedBox(height: 18),
              _buildInput(controller: _productStockController, label: "Stok", hint: "100", keyboard: TextInputType.number, icon: Icons.inventory_2_outlined),
              const SizedBox(height: 18),
              _buildLocationDropdown(),
              const SizedBox(height: 18),
              Text("Deskripsi", style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              TextField(
                controller: _productDescController,
                maxLines: 4,
                decoration: InputDecoration(hintText: "Deskripsi produk...", border: OutlineInputBorder(borderRadius: BorderRadius.circular(16))),
              ),
              const SizedBox(height: 32),
              BlocBuilder<MarketplaceBloc, MarketplaceState>(
                builder: (context, state) {
                  return SizedBox(
                    width: double.infinity,
                    height: 54,
                    child: ElevatedButton(
                      onPressed: state.isSubmitting ? null : _saveProduct,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primaryColor,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                      ),
                      child: state.isSubmitting
                          ? const CircularProgressIndicator(color: Colors.white)
                          : Text("Simpan Produk", style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.bold)),
                    ),
                  );
                },
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildImageUploader() {
    return Center(
      child: GestureDetector(
        onTap: _pickImage,
        child: Container(
          width: 150, height: 150,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: Colors.grey.shade300),
          ),
          child: _selectedImage == null
              ? Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.add_a_photo_outlined, size: 40, color: Colors.grey.shade500),
                    const SizedBox(height: 10),
                    Text("Upload Foto", style: GoogleFonts.poppins(fontSize: 12)),
                  ],
                )
              : ClipRRect(
                  borderRadius: BorderRadius.circular(24),
                  child: kIsWeb
                      ? Image.network(_selectedImage!.path, fit: BoxFit.cover)
                      : Image.file(File(_selectedImage!.path), fit: BoxFit.cover),
                ),
        ),
      ),
    );
  }

  Widget _buildInput({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icon,
    TextInputType keyboard = TextInputType.text,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          keyboardType: keyboard,
          validator: (value) => (value == null || value.trim().isEmpty) ? "$label wajib diisi" : null,
          decoration: InputDecoration(
            hintText: hint,
            prefixIcon: Icon(icon, color: AppTheme.primaryColor),
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
          ),
        ),
      ],
    );
  }

  Widget _buildCategoryDropdown() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("Kategori", style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          value: _selectedCategory,
          items: _categories.map((cat) => DropdownMenuItem(value: cat["name"], child: Text(cat["name"]))).toList(),
          onChanged: (value) => setState(() => _selectedCategory = value!),
          decoration: InputDecoration(
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
          ),
        ),
      ],
    );
  }

  Widget _buildLocationDropdown() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("Lokasi", style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          value: _selectedLocation,
          items: _locations.map((loc) => DropdownMenuItem(value: loc, child: Text(loc))).toList(),
          onChanged: (value) => setState(() => _selectedLocation = value!),
          decoration: InputDecoration(
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
          ),
        ),
      ],
    );
  }

  Future<void> _pickImage() async {
    try {
      final picked = await _picker.pickImage(source: ImageSource.gallery, imageQuality: 80);
      if (picked != null) setState(() => _selectedImage = picked);
    } catch (e) {
      _showSnackbar("Gagal memilih gambar");
    }
  }

  Future<void> _saveProduct() async {
    if (!_formKey.currentState!.validate()) return;

    final price = int.tryParse(_productPriceController.text);
    final stock = int.tryParse(_productStockController.text);

    if (price == null || stock == null) {
      _showSnackbar("Harga dan stok harus angka");
      return;
    }

    final productData = {
      'name': _productNameController.text.trim(),
      'price': price,
      'stock': stock,
      'category': _selectedCategory,
      'location': _selectedLocation,
      'description': _productDescController.text.trim(),
    };

    context.read<MarketplaceBloc>().add(
      CreateProduct(
        productData: productData,
        images: _selectedImage != null ? [File(_selectedImage!.path)] : null,
      ),
    );
  }

  void _confirmDeleteProduct(String productId, BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text("Hapus Produk"),
        content: const Text("Apakah Anda yakin ingin menghapus produk ini?"),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Batal")),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              context.read<MarketplaceBloc>().add(DeleteProduct(productId));
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text("Hapus"),
          ),
        ],
      ),
    );
  }

  void _clearForm() {
    _productNameController.clear();
    _productPriceController.clear();
    _productStockController.clear();
    _productDescController.clear();
    _selectedImage = null;
    _selectedCategory = "Ikan Hidup";
    _selectedLocation = "Jawa Timur";
  }

  void _showSnackbar(String text) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(text), behavior: SnackBarBehavior.floating),
    );
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Icon(Icons.check_circle, color: Colors.green, size: 70),
        content: Text("Produk berhasil ditambahkan 🚀", textAlign: TextAlign.center, style: GoogleFonts.poppins()),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text("OK", style: GoogleFonts.poppins(color: AppTheme.primaryColor, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  String _formatRupiah(int value) {
    final text = value.toString();
    final result = text.replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.');
    return "Rp $result";
  }
}