"use client";

// NavBrowse.jsx
import { useState, useEffect, useContext } from "react";
import { Search, Home, ShoppingCart, User } from "lucide-react";
import { CartContext } from "../user/CartContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const NavBrowse = () => {
  const { cartItems, setShowCart } = useContext(CartContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate total cart quantity for badge
  const totalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 transition-all duration-300 ease-in-out ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-md"
          : "bg-white shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Brand */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-extrabold tracking-tight"
        >
          <Link to="/home">
            <span className="bg-clip-text text-transparent font-bold text-2xl tracking-tight bg-gradient-to-r from-gray-800 to-gray-600">
              Urban Connect
            </span>
          </Link>
        </motion.h1>

        {/* Search Bar */}
        <motion.div
          animate={{ scale: isSearchFocused ? 1.05 : 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative max-w-md w-full mx-4"
        >
          <div
            className={`flex items-center h-10 w-full px-4 rounded-xl bg-gray-100/80 border transition-all duration-300 ${
              isSearchFocused
                ? "border-gray-400 ring-2 ring-gray-400/50 shadow-md"
                : "border-gray-200 shadow-sm"
            }`}
          >
            <Search className="h-4 w-4 text-gray-600 mr-2" />
            <input
              type="text"
              placeholder="Search services..."
              className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-700 placeholder-gray-500"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
        </motion.div>

        {/* Navigation Icons */}
        <nav className="flex items-center space-x-2">
          <Link to="/homepage">
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-transparent hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
              aria-label="Home"
            >
              <Home className="h-5 w-5 text-gray-800" />
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
            whileTap={{ scale: 0.9 }}
            className="relative p-2 rounded-full bg-transparent hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
            aria-label="Cart"
            onClick={() => setShowCart((prev) => !prev)}
          >
            <ShoppingCart className="h-5 w-5 text-gray-800" />
            <AnimatePresence>
              {totalCartItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium shadow-sm"
                >
                  {totalCartItems}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          <Link to="/profile">
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-transparent hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
              aria-label="User profile"
            >
              <User className="h-5 w-5 text-gray-800" />
            </motion.button>
          </Link>
        </nav>
      </div>
    </motion.header>
  );
};

export default NavBrowse;
