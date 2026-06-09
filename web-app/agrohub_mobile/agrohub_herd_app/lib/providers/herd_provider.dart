import 'package:flutter/material.dart';
// 1. 🔥 Wajib hukumnya mengimpor file model baru ini
import 'package:agrohub_herd_app/data/models/livestock_model.dart'; 
import 'package:agrohub_herd_app/services/herd_service.dart';

class HerdProvider extends ChangeNotifier {
  final HerdService _herdService = HerdService();
  
  // Mengubah struktur penampung data utama menjadi List Livestock
  List<Livestock> _items = [];
  bool _isLoading = false;

  List<Livestock> get items => _items;
  bool get isLoading => _isLoading;

  /// 🔥 AUTOMATIC LIVE STATS GETTER (Pengganti HerdStats)
  int get totalAnimals => _items.length;
  int get healthyAnimals => _items.where((element) => element.healthStatus == 'healthy').length;
  int get sickAnimals => _items.where((element) => element.healthStatus == 'sick').length;
  int get pregnantAnimals => _items.where((element) => element.status == 'pregnant').length;

  /// Ambil data dari service api
  Future<void> fetchAndRefreshHerd() async {
    _isLoading = true;
    notifyListeners();

    try {
      _items = await _herdService.getAllLivestockData();
    } catch (error) {
      debugPrint('Gagal sinkronisasi data provider: $error');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}