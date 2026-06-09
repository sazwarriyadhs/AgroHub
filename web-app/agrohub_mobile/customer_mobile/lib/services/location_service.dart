import 'package:geolocator/geolocator.dart';
import 'package:permission_handler/permission_handler.dart';

class LocationService {
  // Cek apakah GPS aktif
  static Future<bool> isLocationServiceEnabled() async {
    return await Geolocator.isLocationServiceEnabled();
  }

  // Buka pengaturan lokasi
  static Future<bool> openLocationSettings() async {
    return await Geolocator.openLocationSettings();
  }

  // Cek dan minta izin lokasi
  static Future<PermissionStatus> checkAndRequestPermission() async {
    PermissionStatus status = await Permission.location.status;
    
    if (status.isDenied) {
      status = await Permission.location.request();
    }
    
    return status;
  }

  // Dapatkan posisi terkini
  static Future<Position?> getCurrentPosition() async {
    // Cek GPS aktif
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return null;
    }

    // Cek izin
    PermissionStatus permissionStatus = await checkAndRequestPermission();
    if (permissionStatus.isDenied || permissionStatus.isPermanentlyDenied) {
      return null;
    }

    try {
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
      return position;
    } catch (e) {
      print('Error mengambil lokasi: $e');
      return null;
    }
  }

  // Dapatkan alamat dari koordinat
  static Future<String?> getAddressFromPosition(Position position) async {
    try {
      List<Placemark> placemarks = await Geolocator.placemarkFromCoordinates(
        position.latitude,
        position.longitude,
      );
      
      if (placemarks.isNotEmpty) {
        Placemark place = placemarks.first;
        String city = place.locality ?? place.subAdministrativeArea ?? '';
        String province = place.administrativeArea ?? '';
        
        if (city.isNotEmpty && province.isNotEmpty) {
          return '$city, $province';
        } else if (city.isNotEmpty) {
          return city;
        } else if (province.isNotEmpty) {
          return province;
        }
        return 'Lokasi ditemukan';
      }
      return null;
    } catch (e) {
      print('Geocoding error: $e');
      return null;
    }
  }
}