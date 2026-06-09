// lib/features/market/presentation/market_prices_screen.dart

import 'dart:ui';
import 'package:flutter/material.dart';

import '../../dashboard/presentation/farmer_bottom_navigation.dart';

class MarketPricesScreen extends StatefulWidget {
  const MarketPricesScreen({super.key});

  @override
  State<MarketPricesScreen> createState() =>
      _MarketPricesScreenState();
}

class _MarketPricesScreenState
    extends State<MarketPricesScreen> {
  String _selectedFilter = "Semua";

  final List<String> _filters = [
    "Semua",
    "Padi",
    "Cabai",
    "Sayur",
    "Buah",
  ];

  final List<Map<String, dynamic>>
      _commodities = [
    {
      'name': 'Padi (Gabah)',
      'price': 5200,
      'change': 2.5,
      'unit': 'kg',
      'trend': 'up',
      'category': 'Padi'
    },
    {
      'name': 'Cabai Merah',
      'price': 38000,
      'change': 5.2,
      'unit': 'kg',
      'trend': 'up',
      'category': 'Cabai'
    },
    {
      'name': 'Cabai Rawit',
      'price': 45000,
      'change': 3.8,
      'unit': 'kg',
      'trend': 'up',
      'category': 'Cabai'
    },
    {
      'name': 'Tomat',
      'price': 9500,
      'change': -1.2,
      'unit': 'kg',
      'trend': 'down',
      'category': 'Sayur'
    },
    {
      'name': 'Bawang Merah',
      'price': 31000,
      'change': 8.0,
      'unit': 'kg',
      'trend': 'up',
      'category': 'Sayur'
    },
    {
      'name': 'Bawang Putih',
      'price': 28000,
      'change': -2.0,
      'unit': 'kg',
      'trend': 'down',
      'category': 'Sayur'
    },
    {
      'name': 'Jagung',
      'price': 4600,
      'change': 1.5,
      'unit': 'kg',
      'trend': 'up',
      'category': 'Padi'
    },
    {
      'name': 'Kentang',
      'price': 15000,
      'change': -3.0,
      'unit': 'kg',
      'trend': 'down',
      'category': 'Sayur'
    },
    {
      'name': 'Apel',
      'price': 25000,
      'change': 2.0,
      'unit': 'kg',
      'trend': 'up',
      'category': 'Buah'
    },
    {
      'name': 'Jeruk',
      'price': 18000,
      'change': -1.5,
      'unit': 'kg',
      'trend': 'down',
      'category': 'Buah'
    },
  ];

  List<Map<String, dynamic>>
      get _filteredCommodities {
    if (_selectedFilter == "Semua") {
      return _commodities;
    }

    return _commodities
        .where(
          (item) =>
              item["category"] ==
              _selectedFilter,
        )
        .toList();
  }

  void _onBottomTap(int index) {
    switch (index) {
      case 0:
        Navigator.pushReplacementNamed(
          context,
          "/dashboard",
        );
        break;

      case 1:
        Navigator.pushReplacementNamed(
          context,
          "/buy-product",
        );
        break;

      case 2:
        Navigator.pushReplacementNamed(
          context,
          "/sell-product",
        );
        break;

      case 3:
        break;

      case 4:
        Navigator.pushReplacementNamed(
          context,
          "/notifications",
        );
        break;

      case 5:
        Navigator.pushReplacementNamed(
          context,
          "/profile",
        );
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      bottomNavigationBar:
          FarmerBottomNavigation(
        currentIndex: 3,
        onTap: _onBottomTap,
      ),

      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFFF4F7FB),
              Color(0xFFE8EDF5),
            ],
          ),
        ),

        child: SafeArea(
          child: Column(
            children: [
              _buildHeader(),

              _buildFilterChips(),

              Expanded(
                child:
                    RefreshIndicator(
                  onRefresh: () async {
                    setState(() {});
                  },

                  child:
                      ListView.builder(
                    padding:
                        const EdgeInsets.all(
                      16,
                    ),

                    itemCount:
                        _filteredCommodities
                            .length,

                    itemBuilder:
                        (context, index) {
                      final item =
                          _filteredCommodities[
                              index];

                      return _PriceCard(
                        item: item,
                      );
                    },
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding:
          const EdgeInsets.all(20),

      decoration:
          const BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Color(0xFF1B8F3E),
            Color(0xFF0A4A2A),
          ],
        ),

        borderRadius:
            BorderRadius.only(
          bottomLeft:
              Radius.circular(30),
          bottomRight:
              Radius.circular(30),
        ),
      ),

      child: Column(
        crossAxisAlignment:
            CrossAxisAlignment.start,

        children: [
          Row(
            children: [
              if (Navigator.canPop(
                  context))
                IconButton(
                  icon: const Icon(
                    Icons.arrow_back,
                    color: Colors.white,
                  ),
                  onPressed: () =>
                      Navigator.pop(
                    context,
                  ),
                ),

              const Expanded(
                child: Text(
                  "Harga Pasar Hari Ini",

                  style: TextStyle(
                    color:
                        Colors.white,
                    fontSize: 20,
                    fontWeight:
                        FontWeight.bold,
                  ),
                ),
              ),

              Container(
                padding:
                    const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),

                decoration:
                    BoxDecoration(
                  color: Colors.white
                      .withOpacity(
                    0.2,
                  ),

                  borderRadius:
                      BorderRadius.circular(
                    20,
                  ),
                ),

                child: Text(
                  _getLastUpdate(),

                  style:
                      const TextStyle(
                    color:
                        Colors.white70,
                    fontSize: 11,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChips() {
    return SingleChildScrollView(
      scrollDirection:
          Axis.horizontal,

      padding:
          const EdgeInsets.all(16),

      child: Row(
        children:
            _filters.map((filter) {
          final selected =
              _selectedFilter ==
                  filter;

          return Padding(
            padding:
                const EdgeInsets.only(
              right: 10,
            ),

            child: FilterChip(
              label: Text(filter),

              selected:
                  selected,

              onSelected: (_) {
                setState(() {
                  _selectedFilter =
                      filter;
                });
              },

              selectedColor:
                  const Color(
                0xFF1B8F3E,
              ),

              labelStyle:
                  TextStyle(
                color: selected
                    ? Colors.white
                    : Colors.black,
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  String _getLastUpdate() {
    final now = DateTime.now();

    return "${now.hour.toString().padLeft(2, "0")}:${now.minute.toString().padLeft(2, "0")}";
  }
}

class _PriceCard
    extends StatelessWidget {
  final Map<String, dynamic> item;

  const _PriceCard({
    required this.item,
  });

  @override
  Widget build(BuildContext context) {
    final up =
        item["trend"] == "up";

    return Card(
      margin:
          const EdgeInsets.only(
        bottom: 12,
      ),

      shape:
          RoundedRectangleBorder(
        borderRadius:
            BorderRadius.circular(
          16,
        ),
      ),

      child: ListTile(
        leading: CircleAvatar(
          backgroundColor:
              up
                  ? Colors.green
                      .withOpacity(
                      .12,
                    )
                  : Colors.red
                      .withOpacity(
                      .12,
                    ),

          child: Icon(
            up
                ? Icons
                    .trending_up
                : Icons
                    .trending_down,

            color: up
                ? Colors.green
                : Colors.red,
          ),
        ),

        title: Text(
          item["name"],
        ),

        subtitle: Text(
          "Per ${item["unit"]}",
        ),

        trailing: Column(
          mainAxisAlignment:
              MainAxisAlignment
                  .center,

          crossAxisAlignment:
              CrossAxisAlignment
                  .end,

          children: [
            Text(
              "Rp ${item["price"]}",

              style:
                  const TextStyle(
                fontWeight:
                    FontWeight.bold,
              ),
            ),

            Text(
              "${item["change"]}%",

              style: TextStyle(
                color: up
                    ? Colors.green
                    : Colors.red,
              ),
            ),
          ],
        ),
      ),
    );
  }
}