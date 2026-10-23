import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toasts, setToasts] = useState([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to sync cart to localStorage', e);
    }
  }, [cart]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getItemId = (item) => String(item.id || item._id);

  const addToCart = (product, quantity = 1, showDrawer = true) => {
    const targetId = getItemId(product);
    const title = product.title || product.name || 'Product';
    const price = typeof product.price === 'number' ? product.price : parseFloat(product.price || 0);
    const image = product.thumbnail || product.image || (product.images && product.images[0]) || '';

    setCart((prev) => {
      const existing = prev.find((item) => getItemId(item) === targetId);
      if (existing) {
        return prev.map((item) =>
          getItemId(item) === targetId ? { ...item, quantity: (item.quantity || 1) + quantity } : item
        );
      } else {
        return [
          ...prev,
          {
            id: targetId,
            _id: targetId,
            title,
            price,
            image,
            category: product.category || 'General',
            stock: product.stock ?? 99,
            quantity,
            selectedColor: product.selectedColor,
            selectedSize: product.selectedSize,
          },
        ];
      }
    });

    if (showDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    const targetId = String(productId);
    if (newQuantity <= 0) {
      removeFromCart(targetId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (getItemId(item) === targetId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const removeFromCart = (productId) => {
    const targetId = String(productId);
    const itemToRemove = cart.find((i) => getItemId(i) === targetId);
    setCart((prev) => prev.filter((item) => getItemId(item) !== targetId));
    if (itemToRemove) {
      addToast(`Removed "${itemToRemove.title}" from bag`, 'info');
    }
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    setCart([]);
    addToast('Cart cleared', 'info');
  };

  const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toasts,
        addToast,
        removeToast,
        isCartDrawerOpen,
        openCartDrawer,
        closeCartDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
