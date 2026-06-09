class Product {
  final int id;
  final String name;

  // harga asli DB
  final double price;

  // backward compatibility
  final String oldPrice;
  final String image;
  final String discount;

  // flash sale
  final double? flashSalePrice;
  final int? discountPercent;

  final int soldCount;
  final double ratingAvg;
  final String unit;
  final int stock;

  final bool isFlashSale;
  final DateTime? flashSaleEnd;

  Product({
    required this.id,
    required this.name,
    required this.price,

    required this.oldPrice,
    required this.image,
    required this.discount,

    this.flashSalePrice,
    this.discountPercent,

    this.soldCount = 0,
    this.ratingAvg = 0.0,
    this.unit = 'kg',
    this.stock = 0,

    this.isFlashSale = false,
    this.flashSaleEnd,
  });

  Product.simple({
    required this.id,
    required this.name,
    required this.price,

    required this.oldPrice,
    required this.image,
    required this.discount,

    this.flashSalePrice,
    this.discountPercent,

    this.soldCount = 0,
    this.ratingAvg = 0.0,
    this.unit = 'kg',
    this.stock = 0,

    this.isFlashSale = false,
    this.flashSaleEnd,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    final double parsedPrice =
        double.tryParse(json['price']?.toString() ?? "0") ?? 0;

    final double? parsedFlashPrice =
        json['flash_sale_price'] != null
            ? double.tryParse(
                json['flash_sale_price'].toString(),
              )
            : null;

    final int calculatedDiscount =
        (parsedFlashPrice != null &&
                parsedPrice > 0)
            ? (((parsedPrice - parsedFlashPrice) /
                        parsedPrice) *
                    100)
                .round()
            : (json['discount_percent'] ?? 0);

    return Product(
      id: json['id'] ?? 0,

      name: json['name'] ?? '',

      price: parsedPrice,

      oldPrice: _rupiah(parsedPrice),

      image: _getEmojiForProduct(
        json['name'] ?? '',
      ),

      discount: calculatedDiscount > 0
          ? "-$calculatedDiscount%"
          : "",

      flashSalePrice: parsedFlashPrice,

      discountPercent:
          calculatedDiscount > 0
              ? calculatedDiscount
              : null,

      soldCount:
          int.tryParse(
                json['sold_count']
                        ?.toString() ??
                    "0",
              ) ??
              0,

      ratingAvg:
          double.tryParse(
                json['rating_avg']
                        ?.toString() ??
                    "0",
              ) ??
              0,

      unit: json['unit'] ?? "kg",

      stock:
          int.tryParse(
                json['stock']
                        ?.toString() ??
                    "0",
              ) ??
              0,

      isFlashSale:
          json['is_flash_sale'] ??
              false,

      flashSaleEnd:
          json['flash_sale_end'] != null
              ? DateTime.tryParse(
                  json['flash_sale_end'],
                )
              : null,
    );
  }

  // ==================================
  // DISPLAY HELPERS
  // ==================================

  double get effectivePrice =>
      flashSalePrice ?? price;

  String get priceDisplay =>
      _rupiah(effectivePrice);

  String get formattedPrice =>
      priceDisplay;

  String get formattedOldPrice =>
      oldPrice;

  String get ratingDisplay =>
      ratingAvg.toStringAsFixed(1);

  String get discountDisplay =>
      discount.isEmpty
          ? "0%"
          : discount;

  bool get hasDiscount =>
      discountPercent != null &&
      discountPercent! > 0;

  bool get inStock =>
      stock > 0;

  String get stockStatus =>
      stock > 0
          ? "Tersedia"
          : "Habis";

  bool get flashSaleActive {
    if (!isFlashSale) return false;

    if (flashSaleEnd == null) {
      return true;
    }

    return DateTime.now().isBefore(
      flashSaleEnd!,
    );
  }

  Product copyWith({
    int? id,
    String? name,
    double? price,
    String? oldPrice,
    String? image,
    String? discount,
    double? flashSalePrice,
    int? discountPercent,
    int? soldCount,
    double? ratingAvg,
    String? unit,
    int? stock,
    bool? isFlashSale,
    DateTime? flashSaleEnd,
  }) {
    return Product(
      id: id ?? this.id,
      name: name ?? this.name,
      price: price ?? this.price,

      oldPrice:
          oldPrice ?? this.oldPrice,

      image: image ?? this.image,

      discount:
          discount ?? this.discount,

      flashSalePrice:
          flashSalePrice ??
              this.flashSalePrice,

      discountPercent:
          discountPercent ??
              this.discountPercent,

      soldCount:
          soldCount ?? this.soldCount,

      ratingAvg:
          ratingAvg ?? this.ratingAvg,

      unit: unit ?? this.unit,

      stock: stock ?? this.stock,

      isFlashSale:
          isFlashSale ??
              this.isFlashSale,

      flashSaleEnd:
          flashSaleEnd ??
              this.flashSaleEnd,
    );
  }

  static String _rupiah(
    double value,
  ) {
    return "Rp ${value.toStringAsFixed(0).replaceAllMapped(
          RegExp(
            r'(\d{1,3})(?=(\d{3})+(?!\d))',
          ),
          (m) => '${m[1]}.',
        )}";
  }

  static String _getEmojiForProduct(
    String name,
  ) {
    final n = name.toLowerCase();

    if (n.contains("cabai")) {
      return "🌶️";
    }

    if (n.contains("tomat")) {
      return "🍅";
    }

    if (n.contains("beras")) {
      return "🍚";
    }

    if (n.contains("jagung")) {
      return "🌽";
    }

    if (n.contains("lele")) {
      return "🐟";
    }

    if (n.contains("nila")) {
      return "🐠";
    }

    if (n.contains("gurame")) {
      return "🐡";
    }

    if (n.contains("ayam")) {
      return "🍗";
    }

    if (n.contains("sapi")) {
      return "🐄";
    }

    if (n.contains("kambing")) {
      return "🐐";
    }

    if (n.contains("sensor")) {
      return "📡";
    }

    if (n.contains("irrigation")) {
      return "💧";
    }

    if (n.contains("pupuk")) {
      return "🌱";
    }

    if (n.contains("bibit")) {
      return "🌱";
    }

    if (n.contains("ikan")) {
      return "🐟";
    }

    return "🥬";
  }
}