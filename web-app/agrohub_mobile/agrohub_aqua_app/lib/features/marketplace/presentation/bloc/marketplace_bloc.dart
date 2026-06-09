// lib/features/marketplace/presentation/bloc/marketplace_bloc.dart
import 'dart:io';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:agrohub_aqua_app/core/services/api_service.dart';
import '../../../data/models/product_model.dart';

part 'marketplace_event.dart';
part 'marketplace_state.dart';

class MarketplaceBloc extends Bloc<MarketplaceEvent, MarketplaceState> {
  final ApiService _apiService;
  
  MarketplaceBloc({required ApiService apiService})
    : _apiService = apiService,
      super(MarketplaceState.initial()) {
    on<LoadMyProducts>(_onLoadMyProducts);
    on<LoadAllProducts>(_onLoadAllProducts);
    on<CreateProduct>(_onCreateProduct);
    on<UpdateProduct>(_onUpdateProduct);
    on<DeleteProduct>(_onDeleteProduct);
  }
  
  Future<void> _onLoadMyProducts(
    LoadMyProducts event,
    Emitter<MarketplaceState> emit,
  ) async {
    emit(state.copyWith(isLoading: true, clearError: true));
    
    try {
      final response = await _apiService.getMyProducts();
      final List<ProductEntity> products = [];
      // TODO: Parse response ke ProductModel
      
      emit(state.copyWith(
        isLoading: false,
        myProducts: products,
      ));
    } catch (e) {
      emit(state.copyWith(
        isLoading: false,
        error: e.toString(),
      ));
    }
  }
  
  Future<void> _onLoadAllProducts(
    LoadAllProducts event,
    Emitter<MarketplaceState> emit,
  ) async {
    emit(state.copyWith(isLoading: true));
    
    try {
      final response = await _apiService.getAllProducts();
      final List<ProductEntity> products = [];
      // TODO: Parse response
      
      emit(state.copyWith(
        isLoading: false,
        products: products,
      ));
    } catch (e) {
      emit(state.copyWith(
        isLoading: false,
        error: e.toString(),
      ));
    }
  }
  
  Future<void> _onCreateProduct(
    CreateProduct event,
    Emitter<MarketplaceState> emit,
  ) async {
    emit(state.copyWith(isSubmitting: true, clearError: true));
    
    try {
      // TODO: Implement API call with images
      // final response = await _apiService.createProduct(
      //   event.productData,
      //   images: event.images,
      // );
      
      // Simulate API call
      await Future.delayed(const Duration(seconds: 1));
      
      final newProduct = ProductModel(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        name: event.productData['name'],
        price: event.productData['price'],
        stock: event.productData['stock'],
        category: event.productData['category'],
        location: event.productData['location'],
        description: event.productData['description'],
        createdAt: DateTime.now(),
      );
      
      emit(state.copyWith(
        isSubmitting: false,
        myProducts: [newProduct, ...state.myProducts],
      ));
    } catch (e) {
      emit(state.copyWith(
        isSubmitting: false,
        error: e.toString(),
      ));
      rethrow;
    }
  }
  
  Future<void> _onUpdateProduct(
    UpdateProduct event,
    Emitter<MarketplaceState> emit,
  ) async {
    emit(state.copyWith(isSubmitting: true));
    
    try {
      // TODO: Implement API call
      await Future.delayed(const Duration(seconds: 1));
      
      final updatedProducts = state.myProducts.map((product) {
        if (product.id == event.productId) {
          return ProductModel(
            id: product.id,
            name: event.productData['name'] ?? product.name,
            price: event.productData['price'] ?? product.price,
            stock: event.productData['stock'] ?? product.stock,
            category: event.productData['category'] ?? product.category,
            location: event.productData['location'] ?? product.location,
            description: event.productData['description'] ?? product.description,
            createdAt: product.createdAt,
          );
        }
        return product;
      }).toList();
      
      emit(state.copyWith(
        isSubmitting: false,
        myProducts: updatedProducts,
      ));
    } catch (e) {
      emit(state.copyWith(
        isSubmitting: false,
        error: e.toString(),
      ));
      rethrow;
    }
  }
  
  Future<void> _onDeleteProduct(
    DeleteProduct event,
    Emitter<MarketplaceState> emit,
  ) async {
    emit(state.copyWith(isSubmitting: true));
    
    try {
      // TODO: Implement API call
      await Future.delayed(const Duration(seconds: 1));
      
      emit(state.copyWith(
        isSubmitting: false,
        myProducts: state.myProducts.where((p) => p.id != event.productId).toList(),
      ));
    } catch (e) {
      emit(state.copyWith(
        isSubmitting: false,
        error: e.toString(),
      ));
      rethrow;
    }
  }
}
