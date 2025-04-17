"use client";

import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Wrench,
  Calendar,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  X,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSidebar({ open = true, setOpen = () => {} }) {
  const location = useLocation();
  const pathname = location.pathname;

  const navigation = [
    { name: "Dashboard", to: "/admin", icon: LayoutDashboard },
    { name: "Users", to: "/users", icon: Users },
    { name: "Providers", to: "/providers", icon: Briefcase },
    { name: "Services", to: "/services", icon: Wrench },
    { name: "Appointments", to: "/appointments", icon: Calendar },
    { name: "Payments", to: "/payments", icon: CreditCard },
    { name: "Invoices", to: "/invoices", icon: FileText },
    { name: "Settings", to: "/settings", icon: Settings },
  ];

  // Animation variants
  const sidebarVariants = {
    open: { x: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    closed: {
      x: "-100%",
      opacity: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar for desktop and mobile */}
      <motion.div
        initial={false}
        animate={open ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-md rounded-r-2xl shadow-xl border-r border-gray-200/50 md:static md:w-64 md:rounded-none md:shadow-none"
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between bg-gray-800/90 px-6 border-b border-gray-200/50">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white tracking-tight">Urban Connect</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500/50 rounded-full p-1.5 md:hidden transition-all duration-200"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>

        {/* Navigation links */}
        <div className="flex flex-col h-[calc(100vh-4rem)] py-4">
          <nav className="flex-1 space-y-1 px-2">
            {navigation.map((item, index) => {
              const isActive = pathname === item.to;
              return (
                <motion.div
                  key={item.name}
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.to}
                    className={`group flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gray-100/50 text-gray-900 shadow-sm"
                        : "text-gray-600 hover:bg-gray-100/50 hover:text-gray-900"
                    }`}
                  >
                    <motion.div whileHover={{ scale: 1.01 }}>
                      <item.icon
                        className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          isActive
                            ? "text-gray-900"
                            : "text-gray-500 group-hover:text-gray-900"
                        }`}
                      />
                    </motion.div>
                    {item.name}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Logout button at bottom */}
          <div className="px-2">
            <motion.div
              variants={linkVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: navigation.length * 0.05 }}
            >
              <Link to="/authpage">
                <button className="group flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium bg-transparent border-2 border-slate-200 text-slate-600 hover:text-red-600 hover:bg-gray-100/50 hover:border-red-400 transition-all duration-200">
                  <motion.div whileHover={{ scale: 1.01 }}>
                    <LogOut className="mr-3 h-5 w-5 flex-shrink-0 bg-transparent text-slate-600 hover:text-red-500 group-hover:text-red-500" />
                  </motion.div>
                  Logout
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Mobile menu button */}
      <AnimatePresence>
        {!open && (
          <motion.div
            className="fixed bottom-4 right-4 z-50 md:hidden"
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
