import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext"; // Adjust path
import EmptyCart from "./userimg/emptycart.jpg";

const Cart = () => {
  const { cartItems } = useContext(CartContext);

  if (!cartItems.length) {
    return (
      <div className="w-full p-4 px-44">
        <h1 className="text-3xl font-semibold">Your cart is empty!</h1>
        <img
          className="w-[400px] mx-auto my-20"
          src={EmptyCart}
          alt="Empty cart"
        />
      </div>
    );
  }

  return (
    <div className="w-full p-4 px-44">
      <h1 className="text-3xl font-semibold mb-4">Your Cart</h1>
      {cartItems.map((item, index) => (
        <div
          key={index}
          className="bg-white border mb-4 p-4 flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <img
              src={item.image}
              alt={item.title}
              className="w-20 h-20 object-cover"
            />
            <h3 className="text-lg font-bold">{item.title}</h3>
          </div>
          {/* Add any remove/edit functionality here */}
        </div>
      ))}
    </div>
  );
};

export default Cart;
