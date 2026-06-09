// lib/features/feeding/domain/entities/feeding_statistic_entity.dart
import 'package:flutter/material.dart';
import 'package:equatable/equatable.dart';

class FeedingStatisticEntity extends Equatable {
  final double fcr;
  final double totalConsumption;
  final double totalCost;
  final double averageCostPerKg;
  final double efficiency;

  const FeedingStatisticEntity({
    this.fcr = 0,
    this.totalConsumption = 0,
    this.totalCost = 0,
    this.averageCostPerKg = 0,
    this.efficiency = 0,
  });

  @override
  List<Object?> get props => [fcr, totalConsumption, totalCost, averageCostPerKg, efficiency];
  
  String get efficiencyStatus {
    if (efficiency >= 0.8) return 'Excellent';
    if (efficiency >= 0.6) return 'Good';
    if (efficiency >= 0.4) return 'Fair';
    return 'Poor';
  }
  
  Color get efficiencyColor {
    if (efficiency >= 0.8) return Colors.green;
    if (efficiency >= 0.6) return Colors.lightGreen;
    if (efficiency >= 0.4) return Colors.orange;
    return Colors.red;
  }
}
