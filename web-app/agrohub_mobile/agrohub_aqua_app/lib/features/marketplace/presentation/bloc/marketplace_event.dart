// lib/features/marketplace/presentation/bloc/marketplace_event.dart
part of 'marketplace_bloc.dart';

abstract class MarketplaceEvent extends Equatable {
  const MarketplaceEvent();
  @override
  List<Object?> get props => [];
}

class LoadMyProducts extends MarketplaceEvent {}
class LoadAllProducts extends MarketplaceEvent {}

class CreateProduct extends MarketplaceEvent {
  final Map<String, dynamic> productData;
  final List<File>? images;
  
  const CreateProduct({required this.productData, this.images});
  
  @override
  List<Object?> get props => [productData, images];
}

class UpdateProduct extends MarketplaceEvent {
  final String productId;
  final Map<String, dynamic> productData;
  
  const UpdateProduct({required this.productId, required this.productData});
  
  @override
  List<Object?> get props => [productId, productData];
}

class DeleteProduct extends MarketplaceEvent {
  final String productId;
  const DeleteProduct(this.productId);
  @override
  List<Object?> get props => [productId];
}
