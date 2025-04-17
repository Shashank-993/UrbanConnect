"use client";

import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Bell,
  Search,
  User,
  Menu,
  LogOut,
  Settings,
  UserCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminNavbar({ setSidebarOpen }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const pathname = location.pathname;
    if (pathname === "/" || pathname === "/dashboard") return "Dashboard";
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length > 0) {
      return (
        parts[parts.length - 1].charAt(0).toUpperCase() +
        parts[parts.length - 1].slice(1)
      );
    }
    return "Dashboard";
  };

  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.15 },
    },
  };

  return (
    <motion.header
      className="sticky top-0 z-50 flex h-16 flex-shrink-0 bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200/50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="flex flex-1 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="rounded-full p-2 text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500/50 md:hidden transition-all duration-200"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </motion.button>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={titleVariants}
            className="text-xl font-semibold text-gray-900"
          >
            {getPageTitle()}
          </motion.h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full p-2 text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
          >
            <Bell className="h-5 w-5" />
          </motion.button>
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center rounded-full focus:outline-none transition-all duration-200"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-md">
                <User className="h-5 w-5" />
              </div>
              <span className="ml-2 hidden text-sm font-medium text-gray-900 md:block">
                Admin User
              </span>
            </motion.button>
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-md rounded-xl py-2 shadow-xl border border-gray-200/50"
                >
                  <a
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-900 hover:bg-gray-100/50 transition-all duration-200"
                  >
                    <UserCircle className="h-4 w-4" />
                    Your Profile
                  </a>
                  <a
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-900 hover:bg-gray-100/50 transition-all duration-200"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </a>
                  <a
                    href="/login"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-900 hover:bg-gray-100/50 transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
