"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  Check,
  X,
  Trash,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [lastUpdate, setLastUpdate] = useState(Date.now()); // Track last update for key
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Define fetchServices as an inner function
  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://localhost:5000/pservices/services/admin/all",
        {
          withCredentials: true,
        }
      );
      console.log("Raw services data from backend:", response.data); // Debug log
      const data = response.data || [];
      // Load cleared service IDs from localStorage
      const clearedIds = JSON.parse(
        localStorage.getItem("clearedServices") || "[]"
      );
      const filteredData = data.filter(
        (service) => !clearedIds.includes(service._id)
      );
      setServices([...filteredData]); // Spread to create new array reference
      setLastUpdate(Date.now()); // Update timestamp
      console.log("Services state after fetch:", filteredData); // Debug post-fetch state
    } catch (error) {
      console.error(
        "Error fetching services for admin:",
        error.response?.data || error.message
      );
      setServices([]); // Prevent crash on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleApprove = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/pservices/approve/${id}`,
        { approved: true, status: "approved" },
        {
          withCredentials: true,
        }
      );
      console.log("Approve response:", response.data); // Debug backend response
      // Update state directly with response
      setServices(
        services.map((service) =>
          service._id === id
            ? { ...service, approved: true, status: "approved" }
            : service
        )
      );
      setLastUpdate(Date.now()); // Update timestamp
      console.log("Services state after approve:", services); // Debug state
    } catch (error) {
      console.error(
        "Error approving service:",
        error.response?.data || error.message
      );
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/pservices/approve/${id}`,
        { approved: false, status: "rejected" },
        {
          withCredentials: true,
        }
      );
      console.log("Reject response:", response.data); // Debug backend response
      // Update state directly with response data
      const updatedService = response.data.service || {
        ...services.find((s) => s._id === id),
        approved: false,
        status: "rejected",
      };
      setServices(
        services.map((service) =>
          service._id === id ? updatedService : service
        )
      );
      setLastUpdate(Date.now()); // Update timestamp
      console.log("Services state after reject (immediate):", services); // Debug state
      // Re-fetch to ensure sync
      await fetchServices();
    } catch (error) {
      console.error(
        "Error rejecting service:",
        error.response?.data || error.message
      );
    }
  };

  const handleClearService = (serviceId) => {
    const updatedServices = services.filter((s) => s._id !== serviceId);
    setServices([...updatedServices]); // Spread to create new array reference
    setLastUpdate(Date.now()); // Update timestamp
    // Update localStorage with cleared IDs
    const clearedIds = JSON.parse(
      localStorage.getItem("clearedServices") || "[]"
    );
    if (!clearedIds.includes(serviceId)) {
      clearedIds.push(serviceId);
      localStorage.setItem("clearedServices", JSON.stringify(clearedIds));
    }
  };

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const name = service.name || "";
      const category = service.category || "";
      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "All" ||
        (filterStatus === "Approved" &&
          service.approved &&
          service.status === "approved") ||
        (filterStatus === "Pending" &&
          !service.approved &&
          service.status === "pending") ||
        (filterStatus === "Rejected" && service.status === "rejected");
      console.log(
        `Filtering service ${service._id}: matchesSearch=${matchesSearch}, matchesStatus=${matchesStatus}, approved=${service.approved}, status=${service.status}`
      ); // Debug filter
      return matchesSearch && matchesStatus;
    });
  }, [services, searchTerm, filterStatus]);

  console.log("Rendered filteredServices:", filteredServices); // Debug rendered data

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "approved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-outfit">
      <h1 className="text-3xl font-bold mb-8 text-slate-800 tracking-tight">
        Service Management
      </h1>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 font-roboto-flex"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-all duration-200 shadow-sm"
          >
            <Filter className="h-5 w-5 text-slate-500" />
            {filterStatus}
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-10 overflow-hidden">
              {["All", "Approved", "Pending", "Rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setFilterStatus(status);
                    setIsFilterOpen(false);
                  }}
                  className="block w-full text-left px-5 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-all duration-200 font-medium"
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={fetchServices}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 rounded-xl text-white font-medium hover:bg-indigo-700 transition-all duration-200 shadow-md"
        >
          <RefreshCw className="h-5 w-5" />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full" key={lastUpdate}>
                <thead>
                  <tr className="bg-slate-50 text-left border-b border-slate-200">
                    <th className="p-4 font-semibold text-slate-700">ID</th>
                    <th className="p-4 font-semibold text-slate-700">Name</th>
                    <th className="p-4 font-semibold text-slate-700">
                      Category
                    </th>
                    <th className="p-4 font-semibold text-slate-700">Price</th>
                    <th className="p-4 font-semibold text-slate-700">Status</th>
                    <th className="p-4 font-semibold text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service) => (
                    <tr
                      key={`${service._id}-${lastUpdate}`}
                      className="border-b border-slate-200 hover:bg-slate-50 transition-all duration-200"
                    >
                      <td className="p-4 font-mono text-sm text-slate-600">
                        {service._id}
                      </td>
                      <td className="p-4 font-medium text-slate-800">
                        {service.name || "N/A"}
                      </td>
                      <td className="p-4 text-slate-700">
                        {service.category || "N/A"}
                      </td>
                      <td className="p-4 text-slate-700">
                        ₹{service.price || 0}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium border ${getStatusBadgeClass(
                            service.status ||
                              (service.approved ? "approved" : "pending")
                          )}`}
                          data-status={
                            service.status ||
                            (service.approved ? "approved" : "pending")
                          }
                          data-id={service._id}
                        >
                          {(
                            service.status ||
                            (service.approved ? "Approved" : "Pending")
                          )
                            .charAt(0)
                            .toUpperCase() +
                            (
                              service.status ||
                              (service.approved ? "Approved" : "Pending")
                            ).slice(1)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          {service.status !== "rejected" &&
                            !service.approved && (
                              <button
                                onClick={() => handleApprove(service._id)}
                                className="p-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-all duration-200 flex items-center"
                              >
                                <Check className="h-4 w-4" />
                                <span className="ml-1 text-sm font-medium">
                                  Approve
                                </span>
                              </button>
                            )}
                          <button
                            onClick={() => handleReject(service._id)}
                            className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-all duration-200 flex items-center"
                          >
                            <X className="h-4 w-4" />
                            <span className="ml-1 text-sm font-medium">
                              Reject
                            </span>
                          </button>
                          <button
                            onClick={() => handleClearService(service._id)}
                            className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all duration-200 flex items-center"
                          >
                            <Trash className="h-4 w-4" />
                            <span className="ml-1 text-sm font-medium">
                              Clear
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredServices.length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-8 text-center border border-slate-200">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <p className="text-slate-700 font-medium text-lg">
                No services found.
              </p>
              <p className="text-slate-500 mt-2">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminServicesPage;
