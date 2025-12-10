import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './authContext';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  imageUrl?: string;
  timestamp: number;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: {
    userId: string;
    userName: string;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: number;
  context?: {
    type: 'marketplace' | 'event';
    itemId: string;
    itemTitle: string;
  };
}

interface ChatContextType {
  conversations: Conversation[];
  messages: Message[];
  getOrCreateConversation: (otherUserId: string, otherUserName: string, context?: Conversation['context']) => string;
  sendMessage: (conversationId: string, content: string, imageUrl?: string) => void;
  markAsRead: (conversationId: string) => void;
  getConversationMessages: (conversationId: string) => Message[];
  getConversation: (conversationId: string) => Conversation | undefined;
  getTotalUnreadCount: () => number;
  deleteConversation: (conversationId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Generate sample data function
const generateSampleData = (currentUserId: string, currentUserName: string) => {
  const now = Date.now();

  const sampleMessages: Message[] = [
    // Sarah Chen - MacBook conversation
    {
      id: 'msg_1',
      conversationId: 'conv_1',
      senderId: currentUserId,
      senderName: currentUserName,
      content: 'Hi! Is the MacBook still available?',
      timestamp: now - 7200000,
      read: true,
    },
    {
      id: 'msg_2',
      conversationId: 'conv_1',
      senderId: 'user_sarah',
      senderName: 'Sarah Chen',
      content: 'Yes, it is! Are you interested?',
      timestamp: now - 7000000,
      read: true,
    },
    {
      id: 'msg_3',
      conversationId: 'conv_1',
      senderId: currentUserId,
      senderName: currentUserName,
      content: 'Definitely! Can I see it tomorrow?',
      timestamp: now - 6900000,
      read: true,
    },
    {
      id: 'msg_4',
      conversationId: 'conv_1',
      senderId: 'user_sarah',
      senderName: 'Sarah Chen',
      content: 'Sure! I\'m free after 3pm. How about meeting at the library?',
      timestamp: now - 1800000,
      read: false,
    },
    {
      id: 'msg_5',
      conversationId: 'conv_1',
      senderId: 'user_sarah',
      senderName: 'Sarah Chen',
      content: 'Does that work for you?',
      timestamp: now - 1200000,
      read: false,
    },
    // Michael Rodriguez - Career Fair
    {
      id: 'msg_6',
      conversationId: 'conv_2',
      senderId: 'user_michael',
      senderName: 'Michael Rodriguez',
      content: 'Hey! I\'m organizing the Career Fair. Would you be interested in helping out?',
      timestamp: now - 86400000,
      read: true,
    },
    {
      id: 'msg_7',
      conversationId: 'conv_2',
      senderId: currentUserId,
      senderName: currentUserName,
      content: 'That sounds great! What do you need help with?',
      timestamp: now - 86000000,
      read: true,
    },
    {
      id: 'msg_8',
      conversationId: 'conv_2',
      senderId: 'user_michael',
      senderName: 'Michael Rodriguez',
      content: 'Mainly greeting companies and helping with setup. It would be from 8am-12pm.',
      timestamp: now - 85800000,
      read: true,
    },
    {
      id: 'msg_9',
      conversationId: 'conv_2',
      senderId: currentUserId,
      senderName: currentUserName,
      content: 'Perfect! Count me in 👍',
      timestamp: now - 85600000,
      read: true,
    },
    // Emma Johnson - Textbook
    {
      id: 'msg_10',
      conversationId: 'conv_3',
      senderId: currentUserId,
      senderName: currentUserName,
      content: 'Hi Emma! Is the Calculus textbook still available?',
      timestamp: now - 172800000,
      read: true,
    },
    {
      id: 'msg_11',
      conversationId: 'conv_3',
      senderId: 'user_emma',
      senderName: 'Emma Johnson',
      content: 'Sorry, I just sold it yesterday 😕',
      timestamp: now - 172600000,
      read: true,
    },
    {
      id: 'msg_12',
      conversationId: 'conv_3',
      senderId: currentUserId,
      senderName: currentUserName,
      content: 'No worries! Thanks for letting me know',
      timestamp: now - 172400000,
      read: true,
    },
    // Alex Kim - Tech Talk
    {
      id: 'msg_13',
      conversationId: 'conv_4',
      senderId: currentUserId,
      senderName: currentUserName,
      content: 'Hey Alex! I saw your tech talk event. What time does it start?',
      timestamp: now - 259200000,
      read: true,
    },
    {
      id: 'msg_14',
      conversationId: 'conv_4',
      senderId: 'user_alex',
      senderName: 'Alex Kim',
      content: 'It starts at 6pm in the Engineering building, room 201!',
      timestamp: now - 259000000,
      read: true,
    },
    {
      id: 'msg_15',
      conversationId: 'conv_4',
      senderId: 'user_alex',
      senderName: 'Alex Kim',
      content: 'We\'ll have free pizza too 🍕',
      timestamp: now - 3600000,
      read: false,
    },
    // Olivia Martinez - Guitar
    {
      id: 'msg_16',
      conversationId: 'conv_5',
      senderId: currentUserId,
      senderName: currentUserName,
      content: 'Hi! I\'m interested in the guitar. Is it good for beginners?',
      timestamp: now - 432000000,
      read: true,
    },
    {
      id: 'msg_17',
      conversationId: 'conv_5',
      senderId: 'user_olivia',
      senderName: 'Olivia Martinez',
      content: 'Yes! It\'s perfect for beginners. I learned on this guitar myself',
      timestamp: now - 431800000,
      read: true,
    },
    {
      id: 'msg_18',
      conversationId: 'conv_5',
      senderId: currentUserId,
      senderName: currentUserName,
      content: 'Awesome! Can we meet this weekend?',
      timestamp: now - 431600000,
      read: true,
    },
    {
      id: 'msg_19',
      conversationId: 'conv_5',
      senderId: 'user_olivia',
      senderName: 'Olivia Martinez',
      content: 'Sure! Saturday afternoon works for me',
      timestamp: now - 431400000,
      read: true,
    },
  ];

  const sampleConversations: Conversation[] = [
    {
      id: 'conv_1',
      participants: [
        { userId: currentUserId, userName: currentUserName },
        { userId: 'user_sarah', userName: 'Sarah Chen' },
      ],
      lastMessage: sampleMessages[4],
      unreadCount: 2,
      createdAt: now - 7200000,
      context: {
        type: 'marketplace',
        itemId: '3',
        itemTitle: 'MacBook Pro 13" 2020',
      },
    },
    {
      id: 'conv_2',
      participants: [
        { userId: currentUserId, userName: currentUserName },
        { userId: 'user_michael', userName: 'Michael Rodriguez' },
      ],
      lastMessage: sampleMessages[8],
      unreadCount: 0,
      createdAt: now - 86400000,
      context: {
        type: 'event',
        itemId: 'evt_1',
        itemTitle: 'Career Fair 2025',
      },
    },
    {
      id: 'conv_3',
      participants: [
        { userId: currentUserId, userName: currentUserName },
        { userId: 'user_emma', userName: 'Emma Johnson' },
      ],
      lastMessage: sampleMessages[11],
      unreadCount: 0,
      createdAt: now - 172800000,
      context: {
        type: 'marketplace',
        itemId: '1',
        itemTitle: 'Calculus Textbook - 8th Edition',
      },
    },
    {
      id: 'conv_4',
      participants: [
        { userId: currentUserId, userName: currentUserName },
        { userId: 'user_alex', userName: 'Alex Kim' },
      ],
      lastMessage: sampleMessages[14],
      unreadCount: 1,
      createdAt: now - 259200000,
      context: {
        type: 'event',
        itemId: 'evt_2',
        itemTitle: 'Tech Talk: AI in Healthcare',
      },
    },
    {
      id: 'conv_5',
      participants: [
        { userId: currentUserId, userName: currentUserName },
        { userId: 'user_olivia', userName: 'Olivia Martinez' },
      ],
      lastMessage: sampleMessages[18],
      unreadCount: 0,
      createdAt: now - 432000000,
      context: {
        type: 'marketplace',
        itemId: '5',
        itemTitle: 'Guitar - Acoustic Yamaha',
      },
    },
  ];

  return { sampleConversations, sampleMessages };
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  // Initialize with sample data immediately
  const initialData = currentUser
    ? generateSampleData(currentUser.id, currentUser.displayName)
    : { sampleConversations: [], sampleMessages: [] };

  const [conversations, setConversations] = useState<Conversation[]>(initialData.sampleConversations);
  const [messages, setMessages] = useState<Message[]>(initialData.sampleMessages);

  const getOrCreateConversation = (
    otherUserId: string,
    otherUserName: string,
    context?: Conversation['context']
  ): string => {
    if (!currentUser) return '';

    const existingConversation = conversations.find((conv) => {
      const participantIds = conv.participants.map((p) => p.userId);
      return (
        participantIds.includes(currentUser.id) &&
        participantIds.includes(otherUserId) &&
        participantIds.length === 2
      );
    });

    if (existingConversation) {
      return existingConversation.id;
    }

    const newConversation: Conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      participants: [
        { userId: currentUser.id, userName: currentUser.displayName },
        { userId: otherUserId, userName: otherUserName },
      ],
      unreadCount: 0,
      createdAt: Date.now(),
      context,
    };

    setConversations((prev) => [newConversation, ...prev]);
    return newConversation.id;
  };

  const sendMessage = (conversationId: string, content: string, imageUrl?: string) => {
    if (!currentUser) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      content,
      imageUrl,
      timestamp: Date.now(),
      read: false,
    };

    setMessages((prev) => [...prev, newMessage]);

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return { ...conv, lastMessage: newMessage };
        }
        return conv;
      })
    );
  };

  const markAsRead = (conversationId: string) => {
    if (!currentUser) return;

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.conversationId === conversationId && msg.senderId !== currentUser.id) {
          return { ...msg, read: true };
        }
        return msg;
      })
    );

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return { ...conv, unreadCount: 0 };
        }
        return conv;
      })
    );
  };

  const getConversationMessages = (conversationId: string): Message[] => {
    return messages
      .filter((msg) => msg.conversationId === conversationId)
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  const getConversation = (conversationId: string): Conversation | undefined => {
    return conversations.find((conv) => conv.id === conversationId);
  };

  const getTotalUnreadCount = (): number => {
    if (!currentUser) return 0;

    return messages.filter(
      (msg) =>
        !msg.read &&
        msg.senderId !== currentUser.id &&
        conversations.some(
          (conv) =>
            conv.id === msg.conversationId &&
            conv.participants.some((p) => p.userId === currentUser.id)
        )
    ).length;
  };

  const deleteConversation = (conversationId: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));
    setMessages((prev) => prev.filter((msg) => msg.conversationId !== conversationId));
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        messages,
        getOrCreateConversation,
        sendMessage,
        markAsRead,
        getConversationMessages,
        getConversation,
        getTotalUnreadCount,
        deleteConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
