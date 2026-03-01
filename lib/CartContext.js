import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add to Cart
  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (p) => p.variant_id === item.variant_id
      );

      if (existing) {
        return prev.map((p) =>
          p.variant_id === item.variant_id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Update Quantity
  const updateQuantity = (variant_id, quantity) => {
    if (quantity < 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.variant_id === variant_id
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Remove Item
  const removeFromCart = (variant_id) => {
    setCartItems((prev) =>
      prev.filter((item) => item.variant_id !== variant_id)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);