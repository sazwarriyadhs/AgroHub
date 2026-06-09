class ChatEntity {
  final String id;
  final String name;
  final String lastMessage;
  final DateTime updatedAt;

  ChatEntity({
    required this.id,
    required this.name,
    required this.lastMessage,
    required this.updatedAt,
  });
}
