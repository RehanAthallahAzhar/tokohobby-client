import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { cartApi } from '../services/api';
import { useAuth } from '../hooks/useAuth'; 

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total_items: 0 });
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth(); 

  const fetchCart = useCallback(async (options = {}) => {
    const { showLoading = true } = options;

    if (!isAuthenticated) {
      if (showLoading) setLoading(false);
      setCart({ items: [], total_items: 0 }); // set cart empty when user doesnt login
      return;
    }
    
    if (showLoading) {
      setLoading(true);
    }

    try {
      const response = await cartApi.get('/');
      setCart(response.data.data || { items: [], total_items: 0 }); 
    } catch (error) {
      console.error("Gagal mengambil data keranjang baru (menjaga data lama):", error);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [isAuthenticated]); 

  useEffect(() => {
    fetchCart({ showLoading: true });
  }, [fetchCart]);

  const cartContextValue = useMemo(() => ({
    cart,
    loading,
    fetchCart,
    totalItems: cart?.total_items || 0,
  }), [cart, loading, fetchCart]); 

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};