import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:provider/provider.dart';

import 'core/routes/app_routes.dart';
import 'core/services/api_client.dart';
import 'core/services/token_storage.dart';
import 'core/theme/app_theme.dart';

import 'features/auth/presentation/bloc/auth_bloc.dart';

import 'injection/di_container.dart' as di;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await di.initDependencies();

  final apiClient =
      ApiClient.instance;

  final tokenStorage =
      TokenStorage();

  final token =
      await tokenStorage.getToken();

  if (token != null) {
    apiClient.setAuthToken(
      token,
    );
  }

  runApp(
    MyApp(
      apiClient: apiClient,
      tokenStorage:
          tokenStorage,
    ),
  );
}

class MyApp extends StatelessWidget {
  final ApiClient apiClient;

  final TokenStorage
      tokenStorage;

  const MyApp({
    super.key,
    required this.apiClient,
    required this.tokenStorage,
  });

  @override
  Widget build(
    BuildContext context,
  ) {
    return MultiProvider(
      providers: [
        Provider<ApiClient>.value(
          value: apiClient,
        ),

        Provider<TokenStorage>.value(
          value: tokenStorage,
        ),
      ],

      child: MultiBlocProvider(
        providers: [
          BlocProvider<AuthBloc>(
            create: (_) =>
                di.sl<AuthBloc>(),
          ),
        ],

        child: MaterialApp(
          title:
              'Vendor Mobile',

          theme:
              AppTheme.lightTheme,

          darkTheme:
              AppTheme.darkTheme,

          themeMode:
              ThemeMode.system,

          initialRoute:
              AppRoutes.splash,

          onGenerateRoute:
              AppRoutes
                  .onGenerateRoute,

          debugShowCheckedModeBanner:
              false,
        ),
      ),
    );
  }
}