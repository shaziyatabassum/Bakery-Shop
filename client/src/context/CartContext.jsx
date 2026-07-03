import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token, API_URL } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);

  // Load cart on startup or auth state change
  useEffect(() => {
    const loadCart = async () => {
      setCartLoading(true);
      if (user && token) {
        try {
          const res = await axios.get(`${API_URL}/cart`);
          if (res.data.success && res.data.cart) {
            // Map Mongoose structure (productId has populated product details)
            const items = res.data.cart.items.map(item => ({
              product: item.productId,
              quantity: item.quantity
            })).filter(item => item.product !== null); // filter deleted products
            setCartItems(items);
          }
        } catch (err) {
          console.error('Error fetching cart from database:', err);
        }
      } else {
        // Guest cart
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          setCartItems(JSON.parse(localCart));
        } else {
          setCartItems([]);
        }
      }
      setCartLoading(false);
    };

    loadCart();
  }, [user, token, API_URL]);

  // Persist guest cart in localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // Add Item to Cart
  const addToCart = async (product, quantity = 1) => {
    if (user) {
      try {
        const res = await axios.post(`${API_URL}/cart`, { productId: product._id || product.id, quantity });
        if (res.data.success) {
          const items = res.data.cart.items.map(item => ({
            product: item.productId,
            quantity: item.quantity
          })).filter(item => item.product !== null);
          setCartItems(items);
          toast.success(`${product.name} added to cart`);
        }
      } catch (err) {
        toast.error('Failed to add item to cart');
      }
    } else {
      // Guest logic
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => (item.product._id || item.product.id) === (product._id || product.id));
        if (existingItem) {
          toast.success(`${product.name} quantity updated`);
          return prevItems.map(item =>
            (item.product._id || item.product.id) === (product._id || product.id)
              ? { ...item, quantity: item.quantity + Number(quantity) }
              : item
          );
        }
        toast.success(`${product.name} added to cart`);
        return [...prevItems, { product, quantity: Number(quantity) }];
      });
    }
  };

  // Update Item Quantity
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    
    if (user) {
      try {
        const res = await axios.put(`${API_URL}/cart/item`, { productId, quantity });
        if (res.data.success) {
          const items = res.data.cart.items.map(item => ({
            product: item.productId,
            quantity: item.quantity
          })).filter(item => item.product !== null);
          setCartItems(items);
        }
      } catch (err) {
        toast.error('Failed to update quantity');
      }
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          (item.product._id || item.product.id) === productId
            ? { ...item, quantity: Number(quantity) }
            : item
        )
      );
    }
  };

  // Remove Item from Cart
  const removeFromCart = async (productId) => {
    if (user) {
      try {
        const res = await axios.delete(`${API_URL}/cart/item/${productId}`);
        if (res.data.success) {
          const items = res.data.cart.items.map(item => ({
            product: item.productId,
            quantity: item.quantity
          })).filter(item => item.product !== null);
          setCartItems(items);
          toast.success('Item removed from cart');
        }
      } catch (err) {
        toast.error('Failed to remove item');
      }
    } else {
      setCartItems(prevItems => prevItems.filter(item => (item.product._id || item.product.id) !== productId));
      toast.success('Item removed from cart');
    }
  };

  // Clear Cart
  const clearCart = async () => {
    if (user) {
      try {
        await axios.delete(`${API_URL}/cart`);
        setCartItems([]);
      } catch (err) {
        console.error('Failed to clear cart:', err);
      }
    } else {
      setCartItems([]);
      localStorage.removeItem('cart');
    }
  };

  // Financial Calculations
  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const price = item.product.offerPrice || item.product.price;
      return acc + (price * item.quantity);
    }, 0);
  };

  const getTax = () => {
    return Math.round(getSubtotal() * 0.05); // 5% GST
  };

  const getDeliveryCharge = () => {
    const sub = getSubtotal();
    if (sub === 0) return 0;
    return sub > 499 ? 0 : 50; // Free delivery over ₹499
  };

  const getTotal = () => {
    return getSubtotal() + getTax() + getDeliveryCharge();
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getSubtotal,
        getTax,
        getDeliveryCharge,
        getTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
