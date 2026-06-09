import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

// Import semua screen (path yang benar)
import '../../features/dashboard/screens/dashboard_screen.dart';
import '../../features/shipments/screens/shipments_screen.dart';
import '../../features/tracking/screens/tracking_screen.dart';
import '../../features/earnings/screens/earnings_screen.dart';
import '../../features/profile/screens/profile_screen.dart';
import '../../features/drivers/screens/drivers_screen.dart';
import '../../features/fleet/screens/fleet_screen.dart';

class AppRoutes {
  static const String dashboard = '/';
  static const String shipments = '/shipments';
  static const String tracking = '/tracking';
  static const String earnings = '/earnings';
  static const String profile = '/profile';
  static const String drivers = '/drivers';
  static const String fleet = '/fleet';

  static final GoRouter router = GoRouter(
    initialLocation: dashboard,
    routes: [
      GoRoute(
        path: dashboard,
        name: 'dashboard',
        builder: (context, state) => const DashboardScreen(),
      ),
      GoRoute(
        path: shipments,
        name: 'shipments',
        builder: (context, state) => const ShipmentsScreen(),
      ),
      GoRoute(
        path: tracking,
        name: 'tracking',
        builder: (context, state) => const TrackingScreen(),
      ),
      GoRoute(
        path: '$tracking/:shipmentId',
        name: 'trackingDetail',
        builder: (context, state) {
          final shipmentId = state.pathParameters['shipmentId'];
          return TrackingScreen(shipmentId: shipmentId);
        },
      ),
      GoRoute(
        path: earnings,
        name: 'earnings',
        builder: (context, state) => const EarningsScreen(),
      ),
      GoRoute(
        path: profile,
        name: 'profile',
        builder: (context, state) => const ProfileScreen(),
      ),
      GoRoute(
        path: drivers,
        name: 'drivers',
        builder: (context, state) => const DriversScreen(),
      ),
      GoRoute(
        path: fleet,
        name: 'fleet',
        builder: (context, state) => const FleetScreen(),
      ),
    ],
  );
  
  AppRoutes._();
}
