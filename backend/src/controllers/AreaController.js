const areaModel = require("../models/AreaModel");

// Create a new area
exports.createArea = async (req, res) => {
  try {
    // Since we're not validating required fields anymore,
    // we simply take what is provided.
    const { areaName, zipcode } = req.body;

    const newArea = new areaModel({ areaName, zipcode });
    const savedArea = await newArea.save();

    res.status(201).json(savedArea);
  } catch (error) {
    console.error("Error creating area:", error);
    res.status(500).json({ error: "Server error while creating area" });
  }
};

// Get all areas
exports.getAllAreas = async (req, res) => {
  try {
    const areas = await areaModel.find();
    res.status(200).json(areas);
  } catch (error) {
    console.error("Error fetching areas:", error);
    res.status(500).json({ error: "Server error while fetching areas" });
  }
};

// Get a single area by document _id
exports.getAreaById = async (req, res) => {
  try {
    const area = await areaModel.findById(req.params.id);
    if (!area) {
      return res.status(404).json({ error: "Area not found" });
    }
    res.status(200).json(area);
  } catch (error) {
    console.error("Error fetching area:", error);
    res.status(500).json({ error: "Server error while fetching area" });
  }
};

// Update an area
exports.updateArea = async (req, res) => {
  try {
    const updatedArea = await areaModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedArea) {
      return res.status(404).json({ error: "Area not found" });
    }
    res.status(200).json(updatedArea);
  } catch (error) {
    console.error("Error updating area:", error);
    res.status(500).json({ error: "Server error while updating area" });
  }
};

// Delete an area
exports.deleteArea = async (req, res) => {
  try {
    const deletedArea = await areaModel.findByIdAndDelete(req.params.id);
    if (!deletedArea) {
      return res.status(404).json({ error: "Area not found" });
    }
    res.status(200).json({ message: "Area deleted successfully" });
  } catch (error) {
    console.error("Error deleting area:", error);
    res.status(500).json({ error: "Server error while deleting area" });
  }
};
