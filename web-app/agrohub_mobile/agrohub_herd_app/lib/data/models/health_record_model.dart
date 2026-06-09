// lib/data/models/health_record_model.dart
class HealthRecord {
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

  HealthRecord({
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
  });

  factory HealthRecord.fromJson(Map<String, dynamic> json) {
    return HealthRecord(
      id: json['id'] ?? 0,
      livestockId: json['livestock_id'] ?? 0,
      recordDate: DateTime.parse(json['record_date']),
      disease: json['disease'],
      symptoms: json['symptoms'],
      treatment: json['treatment'],
      medicine: json['medicine'],
      temperature: json['temperature']?.toDouble(),
      veterinarian: json['veterinarian'],
      notes: json['notes'],
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'livestock_id': livestockId,
    'record_date': recordDate.toIso8601String(),
    'disease': disease,
    'symptoms': symptoms,
    'treatment': treatment,
    'medicine': medicine,
    'temperature': temperature,
    'veterinarian': veterinarian,
    'notes': notes,
  };
}
