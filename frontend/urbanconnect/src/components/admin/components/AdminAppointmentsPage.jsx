"use client";

import { useState } from "react";
import { Search, Filter, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminAppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sample data
  const appointments = [
    {
      id: 1,
      user: "John Doe",
      provider: "Dr. Smith",
      service: "Dental Checkup",
      date: "May 15, 2023",
      time: "10:00 AM",
      status: "confirmed",
    },
    {
      id: 2,
      user: "Jane Smith",
      provider: "Dr. Johnson",
      service: "Eye Exam",
      date: "May 16, 2023",
      time: "2:30 PM",
      status: "pending",
    },
    {
      id: 3,
      user: "Robert Brown",
      provider: "Dr. Williams",
      service: "Physical Therapy",
      date: "May 14, 2023",
      time: "11:15 AM",
      status: "completed",
    },
    {
      id: 4,
      user: "Emily Davis",
      provider: "Dr. Miller",
      service: "Skin Consultation",
      date: "May 17, 2023",
      time: "9:45 AM",
      status: "cancelled",
    },
    {
      id: 5,
      user: "Michael Wilson",
      provider: "Dr. Taylor",
      service: "Heart Checkup",
      date: "May 18, 2023",
      time: "3:00 PM",
      status: "confirmed",
    },
    {
      id: 6,
      user: "Sarah Johnson",
      provider: "Dr. Anderson",
      service: "Vaccination",
      date: "May 19, 2023",
      time: "10:30 AM",
      status: "pending",
    },
    {
      id: 7,
      user: "David Lee",
      provider: "Dr. Thomas",
      service: "Blood Test",
      date: "May 13, 2023",
      time: "8:15 AM",
      status: "completed",
    },
  ];

  // Filter and search appointments
  const filteredAppointments = appointments
    .filter(
      (appointment) =>
        statusFilter === "all" || appointment.status === statusFilter
    )
    .filter(
      (appointment) =>
        appointment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.service.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Format appointment data for table
  const appointmentData = filteredAppointments.map((appointment) => ({
    user: appointment.user,
    provider: appointment.provider,
    service: appointment.service,
    dateTime: `${appointment.date}, ${appointment.time}`,
    status: (
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
          appointment.status === "confirmed"
            ? "bg-green-100 text-green-800"
            : appointment.status === "pending"
            ? "bg-yellow-100 text-yellow-800"
            : appointment.status === "completed"
            ? "bg-blue-100 text-blue-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {appointment.status.charAt(0).toUpperCase() +
          appointment.status.slice(1)}
      </span>
    ),
    action: (
      <select
        className="px-2 py-1 bg-gray-100 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
        value={appointment.status}
        onChange={(e) =>
          console.log(
            `Update status for ${appointment.id} to ${e.target.value}`
          )
        }
      >
        <option value="confirmed">Confirmed</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    ),
  }));

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
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                View All <ArrowRight size={16} className="ml-1" />
              </motion.button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  className="px-4 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200/50">
                <thead className="bg-gray-50/50">
                  <tr>
                    {[
                      "User",
                      "Provider",
                      "Service",
                      "Date & Time",
                      "Status",
                      "Action",
                    ].map((col, index) => (
                      <th
                        key={index}
                        className="py-3 px-4 text-left text-sm font-semibold text-gray-700"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  {appointmentData.map((row, index) => (
                    <motion.tr
                      key={index}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      className="hover:bg-gray-100/50 transition-colors duration-200"
                    >
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {row.user}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {row.provider}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {row.service}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {row.dateTime}
                      </td>
                      <td className="py-3 px-4 text-sm">{row.status}</td>
                      <td className="py-3 px-4 text-sm">{row.action}</td>
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
