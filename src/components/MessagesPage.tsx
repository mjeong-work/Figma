import { useState } from 'react';
import { NavigationBar } from './NavigationBar';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Send, MoreHorizontal, Calendar, ShoppingBag, MessageCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Sample conversation data
const sampleConversations = [
  {
    id: 'conv_1',
    otherUser: {
      name: 'Sarah Chen',
      avatar: 'S',
    },
    lastMessage: {
      text: 'Does that work for you?',
      timestamp: Date.now() - 1200000,
      isFromMe: false,
      unread: true,
    },
    context: 'Re: MacBook Pro 13" 2020',
    unreadCount: 2,
    originalPost: {
      type: 'marketplace' as const,
      title: 'MacBook Pro 13" 2020',
      image: 'https://images.unsplash.com/photo-1551533390-b80b6ffa7816?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNib29rJTIwcHJvJTIwbGFwdG9wfGVufDF8fHx8MTc2NDE0MzkwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: '$850 · Excellent condition, includes charger',
    },
  },
  {
    id: 'conv_2',
    otherUser: {
      name: 'Michael Rodriguez',
      avatar: 'M',
    },
    lastMessage: {
      text: 'Perfect! Count me in 👍',
      timestamp: Date.now() - 85600000,
      isFromMe: true,
      unread: false,
    },
    context: 'Re: Career Fair 2025',
    unreadCount: 0,
    originalPost: {
      type: 'event' as const,
      title: 'Career Fair 2025',
      image: 'https://images.unsplash.com/photo-1633110007230-0dd08905731a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJlZXIlMjBmYWlyJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzY0MjA0NDMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'March 15, 2025 · 9:00 AM · Student Union',
    },
  },
  {
    id: 'conv_3',
    otherUser: {
      name: 'Emma Johnson',
      avatar: 'E',
    },
    lastMessage: {
      text: 'No worries! Thanks for letting me know',
      timestamp: Date.now() - 172400000,
      isFromMe: true,
      unread: false,
    },
    context: 'Re: Calculus Textbook - 8th Edition',
    unreadCount: 0,
    originalPost: {
      type: 'marketplace' as const,
      title: 'Calculus Textbook - 8th Edition',
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxjdWx1cyUyMHRleHRib29rJTIwbWF0aGVtYXRpY3N8ZW58MXx8fHwxNzY0MjA0NDMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: '$45 · Like new, minimal highlighting',
    },
  },
  {
    id: 'conv_4',
    otherUser: {
      name: 'Alex Kim',
      avatar: 'A',
    },
    lastMessage: {
      text: 'We\'ll have free pizza too 🍕',
      timestamp: Date.now() - 3600000,
      isFromMe: false,
      unread: true,
    },
    context: 'Re: Tech Talk: AI in Healthcare',
    unreadCount: 1,
    originalPost: {
      type: 'event' as const,
      title: 'Tech Talk: AI in Healthcare',
      image: 'https://images.unsplash.com/photo-1582192904915-d89c7250b235?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwY29uZmVyZW5jZSUyMHByZXNlbnRhdGlvbnxlbnwxfHx8fDE3NjQxMzQwNzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Tonight at 6:00 PM · Engineering Bldg 201',
    },
  },
  {
    id: 'conv_5',
    otherUser: {
      name: 'Olivia Martinez',
      avatar: 'O',
    },
    lastMessage: {
      text: 'Sure! Saturday afternoon works for me',
      timestamp: Date.now() - 431400000,
      isFromMe: false,
      unread: false,
    },
    context: 'Re: Guitar - Acoustic Yamaha',
    unreadCount: 0,
    originalPost: {
      type: 'marketplace' as const,
      title: 'Guitar - Acoustic Yamaha',
      image: 'https://images.unsplash.com/photo-1625873378628-2ca373964b39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY291c3RpYyUyMGd1aXRhciUyMHlhbWFoYXxlbnwxfHx8fDE3NjQyMDQ0MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: '$180 · Great for beginners',
    },
  },
];

