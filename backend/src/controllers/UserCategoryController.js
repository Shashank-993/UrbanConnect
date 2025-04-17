const UserCategory = require("../models/userCategoryModel");

// Create a new user category and populate foreign key details
exports.createUserCategory = async (req, res) => {
  try {
    const { userId, categoryId } = req.body;

    const newUserCategory = new UserCategory({ userId, categoryId });
    let savedUserCategory = await newUserCategory.save();

    // Populate user and category details (assuming your User and Category models are defined)
    savedUserCategory = await savedUserCategory.populate("userId categoryId");

    res.status(201).json(savedUserCategory);
  } catch (error) {
    console.error("Error creating user category:", error);
    res
      .status(500)
      .json({ error: "Server error while creating user category" });
  }
};

// Get all user categories with populated foreign keys
exports.getAllUserCategories = async (req, res) => {
  try {
    const userCategories = await UserCategory.find().populate(
      "userId categoryId"
    );
    res.status(200).json(userCategories);
  } catch (error) {
    console.error("Error fetching user categories:", error);
    res
      .status(500)
      .json({ error: "Server error while fetching user categories" });
  }
};

// Get a single user category by its _id with populated foreign keys
exports.getUserCategoryById = async (req, res) => {
  try {
    const userCategory = await UserCategory.findById(req.params.id).populate(
      "userId categoryId"
    );
    if (!userCategory) {
      return res.status(404).json({ error: "User category not found" });
    }
    res.status(200).json(userCategory);
  } catch (error) {
    console.error("Error fetching user category:", error);
    res
      .status(500)
      .json({ error: "Server error while fetching user category" });
  }
};

// Update a user category and return the populated document
exports.updateUserCategory = async (req, res) => {
  try {
    let updatedUserCategory = await UserCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedUserCategory) {
      return res.status(404).json({ error: "User category not found" });
    }
    updatedUserCategory = await updatedUserCategory.populate(
      "userId categoryId"
    );
    res.status(200).json(updatedUserCategory);
  } catch (error) {
    console.error("Error updating user category:", error);
    res
      .status(500)
      .json({ error: "Server error while updating user category" });
  }
};

// Delete a user category
exports.deleteUserCategory = async (req, res) => {
  try {
    const deletedUserCategory = await UserCategory.findByIdAndDelete(
      req.params.id
    );
    if (!deletedUserCategory) {
      return res.status(404).json({ error: "User category not found" });
    }
    res.status(200).json({ message: "User category deleted successfully" });
  } catch (error) {
    console.error("Error deleting user category:", error);
    res
      .status(500)
      .json({ error: "Server error while deleting user category" });
  }
};
