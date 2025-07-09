import React, { createContext, useState } from "react";
import all_product from "../Components/Assets/all_product";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let index = 1; index <= all_product.length; index++) {
    cart[index] = { quantity: 0, size: null };
  }
  return cart;
};

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [currentCategory, setCategory] = useState('');
  const categories = [...new Set(all_product.map(product => product.category))]; // Extract unique categories

  const addToCart = (itemId, size) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: {
        quantity: (prev[itemId]?.quantity || 0) + 1,
        size: size || prev[itemId]?.size
      }
    }));
  };

  const updateToCart = (itemId, quantity) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        quantity: quantity
      }
    }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      delete updatedCart[itemId];
      return updatedCart;
    });
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item].quantity > 0) {
        let itemInfo = all_product.find((product) => product.id === Number(item));
        totalAmount += itemInfo.new_price * cartItems[item].quantity;
      }
    }
    const deliveryFee = 200;  // Fixed delivery fee
    return totalAmount + deliveryFee;
  };

  const gettotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item].quantity > 0) {
        totalItem += cartItems[item].quantity;
      }
    }
    return totalItem;
  };

  const contextValue = {
    gettotalCartItems,
    getTotalCartAmount,
    all_product,
    cartItems,
    addToCart,
    updateToCart,
    removeFromCart,
    currentCategory,
    setCategory,
    categories
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
