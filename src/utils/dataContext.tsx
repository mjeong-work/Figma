import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './authContext';

// Type definitions
export interface Comment {
  id: string;
  author: string;
  authorId: string;
  text: string;
  date: string;
}

export interface Post {
  id: string;
  title: string;
  date: string;
  author: string;
  authorId: string;
  verified: boolean;
  content: string;
  image: string | null;
  likes: string[]; // Array of user IDs who liked
  comments: Comment[];
  category: 'current-students' | 'alumni' | 'all-school';
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  participants: string[]; // Array of user IDs who RSVP'd
  description: string;
  image: string;
  likes: string[]; // Array of user IDs who liked
  comments: Comment[];
  author: string;
  authorId: string;
  category?: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  category: string;
  price: number;
  condition: string;
  description: string;
  image: string;
  seller: {
    name: string;
    contact: string;
    verified: boolean;
    id: string;
  };
  postedDate: string;
  views: number;
  savedBy: string[]; // Array of user IDs who saved
}

interface DataContextType {
  // Data
  posts: Post[];
  events: Event[];
  marketplaceItems: MarketplaceItem[];
  
  // Posts
  addPost: (post: Omit<Post, 'id' | 'date' | 'likes' | 'comments' | 'authorId' | 'author' | 'verified'>) => void;
  deletePost: (postId: string) => void;
  toggleLikePost: (postId: string) => void;
  addCommentToPost: (postId: string, text: string) => void;
  deleteCommentFromPost: (postId: string, commentId: string) => void;
  isPostLiked: (postId: string) => boolean;
  
  // Events
  addEvent: (event: Omit<Event, 'id' | 'likes' | 'comments' | 'participants' | 'authorId' | 'author'>) => void;
  deleteEvent: (eventId: string) => void;
  toggleLikeEvent: (eventId: string) => void;
  addCommentToEvent: (eventId: string, text: string) => void;
  toggleRSVPEvent: (eventId: string) => void;
  isEventLiked: (eventId: string) => boolean;
  hasRSVPed: (eventId: string) => boolean;
  
  // Marketplace
  addMarketplaceItem: (item: Omit<MarketplaceItem, 'id' | 'postedDate' | 'views' | 'savedBy' | 'seller'> & { seller: Omit<MarketplaceItem['seller'], 'id'> }) => void;
  deleteMarketplaceItem: (itemId: string) => void;
  toggleSaveItem: (itemId: string) => void;
  incrementItemViews: (itemId: string) => void;
  isItemSaved: (itemId: string) => boolean;
  
