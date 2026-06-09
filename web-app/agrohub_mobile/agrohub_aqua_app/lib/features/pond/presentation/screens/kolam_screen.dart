// lib/features/pond/presentation/screens/kolam_screen.dart

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:agrohub_aqua_app/app/theme/app_theme.dart';
import '../../../dashboard/presentation/screens/aqua_dashboard.dart';

class KolamScreen extends StatefulWidget {
  const KolamScreen({super.key});

  @override
  State<KolamScreen> createState() => _KolamScreenState();
}

class _KolamScreenState extends State<KolamScreen> {
  bool _isLoading = false;
  List<Map<String, dynamic>> _ponds = [];
  
  // Form controllers
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _sizeController = TextEditingController();
  final TextEditingController _fishTypeController = TextEditingController();
  final TextEditingController _fishCountController = TextEditingController();
  final TextEditingController _depthController = TextEditingController();
  
  String _selectedStatus = "Aktif";
  bool _isAddingPond = false;
  String? _editingId;

  final List<String> _statusOptions = ["Aktif", "Maintenance", "Panen", "Kosong"];
  final List<String> _fishTypes = [
    "Lele", "Nila", "Gurame", "Patin", "Mas", "Mujair", "Bawal", "Paus"
  ];

  @override
  void initState() {
    super.initState();
    _loadPonds();
  }

  Future<void> _loadPonds() async {
    setState(() => _isLoading = true);
    
    // Simulasi data dari API
    await Future.delayed(const Duration(milliseconds: 500));
    
    setState(() {
      _ponds = [
        {
          "id": "1",
          "name": "Kolam Lele 1",
          "size": 100,
          "unit": "m²",
          "fishType": "Lele",
          "fishCount": 5000,
          "depth": 1.2,
          "status": "Aktif",
          "waterQuality": "Optimal",
          "createdAt": "2024-01-15",
        },
        {
          "id": "2",
          "name": "Kolam Nila 1",
          "size": 150,
          "unit": "m²",
          "fishType": "Nila",
          "fishCount": 3000,
          "depth": 1.5,
          "status": "Aktif",
          "waterQuality": "Good",
          "createdAt": "2024-02-10",
        },
        {
          "id": "3",
          "name": "Kolam Gurame",
          "size": 80,
          "unit": "m²",
          "fishType": "Gurame",
          "fishCount": 2000,
          "depth": 1.0,
          "status": "Maintenance",
          "waterQuality": "Perhatian",
          "createdAt": "2024-03-05",
        },
      ];
      _isLoading = false;
    });
  }