// Sample messages for each conversation
const sampleMessages: Record<string, any[]> = {
  conv_1: [
    {
      id: 'msg_1',
      text: 'Hi! Is the MacBook still available?',
      timestamp: Date.now() - 7200000,
      isFromMe: true,
    },
    {
      id: 'msg_2',
      text: 'Yes, it is! Are you interested?',
      timestamp: Date.now() - 7000000,
      isFromMe: false,
    },
    {
      id: 'msg_3',
      text: 'Definitely! Can I see it tomorrow?',
      timestamp: Date.now() - 6900000,
      isFromMe: true,
    },
    {
      id: 'msg_4',
      text: 'Sure! I\'m free after 3pm. How about meeting at the library?',
      timestamp: Date.now() - 1800000,
      isFromMe: false,
    },
    {
      id: 'msg_5',
      text: 'Does that work for you?',
      timestamp: Date.now() - 1200000,
      isFromMe: false,
    },
  ],
  conv_2: [
    {
      id: 'msg_6',
      text: 'Hey! I\'m organizing the Career Fair. Would you be interested in helping out?',
      timestamp: Date.now() - 86400000,
      isFromMe: false,
    },
    {
      id: 'msg_7',
      text: 'That sounds great! What do you need help with?',
      timestamp: Date.now() - 86000000,
      isFromMe: true,
    },
    {
      id: 'msg_8',
      text: 'Mainly greeting companies and helping with setup. It would be from 8am-12pm.',
      timestamp: Date.now() - 85800000,
      isFromMe: false,
    },
    {
      id: 'msg_9',
      text: 'Perfect! Count me in 👍',
      timestamp: Date.now() - 85600000,
      isFromMe: true,
    },
  ],
  conv_3: [
    {
      id: 'msg_10',
      text: 'Hi Emma! Is the Calculus textbook still available?',
      timestamp: Date.now() - 172800000,
      isFromMe: true,
    },
    {
      id: 'msg_11',
      text: 'Sorry, I just sold it yesterday 😕',
      timestamp: Date.now() - 172600000,
      isFromMe: false,
    },
    {
      id: 'msg_12',
      text: 'No worries! Thanks for letting me know',
      timestamp: Date.now() - 172400000,
      isFromMe: true,
    },
  ],
  conv_4: [
    {
      id: 'msg_13',
      text: 'Hey Alex! I saw your tech talk event. What time does it start?',
      timestamp: Date.now() - 259200000,
      isFromMe: true,
    },
    {
      id: 'msg_14',
      text: 'It starts at 6pm in the Engineering building, room 201!',
      timestamp: Date.now() - 259000000,
      isFromMe: false,
    },
    {
      id: 'msg_15',
      text: 'We\'ll have free pizza too 🍕',
      timestamp: Date.now() - 3600000,
      isFromMe: false,
    },
  ],
  conv_5: [
    {
      id: 'msg_16',
      text: 'Hi! I\'m interested in the guitar. Is it good for beginners?',
      timestamp: Date.now() - 432000000,
      isFromMe: true,
    },
    {
      id: 'msg_17',
      text: 'Yes! It\'s perfect for beginners. I learned on this guitar myself',
      timestamp: Date.now() - 431800000,
      isFromMe: false,
    },
    {
      id: 'msg_18',
      text: 'Awesome! Can we meet this weekend?',
      timestamp: Date.now() - 431600000,
      isFromMe: true,
    },
    {
      id: 'msg_19',
      text: 'Sure! Saturday afternoon works for me',
      timestamp: Date.now() - 431400000,
      isFromMe: false,
    },
  ],
};

