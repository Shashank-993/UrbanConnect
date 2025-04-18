"use client";

import { useState } from "react";
import {
  Calendar,
  CheckCircle,
  DollarSign,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [bookingsPage, setBookingsPage] = useState(1);
  const itemsPerPage = 5;

  // Sample data
  const stats = [
    {
      title: "Total Appointments",
      value: "2,841",
      icon: Calendar,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Completed Services",
      value: "1,920",
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Revenue",
      value: "$94,256",
      icon: DollarSign,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Pending Requests",
      value: "128",
      icon: Clock,
      color: "bg-purple-100 text-purple-600",
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

  // Pagination for bookings
  const bookingsTotalPages = Math.ceil(recentBookings.length / itemsPerPage);
  const bookingsIndexOfLast = bookingsPage * itemsPerPage;
  const bookingsIndexOfFirst = bookingsIndexOfLast - itemsPerPage;
  const currentBookings = recentBookings.slice(
    bookingsIndexOfFirst,
    bookingsIndexOfLast
  );

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
