import { User, Item, Request, Message, Notification, Review } from '@/lib/types';
import { mockUsers, mockItems, mockRequests, mockMessages, mockNotifications, mockReviews } from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API
export const authApi = {
  signIn: async (email: string, password: string): Promise<User> => {
    await delay(800);
    
    // Check password first
    if (password !== 'password') {
      throw new Error('Invalid email or password');
    }
    
    // Find existing user or create a new one
    let user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      // Create a new user for any email with correct password
      const newUser: User = {
        id: String(mockUsers.length + 1),
        email: email,
        name: email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'User',
        avatar: `https://i.pravatar.cc/150?u=${email}`,
        bio: '',
        phone: '',
        location: {
          city: '',
          state: '',
          country: 'USA',
        },
        verification: {
          email: false,
          phone: false,
          governmentId: 'not_started',
          address: false,
        },
        stats: {
          rating: 0,
          reviewCount: 0,
          totalBorrowed: 0,
          totalLent: 0,
          activeRentals: 0,
          responseRate: 0,
          responseTime: '',
          memberSince: new Date(),
          completionRate: 0,
        },
        preferences: {
          searchRadius: 25,
          defaultPickupWindow: 'Flexible',
          notificationLevel: 'all',
          emailDigest: true,
          pushEnabled: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUsers.push(newUser);
      user = newUser;
    }
    
    return user;
  },

  signUp: async (data: { email: string; password: string; name: string }): Promise<User> => {
    await delay(1000);
    const newUser: User = {
      id: String(mockUsers.length + 1),
      email: data.email,
      name: data.name,
      location: {
        city: '',
        state: '',
        country: 'USA',
      },
      verification: {
        email: false,
        phone: false,
        governmentId: 'not_started',
        address: false,
      },
      stats: {
        rating: 0,
        reviewCount: 0,
        totalBorrowed: 0,
        totalLent: 0,
        activeRentals: 0,
        responseRate: 0,
        responseTime: '',
        memberSince: new Date(),
        completionRate: 0,
      },
      preferences: {
        searchRadius: 25,
        defaultPickupWindow: 'Flexible',
        notificationLevel: 'all',
        emailDigest: true,
        pushEnabled: false,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUsers.push(newUser);
    return newUser;
  },

  getCurrentUser: async (): Promise<User | null> => {
    await delay(300);
    return mockUsers[0] || null;
  },
};

// Items API
export const itemsApi = {
  getAll: async (filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: string;
  }): Promise<Item[]> => {
    await delay(500);
    let items = [...mockItems.filter(item => item.status === 'published')];

    if (filters?.category) {
      items = items.filter(item => item.category === filters.category);
    }

    if (filters?.minPrice !== undefined) {
      items = items.filter(item => item.pricePerDay >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
      items = items.filter(item => item.pricePerDay <= filters.maxPrice!);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      items = items.filter(
        item =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filters?.sort) {
      switch (filters.sort) {
        case 'price_low':
          items.sort((a, b) => a.pricePerDay - b.pricePerDay);
          break;
        case 'price_high':
          items.sort((a, b) => b.pricePerDay - a.pricePerDay);
          break;
        case 'newest':
          items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
        case 'rating':
          items.sort((a, b) => b.metadata.rating - a.metadata.rating);
          break;
      }
    }

    return items;
  },

  getById: async (id: string): Promise<Item | null> => {
    await delay(300);
    const item = mockItems.find(item => item.id === id);
    if (item) {
      item.metadata.views++;
    }
    return item || null;
  },

  create: async (data: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'metadata'>): Promise<Item> => {
    await delay(800);
    const newItem: Item = {
      ...data,
      id: String(mockItems.length + 1),
      metadata: {
        views: 0,
        requests: 0,
        bookings: 0,
        rating: 0,
        reviewCount: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockItems.push(newItem);
    return newItem;
  },

  update: async (id: string, data: Partial<Item>): Promise<Item> => {
    await delay(500);
    const index = mockItems.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Item not found');
    mockItems[index] = { ...mockItems[index], ...data, updatedAt: new Date() };
    return mockItems[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    const index = mockItems.findIndex(item => item.id === id);
    if (index !== -1) {
      mockItems.splice(index, 1);
    }
  },
};

// Requests API
export const requestsApi = {
  getAll: async (userId?: string, role?: 'borrower' | 'owner'): Promise<Request[]> => {
    await delay(400);
    let requests = [...mockRequests];

    if (userId && role === 'borrower') {
      requests = requests.filter(r => r.borrowerId === userId);
    } else if (userId && role === 'owner') {
      requests = requests.filter(r => r.ownerId === userId);
    }

    return requests;
  },

  getById: async (id: string): Promise<Request | null> => {
    await delay(300);
    return mockRequests.find(r => r.id === id) || null;
  },

  create: async (data: Omit<Request, 'id' | 'createdAt' | 'updatedAt'>): Promise<Request> => {
    await delay(800);
    const newRequest: Request = {
      ...data,
      id: String(mockRequests.length + 1),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockRequests.push(newRequest);
    return newRequest;
  },

  update: async (id: string, data: Partial<Request>): Promise<Request> => {
    await delay(500);
    const index = mockRequests.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Request not found');
    mockRequests[index] = { ...mockRequests[index], ...data, updatedAt: new Date() };
    return mockRequests[index];
  },
};

// Messages API
export const messagesApi = {
  getByRequestId: async (requestId: string): Promise<Message[]> => {
    await delay(300);
    return mockMessages.filter(m => m.requestId === requestId);
  },

  send: async (data: Omit<Message, 'id' | 'createdAt' | 'read' | 'readAt'>): Promise<Message> => {
    await delay(400);
    const newMessage: Message = {
      ...data,
      id: String(mockMessages.length + 1),
      read: false,
      createdAt: new Date(),
    };
    mockMessages.push(newMessage);
    return newMessage;
  },

  markAsRead: async (messageId: string): Promise<void> => {
    await delay(200);
    const message = mockMessages.find(m => m.id === messageId);
    if (message) {
      message.read = true;
      message.readAt = new Date();
    }
  },
};

// Notifications API
export const notificationsApi = {
  getAll: async (userId: string): Promise<Notification[]> => {
    await delay(300);
    return mockNotifications.filter(n => n.userId === userId);
  },

  markAsRead: async (id: string): Promise<void> => {
    await delay(200);
    const notification = mockNotifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      notification.readAt = new Date();
    }
  },

  markAllAsRead: async (userId: string): Promise<void> => {
    await delay(300);
    mockNotifications
      .filter(n => n.userId === userId && !n.read)
      .forEach(n => {
        n.read = true;
        n.readAt = new Date();
      });
  },
};

// Reviews API
export const reviewsApi = {
  getByItemId: async (itemId: string): Promise<Review[]> => {
    await delay(300);
    return mockReviews.filter(r => r.itemId === itemId);
  },

  create: async (data: Omit<Review, 'id' | 'createdAt'>): Promise<Review> => {
    await delay(500);
    const newReview: Review = {
      ...data,
      id: String(mockReviews.length + 1),
      createdAt: new Date(),
    };
    mockReviews.push(newReview);
    return newReview;
  },
};



