"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const paymentsPerPage = 5;

  // Sample data (updated for 2025)
  const [payments, setPayments] = useState([
    {
      id: "PAY-1234",
      client: "John Doe",
      service: "Dental Checkup",
      amount: 120,
      date: "2025-04-01",
      status: "paid",
    },
    {
      id: "PAY-2345",
      client: "Jane Smith",
      service: "Teeth Cleaning",
      amount: 95,
      date: "2025-04-02",
      status: "paid",
    },
    {
      id: "PAY-3456",
      client: "Robert Brown",
      service: "Root Canal",
      amount: 350,
      date: "2025-04-03",
      status: "pending",
    },
    {
      id: "PAY-4567",
      client: "Emily Davis",
      service: "Dental Consultation",
      amount: 80,
      date: "2025-04-04",
      status: "paid",
    },
    {
      id: "PAY-5678",
      client: "Michael Wilson",
      service: "Teeth Whitening",
      amount: 250,
      date: "2025-04-05",
      status: "paid",
    },
    {
      id: "PAY-6789",
      client: "Sarah Johnson",
      service: "Dental Filling",
      amount: 150,
      date: "2025-04-06",
      status: "pending",
    },
  ]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      // Optional: Trigger search API call
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Filter and paginate payments
  const filteredPayments = payments
    .filter(
      (payment) => statusFilter === "all" || payment.status === statusFilter
    )
    .filter(
      (payment) =>
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.client.toLowerCase().includes(searchTerm.toLowerCase())
    );
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );

  // Handlers
  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setViewModalOpen(true);
  };

  const exportToCSV = () => {
    setIsExporting(true);
    const headers = [
      "Transaction ID",
      "Client",
      "Service",
      "Amount",
      "Date",
      "Status",
    ];
    const csvData = filteredPayments.map((payment) =>
      [
        `"${payment.id.replace(/"/g, '""')}"`,
        `"${payment.client.replace(/"/g, '""')}"`,
        `"${payment.service.replace(/"/g, '""')}"`,
        payment.amount.toFixed(2),
        payment.date,
        payment.status,
      ].join(",")
    );
    const csvContent = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "payments.csv";
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setIsExporting(false), 1000);
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
        {/* Card with Table */}
        <motion.div
          variants={cardVariants}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-purple-300/75"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payments</h2>
            <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search payments..."
                  aria-label="Search payments"
                  className="block w-full pl-10 px-3 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    className="px-3 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    aria-label="Filter payments by status"
                  >
                    <option value="all">All Statuses</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all duration-200 disabled:opacity-50"
                  onClick={exportToCSV}
                  disabled={isExporting}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? "Exporting..." : "Export CSV"}
                </motion.button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200/50">
                <thead className="bg-gray-50/50">
                  <tr>
                    {[
                      "Transaction ID",
                      "Client",
                      "Service",
                      "Amount",
                      "Date",
                      "Status",
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
                  {currentPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-gray-100/50 transition-colors duration-200"
                    >
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">
                        {payment.id}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {payment.client}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {payment.service}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        ${payment.amount.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {payment.date}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            payment.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {payment.status.charAt(0).toUpperCase() +
                            payment.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-right">
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleViewPayment(payment)}
                          className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200"
                        >
                          <Eye className="h-4 w-4" />
                        </motion.button>
                      </td>
                    </tr>
                  ))}
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

        {/* View Payment Modal */}
        <AnimatePresence>
          {viewModalOpen && selectedPayment && (
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
                className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-purple-300/75 w-full max-w-md mx-4 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  Payment Details
                </h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Transaction ID
                    </p>
                    <p className="text-sm text-gray-900">
                      {selectedPayment.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Client</p>
                    <p className="text-sm text-gray-900">
                      {selectedPayment.client}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Service</p>
                    <p className="text-sm text-gray-900">
                      {selectedPayment.service}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Amount</p>
                    <p className="text-sm text-gray-900">
                      ${selectedPayment.amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="text-sm text-gray-900">
                      {selectedPayment.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="text-sm text-gray-900">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          selectedPayment.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedPayment.status.charAt(0).toUpperCase() +
                          selectedPayment.status.slice(1)}
                      </span>
                    </p>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all duration-200"
                      onClick={() => setViewModalOpen(false)}
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
