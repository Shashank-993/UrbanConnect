import { useState, useEffect } from "react";
import axios from "axios";

const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/pservices/services/admin/all",
          {
            withCredentials: true,
          }
        );
        console.log("Raw services data from backend:", response.data); // Debug log
        setServices(response.data || []); // Default to empty array if null/undefined
      } catch (error) {
        console.error("Error fetching services for admin:", error);
        setServices([]); // Prevent crash on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleApprove = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await axios.patch(
        `http://localhost:5000/pservices/approve/${id}`,
        { approved: newStatus },
        {
          withCredentials: true,
        }
      );
      setServices(
        services.map((service) =>
          service._id === id ? { ...service, approved: newStatus } : service
        )
      );
    } catch (error) {
      console.error("Error updating service approval:", error);
    }
  };

  const filteredServices = services.filter((service) => {
    // Safely handle missing properties
    const name = service.name || "";
    const category = service.category || "";
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Approved" && service.approved) ||
      (filterStatus === "Pending" && !service.approved);
    return matchesSearch && matchesStatus;
  });

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
      <table className="w-full bg-white shadow-md rounded-lg">
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
            <tr key={service._id} className="border-t">
              <td className="p-3">{service._id}</td>
              <td className="p-3">{service.name || "N/A"}</td>{" "}
              {/* Fallback for missing name */}
              <td className="p-3">{service.category || "N/A"}</td>{" "}
              {/* Fallback for missing category */}
              <td className="p-3">₹{service.price || 0}</td>{" "}
              {/* Fallback for missing price */}
              <td className="p-3">
                {service.approved ? "Approved" : "Pending"}
              </td>
              <td className="p-3">
                <button
                  onClick={() => handleApprove(service._id, service.approved)}
                  className={`px-4 py-2 rounded ${
                    service.approved ? "bg-red-500" : "bg-green-500"
                  } text-white`}
                >
                  {service.approved ? "Reject" : "Approve"}
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
