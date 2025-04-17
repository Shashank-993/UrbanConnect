"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Check,
  X,
  Calendar,
  Clock,
  Video,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointments, setAppointments] = useState([]);
  const appointmentsPerPage = 5;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/appointments/provider",
          {
            withCredentials: true,
          }
        );
        console.log("Fetched appointments:", response.data.data); // Debug log
        setAppointments(response.data.data || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        alert("Failed to load appointments: " + error.message);
      }
    };
    fetchAppointments();
  }, []);

  // Filter and search
  const filteredAppointments = appointments
    .filter(
      (appointment) =>
        statusFilter === "all" || appointment.status === statusFilter
    )
    .filter(
      (appointment) =>
        appointment.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || // Changed from client
        appointment.service.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Pagination
  const totalPages = Math.ceil(
    filteredAppointments.length / appointmentsPerPage
  );
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  // Handlers
  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setViewModalOpen(true);
  };

  const handleConfirm = async (appointment) => {
    try {
      await axios.patch(
        `http://localhost:5000/appointments/${appointment._id}`,
        { status: "confirmed" },
        {
          withCredentials: true,
        }
      );
      setAppointments(
        appointments.map((a) =>
          a._id === appointment._id ? { ...a, status: "confirmed" } : a
        )
      );
      console.log("Confirmed:", appointment._id);
    } catch (error) {
      console.error("Error confirming:", error);
    }
  };

  const handleCancel = async (appointment) => {
    try {
      await axios.patch(
        `http://localhost:5000/appointments/${appointment._id}`,
        { status: "cancelled" },
        {
          withCredentials: true,
        }
      );
      setAppointments(
        appointments.map((a) =>
          a._id === appointment._id ? { ...a, status: "cancelled" } : a
        )
      );
      console.log("Cancelled:", appointment._id);
    } catch (error) {
      console.error("Error cancelling:", error);
    }
  };

  // Animation variants (unchanged)
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

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
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
          whileHover={{ scale: 1.00 }}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-purple-200/50 overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Appointments
            </h2>
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
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
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm text-gray-600 hover:bg-gray-200/50 transition-all duration-200"
                  onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
                >
                  <Filter className="h-4 w-4" />
                  {statusFilter === "all"
                    ? "All Statuses"
                    : statusFilter.charAt(0).toUpperCase() +
                      statusFilter.slice(1)}
                </motion.button>
                <AnimatePresence>
                  {isStatusFilterOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-purple-200/50 z-10 overflow-hidden"
                    >
                      {["all", "confirmed", "pending", "cancelled"].map(
                        (status) => (
                          <motion.button
                            key={status}
                            whileHover={{
                              scale: 1.01,
                              backgroundColor: "#f3f4f6",
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 transition-all duration-200"
                            onClick={() => {
                              setStatusFilter(status);
                              setIsStatusFilterOpen(false);
                            }}
                          >
                            {status === "all"
                              ? "All Statuses"
                              : status.charAt(0).toUpperCase() +
                                status.slice(1)}
                          </motion.button>
                        )
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200/50">
                <thead className="bg-gray-50/50">
                  <tr>
                    {[
                      "Client",
                      "Service",
                      "Date & Time",
                      "Status",
                      "Mode",
                      "Actions",
                    ].map((col) => (
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
                    {currentAppointments.map((appointment) => (
                      <motion.tr
                        key={appointment._id} // Use _id instead of id
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: 20 }}
                        className="hover:bg-gray-100/50 transition-colors duration-200"
                      >
                        <td className="py-4 px-4 text-sm font-medium text-gray-900">
                          {appointment.fullName} {/* Changed from client */}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {appointment.serviceName} {/* Use serviceName */}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {new Date(appointment.date).toLocaleDateString()},{" "}
                          {appointment.time}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              appointment.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : appointment.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {appointment.status.charAt(0).toUpperCase() +
                              appointment.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600 flex items-center">
                          {appointment.mode === "in-person" ? (
                            <>
                              <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                              In-person
                            </>
                          ) : (
                            <>
                              <Video className="h-4 w-4 mr-1 text-blue-500" />
                              Video Call
                            </>
                          )}
                        </td>
                        <td className="py-4 px-4 text-sm text-right">
                          <div className="flex justify-end space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleViewAppointment(appointment)}
                              className="p-2 rounded-full bg-blue-500/20 text-blue-600 hover:bg-blue-500/30 transition-all duration-200"
                            >
                              <Clock className="h-4 w-4" />
                            </motion.button>
                            {appointment.status === "pending" && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleConfirm(appointment)}
                                  className="p-2 rounded-full bg-green-500/20 text-green-600 hover:bg-green-500/30 transition-all duration-200"
                                >
                                  <Check className="h-4 w-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleCancel(appointment)}
                                  className="p-2 rounded-full bg-red-500/20 text-red-600 hover:bg-red-500/30 transition-all duration-200"
                                >
                                  <X className="h-4 w-4" />
                                </motion.button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            {filteredAppointments.length > appointmentsPerPage && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {indexOfFirstAppointment + 1} to{" "}
                  {Math.min(
                    indexOfLastAppointment,
                    filteredAppointments.length
                  )}{" "}
                  of {filteredAppointments.length} appointments
                </p>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className={`p-2 rounded-full ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } transition-all duration-200`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </motion.button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <motion.button
                        key={page}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-xl text-sm ${
                          currentPage === page
                            ? "bg-gray-800 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        } transition-all duration-200`}
                      >
                        {page}
                      </motion.button>
                    )
                  )}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className={`p-2 rounded-full ${
                      currentPage === totalPages
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

        {/* View Appointment Modal */}
        <AnimatePresence>
          {viewModalOpen && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-purple-200/50 w-full max-w-md mx-4 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  Appointment Details
                </h3>
                {selectedAppointment && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Client
                      </p>
                      <p className="text-sm text-gray-900">
                        {selectedAppointment.fullName}{" "}
                        {/* Changed from client */}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Service
                      </p>
                      <p className="text-sm text-gray-900">
                        {selectedAppointment.serviceName}{" "}
                        {/* Use serviceName */}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Date & Time
                      </p>
                      <p className="text-sm text-gray-900">
                        {new Date(
                          selectedAppointment.date
                        ).toLocaleDateString()}
                        , {selectedAppointment.time}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Mode</p>
                      <p className="text-sm text-gray-900 flex items-center">
                        {selectedAppointment.mode === "in-person" ? (
                          <>
                            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                            In-person
                          </>
                        ) : (
                          <>
                            <Video className="h-4 w-4 mr-1 text-blue-500" />
                            Video Call
                          </>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Status
                      </p>
                      <p className="text-sm text-gray-900">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            selectedAppointment.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : selectedAppointment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedAppointment.status.charAt(0).toUpperCase() +
                            selectedAppointment.status.slice(1)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Notes</p>
                      <p className="text-sm text-gray-900">
                        {selectedAppointment.notes}
                      </p>
                    </div>
                    <div className="pt-4 flex justify-end space-x-2">
                      {selectedAppointment.status === "pending" && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleConfirm(selectedAppointment)}
                            className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200"
                          >
                            Confirm
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCancel(selectedAppointment)}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200"
                          >
                            Cancel
                          </motion.button>
                        </>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setViewModalOpen(false)}
                        className="px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all duration-200"
                      >
                        Close
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
