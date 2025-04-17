"use client";

import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

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
      <div className="text-center text-[#111827]">
        No service data available. Please select a service from the services
        page.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#111827] mb-8 text-center">
          Book Your Appointment
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Booking Form (70%) */}
          <div className="lg:w-[70%] w-full">
            <div className="bg-white shadow-md rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-[#111827] mb-6">
                Personal Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-[#6b7280] mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#e5e7eb] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-800"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-[#6b7280] mb-1"
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
                      className="w-full px-4 py-2 border border-[#e5e7eb] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-800"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-[#6b7280] mb-1"
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
                      className="w-full px-4 py-2 border border-[#e5e7eb] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-800"
                      placeholder="(123) 456-7890"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="service"
                      className="block text-sm font-medium text-[#6b7280] mb-1"
                    >
                      Selected Service
                    </label>
                    <input
                      type="text"
                      id="service"
                      name="service"
                      value={serviceData.name || serviceData.serviceName}
                      readOnly
                      className="w-full px-4 py-2 border border-[#e5e7eb] rounded-md bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-[#6b7280] mb-1"
                    >
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#e5e7eb] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-800"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="time"
                      className="block text-sm font-medium text-[#6b7280] mb-1"
                    >
                      Preferred Time
                    </label>
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#e5e7eb] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-800"
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

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-[#6b7280] mb-1"
                  >
                    Service Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border border-[#e5e7eb] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-800"
                    placeholder="Enter your full address"
                  ></textarea>
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-[#6b7280] mb-1"
                  >
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-[#e5e7eb] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-800"
                    placeholder="Any specific requirements or issues to address"
                  ></textarea>
                </div>

                <div className="pt-4 flex flex-col md:flex-row gap-4">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-6 py-3 bg-[#1f2937] hover:bg-[#111827] text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                  >
                    Book Appointment
                  </button>

                  <Link to="/browse">
                    <button
                      type="button"
                      className="w-full md:w-auto px-6 py-3 bg-[#1f2937] hover:bg-[#111827] text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
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
            <div className="bg-white shadow-md rounded-2xl p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-[#111827] mb-6">
                Service Summary
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-[#111827]">
                    {serviceData.name || serviceData.serviceName}
                  </h3>
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[#6b7280]">Estimated Cost:</span>
                      <span className="font-medium text-[#111827]">
                        ₹{serviceData.price}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6b7280]">Duration:</span>
                      <span className="font-medium text-[#111827]">
                        {serviceData.duration}{" "}
                        {typeof serviceData.duration === "number" ? "min" : ""}
                      </span>
                    </div>
                    <div className="border-t border-[#e5e7eb] my-4"></div>
                    <div>
                      <span className="text-[#6b7280] text-sm">
                        Description:
                      </span>
                      <p className="mt-2 text-[#111827]">
                        {serviceData.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-6">
                  <h4 className="font-medium text-[#111827] mb-2">
                    What to expect:
                  </h4>
                  <ul className="text-sm text-[#6b7280] space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Confirmation email with appointment details</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>
                        Service provider will arrive within the selected time
                        window
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
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
