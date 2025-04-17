import React from "react";
import NavBrowse from "../common/NavBrowse";
import ServicesLayout from "./ServicesLayout";
import { CartProvider } from "./CartContext";
const Browsing = () => {
  return (
    <CartProvider>
      <div className="pt-20">
        <NavBrowse />
        <ServicesLayout />
      </div>
    </CartProvider>
  );
};

export default Browsing;