  // User activity
  getUserPosts: () => Post[];
  getUserEvents: () => Event[];
  getUserMarketplaceItems: () => MarketplaceItem[];
  getUserSavedItems: () => MarketplaceItem[];
  getUserStats: () => {
    posts: number;
    eventsAttended: number;
    itemsSold: number;
    savedItems: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial mock data
const getInitialPosts = (): Post[] => [
  {
    id: '1',
    title: 'Looking for study group partners for CS101',
    date: '2025-10-28',
    author: 'Anonymous Student',
    authorId: 'demo-user-1',
    verified: true,
    content: 'Hey everyone! I\'m looking for a few people to form a study group for CS101. We can meet in the library twice a week. Anyone interested?',
    image: null,
    likes: ['demo-user-2', 'demo-user-3'],
    category: 'current-students',
    comments: [
      { id: '1', author: 'Anonymous', authorId: 'demo-user-2', text: 'I\'d be interested! What times work for you?', date: '2025-10-28' },
      { id: '2', author: 'Anonymous', authorId: 'demo-user-3', text: 'Count me in! Tuesday and Thursday evenings would be great.', date: '2025-10-29' }
    ]
  },
  {
    id: '2',
    title: 'Free pizza at the Student Center today!',
    date: '2025-10-30',
    author: 'Anonymous Student',
    authorId: 'demo-user-2',
    verified: true,
    content: 'The Computer Science club is giving away free pizza slices from 12-2pm at the Student Center. First come, first served!',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
    likes: ['demo-user-1', 'demo-user-3'],
    category: 'current-students',
    comments: [
      { id: '1', author: 'Anonymous', authorId: 'demo-user-1', text: 'OMG thank you for sharing! 🍕', date: '2025-10-30' },
      { id: '2', author: 'Anonymous', authorId: 'demo-user-3', text: 'Are there veggie options?', date: '2025-10-30' }
    ]
  },
  {
    id: '3',
    title: 'Lost: Blue backpack near Engineering building',
    date: '2025-10-29',
    author: 'Anonymous Student',
    authorId: 'demo-user-3',
    verified: true,
    content: 'I lost my blue JanSport backpack yesterday near the Engineering building. It has my laptop and textbooks. If anyone finds it, please contact the campus lost & found.',
    image: null,
    likes: [],
    category: 'current-students',
    comments: []
  },
  {
    id: '4',
    title: 'Best coffee spots on campus?',
    date: '2025-10-27',
    author: 'Anonymous Student',
    authorId: 'demo-user-1',
    verified: true,
    content: 'New transfer student here! What are the best places to grab coffee between classes? Looking for somewhere with good wifi and not too crowded.',
    image: null,
    likes: ['demo-user-2'],
    category: 'current-students',
    comments: [
      { id: '1', author: 'Anonymous', authorId: 'demo-user-2', text: 'The café in the Arts building is pretty quiet and has great cold brew!', date: '2025-10-27' }
    ]
  },
  {
    id: '5',
    title: 'Alumni networking event - Tech industry professionals',
    date: '2025-10-25',
    author: 'Anonymous Alumni',
    authorId: 'demo-user-4',
    verified: true,
    content: 'Calling all alumni working in tech! Let\'s organize a networking mixer next month. Great opportunity to connect, share experiences, and maybe even mentor current students.',
    image: null,
    likes: [],
    category: 'alumni',
    comments: []
  }
];

const getInitialEvents = (): Event[] => [
  {
    id: '1',
    title: 'Fall Semester Study Break - Free Coffee & Snacks',
    date: '2025-11-28',
    time: '2:00 PM - 4:00 PM',
    venue: 'Student Center Lounge',
    participants: ['demo-user-2'],
    description: 'Take a break from midterms! Join us for complimentary coffee, tea, and snacks. Meet other students, relax, and recharge before finals.',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
    likes: ['demo-user-1'],
    comments: [],
    author: 'Campus Events Team',
    authorId: 'admin',
    category: 'Academic'
  },
  {
    id: '2',
    title: 'International Food Festival',
    date: '2025-12-05',
    time: '5:00 PM - 8:00 PM',
    venue: 'Main Quad',
    participants: ['demo-user-1', 'demo-user-3'],
    description: 'Experience flavors from around the world! Student organizations will showcase traditional dishes from their cultures. Live music and cultural performances.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    likes: [],
    comments: [],
    author: 'Campus Events Team',
    authorId: 'admin',
    category: 'Social'
  },
  {
    id: '3',
    title: 'CS Department Career Fair',
    date: '2025-11-29',
    time: '10:00 AM - 3:00 PM',
    venue: 'Engineering Building Hall',
    participants: [],
    description: 'Meet with top tech companies and startups. Bring your resume and dress professionally. Great networking opportunity for internships and full-time positions.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    likes: ['demo-user-2'],
    comments: [],
    author: 'Campus Events Team',
    authorId: 'admin',
    category: 'Career'
  },
  {
    id: '4',
    title: 'Hackathon 2025: Build for Good',
    date: '2025-12-07',
    time: '9:00 AM - 9:00 PM',
    venue: 'Innovation Lab, Building 7',
    participants: ['demo-user-1'],
    description: '12-hour hackathon focused on social impact projects. Form teams or join solo. Prizes for top 3 teams! Food and drinks provided throughout the day.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    likes: ['demo-user-1', 'demo-user-2'],
    comments: [],
    author: 'Tech Club',
    authorId: 'demo-user-2',
    category: 'Technology'
  },
  {
    id: '5',
    title: 'Wellness Wednesday: Yoga & Meditation',
    date: '2025-11-27',
    time: '5:30 PM - 6:30 PM',
    venue: 'Recreation Center, Studio B',
    participants: ['demo-user-3'],
    description: 'De-stress with a guided yoga and meditation session. All skill levels welcome. Bring your own mat or rent one at the front desk.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    likes: ['demo-user-3'],
    comments: [],
    author: 'Wellness Center',
    authorId: 'admin',
    category: 'Wellness'
  },
  {
    id: '6',
    title: 'Alumni Speaker Series: Entrepreneurship',
    date: '2025-12-02',
    time: '6:00 PM - 7:30 PM',
    venue: 'Business School, Auditorium 101',
    participants: ['demo-user-2'],
    description: 'Hear from successful alumni entrepreneurs about their journey from campus to startup. Q&A session and networking reception to follow.',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
    likes: ['demo-user-1', 'demo-user-2'],
    comments: [],
    author: 'Alumni Relations',
    authorId: 'admin',
    category: 'Career'
  },
  {
    id: '7',
    title: 'Movie Night: Classic Film Series',
    date: '2025-12-01',
    time: '8:00 PM - 10:30 PM',
    venue: 'Student Center Theater',
    participants: ['demo-user-1', 'demo-user-2', 'demo-user-3'],
    description: 'Join us for a screening of a cinematic masterpiece! Free popcorn and drinks. Bring blankets and pillows for maximum comfort.',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    likes: ['demo-user-2', 'demo-user-3'],
    comments: [],
    author: 'Film Society',
    authorId: 'demo-user-1',
    category: 'Entertainment'
  },
  {
    id: '8',
    title: 'Campus Clean-Up Volunteer Day',
    date: '2025-11-30',
    time: '9:00 AM - 12:00 PM',
    venue: 'Meet at Main Gate',
    participants: [],
    description: 'Help keep our campus beautiful! Volunteers will receive community service hours and a free lunch. Gloves and supplies provided.',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80',
    likes: ['demo-user-1'],
    comments: [],
    author: 'Sustainability Club',
    authorId: 'demo-user-3',
    category: 'Community Service'
  },
  {
    id: '9',
    title: 'Open Mic Night',
    date: '2025-12-04',
    time: '7:00 PM - 10:00 PM',
    venue: 'Campus Coffee House',
    participants: ['demo-user-1'],
    description: 'Showcase your talent! Sign up to perform music, poetry, comedy, or spoken word. Supportive atmosphere and free coffee for performers.',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    likes: ['demo-user-1', 'demo-user-3'],
    comments: [],
    author: 'Arts Collective',
    authorId: 'demo-user-2',
    category: 'Arts & Culture'
  },
  {
    id: '10',
    title: 'Campus 5K Fun Run',
    date: '2025-12-06',
    time: '7:00 AM - 9:00 AM',
    venue: 'Starting at Athletic Center',
    participants: ['demo-user-2', 'demo-user-3'],
    description: 'Start your morning with a fun 5K run around campus! All fitness levels welcome. T-shirts for all participants and medals for top finishers.',
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&q=80',
    likes: ['demo-user-2'],
    comments: [],
    author: 'Athletic Department',
    authorId: 'admin',
    category: 'Sports'
  }
];

const getInitialMarketplace = (): MarketplaceItem[] => [
  {
    id: '1',
    title: 'Calculus Textbook - 8th Edition',
    category: 'Textbooks',
    price: 45,
    condition: 'Good',
    description: 'Stewart Calculus 8th Edition. Used for one semester, minimal highlighting. Great condition with all pages intact.',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
    seller: {
      name: 'Sarah Chen',
      contact: 's.chen@university.edu',
      verified: true,
      id: 'demo-user-2'
    },
    postedDate: '2025-10-25',
    views: 156,
    savedBy: ['demo-user-1']
  },
  {
    id: '2',
    title: 'Scientific Calculator TI-84 Plus',
    category: 'Electronics',
    price: 60,
    condition: 'Like New',
    description: 'Barely used TI-84 Plus calculator. Purchased for one math class, now switching majors. Includes USB cable and manual.',
    image: 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=800&q=80',
    seller: {
      name: 'Mike Rodriguez',
      contact: 'm.rodriguez@university.edu',
      verified: true,
      id: 'demo-user-3'
    },
    postedDate: '2025-10-28',
    views: 201,
    savedBy: []
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Initialize state from localStorage or use defaults
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('campusconnect_posts');
    return saved ? JSON.parse(saved) : getInitialPosts();
  });
  
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('campusconnect_events');
    return saved ? JSON.parse(saved) : getInitialEvents();
  });
  
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(() => {
    const saved = localStorage.getItem('campusconnect_marketplace');
    return saved ? JSON.parse(saved) : getInitialMarketplace();
  });

  // Persist to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('campusconnect_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('campusconnect_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('campusconnect_marketplace', JSON.stringify(marketplaceItems));
  }, [marketplaceItems]);

  // Post operations
  const addPost = (postData: Omit<Post, 'id' | 'date' | 'likes' | 'comments' | 'authorId' | 'author' | 'verified'>) => {
    if (!user) return;
    
    const newPost: Post = {
      ...postData,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      author: user.name,
      authorId: user.id,
      verified: user.verified,
      likes: [],
      comments: []
    };
    
    setPosts(prev => [newPost, ...prev]);
  };

  const deletePost = (postId: string) => {
    if (!user) return;
    setPosts(prev => prev.filter(p => {
      if (p.id === postId) {
        return p.authorId !== user.id && user.role !== 'Administrator';
      }
      return true;
    }));
  };

  const toggleLikePost = (postId: string) => {
    if (!user) return;
    
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const likes = post.likes.includes(user.id)
          ? post.likes.filter(id => id !== user.id)
          : [...post.likes, user.id];
        return { ...post, likes };
      }
      return post;
    }));
  };

  const addCommentToPost = (postId: string, text: string) => {
    if (!user || !text.trim()) return;
    
    const newComment: Comment = {
      id: Date.now().toString(),
      author: user.name,
      authorId: user.id,
      text: text.trim(),
      date: new Date().toISOString().split('T')[0]
    };
    
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    }));
  };

  const deleteCommentFromPost = (postId: string, commentId: string) => {
    if (!user) return;
    
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.filter(c => {
            if (c.id === commentId) {
              return c.authorId !== user.id && user.role !== 'Administrator';
            }
            return true;
          })
        };
      }
      return post;
    }));
  };

  const isPostLiked = (postId: string): boolean => {
    if (!user) return false;
    const post = posts.find(p => p.id === postId);
    return post ? post.likes.includes(user.id) : false;
  };

  // Event operations
  const addEvent = (eventData: Omit<Event, 'id' | 'likes' | 'comments' | 'participants' | 'authorId' | 'author'>) => {
    if (!user) return;
    
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      author: user.name || 'Anonymous Student',
      authorId: user.id,
      participants: [],
      likes: [],
      comments: []
    };
    
    setEvents(prev => [newEvent, ...prev]);
  };

  const deleteEvent = (eventId: string) => {
    if (!user) return;
    setEvents(prev => prev.filter(e => {
      if (e.id === eventId) {
        return e.authorId !== user.id && user.role !== 'Administrator';
      }
      return true;
    }));
  };

  const toggleLikeEvent = (eventId: string) => {
    if (!user) return;
    
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        const likes = event.likes.includes(user.id)
          ? event.likes.filter(id => id !== user.id)
          : [...event.likes, user.id];
        return { ...event, likes };
      }
      return event;
    }));
  };

  const addCommentToEvent = (eventId: string, text: string) => {
    if (!user || !text.trim()) return;
    
    const newComment: Comment = {
      id: Date.now().toString(),
      author: user.name,
      authorId: user.id,
      text: text.trim(),
      date: new Date().toISOString().split('T')[0]
    };
    
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        return { ...event, comments: [...event.comments, newComment] };
      }
      return event;
    }));
  };

  const toggleRSVPEvent = (eventId: string) => {
    if (!user) return;
    
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        const participants = event.participants.includes(user.id)
          ? event.participants.filter(id => id !== user.id)
          : [...event.participants, user.id];
        return { ...event, participants };
      }
      return event;
    }));
  };

  const isEventLiked = (eventId: string): boolean => {
    if (!user) return false;
    const event = events.find(e => e.id === eventId);
    return event ? event.likes.includes(user.id) : false;
  };

  const hasRSVPed = (eventId: string): boolean => {
    if (!user) return false;
    const event = events.find(e => e.id === eventId);
    return event ? event.participants.includes(user.id) : false;
  };

  // Marketplace operations
  const addMarketplaceItem = (itemData: Omit<MarketplaceItem, 'id' | 'postedDate' | 'views' | 'savedBy' | 'seller'> & { seller: Omit<MarketplaceItem['seller'], 'id'> }) => {
    if (!user) return;
    
    const newItem: MarketplaceItem = {
      ...itemData,
      id: Date.now().toString(),
      postedDate: new Date().toISOString().split('T')[0],
      views: 0,
      savedBy: [],
      seller: {
        ...itemData.seller,
        id: user.id
      }
    };
    
    setMarketplaceItems(prev => [newItem, ...prev]);
  };

  const deleteMarketplaceItem = (itemId: string) => {
    if (!user) return;
    setMarketplaceItems(prev => prev.filter(item => {
      if (item.id === itemId) {
        return item.seller.id !== user.id && user.role !== 'Administrator';
      }
      return true;
    }));
  };

  const toggleSaveItem = (itemId: string) => {
    if (!user) return;
    
    setMarketplaceItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const savedBy = item.savedBy.includes(user.id)
          ? item.savedBy.filter(id => id !== user.id)
          : [...item.savedBy, user.id];
        return { ...item, savedBy };
      }
      return item;
    }));
  };

  const incrementItemViews = (itemId: string) => {
    setMarketplaceItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, views: item.views + 1 };
      }
      return item;
    }));
  };

  const isItemSaved = (itemId: string): boolean => {
    if (!user) return false;
    const item = marketplaceItems.find(i => i.id === itemId);
    return item ? item.savedBy.includes(user.id) : false;
  };

  // User activity
  const getUserPosts = (): Post[] => {
    if (!user) return [];
    return posts.filter(p => p.authorId === user.id);
  };

  const getUserEvents = (): Event[] => {
    if (!user) return [];
    return events.filter(e => e.participants.includes(user.id));
  };

  const getUserMarketplaceItems = (): MarketplaceItem[] => {
    if (!user) return [];
    return marketplaceItems.filter(item => item.seller.id === user.id);
  };

  const getUserSavedItems = (): MarketplaceItem[] => {
    if (!user) return [];
    return marketplaceItems.filter(item => item.savedBy.includes(user.id));
  };

  const getUserStats = () => {
    if (!user) return { posts: 0, eventsAttended: 0, itemsSold: 0, savedItems: 0 };
    
    return {
      posts: posts.filter(p => p.authorId === user.id).length,
      eventsAttended: events.filter(e => e.participants.includes(user.id)).length,
      itemsSold: marketplaceItems.filter(item => item.seller.id === user.id).length,
      savedItems: marketplaceItems.filter(item => item.savedBy.includes(user.id)).length
    };
  };

  return (
    <DataContext.Provider
      value={{
        posts,
        events,
        marketplaceItems,
        addPost,
        deletePost,
        toggleLikePost,
        addCommentToPost,
        deleteCommentFromPost,
        isPostLiked,
        addEvent,
        deleteEvent,
        toggleLikeEvent,
        addCommentToEvent,
        toggleRSVPEvent,
        isEventLiked,
        hasRSVPed,
        addMarketplaceItem,
        deleteMarketplaceItem,
        toggleSaveItem,
        incrementItemViews,
        isItemSaved,
        getUserPosts,
        getUserEvents,
        getUserMarketplaceItems,
        getUserSavedItems,
        getUserStats
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};