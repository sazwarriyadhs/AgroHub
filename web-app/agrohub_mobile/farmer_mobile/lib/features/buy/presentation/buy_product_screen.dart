// lib/features/buy/presentation/buy_product_screen.dart

import 'dart:async';
import 'package:flutter/material.dart';

import '../../../core/services/api_service.dart';
import '../../sell/models/commodity_type.dart';
import '../../sell/models/price_suggestion.dart';
import '../models/vendor_product.dart';

enum BuyMode { farm, vendor }

class BuyProductScreen extends StatefulWidget {
  const BuyProductScreen({super.key});

  @override
  State<BuyProductScreen> createState() => _BuyProductScreenState();
}

class _BuyProductScreenState extends State<BuyProductScreen> {

  final ApiService _api = ApiService();

  List<CommodityType> farmProducts = [];
  List<VendorProduct> vendorProducts = [];

  List<CommodityType> filteredFarm = [];
  List<VendorProduct> filteredVendor = [];

  Map<int, PriceSuggestion?> suggestions = {};

  bool loading = true;
  String? error;

  BuyMode mode = BuyMode.farm;

  String selectedFilter = "SEMUA";
  String search = "";

  int bottomIndex = 1;

  final farmFilters = [
    "SEMUA",
    "🌾 PADI",
    "🌽 JAGUNG",
    "🌶 CABAI",
    "🍅 TOMAT",
    "🥬 SAYUR"
  ];

  final vendorFilters = [
    "SEMUA",
    "🧪 PUPUK",
    "🐛 PESTISIDA",
    "🌱 BENIH",
    "🔧 ALAT"
  ];

  @override
  void initState() {
    super.initState();
    loadData();
  }

  @override
  void dispose() {
    _api.dispose();
    super.dispose();
  }

  Future<void> loadData() async {

    if (!mounted) return;

    setState(() {
      loading = true;
      error = null;
    });

    try {

      final farms = await _api.getFarmProducts();

      final mapEntries = await Future.wait(
        farms.map((e) async {

          try {

            final s =
                await _api.getPriceSuggestion(e.id);

            return MapEntry(e.id, s);

          } catch (_) {

            return MapEntry(e.id, null);

          }
        }),
      );

      final vendors =
          await _api.getVendorProducts();

      if (!mounted) return;

      setState(() {

        farmProducts = farms;
        vendorProducts = vendors;

        filteredFarm = farms;
        filteredVendor = vendors;

        suggestions =
            Map<int, PriceSuggestion?>
                .fromEntries(mapEntries);

        loading = false;
      });

    } catch (e) {

      if (!mounted) return;

      setState(() {

        loading = false;
        error = e.toString();

      });
    }
  }

  void applyFilter(String filter) {

    selectedFilter = filter;

    setState(() {

      if (mode == BuyMode.farm) {

        filteredFarm =
            farmProducts.where((p) {

          final name =
              p.name.toLowerCase();

          return name.contains(
              search.toLowerCase());

        }).toList();

      } else {

        filteredVendor =
            vendorProducts.where((p) {

          return p.name
              .toLowerCase()
              .contains(
                  search.toLowerCase());

        }).toList();
      }
    });
  }

