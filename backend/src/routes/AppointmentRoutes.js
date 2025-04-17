const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/AppointmentController");

router.post("/", appointmentController.createAppointment);
router.get("/provider", appointmentController.getAppointmentsForProvider);
router.patch("/:id", appointmentController.updateAppointmentStatus);

module.exports = router;