export const MessagesPage: React.FC = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  const selectedConversation = sampleConversations.find(
    (conv) => conv.id === selectedConversationId
  );

  // Filter conversations based on tab
  const filteredConversations = selectedTab === 'unread' 
    ? sampleConversations.filter(conv => conv.unreadCount > 0)
    : sampleConversations;

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatMessageTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const handleSend = () => {
    if (!messageText.trim()) return;
    // In a real app, this would send the message
    setMessageText('');
  };

  // If viewing a conversation (mobile or desktop detail view)
  if (selectedConversationId && selectedConversation) {
    return (
      <div className="min-h-screen bg-white">
        <NavigationBar activeTab="messages" />

        {/* Chat Header - Threads Style */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-[#f0f0f0] z-10">
          <div className="max-w-[640px] mx-auto px-4">
            <div className="flex items-center gap-3 py-3">
              <button 
                onClick={() => setSelectedConversationId(null)}
                className="p-2 -ml-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4D8CFF] to-[#0B5FFF] flex items-center justify-center text-white shrink-0 font-[Roboto]">
                {selectedConversation.otherUser.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold">{selectedConversation.otherUser.name}</h3>
                {selectedConversation.context && (
                  <p className="text-xs text-[#999] truncate">{selectedConversation.context}</p>
                )}
              </div>
              <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <MoreHorizontal className="w-5 h-5 text-[#999]" />
              </button>
            </div>
          </div>
        </div>

        {/* Original Post Context Card */}
        {selectedConversation.originalPost && (
          <div className="max-w-[640px] mx-auto px-4 pt-4">
            <div className="bg-[#f8f9fb] border border-[#e5e7eb] rounded-[10px] p-3 flex gap-3 hover:bg-[#f0f2f5] transition-colors cursor-pointer">
              {/* Thumbnail */}
              <div className="shrink-0">
                <ImageWithFallback
                  src={selectedConversation.originalPost.image}
                  alt={selectedConversation.originalPost.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Type Badge */}
                <div className="flex items-center gap-1.5 mb-1">
                  {selectedConversation.originalPost.type === 'marketplace' && (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5 text-[#0B5FFF]" />
                      <span className="text-[10px] text-[rgb(11,95,255)] uppercase tracking-wide font-[Roboto]">Marketplace</span>
                    </>
                  )}
                  {selectedConversation.originalPost.type === 'event' && (
                    <>
                      <Calendar className="w-3.5 h-3.5 text-[#0B5FFF]" />
                      <span className="text-[10px] text-[#8b5cf6] uppercase tracking-wide">Event</span>
                    </>
                  )}
                  {selectedConversation.originalPost.type === 'community' && (
                    <>
                      <MessageCircle className="w-3.5 h-3.5 text-[#0B5FFF]" />
                      <span className="text-[10px] text-[#10b981] uppercase tracking-wide">Community</span>
                    </>
                  )}
                </div>
                
                {/* Title */}
                <h4 className="text-sm font-semibold text-black mb-0.5 truncate font-[Roboto]">
                  {selectedConversation.originalPost.title}
                </h4>
                
                {/* Description */}
                <p className="text-xs text-[#666] truncate font-[Roboto]">
                  {selectedConversation.originalPost.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Messages - 640px max-width */}
        <main className="max-w-[640px] mx-auto pb-20">
          <div className="px-4 py-6 space-y-4">
            {sampleMessages[selectedConversationId]?.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isFromMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] ${
                    message.isFromMe
                      ? 'bg-gradient-to-br from-[#4D8CFF] to-[#0B5FFF] text-white'
                      : 'bg-[#2a2a2a] text-white'
                  } rounded-2xl px-4 py-2`}
                >
                  <p className="text-sm font-[Roboto]">{message.text}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      message.isFromMe ? 'text-white/70' : 'text-white/70'
                    }`}
                  >
                    {formatMessageTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Message Input - Fixed at bottom, 640px max-width */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#f0f0f0]">
          <div className="max-w-[640px] mx-auto px-4 py-3">
            <div className="flex items-center gap-2">
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Message..."
                className="flex-1 border-[#f0f0f0] rounded-full px-4"
              />
              <Button
                onClick={handleSend}
                disabled={!messageText.trim()}
                className="rounded-full w-10 h-10 p-0 bg-gradient-to-br from-[#4D8CFF] to-[#0B5FFF] hover:from-[#3D7EF0] hover:to-[#0A54E6] font-[Roboto]"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Conversation List View - Threads Style (matches Community/Events/Marketplace)
  return (
    <div className="min-h-screen bg-white">
      <NavigationBar activeTab="messages" />

      {/* Header - Threads Style */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <div className="max-w-[640px] mx-auto px-4 border-b border-[#f0f0f0]">
          {/* Title */}
          <div className="flex items-center justify-between py-3">
            <h1 className="text-2xl font-[Bayon]">Messages</h1>
          </div>

          {/* Tabs - Underline style like Community/Events/Marketplace */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="w-full bg-transparent border-0 p-0 h-auto justify-start gap-8">
              <TabsTrigger 
                value="all" 
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-0 pb-3 data-[state=active]:shadow-none"
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="unread" 
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-0 pb-3 data-[state=active]:shadow-none"
              >
                Unread
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Conversations Feed - 640px max-width */}
      <main className="max-w-[640px] mx-auto">
        {filteredConversations.length > 0 ? (
          <div>
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="border-b border-[#f0f0f0] px-4 py-4 hover:bg-[#fafafa] cursor-pointer transition-colors"
                onClick={() => setSelectedConversationId(conversation.id)}
              >
                <div className="flex gap-3">
                  {/* Avatar */}
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4D8CFF] to-[#0B5FFF] flex items-center justify-center text-white font-[Roboto]">
                      {conversation.otherUser.avatar}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span
                        className={`text-sm truncate font-[Roboto] ${
                          conversation.unreadCount > 0 ? 'font-semibold text-black' : 'text-black'
                        }`}
                      >
                        {conversation.otherUser.name}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[#999] text-xs font-[Roboto] text-[13px]">
                          {formatTime(conversation.lastMessage.timestamp)}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <div className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-[rgb(11,95,255)] text-white text-[11px] flex items-center justify-center font-semibold font-[Roboto]">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>

                    {conversation.context && (
                      <div className="text-xs text-[#999] mb-1 truncate font-[Roboto] text-[14px]">{conversation.context}</div>
                    )}

                    <p
                      className={`text-[14px] truncate font-[Roboto] ${
                        conversation.unreadCount > 0 ? 'text-[#333]' : 'text-[#999]'
                      }`}
                    >
                      {conversation.lastMessage.isFromMe && 'You: '}
                      {conversation.lastMessage.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 px-4 text-center">
            <p className="text-[#999] text-sm">No unread messages</p>
          </div>
        )}
      </main>
    </div>
  );
};