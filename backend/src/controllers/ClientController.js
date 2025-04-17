const Client = require("../models/ClientModel");

exports.createClient = async (req, res) => {
  console.log("Session:", req.session);
  const userId = req.session.userId;
  if (!userId) {
    console.log("Unauthorized: No userId in session");
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const { fullName, email, phone, nextAppointment } = req.body;
    const existingClient = await Client.findOne({ userId });
    if (existingClient) {
      return res.status(400).json({ message: "Client already exists" });
    }
    const client = new Client({
      userId: mongoose.Types.ObjectId(userId),
      fullName,
      email,
      phone,
      nextAppointment,
    });
    await client.save();
    res.status(201).json({ message: "Client created", data: client });
  } catch (error) {
    console.error("Error creating client:", error);
    res
      .status(500)
      .json({ message: "Error creating client", error: error.message });
  }
};

exports.getClientsForProvider = async (req, res) => {
  console.log("Session:", req.session);
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  try {
    const clients = await Client.find({ userId: req.session.userId }).lean();
    console.log("Clients fetched:", clients);
    res.json({ data: clients });
  } catch (error) {
    console.error("Fetch error:", error);
    res
      .status(500)
      .json({ message: "Error fetching clients", error: error.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, nextAppointment } = req.body;
    const client = await Client.findOneAndUpdate(
      { userId: id, userId: req.session.userId }, // Ensure provider owns the client
      { fullName, email, phone, nextAppointment },
      { new: true, runValidators: true }
    );
    if (!client)
      return res
        .status(404)
        .json({ message: "Client not found or unauthorized" });
    res.json({ message: "Client updated", data: client });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating client", error: error.message });
  }
};
