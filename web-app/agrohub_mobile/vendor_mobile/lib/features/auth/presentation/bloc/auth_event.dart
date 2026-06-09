part of 'auth_bloc.dart';

abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

class LoginRequested extends AuthEvent {
  final String email;
  final String password;

  const LoginRequested(
    this.email,
    this.password,
  );

  @override
  List<Object?> get props => [
        email,
        password,
      ];
}

class RegisterRequested extends AuthEvent {
  final String name;
  final String email;
  final String password;
  final String storeName;
  final String? phone;
  final String businessType;
  final String? nik;
  final String? npwp;
  final String address;

  const RegisterRequested({
    required this.name,
    required this.email,
    required this.password,
    required this.storeName,
    this.phone,
    required this.businessType,
    this.nik,
    this.npwp,
    required this.address,
  });

  @override
  List<Object?> get props => [
        name,
        email,
        password,
        storeName,
        phone,
        businessType,
        nik,
        npwp,
        address,
      ];
}

class LogoutRequested extends AuthEvent {
  const LogoutRequested();

  @override
  List<Object?> get props => [];
}

class CheckAuthStatus extends AuthEvent {
  const CheckAuthStatus();

  @override
  List<Object?> get props => [];
}