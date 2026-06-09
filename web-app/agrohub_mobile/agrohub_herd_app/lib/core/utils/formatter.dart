// lib/core/utils/formatter.dart
class Formatter {
  static String formatCurrency(double amount) {
    return 'Rp ${amount.toStringAsFixed(0).replaceAllMapped(RegExp(r"(\d{1,3})(?=(\d{3})+(?!\d))"), (Match m) => "${m[1]}.")}';
  }
  
  static String formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
  
  static String formatWeight(double kg) {
    return '${kg.toStringAsFixed(1)} kg';
  }
  
  static String formatAgeInMonths(DateTime birthDate) {
    final now = DateTime.now();
    final months = now.difference(birthDate).inDays ~/ 30;
    if (months < 12) return '$months bulan';
    return '${months ~/ 12} tahun ${months % 12} bulan';
  }
}

// lib/core/utils/validator.dart
class Validator {
  static String? validateName(String? value) {
    if (value == null || value.isEmpty) return 'Nama tidak boleh kosong';
    if (value.length < 3) return 'Minimal 3 karakter';
    return null;
  }
  
  static String? validateWeight(String? value) {
    if (value == null || value.isEmpty) return 'Berat tidak boleh kosong';
    final weight = double.tryParse(value);
    if (weight == null) return 'Masukkan angka yang valid';
    if (weight <= 0) return 'Berat harus lebih dari 0';
    return null;
  }
  
  static String? validateAge(String? value) {
    if (value == null || value.isEmpty) return 'Umur tidak boleh kosong';
    final age = int.tryParse(value);
    if (age == null) return 'Masukkan angka yang valid';
    if (age < 0) return 'Umur tidak valid';
    return null;
  }
}
