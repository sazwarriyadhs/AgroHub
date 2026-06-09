// features/products/domain/repositories/product_repository.dart

import '../../data/models/product_model.dart';

abstract class ProductRepository {
  Future<List<ProductModel>> getProducts({
    int page = 1,
    int limit = 10,
    String? category,
    String? status,
    String? search,
  });
  
  Future<ProductModel> getProductById(int id);
  
  Future<ProductModel> createProduct(Map<String, dynamic> data);
  
  Future<ProductModel> updateProduct(int id, Map<String, dynamic> data);
  
  Future<void> deleteProduct(int id);
  
  Future<void> updateStock(int id, int stock);
}
