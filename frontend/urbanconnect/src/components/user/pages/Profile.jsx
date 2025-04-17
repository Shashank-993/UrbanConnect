"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Settings,
  Lock,
  Camera,
  Save,
  ChevronRight,
  LayoutDashboard,
  Book,
  DollarSign,
  Calendar,
  Bell,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [avatarSrc, setAvatarSrc] = useState(
    "/placeholder.svg?height=96&width=96"
  );
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalSpent: 0,
    upcomingAppointments: 0,
    recentActivities: [], // Initialize as empty array
  });

  useEffect(() => {
    console.log("useEffect triggered for profile data fetch");
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("Starting data fetch...");
        const profileResponse = await axios.get(
          "http://localhost:5000/profile/users/profile",
          { withCredentials: true }
        );
        if (profileResponse.status === 200) {
          const data = profileResponse.data.data;
          setProfileData((prev) => ({ ...prev, ...data }));
          if (data.profilePicture) {
            const picturePath = data.profilePicture.startsWith("http")
              ? data.profilePicture
              : `http://localhost:5000/${data.profilePicture}`;
            setAvatarSrc(picturePath);
          }
        }

        console.log("Fetching dashboard...");
        const dashboardResponse = await axios.get(
          "http://localhost:5000/profile/users/dashboard",
          { withCredentials: true }
        );
        if (dashboardResponse.status === 200) {
          console.log("Dashboard data:", dashboardResponse.data);
          setDashboardData(dashboardResponse.data);
        }

        console.log("Fetching activities...");
        const activitiesResponse = await axios.get(
          "http://localhost:5000/profile/users/activities",
          { withCredentials: true }
        );
        if (activitiesResponse.status === 200) {
          console.log("Activities data:", activitiesResponse.data);
          setDashboardData((prev) => ({
            ...prev,
            recentActivities: activitiesResponse.data,
          }));
        }
      } catch (error) {
        console.error("Fetch error:", error.response?.data || error.message);
        setError(
          error.response?.data?.message ||
            "Error fetching data: " + error.message
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatarSrc(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", profileData.fullName);
    formData.append("email", profileData.email);
    formData.append("phone", profileData.phone);
    formData.append("address", profileData.address);
    formData.append("bio", profileData.bio);
    if (fileInputRef.current.files[0]) {
      formData.append("profilePicture", fileInputRef.current.files[0]);
    }

    try {
      const response = await fetch(
        "http://localhost:5000/profile/users/profile",
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
        setProfileData((prev) => ({ ...prev, ...data.data }));
        if (data.data.profilePicture) {
          const picturePath = data.data.profilePicture.startsWith("http")
            ? data.data.profilePicture
            : `http://localhost:5000/${data.data.profilePicture}`;
          setAvatarSrc(picturePath);
        }
      } else {
        console.error("Failed to save changes:", data.message);
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (profileData.newPassword !== profileData.confirmNewPassword) {
      console.error("New passwords do not match");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:5000/profile/users/change-password",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            currentPassword: profileData.currentPassword,
            newPassword: profileData.newPassword,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
        setProfileData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        }));
      } else {
        console.error("Failed to change password:", data.message);
      }
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.2 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };
  const tabVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  const DashboardCard = ({ icon: Icon, title, value }) => (
    <motion.div
      variants={itemVariants}
      className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-200/50"
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex items-center space-x-4">
        <Icon size={24} className="text-gray-700" />
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        variants={itemVariants}
        className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-10 max-w-7xl mx-auto border border-gray-200/50"
      >
        <div className="flex flex-col md:flex-row gap-8">
          <motion.div variants={itemVariants} className="w-full md:w-1/4">
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-white/80 to-gray-50/80 rounded-2xl p-6 shadow-lg backdrop-blur-md border border-gray-200/30"
            >
              <div className="flex flex-col items-center space-y-4 pb-6 border-b border-gray-200/50">
                <div className="relative group">
                  <motion.img
                    src={avatarSrc}
                    alt="Profile Avatar"
                    className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover shadow-lg ring-2 ring-gray-500/20 transition-all duration-300 group-hover:ring-gray-500/40"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                  />
                  <motion.button
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-2 right-2 bg-gray-700 text-white p-2 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Camera size={18} />
                  </motion.button>
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                  />
                </div>
                <motion.h2
                  variants={itemVariants}
                  className="text-xl md:text-2xl font-bold text-gray-900"
                >
                  {isLoading
                    ? "Loading..."
                    : error
                    ? "Error"
                    : profileData.fullName || "User"}
                </motion.h2>
                <motion.p
                  variants={itemVariants}
                  className="text-sm md:text-base text-gray-600"
                >
                  {isLoading
                    ? "Loading..."
                    : error
                    ? "Error"
                    : profileData.email || "No email"}
                </motion.p>
              </div>
              <nav className="mt-6 space-y-2">
                {[
                  {
                    id: "dashboard",
                    icon: LayoutDashboard,
                    label: "Dashboard",
                  },
                  { id: "profile", icon: User, label: "Edit Profile" },
                  { id: "account", icon: Settings, label: "Account Settings" },
                  { id: "password", icon: Lock, label: "Change Password" },
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    variants={tabVariants}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center w-full p-3 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-gray-100 text-gray-900 hover:border hover:bg-transparent hover:border-slate-500 shadow-inner"
                        : "text-gray-700 bg-gray-100 shadow-inner hover:border hover:border-slate-500 hover:bg-gray-100/80 hover:shadow-md"
                    }`}
                  >
                    <tab.icon size={20} className="mr-3" />
                    <span className="font-medium text-sm md:text-base">
                      {tab.label}
                    </span>
                    {activeTab === tab.id && (
                      <ChevronRight size={20} className="ml-auto" />
                    )}
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          </motion.div>
          <motion.div variants={itemVariants} className="flex-1">
            {activeTab === "dashboard" && (
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-white/90 to-gray-50/90 rounded-2xl p-6 md:p-8 shadow-lg backdrop-blur-md border border-gray-200/50"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                  Dashboard
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <DashboardCard
                    icon={Book}
                    title="Total Bookings"
                    value={dashboardData.totalBookings}
                  />
                  <DashboardCard
                    icon={DollarSign}
                    title="Total Spent"
                    value={`$${dashboardData.totalSpent}`}
                  />
                  <DashboardCard
                    icon={Calendar}
                    title="Upcoming Appointments"
                    value={dashboardData.upcomingAppointments}
                  />
                </div>
                <motion.div variants={itemVariants} className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "Explore Services", path: "/browse" },
                      { label: "Book a Service", path: "/booking" },
                      {
                        label: "View Invoices",
                        path: "#",
                        action: () => console.log("View invoices"),
                      },
                      {
                        label: "Contact Support",
                        path: "#",
                        action: () => console.log("Contact support"),
                      },
                    ].map((action, index) => (
                      <RouterLink
                        key={index}
                        to={action.path}
                        onClick={action.action}
                        className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-xl shadow-md hover:bg-gray-900 transition-all duration-200"
                      >
                        <span>{action.label}</span>
                        <ArrowRight size={16} className="ml-2" />
                      </RouterLink>
                    ))}
                  </div>
                </motion.div>
                <motion.div variants={itemVariants} className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {dashboardData.recentActivities &&
                    Array.isArray(dashboardData.recentActivities) &&
                    dashboardData.recentActivities.length > 0 ? (
                      dashboardData.recentActivities.map((activity, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          className="flex items-start"
                        >
                          <Bell size={20} className="text-gray-600 mt-1" />
                          <div className="ml-4">
                            <p className="text-sm text-gray-900">
                              {activity.action || "Unknown Activity"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {activity.timestamp || "No timestamp"}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p>No recent activities found.</p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-white/90 to-gray-50/90 rounded-2xl p-6 md:p-8 shadow-lg backdrop-blur-md border border-gray-200/50"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                  Profile Settings
                </h2>
                <form className="space-y-6" onSubmit={handleSaveChanges}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="text-sm md:text-base font-medium text-gray-700 block mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            fullName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-gray-100 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200 placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="text-sm md:text-base font-medium text-gray-700 block mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-gray-100 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200 placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="text-sm md:text-base font-medium text-gray-700 block mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-gray-100 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200 placeholder-gray-400"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm md:text-base font-medium text-gray-700 block mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={profileData.address}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            address: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-gray-100 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200 placeholder-gray-400"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm md:text-base font-medium text-gray-700 block mb-2">
                        Bio
                      </label>
                      <textarea
                        rows="4"
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            bio: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-gray-100 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200 placeholder-gray-400"
                      ></textarea>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.0 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex items-center bg-gray-800 hover:border-white hover:text-green-400 hover:bg-gray-900 px-6 py-3 rounded-xl shadow-md transition-all duration-200"
                  >
                    <Save size={20} className="mr-2" />
                    Save Changes
                  </motion.button>
                </form>
              </motion.div>
            )}

            {activeTab === "account" && (
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-white/90 to-gray-50/90 rounded-2xl p-6 md:p-8 shadow-lg backdrop-blur-md border border-gray-200/50"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                  Account Settings
                </h2>
                <form className="space-y-6">
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm md:text-base font-medium text-gray-700 block mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            fullName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-gray-100 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200 placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="text-sm md:text-base font-medium text-gray-700 block mb-2">
                        Email Notifications
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="notify-updates"
                            defaultChecked
                            className="rounded text-gray-700 focus:ring-gray-500/50 h-4 w-4 transition-all duration-200"
                          />
                          <label
                            htmlFor="notify-updates"
                            className="ml-3 text-sm md:text-base text-gray-700"
                          >
                            Service updates and announcements
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="notify-marketing"
                            className="rounded text-gray-700 focus:ring-gray-500/50 h-4 w-4 transition-all duration-200"
                          />
                          <label
                            htmlFor="notify-marketing"
                            className="ml-3 text-sm md:text-base text-gray-700"
                          >
                            Marketing and promotional emails
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="notify-activity"
                            defaultChecked
                            className="rounded text-gray-700 focus:ring-gray-500/50 h-4 w-4 transition-all duration-200"
                          />
                          <label
                            htmlFor="notify-activity"
                            className="ml-3 text-sm md:text-base text-gray-700"
                          >
                            Account activity alerts
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm md:text-base font-medium text-gray-700 block mb-2">
                        Language Preference
                      </label>
                      <select
                        value="en"
                        className="w-full px-4 py-2.5 bg-gray-100 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm md:text-base font-medium text-gray-700 block mb-2">
                        Time Zone
                      </label>
                      <select
                        value="utc-8"
                        className="w-full px-4 py-2.5 bg-gray-100 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                      >
                        <option value="utc-8">Pacific Time (UTC-8)</option>
                        <option value="utc-5">Eastern Time (UTC-5)</option>
                        <option value="utc+0">
                          Greenwich Mean Time (UTC+0)
                        </option>
                        <option value="utc+1">
                          Central European Time (UTC+1)
                        </option>
                        <option value="utc+8">
                          China Standard Time (UTC+8)
                        </option>
                      </select>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex items-center bg-gray-800 hover:border-white hover:bg-gray-900 hover:text-green-300 px-6 py-3 rounded-xl shadow-md transition-all duration-200"
                    onClick={handleSaveChanges}
                  >
                    <Save size={20} className="mr-2" />
                    Save Settings
                  </motion.button>
                </form>
              </motion.div>
            )}

            {activeTab === "password" && (
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-white/90 to-gray-50/90 rounded-2xl p-6 md:p-8 shadow-lg backdrop-blur-md border border-gray-200/50"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                  Change Password
                </h2>
                <form className="space-y-6" onSubmit={handleChangePassword}>
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm md:text-base font-medium text-gray-700 block mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={profileData.currentPassword}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-gray-100 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200 placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="text-sm md:text-base font-medium text-gray-700 block mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={profileData.newPassword}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-gray-100 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200 placeholder-gray-400"
                      />
                      <p className="text-xs md:text-sm text-gray-500 mt-1">
                        Password must be at least 8 characters and include a
                        number and a special character
                      </p>
                    </div>
                    <div>
                      <label className="text-sm md:text-base font-medium text-gray-700 block mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={profileData.confirmNewPassword}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            confirmNewPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-gray-100 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200 placeholder-gray-400"
                      />
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.0 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex items-center bg-gray-800 hover:border-2 hover:border-white hover:text-red-300 hover:bg-gray-900 px-6 py-3 rounded-xl shadow-md transition-all duration-200"
                  >
                    <Lock size={20} className="mr-2" />
                    Update Password
                  </motion.button>
                </form>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
