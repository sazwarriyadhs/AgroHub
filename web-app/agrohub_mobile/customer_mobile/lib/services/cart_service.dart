import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class CartService {
  static Future<Map<String, dynamic>> addToCart(
    String token,
    int productId,
    int quantity,
  ) async {
    final response = await http.post(
      Uri.parse(ApiConfig.getFullUrl(ApiConfig.cartAdd)),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: json.encode({
        'product_id': productId,
        'quantity': quantity,
      }),
    );
    
    final data = json.decode(response.body);
    
    if (response.statusCode == 200) {
      return {
        'success': true,
        'cart': data['cart'],
        'total_items': data['total_items'],
      };
    } else {
      return {
        'success': false,
        'message': data['message'] ?? 'Failed to add to cart',
      };
    }
  }
}