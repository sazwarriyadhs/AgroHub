// lib/features/dashboard/blocs/dashboard_bloc.dart

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../core/services/api_service.dart';

part 'dashboard_event.dart';
part 'dashboard_state.dart';

class DashboardBloc extends Bloc<DashboardEvent, DashboardState> {
  final ApiService _apiService;

  DashboardBloc({
    required ApiService apiService,
  })  : _apiService = apiService,
        super(DashboardInitial()) {
    on<FetchDashboardData>(_onFetchDashboardData);
    on<RefreshDashboardData>(_onRefreshDashboardData);
  }

  Future<void> _onFetchDashboardData(
    FetchDashboardData event,
    Emitter<DashboardState> emit,
  ) async {
    emit(DashboardLoading());

    try {
      final statsFuture = _apiService
          .getDashboardStats()
          .catchError((_) => <String, dynamic>{});

      final pricesFuture = _apiService
          .getMarketPrices()
          .catchError((_) => <Map<String, dynamic>>[]);

      final cropsFuture = _apiService
          .getMyCrops()
          .catchError((_) => <Map<String, dynamic>>[]);

      final tasksFuture = _apiService
          .getFarmTasks()
          .catchError((_) => <Map<String, dynamic>>[]);

      final walletFuture = _apiService
          .getWallet()
          .catchError((_) => {'data': {'balance': 250000}});

      final results = await Future.wait([
        statsFuture,
        pricesFuture,
        cropsFuture,
        tasksFuture,
        walletFuture,
      ]);

      final statsResponse =
          (results[0] as Map?)?.cast<String, dynamic>() ?? {};

      final walletResponse =
          (results[4] as Map?)?.cast<String, dynamic>() ?? {};

      final stats =
          (statsResponse['data'] as Map?)?.cast<String, dynamic>() ??
              statsResponse;

      final walletData =
          (walletResponse['data'] as Map?)?.cast<String, dynamic>() ??
              walletResponse;

      final walletBalance =
          double.tryParse(walletData['balance'].toString()) ??
              250000;

      final marketPrices =
          _safeMapList(results[1]);

      final crops =
          _safeMapList(results[2]);

      final tasks =
          _safeMapList(results[3]);

      final formattedStats = {
        'totalRevenue':
            _toNum(stats['totalRevenue'], 12450000),

        'activeOrders':
            _toNum(stats['activeOrders'], 8),

        'pendingTasks': tasks.length,

        'walletBalance': walletBalance,
      };

      emit(
        DashboardLoaded(
          stats: formattedStats,

          crops: crops.map((crop) {
            return {
              'name': crop['name'] ?? 'Unknown',
              'area': '${crop['area'] ?? 0} ha',
              'status':
                  crop['phase'] ??
                  crop['status'] ??
                  'Pertumbuhan',
              'icon': _getCropIcon(
                crop['name']?.toString() ?? '',
              ),
              'days': _toNum(crop['days'], 0),
              'phase':
                  crop['phase'] ??
                  'Pertumbuhan',
            };
          }).toList(),

          activities: _getMockActivities(),

          marketPrices: marketPrices.map((price) {
            return {
              'name':
                  price['commodity'] ??
                  price['name'] ??
                  'Unknown',

              'price': _formatPrice(
                price['price'],
              ),

              'change': _formatChange(
                price['change'],
              ),
            };
          }).toList(),

          tasks: tasks.map((task) {
            return {
              'title':
                  task['title'] ??
                  'Unknown',

              'priority':
                  task['priority'] ??
                  'medium',

              'dueDate': _formatDueDate(
                task['dueDate']?.toString(),
              ),
            };
          }).toList(),
        ),
      );
    } catch (e, stackTrace) {
      debugPrint(
        'Dashboard fetch error: $e',
      );

      debugPrint(
        stackTrace.toString(),
      );

      emit(
        _getFallbackData(),
      );
    }
  }

  Future<void> _onRefreshDashboardData(
    RefreshDashboardData event,
    Emitter<DashboardState> emit,
  ) async {
    add(
      FetchDashboardData(),
    );
  }

