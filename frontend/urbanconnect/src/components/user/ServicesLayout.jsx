"use client";

import { useContext, useState, useEffect } from "react";
import { CartContext } from "./CartContext";
import {
  FiX,
  FiShoppingCart,
  FiHome,
  FiUser,
  FiCamera,
  FiTool,
  FiHeart,
  FiShield,
} from "react-icons/fi";
import { Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

// Import images
import HAIR from "./userimg/haircut.jpg";
import AC from "./userimg/ac.webp";

const ServicesLayout = () => {
  const {
    cartItems,
    setCartItems,
    showCart,
    setShowCart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext);
  const [selectedCategory, setSelectedCategory] = useState("Beauty & Wellness");
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dynamicServices, setDynamicServices] = useState([]);
  const navigate = useNavigate();

  const staticServices = [
    // Beauty & Wellness
    {
      id: 1,
      name: "Facials & Clean-ups",
      price: 700,
      image: HAIR,
      category: "Beauty & Wellness",
      description:
        "Revitalize your skin with a professional facial and clean-up, customized for a radiant glow.",
      duration: "1 hour",
      rating: "4.8/5",
      stylist: "Priya Sharma",
      stylistBio:
        "Priya is a certified aesthetician with 8 years of experience in skincare treatments.",
      availability: "Mon-Sat, 10 AM - 7 PM",
    },
    // Home Repairs & Maintenance
    {
      id: 12,
      name: "AC Service & Repair",
      price: 1500,
      image: AC,
      category: "Home Repairs & Maintenance",
      description:
        "Expert repair and servicing for your air conditioner to ensure optimal cooling.",
      duration: "2 hours",
      rating: "4.9/5",
      technician: "Amit Patel",
      technicianBio:
        "Amit is a licensed HVAC technician with over 10 years of experience.",
      availability: "Mon-Sun, 8 AM - 6 PM",
    },
    // Home Improvement
    {
      id: 24,
      name: "Full Home Painting",
      price: 5000,
      image: HAIR,
      category: "Home Improvement",
      description:
        "Transform your home with premium full-house painting services.",
      duration: "2-3 days",
      rating: "4.9/5",
      provider: "ColorCraft Team",
      providerBio:
        "ColorCraft specializes in high-quality painting with 15 years of experience.",
      availability: "Mon-Sat, 8 AM - 6 PM",
    },
    // Health & Fitness
    {
      id: 28,
      name: "Yoga Instructors",
      price: 800,
      image: HAIR,
      category: "Health & Fitness",
      description:
        "Personalized yoga sessions at home for flexibility and mindfulness.",
      duration: "1 hour",
      rating: "4.7/5",
      instructor: "Neha Gupta",
      instructorBio:
        "Neha is a certified yoga trainer with 7 years in holistic wellness.",
      availability: "Daily, 6 AM - 8 PM",
    },
    // Events & Occasions
    {
      id: 32,
      name: "Bridal Makeup",
      price: 3000,
      image: HAIR,
      category: "Events & Occasions",
      description:
        "Look breathtaking on your big day with expert bridal makeup services.",
      duration: "2 hours",
      rating: "4.9/5",
      stylist: "Riya Kapoor",
      stylistBio:
        "Riya is a bridal makeup expert with 10 years in high-end events.",
      availability: "By appointment",
    },
  ];

  useEffect(() => {
    const fetchDynamicServices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/pservices/services",
          {
            withCredentials: true,
          }
        );
        // Filter to ensure only approved services are included
        const approvedDynamicServices = response.data.filter(
          (service) => service.approved
        );
        const dynamicServicesWithIds = approvedDynamicServices.map(
          (service, index) => ({
            ...service,
            id: 1000 + index + staticServices.length, // Assign unique numeric IDs
            name: service.name || service.serviceName,
            image: service.image || "/default-image.jpg", // Fallback image
            duration: service.duration ? `${service.duration} min` : "N/A", // Normalize duration
            price: parseFloat(service.price) || 0, // Ensure price is a number
            description: service.description || "No description available",
            rating: service.rating || "N/A",
            stylist:
              service.stylist ||
              service.provider ||
              service.technician ||
              "N/A",
            stylistBio:
              service.stylistBio ||
              service.providerBio ||
              service.technicianBio ||
              "No bio available",
            availability: service.availability || "N/A",
          })
        );
        setDynamicServices(dynamicServicesWithIds);
        console.log(
          "Approved dynamic services with IDs:",
          dynamicServicesWithIds
        ); // Debug log
      } catch (error) {
        console.error("Error fetching dynamic services:", error);
      } finally {
        setIsLoading(false);
        const allServices = [...staticServices, ...dynamicServices];
        console.log("All services:", allServices); // Debug log
        if (allServices.length > 0) {
          setSelectedService(allServices[0]);
        }
      }
    };

    fetchDynamicServices();

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [dynamicServices.length]);

  const allServices = [...staticServices, ...dynamicServices];
  const filteredServices =
    selectedCategory === "All"
      ? allServices
      : allServices.filter((service) => service.category === selectedCategory);

  const categories = [
    { name: "All", icon: <FiHome className="mr-2" /> },
    { name: "Beauty & Wellness", icon: <FiUser className="mr-2" /> },
    { name: "Home Repairs & Maintenance", icon: <FiTool className="mr-2" /> },
    { name: "Home Improvement", icon: <FiHome className="mr-2" /> },
    { name: "Health & Fitness", icon: <FiHeart className="mr-2" /> },
    { name: "Events & Occasions", icon: <FiCamera className="mr-2" /> },
    { name: "Home Services", icon: <FiShield className="mr-2" /> },
  ];

  const handleBookNow = async () => {
    if (!selectedService) return;

    try {
      const amountInPaise = selectedService.price * 100;
      const response = await axios.post(
        "http://localhost:5000/checkout",
        { amount: amountInPaise },
        { withCredentials: true }
      );

      const data = response.data;
      if (!data.success) throw new Error("Failed to create order");

      const options = {
        key: "rzp_test_POhX2vlZ5FYdVA",
        amount: data.order.amount,
        currency: "INR",
        name: "Urban Connect Services",
        description: `Payment for ${selectedService.name}`,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            const verifyResponse = await axios.post(
              "http://localhost:5000/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true }
            );

            if (verifyResponse.data.success) {
              navigate("/invoice", {
                state: { invoiceService: selectedService },
              });
            } else {
              alert("Payment verification failed.");
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: { color: "#1a1a1a" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error during Book Now:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const totalAmount =
      cartItems.reduce((total, item) => total + item.price * item.quantity, 0) *
      100;

    try {
      const response = await axios.post(
        "http://localhost:5000/checkout",
        { amount: totalAmount },
        { withCredentials: true }
      );

      const data = response.data;
      if (!data.success) throw new Error("Failed to create order");

      const options = {
        key: "rzp_test_POhX2vlZ5FYdVA",
        amount: data.order.amount,
        currency: "INR",
        name: "Urban Connect Services",
        description: "Payment for Cart Items",
        order_id: data.order.id,
        handler: async (response) => {
          try {
            const verifyResponse = await axios.post(
              "http://localhost:5000/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true }
            );

            if (verifyResponse.data.success) {
              const invoiceItems = cartItems.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                total: item.price * item.quantity,
              }));
              navigate("/invoice", {
                state: {
                  invoiceData: {
                    items: invoiceItems,
                    total: totalAmount / 100,
                  },
                },
              });
              setCartItems([]);
              setShowCart(false);
            } else {
              alert("Payment verification failed.");
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: { color: "#1a1a1a" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error during Checkout:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-[Inter,system-ui,-apple-system,sans-serif]">
      {/* Main Container */}
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* First Column: Categories */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full md:w-1/5"
          >
            <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-20 border border-gray-200/50">
              <h2 className="text-3xl font-bold mb-6 text-blue-500 tracking-tight">
                Categories
              </h2>
              <div className="space-y-3">
                {categories.map((category) => (
                  <motion.button
                    key={category.name}
                    whileHover={{ scale: 1.03, backgroundColor: "#f7fafc" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full flex items-center text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                      selectedCategory === category.name
                        ? "bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-md"
                    } focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2`}
                  >
                    {category.icon}
                    <span className="font-medium text-sm tracking-wide">
                      {category.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Second Column: Service Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeInOut" }}
            className="w-full md:w-2/5"
          >
            <div className="bg-white rounded-3xl shadow-lg p-6 h-full flex flex-col border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-purple-500 tracking-tight">
                  Services
                </h2>
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
                  {filteredServices.length} services
                </span>
              </div>

              <div className="flex-grow h-0 overflow-y-scroll pr-2 space-y-6 custom-scrollbar">
                <AnimatePresence>
                  {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
                    </div>
                  ) : filteredServices.length === 0 ? (
                    <div className="flex justify-center items-center h-40 text-gray-600">
                      No services found for this category.
                    </div>
                  ) : (
                    filteredServices.map((service) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={`w-full rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border ${
                          selectedService?.id === service.id
                            ? "border-gray-800"
                            : "border-transparent"
                        } bg-white`}
                        onClick={() => setSelectedService(service)}
                      >
                        <div className="relative group">
                          <img
                            src={
                              service.image instanceof File
                                ? URL.createObjectURL(service.image)
                                : typeof service.image === "string" &&
                                  service.image.startsWith("/uploads")
                                ? `http://localhost:5000${service.image}`
                                : service.image ||
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e5e7eb'/%3E%3C/svg%3E"
                            }
                            alt={service.name || "Service"}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) =>
                              (e.target.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e5e7eb'/%3E%3C/svg%3E")
                            }
                          />
                          <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-semibold text-gray-800 shadow-sm">
                            ₹{service.price}
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2 tracking-tight">
                            {service.name || service.serviceName}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {service.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="bg-gray-100 px-2 py-1 rounded-md">
                                {service.duration}
                              </span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(service);
                              }}
                            >
                              Add to Cart
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Third Column: Service Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeInOut" }}
            className="w-full md:w-2/5"
          >
            <div className="flex flex-col gap-6 h-full">
              {/* Service Details */}
              <div className="bg-white rounded-3xl shadow-lg p-6 flex-grow border border-gray-200/50">
                <h2 className="text-3xl font-bold mb-6 text-green-400 tracking-tight">
                  Service Details
                </h2>

                {selectedService ? (
                  <div className="space-y-6">
                    <div className="relative rounded-2xl overflow-hidden shadow-md">
                      <img
                        src={
                          selectedService.image instanceof File
                            ? URL.createObjectURL(selectedService.image)
                            : typeof selectedService.image === "string" &&
                              selectedService.image.startsWith("/uploads")
                            ? `http://localhost:5000${selectedService.image}`
                            : selectedService.image ||
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e5e7eb'/%3E%3C/svg%3E"
                        }
                        alt={
                          selectedService.name ||
                          selectedService.serviceName ||
                          "Service"
                        }
                        className="w-full h-48 object-cover transition-transform duration-300"
                        onError={(e) =>
                          (e.target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e5e7eb'/%3E%3C/svg%3E")
                        }
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold tracking-tight">
                          {selectedService.name || selectedService.serviceName}
                        </h3>
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-400">★★★★★</span>
                          <span className="ml-1 text-sm">
                            {selectedService.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2 tracking-tight">
                        Description
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedService.description}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ₹{selectedService.price}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedService.duration}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Provider</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedService.stylist ||
                            selectedService.provider ||
                            selectedService.technician ||
                            "N/A"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Availability</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedService.availability}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2 tracking-tight">
                        Provider Details
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedService.stylistBio ||
                          selectedService.providerBio ||
                          selectedService.technicianBio ||
                          "No bio available"}
                      </p>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Link
                        to="/booking"
                        state={{
                          service: {
                            ...selectedService,
                            id: selectedService.id,
                            serviceId: undefined, // Explicitly remove the UUID serviceId
                          },
                        }}
                        className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mt-4"
                        onClick={() =>
                          console.log("Navigating with service:", {
                            ...selectedService,
                            id: selectedService.id,
                            serviceId: undefined,
                          })
                        }
                      >
                        Book Appointment
                      </Link>
                    </motion.div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-64 text-gray-400">
                    Select a service to view details
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {selectedService && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                      onClick={() => addToCart(selectedService)}
                    >
                      <FiShoppingCart />
                      Add to Cart
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 bg-white border-2 border-gray-900 text-gray-900 py-3 rounded-xl font-semibold"
                      onClick={handleBookNow}
                    >
                      Book Now
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-md z-50"
              onClick={() => setShowCart(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50"
            >
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                      Your Cart
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowCart(false)}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                    >
                      <FiX className="text-gray-600 text-xl" />
                    </motion.button>
                  </div>
                </div>
                <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
                  {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <FiShoppingCart className="text-gray-400 text-4xl mb-4" />
                      <p className="text-gray-600 text-lg font-medium">
                        Your cart is empty
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        Add some services to get started!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {cartItems.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl shadow-sm border border-gray-200/50"
                        >
                          <img
                            src={
                              item.image instanceof File
                                ? URL.createObjectURL(item.image)
                                : typeof item.image === "string" &&
                                  item.image.startsWith("/uploads")
                                ? `http://localhost:5000${item.image}`
                                : item.image ||
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e5e7eb'/%3E%3C/svg%3E"
                            }
                            alt={item.name || "Service"}
                            className="w-20 h-20 object-cover rounded-xl"
                            onError={(e) =>
                              (e.target.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e5e7eb'/%3E%3C/svg%3E")
                            }
                          />
                          <div className="flex-grow">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.description
                                ? item.description.slice(0, 50) + "..."
                                : "No description available"}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Provider:{" "}
                              {item.stylist ||
                                item.provider ||
                                item.technician ||
                                "N/A"}
                            </p>
                            <p className="text-sm text-gray-600">
                              Duration: {item.duration}
                            </p>
                            <p className="text-lg font-semibold text-gray-900 mt-2">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => decreaseQuantity(item.id)}
                                className="p-1 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300"
                              >
                                <Minus className="h-4 w-4" />
                              </motion.button>
                              <span className="text-sm font-medium text-gray-800 w-6 text-center">
                                {item.quantity}
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => increaseQuantity(item.id)}
                                className="p-1 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300"
                              >
                                <Plus className="h-4 w-4" />
                              </motion.button>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setCartItems(
                                  cartItems.filter((i) => i.id !== item.id)
                                );
                              }}
                              className="text-red-500 text-sm font-medium hover:text-red-600"
                            >
                              Remove
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
                {cartItems.length > 0 && (
                  <div className="p-6 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-gray-800">
                        Total:
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        ₹
                        {cartItems
                          .reduce(
                            (total, item) => total + item.price * item.quantity,
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
                    >
                      Proceed to Checkout
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default ServicesLayout;
