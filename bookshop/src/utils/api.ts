import axios from 'axios';

// Google Books API service


//AIzaSyB902zlp1wAV0Mo2RsUYJCd6uQzBSbbXWM
const API_KEY = '';
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

// Default placeholder image path
export const BOOK_PLACEHOLDER_IMAGE = '/image/book-placeholder.jpg';

export interface BookVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
      extraLarge?: string;
    };
    previewLink?: string;
    infoLink?: string;
    language?: string;
    maturityRating?: string;
  };
  saleInfo?: {
    listPrice?: {
      amount: number;
      currencyCode: string;
    };
    retailPrice?: {
      amount: number;
      currencyCode: string;
    };
    buyLink?: string;
    isEbook?: boolean;
    saleability?: string;
  };
  accessInfo?: {
    webReaderLink?: string;
    publicDomain?: boolean;
    embeddable?: boolean;
    textToSpeechPermission?: string;
  };
}

export interface BookSearchResponse {
  items: BookVolume[];
  totalItems: number;
  kind: string;
}

// Helper function to get better quality images when available
export const getOptimalImageUrl = (imageLinks?: BookVolume['volumeInfo']['imageLinks']): string => {
  if (!imageLinks) return BOOK_PLACEHOLDER_IMAGE;

  // Try to get the best quality image available, falling back to smaller sizes
  return imageLinks.large ||
    imageLinks.medium ||
    imageLinks.small ||
    imageLinks.thumbnail ||
    imageLinks.smallThumbnail ||
    BOOK_PLACEHOLDER_IMAGE;
};

// Get a secure image URL (convert http to https)
export const getSecureImageUrl = (url: string): string => {
  if (!url) return BOOK_PLACEHOLDER_IMAGE;
  if (url.startsWith('http:')) {
    return url.replace('http:', 'https:');
  }
  return url;
};

// Get formatted author text
export const getAuthorText = (authors?: string[]): string => {
  if (!authors || authors.length === 0) return 'Unknown Author';
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
  return `${authors[0]} and others`;
};

