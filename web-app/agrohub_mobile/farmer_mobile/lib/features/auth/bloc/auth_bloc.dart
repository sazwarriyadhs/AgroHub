import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../core/services/api_service.dart';
import '../../../core/services/token_storage.dart';

// Events
abstract class AuthEvent {}
class LoginRequested extends AuthEvent {
  final String email;
  final String password;
  LoginRequested({required this.email, required this.password});
}
class LogoutRequested extends AuthEvent {}
class CheckAuthStatus extends AuthEvent {}

// States
abstract class AuthState {}
class AuthInitial extends AuthState {}
class AuthLoading extends AuthState {}
class Authenticated extends AuthState {
  final String token;
  final Map<String, dynamic>? userData;
  Authenticated({required this.token, this.userData});
}
class Unauthenticated extends AuthState {}
class AuthError extends AuthState {
  final String message;
  AuthError(this.message);
}

// BLoC
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final ApiService _apiService;
  final TokenStorage _tokenStorage;

  AuthBloc({
    required ApiService apiService,
    required TokenStorage tokenStorage,
  })  : _apiService = apiService,
        _tokenStorage = tokenStorage,
        super(AuthInitial()) {
    on<LoginRequested>(_onLoginRequested);
    on<LogoutRequested>(_onLogoutRequested);
    on<CheckAuthStatus>(_onCheckAuthStatus);
    
    add(CheckAuthStatus());
  }

  Future<void> _onCheckAuthStatus(
    CheckAuthStatus event,
    Emitter<AuthState> emit,
  ) async {
    final token = await _tokenStorage.getToken();
    if (token != null && token.isNotEmpty) {
      emit(Authenticated(token: token));
    } else {
      emit(Unauthenticated());
    }
  }

  Future<void> _onLoginRequested(
    LoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    
    try {
      final response = await _apiService.login(event.email, event.password);
      
      print('📱 Login Response: $response');
      
      // ✅ Cek success = true (format backend lo)
      final isSuccess = response['success'] == true || response['code'] == 200;
      
      if (isSuccess) {
        String? token;
        Map<String, dynamic>? userData;
        
        // Ambil dari field 'data'
        final data = response['data'];
        if (data != null && data is Map<String, dynamic>) {
          token = data['token'] ?? data['access_token'];
          userData = data['user'] ?? data['data'];
        }
        
        // Fallback
        if (token == null) {
          token = response['token'] ?? response['access_token'];
        }
        
        if (token != null && token.isNotEmpty) {
          await _tokenStorage.saveToken(token);
          
          if (userData != null) {
            await _tokenStorage.saveUserData(userData);
          }
          
          print('✅ Login berhasil: ${userData?['name'] ?? userData?['email']}');
          emit(Authenticated(token: token, userData: userData));
          return;
        }
      }
      
      // Error handling
      final errorMsg = response['message'] ?? response['error'] ?? 'Login gagal';
      emit(AuthError(errorMsg));
      
    } catch (e) {
      print('❌ Login error: $e');
      emit(AuthError('Terjadi kesalahan: $e'));
    }
  }

  Future<void> _onLogoutRequested(
    LogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    try {
      await _apiService.logout();
      await _tokenStorage.deleteToken();
      emit(Unauthenticated());
    } catch (e) {
      await _tokenStorage.deleteToken();
      emit(Unauthenticated());
    }
  }

  @override
  Future<void> close() {
    _apiService.dispose();
    return super.close();
  }
}