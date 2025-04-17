const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const multer = require("multer");

const app = express();

// Configure CORS to allow credentials and specify the origin
const corsOptions = {
  origin: "http://localhost:5173", // Match your Vite frontend origin
  credentials: true, // Allow cookies/credentials to be sent
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure session store with connect-mongodb-session
const store = new MongoDBStore({
  uri: "mongodb://localhost:27017/node_internship",
  collection: "sessions",
});

// Catch errors from the session store
store.on("error", function (error) {
  console.error("Session store error:", error);
});

app.use(
  session({
    secret: "your_session_secret", // Change this to a secure secret in production
    resave: false,
    saveUninitialized: false,
    store: store, // Use connect-mongodb-session store
    cookie: {
      secure: false, // Set to true if using HTTPS in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // Session expires after 24 hours
    },
  })
);

// Multer setup for profile picture and service image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./Uploads";
    if (!require("fs").existsSync(uploadDir)) {
      require("fs").mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Serve static files from the uploads folder
app.use("/uploads", express.static("Uploads")); // Maps /uploads to the uploads directory

// Existing Routes
const roleRoutes = require("./src/routes/RoleRoutes");
app.use("/roles", roleRoutes);

const userRoutes = require("./src/routes/UserRoutes");
app.use("/users", userRoutes);

const areaRoutes = require("./src/routes/AreaRoutes");
app.use("/areas", areaRoutes);

const cityRoutes = require("./src/routes/CityRoutes");
app.use("/cities", cityRoutes);

const stateRoutes = require("./src/routes/StateRoutes");
app.use("/states", stateRoutes);

const addressRoutes = require("./src/routes/UaddressRoutes");
app.use("/addresses", addressRoutes);

const categoryRoutes = require("./src/routes/CategoryRoutes");
app.use("/categories", categoryRoutes);

const userCategoryRoutes = require("./src/routes/UserCategoryRoutes");
app.use("/usercategories", userCategoryRoutes);

const paymentRoutes = require("./src/routes/RazorRoutes");
app.use(paymentRoutes);

const serviceRoutes = require("./src/routes/ServiceRoutes");
app.use("/pservices", serviceRoutes);

const profileRoutes = require("./src/routes/ProfileRoutes");
app.use("/profile", profileRoutes);

const appointmentRoutes = require("./src/routes/AppointmentRoutes");
app.use("/appointments", appointmentRoutes);

const clientRoutes = require("./src/routes/ClientRoutes");
app.use("/clients", clientRoutes);

const adminRoutes = require("./src/routes/AdminRoutes");
app.use("/auth/admin", adminRoutes); // Matches AdminAuth.jsx endpoints

// New Admin Status Check Endpoint
app.get("/check-admin", (req, res) => {
  console.log("Checking admin status - Session:", req.session); // Debug log
  res.json({ isAdmin: req.session.isAdmin || false });
});

// Temporary admin login route (replace with secure auth logic)
app.post("/auth/admin/login", (req, res) => {
  const { username, password } = req.body;
  console.log(
    "Admin login attempt - Username:",
    username,
    "Password:",
    password
  );
  if (username === "admin" && password === "admin123") {
    // Replace with proper auth (e.g., bcrypt, JWT)
    req.session.userId = "admin-user-id";
    req.session.isAdmin = true;
    console.log("Admin logged in - Session:", req.session);
    res.status(200).json({ message: "Admin logged in", isAdmin: true });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Test route to confirm server is running
app.get("/test", (req, res) => {
  res.send("Server is running");
});

// Temporary test POST endpoint
app.post("/test-post", (req, res) => {
  res.status(200).json({ message: "POST test successful", body: req.body });
});

app.post("/test-upload", upload.single("image"), (req, res) => {
  res
    .status(200)
    .json({ message: "Upload test successful", filename: req.file.filename });
});

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/node_internship", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected...");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
