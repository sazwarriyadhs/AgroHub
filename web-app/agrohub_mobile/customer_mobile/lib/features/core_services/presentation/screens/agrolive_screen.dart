import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:youtube_player_iframe/youtube_player_iframe.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'dart:async';

class AgroLiveScreen extends StatefulWidget {
  const AgroLiveScreen({super.key});

  @override
  State<AgroLiveScreen> createState() => _AgroLiveScreenState();
}

class _AgroLiveScreenState extends State<AgroLiveScreen> with TickerProviderStateMixin {
  late YoutubePlayerController _youtubeController;
  late ScrollController _scrollController;
  late AnimationController _pulseController;
  late AnimationController _floatController;
  
  int _cartItemCount = 0;
  int _viewerCount = 1245;
  int _totalSold = 342;
  int _likeCount = 128;
  bool _isFollowing = false;
  bool _isLiked = false;
  bool _isMuted = false;
  bool _isChatExpanded = true;
  bool _isPlayerReady = false;

  final TextEditingController _chatController = TextEditingController();

  static const Color primaryGreen900 = Color(0xFF1B5E20);
  static const Color primaryGreen700 = Color(0xFF2E7D32);
  static const Color primaryGreen500 = Color(0xFF43A047);

  final List<Map<String, String>> _chatMessages = [
    {'name': 'Siti Nurhayati', 'message': 'Wah segar banget 😍', 'isHost': 'false', 'avatar': 'SN', 'time': '12:04'},
    {'name': 'Andi Wijaya', 'message': 'Ready stok hari ini?', 'isHost': 'false', 'avatar': 'AW', 'time': '12:05'},
    {'name': 'Dewi Lestari', 'message': 'Berapa harga untuk 1 kg?', 'isHost': 'false', 'avatar': 'DL', 'time': '12:06'},
    {'name': 'Tani Makmur Farm', 'message': 'Ready kak! Harga spesial hari ini 🥕', 'isHost': 'true', 'avatar': '🌾', 'time': '12:07'},
    {'name': 'Budi Santoso', 'message': 'Pengiriman ke luar kota?', 'isHost': 'false', 'avatar': 'BS', 'time': '12:08'},
    {'name': 'Tani Makmur Farm', 'message': 'Bisa kak, gratis ongkir untuk pembelian di atas 100k', 'isHost': 'true', 'avatar': '🌾', 'time': '12:09'},
  ];

  final List<Map<String, dynamic>> liveProducts = [
    {
      "id": 1,
      "name": "Tomat Segar Premium",
      "price": 12000,
      "oldPrice": 16000,
      "discount": "-25%",
      "emoji": "🍅",
      "unit": "kg",
      "sold": 89,
      "stock": 250,
      "image": "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=600",
    },
    {
      "id": 2,
      "name": "Cabai Merah Keriting",
      "price": 28000,
      "oldPrice": 36000,
      "discount": "-22%",
      "emoji": "🌶️",
      "unit": "kg",
      "sold": 156,
      "stock": 180,
      "image": "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?q=80&w=600",
    },
    {
      "id": 3,
      "name": "Selada Hidroponik",
      "price": 8500,
      "oldPrice": 11000,
      "discount": "-23%",
      "emoji": "🥬",
      "unit": "pack",
      "sold": 97,
      "stock": 320,
      "image": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=600",
    },
    {
      "id": 4,
      "name": "Jeruk Manis",
      "price": 15000,
      "oldPrice": 20000,
      "discount": "-25%",
      "emoji": "🍊",
      "unit": "kg",
      "sold": 210,
      "stock": 500,
      "image": "https://images.unsplash.com/photo-1587397842984-5b1e2c77d23c?q=80&w=600",
    },
  ];

  final List<Map<String, dynamic>> upcomingLives = [
    {'farmer': 'Subur Farm', 'location': 'Lembang', 'time': '10:00', 'product': 'Stroberi', 'emoji': '🍓', 'viewers': 230},
    {'farmer': 'Fresh Melon', 'location': 'Magelang', 'time': '14:00', 'product': 'Melon', 'emoji': '🍈', 'viewers': 189},
    {'farmer': 'Organic Green', 'location': 'Bogor', 'time': '16:00', 'product': 'Brokoli', 'emoji': '🥦', 'viewers': 312},
    {'farmer': 'Mangga Manis', 'location': 'Probolinggo', 'time': '19:00', 'product': 'Mangga', 'emoji': '🥭', 'viewers': 445},
  ];

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController();
    _initYoutubePlayer();
    
