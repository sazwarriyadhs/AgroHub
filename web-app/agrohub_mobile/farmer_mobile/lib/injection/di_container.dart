// lib/injection/di_container.dart

import 'package:get_it/get_it.dart';
import '../core/services/api_service.dart';
import '../core/services/token_storage.dart';
import '../features/dashboard/blocs/dashboard_bloc.dart';
import '../features/auth/bloc/auth_bloc.dart';

final GetIt sl = GetIt.instance;

Future<void> init() async {
  // Services
  sl.registerLazySingleton<TokenStorage>(() => TokenStorage());
  sl.registerLazySingleton<ApiService>(() => ApiService());
  
  // BLoCs
  sl.registerFactory<AuthBloc>(
    () => AuthBloc(
      apiService: sl<ApiService>(),
      tokenStorage: sl<TokenStorage>(),
    ),
  );
  sl.registerFactory<DashboardBloc>(
    () => DashboardBloc(
      apiService: sl<ApiService>(),
    ),
  );
}