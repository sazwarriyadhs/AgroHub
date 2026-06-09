import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

/// =========================
/// LIVESTOCK MODEL
/// =========================
class Livestock {
  final int id;
  final int? barnId;
  final String? tagNumber;
  final String? species;
  final String? breed;
  final DateTime? birthDate;
  final String? status;
  final String? healthStatus;
  final String? gender;
  final double? weight;
  final double? purchasePrice;
  final double? currentPrice;
  final int? motherId;
  final int? fatherId;
  final String? imageUrl;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Livestock({
    required this.id,
    this.barnId,
    this.tagNumber,
    this.species,
    this.breed,
    this.birthDate,
    this.status,
    this.healthStatus,
    this.gender,
    this.weight,
    this.purchasePrice,
    this.currentPrice,
    this.motherId,
    this.fatherId,
    this.imageUrl,
    this.createdAt,
    this.updatedAt,
  });

  /// =========================
  /// SAFE FROM JSON
  /// =========================
  factory Livestock.fromJson(Map<String, dynamic> json) {
    return Livestock(
      id: int.tryParse(json['id']?.toString() ?? '0') ?? 0,
      barnId: json['barn_id'] != null ? int.tryParse(json['barn_id'].toString()) : null,
      tagNumber: json['tag_number']?.toString(),
      species: json['species']?.toString(),
      breed: json['breed']?.toString(),
      birthDate: json['birth_date'] != null ? DateTime.tryParse(json['birth_date'].toString()) : null,
      status: json['status']?.toString(),
      healthStatus: json['health_status']?.toString(),
      gender: json['gender']?.toString(),
      weight: json['weight'] != null ? double.tryParse(json['weight'].toString()) : null,
      purchasePrice: json['purchase_price'] != null ? double.tryParse(json['purchase_price'].toString()) : null,
      currentPrice: json['current_price'] != null ? double.tryParse(json['current_price'].toString()) : null,
      motherId: json['mother_id'] != null ? int.tryParse(json['mother_id'].toString()) : null,
      fatherId: json['father_id'] != null ? int.tryParse(json['father_id'].toString()) : null,
      imageUrl: json['image_url']?.toString(),
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at'].toString()) : null,
      updatedAt: json['updated_at'] != null ? DateTime.tryParse(json['updated_at'].toString()) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'barn_id': barnId,
      'tag_number': tagNumber,
      'species': species,
      'breed': breed,
      'birth_date': birthDate?.toIso8601String(),
      'status': status,
      'health_status': healthStatus,
      'gender': gender,
      'weight': weight,
      'purchase_price': purchasePrice,
      'current_price': currentPrice,
      'mother_id': motherId,
      'father_id': fatherId,
      'image_url': imageUrl,
    };
  }

