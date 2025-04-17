const UserAddress = require("../models/UaddressModel");

// Create a new user address and populate foreign keys
exports.createUserAddress = async (req, res) => {
  try {
    const { userId, cityId, areaId, stateId, zipcode, landmark } = req.body;

    const newAddress = new UserAddress({
      userId,
      cityId,
      areaId,
      stateId,
      zipcode,
      landmark,
    });

    let savedAddress = await newAddress.save();
    // Populate the foreign key references (User, City, Area, State)
    savedAddress = await savedAddress.populate("userId cityId areaId stateId");

    res.status(201).json(savedAddress);
  } catch (error) {
    console.error("Error creating user address:", error);
    res.status(500).json({ error: "Server error while creating user address" });
  }
};

// Get all user addresses with populated foreign keys
exports.getAllUserAddresses = async (req, res) => {
  try {
    const addresses = await UserAddress.find().populate(
      "userId cityId areaId stateId"
    );
    res.status(200).json(addresses);
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    res
      .status(500)
      .json({ error: "Server error while fetching user addresses" });
  }
};

// Get a single user address by its _id with populated foreign keys
exports.getUserAddressById = async (req, res) => {
  try {
    const address = await UserAddress.findById(req.params.id).populate(
      "userId cityId areaId stateId"
    );
    if (!address) {
      return res.status(404).json({ error: "User address not found" });
    }
    res.status(200).json(address);
  } catch (error) {
    console.error("Error fetching user address:", error);
    res.status(500).json({ error: "Server error while fetching user address" });
  }
};

// Update a user address (and return the updated document with populated foreign keys)
exports.updateUserAddress = async (req, res) => {
  try {
    let updatedAddress = await UserAddress.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAddress) {
      return res.status(404).json({ error: "User address not found" });
    }
    updatedAddress = await updatedAddress.populate(
      "userId cityId areaId stateId"
    );
    res.status(200).json(updatedAddress);
  } catch (error) {
    console.error("Error updating user address:", error);
    res.status(500).json({ error: "Server error while updating user address" });
  }
};

// Delete a user address
exports.deleteUserAddress = async (req, res) => {
  try {
    const deletedAddress = await UserAddress.findByIdAndDelete(req.params.id);
    if (!deletedAddress) {
      return res.status(404).json({ error: "User address not found" });
    }
    res.status(200).json({ message: "User address deleted successfully" });
  } catch (error) {
    console.error("Error deleting user address:", error);
    res.status(500).json({ error: "Server error while deleting user address" });
  }
};
