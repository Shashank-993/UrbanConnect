const bcrypt = require("bcrypt");
const User = require("../models/ProfileModel");
const Booking = require("../models/BookingModel");
const Notification = require("../models/NotificationModel");
const Appointment = require("../models/AppointmentModel");

exports.signup = async (req, res) => {
  try {
    const { fullName, email, password, phone, userType } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      phone,
      userType,
    });
    await user.save();

    req.session.userId = user._id;
    req.session.userType = user.userType;

    res.status(201).json({
      message: "User created successfully",
      data: { _id: user._id, fullName, email, phone, userType },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.userId = user._id;
    req.session.userType = user.userType;

    res.json({
      message: "Logged in successfully",
      data: {
        _id: user._id,
        fullName: user.fullName,
        email,
        phone: user.phone,
        userType: user.userType,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Error logging out", error: err.message });
    res.json({ message: "Logged out successfully" });
  });
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    console.log("Current userId:", req.session.userId); // Log userId
    res.json({
      data: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        bio: user.bio,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, email, phone, address, bio } = req.body;
    const profilePicturePath = req.file ? req.file.path : null;

    const user = await User.findByIdAndUpdate(
      req.session.userId,
      {
        fullName,
        email,
        phone,
        address,
        bio,
        profilePicture: profilePicturePath,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Profile updated successfully",
      data: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        bio: user.bio,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Current password is incorrect" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error changing password", error: error.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.session.userId.toString();
    console.log("Fetching dashboard for userId:", userId);

    // Fetch bookings
    const bookings = await Booking.find({
      userId: userId,
      status: { $ne: "cancelled" },
    });
    console.log("Found bookings:", bookings);

    // Fetch appointments
    const appointments = await Appointment.find({
      userId: userId,
      status: { $ne: "cancelled" },
    });
    console.log("Found appointments:", appointments);

    // Combine bookings and appointments
    const allBookings = [...bookings, ...appointments];

    // Calculate metrics
    const totalBookings = allBookings.length;
    const totalSpent = allBookings.reduce(
      (sum, item) => sum + (item.amount || 0), // Use 0 if amount is undefined
      0
    );
    const upcomingAppointments = allBookings.filter(
      (item) => new Date(item.date) > new Date()
    ).length;

    res.status(200).json({
      totalBookings,
      totalSpent,
      upcomingAppointments,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Error fetching dashboard data", error });
  }
};

exports.getActivities = async (req, res) => {
  try {
    const userId = req.session.userId.toString();
    console.log("Fetching activities for userId:", userId);
    const bookings = await Booking.find({ userId: userId })
      .sort({ updatedAt: -1 })
      .limit(3)
      .lean();
    console.log("Found bookings for activities:", bookings);
    const activities = bookings.map((b) => ({
      id: b._id,
      action: `Booked ${b.serviceName}`,
      timestamp: b.updatedAt,
    }));
    console.log("Mapped activities:", activities);
    res.status(200).json(activities);
  } catch (error) {
    console.error("Activities error:", error);
    res
      .status(500)
      .json({ message: "Error fetching activities", error: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.session.userId.toString();
    console.log("Fetching notifications for userId:", userId);
    const notifications = await Notification.find({ userId: userId })
      .sort({ timestamp: -1 })
      .limit(5)
      .lean();
    console.log("Found notifications:", notifications);
    const formattedNotifications = notifications.map((n) => ({
      id: n._id,
      message: n.message,
      timestamp: n.timestamp,
      read: n.read,
    }));
    console.log("Mapped notifications:", formattedNotifications);
    res.status(200).json(formattedNotifications);
  } catch (error) {
    console.error("Notifications error:", error);
    res
      .status(500)
      .json({ message: "Error fetching notifications", error: error.message });
  }
};
