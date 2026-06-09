// features/products/presentation/bloc/product_event.dart

part of 'product_bloc.dart';

abstract class ProductEvent extends Equatable {
  const ProductEvent();
  @override
  List<Object?> get props => [];
}

class LoadProducts extends ProductEvent {
  final int limit;
  const LoadProducts({this.limit = 10});
  @override
  List<Object?> get props => [limit];
}

class LoadMoreProducts extends ProductEvent {
  final int limit;
  const LoadMoreProducts({this.limit = 10});
  @override
  List<Object?> get props => [limit];
}

class SearchProducts extends ProductEvent {
  final String query;
  const SearchProducts(this.query);
  @override
  List<Object?> get props => [query];
}

class FilterProductsByCategory extends ProductEvent {
  final String category;
  const FilterProductsByCategory(this.category);
  @override
  List<Object?> get props => [category];
}

class LoadProductById extends ProductEvent {
  final int id;
  const LoadProductById(this.id);
  @override
  List<Object?> get props => [id];
}

class CreateProduct extends ProductEvent {
  final Map<String, dynamic> data;
  const CreateProduct(this.data);
  @override
  List<Object?> get props => [data];
}

class UpdateProduct extends ProductEvent {
  final int id;
  final Map<String, dynamic> data;
  const UpdateProduct(this.id, this.data);
  @override
  List<Object?> get props => [id, data];
}

class DeleteProduct extends ProductEvent {
  final int id;
  const DeleteProduct(this.id);
  @override
  List<Object?> get props => [id];
}
