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
  Shield,
  Mail,
  Phone,
  MapPin,
  FileText,
  Globe,
  Clock,
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

  const DashboardCard = ({ icon: Icon, title, value, color = "indigo" }) => (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/50 transition-all duration-300 hover:shadow-xl"
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-500`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-600 font-medium font-outfit">
            {title}
          </p>
          <p className="text-2xl font-bold text-slate-800 font-outfit">
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-outfit"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-xl p-6 md:p-10 max-w-7xl mx-auto border border-slate-200/50"
      >
        <div className="flex flex-col md:flex-row gap-8">
          <motion.div variants={itemVariants} className="w-full md:w-1/4">
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 shadow-lg border border-slate-200/30"
            >
              <div className="flex flex-col items-center space-y-4 pb-6 border-b border-slate-200/50">
                <div className="relative group">
                  <motion.img
                    src={avatarSrc}
                    alt="Profile Avatar"
                    className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover shadow-lg ring-2 ring-indigo-500/20 transition-all duration-300 group-hover:ring-indigo-500/40"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                  />
                  <motion.button
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-200"
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
                  className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight"
                >
                  {isLoading
                    ? "Loading..."
                    : error
                    ? "Error"
                    : profileData.fullName || "User"}
                </motion.h2>
                <motion.p
                  variants={itemVariants}
                  className="text-sm md:text-base text-slate-600 font-roboto-flex"
                >
                  {isLoading
                    ? "Loading..."
                    : error
                    ? "Error"
                    : profileData.email || "No email"}
                </motion.p>
              </div>
              <nav className="mt-6 space-y-2.5">
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
                    className={`flex items-center w-full p-3.5 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-indigo-50 text-indigo-700 font-medium shadow-sm"
                        : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
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
                className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200/50"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 tracking-tight">
                  Dashboard
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <DashboardCard
                    icon={Book}
                    title="Total Bookings"
                    value={dashboardData.totalBookings}
                    color="indigo"
                  />
                  <DashboardCard
                    icon={DollarSign}
                    title="Total Spent"
                    value={`$${dashboardData.totalSpent}`}
                    color="emerald"
                  />
                  <DashboardCard
                    icon={Calendar}
                    title="Upcoming Appointments"
                    value={dashboardData.upcomingAppointments}
                    color="amber"
                  />
                </div>
                <motion.div variants={itemVariants} className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 tracking-tight">
                    Quick Actions
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {[
                      {
                        label: "Explore Services",
                        path: "/browse",
                        icon: Globe,
                      },
                      {
                        label: "Book a Service",
                        path: "/booking",
                        icon: Calendar,
                      },
                      {
                        label: "View Invoices",
                        path: "#",
                        action: () => console.log("View invoices"),
                        icon: FileText,
                      },
                      {
                        label: "Contact Support",
                        path: "#",
                        action: () => console.log("Contact support"),
                        icon: Phone,
                      },
                    ].map((action, index) => (
                      <RouterLink
                        key={index}
                        to={action.path}
                        onClick={action.action}
                        className="flex items-center bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-md hover:bg-indigo-700 transition-all duration-200 font-medium"
                      >
                        <action.icon size={16} className="mr-2" />
                        <span>{action.label}</span>
                        <ArrowRight size={16} className="ml-2" />
                      </RouterLink>
                    ))}
                  </div>
                </motion.div>
                <motion.div variants={itemVariants} className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 tracking-tight">
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
                          className="flex items-start p-4 bg-white rounded-xl shadow-sm border border-slate-200/50 hover:shadow-md transition-all duration-200"
                        >
                          <Bell
                            size={20}
                            className="text-indigo-500 mt-1 mr-3"
                          />
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {activity.action || "Unknown Activity"}
                            </p>
                            <p className="text-xs text-slate-500 font-roboto-flex mt-1">
                              {activity.timestamp || "No timestamp"}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-slate-600 p-4 bg-white rounded-xl shadow-sm border border-slate-200/50">
                        No recent activities found.
                      </p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200/50"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 tracking-tight">
                  Profile Settings
                </h2>
                <form className="space-y-6" onSubmit={handleSaveChanges}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="text-sm md:text-base font-medium text-slate-700 block mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <input
                          type="text"
                          value={profileData.fullName}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              fullName: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-slate-400 font-roboto-flex"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm md:text-base font-medium text-slate-700 block mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              email: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-slate-400 font-roboto-flex"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm md:text-base font-medium text-slate-700 block mb-2">
                        Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              phone: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-slate-400 font-roboto-flex"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm md:text-base font-medium text-slate-700 block mb-2">
                        Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <input
                          type="text"
                          value={profileData.address}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              address: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-slate-400 font-roboto-flex"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm md:text-base font-medium text-slate-700 block mb-2">
                        Bio
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 text-slate-400 h-5 w-5" />
                        <textarea
                          rows="4"
                          value={profileData.bio}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              bio: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-slate-400 font-roboto-flex resize-none"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-md transition-all duration-200 font-medium"
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
                className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200/50"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 tracking-tight">
                  Account Settings
                </h2>
                <form className="space-y-6">
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm md:text-base font-medium text-slate-700 block mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <input
                          type="text"
                          value={profileData.fullName}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              fullName: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-slate-400 font-roboto-flex"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm md:text-base font-medium text-slate-700 block mb-2">
                        Email Notifications
                      </label>
                      <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="notify-updates"
                            defaultChecked
                            className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 transition-all duration-200"
                          />
                          <label
                            htmlFor="notify-updates"
                            className="ml-3 text-sm md:text-base text-slate-700 font-roboto-flex"
                          >
                            Service updates and announcements
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="notify-marketing"
                            className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 transition-all duration-200"
                          />
                          <label
                            htmlFor="notify-marketing"
                            className="ml-3 text-sm md:text-base text-slate-700 font-roboto-flex"
                          >
                            Marketing and promotional emails
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="notify-activity"
                            defaultChecked
                            className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 transition-all duration-200"
                          />
                          <label
                            htmlFor="notify-activity"
                            className="ml-3 text-sm md:text-base text-slate-700 font-roboto-flex"
                          >
                            Account activity alerts
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm md:text-base font-medium text-slate-700 block mb-2">
                        Language Preference
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <select
                          value="en"
                          className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 font-roboto-flex appearance-none"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm md:text-base font-medium text-slate-700 block mb-2">
                        Time Zone
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <select
                          value="utc-8"
                          className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 font-roboto-flex appearance-none"
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
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-md transition-all duration-200 font-medium"
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
                className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200/50"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 tracking-tight">
                  Change Password
                </h2>
                <form className="space-y-6" onSubmit={handleChangePassword}>
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm md:text-base font-medium text-slate-700 block mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <input
                          type="password"
                          value={profileData.currentPassword}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              currentPassword: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-slate-400 font-roboto-flex"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm md:text-base font-medium text-slate-700 block mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <input
                          type="password"
                          value={profileData.newPassword}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-slate-400 font-roboto-flex"
                        />
                      </div>
                      <p className="text-xs md:text-sm text-slate-500 mt-2 font-roboto-flex">
                        Password must be at least 8 characters and include a
                        number and a special character
                      </p>
                    </div>
                    <div>
                      <label className="text-sm md:text-base font-medium text-slate-700 block mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <input
                          type="password"
                          value={profileData.confirmNewPassword}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              confirmNewPassword: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-slate-400 font-roboto-flex"
                        />
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-md transition-all duration-200 font-medium"
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
