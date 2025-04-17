"use client";

import { useState } from "react";
import { Upload, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSettingsPage() {
  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyInfo, setCompanyInfo] = useState({
    name: "Health Services Inc.",
    email: "contact@healthservices.com",
    phone: "(123) 456-7890",
    address: "123 Health Street, Medical City, MC 12345",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    payment: true,
  });

  // Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCompanyLogo(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle company info submit (mock action)
  const handleCompanyInfoSubmit = (e) => {
    e.preventDefault();
    console.log("Save company info:", companyInfo, "Logo:", companyLogo);
  };

  // Handle notification toggle
  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle password submit (mock action)
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    console.log("Password change submitted");
  };

  // Animation variants
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

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Company Information */}
        <motion.div
          variants={cardVariants}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Company Information
          </h2>
          <form className="space-y-6" onSubmit={handleCompanyInfoSubmit}>
            <div className="space-y-4">
              <motion.div variants={inputVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                  value={companyInfo.name}
                  onChange={(e) =>
                    setCompanyInfo({ ...companyInfo, name: e.target.value })
                  }
                />
              </motion.div>
              <motion.div variants={inputVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Logo
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100/50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200/50">
                    {companyLogo ? (
                      <img
                        src={companyLogo}
                        alt="Company Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 text-xs text-center">
                        No logo
                      </span>
                    )}
                  </div>
                  <label className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-xl shadow-md hover:bg-gray-900 cursor-pointer transition-all duration-200">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                  </label>
                </div>
              </motion.div>
              <motion.div variants={inputVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                  value={companyInfo.email}
                  onChange={(e) =>
                    setCompanyInfo({ ...companyInfo, email: e.target.value })
                  }
                />
              </motion.div>
              <motion.div variants={inputVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                  value={companyInfo.phone}
                  onChange={(e) =>
                    setCompanyInfo({ ...companyInfo, phone: e.target.value })
                  }
                />
              </motion.div>
              <motion.div variants={inputVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  className="w-full px-4 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                  rows={3}
                  value={companyInfo.address}
                  onChange={(e) =>
                    setCompanyInfo({ ...companyInfo, address: e.target.value })
                  }
                />
              </motion.div>
            </div>
            <motion.div variants={inputVariants}>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-xl shadow-md hover:bg-gray-900 transition-all duration-200"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Company Information
              </motion.button>
            </motion.div>
          </form>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          variants={cardVariants}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Notification Settings
          </h2>
          <div className="space-y-4">
            {[
              {
                key: "email",
                title: "Email Notifications",
                desc: "Receive email notifications for new appointments",
              },
              {
                key: "sms",
                title: "SMS Notifications",
                desc: "Receive SMS notifications for appointment reminders",
              },
              {
                key: "payment",
                title: "Payment Notifications",
                desc: "Receive notifications for payment updates",
              },
            ].map((item) => (
              <motion.div
                key={item.key}
                variants={inputVariants}
                className="flex items-center justify-between"
              >
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
                <motion.label
                  className="relative inline-flex items-center cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications[item.key]}
                    onChange={() => handleNotificationToggle(item.key)}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
                </motion.label>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Change Password */}
        <motion.div
          variants={cardVariants}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Change Password
          </h2>
          <form className="space-y-6" onSubmit={handlePasswordSubmit}>
            <div className="space-y-4">
              <motion.div variants={inputVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                  placeholder="Enter current password"
                  required
                />
              </motion.div>
              <motion.div variants={inputVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                  placeholder="Enter new password"
                  required
                />
              </motion.div>
              <motion.div variants={inputVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                  placeholder="Confirm new password"
                  required
                />
              </motion.div>
            </div>
            <motion.div variants={inputVariants}>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-xl shadow-md hover:bg-gray-900 transition-all duration-200"
              >
                <Save className="h-4 w-4 mr-2" />
                Update Password
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
