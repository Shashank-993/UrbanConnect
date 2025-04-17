const State = require("../models/StateModel");

// Create a new state
exports.createState = async (req, res) => {
  try {
    const { stateName } = req.body;
    const newState = new State({ stateName });
    const savedState = await newState.save();
    res.status(201).json(savedState);
  } catch (error) {
    console.error("Error creating state:", error);
    res.status(500).json({ error: "Server error while creating state" });
  }
};

// Get all states
exports.getAllStates = async (req, res) => {
  try {
    const states = await State.find();
    res.status(200).json(states);
  } catch (error) {
    console.error("Error fetching states:", error);
    res.status(500).json({ error: "Server error while fetching states" });
  }
};

// Get a state by its _id
exports.getStateById = async (req, res) => {
  try {
    const state = await State.findById(req.params.id);
    if (!state) {
      return res.status(404).json({ error: "State not found" });
    }
    res.status(200).json(state);
  } catch (error) {
    console.error("Error fetching state:", error);
    res.status(500).json({ error: "Server error while fetching state" });
  }
};

// Update a state
exports.updateState = async (req, res) => {
  try {
    const updatedState = await State.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedState) {
      return res.status(404).json({ error: "State not found" });
    }
    res.status(200).json(updatedState);
  } catch (error) {
    console.error("Error updating state:", error);
    res.status(500).json({ error: "Server error while updating state" });
  }
};

// Delete a state
exports.deleteState = async (req, res) => {
  try {
    const deletedState = await State.findByIdAndDelete(req.params.id);
    if (!deletedState) {
      return res.status(404).json({ error: "State not found" });
    }
    res.status(200).json({ message: "State deleted successfully" });
  } catch (error) {
    console.error("Error deleting state:", error);
    res.status(500).json({ error: "Server error while deleting state" });
  }
};
