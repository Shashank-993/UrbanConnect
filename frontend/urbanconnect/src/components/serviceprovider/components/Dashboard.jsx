"use client";

import { useState } from "react";
import {
  Users,
  Briefcase,
  Calendar,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [usersPage, setUsersPage] = useState(1);
  const [bookingsPage, setBookingsPage] = useState(1);
  const itemsPerPage = 5;

  // Sample data
  const stats = [
    {
      title: "Total Users",
      value: "1,284",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Providers",
      value: "348",
      icon: Briefcase,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Total Appointments",
      value: "2,841",
      icon: Calendar,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Total Revenue",
      value: "$94,256",
      icon: DollarSign,
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  const recentBookings = [
    {
      id: "BK-001",
      user: "John Doe",
      provider: "Dr. Smith",
      service: "Dental Checkup",
      status: "Confirmed",
      date: "May 12, 2023",
    },
    {
      id: "BK-002",
      user: "Jane Smith",
      provider: "Dr. Johnson",
      service: "Eye Exam",
      status: "Pending",
      date: "May 13, 2023",
    },
    {
      id: "BK-003",
      user: "Robert Brown",
      provider: "Dr. Williams",
      service: "Physical Therapy",
      status: "Completed",
      date: "May 10, 2023",
    },
    {
      id: "BK-004",
      user: "Emily Davis",
      provider: "Dr. Miller",
      service: "Consultation",
      status: "Cancelled",
      date: "May 9, 2023",
    },
    {
      id: "BK-005",
      user: "Michael Wilson",
      provider: "Dr. Taylor",
      service: "Vaccination",
      status: "Confirmed",
      date: "May 14, 2023",
    },
    {
      id: "BK-006",
      user: "Sarah Johnson",
      provider: "Dr. Brown",
      service: "Dental Cleaning",
      status: "Pending",
      date: "May 15, 2023",
    },
    {
      id: "BK-007",
      user: "David Lee",
      provider: "Dr. Davis",
      service: "Checkup",
      status: "Completed",
      date: "May 8, 2023",
    },
  ];

  const recentUsers = [
    {
      id: "USR-001",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      joined: "May 11, 2023",
    },
    {
      id: "USR-002",
      name: "David Lee",
      email: "david@example.com",
      joined: "May 10, 2023",
    },
    {
      id: "USR-003",
      name: "Lisa Chen",
      email: "lisa@example.com",
      joined: "May 9, 2023",
    },
    {
      id: "USR-004",
      name: "James Wilson",
      email: "james@example.com",
      joined: "May 8, 2023",
    },
    {
      id: "USR-005",
      name: "Emma Brown",
      email: "emma@example.com",
      joined: "May 7, 2023",
    },
    {
      id: "USR-006",
      name: "Michael Smith",
      email: "michael@example.com",
      joined: "May 6, 2023",
    },
  ];

  const revenueData = [
    { name: "Jan", revenue: 4000 },
    { name: "Feb", revenue: 3000 },
    { name: "Mar", revenue: 5000 },
    { name: "Apr", revenue: 4500 },
    { name: "May", revenue: 6000 },
    { name: "Jun", revenue: 5500 },
  ];

  // Pagination for bookings
  const bookingsTotalPages = Math.ceil(recentBookings.length / itemsPerPage);
  const bookingsIndexOfLast = bookingsPage * itemsPerPage;
  const bookingsIndexOfFirst = bookingsIndexOfLast - itemsPerPage;
  const currentBookings = recentBookings.slice(
    bookingsIndexOfFirst,
    bookingsIndexOfLast
  );

  // Pagination for users
  const usersTotalPages = Math.ceil(recentUsers.length / itemsPerPage);
  const usersIndexOfLast = usersPage * itemsPerPage;
  const usersIndexOfFirst = usersIndexOfLast - itemsPerPage;
  const currentUsers = recentUsers.slice(usersIndexOfFirst, usersIndexOfLast);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Cards */}
        <motion.div
          variants={cardVariants}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ scale: 1.01 }}
              className={`bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-purple-200/50 p-5 ${stat.color}`}
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-opacity-50">
                  <stat.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="ml-5 flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts and Tables */}
        <motion.div
          variants={cardVariants}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          {/* Revenue Chart */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.01 }}
            className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-purple-200/50 overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Revenue Overview
              </h3>
              <div className="mt-5 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        border: "1px solid rgba(209, 213, 219, 0.5)",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#4b5563"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Recent Users */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.01 }}
            className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-purple-200/50 overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Recently Registered Users
              </h3>
              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200/50">
                  <thead className="bg-gray-50/50">
                    <tr>
                      {["Name", "Email", "Joined"].map((col) => (
                        <th
                          key={col}
                          className="py-3 px-4 text-left text-sm font-semibold text-gray-700"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50">
                    <AnimatePresence>
                      {currentUsers.map((user) => (
                        <motion.tr
                          key={user.id}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, x: 20 }}
                          className="hover:bg-gray-100/50 transition-colors duration-200"
                        >
                          <td className="py-4 px-4 text-sm font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {user.email}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {user.joined}
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
              {recentUsers.length > itemsPerPage && (
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {usersIndexOfFirst + 1} to{" "}
                    {Math.min(usersIndexOfLast, recentUsers.length)} of{" "}
                    {recentUsers.length} users
                  </p>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={usersPage === 1}
                      onClick={() => setUsersPage(usersPage - 1)}
                      className={`p-2 rounded-full ${
                        usersPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      } transition-all duration-200`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </motion.button>
                    {Array.from(
                      { length: usersTotalPages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <motion.button
                        key={page}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setUsersPage(page)}
                        className={`px-3 py-1 rounded-xl text-sm ${
                          usersPage === page
                            ? "bg-gray-800 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        } transition-all duration-200`}
                      >
                        {page}
                      </motion.button>
                    ))}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={usersPage === usersTotalPages}
                      onClick={() => setUsersPage(usersPage + 1)}
                      className={`p-2 rounded-full ${
                        usersPage === usersTotalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      } transition-all duration-200`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Bookings */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.01 }}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-purple-200/50 overflow-hidden"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Bookings
            </h3>
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200/50">
                <thead className="bg-gray-50/50">
                  <tr>
                    {["User", "Provider", "Service", "Status", "Date"].map(
                      (col) => (
                        <th
                          key={col}
                          className="py-3 px-4 text-left text-sm font-semibold text-gray-700"
                        >
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  <AnimatePresence>
                    {currentBookings.map((booking) => (
                      <motion.tr
                        key={booking.id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: 20 }}
                        className="hover:bg-gray-100/50 transition-colors duration-200"
                      >
                        <td className="py-4 px-4 text-sm font-medium text-gray-900">
                          {booking.user}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {booking.provider}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {booking.service}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              booking.status === "Confirmed"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : booking.status === "Completed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {booking.date}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            {recentBookings.length > itemsPerPage && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {bookingsIndexOfFirst + 1} to{" "}
                  {Math.min(bookingsIndexOfLast, recentBookings.length)} of{" "}
                  {recentBookings.length} bookings
                </p>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={bookingsPage === 1}
                    onClick={() => setBookingsPage(bookingsPage - 1)}
                    className={`p-2 rounded-full ${
                      bookingsPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } transition-all duration-200`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </motion.button>
                  {Array.from(
                    { length: bookingsTotalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <motion.button
                      key={page}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setBookingsPage(page)}
                      className={`px-3 py-1 rounded-xl text-sm ${
                        bookingsPage === page
                          ? "bg-gray-800 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      } transition-all duration-200`}
                    >
                      {page}
                    </motion.button>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={bookingsPage === bookingsTotalPages}
                    onClick={() => setBookingsPage(bookingsPage + 1)}
                    className={`p-2 rounded-full ${
                      bookingsPage === bookingsTotalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } transition-all duration-200`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
