// lib/features/add_product/presentation/screens/add_product_screen.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:dio/dio.dart';

import '../../../../core/constants/app_constants.dart';
import '../../../../core/services/api_client.dart';

class AddProductScreen extends StatefulWidget {
  const AddProductScreen({super.key});

  @override
  State<AddProductScreen> createState() => _AddProductScreenState();
}

class _AddProductScreenState extends State<AddProductScreen> {
  bool _isLoading = false;
  final _formKey = GlobalKey<FormState>();
  
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _priceController = TextEditingController();
  final TextEditingController _stockController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();
  final TextEditingController _categoryController = TextEditingController();
  
  String _selectedCategory = 'Sayuran';
  final List<String> _categories = [
    'Sayuran', 'Buah-buahan', 'Padi/Beras', 'Jagung', 
    'Kedelai', 'Cabai', 'Bawang', 'Hortikultura', 
    'Peternakan', 'Perikanan', 'Lainnya'
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _priceController.dispose();
    _stockController.dispose();
    _descriptionController.dispose();
    _categoryController.dispose();
    super.dispose();
  }

  Future<void> _uploadProduct() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      const storage = FlutterSecureStorage();
      final token = await storage.read(key: AppConstants.tokenKey);

      if (token == null || token.isEmpty) {
        _showMessage('Silakan login terlebih dahulu', isError: true);
        return;
      }

      ApiClient.instance.setAuthToken(token);

      final data = {
        'name': _nameController.text.trim(),
        'price': int.parse(_priceController.text.trim()),
        'stock': int.parse(_stockController.text.trim()),
        'description': _descriptionController.text.trim(),
        'category': _selectedCategory,
      };

      final response = await ApiClient.instance.post(
        AppConstants.productsEndpoint,
        data: data,
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        _showMessage('Produk berhasil diupload!', isError: false);
        _clearForm();
        Navigator.pop(context, true);
      } else {
        _showMessage('Gagal upload produk: ${response.data}', isError: true);
      }
    } on DioException catch (e) {
      _showMessage('Error: ${e.response?.data['message'] ?? e.message}', isError: true);
    } catch (e) {
      _showMessage('Terjadi kesalahan: $e', isError: true);
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _clearForm() {
    _nameController.clear();
    _priceController.clear();
    _stockController.clear();
    _descriptionController.clear();
    _categoryController.clear();
    setState(() {
      _selectedCategory = 'Sayuran';
    });
  }

  void _showMessage(String message, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? Colors.red : Colors.green,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
Widget build(BuildContext context) {
  return Scaffold(
    backgroundColor: const Color(0xFF021A14),
    appBar: AppBar(
      title: Text(
        'Jual Produk',
        style: GoogleFonts.poppins(
          color: Colors.white,
          fontWeight: FontWeight.w600,
        ),
      ),
      centerTitle: true,
      backgroundColor: const Color(0xFF021A14),
      elevation: 0,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
        onPressed: () => Navigator.pop(context),
      ),
    ),
    body: SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Upload Image Placeholder
            Center(
              child: Container(
                height: 150,
                width: 150,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white.withOpacity(0.1)),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.cloud_upload_outlined,
                      size: 40,
                      color: Colors.white.withOpacity(0.5),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Upload Foto',
                      style: GoogleFonts.poppins(
                        color: Colors.white.withOpacity(0.5),
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Nama Produk
            _buildTextField(
              controller: _nameController,
              label: 'Nama Produk',
              hint: 'Contoh: Cabai Merah Keriting',
              icon: Icons.production_quantity_limits,
              validator: (value) => value?.isEmpty == true ? 'Nama produk harus diisi' : null,
            ),
            const SizedBox(height: 16),

            // Harga
            _buildTextField(
              controller: _priceController,
              label: 'Harga (Rp)',
              hint: 'Contoh: 15000',
              icon: Icons.attach_money,
              keyboardType: TextInputType.number,
              validator: (value) => value?.isEmpty == true ? 'Harga harus diisi' : null,
            ),
            const SizedBox(height: 16),

            // Stok
            _buildTextField(
              controller: _stockController,
              label: 'Stok',
              hint: 'Contoh: 100',
              icon: Icons.inventory,
              keyboardType: TextInputType.number,
              validator: (value) => value?.isEmpty == true ? 'Stok harus diisi' : null,
            ),
            const SizedBox(height: 16),

            // Kategori
            Container(
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.05),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withOpacity(0.1)),
              ),
              child: DropdownButtonFormField<String>(
                value: _selectedCategory,
                dropdownColor: const Color(0xFF052E24),
                style: GoogleFonts.poppins(color: Colors.white),
                decoration: InputDecoration(
                  prefixIcon: Icon(Icons.category, color: Colors.white.withOpacity(0.7)),
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                  labelText: 'Kategori',
                  labelStyle: GoogleFonts.poppins(color: Colors.white.withOpacity(0.7)),
                ),
                items: _categories.map((category) {
                  return DropdownMenuItem(
                    value: category,
                    child: Text(category, style: GoogleFonts.poppins(color: Colors.white)),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedCategory = value!;
                  });
                },
              ),
            ),
            const SizedBox(height: 16),

            // Deskripsi
            _buildTextField(
              controller: _descriptionController,
              label: 'Deskripsi',
              hint: 'Jelaskan produk Anda...',
              icon: Icons.description,
              maxLines: 4,
            ),
            const SizedBox(height: 32),

            // Tombol Upload
            SizedBox(
              width: double.infinity,
              height: 55,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _uploadProduct,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1B8F3E),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : Text(
                        'Upload Produk',
                        style: GoogleFonts.poppins(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
              ),
            ),
          ],
        ),
      ),
    ),
  );
}

Widget _buildTextField({
  required TextEditingController controller,
  required String label,
  required String hint,
  required IconData icon,
  TextInputType keyboardType = TextInputType.text,
  int maxLines = 1,
  String? Function(String?)? validator,
}) {
  return Container(
    decoration: BoxDecoration(
      color: Colors.white.withOpacity(0.05),
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: Colors.white.withOpacity(0.1)),
    ),
    child: TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      maxLines: maxLines,
      style: GoogleFonts.poppins(color: Colors.white),
      decoration: InputDecoration(
        prefixIcon: Icon(icon, color: Colors.white.withOpacity(0.7)),
        border: InputBorder.none,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        labelText: label,
        labelStyle: GoogleFonts.poppins(color: Colors.white.withOpacity(0.7)),
        hintText: hint,
        hintStyle: GoogleFonts.poppins(color: Colors.white.withOpacity(0.3)),
      ),
      validator: validator,
    ),
  );
}
}