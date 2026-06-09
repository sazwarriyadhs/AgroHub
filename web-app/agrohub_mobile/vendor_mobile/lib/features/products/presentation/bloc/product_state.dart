// features/products/presentation/bloc/product_state.dart

part of 'product_bloc.dart';

abstract class ProductState extends Equatable {
  const ProductState();
  @override
  List<Object?> get props => [];
}

class ProductInitial extends ProductState {}

class ProductLoading extends ProductState {}

class ProductLoaded extends ProductState {
  final List<ProductModel> products;
  final bool hasMore;
  final int currentPage;
  
  const ProductLoaded({
    required this.products,
    required this.hasMore,
    required this.currentPage,
  });
  
  @override
  List<Object?> get props => [products, hasMore, currentPage];
}

class ProductDetailLoaded extends ProductState {
  final ProductModel product;
  const ProductDetailLoaded({required this.product});
  @override
  List<Object?> get props => [product];
}

class ProductCreated extends ProductState {
  final ProductModel product;
  const ProductCreated({required this.product});
  @override
  List<Object?> get props => [product];
}

class ProductUpdated extends ProductState {
  final ProductModel product;
  const ProductUpdated({required this.product});
  @override
  List<Object?> get props => [product];
}

class ProductDeleted extends ProductState {}

class ProductError extends ProductState {
  final String message;
  const ProductError({required this.message});
  @override
  List<Object?> get props => [message];
}
