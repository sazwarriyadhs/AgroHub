import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../cart_checkout/presentation/screens/cart_screen.dart';
import '../../services/deepseek_service.dart';

// ============================================
// CLASS INGREDIENT CHECK RESULT
// ============================================
class IngredientCheckResult {
  final bool hasMissingIngredients;
  final List<String> missingIngredients;
  final List<String> suggestedProducts;
  
  IngredientCheckResult({
    required this.hasMissingIngredients,
    required this.missingIngredients,
    required this.suggestedProducts,
  });
}

// ============================================
// MAIN SCREEN
// ============================================
class AIRecipeScreen extends StatefulWidget {
  const AIRecipeScreen({Key? key}) : super(key: key);

  @override
  State<AIRecipeScreen> createState() => _AIRecipeScreenState();
}

class _AIRecipeScreenState extends State<AIRecipeScreen> {
  final List<String> _ingredients = [];
  final TextEditingController _ingredientController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  int _currentPortion = 2;
  
  String _recipe = '';
  String _selectedCuisine = 'Indonesia';
  bool _isLoading = false;
  List<String> _missingIngredients = [];
  List<String> _suggestedProducts = [];
  
  late final DeepSeekService _deepSeekService;
  
  final List<String> _cuisines = ['Indonesia', 'China', 'Jepang', 'Korea', 'Western', 'Italia'];

  final Map<String, Map<String, dynamic>> _availableProducts = {
    'tomat': {'name': 'Tomat Segar', 'price': 5000, 'unit': 'kg', 'stock': true},
    'bawang merah': {'name': 'Bawang Merah', 'price': 15000, 'unit': 'kg', 'stock': true},
    'bawang putih': {'name': 'Bawang Putih', 'price': 12000, 'unit': 'kg', 'stock': true},
    'cabai': {'name': 'Cabai Merah', 'price': 25000, 'unit': 'kg', 'stock': true},
    'ayam': {'name': 'Daging Ayam', 'price': 35000, 'unit': 'kg', 'stock': true},
    'daging sapi': {'name': 'Daging Sapi', 'price': 120000, 'unit': 'kg', 'stock': true},
    'telur': {'name': 'Telur Ayam', 'price': 2000, 'unit': 'butir', 'stock': true},
    'tahu': {'name': 'Tahu Putih', 'price': 500, 'unit': 'potong', 'stock': true},
    'tempe': {'name': 'Tempe', 'price': 3000, 'unit': 'papan', 'stock': true},
    'wortel': {'name': 'Wortel', 'price': 8000, 'unit': 'kg', 'stock': true},
    'kentang': {'name': 'Kentang', 'price': 10000, 'unit': 'kg', 'stock': true},
    'kol': {'name': 'Kol/Kubis', 'price': 7000, 'unit': 'kg', 'stock': true},
    'sawi': {'name': 'Sawi Hijau', 'price': 5000, 'unit': 'ikat', 'stock': true},
    'buncis': {'name': 'Buncis', 'price': 9000, 'unit': 'kg', 'stock': true},
    'jagung': {'name': 'Jagung Manis', 'price': 6000, 'unit': 'buah', 'stock': true},
  };

  @override
  void initState() {
    super.initState();
    _deepSeekService = DeepSeekService(useMockData: true);
  }

  void _addIngredient() {
    final text = _ingredientController.text.trim().toLowerCase();
    if (text.isNotEmpty) {
      final isAvailable = _availableProducts.keys.any((key) => text.contains(key));
      
      setState(() {
        _ingredients.add(_ingredientController.text.trim());
        _ingredientController.clear();
      });
      
      if (!isAvailable) {
        _showSuggestionForMissingIngredient(text);
      }
    }
  }

  void _removeIngredient(int index) {
    setState(() {
      _ingredients.removeAt(index);
    });
  }

