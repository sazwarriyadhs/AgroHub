// lib/features/community/presentation/community_screen.dart

import 'package:flutter/material.dart';
import '../../../core/services/api_service.dart';

class CommunityScreen extends StatefulWidget {
  const CommunityScreen({super.key});

  @override
  State<CommunityScreen> createState() =>
      _CommunityScreenState();
}

class _CommunityScreenState
    extends State<CommunityScreen> {
  final ApiService _apiService =
      ApiService();

  List<dynamic> _posts = [];

  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadPosts();
  }

  Future<void> _loadPosts() async {
    if (mounted) {
      setState(() {
        _isLoading = true;
      });
    }

    try {
      final dynamic response =
          await _apiService.get(
        '/community/feed',
      );

      List<dynamic> parsedPosts = [];

      if (response is Map<String, dynamic>) {
        final data = response['data'];

        if (data is List) {
          parsedPosts = data;
        }
      } else if (response is List) {
        parsedPosts = response;
      }

      if (mounted) {
        setState(() {
          _posts = parsedPosts;
        });
      }
    } catch (e) {
      debugPrint(
        "Community Error: $e",
      );

      if (mounted) {
        setState(() {
          _posts = [];
        });

        ScaffoldMessenger.of(context)
            .showSnackBar(
          SnackBar(
            content: Text(
              'Gagal load komunitas: $e',
            ),
            backgroundColor:
                Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  String _getInitial(
    String name,
  ) {
    if (name.isEmpty) {
      return "?";
    }

    return name[0]
        .toUpperCase();
  }

  @override
  Widget build(
    BuildContext context,
  ) {
    return Scaffold(
      backgroundColor:
          const Color(
        0xFFF4F7F5,
      ),

      appBar: AppBar(
        title: const Text(
          "Komunitas Tani",
        ),
        backgroundColor:
            Colors.green,
        foregroundColor:
            Colors.white,

        actions: [
          IconButton(
            onPressed:
                _loadPosts,
            icon: const Icon(
              Icons.refresh,
            ),
          )
        ],
      ),

      body: RefreshIndicator(
        onRefresh:
            _loadPosts,

        child: _isLoading
            ? const Center(
                child:
                    CircularProgressIndicator(),
              )
            : _posts.isEmpty
                ? _buildEmptyState()
                : ListView(
                    physics:
                        const AlwaysScrollableScrollPhysics(),

                    padding:
                        const EdgeInsets.all(
                      16,
                    ),

                    children: [

                      _buildHero(),

                      const SizedBox(
                        height: 20,
                      ),

                      ..._posts.map(
                        (post) =>
                            _buildPostCard(
                          post,
                        ),
                      ),
                    ],
                  ),
      ),
    );
  }

  Widget _buildHero() {
    return Container(
      padding:
          const EdgeInsets.all(
        18,
      ),

      decoration:
          BoxDecoration(
        borderRadius:
            BorderRadius.circular(
          20,
        ),

        gradient:
            LinearGradient(
          colors: [
            Colors.green.shade700,
            Colors.green.shade500,
          ],
        ),
      ),

      child: const Row(
        children: [

          Icon(
            Icons.groups,
            color:
                Colors.white,
            size: 42,
          ),

          SizedBox(
            width: 14,
          ),

          Expanded(
            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment
                      .start,

              children: [

                Text(
                  "Komunitas Petani",
                  style:
                      TextStyle(
                    color:
                        Colors.white,
                    fontSize:
                        18,
                    fontWeight:
                        FontWeight
                            .bold,
                  ),
                ),

                SizedBox(
                  height: 4,
                ),

                Text(
                  "Berbagi pengalaman, panen, dan ilmu tani 🌱",
                  style:
                      TextStyle(
                    color:
                        Colors.white70,
                  ),
                )
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildPostCard(
    dynamic post,
  ) {
    final author =
        post['author'] ??
            post[
                'user_name'] ??
            "Petani";

    final title =
        post['title'] ??
            post[
                'content'] ??
            "Postingan";

    final likes =
        post['likes'] ??
            0;

    return Container(
      margin:
          const EdgeInsets.only(
        bottom: 14,
      ),

      child: Card(
        elevation: 2,

        shape:
            RoundedRectangleBorder(
          borderRadius:
              BorderRadius.circular(
            18,
          ),
        ),

        child: Padding(
          padding:
              const EdgeInsets.all(
            16,
          ),

          child: Column(
            crossAxisAlignment:
                CrossAxisAlignment
                    .start,

            children: [

              Row(
                children: [

                  CircleAvatar(
                    backgroundColor:
                        Colors.green
                            .shade100,

                    child: Text(
                      _getInitial(
                        author,
                      ),

                      style:
                          const TextStyle(
                        color:
                            Colors.green,
                        fontWeight:
                            FontWeight
                                .bold,
                      ),
                    ),
                  ),

                  const SizedBox(
                    width: 12,
                  ),

                  Expanded(
                    child: Column(
                      crossAxisAlignment:
                          CrossAxisAlignment
                              .start,

                      children: [

                        Text(
                          author,

                          style:
                              const TextStyle(
                            fontWeight:
                                FontWeight
                                    .bold,
                          ),
                        ),

                        Text(
                          "Petani Lokal",

                          style:
                              TextStyle(
                            color: Colors
                                .grey,
                            fontSize:
                                12,
                          ),
                        )
                      ],
                    ),
                  ),

                  Icon(
                    Icons.more_vert,
                    color:
                        Colors.grey,
                  )
                ],
              ),

              const SizedBox(
                height: 14,
              ),

              Text(
                title,

                style:
                    const TextStyle(
                  fontSize: 15,
                  height: 1.4,
                ),
              ),

              const SizedBox(
                height: 18,
              ),

              Row(
                children: [

                  Icon(
                    Icons.favorite_border,
                    color:
                        Colors.red,
                    size: 20,
                  ),

                  const SizedBox(
                    width: 6,
                  ),

                  Text(
                    "$likes",
                  ),

                  const SizedBox(
                    width: 18,
                  ),

                  const Icon(
                    Icons.comment,
                    size: 20,
                    color:
                        Colors.grey,
                  ),

                  const SizedBox(
                    width: 6,
                  ),

                  const Text(
                    "Komentar",
                  )
                ],
              )
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return ListView(
      children: [

        const SizedBox(
          height: 120,
        ),

        Icon(
          Icons.groups_outlined,
          size: 90,
          color:
              Colors.grey[400],
        ),

        const SizedBox(
          height: 20,
        ),

        Center(
          child: Text(
            "Belum ada postingan",

            style: TextStyle(
              fontSize: 18,
              color:
                  Colors.grey[700],
              fontWeight:
                  FontWeight.bold,
            ),
          ),
        ),

        const SizedBox(
          height: 8,
        ),

        Center(
          child: Text(
            "Jadilah petani pertama yang berbagi 🌱",

            style: TextStyle(
              color:
                  Colors.grey,
            ),
          ),
        )
      ],
    );
  }
}