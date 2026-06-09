// lib/screens/market/marketplace_screen.dart
// KHUSUS HERD MOBILE APPS - Fokus Jual Ternak

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'dart:io';
import '../../providers/herd_provider.dart';
import '../../models/livestock_model.dart';

class MarketplaceScreen extends StatefulWidget {
  final int initialTab;
  
  const MarketplaceScreen({super.key, this.initialTab = 0});

  @override
  State<MarketplaceScreen> createState() => _MarketplaceScreenState();
}

class _MarketplaceScreenState extends State<MarketplaceScreen> {
  int _selectedTab = 0; // 0: Beli Ternak, 1: Jual Ternak, 2: Pesanan Saya
  int _selectedFilterTab = 0;
  bool _isAddingLivestock = false;
  
  File? _selectedImage;
  final ImagePicker _picker = ImagePicker();

  // Form untuk jual ternak
  Livestock? _selectedLivestock;
  final TextEditingController _livestockPriceController = TextEditingController();
  final TextEditingController _livestockDescController = TextEditingController();
  String _selectedLocation = "Jawa Timur";
  String _selectedDeliveryMethod = "Pickup";
  
  // Data ternak yang dijual (dari marketplace)
  final List<Map<String, dynamic>> _livestockForSale = [
    {
      "id": 1, 
      "tag_number": "SAPI-001", 
      "species": "Sapi", 
      "breed": "Limousin", 
      "price": 18500000, 
      "old_price": 20000000,
      "weight": 275,
      "age_months": 28,
      "gender": "female",
      "health_status": "healthy",
      "location": "Jawa Timur",
      "seller": "Peternak Maju",
      "seller_rating": 4.8,
      "image_url": null,
      "description": "Sapi Limousin sehat, sudah divaksin lengkap",
      "vaccinations": ["SE", "Anthrax", "Jembrana"]
    },
    {
      "id": 2, 
      "tag_number": "SAPI-002", 
      "species": "Sapi", 
      "breed": "Bali", 
      "price": 15000000, 
      "old_price": 16500000,
      "weight": 250,
      "age_months": 20,
      "gender": "female",
      "health_status": "healthy",
      "location": "Jawa Barat",
      "seller": "Farm Fresh",
      "seller_rating": 4.9,
      "image_url": null,
      "description": "Sapi Bali unggul, siap kawin",
      "vaccinations": ["SE", "Anthrax"]
    },
    {
      "id": 3, 
      "tag_number": "KMBG-001", 
      "species": "Kambing", 
      "breed": "Etawa", 
      "price": 3500000, 
      "old_price": 4000000,
      "weight": 42,
      "age_months": 12,
      "gender": "female",
      "health_status": "healthy",
      "location": "Jawa Tengah",
      "seller": "Peternak Etawa",
      "seller_rating": 4.7,
      "image_url": null,
      "description": "Kambing Etawa premium, produksi susu bagus",
      "vaccinations": ["Brucellosis", "PPR"]
    },
    {
      "id": 4, 
      "tag_number": "DOMBA-001", 
      "species": "Domba", 
      "breed": "Garut", 
      "price": 2200000, 
      "old_price": 2500000,
      "weight": 55,
      "age_months": 16,
      "gender": "male",
      "health_status": "sick",
      "location": "Jawa Barat",
      "seller": "Domba Garut Farm",
      "seller_rating": 4.5,
      "image_url": null,
      "description": "Domba Garut, sedang dalam masa pemulihan",
      "vaccinations": ["PPR"]
    },
  ];

  final List<Map<String, dynamic>> _myListings = [];
  final List<Map<String, dynamic>> _orders = [];

