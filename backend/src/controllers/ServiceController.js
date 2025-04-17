const Service = require("../models/ServiceModel");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads";
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

exports.getAllServices = async (req, res) => {
  console.log("Fetching approved services...");
  try {
    const services = await Service.find({ approved: true });
    console.log("Approved services fetched:", services);
    res.status(200).json(services);
  } catch (error) {
    console.error("Error in getAllServices:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllServicesForAdmin = async (req, res) => {
  console.log("Fetching all services for admin...");
  try {
    const services = await Service.find();
    console.log("All services fetched:", services);
    res.status(200).json(services);
  } catch (error) {
    console.error("Error in getAllServicesForAdmin:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.createService = [
  upload.single("image"),
  async (req, res) => {
    console.log("Creating service with body:", req.body);
    console.log("Received file:", req.file);
    try {
      const {
        name,
        category,
        description,
        duration,
        price,
        active,
        rating,
        provider,
        providerBio,
        availability,
      } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : null;

      const serviceData = {
        name,
        category,
        description,
        duration: parseInt(duration),
        price: parseFloat(price),
        active: active === "true",
        rating,
        provider,
        providerBio,
        availability,
        image,
        approved: false,
      };
      console.log("Service data before save:", serviceData);

      const service = new Service(serviceData);
      const savedService = await service.save();
      console.log(
        "Service saved with serviceId:",
        savedService.serviceId,
        "and approved:",
        savedService.approved
      );
      res.status(201).json(savedService);
    } catch (error) {
      console.error("Error in createService:", error);
      res.status(400).json({ message: error.message });
    }
  },
];

exports.updateService = [
  upload.single("image"),
  async (req, res) => {
    console.log(
      "Updating service with id:",
      req.params.id,
      "body:",
      req.body,
      "file:",
      req.file
    );
    try {
      const { id } = req.params;
      const {
        name,
        category,
        description,
        duration,
        price,
        active,
        rating,
        provider,
        providerBio,
        availability,
        approved,
      } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : undefined;

      const updatedService = await Service.findByIdAndUpdate(
        id,
        {
          name,
          category,
          description,
          duration: parseInt(duration),
          price: parseFloat(price),
          active: active === "true",
          rating,
          provider,
          providerBio,
          availability,
          image,
          approved: approved !== undefined ? approved : undefined,
        },
        { new: true, runValidators: true }
      );

      if (!updatedService)
        return res.status(404).json({ message: "Service not found" });
      console.log("Service updated:", updatedService);
      res.status(200).json(updatedService);
    } catch (error) {
      console.error("Error in updateService:", error);
      res.status(400).json({ message: error.message });
    }
  },
];

exports.deleteService = async (req, res) => {
  console.log("Deleting service with id:", req.params.id);
  try {
    const { id } = req.params;
    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService)
      return res.status(404).json({ message: "Service not found" });
    console.log("Service deleted:", deletedService);
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error in deleteService:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateServiceApproval = async (req, res) => {
  console.log("Session during approval request:", req.session); // Debug session
  const adminId = req.session.userId;
  // Check if admin role exists in session
  if (!adminId || !req.session.admin || req.session.admin.role !== "admin") {
    console.log(
      "Forbidden: No admin session - userId:",
      adminId,
      "admin role:",
      req.session.admin?.role
    );
    return res
      .status(403)
      .json({ message: "Forbidden: Admin access required" });
  }

  try {
    const { id } = req.params;
    const { approved } = req.body;
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    service.approved = approved;
    await service.save();
    console.log("Service approval updated:", service);
    res
      .status(200)
      .json({
        message: `Service ${approved ? "approved" : "rejected"}`,
        service,
      });
  } catch (error) {
    console.error("Error updating service approval:", error);
    res
      .status(500)
      .json({
        message: "Error updating service approval",
        error: error.message,
      });
  }
};
