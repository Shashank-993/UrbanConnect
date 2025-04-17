"use client";

import { useState } from "react";
import { Upload, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profile, setProfile] = useState({
    fullName: "Dr. Jane Smith",
    specialty: "Dentist",
    email: "jane.smith@example.com",
    phone: "(123) 456-7890",
    bio: "Dr. Jane Smith is a certified dentist with over 10 years of experience in general dentistry, cosmetic procedures, and dental surgery.",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    payment: true,
  });
  const [passwordError, setPasswordError] = useState("");

  // Handlers
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
        alert("Please upload an image file under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => setProfilePhoto(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedProfile = {
      fullName: form["full-name"].value,
      specialty: form.specialty.value,
      email: form.email.value,
      phone: form.phone.value,
      bio: form.bio.value,
    };
    if (!updatedProfile.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert("Please enter a valid email address.");
      return;
    }
    setProfile(updatedProfile);
    alert("Profile updated successfully!"); // Replace with API call
  };

  const handleNotificationToggle = (type) => {
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const currentPassword = form["current-password"].value;
    const newPassword = form["new-password"].value;
    const confirmPassword = form["confirm-password"].value;

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    setPasswordError("");
    alert("Password updated successfully!"); // Replace with API call
    form.reset();
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

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Profile Settings Card */}
        <motion.div
          variants={cardVariants}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-purple-300/75"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Profile Settings
            </h2>
            <form className="space-y-6" onSubmit={handleProfileSubmit}>
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm text-center">
                        No photo
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <label className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 cursor-pointer transition-all duration-200">
                      <Upload className="h-4 w-4 mr-2" />
                      Change Photo
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        aria-label="Upload profile photo"
                      />
                    </label>
                    {profilePhoto && (
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        className="flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all duration-200"
                        onClick={handleRemovePhoto}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </motion.button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="full-name"
                      required
                      className="w-full px-3 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                      defaultValue={profile.fullName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialty
                    </label>
                    <input
                      type="text"
                      name="specialty"
                      required
                      className="w-full px-3 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                      defaultValue={profile.specialty}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                      defaultValue={profile.email}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full px-3 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                      defaultValue={profile.phone}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Professional Bio
                    </label>
                    <textarea
                      name="bio"
                      className="w-full px-3 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                      rows={4}
                      defaultValue={profile.bio}
                    />
                  </div>
                </div>
              </div>
              <div>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all duration-200"
                >
                  Save Profile Information
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Notification Settings Card */}
        <motion.div
          variants={cardVariants}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-purple-300/75"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Notification Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Email Notifications
                  </h3>
                  <p className="text-sm text-gray-500">
                    Receive email notifications for new appointments
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.email}
                    onChange={() => handleNotificationToggle("email")}
                    aria-label="Toggle email notifications"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    SMS Notifications
                  </h3>
                  <p className="text-sm text-gray-500">
                    Receive SMS notifications for appointment reminders
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.sms}
                    onChange={() => handleNotificationToggle("sms")}
                    aria-label="Toggle SMS notifications"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Payment Notifications
                  </h3>
                  <p className="text-sm text-gray-500">
                    Receive notifications for payment updates
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.payment}
                    onChange={() => handleNotificationToggle("payment")}
                    aria-label="Toggle payment notifications"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
                </label>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Change Password Card */}
        <motion.div
          variants={cardVariants}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-purple-300/75"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Change Password
            </h2>
            <form className="space-y-6" onSubmit={handlePasswordSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="current-password"
                    required
                    className="w-full px-3 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="new-password"
                    required
                    className="w-full px-3 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirm-password"
                    required
                    className="w-full px-3 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                    placeholder="Confirm new password"
                  />
                </div>
                {passwordError && (
                  <p className="text-sm text-red-600">{passwordError}</p>
                )}
              </div>
              <div>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all duration-200"
                >
                  Update Password
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
