enum MessageType {
  text,
  image,
  ai,
  systemAlert,
}

class MessageEntity {
  final String id;
  final String chatId;
  final String senderId;
  final String message;
  final MessageType type;
  final DateTime timestamp;

  MessageEntity({
    required this.id,
    required this.chatId,
    required this.senderId,
    required this.message,
    required this.type,
    required this.timestamp,
  });
}