  final List<String> _filterCategories = ["Semua", "Sapi", "Kambing", "Domba", "Unggas"];
  final List<String> _locations = [
    "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Jambi",
    "Sumatera Selatan", "Bengkulu", "Lampung", "Kep. Bangka Belitung",
    "Kep. Riau", "DKI Jakarta", "Jawa Barat", "Jawa Tengah",
    "DI Yogyakarta", "Jawa Timur", "Banten", "Bali", "Nusa Tenggara Barat",
    "Nusa Tenggara Timur", "Kalimantan Barat", "Kalimantan Tengah",
    "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara",
    "Sulawesi Utara", "Sulawesi Tengah", "Sulawesi Selatan", "Sulawesi Tenggara",
    "Gorontalo", "Sulawesi Barat", "Maluku", "Maluku Utara", "Papua Barat", "Papua"
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<HerdProvider>().loadHerdList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F8F2),
      appBar: AppBar(
        title: Row(
          children: [
            const Icon(Icons.pets, color: Colors.green, size: 24),
            const SizedBox(width: 8),
            Text(
              _selectedTab == 0 ? "Beli Ternak" : (_selectedTab == 1 ? "Jual Ternak" : "Pesanan Saya"),
              style: GoogleFonts.poppins(
                fontWeight: FontWeight.bold, 
                color: Colors.green,
                fontSize: 18,
              ),
            ),
          ],
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: false,
        actions: [
          if (_selectedTab == 0) 
            IconButton(
              icon: const Icon(Icons.search_outlined, color: Colors.green),
              onPressed: () => _showSearchDialog(),
            ),
          IconButton(
            icon: const Icon(Icons.notifications_none, color: Colors.green),
            onPressed: () {},
          ),
        ],
      ),
      body: _selectedTab == 0 
          ? _buildBuyTab() 
          : (_selectedTab == 1 
              ? (_isAddingLivestock ? _buildSellLivestockForm() : _buildSellTab())
              : _buildOrdersTab()),
      bottomNavigationBar: _buildBottomNavBar(),
      floatingActionButton: _selectedTab == 1 && !_isAddingLivestock
          ? FloatingActionButton(
              onPressed: () => setState(() { _isAddingLivestock = true; _selectedLivestock = null; }),
              backgroundColor: Colors.green,
              child: const Icon(Icons.add),
            )
          : null,
    );
  }

  Widget _buildBottomNavBar() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
      ),
      child: BottomNavigationBar(
        currentIndex: _selectedTab,
        onTap: (index) {
          setState(() {
            _selectedTab = index;
            _isAddingLivestock = false;
          });
        },
        type: BottomNavigationBarType.fixed,
        selectedItemColor: Colors.green,
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.storefront), label: 'Beli'),
          BottomNavigationBarItem(icon: Icon(Icons.sell), label: 'Jual'),
          BottomNavigationBarItem(icon: Icon(Icons.shopping_bag), label: 'Pesanan'),
        ],
      ),
    );
  }

  // ========================================
  // TAB 1: BELI TERNAK
  // ========================================
  
  Widget _buildBuyTab() {
    final filteredLivestock = _selectedFilterTab == 0 
        ? _livestockForSale 
        : _livestockForSale.where((l) => l["species"] == _filterCategories[_selectedFilterTab]).toList();
    
    return Column(
      children: [
        _buildCategoryFilterTabs(),
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: filteredLivestock.length,
            itemBuilder: (context, index) => _buildLivestockCard(filteredLivestock[index]),
          ),
        ),
      ],
    );
  }

  Widget _buildCategoryFilterTabs() {
    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(28),
      ),
      child: Row(
        children: _filterCategories.asMap().entries.map((entry) {
          return _buildFilterTab(entry.value, entry.key);
        }).toList(),
      ),
    );
  }

  Widget _buildFilterTab(String title, int tabIndex) {
    final isSelected = _selectedFilterTab == tabIndex;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _selectedFilterTab = tabIndex),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? Colors.green : Colors.transparent,
            borderRadius: BorderRadius.circular(24),
          ),
          child: Text(
            title,
            textAlign: TextAlign.center,
            style: GoogleFonts.poppins(
              color: isSelected ? Colors.white : Colors.grey[600],
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
              fontSize: 13,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLivestockCard(Map<String, dynamic> livestock) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    color: Colors.green.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Icon(
                    livestock["gender"] == "male" ? Icons.male : Icons.female,
                    size: 50,
                    color: Colors.green,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            livestock["tag_number"],
                            style: GoogleFonts.poppins(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: livestock["health_status"] == "healthy" 
                                  ? Colors.green.withOpacity(0.1) 
                                  : Colors.red.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              livestock["health_status"] == "healthy" ? "Sehat" : "Sakit",
                              style: GoogleFonts.poppins(
                                fontSize: 10,
                                color: livestock["health_status"] == "healthy" ? Colors.green : Colors.red,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                      Text(
                        "${livestock["species"]} - ${livestock["breed"]}",
                        style: GoogleFonts.poppins(
                          fontSize: 13,
                          color: Colors.grey[600],
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(Icons.fitness_center, size: 14, color: Colors.grey[500]),
                          const SizedBox(width: 4),
                          Text(
                            "${livestock["weight"]} kg",
                            style: GoogleFonts.poppins(fontSize: 12),
                          ),
                          const SizedBox(width: 12),
                          Icon(Icons.cake, size: 14, color: Colors.grey[500]),
                          const SizedBox(width: 4),
                          Text(
                            "${livestock["age_months"]} bulan",
                            style: GoogleFonts.poppins(fontSize: 12),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Icon(Icons.star, size: 14, color: Colors.amber),
                          const SizedBox(width: 4),
                          Text(
                            "${livestock["seller_rating"]}",
                            style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w600),
                          ),
                          const SizedBox(width: 8),
                          Icon(Icons.location_on, size: 12, color: Colors.grey[500]),
                          const SizedBox(width: 4),
                          Text(
                            livestock["location"],
                            style: GoogleFonts.poppins(fontSize: 11, color: Colors.grey[500]),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      _formatCurrency(livestock["price"]),
                      style: GoogleFonts.poppins(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: Colors.green,
                      ),
                    ),
                    if (livestock["old_price"] != null)
                      Text(
                        _formatCurrency(livestock["old_price"]),
                        style: GoogleFonts.poppins(
                          fontSize: 11,
                          color: Colors.grey,
                          decoration: TextDecoration.lineThrough,
                        ),
                      ),
                  ],
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => _showLivestockDetail(livestock),
                    icon: const Icon(Icons.info_outline, size: 18),
                    label: const Text("Detail"),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.green,
                      side: const BorderSide(color: Colors.green),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _showOrderDialog(livestock),
                    icon: const Icon(Icons.shopping_cart, size: 18),
                    label: const Text("Beli"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ========================================
  // TAB 2: JUAL TERNAK
  // ========================================
  
  Widget _buildSellTab() {
    return Consumer<HerdProvider>(
      builder: (context, provider, _) {
        final myLivestock = provider.herdList.where((l) => l.status == 'active').toList();
        
        if (myLivestock.isEmpty && _myListings.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.pets, size: 80, color: Colors.grey[300]),
                const SizedBox(height: 16),
                Text(
                  "Belum ada ternak yang dijual",
                  style: GoogleFonts.poppins(fontSize: 16, color: Colors.grey[600]),
                ),
                const SizedBox(height: 8),
                Text(
                  "Tambahkan ternak dari menu Ternak",
                  style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey[500]),
                ),
                const SizedBox(height: 24),
                ElevatedButton.icon(
                  onPressed: () {
                    Navigator.pushNamed(context, '/ternak');
                  },
                  icon: const Icon(Icons.add),
                  label: const Text("Kelola Ternak"),
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                ),
              ],
            ),
          );
        }
        
        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: _myListings.length,
          itemBuilder: (context, index) => _buildMyListingCard(_myListings[index]),
        );
      },
    );
  }

  Widget _buildSellLivestockForm() {
    return Consumer<HerdProvider>(
      builder: (context, provider, _) {
        final availableLivestock = provider.herdList.where((l) => l.status == 'active').toList();
        
        return SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.green.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: const BoxDecoration(
                        color: Colors.green,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.sell, color: Colors.white, size: 24),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Jual Ternak',
                            style: GoogleFonts.poppins(
                              fontWeight: FontWeight.bold,
                              fontSize: 18,
                              color: Colors.green,
                            ),
                          ),
                          Text(
                            'Pilih ternak yang ingin dijual',
                            style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey[600]),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Pilih Ternak
              Text(
                'Pilih Ternak',
                style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 14),
              ),
              const SizedBox(height: 8),
              
              if (availableLivestock.isEmpty)
                Container(
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    children: [
                      Icon(Icons.pets, size: 48, color: Colors.grey[400]),
                      const SizedBox(height: 12),
                      Text(
                        'Belum ada ternak',
                        style: GoogleFonts.poppins(fontSize: 14, color: Colors.grey[600]),
                      ),
                      const SizedBox(height: 8),
                      ElevatedButton(
                        onPressed: () {
                          Navigator.pushNamed(context, '/ternak');
                        },
                        child: const Text('Tambahkan Ternak'),
                      ),
                    ],
                  ),
                )
              else
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: DropdownButtonFormField<Livestock>(
                    decoration: InputDecoration(
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                    hint: const Text('Pilih Ternak'),
                    value: _selectedLivestock,
                    items: availableLivestock.map((livestock) {
                      return DropdownMenuItem(
                        value: livestock,
                        child: Text("${livestock.tagNumber} - ${livestock.species} ${livestock.breed}"),
                      );
                    }).toList(),
                    onChanged: (value) {
                      setState(() {
                        _selectedLivestock = value;
                        _livestockPriceController.text = value?.currentPrice?.toString() ?? '';
                      });
                    },
                  ),
                ),

              const SizedBox(height: 16),
              
              // Harga Jual
              _buildTextField("Harga Jual *", _livestockPriceController, "Contoh: 18500000", Icons.attach_money, keyboardType: TextInputType.number),
              
              const SizedBox(height: 16),
              
              // Lokasi
              _buildLocationDropdown(),
              
              const SizedBox(height: 16),
              
              // Metode Pengiriman
              _buildDeliveryMethod(),
              
              const SizedBox(height: 16),
              
              // Deskripsi
              _buildTextField("Deskripsi", _livestockDescController, "Deskripsikan ternak Anda...", Icons.description, maxLines: 3),
              
              const SizedBox(height: 24),
              
              // Tombol Aksi
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        setState(() {
                          _isAddingLivestock = false;
                          _selectedLivestock = null;
                          _livestockPriceController.clear();
                          _livestockDescController.clear();
                        });
                      },
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text("Batal"),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: _saveLivestockListing,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text("Jual Sekarang"),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildMyListingCard(Map<String, dynamic> listing) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          ListTile(
            leading: Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: Colors.green.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.pets, color: Colors.green),
            ),
            title: Text(
              listing["tag_number"],
              style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
            ),
            subtitle: Text("${listing["species"]} - ${listing["breed"]}"),
            trailing: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  _formatCurrency(listing["price"]),
                  style: GoogleFonts.poppins(
                    fontWeight: FontWeight.bold,
                    color: Colors.green,
                  ),
                ),
                Text(
                  listing["status"] == "active" ? "Aktif" : "Terjual",
                  style: GoogleFonts.poppins(
                    fontSize: 10,
                    color: listing["status"] == "active" ? Colors.green : Colors.grey,
                  ),
                ),
              ],
            ),
          ),
          ButtonBar(
            children: [
              TextButton.icon(
                onPressed: () => _editListing(listing),
                icon: const Icon(Icons.edit, size: 18),
                label: const Text("Edit"),
              ),
              TextButton.icon(
                onPressed: () => _deleteListing(listing),
                icon: const Icon(Icons.delete_outline, size: 18, color: Colors.red),
                label: const Text("Hapus", style: TextStyle(color: Colors.red)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ========================================
  // TAB 3: PESANAN SAYA
  // ========================================
  
  Widget _buildOrdersTab() {
    if (_orders.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.shopping_bag_outlined, size: 80, color: Colors.grey[300]),
            const SizedBox(height: 16),
            Text(
              "Belum ada pesanan",
              style: GoogleFonts.poppins(fontSize: 16, color: Colors.grey[600]),
            ),
            const SizedBox(height: 8),
            Text(
              "Mulai beli ternak sekarang",
              style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey[500]),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => setState(() => _selectedTab = 0),
              style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
              child: const Text("Cari Ternak"),
            ),
          ],
        ),
      );
    }
    
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _orders.length,
      itemBuilder: (context, index) => _buildOrderCard(_orders[index]),
    );
  }

  Widget _buildOrderCard(Map<String, dynamic> order) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: ListTile(
        leading: Container(
          width: 50,
          height: 50,
          decoration: BoxDecoration(
            color: Colors.green.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: const Icon(Icons.receipt, color: Colors.green),
        ),
        title: Text(order["product_name"]),
        subtitle: Text("Order ID: ${order["order_id"]}"),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              _formatCurrency(order["total"]),
              style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: order["status"] == "pending" ? Colors.orange.withOpacity(0.1) : Colors.green.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                order["status"] == "pending" ? "Menunggu" : "Selesai",
                style: GoogleFonts.poppins(fontSize: 10, fontWeight: FontWeight.w600),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ========================================
  // DIALOG & HELPER FUNCTIONS
  // ========================================

  Widget _buildTextField(String label, TextEditingController controller, String hint, IconData icon, 
      {TextInputType keyboardType = TextInputType.text, int maxLines = 1}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 13)),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          keyboardType: keyboardType,
          maxLines: maxLines,
          decoration: InputDecoration(
            hintText: hint,
            prefixIcon: Icon(icon, color: Colors.green),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
      ],
    );
  }

  Widget _buildLocationDropdown() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("Lokasi *", style: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 13)),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey[300]!),
            borderRadius: BorderRadius.circular(12),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: _selectedLocation,
              isExpanded: true,
              icon: const Icon(Icons.arrow_drop_down, color: Colors.green),
              items: _locations.map((location) {
                return DropdownMenuItem(value: location, child: Text(location));
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _selectedLocation = value!;
                });
              },
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDeliveryMethod() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("Metode Pengiriman", style: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 13)),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: RadioListTile<String>(
                title: const Text("Pickup"),
                value: "Pickup",
                groupValue: _selectedDeliveryMethod,
                onChanged: (value) => setState(() => _selectedDeliveryMethod = value!),
                activeColor: Colors.green,
                contentPadding: EdgeInsets.zero,
              ),
            ),
            Expanded(
              child: RadioListTile<String>(
                title: const Text("Delivery"),
                value: "Delivery",
                groupValue: _selectedDeliveryMethod,
                onChanged: (value) => setState(() => _selectedDeliveryMethod = value!),
                activeColor: Colors.green,
                contentPadding: EdgeInsets.zero,
              ),
            ),
          ],
        ),
      ],
    );
  }

  void _saveLivestockListing() {
    if (_selectedLivestock == null) {
      _showErrorDialog("Pilih ternak terlebih dahulu");
      return;
    }
    
    if (_livestockPriceController.text.isEmpty) {
      _showErrorDialog("Masukkan harga jual");
      return;
    }
    
    final newListing = {
      "id": _myListings.length + 1,
      "tag_number": _selectedLivestock!.tagNumber,
      "species": _selectedLivestock!.species,
      "breed": _selectedLivestock!.breed,
      "price": int.parse(_livestockPriceController.text.replaceAll('.', '')),
      "weight": _selectedLivestock!.weight,
      "age_months": _selectedLivestock!.ageInMonths,
      "gender": _selectedLivestock!.gender,
      "health_status": _selectedLivestock!.healthStatus,
      "location": _selectedLocation,
      "seller": "Peternak Saya",
      "seller_rating": 5.0,
      "description": _livestockDescController.text.isEmpty ? "Ternak sehat siap dijual" : _livestockDescController.text,
      "status": "active",
      "created_at": DateTime.now().toIso8601String(),
    };
    
    setState(() {
      _myListings.insert(0, newListing);
      _isAddingLivestock = false;
      _selectedLivestock = null;
      _livestockPriceController.clear();
      _livestockDescController.clear();
    });
    
    _showSuccessDialog("✓ Ternak berhasil dijual!");
  }

  void _showLivestockDetail(Map<String, dynamic> livestock) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 50,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    color: Colors.green.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Icon(
                    livestock["gender"] == "male" ? Icons.male : Icons.female,
                    size: 30,
                    color: Colors.green,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        livestock["tag_number"],
                        style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        "${livestock["species"]} - ${livestock["breed"]}",
                        style: GoogleFonts.poppins(fontSize: 14, color: Colors.grey[600]),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            _buildDetailRow(Icons.fitness_center, "Berat", "${livestock["weight"]} kg"),
            _buildDetailRow(Icons.cake, "Umur", "${livestock["age_months"]} bulan"),
            _buildDetailRow(Icons.medical_services, "Kesehatan", livestock["health_status"] == "healthy" ? "Sehat" : "Sakit"),
            _buildDetailRow(Icons.location_on, "Lokasi", livestock["location"]),
            _buildDetailRow(Icons.verified, "Vaksinasi", (livestock["vaccinations"] as List).join(", ")),
            const SizedBox(height: 16),
            Text(
              "Deskripsi",
              style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            Text(livestock["description"], style: GoogleFonts.poppins(fontSize: 13)),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(ctx);
                  _showOrderDialog(livestock);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: Text(
                  "Beli - ${_formatCurrency(livestock["price"])}",
                  style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
                ),
              ),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Icon(icon, size: 18, color: Colors.green),
          const SizedBox(width: 8),
          SizedBox(
            width: 80,
            child: Text(label, style: GoogleFonts.poppins(fontSize: 13, color: Colors.grey[600])),
          ),
          Text(":", style: GoogleFonts.poppins(fontSize: 13, color: Colors.grey[600])),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              value,
              style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w500),
            ),
          ),
        ],
      ),
    );
  }

  void _showOrderDialog(Map<String, dynamic> livestock) {
    int quantity = 1;
    final totalPrice = livestock["price"] * quantity;
    
    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setState) {
          return AlertDialog(
            title: Text("Beli ${livestock["tag_number"]}"),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  "${livestock["species"]} - ${livestock["breed"]}",
                  style: GoogleFonts.poppins(),
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text("Jumlah"),
                    Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.remove, size: 20),
                          onPressed: () {
                            if (quantity > 1) {
                              setState(() => quantity--);
                            }
                          },
                        ),
                        Text(quantity.toString(), style: GoogleFonts.poppins(fontSize: 16)),
                        IconButton(
                          icon: const Icon(Icons.add, size: 20),
                          onPressed: () => setState(() => quantity++),
                        ),
                      ],
                    ),
                  ],
                ),
                const Divider(),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text("Total", style: GoogleFonts.poppins(fontWeight: FontWeight.bold)),
                    Text(
                      _formatCurrency(totalPrice),
                      style: GoogleFonts.poppins(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: Colors.green,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text("Batal"),
              ),
              ElevatedButton(
                onPressed: () {
                  Navigator.pop(ctx);
                  _showSuccessDialog("Pesanan berhasil dibuat! Penjual akan menghubungi Anda.");
                  _addOrder(livestock, quantity, totalPrice);
                },
                style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                child: const Text("Beli Sekarang"),
              ),
            ],
          );
        },
      ),
    );
  }

  void _addOrder(Map<String, dynamic> livestock, int quantity, int totalPrice) {
    final newOrder = {
      "order_id": "ORD-${DateTime.now().millisecondsSinceEpoch}",
      "product_name": livestock["tag_number"],
      "product_detail": "${livestock["species"]} - ${livestock["breed"]}",
      "quantity": quantity,
      "total": totalPrice,
      "status": "pending",
      "created_at": DateTime.now().toIso8601String(),
    };
    
    setState(() {
      _orders.insert(0, newOrder);
    });
  }

  void _editListing(Map<String, dynamic> listing) {
    _livestockPriceController.text = listing["price"].toString();
    _livestockDescController.text = listing["description"] ?? "";
    _selectedLocation = listing["location"];
    
    setState(() {
      _isAddingLivestock = true;
    });
  }

  void _deleteListing(Map<String, dynamic> listing) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text("Hapus Listing"),
        content: Text("Hapus ${listing["tag_number"]} dari daftar jual?"),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text("Batal")),
          TextButton(
            onPressed: () {
              setState(() {
                _myListings.remove(listing);
              });
              Navigator.pop(ctx);
              _showSuccessDialog("Listing dihapus");
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text("Hapus"),
          ),
        ],
      ),
    );
  }

  void _showSearchDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text("Cari Ternak"),
        content: TextField(
          decoration: InputDecoration(
            hintText: "Cari berdasarkan tag, spesies, atau breed",
            prefixIcon: const Icon(Icons.search),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text("Batal")),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
            child: const Text("Cari"),
          ),
        ],
      ),
    );
  }

  void _showSuccessDialog(String message) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Icon(Icons.check_circle, color: Colors.green, size: 50),
        content: Text(message),
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
            child: const Text("OK"),
          ),
        ],
      ),
    );
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Icon(Icons.error_outline, color: Colors.red, size: 50),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text("OK"),
          ),
        ],
      ),
    );
  }

  String _formatCurrency(int amount) {
    return "Rp ${amount.toString().replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}";
  }
}