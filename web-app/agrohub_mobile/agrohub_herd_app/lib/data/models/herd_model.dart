// lib/data/models/herd_model.dart
import 'package:intl/intl.dart';

/// =========================
/// HERD/LIVESTOCK MODEL
/// =========================
class HerdModel {
  final int id;
  final int? barnId;
  final String? tagNumber;
  final String? species;
  final String? breed;
  final DateTime? birthDate;
  final String? status;
  final String? healthStatus;
  final String? gender;
  final double? purchasePrice;
  final double? currentPrice;
  final int? motherId;
  final int? fatherId;
  final String? imageUrl;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  HerdModel({
    required this.id,
    this.barnId,
    this.tagNumber,
    this.species,
    this.breed,
    this.birthDate,
    this.status,
    this.healthStatus,
    this.gender,
    this.purchasePrice,
    this.currentPrice,
    this.motherId,
    this.fatherId,
    this.imageUrl,
    this.createdAt,
    this.updatedAt,
  });

  /// From JSON
  factory HerdModel.fromJson(Map<String, dynamic> json) {
    return HerdModel(
      id: int.tryParse(json['id']?.toString() ?? '0') ?? 0,
      barnId: json['barn_id'] != null
          ? int.tryParse(json['barn_id'].toString())
          : null,
      tagNumber: json['tag_number']?.toString(),
      species: json['species']?.toString(),
      breed: json['breed']?.toString(),
      birthDate: json['birth_date'] != null
          ? DateTime.tryParse(json['birth_date'].toString())
          : null,
      status: json['status']?.toString(),
      healthStatus: json['health_status']?.toString(),
      gender: json['gender']?.toString(),
      purchasePrice: json['purchase_price'] != null
          ? double.tryParse(json['purchase_price'].toString())
          : null,
      currentPrice: json['current_price'] != null
          ? double.tryParse(json['current_price'].toString())
          : null,
      motherId: json['mother_id'] != null
          ? int.tryParse(json['mother_id'].toString())
          : null,
      fatherId: json['father_id'] != null
          ? int.tryParse(json['father_id'].toString())
          : null,
      imageUrl: json['image_url']?.toString(),
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'].toString())
          : null,
      updatedAt: json['updated_at'] != null
          ? DateTime.tryParse(json['updated_at'].toString())
          : null,
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
      'purchase_price': purchasePrice,
      'current_price': currentPrice,
      'mother_id': motherId,
      'father_id': fatherId,
      'image_url': imageUrl,
    };
  }

  /// =========================
  /// AGE CALCULATION
  /// =========================
  int get ageInMonths {
    if (birthDate == null) return 0;
    final now = DateTime.now();
    return (now.difference(birthDate!).inDays / 30.4).floor();
  }

  int get ageInYears {
    if (birthDate == null) return 0;
    final now = DateTime.now();
    int years = now.year - birthDate!.year;
    if (now.month < birthDate!.month ||
        (now.month == birthDate!.month && now.day < birthDate!.day)) {
      years--;
    }
    return years;
  }

  String get formattedAge {
    if (birthDate == null) return 'Umur tidak diketahui';
    final years = ageInYears;
    final months = ageInMonths % 12;
    if (years > 0) {
      return '$years tahun ${months > 0 ? '$months bulan' : ''}';
    }
    return '$months bulan';
  }

  /// =========================
  /// STATUS UI
  /// =========================
  String get statusDisplayName {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'sick':
        return 'Sakit';
      case 'pregnant':
        return 'Bunting';
      case 'sold':
        return 'Terjual';
      case 'died':
        return 'Mati';
      default:
        return status ?? 'Tidak diketahui';
    }
  }

  Color get statusColor {
    switch (status) {
      case 'active':
        return const Color(0xFF2E7D32);
      case 'sick':
        return const Color(0xFFC62828);
      case 'pregnant':
        return const Color(0xFFEF6C00);
      case 'sold':
        return const Color(0xFF1565C0);
      case 'died':
        return Colors.grey;
      default:
        return Colors.grey;
    }
  }

  String get healthStatusDisplayName {
    switch (healthStatus) {
      case 'healthy':
        return 'Sehat';
      case 'sick':
        return 'Sakit';
      case 'recovering':
        return 'Pemulihan';
      case 'critical':
        return 'Kritis';
      default:
        return healthStatus ?? 'Tidak diketahui';
    }
  }

  Color get healthStatusColor {
    switch (healthStatus) {
      case 'healthy':
        return const Color(0xFF2E7D32);
      case 'sick':
        return const Color(0xFFC62828);
      case 'recovering':
        return const Color(0xFFEF6C00);
      case 'critical':
        return const Color(0xFF6A1B9A);
      default:
        return Colors.grey;
    }
  }

  String get genderDisplayName {
    switch (gender) {
      case 'male':
        return 'Jantan';
      case 'female':
        return 'Betina';
      default:
        return gender ?? 'Tidak diketahui';
    }
  }

  IconData get genderIcon {
    switch (gender) {
      case 'male':
        return Icons.male;
      case 'female':
        return Icons.female;
      default:
        return Icons.help_outline;
    }
  }

  /// =========================
  /// PRICE FORMAT
  /// =========================
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
      case 'healthy':
        return 100;
      case 'recovering':
        return 70;
      case 'sick':
        return 40;
      case 'critical':
        return 10;
      default:
        return 50;
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
  
  String get formattedProfitValue => _formatCurrency(profitValue);
  String get formattedProfitPercentage => '${profitPercentage.toStringAsFixed(1)}%';
}

