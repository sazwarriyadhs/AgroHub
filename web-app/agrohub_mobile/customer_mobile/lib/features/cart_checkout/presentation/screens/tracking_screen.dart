import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

class TrackingScreen extends StatelessWidget {
  const TrackingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Live Tracking'),
        backgroundColor: const Color(0xFF2E7D32),
      ),
      body: Column(
        children: [
          Expanded(
            flex: 3,
            child: FlutterMap(
              options: MapOptions(
                initialCenter: LatLng(-6.200000, 106.816666), // Jakarta
                initialZoom: 13,
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'com.agrohub.customer',
                ),
                MarkerLayer(
                  markers: [
                    Marker(
                      point: LatLng(-6.200000, 106.816666),
                      width: 80,
                      height: 80,
                      child: const Icon(Icons.local_shipping, color: Colors.orange, size: 40),
                    ),
                    Marker(
                      point: LatLng(-6.190000, 106.826666),
                      width: 80,
                      height: 80,
                      child: const Icon(Icons.location_on, color: Colors.green, size: 40),
                    ),
                  ],
                ),
              ],
            ),
          ),
          Expanded(
            flex: 1,
            child: Container(
              padding: const EdgeInsets.all(16),
              color: Colors.white,
              child: Column(
                children: [
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Driver: Bambang', style: TextStyle(fontWeight: FontWeight.bold)),
                      Text('ETA: 15 menit', style: TextStyle(color: Colors.green)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Row(
                    children: [
                      Icon(Icons.motorcycle, size: 20),
                      SizedBox(width: 8),
                      Text('Plat: B 1234 XYZ'),
                    ],
                  ),
                  const SizedBox(height: 8),
                  ElevatedButton(
                    onPressed: null,
                    style: ElevatedButton.styleFrom(backgroundColor: Color(0xFFFF9800)),
                    child: Text('Chat Driver'),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