  // =========================
  // HELPERS
  // =========================

  List<Map<String, dynamic>> _safeMapList(
    dynamic value,
  ) {
    if (value is! List) {
      return [];
    }

    return value
        .whereType<Map>()
        .map(
          (e) => Map<String, dynamic>.from(e),
        )
        .toList();
  }

  num _toNum(
    dynamic value,
    num fallback,
  ) {
    if (value == null) {
      return fallback;
    }

    if (value is num) {
      return value;
    }

    return num.tryParse(
          value.toString(),
        ) ??
        fallback;
  }

  String _getCropIcon(
    String cropName,
  ) {
    final name =
        cropName.toLowerCase();

    if (name.contains('padi')) {
      return '🌾';
    }

    if (name.contains('jagung')) {
      return '🌽';
    }

    if (name.contains('cabai')) {
      return '🌶️';
    }

    if (name.contains('tomat')) {
      return '🍅';
    }

    if (name.contains('bawang')) {
      return '🧅';
    }

    return '🌱';
  }

  String _formatPrice(
    dynamic price,
  ) {
    final value =
        double.tryParse(
              price.toString(),
            ) ??
            0;

    final formatted =
        value
            .toStringAsFixed(0)
            .replaceAllMapped(
      RegExp(
        r'(\d{1,3})(?=(\d{3})+(?!\d))',
      ),
      (m) => '${m[1]}.',
    );

    return 'Rp $formatted';
  }

  String _formatChange(
    dynamic change,
  ) {
    double value = 0;

    if (change is double) {
      value = change;
    } else if (change is int) {
      value = change.toDouble();
    } else {
      value =
          double.tryParse(
                change.toString(),
              ) ??
              0;
    }

    final prefix =
        value >= 0 ? '+' : '';

    return '$prefix${value.toStringAsFixed(2)}%';
  }

  String _formatDueDate(
    String? dueDate,
  ) {
    if (dueDate == null) {
      return 'Minggu ini';
    }

    try {
      final date =
          DateTime.parse(
        dueDate,
      );

      final diff =
          date
              .difference(
                DateTime.now(),
              )
              .inDays;

      if (diff <= 0) {
        return 'Hari ini';
      }

      if (diff == 1) {
        return 'Besok';
      }

      if (diff < 7) {
        return '$diff hari lagi';
      }

      return 'Minggu ini';
    } catch (_) {
      return 'Minggu ini';
    }
  }

  List<Map<String, dynamic>>
      _getMockActivities() {
    return [
      {
        'title': 'Penyiraman',
        'time': '2 jam lalu',
        'status': 'completed',
      },
      {
        'title': 'Pemupukan',
        'time': '5 jam lalu',
        'status': 'completed',
      },
      {
        'title': 'Panen Padi',
        'time': '1 hari lalu',
        'status': 'pending',
      },
    ];
  }

  DashboardLoaded _getFallbackData() {
    return DashboardLoaded(
      stats: {
        'totalRevenue': 12450000,
        'activeOrders': 8,
        'pendingTasks': 5,
        'walletBalance': 250000,
      },

      crops: [
        {
          'name': 'Padi',
          'area': '2.5 ha',
          'status': 'Pembungaan',
          'icon': '🌾',
          'days': 60,
          'phase': 'Pembungaan',
        },
        {
          'name': 'Jagung',
          'area': '1.8 ha',
          'status': 'Pertumbuhan',
          'icon': '🌽',
          'days': 45,
          'phase': 'Pertumbuhan',
        },
      ],

      activities:
          _getMockActivities(),

      marketPrices: [
        {
          'name': 'Padi GKP',
          'price': 'Rp 6.200',
          'change': '+2.35%',
        },
        {
          'name': 'Jagung Pipil',
          'price': 'Rp 5.150',
          'change': '+1.80%',
        },
      ],

      tasks: [
        {
          'title': 'Siram tanaman',
          'priority': 'high',
          'dueDate': 'Hari ini',
        },
        {
          'title': 'Pemupukan',
          'priority': 'medium',
          'dueDate': 'Besok',
        },
      ],
    );
  }
}