"use client";

import { Users, Briefcase, Calendar, DollarSign, ArrowRight } from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  // Sample data for the dashboard
  const stats = [
    {
      title: "Total Users",
      value: "1,284",
      icon: Users,
      color: "bg-blue-500/20 text-blue-600",
    },
    {
      title: "Total Providers",
      value: "348",
      icon: Briefcase,
      color: "bg-green-500/20 text-green-600",
    },
    {
      title: "Total Appointments",
      value: "2,841",
      icon: Calendar,
      color: "bg-purple-500/20 text-purple-600",
    },
    {
      title: "Total Revenue",
      value: "$94,256",
      icon: DollarSign,
      color: "bg-yellow-500/20 text-yellow-600",
    },
  ];

  const recentBookings = [
    {
      user: "John Doe",
      provider: "Dr. Smith",
      service: "Dental Checkup",
      status: "Confirmed",
      date: "May 12, 2023",
    },
    {
      user: "Jane Smith",
      provider: "Dr. Johnson",
      service: "Eye Exam",
      status: "Pending",
      date: "May 13, 2023",
    },
    {
      user: "Robert Brown",
      provider: "Dr. Williams",
      service: "Physical Therapy",
      status: "Completed",
      date: "May 10, 2023",
    },
    {
      user: "Emily Davis",
      provider: "Dr. Miller",
      service: "Consultation",
      status: "Cancelled",
      date: "May 9, 2023",
    },
    {
      user: "Michael Wilson",
      provider: "Dr. Taylor",
      service: "Vaccination",
      status: "Confirmed",
      date: "May 14, 2023",
    },
  ];

  const recentUsers = [
    { name: "Sarah Johnson", email: "sarah@example.com", joined: "May 11, 2023" },
    { name: "David Lee", email: "david@example.com", joined: "May 10, 2023" },
    { name: "Lisa Chen", email: "lisa@example.com", joined: "May 9, 2023" },
  ];

  const revenueData = [
    { name: "Jan", revenue: 4000 },
    { name: "Feb", revenue: 3000 },
    { name: "Mar", revenue: 5000 },
    { name: "Apr", revenue: 4500 },
    { name: "May", revenue: 6000 },
    { name: "Jun", revenue: 5500 },
  ];

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
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.3 },
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
          variants={containerVariants}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <AnimatePresence>
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
              >
                <div className="p-6 flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <stat.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Revenue Chart */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Revenue Overview</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                  >
                    <XAxis dataKey="name" stroke="#6B7280" fontSize={14} />
                    <YAxis stroke="#6B7280" fontSize={14} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                      itemStyle={{ color: "#1F2937" }}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="url(#colorRevenue)"
                      radius={[8, 8, 0, 0]}
                      barSize={30}
                    >
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FBBF24" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Recent Users */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Recent Users</h3>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.92 }}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  View All <ArrowRight size={16} className="ml-1" />
                </motion.button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200/50">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50">
                    {recentUsers.map((user, index) => (
                      <motion.tr
                        key={index}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        className="hover:bg-gray-100/50 transition-colors duration-200"
                      >
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{user.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{user.joined}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Bookings */}
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Recent Bookings</h3>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.92 }}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                View All <ArrowRight size={16} className="ml-1" />
              </motion.button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200/50">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">User</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Provider</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Service</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  {recentBookings.map((booking, index) => (
                    <motion.tr
                      key={index}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      className="hover:bg-gray-100/50 transition-colors duration-200"
                    >
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{booking.user}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{booking.provider}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{booking.service}</td>
                      <td className="py-3 px-4 text-sm">
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
                      <td className="py-3 px-4 text-sm text-gray-600">{booking.date}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
}