// features/products/presentation/bloc/product_bloc.dart

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../../products/data/models/product_model.dart';
import '../../../products/domain/repositories/product_repository.dart';

part 'product_event.dart';
part 'product_state.dart';

class ProductBloc extends Bloc<ProductEvent, ProductState> {
  final ProductRepository repository;

  ProductBloc({required this.repository}) : super(ProductInitial()) {
    on<LoadProducts>(_onLoadProducts);
    on<LoadMoreProducts>(_onLoadMoreProducts);
    on<LoadProductById>(_onLoadProductById);
    on<CreateProduct>(_onCreateProduct);
    on<UpdateProduct>(_onUpdateProduct);
    on<DeleteProduct>(_onDeleteProduct);
    on<SearchProducts>(_onSearchProducts);
    on<FilterProductsByCategory>(_onFilterProductsByCategory);
  }

  int _currentPage = 1;
  bool _hasMore = true;
  List<ProductModel> _allProducts = [];

  Future<void> _onLoadProducts(
    LoadProducts event,
    Emitter<ProductState> emit,
  ) async {
    emit(ProductLoading());
    _currentPage = 1;
    _hasMore = true;
    
    try {
      final products = await repository.getProducts(
        page: _currentPage,
        limit: event.limit,
      );
      _allProducts = products;
      _hasMore = products.length >= event.limit;
      
      emit(ProductLoaded(
        products: products,
        hasMore: _hasMore,
        currentPage: _currentPage,
      ));
    } catch (e) {
      emit(ProductError(message: e.toString()));
    }
  }

  Future<void> _onLoadMoreProducts(
    LoadMoreProducts event,
    Emitter<ProductState> emit,
  ) async {
    if (!_hasMore) return;
    
    _currentPage++;
    
    try {
      final products = await repository.getProducts(
        page: _currentPage,
        limit: event.limit,
      );
      _allProducts.addAll(products);
      _hasMore = products.length >= event.limit;
      
      emit(ProductLoaded(
        products: _allProducts,
        hasMore: _hasMore,
        currentPage: _currentPage,
      ));
    } catch (e) {
      emit(ProductError(message: e.toString()));
    }
  }

  Future<void> _onSearchProducts(
    SearchProducts event,
    Emitter<ProductState> emit,
  ) async {
    emit(ProductLoading());
    try {
      final products = await repository.getProducts(
        search: event.query,
        limit: 20,
      );
      emit(ProductLoaded(
        products: products,
        hasMore: false,
        currentPage: 1,
      ));
    } catch (e) {
      emit(ProductError(message: e.toString()));
    }
  }

  Future<void> _onFilterProductsByCategory(
    FilterProductsByCategory event,
    Emitter<ProductState> emit,
  ) async {
    emit(ProductLoading());
    try {
      final products = await repository.getProducts(
        category: event.category,
        limit: 20,
      );
      emit(ProductLoaded(
        products: products,
        hasMore: false,
        currentPage: 1,
      ));
    } catch (e) {
      emit(ProductError(message: e.toString()));
    }
  }

  Future<void> _onLoadProductById(
    LoadProductById event,
    Emitter<ProductState> emit,
  ) async {
    emit(ProductLoading());
    try {
      final product = await repository.getProductById(event.id);
      emit(ProductDetailLoaded(product: product));
    } catch (e) {
      emit(ProductError(message: e.toString()));
    }
  }

  Future<void> _onCreateProduct(
    CreateProduct event,
    Emitter<ProductState> emit,
  ) async {
    emit(ProductLoading());
    try {
      final product = await repository.createProduct(event.data);
      add(LoadProducts(limit: 10));
      emit(ProductCreated(product: product));
    } catch (e) {
      emit(ProductError(message: e.toString()));
    }
  }

  Future<void> _onUpdateProduct(
    UpdateProduct event,
    Emitter<ProductState> emit,
  ) async {
    emit(ProductLoading());
    try {
      final product = await repository.updateProduct(event.id, event.data);
      add(LoadProducts(limit: 10));
      emit(ProductUpdated(product: product));
    } catch (e) {
      emit(ProductError(message: e.toString()));
    }
  }

  Future<void> _onDeleteProduct(
    DeleteProduct event,
    Emitter<ProductState> emit,
  ) async {
    emit(ProductLoading());
    try {
      await repository.deleteProduct(event.id);
      add(LoadProducts(limit: 10));
      emit(ProductDeleted());
    } catch (e) {
      emit(ProductError(message: e.toString()));
    }
  }
}
