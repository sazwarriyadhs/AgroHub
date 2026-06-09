// features/products/data/models/ai_metadata_model.dart

class AIProductMetadata {
  final double? predictedDemand;
  final double? recommendedPrice;
  final String? qualityScore;
  final List<String>? seasonalTrends;
  final Map<String, dynamic>? marketInsights;
  final DateTime? lastPrediction;
  final String? supplyChainRisk;
  final double? carbonFootprint;

  AIProductMetadata({
    this.predictedDemand,
    this.recommendedPrice,
    this.qualityScore,
    this.seasonalTrends,
    this.marketInsights,
    this.lastPrediction,
    this.supplyChainRisk,
    this.carbonFootprint,
  });

  factory AIProductMetadata.fromJson(Map<String, dynamic> json) {
    return AIProductMetadata(
      predictedDemand: json['predicted_demand']?.toDouble(),
      recommendedPrice: json['recommended_price']?.toDouble(),
      qualityScore: json['quality_score'] as String?,
      seasonalTrends: (json['seasonal_trends'] as List<dynamic>?)?.cast<String>(),
      marketInsights: json['market_insights'] as Map<String, dynamic>?,
      lastPrediction: json['last_prediction'] != null ? DateTime.parse(json['last_prediction']) : null,
      supplyChainRisk: json['supply_chain_risk'] as String?,
      carbonFootprint: json['carbon_footprint']?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'predicted_demand': predictedDemand,
      'recommended_price': recommendedPrice,
      'quality_score': qualityScore,
      'seasonal_trends': seasonalTrends,
      'market_insights': marketInsights,
      'last_prediction': lastPrediction?.toIso8601String(),
      'supply_chain_risk': supplyChainRisk,
      'carbon_footprint': carbonFootprint,
    };
  }
}