  void _showAddPondDialog({Map<String, dynamic>? pond}) {
    _isAddingPond = true;
    _editingId = pond?["id"];
    
    if (pond != null) {
      _nameController.text = pond["name"];
      _sizeController.text = pond["size"].toString();
      _fishTypeController.text = pond["fishType"];
      _fishCountController.text = pond["fishCount"].toString();
      _depthController.text = pond["depth"].toString();
      _selectedStatus = pond["status"];
    } else {
      _clearForm();
    }
    
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: Text(
          pond == null ? "Tambah Kolam Baru" : "Edit Kolam",
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
        ),
        content: SizedBox(
          width: double.maxFinite,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildTextField(_nameController, "Nama Kolam", Icons.set_meal),
                const SizedBox(height: 12),
                _buildTextField(_sizeController, "Ukuran (m²)", Icons.crop_square, keyboardType: TextInputType.number),
                const SizedBox(height: 12),
                _buildDropdown(_fishTypes, _fishTypeController.text, "Jenis Ikan", Icons.set_meal),
                const SizedBox(height: 12),
                _buildTextField(_fishCountController, "Jumlah Ikan", Icons.people, keyboardType: TextInputType.number),
                const SizedBox(height: 12),
                _buildTextField(_depthController, "Kedalaman (meter)", Icons.height, keyboardType: TextInputType.number),
                const SizedBox(height: 12),
                _buildStatusDropdown(),
              ],
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              _clearForm();
            },
            child: Text("Batal", style: GoogleFonts.poppins(color: Colors.grey)),
          ),
          ElevatedButton(
            onPressed: () {
              _savePond(ctx);
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primaryColor),
            child: Text(pond == null ? "Simpan" : "Update", style: GoogleFonts.poppins(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String label, IconData icon, {TextInputType keyboardType = TextInputType.text}) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, color: AppTheme.primaryColor),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  Widget _buildDropdown(List<String> items, String value, String label, IconData icon) {
    return DropdownButtonFormField<String>(
      value: value.isNotEmpty ? value : null,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, color: AppTheme.primaryColor),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      ),
      items: items.map((item) {
        return DropdownMenuItem(value: item, child: Text(item));
      }).toList(),
      onChanged: (newValue) {
        setState(() {
          _fishTypeController.text = newValue!;
        });
      },
    );
  }

  Widget _buildStatusDropdown() {
    return DropdownButtonFormField<String>(
      value: _selectedStatus,
      decoration: InputDecoration(
        labelText: "Status",
        prefixIcon: Icon(Icons.info, color: AppTheme.primaryColor),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      ),
      items: _statusOptions.map((status) {
        return DropdownMenuItem(value: status, child: Text(status));
      }).toList(),
      onChanged: (newValue) {
        setState(() {
          _selectedStatus = newValue!;
        });
      },
    );
  }

  void _savePond(BuildContext ctx) {
    if (_nameController.text.isEmpty || _sizeController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Nama kolam dan ukuran wajib diisi")),
      );
      return;
    }
    
    final newPond = {
      "id": _editingId ?? DateTime.now().millisecondsSinceEpoch.toString(),
      "name": _nameController.text,
      "size": double.parse(_sizeController.text),
      "unit": "m²",
      "fishType": _fishTypeController.text,
      "fishCount": int.parse(_fishCountController.text.isEmpty ? "0" : _fishCountController.text),
      "depth": double.parse(_depthController.text.isEmpty ? "0" : _depthController.text),
      "status": _selectedStatus,
      "waterQuality": "Normal",
      "createdAt": DateTime.now().toString().split(" ")[0],
    };
    
    setState(() {
      if (_editingId == null) {
        _ponds.add(newPond);
      } else {
        final index = _ponds.indexWhere((p) => p["id"] == _editingId);
        if (index != -1) {
          _ponds[index] = newPond;
        }
      }
    });
    
    Navigator.pop(ctx);
    _clearForm();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(_editingId == null ? "Kolam berhasil ditambahkan" : "Kolam berhasil diupdate"),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _deletePond(String id) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: Text("Hapus Kolam", style: GoogleFonts.poppins(fontWeight: FontWeight.bold)),
        content: Text("Yakin ingin menghapus kolam ini?", style: GoogleFonts.poppins()),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text("Batal", style: GoogleFonts.poppins(color: Colors.grey)),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _ponds.removeWhere((p) => p["id"] == id);
              });
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text("Kolam berhasil dihapus")),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: Text("Hapus", style: GoogleFonts.poppins(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _clearForm() {
    _nameController.clear();
    _sizeController.clear();
    _fishTypeController.clear();
    _fishCountController.clear();
    _depthController.clear();
    _selectedStatus = "Aktif";
    _editingId = null;
    _isAddingPond = false;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF3F6FB),
      appBar: AppBar(
        title: Text(
          "Manajemen Kolam",
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.bold,
            color: AppTheme.primaryColor,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: AppTheme.primaryColor),
          onPressed: () => Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (_) => const AquaDashboard()),
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadPonds,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadPonds,
              child: _ponds.isEmpty
                  ? _buildEmptyState()
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: _ponds.length,
                      itemBuilder: (context, index) => _buildPondCard(_ponds[index]),
                    ),
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddPondDialog(),
        backgroundColor: AppTheme.primaryColor,
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.set_meal, size: 80, color: Colors.grey[300]),
          const SizedBox(height: 16),
          Text(
            "Belum ada kolam",
            style: GoogleFonts.poppins(fontSize: 16, color: Colors.grey[600]),
          ),
          const SizedBox(height: 8),
          Text(
            "Tekan tombol + untuk menambah kolam",
            style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey[500]),
          ),
        ],
      ),
    );
  }

  Widget _buildPondCard(Map<String, dynamic> pond) {
    Color statusColor;
    switch (pond["status"]) {
      case "Aktif":
        statusColor = Colors.green;
        break;
      case "Maintenance":
        statusColor = Colors.orange;
        break;
      case "Panen":
        statusColor = Colors.blue;
        break;
      default:
        statusColor = Colors.grey;
    }
    
    Color waterColor;
    switch (pond["waterQuality"]) {
      case "Optimal":
        waterColor = Colors.green;
        break;
      case "Good":
        waterColor = Colors.blue;
        break;
      default:
        waterColor = Colors.orange;
    }
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        color: AppTheme.primaryColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Icon(Icons.set_meal, color: AppTheme.primaryColor, size: 28),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            pond["name"],
                            style: GoogleFonts.poppins(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              Icon(Icons.location_on, size: 14, color: Colors.grey[500]),
                              const SizedBox(width: 4),
                              Text(
                                "${pond["size"]} ${pond["unit"]} • Kedalaman ${pond["depth"]}m",
                                style: GoogleFonts.poppins(fontSize: 11, color: Colors.grey[600]),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: statusColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        pond["status"],
                        style: GoogleFonts.poppins(
                          fontSize: 10,
                          color: statusColor,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                const Divider(),
                const SizedBox(height: 12),
                Row(
                  children: [
                    _buildInfoChip(Icons.set_meal, pond["fishType"], "Jenis Ikan"),
                    const SizedBox(width: 12),
                    _buildInfoChip(Icons.people, "${pond["fishCount"]}", "Ekor"),
                    const SizedBox(width: 12),
                    _buildInfoChip(Icons.water_drop, pond["waterQuality"], "Kualitas Air", color: waterColor),
                  ],
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              border: Border(top: BorderSide(color: Colors.grey[100]!)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => _showAddPondDialog(pond: pond),
                    icon: const Icon(Icons.edit, size: 18),
                    label: Text("Edit"),
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: AppTheme.primaryColor),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => _deletePond(pond["id"]),
                    icon: const Icon(Icons.delete, size: 18, color: Colors.red),
                    label: Text("Hapus", style: TextStyle(color: Colors.red)),
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: Colors.red),
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

  Widget _buildInfoChip(IconData icon, String label, String title, {Color color = Colors.grey}) {
    return Expanded(
      child: Row(
        children: [
          Icon(icon, size: 14, color: color),
          const SizedBox(width: 4),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: GoogleFonts.poppins(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Text(
                  title,
                  style: GoogleFonts.poppins(
                    fontSize: 9,
                    color: Colors.grey[500],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}



