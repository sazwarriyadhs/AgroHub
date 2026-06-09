export interface ChatUser {
  id: number;
  name: string;
  avatar?: string;
  role: 'buyer' | 'farmer' | 'vendor' | 'admin';
  is_online?: boolean;
  last_seen?: string;
  store_id?: number;
  store_name?: string;
}

export interface ChatMessage {
  id: number;
  conversation_id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  type: 'text' | 'image' | 'file';
  file_url?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  sender?: ChatUser;
  receiver?: ChatUser;
}

export interface Conversation {
  id: number;
  buyer_id: number;
  seller_id: number;
  order_id?: number;
  product_id?: number;
  product_name?: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  buyer: ChatUser;
  seller: ChatUser;
  created_at: string;
  updated_at: string;
}

export interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: ChatMessage[];
  loading: boolean;
  sending: boolean;
}

