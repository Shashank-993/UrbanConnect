"use client";

import { useState } from "react";
import {
  Search,
  Eye,
  Download,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminInvoicesPage() {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 5;

  // Sample data
  const invoices = [
    {
      id: "INV-1234",
      user: "John Doe",
      amount: 120,
      date: "May 15, 2023",
      status: "paid",
      items: [{ service: "Dental Checkup", price: 120, quantity: 1 }],
    },
    {
      id: "INV-2345",
      user: "Jane Smith",
      amount: 95,
      date: "May 16, 2023",
      status: "paid",
      items: [{ service: "Eye Exam", price: 95, quantity: 1 }],
    },
    {
      id: "INV-3456",
      user: "Robert Brown",
      amount: 170,
      date: "May 14, 2023",
      status: "paid",
      items: [{ service: "Physical Therapy", price: 85, quantity: 2 }],
    },
    {
      id: "INV-4567",
      user: "Emily Davis",
      amount: 150,
      date: "May 17, 2023",
      status: "unpaid",
      items: [{ service: "Skin Consultation", price: 150, quantity: 1 }],
    },
    {
      id: "INV-5678",
      user: "Michael Wilson",
      amount: 200,
      date: "May 18, 2023",
      status: "paid",
      items: [{ service: "Heart Checkup", price: 200, quantity: 1 }],
    },
    {
      id: "INV-6789",
      user: "Sarah Johnson",
      amount: 50,
      date: "May 19, 2023",
      status: "unpaid",
      items: [{ service: "Vaccination", price: 50, quantity: 1 }],
    },
    {
      id: "INV-7890",
      user: "David Lee",
      amount: 75,
      date: "May 13, 2023",
      status: "paid",
      items: [{ service: "Blood Test", price: 75, quantity: 1 }],
    },
    {
      id: "INV-8901",
      user: "Lisa Brown",
      amount: 100,
      date: "May 12, 2023",
      status: "paid",
      items: [{ service: "Allergy Test", price: 100, quantity: 1 }],
    },
  ];

  // Filter and search invoices
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle view invoice
  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setViewModalOpen(true);
  };

  // Handle download PDF (mock action)
  const handleDownloadPDF = (invoice) => {
    console.log(`Download PDF for invoice: ${invoice.id}`);
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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
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
              <h2 className="text-2xl font-bold text-gray-900">Invoices</h2>
              <motion.button
                whileHover={{ scale: 1.01 }}
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
                  placeholder="Search invoices..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200/50">
                <thead className="bg-gray-50/50">
                  <tr>
                    {[
                      "Invoice ID",
                      "User",
                      "Amount",
                      "Date",
                      "Status",
                      "Actions",
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
                    {currentInvoices.map((invoice) => (
                      <motion.tr
                        key={invoice.id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: 20 }}
                        className="hover:bg-gray-100/50 transition-colors duration-200"
                      >
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                          {invoice.id}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {invoice.user}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          ${invoice.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {invoice.date}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              invoice.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {invoice.status.charAt(0).toUpperCase() +
                              invoice.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-right">
                          <div className="flex justify-end space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleViewInvoice(invoice)}
                              className="p-2 rounded-full bg-blue-500/20 text-blue-600 hover:bg-blue-500/30 transition-all duration-200"
                            >
                              <Eye className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDownloadPDF(invoice)}
                              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
                            >
                              <Download className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {filteredInvoices.length > invoicesPerPage && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {indexOfFirstInvoice + 1} to{" "}
                  {Math.min(indexOfLastInvoice, filteredInvoices.length)} of{" "}
                  {filteredInvoices.length} invoices
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

        {/* View Invoice Modal */}
        <AnimatePresence>
          {viewModalOpen && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 max-w-lg w-full mx-4 p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Invoice Details
                </h3>
                {selectedInvoice && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">
                          Invoice #{selectedInvoice.id}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Date: {selectedInvoice.date}
                        </p>
                      </div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          selectedInvoice.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedInvoice.status.charAt(0).toUpperCase() +
                          selectedInvoice.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        Bill To:
                      </h5>
                      <p className="text-sm text-gray-900">
                        {selectedInvoice.user}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        Items:
                      </h5>
                      <table className="min-w-full divide-y divide-gray-200/50">
                        <thead className="bg-gray-50/50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                              Service
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">
                              Quantity
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">
                              Price
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200/50">
                          {selectedInvoice.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {item.service}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900 text-right">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900 text-right">
                                ${item.price.toFixed(2)}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900 text-right">
                                ${(item.price * item.quantity).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td
                              colSpan={3}
                              className="px-4 py-2 text-sm font-medium text-gray-900 text-right"
                            >
                              Total:
                            </td>
                            <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                              ${selectedInvoice.amount.toFixed(2)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    <div className="pt-4 flex justify-end space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl shadow-md hover:bg-gray-200 transition-all duration-200"
                        onClick={() => setViewModalOpen(false)}
                      >
                        Close
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-xl shadow-md hover:bg-gray-900 transition-all duration-200"
                        onClick={() => handleDownloadPDF(selectedInvoice)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
