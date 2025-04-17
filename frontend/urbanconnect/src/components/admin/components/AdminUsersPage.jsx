"use client";

import { useState } from "react";
import { Search, Filter, Eye, Edit, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isRoleFilterOpen, setIsRoleFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Mock data
  const users = [
    { id: "USR-001", name: "John Doe", email: "john@example.com", role: "resident", joined: "May 1, 2023" },
    { id: "USR-002", name: "Jane Smith", email: "jane@example.com", role: "provider", joined: "May 2, 2023" },
    { id: "USR-003", name: "Bob Johnson", email: "bob@example.com", role: "resident", joined: "May 3, 2023" },
    { id: "USR-004", name: "Alice Brown", email: "alice@example.com", role: "admin", joined: "May 4, 2023" },
    { id: "USR-005", name: "Charlie Davis", email: "charlie@example.com", role: "resident", joined: "May 5, 2023" },
    { id: "USR-006", name: "Diana Wilson", email: "diana@example.com", role: "provider", joined: "May 6, 2023" },
    { id: "USR-007", name: "Eve Miller", email: "eve@example.com", role: "resident", joined: "May 7, 2023" },
    { id: "USR-008", name: "Frank Taylor", email: "frank@example.com", role: "admin", joined: "May 8, 2023" },
  ];

  // Filter and search
  const filteredUsers = users
    .filter((user) => roleFilter === "all" || user.role === roleFilter)
    .filter(
      (user) =>
        user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Mock actions
  const handleView = (user) => console.log("View user:", user.id);
  const handleEdit = (user) => console.log("Edit user:", user.id);
  const handleDelete = (user) => console.log("Delete user:", user.id);

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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Users</h2>
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search users..."
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
                  onClick={() => setIsRoleFilterOpen(!isRoleFilterOpen)}
                >
                  <Filter className="h-4 w-4" />
                  {roleFilter === "all" ? "All Roles" : roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)}
                </motion.button>
                <AnimatePresence>
                  {isRoleFilterOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-10 overflow-hidden"
                    >
                      {["all", "resident", "provider", "admin"].map((role) => (
                        <motion.button
                          key={role}
                          whileHover={{ scale: 1.01, backgroundColor: "#f3f4f6" }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 transition-all duration-200"
                          onClick={() => {
                            setRoleFilter(role);
                            setIsRoleFilterOpen(false);
                          }}
                        >
                          {role === "all" ? "All Roles" : role.charAt(0).toUpperCase() + role.slice(1)}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200/50">
                <thead className="bg-gray-50/50">
                  <tr>
                    {["User ID", "Name", "Email", "Role", "Joined", "Actions"].map((col) => (
                      <th key={col} className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
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
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{user.id}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{user.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{user.joined}</td>
                        <td className="py-3 px-4 text-sm text-right">
                          <div className="flex justify-end space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleView(user)}
                              className="p-2 rounded-full bg-blue-500/20 text-blue-600 hover:bg-blue-500/30 transition-all duration-200"
                            >
                              <Eye className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEdit(user)}
                              className="p-2 rounded-full bg-green-500/20 text-green-600 hover:bg-green-500/30 transition-all duration-200"
                            >
                              <Edit className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(user)}
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
            {filteredUsers.length > usersPerPage && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
                  {filteredUsers.length} users
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