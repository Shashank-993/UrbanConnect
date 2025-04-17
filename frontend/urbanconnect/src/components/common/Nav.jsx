// Nav.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { CiMenuBurger } from "react-icons/ci";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion"; // For animations

export const Nav = ({ setIsLoading }) => {
  const [click, setClick] = useState(false);
  const navigate = useNavigate(); // Added for programmatic navigation
  const handleClick = () => setClick(!click);

  // Function to handle navigation with loader
  const handleNavigation = (path) => {
    setIsLoading(true); // Show the loader
    setTimeout(() => {
      setIsLoading(false); // Hide the loader after 2 seconds
      navigate(path); // Navigate to the specified path
    }, 2000); // 2-second delay to simulate loading
  };

  // Animation variants for mobile menu
  const menuVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: { opacity: 0, y: -50, transition: { duration: 0.2 } },
  };

  return (
    <header className="w-full bg-gray-900 shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 md:px-8 py-2 sm:py-3 flex items-center justify-between max-w-full xl:max-w-[1440px]">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl sm:text-3xl font-bold text-white tracking-tight hover:text-gray-300 transition-colors duration-300"
        >
          Urban Connect
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex text-sm sm:text-base lg:text-lg items-center space-x-6 sm:space-x-8 lg:space-x-10 flex-grow justify-center">
          {["Services", "Pricing", "About", "Contact"].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="text-white font-medium hover:text-blue-400 transition-colors duration-300 relative group"
            >
              {item}
              <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-blue-400 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Desktop Get Started Button */}
        <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={() => handleNavigation("/usersignup")} // Updated to use handleNavigation
            className="px-4 sm:px-4 py-1 sm:py-2 bg-transparent text-sm sm:text-base lg:text-lg border-2 border-myWhite text-myWhite font-semibold rounded-full hover:text-teal-500 hover:border-teal-500 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Login
          </button>
          <button
            onClick={() => handleNavigation("/usersignup")} // Updated to use handleNavigation
            className="px-4 sm:px-4 py-1 sm:py-2 bg-transparent text-sm sm:text-base lg:text-lg border-2 border-myWhite text-myWhite font-semibold rounded-full hover:text-red-500 hover:border-red-500 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            SignUp
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-xl sm:text-2xl focus:outline-none"
          onClick={handleClick}
        >
          {click ? <FaTimes /> : <CiMenuBurger />}
        </button>
      </nav>

      {/* Mobile Menu with Animation */}
      {click && (
        <motion.div
          className="md:hidden bg-gray-900 text-white absolute top-[56px] sm:top-[64px] left-0 w-full flex flex-col items-center py-4 sm:py-6 shadow-lg"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={menuVariants}
        >
          {["Home", "About", "Contact"].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              onClick={handleClick}
              className="py-2 sm:py-3 text-base sm:text-lg font-medium text-white hover:text-blue-400 transition-colors duration-300"
            >
              {item}
            </Link>
          ))}
          <button
            onClick={() => {
              handleClick();
              handleNavigation("/usersignup"); // Updated to use handleNavigation
            }}
            className="mt-3 sm:mt-4 px-4 sm:px-6 py-1 sm:py-2 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-full hover:bg-blue-700 transition-all duration-300 shadow-md"
          >
            Get Started
          </button>
        </motion.div>
      )}
    </header>
  );
};

export default Nav;
