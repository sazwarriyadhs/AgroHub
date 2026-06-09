'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MessageCircle, Store, Headphones, Package, Clock, Filter } from 'lucide-react';
import { useChatStore, Conversation } from '@/lib/chatStore';

export default function ChatInboxPage() {
  const router = useRouter();
  const { 
    conversations, 
    loading, 
    fetchConversations, 
    markAsRead,
    currentConversation 
  } = useChatStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const [activeTab, setActiveTab] = useState<'all' | 'orders' | 'admin'>('all');
  
  const isMobile = windowWidth < 768;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    fetchConversations();
    
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [fetchConversations, router]);

  // Filter conversations based on search and tab
  const filteredConversations = conversations.filter(conv => {
    // Filter by search
    const matchesSearch = conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          conv.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (conv.productName && conv.productName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by tab
    if (activeTab === 'orders') return matchesSearch && conv.type === 'order';
    if (activeTab === 'admin') return matchesSearch && conv.type === 'admin';
    return matchesSearch;
  });

  const handleSelectChat = async (chat: Conversation) => {
    setSelectedId(chat.id);
    
    // Mark as read when selected
    if (chat.unreadCount > 0) {
      await markAsRead(chat.id);
    }
    
    if (isMobile) {
      router.push(`/dashboard/chat/${chat.id}?type=${chat.type}&orderId=${chat.orderId || ''}&productId=${chat.productId || ''}`);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'pending':
        return <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full">Menunggu</span>;
      case 'processing':
        return <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Diproses</span>;
      case 'shipped':
        return <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">Dikirim</span>;
      case 'completed':
        return <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Selesai</span>;
      case 'cancelled':
        return <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Dibatalkan</span>;
      default:
        return null;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } else if (diffHours < 48) {
      return 'Kemarin';
    } else {
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    }
  };

  const getOtherParticipant = (chat: Conversation) => {
    const userRole = localStorage.getItem('userRole') || 'customer';
    const userId = parseInt(localStorage.getItem('userId') || '0');
    
    const other = chat.participants.find(p => p.id !== userId);
    return other || chat.participants[0];
  };

  if (isMobile && selectedId) {
    return null;
  }

  return (
    <div className="h-[calc(100vh-120px)] bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex h-full">
        {/* Chat List Panel */}
        <div className={`${isMobile ? 'w-full' : 'w-96'} border-r flex flex-col h-full`}>
          {/* Header */}
          <div className="p-4 border-b bg-white sticky top-0 z-10">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-800">Pesan</h2>
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-sm text-green-600 hover:text-green-700"
              >
                Kembali
              </button>
            </div>
            
            {/* Search */}
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari percakapan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b bg-gray-50 sticky top-[89px] z-10">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2 text-sm font-medium transition ${
                activeTab === 'all'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Semua
              {conversations.length > 0 && (
                <span className="ml-1 text-xs text-gray-400">({conversations.length})</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-2 text-sm font-medium transition ${
                activeTab === 'orders'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pesanan
              {conversations.filter(c => c.type === 'order').length > 0 && (
                <span className="ml-1 text-xs text-gray-400">
                  ({conversations.filter(c => c.type === 'order').length})
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 py-2 text-sm font-medium transition ${
                activeTab === 'admin'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Admin
              {conversations.filter(c => c.type === 'admin').length > 0 && (
                <span className="ml-1 text-xs text-gray-400">
                  ({conversations.filter(c => c.type === 'admin').length})
                </span>
              )}
            </button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Tidak ada percakapan</p>
                <p className="text-sm text-gray-400 mt-1">
                  {activeTab === 'orders' 
                    ? 'Belum ada chat dengan penjual. Chat akan muncul setelah Anda memesan produk.' 
                    : activeTab === 'admin' 
                    ? 'Hubungi admin untuk bantuan melalui tombol di bawah' 
                    : 'Mulai chat dari halaman pesanan atau hubungi admin'}
                </p>
                {activeTab === 'admin' && (
                  <button
                    onClick={() => router.push('/dashboard/chat/new?type=admin')}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
                  >
                    Chat Admin Sekarang
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredConversations.map((chat) => {
                  const otherParticipant = getOtherParticipant(chat);
                  const isUnread = chat.unreadCount > 0;
                  
                  return (
                    <div
                      key={chat.id}
                      onClick={() => handleSelectChat(chat)}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition ${
                        selectedId === chat.id ? 'bg-green-50' : ''
                      } ${isUnread ? 'bg-green-50/30' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          chat.type === 'admin' 
                            ? 'bg-blue-100' 
                            : chat.type === 'order' 
                            ? 'bg-green-100' 
                            : 'bg-gray-100'
                        }`}>
                          {chat.type === 'order' ? (
                            <Package className="w-6 h-6 text-green-600" />
                          ) : chat.type === 'admin' ? (
                            <Headphones className="w-6 h-6 text-blue-600" />
                          ) : (
                            <Store className="w-6 h-6 text-gray-600" />
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <h3 className={`font-semibold truncate ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                              {chat.title}
                              {chat.type === 'order' && chat.productName && (
                                <span className="text-xs text-gray-400 font-normal ml-1">
                                  • {chat.productName.length > 20 ? chat.productName.substring(0, 20) + '...' : chat.productName}
                                </span>
                              )}
                            </h3>
                            <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                              {formatTime(chat.lastMessageTime)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-500 truncate mt-0.5">
                            {chat.subtitle}
                          </p>
                          
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <p className={`text-xs truncate ${isUnread ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                                {chat.lastMessage}
                              </p>
                            </div>
                            {isUnread && (
                              <span className="bg-green-500 text-white text-xs rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center ml-2">
                                {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                              </span>
                            )}
                          </div>
                          
                          {chat.status && (
                            <div className="mt-1.5">
                              {getStatusBadge(chat.status)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="p-3 border-t bg-gray-50 text-center">
            <p className="text-xs text-gray-400">
              Chat akan dibalas oleh penjual atau admin dalam waktu 1x24 jam
            </p>
          </div>
        </div>

        {/* Chat Detail Panel (Desktop) */}
        {!isMobile && selectedId && (
          <div className="flex-1">
            <iframe 
              src={`/dashboard/chat/${selectedId}`}
              className="w-full h-full border-0" 
              title="Chat Detail"
            />
          </div>
        )}

        {/* Empty State */}
        {!selectedId && !isMobile && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-sm">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Pilih percakapan</h3>
              <p className="text-gray-500 text-sm mt-1">
                Pilih chat dari daftar di samping untuk memulai percakapan dengan penjual atau admin
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-xs text-gray-600">
                  <Package className="w-3 h-3" />
                  <span>Chat Pesanan</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-xs text-gray-600">
                  <Headphones className="w-3 h-3" />
                  <span>Chat Admin</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-xs text-gray-600">
                  <Clock className="w-3 h-3" />
                  <span>Respon Cepat</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}