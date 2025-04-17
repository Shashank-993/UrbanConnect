"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 5;

  // Sample data
  const payments = [
    {
      id: "PAY-1234",
      user: "John Doe",
      provider: "Dr. Smith",
      service: "Dental Checkup",
      amount: 120,
      date: "May 15, 2023",
      status: "paid",
    },
    {
      id: "PAY-2345",
      user: "Jane Smith",
      provider: "Dr. Johnson",
      service: "Eye Exam",
      amount: 95,
      date: "May 16, 2023",
      status: "paid",
    },
    {
      id: "PAY-3456",
      user: "Robert Brown",
      provider: "Dr. Williams",
      service: "Physical Therapy",
      amount: 85,
      date: "May 14, 2023",
      status: "paid",
    },
    {
      id: "PAY-4567",
      user: "Emily Davis",
      provider: "Dr. Miller",
      service: "Skin Consultation",
      amount: 150,
      date: "May 17, 2023",
      status: "failed",
    },
    {
      id: "PAY-5678",
      user: "Michael Wilson",
      provider: "Dr. Taylor",
      service: "Heart Checkup",
      amount: 200,
      date: "May 18, 2023",
      status: "pending",
    },
    {
      id: "PAY-6789",
      user: "Sarah Johnson",
      provider: "Dr. Anderson",
      service: "Vaccination",
      amount: 50,
      date: "May 19, 2023",
      status: "paid",
    },
    {
      id: "PAY-7890",
      user: "David Lee",
      provider: "Dr. Thomas",
      service: "Blood Test",
      amount: 75,
      date: "May 13, 2023",
      status: "failed",
    },
    {
      id: "PAY-8901",
      user: "Lisa Brown",
      provider: "Dr. Clark",
      service: "Allergy Test",
      amount: 100,
      date: "May 12, 2023",
      status: "pending",
    },
  ];

  // Filter and search payments
  const filteredPayments = payments
    .filter(
      (payment) => statusFilter === "all" || payment.status === statusFilter
    )
    .filter(
      (payment) =>
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.provider.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Pagination logic
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Transaction ID",
      "User",
      "Provider",
      "Service",
      "Amount",
      "Date",
      "Status",
    ];
    const csvData = filteredPayments.map((payment) => [
      payment.id,
      payment.user,
      payment.provider,
      payment.service,
      `$${payment.amount.toFixed(2)}`,
      payment.date,
      payment.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "payments.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Payments</h2>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                View All <ArrowRight size={16} className="ml-1" />
              </motion.button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search payments..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <select
                    className="px-4 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-xl shadow-md hover:bg-gray-900 transition-all duration-200"
                  onClick={exportToCSV}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </motion.button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200/50">
                <thead className="bg-gray-50/50">
                  <tr>
                    {[
                      "Transaction ID",
                      "User",
                      "Provider",
                      "Service",
                      "Amount",
                      "Date",
                      "Status",
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
                  <AnimatePresence>
                    {currentPayments.map((payment) => (
                      <motion.tr
                        key={payment.id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: 20 }}
                        className="hover:bg-gray-100/50 transition-colors duration-200"
                      >
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                          {payment.id}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {payment.user}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {payment.provider}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {payment.service}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          ${payment.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {payment.date}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              payment.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : payment.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {payment.status.charAt(0).toUpperCase() +
                              payment.status.slice(1)}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {filteredPayments.length > paymentsPerPage && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {indexOfFirstPayment + 1} to{" "}
                  {Math.min(indexOfLastPayment, filteredPayments.length)} of{" "}
                  {filteredPayments.length} payments
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
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
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
