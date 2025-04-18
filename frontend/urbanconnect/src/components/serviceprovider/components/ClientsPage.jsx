"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Phone,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function ClientsPage() {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [clients, setClients] = useState([]);
  const clientsPerPage = 5;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:5000/clients", {
          withCredentials: true,
        });
        console.log("Fetched clients:", response.data.data);
        setClients(response.data.data || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
        alert("Failed to load clients: " + error.message);
      }
    };
    fetchClients();
  }, []);

  // Filter and search clients
  const filteredClients = clients.filter(
    (client) =>
      client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(
    indexOfFirstClient,
    indexOfLastClient
  );

  // Handlers
  const handleViewClient = (client) => {
    setSelectedClient(client);
    setViewModalOpen(true);
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
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
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
              Clients
            </h2>
            <div className="flex flex-col sm:flex-row justify-between gap-5 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50/80">
                  <tr>
                    {["Name", "Email", "Phone", "Next Appointment"].map(
                      (col) => (
                        <th
                          key={col}
                          className="py-4 px-6 text-left text-sm font-semibold text-slate-700 tracking-wider"
                        >
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <AnimatePresence>
                    {currentClients.map((client) => (
                      <motion.tr
                        key={client._id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: 20 }}
                        className="hover:bg-slate-50 transition-colors duration-200"
                      >
                        <td className="py-4 px-6 text-sm font-medium text-slate-800">
                          {client.fullName}
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-600">
                          <span className="flex items-center">
                            <Mail className="h-4 w-4 mr-1.5 text-slate-400" />
                            {client.email}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-600">
                          <span className="flex items-center">
                            <Phone className="h-4 w-4 mr-1.5 text-slate-400" />
                            {client.phone}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-600">
                          {client.nextAppointment ? (
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1.5 text-indigo-500" />
                              <span className="font-medium">
                                {client.nextAppointment}
                              </span>
                            </span>
                          ) : (
                            <span className="text-slate-500 italic">
                              None scheduled
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            {filteredClients.length > clientsPerPage && (
              <div className="mt-8 flex items-center justify-between">
                <p className="text-sm text-slate-600 font-medium">
                  Showing {indexOfFirstClient + 1} to{" "}
                  {Math.min(indexOfLastClient, filteredClients.length)} of{" "}
                  {filteredClients.length} clients
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
      </div>
    </motion.div>
  );
}