    _pulseController = AnimationController(vsync: this, duration: const Duration(seconds: 1))..repeat(reverse: true);
    _floatController = AnimationController(vsync: this, duration: const Duration(seconds: 2))..repeat(reverse: true);
    
    Timer.periodic(const Duration(seconds: 5), (timer) {
      if (mounted) {
        setState(() {
          _viewerCount += DateTime.now().second % 5 + 1;
        });
      }
    });
  }

  void _initYoutubePlayer() {
    // Perbaikan untuk youtube_player_iframe v5 - HAPUS parameter 'muted'
    _youtubeController = YoutubePlayerController.fromVideoId(
      videoId: 'jfKfPfyJRdk',
      autoPlay: true,
      params: const YoutubePlayerParams(
        showControls: true,
        showFullscreenButton: true,
        loop: false,
        // 'muted' tidak ada di parameter ini, gunakan 'mute' nanti via controller
      ),
    );
  }

  void _sendMessage() {
    if (_chatController.text.trim().isEmpty) return;

    final now = DateTime.now();
    final timeString = '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}';

    setState(() {
      _chatMessages.add({
        'name': 'Saya',
        'message': _chatController.text,
        'isHost': 'false',
        'avatar': '👤',
        'time': timeString,
      });
      _chatController.clear();
    });
    
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _addToCart(Map<String, dynamic> product) {
    setState(() {
      _cartItemCount++;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Text(product['emoji'], style: const TextStyle(fontSize: 24)),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    '${product["name"]}',
                    style: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                  Text(
                    'Ditambahkan ke keranjang',
                    style: GoogleFonts.poppins(fontSize: 11),
                  ),
                ],
              ),
            ),
          ],
        ),
        backgroundColor: primaryGreen900,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        duration: const Duration(seconds: 1),
      ),
    );
  }

  void _toggleFollow() {
    setState(() {
      _isFollowing = !_isFollowing;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(_isFollowing ? '✅ Mengikuti Tani Makmur Farm' : 'Berhenti mengikuti'),
        duration: const Duration(seconds: 1),
        backgroundColor: primaryGreen900,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  void _toggleLike() {
    setState(() {
      if (_isLiked) {
        _likeCount--;
      } else {
        _likeCount++;
      }
      _isLiked = !_isLiked;
    });
  }

  void _toggleMute() {
    setState(() {
      _isMuted = !_isMuted;
      if (_isMuted) {
        _youtubeController.mute();
      } else {
        _youtubeController.unMute();
      }
    });
  }
  
  void _toggleChat() {
    setState(() {
      _isChatExpanded = !_isChatExpanded;
    });
  }

  String formatPrice(int price) {
    return 'Rp ${price.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.')}';
  }
  
  String formatNumber(int number) {
    if (number >= 1000) {
      return '${(number / 1000).toStringAsFixed(1)}k';
    }
    return number.toString();
  }

  Widget _buildStatCard(IconData icon, String title, String value, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(22),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 12,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 8),
            Text(
              value,
              style: GoogleFonts.poppins(
                fontWeight: FontWeight.bold,
                fontSize: 18,
                color: primaryGreen900,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              title,
              style: GoogleFonts.poppins(
                fontSize: 11,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
      ).animate().fadeIn(delay: 150.ms),
    );
  }

  @override
  void dispose() {
    _youtubeController.close();
    _chatController.dispose();
    _scrollController.dispose();
    _pulseController.dispose();
    _floatController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7F2),
      
      floatingActionButton: AnimatedBuilder(
        animation: _floatController,
        builder: (_, child) {
          return Transform.translate(
            offset: Offset(0, _floatController.value * -5),
            child: child,
          );
        },
        child: FloatingActionButton.extended(
          backgroundColor: primaryGreen900,
          onPressed: () {
            Navigator.pushNamed(context, '/cart');
          },
          elevation: 8,
          icon: Stack(
            children: [
              const Icon(Icons.shopping_cart, color: Colors.white),
              if (_cartItemCount > 0)
                Positioned(
                  right: -4,
                  top: -4,
                  child: Container(
                    padding: const EdgeInsets.all(2),
                    decoration: const BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      '$_cartItemCount',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 8,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
            ],
          ),
          label: Text(
            "Checkout (${_cartItemCount})",
            style: GoogleFonts.poppins(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
        ).animate().scale(delay: 300.ms),
      ),

      body: CustomScrollView(
        controller: _scrollController,
        slivers: [
          // AppBar
          SliverAppBar(
            floating: true,
            pinned: true,
            expandedHeight: 100,
            backgroundColor: Colors.white,
            elevation: 0,
            leading: Padding(
              padding: const EdgeInsets.only(left: 12),
              child: GestureDetector(
                onTap: () => Navigator.pop(context),
                child: Container(
                  margin: const EdgeInsets.symmetric(vertical: 12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFE8F5E9),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(
                    Icons.arrow_back_ios_new,
                    color: primaryGreen900,
                    size: 18,
                  ),
                ).animate().fadeIn(delay: 100.ms),
              ),
            ),
            title: AnimatedBuilder(
              animation: _pulseController,
              builder: (_, child) {
                return Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [primaryGreen900, primaryGreen500],
                    ),
                    borderRadius: BorderRadius.circular(30),
                    boxShadow: [
                      BoxShadow(
                        color: primaryGreen900.withOpacity(0.3 + _pulseController.value * 0.2),
                        blurRadius: 12,
                        spreadRadius: 1,
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.live_tv_rounded, color: Colors.white, size: 18),
                      const SizedBox(width: 8),
                      Text(
                        "AgroLive",
                        style: GoogleFonts.poppins(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                      Container(
                        margin: const EdgeInsets.only(left: 8),
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.3),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          "LIVE",
                          style: GoogleFonts.poppins(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
            actions: [
              IconButton(
                onPressed: () {},
                icon: const Icon(Icons.share_outlined, color: primaryGreen900),
              ).animate().fadeIn(delay: 200.ms),
              Stack(
                children: [
                  IconButton(
                    onPressed: () {
                      Navigator.pushNamed(context, '/cart');
                    },
                    icon: const Icon(Icons.shopping_cart_outlined, color: primaryGreen900),
                  ),
                  if (_cartItemCount > 0)
                    Positioned(
                      right: 8,
                      top: 10,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: const BoxDecoration(
                          color: Colors.red,
                          shape: BoxShape.circle,
                        ),
                        child: Text(
                          '$_cartItemCount',
                          style: GoogleFonts.poppins(
                            color: Colors.white,
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                ],
              ).animate().fadeIn(delay: 250.ms),
              IconButton(
                onPressed: _toggleMute,
                icon: Icon(
                  _isMuted ? Icons.volume_off : Icons.volume_up,
                  color: primaryGreen900,
                ),
              ).animate().fadeIn(delay: 300.ms),
              const SizedBox(width: 10),
            ],
          ),

          // Hero Video Section
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(30),
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.08),
                      blurRadius: 24,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Stack(
                      children: [
                        ClipRRect(
                          borderRadius: const BorderRadius.vertical(top: Radius.circular(30)),
                          child: AspectRatio(
                            aspectRatio: 16 / 9,
                            child: YoutubePlayer(
                              controller: _youtubeController,
                              aspectRatio: 16 / 9,
                            ),
                          ),
                        ),
                        Positioned(
                          top: 14,
                          left: 14,
                          child: AnimatedBuilder(
                            animation: _pulseController,
                            builder: (_, child) {
                              return Container(
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                decoration: BoxDecoration(
                                  color: Colors.red,
                                  borderRadius: BorderRadius.circular(30),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.red.withOpacity(0.4 + _pulseController.value * 0.3),
                                      blurRadius: 8,
                                      spreadRadius: 1,
                                    ),
                                  ],
                                ),
                                child: Row(
                                  children: [
                                    Container(
                                      width: 8,
                                      height: 8,
                                      decoration: const BoxDecoration(
                                        color: Colors.white,
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      "LIVE",
                                      style: GoogleFonts.poppins(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                        ),
                        Positioned(
                          top: 14,
                          right: 14,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                            decoration: BoxDecoration(
                              color: Colors.black.withOpacity(0.65),
                              borderRadius: BorderRadius.circular(30),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.remove_red_eye, color: Colors.white, size: 16),
                                const SizedBox(width: 6),
                                Text(
                                  formatNumber(_viewerCount),
                                  style: GoogleFonts.poppins(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                    Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "🌾 Panen Fresh Hari Ini!",
                            style: GoogleFonts.poppins(
                              fontWeight: FontWeight.bold,
                              fontSize: 22,
                              color: primaryGreen900,
                            ),
                          ).animate().fadeIn(delay: 150.ms),
                          const SizedBox(height: 8),
                          Text(
                            "Belanja langsung dari petani saat live berlangsung. Fresh dari kebun ke rumah Anda dengan harga terbaik.",
                            style: GoogleFonts.poppins(
                              fontSize: 13,
                              color: Colors.grey[700],
                              height: 1.5,
                            ),
                          ).animate().fadeIn(delay: 200.ms),
                          const SizedBox(height: 20),
                          Row(
                            children: [
                              AnimatedBuilder(
                                animation: _pulseController,
                                builder: (_, child) {
                                  return Container(
                                    width: 56,
                                    height: 56,
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        colors: [primaryGreen700, primaryGreen500],
                                      ),
                                      borderRadius: BorderRadius.circular(20),
                                      boxShadow: [
                                        BoxShadow(
                                          color: primaryGreen900.withOpacity(0.3 + _pulseController.value * 0.2),
                                          blurRadius: 12,
                                        ),
                                      ],
                                    ),
                                    child: const Icon(Icons.agriculture, color: Colors.white, size: 28),
                                  );
                                },
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Text(
                                          "Tani Makmur Farm",
                                          style: GoogleFonts.poppins(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 15,
                                          ),
                                        ),
                                        const SizedBox(width: 6),
                                        const Icon(Icons.verified, color: Colors.green, size: 18),
                                      ],
                                    ),
                                    const SizedBox(height: 4),
                                    Row(
                                      children: [
                                        const Icon(Icons.location_on, size: 12, color: Colors.grey),
                                        const SizedBox(width: 4),
                                        Text(
                                          "Bandung, Jawa Barat",
                                          style: GoogleFonts.poppins(
                                            color: Colors.grey[600],
                                            fontSize: 12,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                              GestureDetector(
                                onTap: _toggleFollow,
                                child: AnimatedContainer(
                                  duration: const Duration(milliseconds: 300),
                                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                                  decoration: BoxDecoration(
                                    gradient: _isFollowing
                                        ? null
                                        : LinearGradient(colors: [primaryGreen900, primaryGreen500]),
                                    color: _isFollowing ? Colors.grey[200] : null,
                                    borderRadius: BorderRadius.circular(30),
                                    border: Border.all(
                                      color: _isFollowing ? primaryGreen900 : Colors.transparent,
                                    ),
                                  ),
                                  child: Text(
                                    _isFollowing ? "Following" : "Follow",
                                    style: GoogleFonts.poppins(
                                      color: _isFollowing ? primaryGreen900 : Colors.white,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 12,
                                    ),
                                  ),
                                ),
                              ).animate().fadeIn(delay: 300.ms),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ).animate().fadeIn(delay: 100.ms),
            ),
          ),

          // Stats Cards
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  _buildStatCard(Icons.visibility_outlined, "Penonton", formatNumber(_viewerCount), Colors.blue),
                  const SizedBox(width: 12),
                  _buildStatCard(Icons.shopping_bag_outlined, "Terjual", formatNumber(_totalSold), Colors.orange),
                  const SizedBox(width: 12),
                  _buildStatCard(Icons.favorite_outline, "Suka", formatNumber(_likeCount), Colors.red),
                ],
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 24)),

          // Products Section
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "🔥 Produk Live Hari Ini",
                    style: GoogleFonts.poppins(
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFE8F5E9),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      "${liveProducts.length} Produk",
                      style: GoogleFonts.poppins(
                        color: primaryGreen900,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 16)),

          // Products Horizontal List
          SliverToBoxAdapter(
            child: SizedBox(
              height: 290,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: liveProducts.length,
                itemBuilder: (context, index) {
                  final product = liveProducts[index];
                  return Container(
                    width: 240,
                    margin: const EdgeInsets.only(right: 16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(28),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.06),
                          blurRadius: 16,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Stack(
                          children: [
                            ClipRRect(
                              borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
                              child: Image.network(
                                product["image"],
                                height: 140,
                                width: double.infinity,
                                fit: BoxFit.cover,
                                errorBuilder: (_, __, ___) => Container(
                                  height: 140,
                                  color: Colors.grey[200],
                                  child: Center(
                                    child: Text(product["emoji"], style: const TextStyle(fontSize: 48)),
                                  ),
                                ),
                              ),
                            ),
                            Positioned(
                              top: 12,
                              left: 12,
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                                decoration: BoxDecoration(
                                  color: Colors.red,
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: Text(
                                  product["discount"],
                                  style: GoogleFonts.poppins(
                                    color: Colors.white,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ),
                            Positioned(
                              bottom: 12,
                              right: 12,
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.black.withOpacity(0.6),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Row(
                                  children: [
                                    const Icon(Icons.shopping_bag, size: 10, color: Colors.white),
                                    const SizedBox(width: 4),
                                    Text(
                                      "${product["sold"]} terjual",
                                      style: GoogleFonts.poppins(
                                        color: Colors.white,
                                        fontSize: 9,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                        Padding(
                          padding: const EdgeInsets.all(14),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Text(product["emoji"], style: const TextStyle(fontSize: 20)),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      product["name"],
                                      style: GoogleFonts.poppins(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 14,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Row(
                                children: [
                                  Text(
                                    formatPrice(product["price"]),
                                    style: GoogleFonts.poppins(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 18,
                                      color: primaryGreen900,
                                    ),
                                  ),
                                  Text(
                                    "/${product["unit"]}",
                                    style: GoogleFonts.poppins(
                                      fontSize: 12,
                                      color: Colors.grey,
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    formatPrice(product["oldPrice"]),
                                    style: GoogleFonts.poppins(
                                      color: Colors.grey,
                                      fontSize: 12,
                                      decoration: TextDecoration.lineThrough,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              SizedBox(
                                width: double.infinity,
                                child: ElevatedButton.icon(
                                  onPressed: () => _addToCart(product),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: primaryGreen900,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    padding: const EdgeInsets.symmetric(vertical: 10),
                                  ),
                                  icon: const Icon(Icons.add_shopping_cart, color: Colors.white, size: 18),
                                  label: Text(
                                    "Beli Sekarang",
                                    style: GoogleFonts.poppins(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 12,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ).animate().fadeIn().slideX(begin: 0.2, duration: (300 + index * 100).ms);
                },
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 24)),

          // Upcoming Lives
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                "⏰ Jadwal Live Selanjutnya",
                style: GoogleFonts.poppins(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 12)),

          SliverToBoxAdapter(
            child: SizedBox(
              height: 130,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: upcomingLives.length,
                itemBuilder: (context, index) {
                  final live = upcomingLives[index];
                  return Container(
                    width: 210,
                    margin: const EdgeInsets.only(right: 12),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.04),
                          blurRadius: 8,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        Text(live['emoji'], style: const TextStyle(fontSize: 42)),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                live['farmer'],
                                style: GoogleFonts.poppins(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 13,
                                ),
                              ),
                              Text(
                                live['location'],
                                style: GoogleFonts.poppins(
                                  fontSize: 10,
                                  color: Colors.grey,
                                ),
                              ),
                              const SizedBox(height: 6),
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFE8F5E9),
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Text(
                                      "🕐 ${live['time']} WIB",
                                      style: GoogleFonts.poppins(
                                        fontSize: 9,
                                        color: primaryGreen900,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 6),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: Colors.blue.shade50,
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Row(
                                      children: [
                                        const Icon(Icons.visibility, size: 10, color: Colors.blue),
                                        const SizedBox(width: 2),
                                        Text(
                                          formatNumber(live['viewers']),
                                          style: GoogleFonts.poppins(
                                            fontSize: 9,
                                            color: Colors.blue,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 24)),

          // Live Chat Section
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(28),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.04),
                      blurRadius: 12,
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    InkWell(
                      onTap: _toggleChat,
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: const Color(0xFFE8F5E9),
                                borderRadius: BorderRadius.circular(14),
                              ),
                              child: const Icon(Icons.chat_bubble_outline, color: primaryGreen900, size: 20),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                "Live Chat • ${_chatMessages.length} Pesan",
                                style: GoogleFonts.poppins(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                            ),
                            Icon(
                              _isChatExpanded ? Icons.expand_less : Icons.expand_more,
                              color: Colors.grey,
                            ),
                          ],
                        ),
                      ),
                    ),
                    if (_isChatExpanded) ...[
                      const Divider(height: 1),
                      SizedBox(
                        height: 320,
                        child: ListView.builder(
                          padding: const EdgeInsets.all(16),
                          reverse: true,
                          itemCount: _chatMessages.length,
                          itemBuilder: (context, index) {
                            final chat = _chatMessages[_chatMessages.length - 1 - index];
                            final isHost = chat['isHost'] == 'true';
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 16),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  CircleAvatar(
                                    radius: 20,
                                    backgroundColor: isHost ? primaryGreen900 : const Color(0xFFE8F5E9),
                                    child: Text(
                                      isHost ? "🌾" : (chat['avatar']?.substring(0, 1) ?? "👤"),
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: isHost ? Colors.white : primaryGreen900,
                                      ),
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
                                              chat['name']!,
                                              style: GoogleFonts.poppins(
                                                fontWeight: FontWeight.bold,
                                                fontSize: 13,
                                              ),
                                            ),
                                            const SizedBox(width: 8),
                                            Text(
                                              chat['time']!,
                                              style: GoogleFonts.poppins(
                                                fontSize: 9,
                                                color: Colors.grey[400],
                                              ),
                                            ),
                                            if (isHost) ...[
                                              const SizedBox(width: 8),
                                              Container(
                                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                                decoration: BoxDecoration(
                                                  color: primaryGreen900,
                                                  borderRadius: BorderRadius.circular(12),
                                                ),
                                                child: Text(
                                                  "HOST",
                                                  style: GoogleFonts.poppins(
                                                    color: Colors.white,
                                                    fontSize: 8,
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ],
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          chat['message']!,
                                          style: GoogleFonts.poppins(
                                            color: Colors.grey[800],
                                            fontSize: 12,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
                      ),
                      const Divider(height: 1),
                      Padding(
                        padding: const EdgeInsets.all(12),
                        child: Row(
                          children: [
                            Expanded(
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 16),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF5F7F2),
                                  borderRadius: BorderRadius.circular(30),
                                ),
                                child: TextField(
                                  controller: _chatController,
                                  onSubmitted: (_) => _sendMessage(),
                                  decoration: InputDecoration(
                                    border: InputBorder.none,
                                    hintText: "Tulis komentar...",
                                    hintStyle: GoogleFonts.poppins(
                                      color: Colors.grey[400],
                                      fontSize: 13,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            GestureDetector(
                              onTap: _sendMessage,
                              child: Container(
                                padding: const EdgeInsets.all(14),
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [primaryGreen900, primaryGreen500],
                                  ),
                                  borderRadius: BorderRadius.circular(30),
                                ),
                                child: const Icon(Icons.send, color: Colors.white, size: 20),
                              ),
                            ),
                            const SizedBox(width: 8),
                            GestureDetector(
                              onTap: _toggleLike,
                              child: Container(
                                padding: const EdgeInsets.all(14),
                                decoration: BoxDecoration(
                                  color: _isLiked ? Colors.red : Colors.grey[200],
                                  borderRadius: BorderRadius.circular(30),
                                ),
                                child: Icon(
                                  _isLiked ? Icons.favorite : Icons.favorite_border,
                                  color: _isLiked ? Colors.white : Colors.grey,
                                  size: 20,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ).animate().fadeIn(delay: 400.ms),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }
}