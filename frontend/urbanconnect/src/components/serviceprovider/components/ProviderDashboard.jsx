"use client"

import { Users, Calendar, DollarSign, Star } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"
import Card from "./card"

export default function ProviderDashboard() {
  // Sample data for the dashboard
  const stats = [
    { title: "Total Clients", value: "142", icon: Users, color: "bg-blue-100 text-blue-600" },
    { title: "Appointments", value: "38", icon: Calendar, color: "bg-green-100 text-green-600" },
    { title: "Monthly Earnings", value: "$4,250", icon: DollarSign, color: "bg-yellow-100 text-yellow-600" },
    { title: "Rating", value: "4.8/5", icon: Star, color: "bg-purple-100 text-purple-600" },
  ]

  const upcomingAppointments = [
    ["John Doe", "Dental Checkup", "Today, 2:00 PM", "Confirmed"],
    ["Jane Smith", "Teeth Cleaning", "Tomorrow, 10:30 AM", "Confirmed"],
    ["Robert Brown", "Root Canal", "May 15, 9:00 AM", "Pending"],
    ["Emily Davis", "Dental Consultation", "May 16, 3:15 PM", "Confirmed"],
    ["Michael Wilson", "Teeth Whitening", "May 17, 11:45 AM", "Confirmed"],
  ]

  const revenueData = [
    { name: "Jan", revenue: 3500 },
    { name: "Feb", revenue: 2800 },
    { name: "Mar", revenue: 4200 },
    { name: "Apr", revenue: 3800 },
    { name: "May", revenue: 4250 },
    { name: "Jun", revenue: 3900 },
  ]

  const serviceData = [
    { name: "Dental Checkup", value: 35 },
    { name: "Teeth Cleaning", value: 25 },
    { name: "Root Canal", value: 15 },
    { name: "Teeth Whitening", value: 10 },
    { name: "Consultation", value: 15 },
  ]

  const COLORS = ["#1f2937", "#4f46e5", "#10b981", "#f59e0b", "#ef4444"]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md ${stat.color} p-3`}>
                  <stat.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">{stat.title}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Earnings Overview</h3>
            <div className="mt-5 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#1f2937" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Service Distribution */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Service Distribution</h3>
            <div className="mt-5 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Upcoming Appointments</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                  Client
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Service
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Schedule
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {upcomingAppointments.map((appointment, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                    {appointment[0]}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{appointment[1]}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{appointment[2]}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        appointment[3] === "Confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {appointment[3]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
