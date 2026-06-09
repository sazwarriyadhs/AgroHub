class GetChatsUseCase {
  final ChatRepository repository;

  GetChatsUseCase(this.repository);

  Future execute() {
    return repository.getChats();
  }
}
