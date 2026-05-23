import { createContext, useContext, useState, useEffect } from "react";
import { apiClient, getAuthToken } from "../api/client";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const { user } = useAuth(); // Re-fetch cart when user logs in/out

  const fetchCart = async () => {
    if (!getAuthToken()) {
      setItems([]);
      return;
    }
    try {
      const data = await apiClient('/api/cart/');
      if (data && data.items) {
        // Map API format to expected frontend format
        const formattedItems = data.items.map(item => ({
          apiId: item.id,
          key: `${item.product}-${item.size}`,
          product: item.product_details,
          size: item.size,
          quantity: item.quantity
        }));
        setItems(formattedItems);
      }
    } catch (err) {
      console.error("Error fetching cart", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]); // Re-run when auth state changes

  const addToCart = async (product, size, quantity = 1) => {
    if (!getAuthToken()) {
      alert("Please log in to add items to your cart.");
      return;
    }
    try {
      await apiClient('/api/cart/items/', {
        body: { product: product.id, size, quantity }
      });
      await fetchCart();
    } catch (err) {
      console.error("Error adding to cart", err);
    }
  };

  const removeFromCart = async (key) => {
    const item = items.find(i => i.key === key);
    if (!item) return;
    try {
      await apiClient(`/api/cart/items/${item.apiId}/`, { method: 'DELETE' });
      await fetchCart();
    } catch (err) {
      console.error("Error removing from cart", err);
    }
  };

  const updateQuantity = async (key, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(key);
    }
    const item = items.find(i => i.key === key);
    if (!item) return;
    
    try {
      // The API expects full fields on update or we can use PATCH
      await apiClient(`/api/cart/items/${item.apiId}/`, {
        method: 'PATCH',
        body: { quantity }
      });
      await fetchCart();
    } catch (err) {
      console.error("Error updating cart", err);
    }
  };

  const clearCart = async () => {
    try {
      await apiClient('/api/cart/clear/', { method: 'POST' });
      await fetchCart();
    } catch (err) {
      console.error("Error clearing cart", err);
    }
  };

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
