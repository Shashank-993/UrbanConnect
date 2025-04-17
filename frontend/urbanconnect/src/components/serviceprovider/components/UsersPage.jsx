"use client"

import { useState } from "react"
import { Eye, Edit, Ban, Search } from "lucide-react"
import Modal from "./Modal"

export default function UsersPage() {
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")

  // Sample data
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      status: "active",
      phone: "(123) 456-7890",
      joined: "May 10, 2023",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      status: "active",
      phone: "(234) 567-8901",
      joined: "Apr 15, 2023",
    },
    {
      id: 3,
      name: "Robert Brown",
      email: "robert@example.com",
      status: "blocked",
      phone: "(345) 678-9012",
      joined: "Mar 22, 2023",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@example.com",
      status: "active",
      phone: "(456) 789-0123",
      joined: "Feb 8, 2023",
    },
    {
      id: 5,
      name: "Michael Wilson",
      email: "michael@example.com",
      status: "active",
      phone: "(567) 890-1234",
      joined: "Jan 17, 2023",
    },
  ]

  // Filter and search users
  const filteredUsers = users
    .filter((user) => filter === "all" || user.status === filter)
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  // Handle view user
  const handleViewUser = (user) => {
    setSelectedUser(user)
    setViewModalOpen(true)
  }

  // Handle edit user
  const handleEditUser = (user) => {
    setSelectedUser(user)
    setEditModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-md p-4 shadow">
        <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
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
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200">
                        <Ban className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View User Modal */}
      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title="User Details">
        {selectedUser && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-sm text-gray-900">{selectedUser.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-sm text-gray-900">{selectedUser.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-sm text-gray-900">{selectedUser.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="text-sm text-gray-900">{selectedUser.status}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Joined</p>
              <p className="text-sm text-gray-900">{selectedUser.joined}</p>
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

      {/* Edit User Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit User">
        {selectedUser && (
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-800 focus:border-gray-800"
                defaultValue={selectedUser.name}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-800 focus:border-gray-800"
                defaultValue={selectedUser.email}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-800 focus:border-gray-800"
                defaultValue={selectedUser.phone}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-800 focus:border-gray-800"
                defaultValue={selectedUser.status}
              >
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <div className="pt-4 flex justify-end space-x-2">
              <button
                type="button"
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
                onClick={(e) => {
                  e.preventDefault()
                  setEditModalOpen(false)
                }}
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
