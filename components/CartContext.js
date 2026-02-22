import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // This is a placeholder to add some initial items to the cart for demonstration
  useEffect(() => {
    setCartItems([
      {
        id: 1,
        name: 'Premium T-Shirt',
        size: 'L',
        color: 'Black',
        price: 25.0,
        quantity: 2,
        image: 'https://via.placeholder.com/150/000000/FFFFFF?text=T-Shirt',
      },
      {
        id: 2,
        name: 'Classic Hoodie',
        size: 'M',
        color: 'Gray',
        price: 55.0,
        quantity: 1,
        image: 'https://via.placeholder.com/150/808080/FFFFFF?text=Hoodie',
      },
    ]);
  }, []);

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, amount) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      )
    );
  };

  // Calculate total number of items in the cart
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const value = { cartItems, removeFromCart, updateQuantity, cartCount };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};