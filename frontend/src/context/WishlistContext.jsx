import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useCart } from './CartContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { addToast } = useCart();
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('meshop_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('meshop_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to sync wishlist to localStorage', e);
    }
  }, [wishlist]);

  const getItemId = (item) => String(item?.id || item?._id || '');

  const isInWishlist = useCallback(
    (productId) => {
      const id = String(productId);
      return wishlist.some((item) => getItemId(item) === id);
    },
    [wishlist]
  );

  const toggleWishlist = useCallback(
    (product) => {
      const targetId = getItemId(product);
      if (!targetId) return;

      const title = product.title || 'Product';

      setWishlist((prev) => {
        const exists = prev.some((item) => getItemId(item) === targetId);
        if (exists) {
          addToast(`Removed "${title}" from Wishlist`, 'info');
          return prev.filter((item) => getItemId(item) !== targetId);
        } else {
          addToast(`Added "${title}" to Wishlist ❤️`, 'success');
          return [
            ...prev,
            {
              id: targetId,
              title: product.title,
              price: product.price,
              image: product.image || product.thumbnail || '',
              category: product.category,
              categoryName: product.categoryName,
              rating: product.rating,
              Colours: product.Colours,
              sizes: product.sizes,
            },
          ];
        }
      });
    },
    [addToast]
  );

  const removeFromWishlist = useCallback(
    (productId) => {
      const targetId = String(productId);
      setWishlist((prev) => prev.filter((item) => getItemId(item) !== targetId));
      addToast('Removed from Wishlist', 'info');
    },
    [addToast]
  );

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    localStorage.removeItem('meshop_wishlist');
  }, []);

  const openWishlist = () => setIsWishlistOpen(true);
  const closeWishlist = () => setIsWishlistOpen(false);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isWishlistOpen,
        openWishlist,
        closeWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