// Generate consistent pricing for books without price information
export const generateConsistentPrice = (bookId: string): number => {
  // Use the book ID to generate a consistent price
  // This ensures the same book always gets the same price
  let hash = 0;
  for (let i = 0; i < bookId.length; i++) {
    hash = ((hash << 5) - hash) + bookId.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  // Generate price between $9.99 and $29.99
  const basePrice = Math.abs(hash) % 2000 / 100 + 9.99;
  return parseFloat(basePrice.toFixed(2));
};

// Get a standardized price display with optional discount
export const getDisplayPrice = (book: BookVolume, applyDiscount: boolean = false): {
  price: string,
  isDiscounted: boolean,
  originalPrice?: string,
  discountPercentage?: number
} => {
  let retailPrice: number | undefined;
  let listPrice: number | undefined;

  if (book.saleInfo?.retailPrice?.amount) {
    retailPrice = book.saleInfo.retailPrice.amount;
  }

  if (book.saleInfo?.listPrice?.amount) {
    listPrice = book.saleInfo.listPrice.amount;
  }

  // If no price information, generate a consistent price
  if (!retailPrice && !listPrice) {
    const generatedPrice = generateConsistentPrice(book.id);

    if (applyDiscount) {
      listPrice = generatedPrice;
      retailPrice = parseFloat((generatedPrice * 0.8).toFixed(2)); // 20% discount
      return {
        price: `$${retailPrice.toFixed(2)}`,
        isDiscounted: true,
        originalPrice: `$${listPrice.toFixed(2)}`,
        discountPercentage: 20
      };
    } else {
      retailPrice = generatedPrice;
      return { price: `$${retailPrice.toFixed(2)}`, isDiscounted: false };
    }
  }

  if (retailPrice && listPrice && retailPrice < listPrice) {
    const discountPercentage = Math.round((1 - retailPrice / listPrice) * 100);
    return {
      price: `$${retailPrice.toFixed(2)}`,
      isDiscounted: true,
      originalPrice: `$${listPrice.toFixed(2)}`,
      discountPercentage
    };
  } else if (retailPrice) {
    // Apply artificial discount for offers section if requested
    if (applyDiscount && !listPrice) {
      listPrice = parseFloat((retailPrice * 1.25).toFixed(2)); // 20% discount from calculated list price
      return {
        price: `$${retailPrice.toFixed(2)}`,
        isDiscounted: true,
        originalPrice: `$${listPrice.toFixed(2)}`,
        discountPercentage: 20
      };
    }
    return { price: `$${retailPrice.toFixed(2)}`, isDiscounted: false };
  } else if (listPrice) {
    return { price: `$${listPrice.toFixed(2)}`, isDiscounted: false };
  } else {
    return { price: 'Price not available', isDiscounted: false };
  }
};

export const fetchBooks = async (
  query: string,
  startIndex: number = 0,
  maxResults: number = 12,
  orderBy: 'relevance' | 'newest' = 'relevance',
  printType: 'all' | 'books' | 'magazines' = 'all'
): Promise<BookSearchResponse> => {
  try {
    const response = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${maxResults}&orderBy=${orderBy}&printType=${printType}&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const fetchBooksByCategory = async (
  category: string,
  startIndex: number = 0,
  maxResults: number = 12,
  printType: 'all' | 'books' | 'magazines' = 'books'
): Promise<BookSearchResponse> => {
  return fetchBooks(`subject:${category}`, startIndex, maxResults, 'relevance', printType);
};

export const fetchBookDetails = async (bookId: string): Promise<BookVolume> => {
  try {
    const response = await fetch(`${BASE_URL}/${bookId}?key=${API_KEY}`);

    if (!response.ok) {
      throw new Error('Failed to fetch book details');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error fetching book details:', error);
    throw error;
  }
};

export const searchBooks = async (
  query: string,
  maxResults: number = 10,
  printType: 'all' | 'books' | 'magazines' = 'books'
): Promise<BookSearchResponse> => {
  try {
    const response = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&printType=${printType}&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to search books');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error searching books:', error);
    throw error;
  }
};

// Create axios instance with base URL and headers
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false, // Changed to false to avoid CORS issues
  timeout: 15000 // Increased timeout to 15 seconds
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config: Record<string, any>) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response: Record<string, any>) => {
    return response;
  },
  (error: any) => {
    // Log detailed error information for debugging
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });

    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear local storage on auth errors
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // You might want to redirect to login page here
      window.location.href = '/login';
    }

    // Handle connection errors and timeouts
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout') || !error.response) {
      console.error('Connection error or timeout. Server might be down.');

      // For cart operations, we can continue with local storage
      const isCartOperation = error.config?.url?.includes('/cart');
      if (isCartOperation) {
        console.log('Continuing with local cart due to server connection issue');
      }
    }

    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  // Register a new user
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    contactNumber: string;
    address: string;
  }) => {
    try {
      console.log('Sending registration request to:', api.defaults.baseURL + '/users/register');
      console.log('With data:', { ...userData, password: '[HIDDEN]' });

      const response = await api.post('/users/register', userData);
      console.log('Registration successful, response:', response.data);

      if (response.data.data && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      } else {
        console.warn('No token found in registration response');
      }

      return response.data;
    } catch (error: any) {
      console.error('Registration request failed:', error.message, error.response?.data);
      throw error;
    }
  },

  // Login user
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/users/login', credentials);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user from local storage
  getCurrentUser: () => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    contactNumber?: string;
    address?: string;
  }) => {
    const response = await api.put('/users/profile', userData);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  }
};

// Enhanced cart services with better error handling
export const cartService = {
  // Get user's cart
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error: any) {
      console.error('Failed to get cart:', error.message);
      // Return empty cart on error to allow the app to continue
      return { success: false, data: { items: [] } };
    }
  },

  // Add item to cart
  addToCart: async (item: { bookName: string; quantity: number; price: number }) => {
    try {
      const response = await api.post('/cart', item);
      return response.data;
    } catch (error: any) {
      console.error('Failed to add to cart:', error.message);
      throw error; // Rethrow to let the CartContext handle the error
    }
  },

  // Update cart item quantity
  updateCartItem: async (bookName: string, quantity: number) => {
    try {
      const response = await api.put(`/cart/${bookName}`, { quantity });
      return response.data;
    } catch (error: any) {
      console.error('Failed to update cart item:', error.message);
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (bookName: string) => {
    try {
      const response = await api.delete(`/cart/${bookName}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to remove from cart:', error.message);
      throw error;
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      const response = await api.delete('/cart');
      return response.data;
    } catch (error: any) {
      console.error('Failed to clear cart:', error.message);
      throw error;
    }
  }
};

// Voucher services
export const voucherService = {
  // Create a new voucher
  createVoucher: async (voucherPrice: number) => {
    const response = await api.post('/vouchers', { voucherPrice });
    return response.data;
  },

  // Get active vouchers
  getActiveVouchers: async () => {
    const response = await api.get('/vouchers/active');
    return response.data;
  },

  // Get expired vouchers
  getExpiredVouchers: async () => {
    const response = await api.get('/vouchers/expired');
    return response.data;
  },

  // Validate a voucher
  validateVoucher: async (voucherCode: string) => {
    const response = await api.post('/vouchers/validate', { voucherCode });
    return response.data;
  },

  // Apply a voucher
  applyVoucher: async (voucherCode: string) => {
    const response = await api.post('/vouchers/apply', { voucherCode });
    return response.data;
  }
};

export default api; 