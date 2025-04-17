const Appointment = require("../models/AppointmentModel");
const Client = require("../models/ClientModel");
const Booking = require("../models/BookingModel"); // Add this import
const mongoose = require("mongoose");

exports.createAppointment = async (req, res) => {
  console.log("Session:", req.session);
  const userId = req.session.userId;
  if (!userId) {
    console.log("Unauthorized: No userId in session");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const {
      fullName,
      email,
      phone,
      date,
      time,
      address,
      notes,
      serviceId,
      serviceName,
      amount, // Add amount to the request body
    } = req.body;
    console.log("Request body for createAppointment:", req.body);

    // Validate serviceId as a number
    const validServiceId = Number(serviceId);
    if (isNaN(validServiceId)) {
      return res
        .status(400)
        .json({ message: "Invalid serviceId, must be a number" });
    }

    // Validate amount as a number
    const validAmount = Number(amount);
    if (isNaN(validAmount) || validAmount < 0) {
      return res
        .status(400)
        .json({ message: "Invalid amount, must be a positive number" });
    }

    const appointment = new Appointment({
      userId: new mongoose.Types.ObjectId(userId),
      serviceId: validServiceId,
      serviceName,
      fullName,
      email,
      phone,
      date: new Date(date),
      time,
      address,
      notes,
      amount: validAmount, // Add amount to Appointment
    });
    await appointment.save();

    // Save to Booking collection as well
    const booking = new Booking({
      userId: new mongoose.Types.ObjectId(userId),
      serviceId: validServiceId,
      serviceName,
      amount: validAmount,
      date: new Date(date),
      status: "pending", // Default status
    });
    await booking.save();

    // Sync with Client model
    const nextAppointment = `${new Date(date).toLocaleDateString()} ${time}`;
    let client = await Client.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });
    if (client) {
      if (client.email !== email) {
        const existingEmailClient = await Client.findOne({ email });
        if (
          existingEmailClient &&
          existingEmailClient.userId.toString() !== userId
        ) {
          return res
            .status(400)
            .json({ message: "Email already registered by another user." });
        }
        client.fullName = fullName;
        client.email = email;
        client.phone = phone;
        client.nextAppointment = nextAppointment;
        await client.save();
      } else {
        await Client.findOneAndUpdate(
          { userId: new mongoose.Types.ObjectId(userId) },
          { fullName, phone, nextAppointment },
          { new: true }
        );
      }
    } else {
      const existingEmailClient = await Client.findOne({ email });
      if (existingEmailClient) {
        return res
          .status(400)
          .json({ message: "Email already registered by another user." });
      }
      client = new Client({
        userId: new mongoose.Types.ObjectId(userId),
        fullName,
        email,
        phone,
        nextAppointment,
      });
      await client.save();
    }

    res.status(201).json({ message: "Appointment created", data: appointment });
  } catch (error) {
    console.error("Error creating appointment:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        message:
          "Email already registered. Please use a different email or log in.",
      });
    }
    res
      .status(500)
      .json({ message: "Error creating appointment", error: error.message });
  }
};

exports.getAppointmentsForProvider = async (req, res) => {
  console.log("Session:", req.session);
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  try {
    const appointments = await Appointment.find().lean();
    res.json({ data: appointments });
  } catch (error) {
    console.error("Fetch error:", error);
    res
      .status(500)
      .json({ message: "Error fetching appointments", error: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    res.json({ data: appointment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating status", error: error.message });
  }
};
