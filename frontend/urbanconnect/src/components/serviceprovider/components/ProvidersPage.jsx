"use client"

import { useState } from "react"
import { Eye, Check, X, AlertTriangle, Search } from "lucide-react"
import Card from "./card"
import Table from "./table"
import Modal from "./Modal"

export default function ProvidersPage() {
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")

  // Sample data
  const providers = [
    {
      id: 1,
      name: "Dr. John Smith",
      email: "john.smith@example.com",
      status: "approved",
      specialty: "Dentist",
      phone: "(123) 456-7890",
      joined: "Jan 15, 2023",
      services: ["Dental Checkup", "Teeth Cleaning", "Root Canal"],
    },
    {
      id: 2,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@example.com",
      status: "pending",
      specialty: "Optometrist",
      phone: "(234) 567-8901",
      joined: "Feb 20, 2023",
      services: ["Eye Exam", "Contact Lens Fitting", "Glaucoma Testing"],
    },
    {
      id: 3,
      name: "Dr. Michael Williams",
      email: "michael.williams@example.com",
      status: "approved",
      specialty: "Physical Therapist",
      phone: "(345) 678-9012",
      joined: "Mar 10, 2023",
      services: ["Physical Therapy", "Rehabilitation", "Sports Injury Treatment"],
    },
    {
      id: 4,
      name: "Dr. Emily Davis",
      email: "emily.davis@example.com",
      status: "suspended",
      specialty: "Dermatologist",
      phone: "(456) 789-0123",
      joined: "Dec 5, 2022",
      services: ["Skin Exam", "Acne Treatment", "Skin Cancer Screening"],
    },
    {
      id: 5,
      name: "Dr. Robert Miller",
      email: "robert.miller@example.com",
      status: "pending",
      specialty: "Cardiologist",
      phone: "(567) 890-1234",
      joined: "Apr 18, 2023",
      services: ["Heart Checkup", "ECG", "Blood Pressure Monitoring"],
    },
  ]

  // Filter and search providers
  const filteredProviders = providers
    .filter((provider) => filter === "all" || provider.status === filter)
    .filter(
      (provider) =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  // Handle view provider
  const handleViewProvider = (provider) => {
    setSelectedProvider(provider)
    setViewModalOpen(true)
  }

  // Format provider data for table
  const providerData = filteredProviders.map((provider) => [
    provider.name,
    provider.email,
    provider.specialty,
    <span
      key={provider.id}
      className={`px-2 py-1 rounded-full text-xs ${
        provider.status === "approved"
          ? "bg-green-100 text-green-800"
          : provider.status === "pending"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"
      }`}
    >
      {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
    </span>,
  ])

  // Actions for each provider
  const renderActions = (index) => (
    <>
      <button
        onClick={() => handleViewProvider(filteredProviders[index])}
        className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
      >
        <Eye className="h-4 w-4" />
      </button>
      {filteredProviders[index].status === "pending" && (
        <>
          <button className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200">
            <Check className="h-4 w-4" />
          </button>
          <button className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200">
            <X className="h-4 w-4" />
          </button>
        </>
      )}
      {filteredProviders[index].status === "approved" && (
        <button className="p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200">
          <AlertTriangle className="h-4 w-4" />
        </button>
      )}
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
              placeholder="Search providers..."
              className="pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-800 focus:border-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-800 focus:border-gray-800"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Providers</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <Table columns={["Name", "Email", "Specialty", "Status"]} data={providerData} actions={renderActions} />
      </Card>

      {/* View Provider Modal */}
      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Provider Details">
        {selectedProvider && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-sm text-gray-900">{selectedProvider.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-sm text-gray-900">{selectedProvider.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Specialty</p>
              <p className="text-sm text-gray-900">{selectedProvider.specialty}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-sm text-gray-900">{selectedProvider.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="text-sm text-gray-900">{selectedProvider.status}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Joined</p>
              <p className="text-sm text-gray-900">{selectedProvider.joined}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Services</p>
              <ul className="mt-1 text-sm text-gray-900">
                {selectedProvider.services.map((service, index) => (
                  <li key={index} className="py-1">
                    {service}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
                onClick={() => setViewModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
