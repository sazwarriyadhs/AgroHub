// lib/features/products/data/repositories/product_repository_impl.dart

import '../../../../core/constants/app_constants.dart';
import '../../../../core/services/api_client.dart';

import '../../data/models/product_model.dart';
import '../../domain/repositories/product_repository.dart';

class ProductRepositoryImpl
    implements ProductRepository {
  final ApiClient _apiClient;

  ProductRepositoryImpl(
    this._apiClient,
  );

  @override
  Future<List<ProductModel>>
      getProducts({
    int page = 1,
    int limit = 10,
    String? category,
    String? status,
    String? search,
  }) async {
    try {
      final queryParams =
          <String, dynamic>{
        'page': page,
        'limit': limit,
      };

      if (category != null) {
        queryParams[
            'category'] = category;
      }

      if (status != null) {
        queryParams[
            'status'] = status;
      }

      if (search != null) {
        queryParams[
            'search'] = search;
      }

      final query = Uri(
        queryParameters:
            queryParams.map(
          (k, v) => MapEntry(
            k,
            v.toString(),
          ),
        ),
      ).query;

      final response =
          await _apiClient.get(
        '${AppConstants.productsEndpoint}?$query',
      );

      final List<dynamic>
          productsJson =
          response['data'] ?? [];

      return productsJson
          .map(
            (json) =>
                ProductModel
                    .fromJson(
              json,
            ),
          )
          .toList();
    } catch (_) {
      rethrow;
    }
  }

  @override
  Future<ProductModel>
      getProductById(
    int id,
  ) async {
    final response =
        await _apiClient.get(
      '${AppConstants.productsEndpoint}/$id',
    );

    return ProductModel.fromJson(
      response['data'] ??
          response,
    );
  }

  @override
  Future<ProductModel>
      createProduct(
    Map<String, dynamic> data,
  ) async {
    final response =
        await _apiClient.post(
      AppConstants
          .productsEndpoint,
      data: data,
    );

    return ProductModel.fromJson(
      response['data'] ??
          response,
    );
  }

  @override
  Future<ProductModel>
      updateProduct(
    int id,
    Map<String, dynamic> data,
  ) async {
    final response =
        await _apiClient.put(
      '${AppConstants.productsEndpoint}/$id',
      data: data,
    );

    return ProductModel.fromJson(
      response['data'] ??
          response,
    );
  }

  @override
  Future<void> deleteProduct(
    int id,
  ) async {
    await _apiClient.delete(
      '${AppConstants.productsEndpoint}/$id',
    );
  }

  @override
  Future<void> updateStock(
    int id,
    int stock,
  ) async {
    await _apiClient.put(
      '${AppConstants.productsEndpoint}/$id/stock',
      data: {
        'stock': stock,
      },
    );
  }
}