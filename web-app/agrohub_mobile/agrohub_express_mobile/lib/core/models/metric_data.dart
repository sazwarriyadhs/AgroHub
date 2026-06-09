// core/models/metric_data.dart
import 'package:flutter/material.dart';

class MetricData {
  final IconData icon;
  final Color color;
  final String value;
  final String title;
  final String subtitle;

  const MetricData({
    required this.icon,
    required this.color,
    required this.value,
    required this.title,
    required this.subtitle,
  });

  // Factory untuk konversi dari JSON (backend)
  factory MetricData.fromJson(Map<String, dynamic> json) {
    return MetricData(
      icon: _getIconFromString(json['icon'] ?? 'inventory'),
      color: _getColorFromHex(json['color'] ?? '#4CAF50'),
      value: json['value'] ?? '0',
      title: json['title'] ?? '',
      subtitle: json['subtitle'] ?? '',
    );
  }

  static IconData _getIconFromString(String iconName) {
    switch (iconName) {
      case 'inventory': return Icons.inventory;
      case 'schedule': return Icons.schedule;
      case 'check': return Icons.check;
      case 'payments': return Icons.payments;
      case 'route': return Icons.route;
      case 'star': return Icons.star;
      default: return Icons.inventory;
    }
  }

  static Color _getColorFromHex(String hexColor) {
    hexColor = hexColor.replaceAll('#', '');
    if (hexColor.length == 6) {
      hexColor = 'FF$hexColor';
    }
    return Color(int.parse('0x$hexColor'));
  }
}
