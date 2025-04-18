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
  const [originalAppointments, setOriginalAppointments] = useState([]); // Store original data
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
        const data = response.data.data || [];
        // Load cleared appointment IDs from localStorage
        const clearedIds = JSON.parse(
          localStorage.getItem("clearedAppointments") || "[]"
        );
        const filteredData = data.filter(
          (appointment) => !clearedIds.includes(appointment._id)
        );
        setAppointments(filteredData);
        setOriginalAppointments(data); // Save original data
      } catch (error) {
        console.error("Error fetching appointments:", error);
        alert("Failed to load appointments: " + error.message);
      }
    };
    fetchAppointments();
  }, []);

  // Clear individual appointment locally and store in localStorage
  const handleClearAppointment = (appointmentId) => {
    const updatedAppointments = appointments.filter(
      (a) => a._id !== appointmentId
    );
    setAppointments(updatedAppointments);
    setCurrentPage(1); // Reset to first page
    // Update localStorage with cleared IDs
    const clearedIds = JSON.parse(
      localStorage.getItem("clearedAppointments") || "[]"
    );
    if (!clearedIds.includes(appointmentId)) {
      clearedIds.push(appointmentId);
      localStorage.setItem("clearedAppointments", JSON.stringify(clearedIds));
    }
  };

  // Filter and search
  const filteredAppointments = appointments
    .filter(
      (appointment) =>
        statusFilter === "all" || appointment.status === statusFilter
    )
    .filter(
      (appointment) =>
        appointment.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
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
      setOriginalAppointments(
        originalAppointments.map((a) =>
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
      setOriginalAppointments(
        originalAppointments.map((a) =>
          a._id === appointment._id ? { ...a, status: "cancelled" } : a
        )
      );
      console.log("Cancelled:", appointment._id);
    } catch (error) {
      console.error("Error cancelling:", error);
    }
  };

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
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          variants={cardVariants}
          whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-indigo-100 overflow-hidden transition-all duration-300"
        >
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 tracking-tight">
              Appointments
            </h2>
            <div className="flex flex-col sm:flex-row justify-between gap-5 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#f1f5f9" }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-100 transition-all duration-200 shadow-sm"
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
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-indigo-100 z-10 overflow-hidden"
                    >
                      {["all", "confirmed", "pending", "cancelled"].map(
                        (status) => (
                          <motion.button
                            key={status}
                            whileHover={{
                              scale: 1.01,
                              backgroundColor: "#f8fafc",
                            }}
                            className="block w-full text-left px-5 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-all duration-200 font-medium"
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
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50/80">
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
                        className="py-4 px-6 text-left text-sm font-semibold text-slate-700 tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <AnimatePresence>
                    {currentAppointments.map((appointment) => (
                      <motion.tr
                        key={appointment._id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: 20 }}
                        className="hover:bg-slate-50 transition-colors duration-200"
                      >
                        <td className="py-4 px-6 text-sm font-medium text-slate-800">
                          {appointment.fullName}
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-600">
                          {appointment.serviceName}
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-600">
                          {new Date(appointment.date).toLocaleDateString()},{" "}
                          <span className="font-medium">
                            {appointment.time}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                              appointment.status === "confirmed"
                                ? "bg-emerald-100 text-emerald-800"
                                : appointment.status === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {appointment.status.charAt(0).toUpperCase() +
                              appointment.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-600 flex items-center">
                          {appointment.mode === "in-person" ? (
                            <>
                              <Calendar className="h-4 w-4 mr-1.5 text-slate-500" />
                              <span className="font-medium">In-person</span>
                            </>
                          ) : (
                            <>
                              <Video className="h-4 w-4 mr-1.5 text-indigo-500" />
                              <span className="font-medium">Video Call</span>
                            </>
                          )}
                        </td>
                        <td className="py-4 px-6 text-sm text-right">
                          <div className="flex justify-end space-x-3">
                            <motion.button
                              whileHover={{
                                scale: 1.05,
                                backgroundColor: "#dbeafe",
                              }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleViewAppointment(appointment)}
                              className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200"
                            >
                              <Clock className="h-4 w-4" />
                            </motion.button>
                            {appointment.status === "pending" && (
                              <>
                                <motion.button
                                  whileHover={{
                                    scale: 1.05,
                                    backgroundColor: "#dcfce7",
                                  }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleConfirm(appointment)}
                                  className="p-2 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-all duration-200"
                                >
                                  <Check className="h-4 w-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{
                                    scale: 1.05,
                                    backgroundColor: "#fee2e2",
                                  }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleCancel(appointment)}
                                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
                                >
                                  <X className="h-4 w-4" />
                                </motion.button>
                              </>
                            )}
                            {(appointment.status === "confirmed" ||
                              appointment.status === "cancelled") && (
                              <motion.button
                                whileHover={{
                                  scale: 1.05,
                                  backgroundColor: "#fee2e2",
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  handleClearAppointment(appointment._id)
                                }
                                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
                              >
                                <X className="h-4 w-4" />
                              </motion.button>
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
              <div className="mt-8 flex items-center justify-between">
                <p className="text-sm text-slate-600 font-medium">
                  Showing {indexOfFirstAppointment + 1} to{" "}
                  {Math.min(
                    indexOfLastAppointment,
                    filteredAppointments.length
                  )}{" "}
                  of {filteredAppointments.length} appointments
                </p>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#f1f5f9" }}
                    whileTap={{ scale: 0.95 }}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className={`p-2 rounded-full ${
                      currentPage === 1
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    } transition-all duration-200`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </motion.button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <motion.button
                        key={page}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3.5 py-1.5 rounded-xl text-sm font-medium ${
                          currentPage === page
                            ? "bg-indigo-600 text-white shadow-md"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        } transition-all duration-200`}
                      >
                        {page}
                      </motion.button>
                    )
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#f1f5f9" }}
                    whileTap={{ scale: 0.95 }}
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className={`p-2 rounded-full ${
                      currentPage === totalPages
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm"
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
                className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-indigo-100 w-full max-w-md mx-4 p-8"
              >
                <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-6">
                  Appointment Details
                </h3>
                {selectedAppointment && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">
                        Client
                      </p>
                      <p className="text-base text-slate-800 font-medium">
                        {selectedAppointment.fullName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">
                        Service
                      </p>
                      <p className="text-base text-slate-800 font-medium">
                        {selectedAppointment.serviceName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">
                        Date & Time
                      </p>
                      <p className="text-base text-slate-800 font-medium">
                        {new Date(
                          selectedAppointment.date
                        ).toLocaleDateString()}
                        , {selectedAppointment.time}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">
                        Mode
                      </p>
                      <p className="text-base text-slate-800 font-medium flex items-center">
                        {selectedAppointment.mode === "in-person" ? (
                          <>
                            <Calendar className="h-4 w-4 mr-1.5 text-slate-500" />
                            In-person
                          </>
                        ) : (
                          <>
                            <Video className="h-4 w-4 mr-1.5 text-indigo-500" />
                            Video Call
                          </>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">
                        Status
                      </p>
                      <p className="text-base text-slate-800">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            selectedAppointment.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-800"
                              : selectedAppointment.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedAppointment.status.charAt(0).toUpperCase() +
                            selectedAppointment.status.slice(1)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">
                        Notes
                      </p>
                      <p className="text-base text-slate-800">
                        {selectedAppointment.notes || "No notes provided"}
                      </p>
                    </div>
                    <div className="pt-4 flex justify-end space-x-3">
                      {selectedAppointment.status === "pending" && (
                        <>
                          <motion.button
                            whileHover={{
                              scale: 1.02,
                              backgroundColor: "#059669",
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleConfirm(selectedAppointment)}
                            className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-200 font-medium shadow-md"
                          >
                            Confirm
                          </motion.button>
                          <motion.button
                            whileHover={{
                              scale: 1.02,
                              backgroundColor: "#dc2626",
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleCancel(selectedAppointment)}
                            className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium shadow-md"
                          >
                            Cancel
                          </motion.button>
                        </>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: "#1e293b" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setViewModalOpen(false)}
                        className="px-5 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-all duration-200 font-medium shadow-md"
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
