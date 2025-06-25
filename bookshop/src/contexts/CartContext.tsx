import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { BookVolume, cartService, fetchBookDetails } from '../utils/api';

interface CartItem {
  book: BookVolume;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (book: BookVolume, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isServerAvailable, setIsServerAvailable] = useState(true);

  const isLoggedIn = !!localStorage.getItem('token');


  const verifyServerStatus = async () => {
    if (!isLoggedIn) return; 

    try {
      await cartService.getCart();
      setIsServerAvailable(true);
    } catch (error: any) {
      console.error('Server error:', error);
      setIsServerAvailable(false);

    
      if (error.response?.status === 404) {
        localStorage.removeItem('token');
        console.log('Switched to local cart mode due to server unavailability');
      }
    }
  };

  useEffect(() => {
    verifyServerStatus();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setLoading(true);
      cartService.getCart()
        .then(async (res) => {
          if (res.success && res.data && res.data.items) {
            const detailedItems = await Promise.all(res.data.items.map(async (item: any) => {
              try {
                const book = await fetchBookDetails(item.bookName);
                return { book, quantity: item.quantity };
              } catch {
                return { book: { id: item.bookName, volumeInfo: { title: item.bookName } }, quantity: item.quantity };
              }
            }));
            setItems(detailedItems);
          } else {
            setItems([]);
          }
        })
        .catch((error: any) => {
          console.error('Error fetching cart:', error);
          setItems([]);

          if (error.response?.status === 404 || error.response?.status === 401) {
            localStorage.removeItem('token');
          }
        })
        .finally(() => setLoading(false));
    }
  }, [isLoggedIn]);

  const addToCart = (book: BookVolume, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.book.id === book.id);
      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        return [...prevItems, { book, quantity }];
      }
    });

    if (isLoggedIn) {
      const price = book.saleInfo?.retailPrice?.amount || book.saleInfo?.listPrice?.amount || 0;
      cartService.addToCart({ bookName: book.id, price, quantity })
        .then(async (res) => {
          if (res.success && res.data && res.data.items) {
            const detailedItems = await Promise.all(res.data.items.map(async (item: any) => {
              try {
                const book = await fetchBookDetails(item.bookName);
                return { book, quantity: item.quantity };
              } catch {
                return { book: { id: item.bookName, volumeInfo: { title: item.bookName } }, quantity: item.quantity };
              }
            }));
            setItems(detailedItems);
          }
        })
        .catch((error: any) => {
          console.log('Error adding to cart on server:', error.message);

          if (error.response?.status === 404 || error.response?.status === 401) {
            localStorage.removeItem('token');
          }
        });
    }
  };

  const removeFromCart = (bookId: string) => {
    if (isLoggedIn) {
      setItems(prevItems => prevItems.filter(item => item.book.id !== bookId));

      cartService.removeFromCart(bookId)
        .then(async (res) => {
          if (res.success && res.data && res.data.items) {
            const detailedItems = await Promise.all(res.data.items.map(async (item: any) => {
              try {
                const book = await fetchBookDetails(item.bookName);
                return { book, quantity: item.quantity };
              } catch {
                return { book: { id: item.bookName, volumeInfo: { title: item.bookName } }, quantity: item.quantity };
              }
            }));
            setItems(detailedItems);
          }
        })
        .catch((error: any) => {
          console.log('Error syncing cart with server:', error.message);

          if (error.response?.status === 404 || error.response?.status === 401) {
            localStorage.removeItem('token');
          }
        });
    } else {
      setItems(prevItems => prevItems.filter(item => item.book.id !== bookId));
    }
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (isLoggedIn) {
      if (quantity <= 0) {
        removeFromCart(bookId);
        return;
      }

      setItems(prevItems =>
        prevItems.map(item =>
          item.book.id === bookId ? { ...item, quantity } : item
        )
      );

      cartService.updateCartItem(bookId, quantity)
        .then(async (res) => {
          if (res.success && res.data && res.data.items) {
            const detailedItems = await Promise.all(res.data.items.map(async (item: any) => {
              try {
                const book = await fetchBookDetails(item.bookName);
                return { book, quantity: item.quantity };
              } catch {
                return { book: { id: item.bookName, volumeInfo: { title: item.bookName } }, quantity: item.quantity };
              }
            }));
            setItems(detailedItems);
          }
        })
        .catch((error: any) => {
          console.log('Error updating cart item on server:', error.message);

          if (error.response?.status === 404 || error.response?.status === 401) {
            localStorage.removeItem('token');
          }
        });
    } else {
      if (quantity <= 0) {
        removeFromCart(bookId);
        return;
      }
      setItems(prevItems =>
        prevItems.map(item =>
          item.book.id === bookId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    if (isLoggedIn) {
      setItems([]);

      cartService.clearCart()
        .then(() => {
        })
        .catch((error: any) => {
          console.log('Error clearing cart on server:', error.message);

          if (error.response?.status === 404 || error.response?.status === 401) {
            localStorage.removeItem('token');
          }
        });
    } else {
      setItems([]);
    }
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      let price = 0;
      if (item.book.saleInfo?.retailPrice?.amount) {
        price = item.book.saleInfo.retailPrice.amount;
      } else if (item.book.saleInfo?.listPrice?.amount) {
        price = item.book.saleInfo.listPrice.amount;
      }
      return total + (price * item.quantity);
    }, 0);
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemCount,
    getTotalPrice
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 