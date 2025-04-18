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
      img.crossOrigin = "anonymous";
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
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium text-sm"
            onClick={() => setAddModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Service
          </motion.button>
        </div>

        <motion.div
          variants={cardVariants}
          whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-indigo-100 overflow-hidden transition-all duration-300"
        >
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 tracking-tight">
              My Services
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50/80">
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
                        className="py-4 px-6 text-left text-sm font-semibold text-slate-700 tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {currentServices.map((service) => (
                    <tr
                      key={service.id}
                      className="hover:bg-slate-50 transition-colors duration-200"
                    >
                      <td className="py-4 px-6 text-sm font-medium text-slate-800">
                        {service.name || "N/A"}
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600">
                        {service.duration ? `${service.duration} min` : "N/A"}
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600">
                        ${service.price ? service.price.toFixed(2) : "0.00"}
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            service.active
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {service.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-right">
                        <div className="flex justify-end space-x-3">
                          <motion.button
                            whileHover={{
                              scale: 1.05,
                              backgroundColor: "#f1f5f9",
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEditService(service)}
                            className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{
                              scale: 1.05,
                              backgroundColor: "#fee2e2",
                            }}
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
              <div className="mt-8 flex items-center justify-between">
                <p className="text-sm text-slate-600 font-medium">
                  Showing {indexOfFirstService + 1} to{" "}
                  {Math.min(indexOfLastService, services.length)} of{" "}
                  {services.length} services
                </p>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#f1f5f9" }}
                    whileTap={{ scale: 0.95 }}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className={`p-2 rounded-full ${
                      currentPage === 1
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    } transition-all duration-200`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </motion.button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <motion.button
                        key={page}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3.5 py-1.5 rounded-xl text-sm font-medium ${
                          currentPage === page
                            ? "bg-indigo-600 text-white shadow-md"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        } transition-all duration-200`}
                      >
                        {page}
                      </motion.button>
                    )
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#f1f5f9" }}
                    whileTap={{ scale: 0.95 }}
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className={`p-2 rounded-full ${
                      currentPage === totalPages
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm"
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
                className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-indigo-100 w-full max-w-md mx-4 p-8 max-h-[85vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                    {addModalOpen ? "Add New Service" : "Edit Service"}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setAddModalOpen(false);
                      setEditModalOpen(false);
                      reset();
                    }}
                    className="text-slate-500 hover:text-slate-700 transition-colors duration-200"
                  >
                    <FiX className="text-xl" />
                  </motion.button>
                </div>

                <form
                  onSubmit={handleSubmit(
                    addModalOpen ? handleAddService : handleSaveService
                  )}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Service Name
                    </label>
                    <input
                      {...register("name", { required: "Name is required" })}
                      className="w-full rounded-xl border-slate-300 bg-slate-50 p-3 text-slate-800 placeholder-slate-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
                      placeholder="Enter service name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1.5">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Category
                    </label>
                    <select
                      {...register("category", {
                        required: "Category is required",
                      })}
                      className="w-full rounded-xl border-slate-300 bg-slate-50 p-3 text-slate-800 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
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
                      <p className="text-red-500 text-sm mt-1.5">
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Description
                    </label>
                    <textarea
                      {...register("description", {
                        required: "Description is required",
                      })}
                      className="w-full rounded-xl border-slate-300 bg-slate-50 p-3 text-slate-800 placeholder-slate-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 h-24 resize-none"
                      placeholder="Enter service description"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1.5">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Duration (minutes)
                    </label>
                    <div className="relative">
                      {/* <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" /> */}
                      <input
                        type="number"
                        {...register("duration", {
                          required: "Duration is required",
                          min: { value: 5, message: "Minimum 5 minutes" },
                        })}
                        className="w-full pl-10 rounded-xl border-slate-300 bg-slate-50 p-3 text-slate-800 placeholder-slate-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
                        placeholder="30"
                        min="5"
                        step="5"
                      />
                    </div>
                    {errors.duration && (
                      <p className="text-red-500 text-sm mt-1.5">
                        {errors.duration.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Price
                    </label>
                    <div className="relative">
                      {/* <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" /> */}
                      <input
                        type="number"
                        {...register("price", {
                          required: "Price is required",
                          min: { value: 0, message: "Price must be positive" },
                        })}
                        className="w-full pl-10 rounded-xl border-slate-300 bg-slate-50 p-3 text-slate-800 placeholder-slate-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1.5">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
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
                      className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 transition-all duration-200"
                      accept="image/jpeg,image/png"
                    />
                    {errors.image && (
                      <p className="text-red-500 text-sm mt-1.5">
                        {errors.image.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Provider Name
                    </label>
                    <input
                      {...register("provider", {
                        required: "Provider name is required",
                      })}
                      className="w-full rounded-xl border-slate-300 bg-slate-50 p-3 text-slate-800 placeholder-slate-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
                      placeholder="Enter provider name"
                    />
                    {errors.provider && (
                      <p className="text-red-500 text-sm mt-1.5">
                        {errors.provider.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Provider Bio
                    </label>
                    <textarea
                      {...register("providerBio", {
                        required: "Bio is required",
                      })}
                      className="w-full rounded-xl border-slate-300 bg-slate-50 p-3 text-slate-800 placeholder-slate-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 h-24 resize-none"
                      placeholder="Enter provider bio"
                    />
                    {errors.providerBio && (
                      <p className="text-red-500 text-sm mt-1.5">
                        {errors.providerBio.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Availability
                    </label>
                    <input
                      {...register("availability", {
                        required: "Availability is required",
                      })}
                      className="w-full rounded-xl border-slate-300 bg-slate-50 p-3 text-slate-800 placeholder-slate-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
                      placeholder="E.g., Mon-Sat, 9 AM - 5 PM"
                    />
                    {errors.availability && (
                      <p className="text-red-500 text-sm mt-1.5">
                        {errors.availability.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("active")}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded transition-all duration-200"
                      defaultChecked={selectedService?.active || true}
                    />
                    <label className="ml-2 block text-sm text-slate-700">
                      Service Active
                    </label>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01, backgroundColor: "#4338ca" }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl mt-6 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg transition-all duration-300"
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
