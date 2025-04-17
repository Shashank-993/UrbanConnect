"use client"

import { useState } from "react"
import { Search, Eye, Download } from "lucide-react"
import Card from "./card"
import Table from "./table"
import Modal from "./Modal"

export default function InvoicesPage() {
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

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
  ]

  // Filter and search invoices
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.user.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle view invoice
  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice)
    setViewModalOpen(true)
  }

  // Format invoice data for table
  const invoiceData = filteredInvoices.map((invoice) => [
    invoice.id,
    invoice.user,
    `$${invoice.amount.toFixed(2)}`,
    invoice.date,
    <span
      key={invoice.id}
      className={`px-2 py-1 rounded-full text-xs ${
        invoice.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
    </span>,
  ])

  // Actions for each invoice
  const renderActions = (index) => (
    <>
      <button
        onClick={() => handleViewInvoice(filteredInvoices[index])}
        className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
      >
        <Eye className="h-4 w-4" />
      </button>
      <button className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
        <Download className="h-4 w-4" />
      </button>
    </>
  )

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search invoices..."
              className="pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-800 focus:border-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Table
          columns={["Invoice ID", "User", "Amount", "Date", "Status"]}
          data={invoiceData}
          actions={renderActions}
        />
      </Card>

      {/* View Invoice Modal */}
      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Invoice Details">
        {selectedInvoice && (
          <div className="space-y-6">
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Invoice #{selectedInvoice.id}</h3>
                <p className="text-sm text-gray-500">Date: {selectedInvoice.date}</p>
              </div>
              <div
                className={`px-2 py-1 h-fit rounded-full text-xs ${
                  selectedInvoice.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Bill To:</h4>
              <p className="text-sm text-gray-900">{selectedInvoice.user}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Items:</h4>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Service
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedInvoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.service}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">{item.quantity}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right"
                    >
                      Total:
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      ${selectedInvoice.amount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50"
                onClick={() => setViewModalOpen(false)}
              >
                Close
              </button>
              <button className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
