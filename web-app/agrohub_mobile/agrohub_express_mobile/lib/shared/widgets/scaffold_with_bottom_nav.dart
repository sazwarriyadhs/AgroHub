import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ScaffoldWithBottomNav extends StatelessWidget {
  final Widget child;
  final int currentIndex;

  const ScaffoldWithBottomNav({
    super.key,
    required this.child,
    required this.currentIndex,
  });

  static const Color primaryGreen =
      Color(0xff00752A);

  static const Color secondaryGreen =
      Color(0xff00A63E);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: child,

      bottomNavigationBar: NavigationBar(
        height: 74,

        backgroundColor: Colors.white,

        indicatorColor:
            secondaryGreen.withOpacity(0.12),

        selectedIndex: currentIndex,

        labelBehavior:
            NavigationDestinationLabelBehavior
                .alwaysShow,

        onDestinationSelected: (index) {
          switch (index) {
            case 0:
              context.go('/');
              break;

            case 1:
              context.go('/shipments');
              break;

            case 2:
              context.go('/tracking');
              break;

            case 3:
              context.go('/earnings');
              break;

            case 4:
              context.go('/profile');
              break;
          }
        },

        destinations: const [
          NavigationDestination(
            icon: Icon(
              Icons.dashboard_outlined,
            ),

            selectedIcon:
                Icon(Icons.dashboard),

            label: 'Dashboard',
          ),

          NavigationDestination(
            icon: Icon(
              Icons.local_shipping_outlined,
            ),

            selectedIcon:
                Icon(Icons.local_shipping),

            label: 'Shipment',
          ),

          NavigationDestination(
            icon: Icon(
              Icons.location_on_outlined,
            ),

            selectedIcon:
                Icon(Icons.location_on),
                
            label: 'Tracking',
          ),

          NavigationDestination(
            icon: Icon(
              Icons.payments_outlined,
            ),

            selectedIcon:
                Icon(Icons.payments),

            label: 'Earnings',
          ),

          NavigationDestination(
            icon: Icon(
              Icons.person_outline,
            ),

            selectedIcon:
                Icon(Icons.person),

            label: 'Profil',
          ),
        ],
      ),
    );
  }
}