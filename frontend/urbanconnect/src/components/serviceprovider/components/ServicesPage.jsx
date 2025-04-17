"use client";

import { useState, useEffect } from "react";
import {
  Edit,
  Trash2,
  Plus,
  DollarSign,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useForm } from "react-hook-form";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 5;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/pservices/services",
          {
            withCredentials: true,
          }
        );
        setServices(response.data);
      } catch (error) {
        console.error(
          "Error fetching services:",
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchServices();
  }, []);

  const totalPages = Math.ceil(services.length / servicesPerPage);
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = services.slice(
    indexOfFirstService,
    indexOfLastService
  );

  const resizeImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      img.onload = () => {
        const maxWidth = 320;
        const maxHeight = 192;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) reject(new Error("Failed to create blob"));
            resolve(blob);
          },
          "image/jpeg",
          0.95
        );
      };
      img.onerror = () => reject(new Error("Invalid image file"));
      img.src = URL.createObjectURL(file);
    });
  };

  const validateImage = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) return reject("No file selected");
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        return reject("Only JPEG or PNG images are allowed");
      }
      if (file.size > 5 * 1024 * 1024) {
        return reject("Image size must be less than 5MB");
      }
      resolve();
    });
  };

  const handleAddService = async (data) => {
    let imageBlob = data.image[0];
    try {
      await validateImage(imageBlob);
      imageBlob = await resizeImage(imageBlob);
    } catch (error) {
      console.error("Image validation or resizing error:", error);
      alert(error.message || "Failed to process image. Please try again.");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("category", data.category);
    formData.append("description", data.description);
    formData.append("duration", parseInt(data.duration));
    formData.append("price", parseFloat(data.price));
    formData.append("active", data.active ? "true" : "false");
    formData.append("rating", data.rating || "4.5/5");
    formData.append("provider", data.provider);
    formData.append("providerBio", data.providerBio);
    formData.append("availability", data.availability);
    formData.append("image", imageBlob, "resized-image.jpg");

    try {
      const response = await axios.post(
        "http://localhost:5000/pservices/services/create",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setServices([...services, response.data]);
      setAddModalOpen(false);
      reset();
    } catch (error) {
      console.error(
        "Error adding service:",
        error.response ? error.response.data : error.message
      );
      alert(
        error.response?.data?.message ||
          "Failed to add service. Check if the backend is running at http://localhost:5000/pservices/services/create."
      );
    }
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setValue("name", service.name);
    setValue("category", service.category);
    setValue("description", service.description);
    setValue("duration", service.duration);
    setValue("price", service.price);
    setValue("active", service.active);
    setValue("rating", service.rating);
    setValue("provider", service.provider);
    setValue("providerBio", service.providerBio);
    setValue("availability", service.availability);
    setEditModalOpen(true);
  };

  const handleSaveService = async (data) => {
    let imageBlob = data.image && data.image[0] ? data.image[0] : null;
    if (imageBlob) {
      try {
        await validateImage(imageBlob);
        imageBlob = await resizeImage(imageBlob);
      } catch (error) {
        console.error("Image validation or resizing error:", error);
        alert(error.message || "Failed to process image. Please try again.");
        return;
      }
    }

    const formData = new FormData();
    formData.append("id", selectedService.id);
    formData.append("name", data.name);
    formData.append("category", data.category);
    formData.append("description", data.description);
    formData.append("duration", parseInt(data.duration));
    formData.append("price", parseFloat(data.price));
    formData.append("active", data.active ? "true" : "false");
    formData.append("rating", data.rating || "4.5/5");
    formData.append("provider", data.provider);
    formData.append("providerBio", data.providerBio);
    formData.append("availability", data.availability);
    if (imageBlob) {
      formData.append("image", imageBlob, "resized-image.jpg");
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/pservices/services/update/${selectedService.id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setServices(
        services.map((s) => (s.id === selectedService.id ? response.data : s))
      );
      setEditModalOpen(false);
      reset();
    } catch (error) {
      console.error(
        "Error updating service:",
        error.response ? error.response.data : error.message
      );
      alert(
        error.response?.data?.message ||
          "Failed to update service. Check if the backend is running."
      );
    }
  };

  const handleDeleteService = (id) => {
    axios
      .delete(`http://localhost:5000/pservices/services/delete/${id}`, {
        withCredentials: true,
      })
      .then(() => {
        setServices(services.filter((service) => service.id !== id));
      })
      .catch((error) => {
        console.error(
          "Error deleting service:",
          error.response ? error.response.data : error.message
        );
        alert(
          error.response?.data?.message ||
            "Failed to delete service. Check if the backend is running."
        );
      });
  };

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
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all duration-200"
            onClick={() => setAddModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Service
          </motion.button>
        </div>

        <motion.div
          variants={cardVariants}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-purple-300/75"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              My Services
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200/50">
                <thead className="bg-gray-50/50">
                  <tr>
                    {[
                      "Service Name",
                      "Duration",
                      "Price",
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
                  {currentServices.map((service) => (
                    <tr
                      key={service.id}
                      className="hover:bg-gray-100/50 transition-colors duration-200"
                    >
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">
                        {service.name || "N/A"}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {service.duration ? `${service.duration} min` : "N/A"}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        ${service.price ? service.price.toFixed(2) : "0.00"}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            service.active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {service.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-right">
                        <div className="flex justify-end space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEditService(service)}
                            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteService(service.id)}
                            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {services.length > servicesPerPage && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {indexOfFirstService + 1} to{" "}
                  {Math.min(indexOfLastService, services.length)} of{" "}
                  {services.length} services
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

        <AnimatePresence>
          {(addModalOpen || editModalOpen) && (
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
                className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-purple-300/75 w-full max-w-md mx-4 p-6 max-h-[80vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {addModalOpen ? "Add New Service" : "Edit Service"}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setAddModalOpen(false);
                      setEditModalOpen(false);
                      reset();
                    }}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <FiX className="text-xl" />
                  </motion.button>
                </div>

                <form
                  onSubmit={handleSubmit(
                    addModalOpen ? handleAddService : handleSaveService
                  )}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Service Name
                    </label>
                    <input
                      {...register("name", { required: "Name is required" })}
                      className="mt-1 block w-full rounded-xl border-gray-300 bg-gray-50 p-2 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                      placeholder="Enter service name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      {...register("category", {
                        required: "Category is required",
                      })}
                      className="mt-1 block w-full rounded-xl border-gray-300 bg-gray-50 p-2 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                    >
                      <option value="">Select a category</option>
                      {[
                        "Beauty & Wellness",
                        "Home Repairs & Maintenance",
                        "Home Improvement",
                        "Health & Fitness",
                        "Events & Occasions",
                        "Home Services",
                      ].map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      {...register("description", {
                        required: "Description is required",
                      })}
                      className="mt-1 block w-full rounded-xl border-gray-300 bg-gray-50 p-2 h-20 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                      placeholder="Enter service description"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Duration (minutes)
                    </label>
                    <div className="mt-1 relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="number"
                        {...register("duration", {
                          required: "Duration is required",
                          min: { value: 5, message: "Minimum 5 minutes" },
                        })}
                        className="block w-full pl-10 rounded-xl border-gray-300 bg-gray-50 p-2 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                        placeholder="30"
                        min="5"
                        step="5"
                      />
                    </div>
                    {errors.duration && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.duration.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Price ($)
                    </label>
                    <div className="mt-1 relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="number"
                        {...register("price", {
                          required: "Price is required",
                          min: { value: 0, message: "Price must be positive" },
                        })}
                        className="block w-full pl-10 rounded-xl border-gray-300 bg-gray-50 p-2 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Service Image (JPEG/PNG, max 5MB)
                    </label>
                    <input
                      type="file"
                      {...register("image", {
                        required: addModalOpen ? "Image is required" : false,
                        validate: (fileList) =>
                          !fileList || fileList.length === 0
                            ? true
                            : validateImage(fileList[0]),
                      })}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                      accept="image/jpeg,image/png"
                    />
                    {errors.image && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.image.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Provider Name
                    </label>
                    <input
                      {...register("provider", {
                        required: "Provider name is required",
                      })}
                      className="mt-1 block w-full rounded-xl border-gray-300 bg-gray-50 p-2 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                      placeholder="Enter provider name"
                    />
                    {errors.provider && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.provider.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Provider Bio
                    </label>
                    <textarea
                      {...register("providerBio", {
                        required: "Bio is required",
                      })}
                      className="mt-1 block w-full rounded-xl border-gray-300 bg-gray-50 p-2 h-20 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                      placeholder="Enter provider bio"
                    />
                    {errors.providerBio && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.providerBio.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Availability
                    </label>
                    <input
                      {...register("availability", {
                        required: "Availability is required",
                      })}
                      className="mt-1 block w-full rounded-xl border-gray-300 bg-gray-50 p-2 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                      placeholder="E.g., Mon-Sat, 9 AM - 5 PM"
                    />
                    {errors.availability && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.availability.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("active")}
                      className="h-4 w-4 text-gray-800 focus:ring-gray-500/50 border-gray-300 rounded"
                      defaultChecked={selectedService?.active || true}
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Service Active
                    </label>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full bg-gray-900 text-white py-3 rounded-xl mt-6 flex items-center justify-center gap-2"
                  >
                    Save Changes
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
