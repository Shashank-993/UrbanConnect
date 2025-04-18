"use client";

import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  CreditCard,
  CheckCircle,
} from "lucide-react";

export default function BookingPage() {
  const location = useLocation();
  const serviceData = location.state?.service || null;
  console.log("Received serviceData in BookingPage:", serviceData); // Debug log

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    address: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serviceData) {
      alert("No service selected or data unavailable.");
      return;
    }
    try {
      const serviceId = Number(serviceData.id);
      console.log(
        "Calculated serviceId (raw):",
        serviceData.id,
        "Converted:",
        serviceId
      ); // Detailed debug log
      if (isNaN(serviceId) || serviceId <= 0) {
        throw new Error(
          "Invalid service ID: must be a positive number. Received: " +
            serviceData.id
        );
      }

      const amount = Number(serviceData.price); // Extract amount from serviceData.price
      if (isNaN(amount) || amount < 0) {
        throw new Error(
          "Invalid estimated cost: must be a positive number. Received: " +
            serviceData.price
        );
      }

      const bookingData = {
        ...formData,
        serviceId,
        serviceName: serviceData.name || serviceData.serviceName,
        date: new Date(formData.date).toISOString(), // Ensure ISO format
        amount, // Add amount to the request
      };
      console.log("Sending booking data:", bookingData); // Debug log
      const response = await axios.post(
        "http://localhost:5000/appointments",
        bookingData,
        {
          withCredentials: true, // Send cookies for session
        }
      );
      console.log("Booking response:", response.data); // Debug log
      alert("Appointment booked successfully!");
    } catch (error) {
      console.error(
        "Error booking appointment:",
        error.response ? error.response.data : error.message
      );
      const errorMessage =
        error.response?.data?.message || "Failed to book appointment";
      if (errorMessage.includes("Email already registered")) {
        alert(
          "Email already registered. Please use a different email or log in."
        );
      } else {
        alert(errorMessage);
      }
    }
  };

  if (!serviceData) {
    return (
      <div className="text-center text-slate-800 font-outfit font-medium text-lg py-12">
        No service data available. Please select a service from the services
        page.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-outfit">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8 text-center tracking-tight">
          Book Your Appointment
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Booking Form (70%) */}
          <div className="lg:w-[70%] w-full">
            <div className="bg-white shadow-lg rounded-2xl p-8 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 tracking-tight">
                Personal Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 font-roboto-flex"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 font-roboto-flex"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 font-roboto-flex"
                      placeholder="(123) 456-7890"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="service"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Selected Service
                    </label>
                    <input
                      type="text"
                      id="service"
                      name="service"
                      value={serviceData.name || serviceData.serviceName}
                      readOnly
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50 cursor-not-allowed font-medium text-slate-700 font-roboto-flex"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Preferred Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 font-roboto-flex"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="time"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Preferred Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                      <select
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 font-roboto-flex appearance-none"
                      >
                        <option value="">Select a time</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Service Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-slate-400 h-5 w-5" />
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 font-roboto-flex resize-none"
                      placeholder="Enter your full address"
                    ></textarea>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Additional Notes
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-slate-400 h-5 w-5" />
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 font-roboto-flex resize-none"
                      placeholder="Any specific requirements or issues to address"
                    ></textarea>
                  </div>
                </div>

                <div className="pt-4 flex flex-col md:flex-row gap-4">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg flex items-center justify-center"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Book Appointment
                  </button>

                  <Link to="/browse">
                    <button
                      type="button"
                      className="w-full md:w-auto px-6 py-3.5 bg-slate-700 hover:bg-slate-800 text-white font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 shadow-md hover:shadow-lg"
                    >
                      Go Back
                    </button>
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Service Summary (30%) */}
          <div className="lg:w-[30%] w-full">
            <div className="bg-white shadow-lg rounded-2xl p-8 sticky top-6 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 tracking-tight">
                Service Summary
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 tracking-tight">
                    {serviceData.name || serviceData.serviceName}
                  </h3>
                  <div className="mt-5 space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-slate-600 font-medium flex items-center">
                        <CreditCard className="h-4 w-4 mr-2 text-indigo-500" />
                        Estimated Cost:
                      </span>
                      <span className="font-semibold text-slate-800 text-lg">
                        ₹{serviceData.price}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-slate-600 font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                        Duration:
                      </span>
                      <span className="font-semibold text-slate-800">
                        {serviceData.duration}{" "}
                        {typeof serviceData.duration === "number" ? "min" : ""}
                      </span>
                    </div>
                    <div className="pt-2">
                      <span className="text-slate-600 font-medium">
                        Description:
                      </span>
                      <p className="mt-2 text-slate-700 leading-relaxed">
                        {serviceData.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl mt-6">
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-indigo-500" />
                    What to expect:
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-3">
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2">•</span>
                      <span>Confirmation email with appointment details</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2">•</span>
                      <span>
                        Service provider will arrive within the selected time
                        window
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2">•</span>
                      <span>
                        Payment will be collected after service completion
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
