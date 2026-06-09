// lib/core/constants/herd_constants.dart
class HerdConstants {
  static const String appName = 'AgroHub Herd';
  
  // Jenis Ternak
  static const List<String> animalTypes = [
    'Sapi Potong',
    'Sapi Perah',
    'Kambing',
    'Domba',
    'Ayam Broiler',
    'Ayam Petelur'
  ];
  
  // Status Kesehatan
  static const List<String> healthStatus = [
    'Sehat',
    'Sakit Ringan',
    'Sakit Berat',
    'Dalam Perawatan',
    'Karantina'
  ];
  
  // Status Reproduksi
  static const List<String> reproductionStatus = [
    'Belum Kawin',
    'Bunting',
    'Menyusui',
    'Pasca Melahirkan'
  ];
  
  // Gender
  static const List<String> genders = ['Jantan', 'Betina'];
  
  // API Endpoints
  static const String baseUrl = 'https://api.agrohub.com/v1';
  static const String herdEndpoint = '/herd';
  static const String healthEndpoint = '/health-records';
  static const String feedEndpoint = '/feed';
}
