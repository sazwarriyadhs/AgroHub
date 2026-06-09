// lib/services/product_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class ProductService {
  static Future<List<Map<String, dynamic>>> searchProducts(String query) async {
    try {
      // Data dummy untuk testing
      await Future.delayed(const Duration(milliseconds: 300));
      
      List<Map<String, dynamic>> dummyProducts = [
        {
          'id': '1',
          'name': 'Beras Premium 5kg',
          'price': 75000,
          'image_url': 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=150',
          'sold': 120,
          'rating': 4.8,
          'description': 'Beras premium kualitas terbaik'
        },
        {
          'id': '2',
          'name': 'Cabai Merah Keriting',
          'price': 25000,
          'image_url': 'https://images.unsplash.com/photo-1589979486554-7b92f2a4f6b5?w=150',
          'sold': 85,
          'rating': 4.5,
          'description': 'Cabai segar langsung dari petani'
        },
        {
          'id': '3',
          'name': 'Bawang Merah',
          'price': 30000,
          'image_url': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=150',
          'sold': 200,
          'rating': 4.9,
          'description': 'Bawang merah berkualitas'
        },
        {
          'id': '4',
          'name': 'Tomat Segar',
          'price': 15000,
          'image_url': 'https://images.unsplash.com/photo-1592924357228-91b4daadcfea?w=150',
          'sold': 150,
          'rating': 4.7,
          'description': 'Tomat segar organik'
        },
        {
          'id': '5',
          'name': 'Kentang',
          'price': 18000,
          'image_url': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=150',
          'sold': 95,
          'rating': 4.6,
          'description': 'Kentang impor'
        }
      ];
      
      if (query.isEmpty) {
        return dummyProducts;
      }
      
      // Filter berdasarkan query
      return dummyProducts.where((product) {
        final name = product['name'] as String? ?? '';
        return name.toLowerCase().contains(query.toLowerCase());
      }).toList();
      
    } catch (e) {
      print('Error searching products: $e');
      return [];
    }
  }
  
  static Future<List<Map<String, dynamic>>> getProducts() async {
    try {
      await Future.delayed(const Duration(milliseconds: 300));
      return [
        {
          'id': '1',
          'name': 'Beras Premium 5kg',
          'price': 75000,
          'image_url': 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=150',
          'sold': 120,
          'rating': 4.8,
        },
        {
          'id': '2',
          'name': 'Cabai Merah Keriting',
          'price': 25000,
          'image_url': 'https://images.unsplash.com/photo-1589979486554-7b92f2a4f6b5?w=150',
          'sold': 85,
          'rating': 4.5,
        },
      ];
    } catch (e) {
      print('Error getting products: $e');
      return [];
    }
  }
  
  static Future<Map<String, dynamic>> getProductDetail(String id) async {
    try {
      await Future.delayed(const Duration(milliseconds: 300));
      return {
        'id': id,
        'name': 'Product Name',
        'price': 50000,
        'description': 'Product description here',
        'image_url': 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=300',
        'sold': 100,
        'rating': 4.7
      };
    } catch (e) {
      print('Error getting product detail: $e');
      return {};
    }
  }
}
