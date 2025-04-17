const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  getDashboard,
  getActivities,
  getNotifications,
} = require("../controllers/ProfileController");
const multer = require("multer");

// Multer setup for profile picture
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Middleware to check authenticated session
const authenticateSession = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

router.post("/users/signup", signup);
router.post("/users/login", login);
router.post("/users/logout", logout);
router.get("/users/profile", authenticateSession, getProfile);
router.put(
  "/users/profile",
  authenticateSession,
  upload.single("profilePicture"),
  updateProfile
);
router.put("/users/change-password", authenticateSession, changePassword);
router.get("/users/dashboard", authenticateSession, getDashboard);
router.get("/users/activities", authenticateSession, getActivities);
router.get("/users/notifications", authenticateSession, getNotifications);

module.exports = router;
