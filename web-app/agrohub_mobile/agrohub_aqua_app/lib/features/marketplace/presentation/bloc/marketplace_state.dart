// lib/features/marketplace/presentation/bloc/marketplace_state.dart
part of 'marketplace_bloc.dart';

class MarketplaceState extends Equatable {
  final bool isLoading;
  final bool isSubmitting;
  final String? error;
  final List<ProductEntity> products;
  final List<ProductEntity> myProducts;
  
  const MarketplaceState({
    this.isLoading = false,
    this.isSubmitting = false,
    this.error,
    this.products = const [],
    this.myProducts = const [],
  });
  
  factory MarketplaceState.initial() => const MarketplaceState();
  
  MarketplaceState copyWith({
    bool? isLoading,
    bool? isSubmitting,
    String? error,
    List<ProductEntity>? products,
    List<ProductEntity>? myProducts,
    bool clearError = false,
  }) {
    return MarketplaceState(
      isLoading: isLoading ?? this.isLoading,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      error: clearError ? null : error ?? this.error,
      products: products ?? this.products,
      myProducts: myProducts ?? this.myProducts,
    );
  }
  
  @override
  List<Object?> get props => [isLoading, isSubmitting, error, products, myProducts];
}
