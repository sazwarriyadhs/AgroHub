import 'package:equatable/equatable.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/services/token_storage.dart';
import '../../domain/entities/user.dart';
import '../../domain/usecases/login_usecase.dart';
import '../../domain/usecases/register_usecase.dart';
import '../../data/models/user_model.dart';

part 'auth_event.dart';
part 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final LoginUseCase loginUseCase;
  final RegisterUseCase registerUseCase;

  final TokenStorage _storage = TokenStorage();

  AuthBloc({
    required this.loginUseCase,
    required this.registerUseCase,
  }) : super(AuthInitial()) {
    on<LoginRequested>(_onLoginRequested);
    on<RegisterRequested>(_onRegisterRequested);
    on<LogoutRequested>(_onLogoutRequested);
    on<CheckAuthStatus>(_onCheckAuthStatus);
  }

  Future<void> _onLoginRequested(
    LoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());

    try {
      final user = await loginUseCase.execute(
        event.email,
        event.password,
      );

      if (user != null && user.token.isNotEmpty) {
        // Perbaikan: TokenStorage.saveUser menerima UserModel, bukan Map
        await _storage.saveUser(user as UserModel?);
        await _storage.saveToken(user.token);

        emit(AuthAuthenticated(user));
      } else {
        emit(const AuthError('Email atau password salah'));
      }
    } catch (e) {
      debugPrint('Login Error: $e');
      emit(AuthError(e.toString()));
    }
  }

  Future<void> _onRegisterRequested(
    RegisterRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());

    try {
      final user = await registerUseCase.execute(
        name: event.name,
        email: event.email,
        password: event.password,
        storeName: event.storeName,
        phone: event.phone ?? '',
        businessType: event.businessType,
        nik: event.nik ?? '',
        npwp: event.npwp ?? '',
        address: event.address,
      );

      if (user != null && user.token.isNotEmpty) {
        // Perbaikan: TokenStorage.saveUser menerima UserModel, bukan Map
        await _storage.saveUser(user as UserModel?);
        await _storage.saveToken(user.token);

        emit(AuthAuthenticated(user));
      } else {
        emit(const AuthError('Registrasi gagal'));
      }
    } catch (e) {
      emit(AuthError(e.toString()));
    }
  }

  Future<void> _onLogoutRequested(
    LogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    await _storage.clearAll();
    emit(AuthInitial());
  }

  Future<void> _onCheckAuthStatus(
    CheckAuthStatus event,
    Emitter<AuthState> emit,
  ) async {
    try {
      final user = await _storage.getUser();

      if (user != null && user.token.isNotEmpty) {
        emit(AuthAuthenticated(user));
        return;
      }

      emit(AuthInitial());
    } catch (_) {
      emit(AuthInitial());
    }
  }
}