// lib/features/profile/models/membership_model.dart

class MembershipModel {
  final String? membershipType;
  final String? planName;
  final int? points;
  final String? membershipCode;
  final String? status;

  MembershipModel({
    this.membershipType,
    this.planName,
    this.points,
    this.membershipCode,
    this.status,
  });

  factory MembershipModel.fromJson(Map<String, dynamic> json) {
    return MembershipModel(
      membershipType: json['membership_type']?.toString(),
      planName: json['plan_name']?.toString(),
      points: json['points'] != null ? int.tryParse(json['points'].toString()) : null,
      membershipCode: json['membership_code']?.toString(),
      status: json['status']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'membership_type': membershipType,
      'plan_name': planName,
      'points': points,
      'membership_code': membershipCode,
      'status': status,
    };
  }
}