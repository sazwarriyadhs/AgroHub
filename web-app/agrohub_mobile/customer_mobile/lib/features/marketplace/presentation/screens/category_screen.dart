import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:agrohub_customer/features/marketplace/presentation/screens/category_detail_screen.dart';

class Category {
  final int id;
  final String name;
  final String slug;
  final String emoji;
  final Color color;

  Category({
    required this.id,
    required this.name,
    required this.slug,
    required this.emoji,
    required this.color,
  });
}

class CategoryScreen extends StatelessWidget {
  const CategoryScreen({super.key});

  // 🌍 MAPPING REAL DATABASE ID & SLUG (Diambil dari seleksi database AgroHub kamu)
  List<Category> get categories => [
        Category(id: 31, name: 'Padi & Beras', slug: 'padi-beras', emoji: '🌾', color: Colors.amber.shade100),
        Category(id: 32, name: 'Sayuran', slug: 'sayuran', emoji: '🥬', color: Colors.green.shade100),
        Category(id: 33, name: 'Buah-buahan', slug: 'buah', emoji: '🍎', color: Colors.red.shade100),
        Category(id: 34, name: 'Pupuk', slug: 'pupuk', emoji: '🟫', color: Colors.brown.shade100),
        Category(id: 35, name: 'Bibit', slug: 'bibit', emoji: '🌱', color: Colors.lightGreen.shade100),
        Category(id: 36, name: 'Pakan Ternak', slug: 'pakan-ternak', emoji: '🌾', color: Colors.orange.shade100),
        Category(id: 37, name: 'Ikan Air Tawar', slug: 'ikan-air-tawar', emoji: '🐟', color: Colors.blue.shade100),
        Category(id: 38, name: 'Peralatan Tani', slug: 'alat-tani', emoji: '🛠️', color: Colors.grey.shade200),
        Category(id: 41, name: 'Hidroponik', slug: 'hidroponik', emoji: '💧', color: Colors.teal.shade50),
        Category(id: 51, name: 'Peternakan (Sapi)', slug: 'sapi', emoji: '76', color: Colors.orange.shade50),
        Category(id: 69, name: 'Smart Farming', slug: 'smart-farming', emoji: '🤖', color: Colors.purple.shade50),
        Category(id: 78, name: 'Promo', slug: 'promo', emoji: '🏷️', color: Colors.red.shade50),
      ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        title: Text(
          'Kategori Produk',
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),

      body: GridView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: categories.length,
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
          childAspectRatio: 1.1,
        ),
        itemBuilder: (context, index) {
          final category = categories[index];

          return GestureDetector(
            onTap: () {
              // 🚀 SEKARANG TERKONEKSI: Mengarah ke CategoryDetailScreen dengan ID asli DB
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => CategoryDetailScreen(
                    categoryId: category.id,
                    categoryName: category.name,
                  ),
                ),
              );
            },
            child: Container(
              decoration: BoxDecoration(
                color: category.color,
                borderRadius: BorderRadius.circular(18),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.04),
                    blurRadius: 10,
                    offset: const Offset(0, 5),
                  )
                ],
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(category.emoji, style: const TextStyle(fontSize: 42)),
                  const SizedBox(height: 10),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 8),
                    child: Text(
                      category.name,
                      textAlign: TextAlign.center,
                      style: GoogleFonts.poppins(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: Colors.black87,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}