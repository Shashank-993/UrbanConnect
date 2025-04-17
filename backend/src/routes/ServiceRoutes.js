const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/ServiceController");

router.get("/services", serviceController.getAllServices); // /pservices/services
router.post("/services/create", serviceController.createService); // /pservices/services/create
router.put("/services/update/:id", serviceController.updateService); // /pservices/services/update/:id
router.delete("/services/delete/:id", serviceController.deleteService); // /pservices/services/delete/:id
router.patch("/approve/:id", serviceController.updateServiceApproval); // /pservices/approve/:id
router.get("/services/admin/all", serviceController.getAllServicesForAdmin); // /pservices/services/admin/all

module.exports = router;
