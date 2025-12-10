import React, { useState, useEffect } from 'react';
import { ChatWindow } from './ChatWindow';

interface OpenChat {
  conversationId: string;
  isMinimized: boolean;
}

export const ChatManager: React.FC = () => {
  const [openChats, setOpenChats] = useState<OpenChat[]>([]);

  useEffect(() => {
    console.log('🟢 ChatManager mounted');
    
    const handleOpenChat = (e: CustomEvent) => {
      console.log('📥 ChatManager received openChat event:', e.detail);
      const { conversationId } = e.detail;
      
      setOpenChats((prev) => {
        console.log('🟢 Current open chats:', prev);
        // Check if chat is already open
        const existing = prev.find((c) => c.conversationId === conversationId);
        if (existing) {
          console.log('🟢 Chat already exists, expanding if minimized');
          // If minimized, expand it
          return prev.map((c) =>
            c.conversationId === conversationId ? { ...c, isMinimized: false } : c
          );
        }
        console.log('🟢 Adding new chat window');
        // Add new chat
        const newChats = [...prev, { conversationId, isMinimized: false }];
        console.log('🟢 New open chats:', newChats);
        return newChats;
      });
    };

    window.addEventListener('openChat', handleOpenChat as EventListener);
    console.log('✅ ChatManager event listener registered');
    
    return () => {
      console.log('🔴 ChatManager unmounting');
      window.removeEventListener('openChat', handleOpenChat as EventListener);
    };
  }, []);
  
  console.log('🟢 ChatManager rendering with chats:', openChats);

  const handleCloseChat = (conversationId: string) => {
    setOpenChats((prev) => prev.filter((c) => c.conversationId !== conversationId));
  };

  const handleMinimizeChat = (conversationId: string) => {
    setOpenChats((prev) =>
      prev.map((c) =>
        c.conversationId === conversationId ? { ...c, isMinimized: !c.isMinimized } : c
      )
    );
  };

  return (
    <>
      {openChats.map((chat, index) => (
        <div
          key={chat.conversationId}
          style={{
            position: 'fixed',
            bottom: 0,
            right: `${16 + index * 336}px`, // 320px width + 16px gap
            zIndex: 50,
          }}
        >
          <ChatWindow
            conversationId={chat.conversationId}
            onClose={() => handleCloseChat(chat.conversationId)}
            onMinimize={() => handleMinimizeChat(chat.conversationId)}
            isMinimized={chat.isMinimized}
          />
        </div>
      ))}
    </>
  );
};