/// =========================
/// HEALTH RECORD MODEL
/// =========================
class HealthRecordModel {
  final int id;
  final int livestockId;
  final DateTime recordDate;
  final String? disease;
  final String? symptoms;
  final String? treatment;
  final String? medicine;
  final double? temperature;
  final String? veterinarian;
  final String? notes;
  final DateTime createdAt;

  HealthRecordModel({
    required this.id,
    required this.livestockId,
    required this.recordDate,
    this.disease,
    this.symptoms,
    this.treatment,
    this.medicine,
    this.temperature,
    this.veterinarian,
    this.notes,
    required this.createdAt,
  });

  factory HealthRecordModel.fromJson(Map<String, dynamic> json) {
    return HealthRecordModel(
      id: int.tryParse(json['id']?.toString() ?? '0') ?? 0,
      livestockId: int.tryParse(json['livestock_id']?.toString() ?? '0') ?? 0,
      recordDate: DateTime.tryParse(json['record_date']?.toString() ?? '') ?? DateTime.now(),
      disease: json['disease']?.toString(),
      symptoms: json['symptoms']?.toString(),
      treatment: json['treatment']?.toString(),
      medicine: json['medicine']?.toString(),
      temperature: json['temperature'] != null ? double.tryParse(json['temperature'].toString()) : null,
      veterinarian: json['veterinarian']?.toString(),
      notes: json['notes']?.toString(),
      createdAt: DateTime.tryParse(json['created_at']?.toString() ?? '') ?? DateTime.now(),
    );
  }
}

/// =========================
/// HERD STATS MODEL
/// =========================
class HerdStatsModel {
  final int totalTernak;
  final int jantan;
  final int betina;
  final int aktif;
  final int bunting;
  final int sakit;
  final int sehat;
  final double totalNilai;
  final double rataHarga;

  HerdStatsModel({
    required this.totalTernak,
    required this.jantan,
    required this.betina,
    required this.aktif,
    required this.bunting,
    required this.sakit,
    required this.sehat,
    required this.totalNilai,
    required this.rataHarga,
  });

  factory HerdStatsModel.fromJson(Map<String, dynamic> json) {
    return HerdStatsModel(
      totalTernak: json['total_ternak'] ?? 0,
      jantan: json['jantan'] ?? 0,
      betina: json['betina'] ?? 0,
      aktif: json['aktif'] ?? 0,
      bunting: json['bunting'] ?? 0,
      sakit: json['sakit'] ?? 0,
      sehat: json['sehat'] ?? 0,
      totalNilai: (json['total_nilai_ternak'] ?? 0).toDouble(),
      rataHarga: (json['rata_harga_ternak'] ?? 0).toDouble(),
    );
  }

  String get formattedTotalNilai => _formatCurrency(totalNilai);
  String get formattedRataHarga => _formatCurrency(rataHarga);

  String _formatCurrency(double value) {
    final formatter = NumberFormat.currency(
      locale: 'id_ID',
      symbol: 'Rp ',
      decimalDigits: 0,
    );
    return formatter.format(value);
  }

  double get persentaseSehat => totalTernak == 0 ? 0 : (sehat / totalTernak) * 100;
  double get persentaseSakit => totalTernak == 0 ? 0 : (sakit / totalTernak) * 100;
  double get persentaseBunting => totalTernak == 0 ? 0 : (bunting / totalTernak) * 100;
}

/// =========================
/// EXTENSION
/// =========================
extension NumberFormatting on double {
  String toCurrency() {
    final formatter = NumberFormat.currency(
      locale: 'id_ID',
      symbol: 'Rp ',
      decimalDigits: 0,
    );
    return formatter.format(this);
  }
}
