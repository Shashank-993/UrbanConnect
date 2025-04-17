"use client";

import { useState } from "react";
import { Search, Filter, Eye, Edit, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminProvidersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [isSpecialtyFilterOpen, setIsSpecialtyFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const providersPerPage = 5;

  // Mock data
  const providers = [
    { id: "PRV-001", name: "Dr. Smith", specialty: "Dentist", email: "smith@example.com", joined: "May 1, 2023" },
    { id: "PRV-002", name: "Dr. Johnson", specialty: "Optometrist", email: "johnson@example.com", joined: "May 2, 2023" },
    { id: "PRV-003", name: "Dr. Williams", specialty: "Physiotherapist", email: "williams@example.com", joined: "May 3, 2023" },
    { id: "PRV-004", name: "Dr. Brown", specialty: "Dermatologist", email: "brown@example.com", joined: "May 4, 2023" },
    { id: "PRV-005", name: "Dr. Davis", specialty: "Cardiologist", email: "davis@example.com", joined: "May 5, 2023" },
    { id: "PRV-006", name: "Dr. Wilson", specialty: "Dentist", email: "wilson@example.com", joined: "May 6, 2023" },
    { id: "PRV-007", name: "Dr. Taylor", specialty: "Optometrist", email: "taylor@example.com", joined: "May 7, 2023" },
    { id: "PRV-008", name: "Dr. Clark", specialty: "Physiotherapist", email: "clark@example.com", joined: "May 8, 2023" },
  ];

  // Filter and search
  const filteredProviders = providers
    .filter((provider) => specialtyFilter === "all" || provider.specialty.toLowerCase() === specialtyFilter)
    .filter(
      (provider) =>
        provider.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Pagination
  const totalPages = Math.ceil(filteredProviders.length / providersPerPage);
  const indexOfLastProvider = currentPage * providersPerPage;
  const indexOfFirstProvider = indexOfLastProvider - providersPerPage;
  const currentProviders = filteredProviders.slice(indexOfFirstProvider, indexOfLastProvider);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Mock actions
  const handleView = (provider) => console.log("View provider:", provider.id);
  const handleEdit = (provider) => console.log("Edit provider:", provider.id);
  const handleDelete = (provider) => console.log("Delete provider:", provider.id);

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
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Providers</h2>
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search providers..."
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
                  onClick={() => setIsSpecialtyFilterOpen(!isSpecialtyFilterOpen)}
                >
                  <Filter className="h-4 w-4" />
                  {specialtyFilter === "all" ? "All Specialties" : specialtyFilter.charAt(0).toUpperCase() + specialtyFilter.slice(1)}
                </motion.button>
                <AnimatePresence>
                  {isSpecialtyFilterOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-10 overflow-hidden"
                    >
                      {["all", "dentist", "optometrist", "physiotherapist", "dermatologist", "cardiologist"].map(
                        (specialty) => (
                          <motion.button
                            key={specialty}
                            whileHover={{ scale: 1.01, backgroundColor: "#f3f4f6" }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 transition-all duration-200"
                            onClick={() => {
                              setSpecialtyFilter(specialty);
                              setIsSpecialtyFilterOpen(false);
                            }}
                          >
                            {specialty === "all"
                              ? "All Specialties"
                              : specialty.charAt(0).toUpperCase() + specialty.slice(1)}
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
                    {["Provider ID", "Name", "Specialty", "Email", "Joined", "Actions"].map((col) => (
                      <th key={col} className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  <AnimatePresence>
                    {currentProviders.map((provider) => (
                      <motion.tr
                        key={provider.id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: 20 }}
                        className="hover:bg-gray-100/50 transition-colors duration-200"
                      >
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{provider.id}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{provider.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{provider.specialty}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{provider.email}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{provider.joined}</td>
                        <td className="py-3 px-4 text-sm text-right">
                          <div className="flex justify-end space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleView(provider)}
                              className="p-2 rounded-full bg-blue-500/20 text-blue-600 hover:bg-blue-500/30 transition-all duration-200"
                            >
                              <Eye className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEdit(provider)}
                              className="p-2 rounded-full bg-green-500/20 text-green-600 hover:bg-green-500/30 transition-all duration-200"
                            >
                              <Edit className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(provider)}
                              className="p-2 rounded-full bg-red-500/20 text-red-600 hover:bg-red-500/30 transition-all duration-200"
                            >
                              <Trash className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            {filteredProviders.length > providersPerPage && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {indexOfFirstProvider + 1} to {Math.min(indexOfLastProvider, filteredProviders.length)} of{" "}
                  {filteredProviders.length} providers
                </p>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`p-2 rounded-full ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } transition-all duration-200`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </motion.button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <motion.button
                      key={page}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-xl text-sm ${
                        currentPage === page
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
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
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
      </div>
    </motion.div>
  );
}