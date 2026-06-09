// core/models/brand_config.dart
class BrandConfig {
  final String headerImageUrl;
  final String logoUrl;
  final String primaryColor;
  final String companyName;

  const BrandConfig({
    required this.headerImageUrl,
    required this.logoUrl,
    required this.primaryColor,
    required this.companyName,
  });

  factory BrandConfig.fromJson(Map<String, dynamic> json) {
    return BrandConfig(
      headerImageUrl: json['header_image_url'] ?? '',
      logoUrl: json['logo_url'] ?? '',
      primaryColor: json['primary_color'] ?? '#00A63E',
      companyName: json['company_name'] ?? 'AgroHub Express',
    );
  }
}
