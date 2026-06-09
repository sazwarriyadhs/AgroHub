// lib/features/cart/cart.dart

import 'package:flutter/material.dart';
import '../../core/services/api_service.dart';
import '../dashboard/presentation/farmer_bottom_navigation.dart';
import 'models/cart_model.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  final ApiService _apiService = ApiService();
  
  CartModel? _cart;
  bool _isLoading = true;
  bool _isCheckingOut = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadCart();
  }

  @override
  void dispose() {
    _apiService.dispose();
    super.dispose();
  }

  Future<void> _loadCart() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final response = await _apiService.getCart();
      
      // ✅ FIX: Safe extraction with null check
      final cartData = response['data'] ?? response;
      
      // Jika cart kosong atau tidak ada, buat cart kosong
      if (cartData == null) {
        setState(() {
          _cart = CartModel(
            id: 0,
            userId: 0,
            items: [],
            createdAt: DateTime.now(),
            updatedAt: DateTime.now(),
          );
          _isLoading = false;
        });
        return;
      }
      
      // ✅ FIX: Check if items is null or empty
      final itemsList = cartData['items'] as List?;
      if (itemsList == null || itemsList.isEmpty) {
        setState(() {
          _cart = CartModel(
            id: cartData['id'] ?? 0,
            userId: cartData['user_id'] ?? 0,
            items: [],
            createdAt: DateTime.now(),
            updatedAt: DateTime.now(),
          );
          _isLoading = false;
        });
        return;
      }
      
      final cart = CartModel.fromJson(cartData);
      
      setState(() {
        _cart = cart;
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading cart: $e');
      // Buat cart kosong sebagai fallback
      setState(() {
        _cart = CartModel(
          id: 0,
          userId: 0,
          items: [],
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        );
        _error = null;
        _isLoading = false;
      });
    }
  }

  Future<void> _updateQuantity(int itemId, int newQuantity) async {
    if (newQuantity <= 0) {
      await _removeItem(itemId);
      return;
    }

    try {
      // Update local state first for better UX
      setState(() {
        if (_cart != null) {
          final index = _cart!.items.indexWhere((item) => item.id == itemId);
          if (index != -1) {
            final updatedItem = CartItemModel(
              id: _cart!.items[index].id,
              cartId: _cart!.items[index].cartId,
              productId: _cart!.items[index].productId,
              quantity: newQuantity,
              product: _cart!.items[index].product,
              createdAt: _cart!.items[index].createdAt,
            );
            _cart!.items[index] = updatedItem;
          }
        }
      });
      
      // TODO: Implement API call when backend ready
      // await _apiService.updateCartItem(itemId, newQuantity);
      
    } catch (e) {
      _showSnackbar('Gagal mengupdate quantity: $e');
      await _loadCart();
    }
  }

  Future<void> _removeItem(int itemId) async {
    try {
      await _apiService.removeFromCart(itemId);
      
      setState(() {
        if (_cart != null) {
          _cart!.items.removeWhere((item) => item.id == itemId);
        }
      });
      
      _showSnackbar('Item dihapus dari keranjang', isError: false);
    } catch (e) {
      _showSnackbar('Gagal menghapus item: $e');
    }
  }

  Future<void> _clearCart() async {
    if (_cart == null || _cart!.items.isEmpty) return;
    
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Kosongkan Keranjang'),
        content: const Text('Apakah Anda yakin ingin menghapus semua item?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Batal'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Hapus Semua'),
          ),
        ],
      ),
    );
    
    if (confirmed != true) return;
    
    for (var item in _cart!.items) {
      try {
        await _apiService.removeFromCart(item.id);
      } catch (_) {}
    }
    
    setState(() {
      _cart!.items.clear();
    });
    
    _showSnackbar('Keranjang dikosongkan', isError: false);
  }

  Future<void> _checkout() async {
    if (_cart == null || _cart!.items.isEmpty) {
      _showSnackbar('Keranjang kosong');
      return;
    }

    setState(() {
      _isCheckingOut = true;
    });

    try {
      final orderData = {
        'cart_id': _cart!.id,
        'items': _cart!.items.map((item) {
          return {
            'product_id': item.productId,
            'quantity': item.quantity,
            'price': item.productPrice,
          };
        }).toList(),
        'total_amount': _cart!.totalPrice,
      };

      final response = await _apiService.createOrder(orderData);
      
      if (response['status'] == 'success' || response['success'] == true) {
        _showSnackbar('Checkout berhasil!', isError: false);
        
        // ✅ FIX: Clear cart after successful checkout
        setState(() {
          _cart!.items.clear();
        });
        
        // Navigate to orders screen
        if (mounted) {
          Navigator.pushNamed(context, '/orders');
        }
      } else {
        _showSnackbar('Checkout gagal: ${response['message'] ?? 'Unknown error'}');
      }
    } catch (e) {
      _showSnackbar('Error: $e');
    } finally {
      if (mounted) {
        setState(() {
          _isCheckingOut = false;
        });
      }
    }
  }

  void _showSnackbar(String message, {bool isError = true}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? Colors.red : Colors.green,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  String format(num value) {
    if (value == null) return '0';
    return value.toStringAsFixed(0).replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
      (m) => "${m[1]}.",
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xffF5F7F2),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
        title: const Text(
          "Keranjang Saya",
          style: TextStyle(color: Colors.black),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        actions: [
          if (_cart != null && _cart!.items.isNotEmpty)
            TextButton(
              onPressed: _clearCart,
              child: const Text(
                'Hapus Semua',
                style: TextStyle(color: Colors.red),
              ),
            ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? _buildErrorWidget()
              : _cart == null || _cart!.items.isEmpty
                  ? _empty()
                  : _buildCartContent(),
      bottomNavigationBar: const FarmerBottomNavigation(
        currentIndex: 1,
      ),
    );
  }

  Widget _buildErrorWidget() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error_outline, size: 64, color: Colors.red),
          const SizedBox(height: 16),
          Text(_error!, textAlign: TextAlign.center),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: _loadCart,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF1B8F3E),
            ),
            child: const Text('Coba Lagi'),
          ),
        ],
      ),
    );
  }

  Widget _buildCartContent() {
    return Column(
      children: [
        Expanded(
          child: RefreshIndicator(
            onRefresh: _loadCart,
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _cart!.items.length,
              itemBuilder: (_, index) {
                final item = _cart!.items[index];
                return _buildCartItem(item, index);
              },
            ),
          ),
        ),
        _checkoutBar(),
      ],
    );
  }

  Widget _buildCartItem(CartItemModel item, int index) {
    return Dismissible(
      key: Key('cart_item_${item.id}_${index}'), // ✅ FIX: Use unique key
      direction: DismissDirection.endToStart,
      background: Container(
        margin: const EdgeInsets.only(bottom: 14),
        decoration: BoxDecoration(
          color: Colors.red,
          borderRadius: BorderRadius.circular(20),
        ),
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        child: const Icon(Icons.delete, color: Colors.white),
      ),
      onDismissed: (_) => _removeItem(item.id),
      child: Container(
        margin: const EdgeInsets.only(bottom: 14),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              blurRadius: 12,
              color: Colors.black.withOpacity(.04),
            ),
          ],
        ),
        child: Row(
          children: [
            Text(
              item.productIcon,
              style: const TextStyle(fontSize: 40),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.productName,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    "Rp ${format(item.productPrice)} / ${item.productUnit}",
                    style: const TextStyle(
                      color: Colors.green,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ),
            Column(
              children: [
                Row(
                  children: [
                    _qtyButton(
                      Icons.remove,
                      () => _updateQuantity(item.id, item.quantity - 1),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      child: Text(
                        "${item.quantity}",
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                    ),
                    _qtyButton(
                      Icons.add,
                      () => _updateQuantity(item.id, item.quantity + 1),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  "Rp ${format(item.subtotal)}",
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    color: Color(0xFF1B8F3E),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _checkoutBar() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(25),
        ),
      ),
      child: SafeArea(
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Subtotal",
                    style: TextStyle(fontSize: 14, color: Colors.grey),
                  ),
                  Text(
                    "Rp ${format(_cart?.totalPrice ?? 0)}",
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1B8F3E),
                    ),
                  ),
                  Text(
                    "Total ${_cart?.itemCount ?? 0} item",
                    style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  ),
                ],
              ),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1B8F3E),
                padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onPressed: _isCheckingOut ? null : _checkout,
              child: _isCheckingOut
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.white,
                      ),
                    )
                  : const Text(
                      "Checkout",
                      style: TextStyle(fontSize: 16),
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _qtyButton(IconData icon, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        width: 32,
        height: 32,
        decoration: BoxDecoration(
          color: Colors.green.shade50,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, size: 18, color: Colors.green),
      ),
    );
  }

  Widget _empty() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text(
            "🛒",
            style: TextStyle(fontSize: 90),
          ),
          const SizedBox(height: 16),
          Text(
            "Keranjang kosong",
            style: TextStyle(color: Colors.grey.shade600, fontSize: 18),
          ),
          const SizedBox(height: 8),
          Text(
            "Yuk, belanja hasil panen sekarang!",
            style: TextStyle(color: Colors.grey.shade500, fontSize: 14),
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () {
              Navigator.pushReplacementNamed(context, "/buy");
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF1B8F3E),
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: const Text(
              "Belanja Sekarang",
              style: TextStyle(fontSize: 16),
            ),
          ),
        ],
      ),
    );
  }
}