  void _showSuggestionForMissingIngredient(String ingredient) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.info_outline, color: Colors.white, size: 20),
            const SizedBox(width: 8),
            Expanded(child: Text('"$ingredient" belum terdaftar di dapur utama.')),
          ],
        ),
        behavior: SnackBarBehavior.floating,
        backgroundColor: Colors.amber.shade800,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        action: SnackBarAction(
          label: 'Cari Toko',
          textColor: Colors.white,
          onPressed: () => _navigateToMarketplaceWithSearch(ingredient),
        ),
      ),
    );
  }

  void _navigateToMarketplaceWithSearch(String ingredient) {
    Navigator.pushNamed(
      context,
      '/marketplace',
      arguments: {'search': ingredient},
    );
  }

  Future<void> _generateRecipe() async {
    if (_ingredients.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Silakan masukkan bahan masakan Anda dulu ya.'),
          behavior: SnackBarBehavior.floating,
          backgroundColor: Colors.red.shade400,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      );
      return;
    }

    setState(() {
      _isLoading = true;
      _recipe = '';
      _missingIngredients = [];
      _suggestedProducts = [];
    });

    try {
      final checkResult = await _checkIngredientsCompleteness(_ingredients, _currentPortion);
      
      if (checkResult.hasMissingIngredients) {
        setState(() {
          _missingIngredients = checkResult.missingIngredients;
          _suggestedProducts = checkResult.suggestedProducts;
        });
        _showMissingIngredientsDialog(checkResult);
      } else {
        final aiRecipe = await _deepSeekService.generateRecipe(_ingredients);
        final formattedRecipe = _formatRecipeWithPortion(aiRecipe, _selectedCuisine, _currentPortion);
        
        setState(() {
          _recipe = formattedRecipe;
        });

        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (_scrollController.hasClients) {
            _scrollController.animateTo(
              _scrollController.position.maxScrollExtent,
              duration: const Duration(milliseconds: 600),
              curve: Curves.easeOutCubic,
            );
          }
        });
      }
    } catch (e) {
      setState(() {
        _recipe = _getFallbackRecipe(_currentPortion);
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<IngredientCheckResult> _checkIngredientsCompleteness(List<String> ingredients, int desiredPortion) async {
    final List<String> missing = [];
    final List<String> suggestions = [];
    
    for (var ingredient in ingredients) {
      final found = _availableProducts.keys.any((key) => 
        ingredient.toLowerCase().contains(key) || key.contains(ingredient.toLowerCase())
      );
      
      if (!found) {
        missing.add(ingredient);
        final similar = _findSimilarProduct(ingredient);
        if (similar != null) suggestions.add(similar);
      }
    }
    
    const int basePortion = 2;
    if (desiredPortion > basePortion) {
      final multiplier = (desiredPortion / basePortion).ceil();
      for (var ingredient in ingredients) {
        final product = _findProductByName(ingredient);
        if (product != null) {
          suggestions.add('${product['name']} (${multiplier}x Lipat) - Rp ${product['price'] * multiplier}');
        }
      }
    }
    
    return IngredientCheckResult(
      hasMissingIngredients: missing.isNotEmpty,
      missingIngredients: missing,
      suggestedProducts: suggestions,
    );
  }

  String? _findSimilarProduct(String ingredient) {
    for (var key in _availableProducts.keys) {
      if (ingredient.toLowerCase().contains(key) || key.contains(ingredient.toLowerCase())) {
        final product = _availableProducts[key];
        return '${product!['name']} - Rp ${product['price']}/${product['unit']}';
      }
    }
    return null;
  }

  Map<String, dynamic>? _findProductByName(String ingredient) {
    for (var key in _availableProducts.keys) {
      if (ingredient.toLowerCase().contains(key)) return _availableProducts[key];
    }
    return null;
  }

  void _showMissingIngredientsDialog(IngredientCheckResult result) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: Row(
          children: [
            Icon(Icons.shopping_basket_outlined, color: Colors.green.shade700, size: 28),
            const SizedBox(width: 10),
            Text(
              'Optimasi Bahan AI',
              style: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 18),
            ),
          ],
        ),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Bahan berikut perlu disesuaikan dengan pasar AgroHub agar rasa porsi maksimal:',
                style: GoogleFonts.poppins(fontSize: 13, color: Colors.grey.shade700),
              ),
              const SizedBox(height: 16),
              if (result.missingIngredients.isNotEmpty) ...[
                Text('⚠️ Belum Tersedia:', style: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.orange.shade800)),
                const SizedBox(height: 6),
                Wrap(
                  spacing: 6,
                  children: result.missingIngredients.map((ing) => Chip(
                    label: Text(ing, style: const TextStyle(fontSize: 11)),
                    backgroundColor: Colors.orange.shade50,
                    side: BorderSide(color: Colors.orange.shade200), // PERBAIKAN: border -> side
                  )).toList(),
                ),
                const SizedBox(height: 16),
              ],
              if (result.suggestedProducts.isNotEmpty) ...[
                Text('🛒 Rekomendasi Instan Kelengkapan:', style: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.green.shade800)),
                const SizedBox(height: 8),
                ...result.suggestedProducts.map((product) => Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.green.shade50,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: Colors.green.shade100),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.add_shopping_cart, size: 16, color: Colors.green),
                      const SizedBox(width: 8),
                      Expanded(child: Text(product, style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w500))),
                    ],
                  ),
                )),
              ],
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Nanti Saja', style: GoogleFonts.poppins(color: Colors.grey)),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _navigateToMarketplace();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green.shade700,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            ),
            child: Text('Lengkapi di Pasar', style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.w600)),
          ),
        ],
      ),
    );
  }

  void _navigateToMarketplace() {
    Navigator.pushNamed(context, '/marketplace');
  }

  String _formatRecipeWithPortion(String aiRecipe, String cuisine, int portion) {
    return aiRecipe;
  }

  String _getFallbackRecipe(int portion) {
    return '''
🥘 **RESEP DARURAT AGROHUB** 🥘

**JUDUL:** Olahan Spesial ${_selectedCuisine}

**BAHAN YANG TERSEDIA:**
${_ingredients.map((i) => "• $i").join("\n")}

**CARA MEMASAK:**
1. Siapkan semua bahan yang tersedia
2. Cuci bersih dan potong sesuai selera
3. Panaskan minyak, tumis bumbu halus hingga harum
4. Masukkan bahan utama, aduk rata
5. Tambahkan garam, merica, dan penyedap sesuai selera
6. Masak hingga matang (10-15 menit)
7. Sajikan selagi hangat

**📊 Informasi:**
• Porsi: $portion orang
• Waktu masak: 20 menit
• Level: Mudah

💡 **Tips:** Untuk hasil maksimal, lengkapi bahan di marketplace AgroHub!
''';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        title: Text(
          'AgroHub AI Recipe',
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold, color: Colors.black87),
        ),
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.shopping_cart_outlined, color: Colors.black87),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const CartScreen()),
              );
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Column(
        children: [
          if (_isLoading) LinearProgressIndicator(color: Colors.green.shade600, backgroundColor: Colors.green.shade100),
          Expanded(
            child: SingleChildScrollView(
              controller: _scrollController,
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildCuisineSelector(),
                  const SizedBox(height: 20),
                  _buildPortionCounter(),
                  const SizedBox(height: 20),
                  _buildIngredientInput(),
                  const SizedBox(height: 14),
                  if (_ingredients.isNotEmpty) _buildIngredientsList(),
                  const SizedBox(height: 24),
                  _buildGenerateButton(),
                  if (_recipe.isNotEmpty) ...[
                    const SizedBox(height: 24),
                    _buildRecipeResultCard(),
                  ]
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCuisineSelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Kategori Kuliner',
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.black87),
        ),
        const SizedBox(height: 10),
        SizedBox(
          height: 42,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: _cuisines.length,
            itemBuilder: (context, index) {
              final cuisine = _cuisines[index];
              final isSelected = _selectedCuisine == cuisine;
              return Padding(
                padding: const EdgeInsets.only(right: 8),
                child: ChoiceChip(
                  label: Text(cuisine),
                  selected: isSelected,
                  labelStyle: GoogleFonts.poppins(
                    fontSize: 13,
                    color: isSelected ? Colors.white : Colors.black87,
                    fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                  ),
                  selectedColor: Colors.green.shade600,
                  backgroundColor: Colors.white,
                  side: BorderSide(color: isSelected ? Colors.transparent : Colors.grey.shade300), // PERBAIKAN: border -> side
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  onSelected: _isLoading ? null : (selected) {
                    if (selected) setState(() => _selectedCuisine = cuisine);
                  },
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildPortionCounter() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Porsi Konsumsi', style: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 14)),
              Text('Sesuaikan takaran bahan otomatis', style: GoogleFonts.poppins(fontSize: 11, color: Colors.grey)),
            ],
          ),
          Row(
            children: [
              _counterButton(icon: Icons.remove, onPressed: _currentPortion > 1 && !_isLoading ? () => setState(() => _currentPortion--) : null),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Text('$_currentPortion', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold)),
              ),
              _counterButton(icon: Icons.add, onPressed: !_isLoading ? () => setState(() => _currentPortion++) : null),
            ],
          )
        ],
      ),
    );
  }

  Widget _counterButton({required IconData icon, VoidCallback? onPressed}) {
    return IconButton.filledTonal(
      onPressed: onPressed,
      style: IconButton.styleFrom(
        backgroundColor: Colors.green.shade50,
        foregroundColor: Colors.green.shade700,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        padding: const EdgeInsets.all(8),
      ),
      icon: Icon(icon, size: 18),
    );
  }

  Widget _buildIngredientInput() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Isi Isi Kulkas Anda', style: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 14)),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 10, offset: const Offset(0, 4))],
                ),
                child: TextField(
                  controller: _ingredientController,
                  enabled: !_isLoading,
                  decoration: InputDecoration(
                    hintText: 'Masukkan satu per satu bahan...',
                    hintStyle: GoogleFonts.poppins(fontSize: 13, color: Colors.grey),
                    prefixIcon: const Icon(Icons.search_rounded, color: Colors.green),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  ),
                  onSubmitted: (_) => _addIngredient(),
                ),
              ),
            ),
            const SizedBox(width: 12),
            SizedBox(
              height: 48,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _addIngredient,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green.shade600,
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                child: const Icon(Icons.add, color: Colors.white),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildIngredientsList() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Wrap(
        spacing: 8,
        runSpacing: 8,
        children: _ingredients.asMap().entries.map((entry) {
          int index = entry.key;
          String ingredient = entry.value;
          return InputChip(
            label: Text(ingredient, style: GoogleFonts.poppins(fontSize: 12)),
            onDeleted: _isLoading ? null : () => _removeIngredient(index),
            deleteIcon: const Icon(Icons.cancel, size: 16, color: Colors.grey),
            backgroundColor: Colors.grey.shade100,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            side: BorderSide(color: Colors.grey.shade300), // PERBAIKAN: border -> side
          );
        }).toList(),
      ),
    );
  }

  Widget _buildGenerateButton() {
    return SizedBox(
      width: double.infinity,
      height: 52,
      child: ElevatedButton(
        onPressed: _isLoading ? null : _generateRecipe,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.green.shade700,
          elevation: 2,
          shadowColor: Colors.green.withOpacity(0.3),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
        child: _isLoading
            ? Text('Sedang Meramu Resep Premium...', style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w600, color: Colors.white))
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.auto_awesome, color: Colors.white, size: 18),
                  const SizedBox(width: 10),
                  Text('Mulai Racik Resep AI', style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white)),
                ],
              ),
      ),
    );
  }

  Widget _buildRecipeResultCard() {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 15, offset: const Offset(0, 6))],
        border: Border.all(color: Colors.green.shade100, width: 1.5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.green.shade50,
              borderRadius: const BorderRadius.only(topLeft: Radius.circular(18), topRight: Radius.circular(18)),
            ),
            child: Row(
              children: [
                Icon(Icons.restaurant, color: Colors.green.shade700, size: 22),
                const SizedBox(width: 10),
                Text('Kreasi Masakan $_selectedCuisine', style: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.green.shade900)),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(10)),
                  child: Text('$_currentPortion Porsi', style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.green.shade700)),
                )
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(20),
            child: SelectableText(
              _recipe,
              style: GoogleFonts.poppins(fontSize: 14, height: 1.6, color: Colors.black87),
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _ingredientController.dispose();
    _scrollController.dispose();
    super.dispose();
  }
}