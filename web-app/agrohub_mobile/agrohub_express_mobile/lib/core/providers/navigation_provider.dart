// lib/core/providers/navigation_provider.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// Simple state provider untuk selected tab
final selectedTabProvider = StateProvider<int>((ref) => 0);

// Provider untuk menyimpan context (opsional)
final navigatorKeyProvider = Provider<GlobalKey<NavigatorState>>((ref) {
  return GlobalKey<NavigatorState>();
});
