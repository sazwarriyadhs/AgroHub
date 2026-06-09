'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useChatStore } from '@/lib/chatStore';
import ChatDetail from '../components/ChatDetail';

export default function ChatDetailPage() {  // ← Pastikan ada default export
  const params = useParams();
  const router = useRouter();
  const conversationId = parseInt(params?.id as string);
  
  const { activeConversation, messages, loading, fetchConversation, fetchMessages, sendMessage } = useChatStore();
  const [currentUserId, setCurrentUserId] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUserId(user.id);
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
    
    if (conversationId) {
      fetchConversation(conversationId);
      fetchMessages(conversationId);
      
      const interval = setInterval(() => {
        fetchMessages(conversationId);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [conversationId, router, fetchConversation, fetchMessages]);

  const handleSendMessage = async (message: string) => {
    if (message.trim() && conversationId) {
      await sendMessage(conversationId, message);
    }
  };

  const handleBack = () => {
    router.push('/dashboard/chat');
  };

  return (
    <div className="h-[calc(100vh-120px)] bg-white rounded-xl shadow-sm overflow-hidden">
      <ChatDetail
        conversation={activeConversation}
        messages={messages}
        currentUserId={currentUserId}
        loading={loading}
        onSendMessage={handleSendMessage}
        onBack={handleBack}
      />
    </div>
  );
}