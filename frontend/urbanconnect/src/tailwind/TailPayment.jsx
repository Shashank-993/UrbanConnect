import React, { useState } from "react";
import axios from "axios";

const TailPayment = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");

  const services = [
    { id: 1, name: "Waste Management", price: 500 },
    { id: 2, name: "Plumbing", price: 1000 },
    { id: 3, name: "Electrical Work", price: 1500 },
  ];

  // Function to call backend and create an order
  const checkoutHandler = async (amount) => {
    try {
      const response = await axios.post("http://localhost:5000/checkout", {
        amount,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const handlePayment = async () => {
    if (!name || !email || !service) {
      alert("Please fill in all fields.");
      return;
    }

    const selectedService = services.find((s) => s.name === service);
    if (!selectedService) {
      alert("Invalid service selected.");
      return;
    }

    const amount = selectedService.price;

    try {
      // Create order on the backend
      const orderData = await checkoutHandler(amount);

      if (!orderData.success) {
        throw new Error("Failed to create order");
      }

      const order = orderData.order;

      const options = {
        key: "rzp_test_POhX2vlZ5FYdVA", // Use your actual Razorpay key
        amount: order.amount, // amount in paise
        currency: order.currency,
        name: "Urban Connect",
        description: `Payment for ${service}`,
        order_id: order.id,
        handler: async function (response) {
          // Send payment details to your backend for verification
          try {
            const verifyRes = await axios.post("http://localhost:5000/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              alert("Payment verified successfully!");
            } else {
              alert("Payment verification failed!");
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Error verifying payment.");
          }
        },
        prefill: { name, email },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Failed to initiate payment.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Service Payment</h2>
        <form>
          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-white"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-white"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Service Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="service">
              Select Service
            </label>
            <select
              id="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-white"
              required
            >
              <option value="">-- Choose a service --</option>
              {services.map((svc) => (
                <option key={svc.id} value={svc.name}>
                  {svc.name} - ₹{svc.price}
                </option>
              ))}
            </select>
          </div>

          {/* Pay Now Button */}
          <button
            type="button"
            onClick={handlePayment}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default TailPayment;
