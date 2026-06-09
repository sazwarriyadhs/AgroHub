// lib/features/sell/models/price_suggestion.dart
class PriceSuggestion {
  final double marketPrice;
  final double predictedPrice;
  final double minPrice;
  final double maxPrice;
  final String trend;

  PriceSuggestion({
    required this.marketPrice,
    required this.predictedPrice,
    required this.minPrice,
    required this.maxPrice,
    this.trend = 'stable',
  });

  factory PriceSuggestion.fromJson(Map<String, dynamic> json) {
    final market = (json['market_price'] ?? json['price'] ?? 0).toDouble();
    return PriceSuggestion(
      marketPrice: market,
      predictedPrice: (json['predicted_price'] ?? market).toDouble(),
      minPrice: (json['min_price'] ?? market * 0.9).toDouble(),
      maxPrice: (json['max_price'] ?? market * 1.15).toDouble(),
      trend: json['trend'] ?? 'stable',
    );
  }

  double get suggestedPrice => predictedPrice;
  String get formattedSuggested => 'Rp ${_formatPrice(suggestedPrice)}';
  
  String _formatPrice(double price) {
    return price.toStringAsFixed(0).replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
      (m) => '${m[1]}.',
    );
  }
}
