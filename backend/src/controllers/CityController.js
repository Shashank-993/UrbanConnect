const City = require("../models/CityModel");

// Create a new city document
exports.createCity = async (req, res) => {
  try {
    const { cityName, stateId } = req.body;
    const newCity = new City({ cityName, stateId });
    const savedCity = await newCity.save();
    res.status(201).json(savedCity);
  } catch (error) {
    console.error("Error creating city:", error);
    res.status(500).json({ error: "Server error while creating city" });
  }
};

// Get all city documents
exports.getAllCities = async (req, res) => {
  try {
    const cities = await City.find();
    res.status(200).json(cities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ error: "Server error while fetching cities" });
  }
};

// Get a single city by its _id
exports.getCityById = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({ error: "City not found" });
    }
    res.status(200).json(city);
  } catch (error) {
    console.error("Error fetching city:", error);
    res.status(500).json({ error: "Server error while fetching city" });
  }
};

// Update a city document
exports.updateCity = async (req, res) => {
  try {
    const updatedCity = await City.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedCity) {
      return res.status(404).json({ error: "City not found" });
    }
    res.status(200).json(updatedCity);
  } catch (error) {
    console.error("Error updating city:", error);
    res.status(500).json({ error: "Server error while updating city" });
  }
};

// Delete a city document
exports.deleteCity = async (req, res) => {
  try {
    const deletedCity = await City.findByIdAndDelete(req.params.id);
    if (!deletedCity) {
      return res.status(404).json({ error: "City not found" });
    }
    res.status(200).json({ message: "City deleted successfully" });
  } catch (error) {
    console.error("Error deleting city:", error);
    res.status(500).json({ error: "Server error while deleting city" });
  }
};
