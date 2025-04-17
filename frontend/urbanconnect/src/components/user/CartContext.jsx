// CartContext.jsx
import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]); // State to store cart items
  const [showCart, setShowCart] = useState(false); // State to toggle cart sidebar visibility

  // Function to add a service to the cart
  const addToCart = (service) => {
    const existingItem = cartItems.find((item) => item.name === service.name);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.name === service.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...service, quantity: 1 }]);
    }
  };

  // Function to increase quantity
  const increaseQuantity = (serviceName) => {
    setCartItems(
      cartItems.map((item) =>
        item.name === serviceName
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Function to decrease quantity
  const decreaseQuantity = (serviceName) => {
    setCartItems(
      cartItems
        .map((item) =>
          item.name === serviceName
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0) // Remove item if quantity becomes 0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        showCart,
        setShowCart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
