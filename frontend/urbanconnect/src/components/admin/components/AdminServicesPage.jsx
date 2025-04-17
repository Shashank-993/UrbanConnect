import { useState, useEffect, useMemo } from "react";
import axios from "axios";

const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [lastUpdate, setLastUpdate] = useState(Date.now()); // Track last update for key

  // Define fetchServices as an inner function
  const fetchServices = async () => {
    try {
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
        (filterStatus === "Pending" && service.status === "rejected");
      console.log(
        `Filtering service ${service._id}: matchesSearch=${matchesSearch}, matchesStatus=${matchesStatus}, approved=${service.approved}, status=${service.status}`
      ); // Debug filter
      return matchesSearch && matchesStatus;
    });
  }, [services, searchTerm, filterStatus]);

  console.log("Rendered filteredServices:", filteredServices); // Debug rendered data

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Service Management</h1>
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="All">All</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
      <table className="w-full bg-white shadow-md rounded-lg" key={lastUpdate}>
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">ID</th>
            <th className="p-3">Name</th>
            <th className="p-3">Category</th>
            <th className="p-3">Price</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredServices.map((service) => (
            <tr key={`${service._id}-${lastUpdate}`} className="border-t">
              <td className="p-3">{service._id}</td>
              <td className="p-3">{service.name || "N/A"}</td>
              <td className="p-3">{service.category || "N/A"}</td>
              <td className="p-3">₹{service.price || 0}</td>
              <td
                className="p-3"
                data-status={
                  service.status || (service.approved ? "Approved" : "Pending")
                }
                data-id={service._id}
              >
                <span className="status-text">
                  {service.status ||
                    (service.approved ? "Approved" : "Pending")}
                </span>
              </td>
              <td className="p-3 flex space-x-2">
                {service.status !== "rejected" && !service.approved && (
                  <button
                    onClick={() => handleApprove(service._id)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={() => handleReject(service._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleClearService(service._id)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Clear
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredServices.length === 0 && (
        <p className="text-center py-4">No services found.</p>
      )}
    </div>
  );
};

export default AdminServicesPage;