  /// =========================
  /// IMMUTABLE MUTATION (COPY WITH)
  /// =========================
  Livestock copyWith({
    int? id,
    int? barnId,
    String? tagNumber,
    String? species,
    String? breed,
    DateTime? birthDate,
    String? status,
    String? healthStatus,
    String? gender,
    double? weight,
    double? purchasePrice,
    double? currentPrice,
    int? motherId,
    int? fatherId,
    String? imageUrl,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Livestock(
      id: id ?? this.id,
      barnId: barnId ?? this.barnId,
      tagNumber: tagNumber ?? this.tagNumber,
      species: species ?? this.species,
      breed: breed ?? this.breed,
      birthDate: birthDate ?? this.birthDate,
      status: status ?? this.status,
      healthStatus: healthStatus ?? this.healthStatus,
      gender: gender ?? this.gender,
      weight: weight ?? this.weight,
      purchasePrice: purchasePrice ?? this.purchasePrice,
      currentPrice: currentPrice ?? this.currentPrice,
      motherId: motherId ?? this.motherId,
      fatherId: fatherId ?? this.fatherId,
      imageUrl: imageUrl ?? this.imageUrl,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  /// =========================
  /// ACCURATE AGE CALCULATION
  /// =========================
  int get ageInMonths {
    if (birthDate == null) return 0;
    final now = DateTime.now();
    
    // Menghitung selisih bulan murni kalender tanpa pembagian hari rata-rata
    int months = (now.year - birthDate!.year) * 12 + now.month - birthDate!.month;
    if (now.day < birthDate!.day) {
      months--;
    }
    return months < 0 ? 0 : months;
  }

  int get ageInYears {
    if (birthDate == null) return 0;
    final now = DateTime.now();
    int years = now.year - birthDate!.year;

    if (now.month < birthDate!.month || (now.month == birthDate!.month && now.day < birthDate!.day)) {
      years--;
    }
    return years;
  }

  String get formattedAge {
    if (birthDate == null) return 'Umur tidak diketahui';

    final years = ageInYears;
    final months = ageInMonths % 12;

    if (years > 0) {
      return '$years tahun ${months > 0 ? '$months bulan' : ''}'.trim();
    }
    return '$months bulan';
  }

  /// =========================
  /// STATUS UI
  /// =========================
  String get statusDisplayName {
    switch (status) {
      case 'active': return 'Aktif';
      case 'sick': return 'Sakit';
      case 'pregnant': return 'Bunting';
      case 'sold': return 'Terjual';
      case 'died': return 'Mati';
      default: return status ?? 'Tidak diketahui';
    }
  }

  Color get statusColor {
    switch (status) {
      case 'active': return const Color(0xFF2E7D32); // Premium Green
      case 'sick': return const Color(0xFFC62828); // Premium Red
      case 'pregnant': return const Color(0xFFEF6C00); // Premium Orange
      case 'sold': return const Color(0xFF1565C0); // Premium Blue
      case 'died': return const Color(0xFF424242); // Premium Grey
      default: return Colors.grey;
    }
  }

  String get healthStatusDisplayName {
    switch (healthStatus) {
      case 'healthy': return 'Sehat';
      case 'sick': return 'Sakit';
      case 'recovering': return 'Pemulihan';
      case 'critical': return 'Kritis';
      default: return healthStatus ?? 'Tidak diketahui';
    }
  }

  Color get healthStatusColor {
    switch (healthStatus) {
      case 'healthy': return const Color(0xFF2E7D32);
      case 'sick': return const Color(0xFFC62828);
      case 'recovering': return const Color(0xFFEF6C00);
      case 'critical': return const Color(0xFF6A1B9A); // Premium Purple
      default: return Colors.grey;
    }
  }

  String get genderDisplayName {
    switch (gender) {
      case 'male': return 'Jantan';
      case 'female': return 'Betina';
      default: return gender ?? 'Tidak diketahui';
    }
  }

  IconData get genderIcon {
    switch (gender) {
      case 'male': return Icons.male_rounded;
      case 'female': return Icons.female_rounded;
      default: return Icons.help_outline_rounded;
    }
  }

  /// =========================
  /// DISPLAY FORMATS
  /// =========================
  String get formattedWeight => weight != null ? '${weight!.toStringAsFixed(1)} kg' : '-- kg';
  String get formattedPurchasePrice => _formatCurrency(purchasePrice);
  String get formattedCurrentPrice => _formatCurrency(currentPrice);

  String _formatCurrency(double? amount) {
    if (amount == null) return 'Rp 0';
    final formatter = NumberFormat.currency(
      locale: 'id_ID',
      symbol: 'Rp ',
      decimalDigits: 0,
    );
    return formatter.format(amount);
  }

  /// =========================
  /// BUSINESS LOGIC
  /// =========================
  double get healthScore {
    switch (healthStatus) {
      case 'healthy': return 100;
      case 'recovering': return 70;
      case 'sick': return 40;
      case 'critical': return 10;
      default: return 50;
    }
  }

  double get profitValue {
    if (purchasePrice == null || currentPrice == null) return 0;
    return currentPrice! - purchasePrice!;
  }

  double get profitPercentage {
    if (purchasePrice == null || currentPrice == null || purchasePrice == 0) return 0;
    return ((currentPrice! - purchasePrice!) / purchasePrice!) * 100;
  }
}