abstract class ChatEvent {}

class LoadChats extends ChatEvent {}
class LoadMessages extends ChatEvent {
  final String chatId;
  LoadMessages(this.chatId);
}
class SendChatMessage extends ChatEvent {}
