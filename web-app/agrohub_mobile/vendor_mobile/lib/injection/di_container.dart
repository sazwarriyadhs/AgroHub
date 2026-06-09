// di_container.dart - Simplified version
import 'package:get_it/get_it.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../core/network/network_info.dart';
import '../core/services/api_client.dart';
import '../core/services/token_storage.dart';
import '../features/auth/data/repositories/auth_repository_impl.dart';
import '../features/auth/domain/repositories/auth_repository.dart';
import '../features/auth/domain/usecases/login_usecase.dart';
import '../features/auth/domain/usecases/register_usecase.dart';
import '../features/auth/presentation/bloc/auth_bloc.dart';
import '../features/products/data/repositories/product_repository_impl.dart';
import '../features/products/domain/repositories/product_repository.dart';
import '../features/products/presentation/bloc/product_bloc.dart';

final sl = GetIt.instance;

Future<void> initDependencies() async {
  // Core - Network Info (simplified)
  sl.registerLazySingleton<NetworkInfo>(() => NetworkInfoImpl());
  
  // HTTP Client
  sl.registerLazySingleton<http.Client>(() => http.Client());
  
  // Shared Preferences
  final sharedPreferences = await SharedPreferences.getInstance();
  sl.registerLazySingleton<SharedPreferences>(() => sharedPreferences);
  
  // Services
  sl.registerLazySingleton<ApiClient>(() => ApiClient());
  sl.registerLazySingleton<TokenStorage>(() => TokenStorage());
  
  // Initialize features
  initAuth();
  initProducts();
}

void initAuth() {
  // Repository
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(sl<ApiClient>(), sl<TokenStorage>()),
  );
  
  // Usecases
  sl.registerLazySingleton(() => LoginUseCase(sl<AuthRepository>()));
  sl.registerLazySingleton(() => RegisterUseCase(sl<AuthRepository>()));
  
  // Bloc
  sl.registerFactory(() => AuthBloc(
    loginUseCase: sl<LoginUseCase>(),
    registerUseCase: sl<RegisterUseCase>(),
  ));
}

void initProducts() {
  // Repository
  sl.registerLazySingleton<ProductRepository>(
    () => ProductRepositoryImpl(sl<ApiClient>()),
  );
  
  // Bloc
  sl.registerFactory(() => ProductBloc(repository: sl<ProductRepository>()));
}
