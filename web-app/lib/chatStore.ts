// lib/chatStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  senderRole: 'buyer' | 'seller' | 'admin';
  message: string;
  timestamp: string;
  isRead: boolean;
  attachments?: string[];
}

export interface Conversation {
  id: number;
  type: 'order' | 'admin' | 'product';
  title: string;
  subtitle: string;
  orderId?: number;
  productId?: number;
  productName?: string;
  productImage?: string;
  participants: {
    id: number;
    name: string;
    role: 'buyer' | 'seller' | 'admin';
    avatar?: string;
  }[];
  messages: Message[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status?: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
}

interface ChatStore {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  loading: boolean;
  sending: boolean;
  error: string | null;
  
  // Actions
  fetchConversations: () => Promise<void>;
  fetchConversationById: (id: number) => Promise<Conversation | null>;
  sendMessage: (conversationId: number, message: string, attachments?: string[]) => Promise<void>;
  markAsRead: (conversationId: number) => Promise<void>;
  createOrderConversation: (orderId: number, productId: number, sellerId: number, sellerName: string, productName: string) => Promise<Conversation | null>;
  createAdminConversation: () => Promise<Conversation | null>;
  clearCurrentConversation: () => void;
  setError: (error: string | null) => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8900/api/v1';

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversation: null,
      loading: false,
      sending: false,
      error: null,

      fetchConversations: async () => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('Token tidak ditemukan');
          }

          const userRole = localStorage.getItem('userRole') || 'customer';
          const userId = localStorage.getItem('userId');
          const userName = localStorage.getItem('userName') || 'Pengguna';

          // Coba fetch dari API
          try {
            const response = await fetch(`${API_BASE}/chat/conversations`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              const data = await response.json();
              const conversations = data.data || data;
              set({ conversations, loading: false });
              return;
            }
          } catch (apiError) {
            console.log('API not ready, using mock data');
          }

          // Mock data untuk development
          let conversations: Conversation[] = [];

          if (userRole === 'customer' || userRole === 'buyer') {
            conversations = [
              {
                id: 1,
                type: 'order',
                title: 'Tani Makmur Store',
                subtitle: 'Order #AGH-001 · Beras Organik 5kg',
                orderId: 1001,
                productId: 101,
                productName: 'Beras Organik Premium 5kg',
                participants: [
                  { id: parseInt(userId || '3'), name: userName, role: 'buyer' },
                  { id: 10, name: 'Tani Makmur', role: 'seller', avatar: '/avatars/seller1.jpg' }
                ],
                messages: [
                  {
                    id: 1,
                    conversationId: 1,
                    senderId: 10,
                    senderName: 'Tani Makmur',
                    senderRole: 'seller',
                    message: 'Halo, terima kasih sudah berbelanja. Pesanan akan segera kami proses.',
                    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    isRead: true,
                  },
                  {
                    id: 2,
                    conversationId: 1,
                    senderId: parseInt(userId || '3'),
                    senderName: userName,
                    senderRole: 'buyer',
                    message: 'Baik, terima kasih infonya. Kapan estimasi pengiriman?',
                    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    isRead: true,
                  },
                  {
                    id: 3,
                    conversationId: 1,
                    senderId: 10,
                    senderName: 'Tani Makmur',
                    senderRole: 'seller',
                    message: 'Pesanan sudah dikirim. Nomor resi: JNE123456789',
                    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                    isRead: false,
                  }
                ],
                lastMessage: 'Pesanan sudah dikirim. Nomor resi: JNE123456789',
                lastMessageTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                unreadCount: 1,
                status: 'shipped'
              },
              {
                id: 2,
                type: 'order',
                title: 'Agro Sejahtera',
                subtitle: 'Order #AGH-002 · Pupuk NPK 1kg',
                orderId: 1002,
                productId: 102,
                productName: 'Pupuk NPK Mutiara 1kg',
                participants: [
                  { id: parseInt(userId || '3'), name: userName, role: 'buyer' },
                  { id: 11, name: 'Agro Sejahtera', role: 'seller' }
                ],
                messages: [
                  {
                    id: 1,
                    conversationId: 2,
                    senderId: parseInt(userId || '3'),
                    senderName: userName,
                    senderRole: 'buyer',
                    message: 'Apakah pupuknya ready?',
                    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    isRead: true,
                  },
                  {
                    id: 2,
                    conversationId: 2,
                    senderId: 11,
                    senderName: 'Agro Sejahtera',
                    senderRole: 'seller',
                    message: 'Ready kak. Silakan order langsung',
                    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    isRead: true,
                  }
                ],
                lastMessage: 'Ready kak. Silakan order langsung',
                lastMessageTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                unreadCount: 0,
                status: 'completed'
              },
              {
                id: 3,
                type: 'admin',
                title: 'Customer Support',
                subtitle: 'Admin AgroHub',
                participants: [
                  { id: parseInt(userId || '3'), name: userName, role: 'buyer' },
                  { id: 1, name: 'Admin AgroHub', role: 'admin', avatar: '/avatars/admin.jpg' }
                ],
                messages: [
                  {
                    id: 1,
                    conversationId: 3,
                    senderId: 1,
                    senderName: 'Admin AgroHub',
                    senderRole: 'admin',
                    message: 'Halo! Ada yang bisa kami bantu?',
                    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                    isRead: true,
                  }
                ],
                lastMessage: 'Halo! Ada yang bisa kami bantu?',
                lastMessageTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                unreadCount: 0,
              }
            ];
          } else if (userRole === 'seller') {
            conversations = [
              {
                id: 1,
                type: 'order',
                title: 'Tri Endah Ariwati',
                subtitle: 'Order #AGH-001 · Beras Organik 5kg',
                orderId: 1001,
                productId: 101,
                productName: 'Beras Organik Premium 5kg',
                participants: [
                  { id: 3, name: 'Tri Endah Ariwati', role: 'buyer' },
                  { id: parseInt(userId || '10'), name: userName, role: 'seller' }
                ],
                messages: [
                  {
                    id: 1,
                    conversationId: 1,
                    senderId: 3,
                    senderName: 'Tri Endah Ariwati',
                    senderRole: 'buyer',
                    message: 'Halo, pesanan saya sudah diproses?',
                    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    isRead: true,
                  }
                ],
                lastMessage: 'Halo, pesanan saya sudah diproses?',
                lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                unreadCount: 0,
                status: 'processing'
              }
            ];
          }

