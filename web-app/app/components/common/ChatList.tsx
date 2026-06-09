// app/components/common/ChatList.tsx
'use client';

interface Conversation {
  id: number;
  buyer?: { name: string };
  seller?: { name: string };
  lastMessage?: string;
  updatedAt?: string;
}

interface ChatListProps {
  conversations: Conversation[];
  loading: boolean;
  onSelectChat: (id: number) => void;
}

export default function ChatList({ conversations, loading, onSelectChat }: ChatListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Belum ada percakapan
      </div>
    );
  }

  return (
    <div className="divide-y">
      {conversations.map((conv) => {
        const otherUser = conv.buyer || conv.seller;
        return (
          <div
            key={conv.id}
            onClick={() => onSelectChat(conv.id)}
            className="p-4 hover:bg-gray-50 cursor-pointer transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold">
                  {otherUser?.name?.charAt(0) || '?'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {otherUser?.name || 'Pengguna'}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {conv.lastMessage || 'Mulai percakapan'}
                </p>
              </div>
              {conv.updatedAt && (
                <span className="text-xs text-gray-400">
                  {new Date(conv.updatedAt).toLocaleDateString('id-ID')}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}