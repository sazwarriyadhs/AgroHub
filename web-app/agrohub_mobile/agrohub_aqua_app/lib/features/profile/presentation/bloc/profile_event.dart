// lib/features/profile/presentation/bloc/profile_event.dart
part of 'profile_bloc.dart';

abstract class ProfileEvent extends Equatable {
  const ProfileEvent();
  @override
  List<Object?> get props => [];
}

class LoadUserProfile extends ProfileEvent {}

class LoadAquacultureAssets extends ProfileEvent {}

class LoadAllProfileData extends ProfileEvent {}

class UpdateUserProfile extends ProfileEvent {
  final Map<String, dynamic> data;
  const UpdateUserProfile(this.data);
  @override
  List<Object?> get props => [data];
}

class UpdateAvatar extends ProfileEvent {
  final String imagePath;
  const UpdateAvatar(this.imagePath);
  @override
  List<Object?> get props => [imagePath];
}

class UpdateMembership extends ProfileEvent {
  final String membershipCode;
  const UpdateMembership(this.membershipCode);
  @override
  List<Object?> get props => [membershipCode];
}

class ClearProfileError extends ProfileEvent {}
