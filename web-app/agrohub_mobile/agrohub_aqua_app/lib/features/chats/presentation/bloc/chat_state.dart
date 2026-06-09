import '../../domain/entities/chat_entity.dart';
import '../../domain/entities/message_entity.dart';

abstract class ChatState {}

class ChatInitial extends ChatState {}
class ChatLoading extends ChatState {}

class ChatLoaded extends ChatState {
  final List<ChatEntity> chats;
  ChatLoaded(this.chats);
}

class MessagesLoaded extends ChatState {
  final List<MessageEntity> messages;
  MessagesLoaded(this.messages);
}
