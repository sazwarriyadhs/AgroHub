// lib/features/profile/domain/entities/user_entity.dart
part of 'package:agrohub_aqua_app/features/profile/presentation/bloc/profile_bloc.dart';

class UserEntity extends Equatable {
  final String id;
  final String fullName;
  final String email;
  final String? username;
  final String? phone;
  final String? role;
  final String? avatar;
  final String? farmName;
  final double? farmSize;
  final String? farmAddress;
  final String? farmType;
  final int? farmingExperienceYears;
  final String? membershipType;
  final String? membershipCode;
  final int? loyaltyPoints;
  final String? address;
  final String? city;
  final String? province;
  final bool? isVerified;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  const UserEntity({
    required this.id,
    required this.fullName,
    required this.email,
    this.username,
    this.phone,
    this.role,
    this.avatar,
    this.farmName,
    this.farmSize,
    this.farmAddress,
    this.farmType,
    this.farmingExperienceYears,
    this.membershipType,
    this.membershipCode,
    this.loyaltyPoints,
    this.address,
    this.city,
    this.province,
    this.isVerified,
    this.createdAt,
    this.updatedAt,
  });

  @override
  List<Object?> get props => [
    id, fullName, email, username, phone, role, avatar, farmName, farmSize,
    farmAddress, farmType, farmingExperienceYears, membershipType, membershipCode,
    loyaltyPoints, address, city, province, isVerified, createdAt, updatedAt
  ];
  
  bool get isFarmer => role == 'farmer';
  bool get isPremium => membershipType != null && membershipType!.toLowerCase() != 'basic';
}
