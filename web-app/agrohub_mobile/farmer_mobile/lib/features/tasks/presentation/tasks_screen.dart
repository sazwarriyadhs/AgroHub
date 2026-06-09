// lib/features/tasks/presentation/tasks_screen.dart

import 'package:flutter/material.dart';

class TasksScreen extends StatefulWidget {
  const TasksScreen({super.key});

  @override
  State<TasksScreen> createState() => _TasksScreenState();
}

class _TasksScreenState extends State<TasksScreen> {
  List<Map<String, dynamic>> _tasks = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadTasks();
  }

  Future<void> _loadTasks() async {
    setState(() => _isLoading = true);

    await Future.delayed(const Duration(seconds: 1));

    setState(() {
      _tasks = [
        {
          'title': 'Siram tanaman padi',
          'time': '06:00 - 08:00',
          'priority': 'high',
          'completed': false,
          'icon': Icons.water_drop,
        },
        {
          'title': 'Cek hama tomat',
          'time': '08:00 - 10:00',
          'priority': 'medium',
          'completed': false,
          'icon': Icons.bug_report,
        },
        {
          'title': 'Pemupukan jagung',
          'time': '10:00 - 12:00',
          'priority': 'high',
          'completed': false,
          'icon': Icons.grass,
        },
        {
          'title': 'Pesanan marketplace',
          'time': '14:00 - 15:00',
          'priority': 'medium',
          'completed': false,
          'icon': Icons.shopping_bag,
        },
        {
          'title': 'Bersihkan gulma',
          'time': '16:00 - 17:00',
          'priority': 'low',
          'completed': false,
          'icon': Icons.agriculture,
        },
      ];

      _isLoading = false;
    });
  }

  void _toggleTask(int index) {
    setState(() {
      _tasks[index]['completed'] =
          !_tasks[index]['completed'];
    });
  }

  int get completedCount =>
      _tasks.where((e) => e['completed']).length;

  Color _priorityColor(String priority) {
    switch (priority) {
      case 'high':
        return Colors.red;
      case 'medium':
        return Colors.orange;
      default:
        return Colors.green;
    }
  }

  String _priorityLabel(String p) {
    switch (p) {
      case 'high':
        return "Penting";
      case 'medium':
        return "Sedang";
      default:
        return "Ringan";
    }
  }

  @override
  Widget build(BuildContext context) {
    final progress =
        _tasks.isEmpty ? 0.0 : completedCount / _tasks.length;

    return Scaffold(
      backgroundColor: const Color(0xffF4F7F2),

      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.green,
        foregroundColor: Colors.white,
        title: const Text(
          "Aktivitas Petani",
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
      ),

      body: RefreshIndicator(
        onRefresh: _loadTasks,
        child: _isLoading
            ? const Center(
                child: CircularProgressIndicator(),
              )
            : ListView(
                padding: const EdgeInsets.all(16),
                children: [

                  // HEADER CARD

                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Colors.green.shade700,
                          Colors.green.shade500,
                        ],
                      ),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Column(
                      crossAxisAlignment:
                          CrossAxisAlignment.start,
                      children: [

                        const Text(
                          "Rutinitas Hari Ini 🌾",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight:
                                FontWeight.bold,
                          ),
                        ),

                        const SizedBox(height: 8),

                        Text(
                          "$completedCount dari ${_tasks.length} tugas selesai",
                          style: const TextStyle(
                            color: Colors.white70,
                          ),
                        ),

                        const SizedBox(height: 20),

                        ClipRRect(
                          borderRadius:
                              BorderRadius.circular(10),
                          child: LinearProgressIndicator(
                            value: progress,
                            minHeight: 10,
                            backgroundColor:
                                Colors.white24,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  const Text(
                    "Daftar Aktivitas",
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                    ),
                  ),

                  const SizedBox(height: 12),

                  ...List.generate(
                    _tasks.length,
                    (index) {

                      final task = _tasks[index];

                      return Container(
                        margin:
                            const EdgeInsets.only(
                                bottom: 14),

                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius:
                              BorderRadius.circular(
                                  18),

                          boxShadow: [
                            BoxShadow(
                              blurRadius: 10,
                              color: Colors.black12,
                              offset:
                                  const Offset(0, 3),
                            )
                          ],
                        ),

                        child: ListTile(
                          contentPadding:
                              const EdgeInsets.all(
                                  16),

                          leading: CircleAvatar(
                            backgroundColor:
                                Colors.green.shade50,

                            child: Icon(
                              task['icon'],
                              color: Colors.green,
                            ),
                          ),

                          title: Text(
                            task['title'],
                            style: TextStyle(
                              fontWeight:
                                  FontWeight.bold,

                              decoration:
                                  task['completed']
                                      ? TextDecoration
                                          .lineThrough
                                      : null,
                            ),
                          ),

                          subtitle: Padding(
                            padding:
                                const EdgeInsets.only(
                                    top: 6),
                            child: Text(
                              task['time'],
                            ),
                          ),

                          trailing: Column(
                            mainAxisAlignment:
                                MainAxisAlignment
                                    .center,
                            children: [

                              Checkbox(
                                value:
                                    task['completed'],
                                activeColor:
                                    Colors.green,

                                onChanged: (_) =>
                                    _toggleTask(
                                        index),
                              ),

                              Container(
                                padding:
                                    const EdgeInsets
                                        .symmetric(
                                  horizontal: 8,
                                  vertical: 3,
                                ),

                                decoration:
                                    BoxDecoration(
                                  color: _priorityColor(
                                          task[
                                              'priority'])
                                      .withOpacity(
                                          .12),

                                  borderRadius:
                                      BorderRadius
                                          .circular(
                                              20),
                                ),

                                child: Text(
                                  _priorityLabel(
                                      task[
                                          'priority']),

                                  style: TextStyle(
                                    fontSize: 10,
                                    color:
                                        _priorityColor(
                                            task[
                                                'priority']),
                                  ),
                                ),
                              )
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
      ),
    );
  }
}