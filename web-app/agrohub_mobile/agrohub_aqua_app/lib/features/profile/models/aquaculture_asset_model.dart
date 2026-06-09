class AquacultureAsset {
  final int id;

  final int? fishCategoryId; // ✅ TAMBAH INI

  final String? species;
  final String? systemType;

  final int? stockCount;
  final double? estimatedBiomass;
  final double? survivalRate;

  final String? status;

  AquacultureAsset({
    required this.id,
    this.fishCategoryId, // ✅ ADD HERE
    this.species,
    this.systemType,
    this.stockCount,
    this.estimatedBiomass,
    this.survivalRate,
    this.status,
  });
}