import 'package:flutter/material.dart';

class ProfileModel {
  final int id;
  final String name;
  final String email;
  final String? phone;
  final String? avatarUrl;
  final DateTime createdAt;

  // Farm
  final String? farmName;
  final String? farmType;
  final String? province;
  final String? city;
  final double? landArea;
  final int? pondCount;
  final int? livestockCount;
  final bool farmVerified;

  // Finance
  final double? balance;
  final double? sellerScore;
  final int? totalSales;

  // Status
  final String? verificationStatus;
  final int? membershipLevelId;

  const ProfileModel({
    required this.id,
    required this.name,
    required this.email,
    required this.createdAt,
    this.phone,
    this.avatarUrl,
    this.farmName,
    this.farmType,
    this.province,
    this.city,
    this.landArea,
    this.pondCount,
    this.livestockCount,
    this.farmVerified = false,
    this.balance,
    this.sellerScore,
    this.totalSales,
    this.verificationStatus,
    this.membershipLevelId,
  });

  // ===================== JSON =====================
  factory ProfileModel.fromJson(Map<String, dynamic> json) {
    return ProfileModel(
      id: _toInt(json['id']),
      name: json['name'] ?? json['full_name'] ?? 'User',
      email: json['email'] ?? '',
      phone: json['phone'] ?? json['phone_number'],
      avatarUrl: json['avatar_url'] ?? json['avatar'],
      createdAt: _toDate(json['created_at']),

      farmName: json['farm_name'] ?? json['farmName'],
      farmType: json['farm_type'] ?? json['farmType'],
      province: json['province'],
      city: json['city'],
      landArea: _toDouble(json['land_area'] ?? json['landArea']),
      pondCount: _toInt(json['pond_count'] ?? json['pondCount']),
      livestockCount: _toInt(json['livestock_count'] ?? json['livestockCount']),

      farmVerified: _toBool(json['farm_verified'] ?? json['farmVerified']),

      balance: _toDouble(json['balance'] ?? json['wallet_balance']),
      sellerScore: _toDouble(json['seller_score'] ?? json['score']),
      totalSales: _toInt(json['total_sales'] ?? json['totalSales']),

      verificationStatus:
          (json['verification_status'] ?? json['verificationStatus'])?.toString(),

      membershipLevelId: _toInt(json['membership_level_id']),
    );
  }

  // ===================== SAFE PARSER =====================
  static int _toInt(dynamic v) {
    if (v == null) return 0;
    if (v is int) return v;
    if (v is double) return v.toInt();
    return int.tryParse(v.toString()) ?? 0;
  }

  static double? _toDouble(dynamic v) {
    if (v == null) return null;
    if (v is double) return v;
    if (v is int) return v.toDouble();
    return double.tryParse(v.toString());
  }

  static bool _toBool(dynamic v) {
    if (v == null) return false;
    if (v is bool) return v;
    if (v is int) return v == 1;
    if (v is String) {
      final val = v.toLowerCase();
      return val == 'true' || val == '1' || val == 'yes';
    }
    return false;
  }

  static DateTime _toDate(dynamic v) {
    if (v == null) return DateTime.now();
    if (v is DateTime) return v;
    return DateTime.tryParse(v.toString()) ?? DateTime.now();
  }

  // ===================== UI HELPERS =====================

  String get formattedBalance =>
      'Rp ${_format(balance ?? 0)}';

  String get formattedLandArea =>
      landArea == null ? '-' : '${landArea!.toStringAsFixed(1)} Ha';

  String get fullLocation {
    final c = city?.trim();
    final p = province?.trim();

    if ((c == null || c.isEmpty) && (p == null || p.isEmpty)) {
      return 'Lokasi belum diatur';
    }
    if (c == null || c.isEmpty) return p!;
    if (p == null || p.isEmpty) return c;
    return '$c, $p';
  }

  String get farmTypeLabel {
    switch (farmType?.toLowerCase()) {
      case 'crop':
        return 'Tanaman';
      case 'livestock':
        return 'Peternakan';
      case 'aquaculture':
        return 'Perikanan';
      case 'plantation':
        return 'Perkebunan';
      default:
        return farmType ?? 'Campuran';
    }
  }

  String get farmTypeIcon {
    switch (farmType?.toLowerCase()) {
      case 'crop':
        return '🌾';
      case 'livestock':
        return '🐄';
      case 'aquaculture':
        return '🐟';
      case 'plantation':
        return '🌴';
      default:
        return '🌱';
    }
  }

  String get verificationLabel {
    switch ((verificationStatus ?? '').toLowerCase()) {
      case 'verified':
        return 'Terverifikasi';
      case 'pending':
        return 'Pending';
      case 'rejected':
        return 'Ditolak';
      default:
        return 'Belum Verifikasi';
    }
  }

  Color get verificationColor {
    switch ((verificationStatus ?? '').toLowerCase()) {
      case 'verified':
        return const Color(0xFF4CAF50);
      case 'pending':
        return const Color(0xFFFF9800);
      case 'rejected':
        return const Color(0xFFF44336);
      default:
        return Colors.grey;
    }
  }

  bool get isVerified => (verificationStatus ?? '') == 'verified';

  // ===================== FORMATTER =====================
  String _format(num value) {
    final str = value.toStringAsFixed(0);
    return str.replaceAllMapped(
      RegExp(r'\B(?=(\d{3})+(?!\d))'),
      (match) => '.',
    );
  }

  // ===================== EMPTY =====================
  static ProfileModel empty() => ProfileModel(
        id: 0,
        name: 'Guest',
        email: '',
        createdAt: DateTime.now(),
        farmVerified: false,
      );
}