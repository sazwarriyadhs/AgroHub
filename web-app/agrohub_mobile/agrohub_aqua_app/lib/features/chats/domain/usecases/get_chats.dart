import '../repositories/chat_repository.dart';

class GetChats {
  final ChatRepository repository;
  GetChats(this.repository);

  Future call() => repository.getChats();
}