          set({ conversations, loading: false });
        } catch (error) {
          console.error('Error fetching conversations:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Gagal memuat percakapan',
            loading: false 
          });
        }
      },

      fetchConversationById: async (id: number) => {
        set({ loading: true });
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('Token tidak ditemukan');
          }

          // Coba fetch dari API
          try {
            const response = await fetch(`${API_BASE}/chat/conversations/${id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              const data = await response.json();
              const conversation = data.data || data;
              set({ currentConversation: conversation, loading: false });
              return conversation;
            }
          } catch (apiError) {
            console.log('API not ready, using mock data');
          }

          // Ambil dari state yang sudah ada
          const { conversations } = get();
          const conversation = conversations.find(c => c.id === id);
          
          if (conversation) {
            set({ currentConversation: conversation, loading: false });
            return conversation;
          }
          
          return null;
        } catch (error) {
          console.error('Error fetching conversation:', error);
          set({ error: 'Gagal memuat percakapan', loading: false });
          return null;
        }
      },

      sendMessage: async (conversationId: number, message: string, attachments?: string[]) => {
        set({ sending: true, error: null });
        try {
          const token = localStorage.getItem('token');
          const userId = localStorage.getItem('userId');
          const userName = localStorage.getItem('userName') || 'Pengguna';
          const userRole = localStorage.getItem('userRole') || 'customer';

          if (!token) {
            throw new Error('Token tidak ditemukan');
          }

          if (!message.trim() && (!attachments || attachments.length === 0)) {
            throw new Error('Pesan tidak boleh kosong');
          }

          // Coba kirim ke API
          try {
            const response = await fetch(`${API_BASE}/chat/conversations/${conversationId}/messages`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ message, attachments }),
            });

            if (response.ok) {
              const data = await response.json();
              const newMessage = data.data || data;
              
              // Update state
              const { conversations, currentConversation } = get();
              
              // Update conversations list
              const updatedConversations = conversations.map(conv => {
                if (conv.id === conversationId) {
                  return {
                    ...conv,
                    lastMessage: message,
                    lastMessageTime: new Date().toISOString(),
                    messages: [...conv.messages, newMessage]
                  };
                }
                return conv;
              });
              
              // Update current conversation
              const updatedCurrent = currentConversation?.id === conversationId
                ? {
                    ...currentConversation,
                    lastMessage: message,
                    lastMessageTime: new Date().toISOString(),
                    messages: [...(currentConversation?.messages || []), newMessage]
                  }
                : currentConversation;
              
              set({ 
                conversations: updatedConversations, 
                currentConversation: updatedCurrent,
                sending: false 
              });
              return;
            }
          } catch (apiError) {
            console.log('API not ready, using mock data');
          }

          // Mock send message
          const newMessage: Message = {
            id: Date.now(),
            conversationId,
            senderId: parseInt(userId || '3'),
            senderName: userName,
            senderRole: (userRole === 'seller' ? 'seller' : userRole === 'admin' ? 'admin' : 'buyer') as 'buyer' | 'seller' | 'admin',
            message: message.trim(),
            timestamp: new Date().toISOString(),
            isRead: false,
            attachments,
          };

          // Update state
          const { conversations, currentConversation } = get();
          
          const updatedConversations = conversations.map(conv => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                lastMessage: message,
                lastMessageTime: new Date().toISOString(),
                messages: [...conv.messages, newMessage]
              };
            }
            return conv;
          });
          
          const updatedCurrent = currentConversation?.id === conversationId
            ? {
                ...currentConversation,
                lastMessage: message,
                lastMessageTime: new Date().toISOString(),
                messages: [...(currentConversation?.messages || []), newMessage]
              }
            : currentConversation;
          
          set({ 
            conversations: updatedConversations, 
            currentConversation: updatedCurrent,
            sending: false 
          });

        } catch (error) {
          console.error('Error sending message:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Gagal mengirim pesan',
            sending: false 
          });
        }
      },

      markAsRead: async (conversationId: number) => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;

          // Coba update ke API
          try {
            await fetch(`${API_BASE}/chat/conversations/${conversationId}/read`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
          } catch (apiError) {
            console.log('API not ready');
          }

          // Update state
          const { conversations, currentConversation } = get();
          
          const updatedConversations = conversations.map(conv => {
            if (conv.id === conversationId) {
              return { ...conv, unreadCount: 0 };
            }
            return conv;
          });
          
          const updatedCurrent = currentConversation?.id === conversationId
            ? { ...currentConversation, unreadCount: 0 }
            : currentConversation;
          
          set({ conversations: updatedConversations, currentConversation: updatedCurrent });
        } catch (error) {
          console.error('Error marking as read:', error);
        }
      },

      createOrderConversation: async (orderId: number, productId: number, sellerId: number, sellerName: string, productName: string) => {
        try {
          const token = localStorage.getItem('token');
          const userId = localStorage.getItem('userId');
          const userName = localStorage.getItem('userName') || 'Pengguna';

          if (!token) {
            throw new Error('Token tidak ditemukan');
          }

          // Cek apakah sudah ada conversation untuk order ini
          const { conversations } = get();
          const existing = conversations.find(c => c.orderId === orderId);
          if (existing) {
            return existing;
          }

          // Coba create via API
          try {
            const response = await fetch(`${API_BASE}/chat/conversations/order`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ orderId, productId, sellerId, sellerName, productName }),
            });

            if (response.ok) {
              const data = await response.json();
              const newConversation = data.data || data;
              
              // Update state
              set(state => ({
                conversations: [newConversation, ...state.conversations]
              }));
              
              return newConversation;
            }
          } catch (apiError) {
            console.log('API not ready');
          }

          // Mock create conversation
          const newConversation: Conversation = {
            id: Date.now(),
            type: 'order',
            title: sellerName,
            subtitle: `Order #AGH-${orderId} · ${productName}`,
            orderId,
            productId,
            productName,
            participants: [
              { id: parseInt(userId || '3'), name: userName, role: 'buyer' },
              { id: sellerId, name: sellerName, role: 'seller' }
            ],
            messages: [],
            lastMessage: 'Mulai percakapan',
            lastMessageTime: new Date().toISOString(),
            unreadCount: 0,
            status: 'pending'
          };

          set(state => ({
            conversations: [newConversation, ...state.conversations]
          }));

          return newConversation;
        } catch (error) {
          console.error('Error creating order conversation:', error);
          return null;
        }
      },

      createAdminConversation: async () => {
        try {
          const token = localStorage.getItem('token');
          const userId = localStorage.getItem('userId');
          const userName = localStorage.getItem('userName') || 'Pengguna';

          if (!token) {
            throw new Error('Token tidak ditemukan');
          }

          // Cek apakah sudah ada conversation dengan admin
          const { conversations } = get();
          const existing = conversations.find(c => c.type === 'admin');
          if (existing) {
            return existing;
          }

          const newConversation: Conversation = {
            id: Date.now(),
            type: 'admin',
            title: 'Customer Support',
            subtitle: 'Admin AgroHub',
            participants: [
              { id: parseInt(userId || '3'), name: userName, role: 'buyer' },
              { id: 1, name: 'Admin AgroHub', role: 'admin' }
            ],
            messages: [],
            lastMessage: 'Hubungi admin untuk bantuan',
            lastMessageTime: new Date().toISOString(),
            unreadCount: 0,
          };

          set(state => ({
            conversations: [newConversation, ...state.conversations]
          }));

          return newConversation;
        } catch (error) {
          console.error('Error creating admin conversation:', error);
          return null;
        }
      },

      clearCurrentConversation: () => {
        set({ currentConversation: null });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({ 
        conversations: state.conversations.map(conv => ({
          ...conv,
          messages: conv.messages.slice(-50) // Simpan hanya 50 pesan terakhir
        }))
      }),
    }
  )
);