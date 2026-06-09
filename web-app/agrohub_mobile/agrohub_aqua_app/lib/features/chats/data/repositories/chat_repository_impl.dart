import '../../domain/repositories/chat_repository.dart';
import '../../domain/entities/chat_entity.dart';
import '../../domain/entities/message_entity.dart';

class ChatRepositoryImpl implements ChatRepository {

  @override
  Future<List<ChatEntity>> getChats() async {
    return [];
  }

  @override
  Future<List<MessageEntity>> getMessages(String chatId) async {
    return [];
  }

  @override
  Future<void> sendMessage(MessageEntity message) async {}

  @override
  Stream<List<MessageEntity>> streamMessages(String chatId) async* {
    yield [];
  }
}
