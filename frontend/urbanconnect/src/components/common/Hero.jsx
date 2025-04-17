// Hero.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import  Nav  from "./Nav";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Loader from "../Authentication/Loader"; // Import the Loader component

// Replace these with your actual images
import Grid1 from "./img/acinstall.jpg";
import Grid2 from "./img/massage.svg";
import Grid3 from "./img/wash.svg";
import Grid4 from "./img/hairdresser.svg";
import JaneDoe from "./img/Jane_Doe.jpg";
import JohnSmith from "./img/John_Smith.jpg";
import AlexJohnson from "./img/Alex_Johnson.jpg";

export const Hero = () => {
  const [isLoading, setIsLoading] = useState(false); // State to control loader visibility
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to handle navigation with loader
  const handleNavigation = (path) => {
    setIsLoading(true); // Show the loader
    setTimeout(() => {
      setIsLoading(false); // Hide the loader after 2 seconds
      navigate(path); // Navigate to the specified path
    }, 2000); // 2-second delay to simulate loading
  };

  return (
    <div className="relative">
      {/* Loader Overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Loader />
        </div>
      )}
      {/* NAVBAR */}
      <Nav setIsLoading={setIsLoading} /> {/* Pass setIsLoading to Nav */}
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center bg-hero-bg bg-cover bg-center">
        {/* Gradient Overlay for Better Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-80"></div>

        <div className="relative my-hero-container flex flex-col-reverse md:flex-row items-center px-4 sm:px-6 md:px-8 mx-auto space-y-8 md:space-y-0 max-w-full xl:max-w-[1440px]">
          {/* LEFT CONTENT */}
          <motion.div
            className="flex flex-col items-center md:items-start space-y-6 text-center md:text-left md:w-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="max-w-xl p-4 text-left text-3xl sm:text-4xl md:text-5xl leading-tight font-bold">
              <Typewriter
                words={[
                  "Connecting You to Trusted & Authentic Local Services...",
                ]}
                loop={1}
                cursor
                cursorStyle=""
                typeSpeed={50}
                deleteSpeed={30}
                delaySpeed={1000}
              />
            </h1>
            <p className="max-w-md p-2 mt-0 mx-4 sm:mx-0 md:ml-4 text-base sm:text-lg font-semibold text-gray-700 italic transition-opacity duration-700 hover:opacity-90">
              From home repairs to beauty services – everything you need is just
              a click away.
            </p>
            <motion.div className="mx-4 sm:mx-0 md:ml-4">
              <button
                onClick={() => handleNavigation("/usersignup")}
                className="px-4 py-3 ml-36 mt-0 sm:px-6 sm:py-3 bg-myWhite  text-gray-900 rounded-full shadow-lg hover:text-gray-900 hover:border-slate-500 hover:bg-gray-300 transition-colors duration-300"
              >
                Get Started
              </button>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE: 4-Grid Layout */}
          <div className="md:w-1/2 flex justify-center md:mr-4">
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              {[Grid1, Grid2, Grid3, Grid4].map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-40 h-40 sm:w-48 sm:h-48 md:w-60 md:h-60 border rounded-md shadow-md overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`Grid ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* FEATURES SECTION */}
      <section id="features" className="py-8 sm:py-12">
        <div className="feature-container flex flex-col items-center px-4 mx-auto mt-6 sm:mt-10 space-y-8 sm:space-y-12 md:space-y-0 md:flex-row md:items-start md:justify-between max-w-full xl:max-w-[1440px]">
          {/* LEFT TEXT BLOCK */}
          <div className="flex flex-col space-y-4 md:w-1/2 text-center md:text-left">
            <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl mt-12 sm:mt-24">
              What makes UrbanConnect unique?
            </h2>
            <p className="text-gray-700 max-w-sm mx-auto md:mx-0 text-sm sm:text-base">
              UrbanConnect is your comprehensive urban service platform that
              unites essential services—from waste management to home
              repairs—under one roof.
            </p>
          </div>

          {/* RIGHT LIST BLOCK */}
          <div className="flex flex-col space-y-6 sm:space-y-8 md:w-1/2">
            {[
              "All-in-One Service Access",
              "Efficient Provider Tools",
              "Smart Administration & Support",
            ].map((title, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col space-y-3 md:flex-row md:space-x-4"
              >
                <div className="flex items-center space-x-2 md:items-start">
                  <div className="px-3 sm:px-4 py-1 sm:py-2 text-white rounded-full bg-blue-600 text-sm sm:text-base">{`0${
                    index + 1
                  }`}</div>
                  <h3 className="text-base sm:text-lg font-bold md:hidden">
                    {title}
                  </h3>
                </div>
                <div>
                  <h3 className="hidden mb-1 text-base sm:text-lg font-bold md:block">
                    {title}
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base">
                    {index === 0
                      ? "Discover and book a variety of urban services—ranging from utility payments to home repairs—all in one platform."
                      : index === 1
                      ? "Service providers manage listings, schedules, and bookings seamlessly with our intuitive tools designed for real-time communication."
                      : "Admins and support teams gain powerful tools for managing users, tracking transactions, and resolving issues swiftly."}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* TESTIMONIALS SECTION */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-full xl:max-w-6xl px-4 sm:px-5 mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            What Our Urban Community Says
          </h2>
          <div className="flex flex-col mt-8 sm:mt-16 md:flex-row md:space-x-4 sm:space-x-6 space-y-6 md:space-y-0">
            {[JaneDoe, JohnSmith, AlexJohnson].map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex flex-col items-center p-6 sm:p-4 space-y-4 rounded-lg bg-white shadow-md md:w-1/3 transform transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={image}
                  className="w-12 h-12 sm:w-14 sm:h-16 rounded-full border-2 border-gray-300"
                  alt={`Testimonial ${index + 1}`}
                />
                <h5 className="text-base sm:text-lg font-bold">
                  {index === 0
                    ? "Jane Doe"
                    : index === 1
                    ? "John Smith"
                    : "Alex Johnson"}
                </h5>
                <p className="text-xs sm:text-sm text-gray-600">
                  {index === 0
                    ? "UrbanConnect has made managing my home services effortless. Booking repairs and scheduling maintenance is just a click away!"
                    : index === 1
                    ? "As a service provider, UrbanConnect streamlined my scheduling and expanded my reach. It's an essential tool for growing my business."
                    : "Managing urban services has never been easier. UrbanConnect's admin tools keep everything organized and efficient for our community."}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA SECTION */}
      <section
        id="cta-section"
        className="bg-gradient-to-r from-blue-600 to-purple-700 mt-5 py-12 sm:py-16"
      >
        <div className="my-cta-container flex flex-col items-center justify-between px-4 sm:px-6 mx-auto space-y-6 sm:space-y-8 md:flex-row md:space-y-0 max-w-full xl:max-w-[1440px]">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-center text-white md:max-w-xl md:text-left transition-transform duration-700 ease-in-out hover:scale-105"
          >
            Local services made easy and accessible!
          </motion.h2>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <motion.div>
              <button
                onClick={() => handleNavigation("/usersignup")}
                className="px-4 py-3 sm:px-6 sm:py-3 text-black bg-gray-200 rounded-full shadow-lg hover:bg-mywhite1 transition-colors duration-300"
              >
                Get Started
              </button>
            </motion.div>
            <motion.div>
              <button
                onClick={() => handleNavigation("/browse")}
                className="px-4 py-3 sm:px-6 sm:py-3 text-black bg-gray-200 rounded-full shadow-lg hover:bg-mywhite1 transition-colors duration-300"
              >
                Book Now
              </button>
            </motion.div>
          </div>
        </div>
      </section>
      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 max-w-full xl:max-w-[1440px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {/* Column 1: Logo and Description */}
            <div>
              <p className="text-xs sm:text-sm text-gray-400">
                Connecting you to trusted local services.
              </p>
            </div>
            {/* Column 2: For Users */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-4">
                For Users
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-xs sm:text-sm hover:text-gray-300"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="text-xs sm:text-sm hover:text-gray-300"
                  >
                    Browse Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/how-it-works"
                    className="text-xs sm:text-sm hover:text-gray-300"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="text-xs sm:text-sm hover:text-gray-300"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            {/* Column 3: For Providers */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-4">
                For Providers
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/provider-signup"
                    className="text-xs sm:text-sm hover:text-gray-300"
                  >
                    Join as a Provider
                  </Link>
                </li>
                <li>
                  <Link
                    to="/provider-dashboard"
                    className="text-xs sm:text-sm hover:text-gray-300"
                  >
                    Provider Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/provider-support"
                    className="text-xs sm:text-sm hover:text-gray-300"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            {/* Column 4: Company */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-4">
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="text-xs sm:text-sm hover:text-gray-300"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-xs sm:text-sm hover:text-gray-300"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="text-xs sm:text-sm hover:text-gray-300"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="text-xs sm:text-sm hover:text-gray-300"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          {/* Bottom Section */}
          <div className="mt-8 sm:mt-12 border-t border-gray-700 pt-4 sm:pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs sm:text-sm text-gray-400">
              © 2025 UrbanConnect. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-xs sm:text-sm hover:text-gray-300">
                <i className="text-2xl fab fa-instagram"></i>
              </a>
              <a href="#" className="text-xs sm:text-sm hover:text-gray-300">
                <i className="text-2xl fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-xs sm:text-sm hover:text-gray-300">
                <i className="text-2xl fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="text-xs sm:text-sm hover:text-gray-300">
                <i className="text-2xl fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Hero;
