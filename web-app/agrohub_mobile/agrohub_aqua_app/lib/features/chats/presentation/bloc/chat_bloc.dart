import 'package:flutter_bloc/flutter_bloc.dart';
import 'chat_event.dart';
import 'chat_state.dart';

class ChatBloc extends Bloc<ChatEvent, ChatState> {
  ChatBloc() : super(ChatInitial()) {

    on<LoadChats>((event, emit) async {
      emit(ChatLoading());
      await Future.delayed(const Duration(seconds: 1));
      emit(ChatLoaded([]));
    });
  }
}
