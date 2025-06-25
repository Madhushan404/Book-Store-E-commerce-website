import React, { useState, useEffect } from 'react';
import { cartService, authService } from '../utils/api';

interface CartItem {
  bookName: string;
  quantity: number;
  price: number;
}

interface CartData {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: string;
  items: CartItem[];
}

const CartManager: React.FC = () => {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [debug, setDebug] = useState<any>(null);

  
  useEffect(() => {
    const checkAuthAndLoadCart = async () => {
      try {
        const user = authService.getCurrentUser();
        console.log('Current user:', user);
        
        if (user) {
          setIsLoggedIn(true);
          await fetchCart();
        } else {
          console.log('No user found in localStorage');
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setError('Authentication error. Please log in again.');
      }
    };
    
    checkAuthAndLoadCart();
  }, []);

  
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching cart data...');
      
      const response = await cartService.getCart();
      console.log('Cart data received:', response);
      
      if (response.success === false) {
        throw new Error(response.message || 'Failed to fetch cart');
      }
      
      setCart(response.data);
      setDebug(response); 
    } catch (err: any) {
      console.error('Error fetching cart:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load cart. Please try again.');
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  
  const addToCart = async (bookName: string, price: number, quantity: number = 1) => {
    if (!isLoggedIn) {
      setError('Please log in to add items to your cart');
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log(`Adding to cart: ${bookName}, ${price}, ${quantity}`);
      
      const response = await cartService.addToCart({ bookName, price, quantity });
      console.log('Add to cart response:', response);
      
      if (response.success === false) {
        throw new Error(response.message || 'Failed to add item to cart');
      }
      
  
      await fetchCart();
    } catch (err: any) {
      console.error('Error adding to cart:', err);
      setError(err.response?.data?.message || err.message || 'Failed to add item to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
  const updateCartItem = async (bookName: string, quantity: number) => {
    try {
      setLoading(true);
      setError('');
      console.log(`Updating cart item: ${bookName}, quantity: ${quantity}`);
      
  
      if (quantity <= 0) {
        await removeFromCart(bookName);
        return;
      }
      
      const response = await cartService.updateCartItem(bookName, quantity);
      console.log('Update cart response:', response);
      
      if (response.success === false) {
        throw new Error(response.message || 'Failed to update cart');
      }
      
  
      await fetchCart();
    } catch (err: any) {
      console.error('Error updating cart:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
  const removeFromCart = async (bookName: string) => {
    try {
      setLoading(true);
      setError('');
      console.log(`Removing from cart: ${bookName}`);
      
      const response = await cartService.removeFromCart(bookName);
      console.log('Remove from cart response:', response);
      
      if (response.success === false) {
        throw new Error(response.message || 'Failed to remove item from cart');
      }
      
  
      await fetchCart();
    } catch (err: any) {
      console.error('Error removing from cart:', err);
      setError(err.response?.data?.message || err.message || 'Failed to remove item from cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
  const clearCart = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Clearing cart');
      
      const response = await cartService.clearCart();
      console.log('Clear cart response:', response);
      
      if (response.success === false) {
        throw new Error(response.message || 'Failed to clear cart');
      }
      
      setCart(null);
    } catch (err: any) {
      console.error('Error clearing cart:', err);
      setError(err.response?.data?.message || err.message || 'Failed to clear cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
  const calculateTotal = () => {
    if (!cart || !cart.items || cart.items.length === 0) return 0;
    
    return cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0).toFixed(2);
  };

  
  const renderDebugInfo = () => {
    if (process.env.NODE_ENV !== 'development') return null;
    
    return null;
  };

  if (!isLoggedIn) {
    return (
      <div className="cart-container">
        <h2>Your Cart</h2>
        <p>Please <a href="/login">log in</a> to view your cart.</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading your cart...</div>
      ) : (
        <>
          {(!cart || !cart.items || cart.items.length === 0) ? (
            <div className="empty-cart">
              <p>Your cart is empty.</p>
              <a href="/" className="continue-shopping">Continue shopping</a>
            </div>
          ) : (
            <div className="cart-items">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.bookName}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>
                        <div className="quantity-control">
                          <button 
                            onClick={() => updateCartItem(item.bookName, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateCartItem(item.bookName, item.quantity + 1)}>+</button>
                        </div>
                      </td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <button 
                          className="remove-button"
                          onClick={() => removeFromCart(item.bookName)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="cart-summary">
                <div className="cart-total">
                  <span>Total:</span>
                  <span className="total-price">${calculateTotal()}</span>
                </div>
                
                <div className="cart-actions">
                  <button className="clear-cart-button" onClick={clearCart}>
                    Clear Cart
                  </button>
                  <button className="checkout-button">
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CartManager; 