  Future<void> addCart(
      int id,
      double price,
      String type) async {

    try {

      await _api.addToCart(
        productId: id,
        quantity: 1,
        price: price,
        productType: type,
      );

      if (!mounted) return;

      ScaffoldMessenger.of(context)
          .showSnackBar(
        const SnackBar(
          content:
              Text("Produk ditambahkan"),
        ),
      );

    } catch (e) {

      ScaffoldMessenger.of(context)
          .showSnackBar(
        SnackBar(
          content: Text("$e"),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      backgroundColor:
          const Color(0xffF5F7F2),

      floatingActionButton:
          FloatingActionButton.extended(

        backgroundColor:
            const Color(0xff1B8F3E),

        onPressed: () {

          Navigator.pushNamed(
              context,
              "/cart");

        },

        label: const Text(
          "Keranjang",
        ),

        icon: const Icon(
          Icons.shopping_cart,
        ),
      ),

      bottomNavigationBar:
          NavigationBar(

        selectedIndex: bottomIndex,

        onDestinationSelected:
            (i) {

          setState(() {
            bottomIndex = i;
          });

          switch (i) {

            case 0:
              Navigator.pushNamed(
                  context,
                  "/dashboard");
              break;

            case 1:
              break;

            case 2:
              Navigator.pushNamed(
                  context,
                  "/market");
              break;

            case 3:
              Navigator.pushNamed(
                  context,
                  "/profile");
          }
        },

        destinations: const [

          NavigationDestination(
            icon: Icon(Icons.home),
            label: "Home",
          ),

          NavigationDestination(
            icon: Icon(Icons.store),
            label: "Buy",
          ),

          NavigationDestination(
            icon: Icon(Icons.show_chart),
            label: "Market",
          ),

          NavigationDestination(
            icon: Icon(Icons.person),
            label: "Profile",
          ),
        ],
      ),

      body: SafeArea(

        child: loading

            ? const Center(
                child:
                    CircularProgressIndicator(),
              )

            : error != null

                ? Center(
                    child:
                        Text(error!),
                  )

                : RefreshIndicator(

                    onRefresh: loadData,

                    child: Column(

                      children: [

                        _header(),

                        _modeSwitch(),

                        _filters(),

                        Expanded(

                          child:

                              mode ==
                                      BuyMode
                                          .farm

                                  ? farmGrid()

                                  : vendorGrid(),
                        )
                      ],
                    ),
                  ),
      ),
    );
  }

  Widget _header() {

    return Container(

      padding:
          const EdgeInsets.all(20),

      decoration:
          const BoxDecoration(

        gradient:
            LinearGradient(

          colors: [

            Color(0xff1B8F3E),
            Color(0xff0B5B2A)

          ],
        ),
      ),

      child: Column(

        children: [

          const Text(

            "Pasar Tani",

            style: TextStyle(
              color: Colors.white,
              fontSize: 28,
              fontWeight:
                  FontWeight.bold,
            ),
          ),

          const SizedBox(height: 15),

          TextField(

            onChanged: (v) {

              search = v;
              applyFilter(
                  selectedFilter);

            },

            decoration:
                InputDecoration(

              filled: true,

              fillColor:
                  Colors.white,

              hintText:
                  "Cari produk...",

              prefixIcon:
                  const Icon(
                      Icons.search),

              border:
                  OutlineInputBorder(

                borderRadius:
                    BorderRadius.circular(
                        14),

                borderSide:
                    BorderSide.none,
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget _modeSwitch() {

    return Padding(

      padding:
          const EdgeInsets.all(16),

      child: Row(

        children: [

          Expanded(
            child: ElevatedButton(

              onPressed: () {

                setState(() {

                  mode =
                      BuyMode.farm;

                });
              },

              child:
                  const Text(
                "🌾 Hasil Panen",
              ),
            ),
          ),

          const SizedBox(width: 10),

          Expanded(
            child: ElevatedButton(

              onPressed: () {

                setState(() {

                  mode =
                      BuyMode.vendor;

                });
              },

              child:
                  const Text(
                "🧰 Vendor",
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _filters() {

    final list =
        mode == BuyMode.farm
            ? farmFilters
            : vendorFilters;

    return SizedBox(

      height: 50,

      child: ListView.builder(

        scrollDirection:
            Axis.horizontal,

        itemCount: list.length,

        itemBuilder: (_, i) {

          final item = list[i];

          return Padding(

            padding:
                const EdgeInsets.only(
                    left: 10),

            child: ChoiceChip(

              label: Text(item),

              selected:
                  selectedFilter ==
                      item,

              onSelected: (_) {

                applyFilter(item);

              },
            ),
          );
        },
      ),
    );
  }

  Widget farmGrid() {

    return GridView.builder(

      padding:
          const EdgeInsets.all(16),

      gridDelegate:
          const SliverGridDelegateWithFixedCrossAxisCount(

        crossAxisCount: 2,
        childAspectRatio: .72,

      ),

      itemCount:
          filteredFarm.length,

      itemBuilder: (_, i) {

        final p =
            filteredFarm[i];

        final price =
            suggestions[p.id]
                    ?.suggestedPrice ??
                p.basePrice ??
                0;

        return _card(

          icon:
              _farmEmoji(p.name),

          title:
              p.name,

          subtitle:
              "Rp ${format(price)}",

          onTap: () {

            addCart(
              p.id,
              price,
              "farm",
            );
          },
        );
      },
    );
  }

  Widget vendorGrid() {

    return GridView.builder(

      padding:
          const EdgeInsets.all(16),

      gridDelegate:
          const SliverGridDelegateWithFixedCrossAxisCount(

        crossAxisCount: 2,
        childAspectRatio: .72,

      ),

      itemCount:
          filteredVendor.length,

      itemBuilder: (_, i) {

        final p =
            filteredVendor[i];

        return _card(

          icon:
              p.categoryIcon,

          title:
              p.name,

          subtitle:
              p.formattedPrice,

          onTap: () {

            addCart(
              p.id,
              p.price,
              "vendor",
            );
          },
        );
      },
    );
  }

  Widget _card({

    required String icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,

  }) {

    return Card(

      shape:
          RoundedRectangleBorder(

        borderRadius:
            BorderRadius.circular(
                20),
      ),

      child: Padding(

        padding:
            const EdgeInsets.all(14),

        child: Column(

          children: [

            Text(
              icon,
              style:
                  const TextStyle(
                      fontSize: 50),
            ),

            const Spacer(),

            Text(
              title,
              maxLines: 2,
              textAlign:
                  TextAlign.center,
            ),

            Text(
              subtitle,
              style:
                  const TextStyle(
                color: Colors.green,
                fontWeight:
                    FontWeight.bold,
              ),
            ),

            const SizedBox(height: 8),

            SizedBox(

              width:
                  double.infinity,

              child:
                  ElevatedButton(

                onPressed:
                    onTap,

                child:
                    const Text(
                        "Beli"),
              ),
            )
          ],
        ),
      ),
    );
  }

  String format(num n) {

    return n
        .toStringAsFixed(0)
        .replaceAllMapped(

      RegExp(
          r'(\d{1,3})(?=(\d{3})+(?!\d))'),

      (m) =>
          '${m[1]}.',

    );
  }

  String _farmEmoji(
      String name) {

    if (name.contains("Padi"))
      return "🌾";

    if (name.contains("Cabai"))
      return "🌶";

    if (name.contains("Tomat"))
      return "🍅";

    if (name.contains("Jagung"))
      return "🌽";

    return "🌱";
  }
}