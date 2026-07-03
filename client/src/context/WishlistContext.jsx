import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, token, API_URL } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);

  // Fetch wishlist items
  useEffect(() => {
    const loadWishlist = async () => {
      setWishlistLoading(true);
      if (user && token) {
        try {
          const res = await axios.get(`${API_URL}/wishlist`);
          if (res.data.success && res.data.wishlist) {
            setWishlistItems(res.data.wishlist.products || []);
          }
        } catch (err) {
          console.error('Error fetching wishlist:', err);
        }
      } else {
        const localWish = localStorage.getItem('wishlist');
        if (localWish) {
          setWishlistItems(JSON.parse(localWish));
        } else {
          setWishlistItems([]);
        }
      }
      setWishlistLoading(false);
    };

    loadWishlist();
  }, [user, token, API_URL]);

  // Persist guest wishlist in localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, user]);

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => (item._id || item.id) === productId);
  };

  const toggleWishlist = async (product) => {
    const productId = product._id || product.id;
    const isAdded = isInWishlist(productId);

    if (user) {
      try {
        if (isAdded) {
          // Remove from db
          const res = await axios.delete(`${API_URL}/wishlist/${productId}`);
          if (res.data.success) {
            setWishlistItems(res.data.wishlist.products);
            toast.success(`${product.name} removed from wishlist`);
          }
        } else {
          // Add to db
          const res = await axios.post(`${API_URL}/wishlist`, { productId });
          if (res.data.success) {
            setWishlistItems(res.data.wishlist.products);
            toast.success(`${product.name} added to wishlist`);
          }
        }
      } catch (err) {
        toast.error('Failed to update wishlist');
      }
    } else {
      // Guest toggling
      if (isAdded) {
        setWishlistItems(prev => prev.filter(item => (item._id || item.id) !== productId));
        toast.success(`${product.name} removed from wishlist`);
      } else {
        setWishlistItems(prev => [...prev, product]);
        toast.success(`${product.name} added to wishlist`);
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistLoading,
        isInWishlist,
        toggleWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
