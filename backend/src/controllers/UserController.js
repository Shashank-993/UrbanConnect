const userModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const mailUtil = require("../utils/MailUtil");
const loginUser = async (req, res) => {
  try {
    // const { email, password } = req.body;
    const email = req.body.email;
    const password = req.body.password;
    console.log("Login attempt for email:", email);

    const foundUser = await userModel.findOne({ email }).populate("role");
    await mailUtil.sendingMail(
      foundUser.email,
      "Welcome to UrbanConnect",
      "You have logged in successfully!"
    );
    if (foundUser) {
      const isMatch = bcrypt.compareSync(password, foundUser.password);
      if (isMatch) {
        // Convert document to plain object and remove the password field
        const { password, ...userWithoutPassword } = foundUser.toObject();
        return res.status(200).json({
          message: "Welcome back!",
          data: userWithoutPassword,
        });
      } else {
        return res.status(404).json({
          message: "Invalid credentials",
        });
      }
    } else {
      return res.status(404).json({
        message: "Email not found",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const signup = async (req, res) => {
  try {
    console.log("Signup Request Body:", req.body); // Debug: log request body

    // Check if password is provided
    if (!req.body.password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hashedPassword;

    const createdUser = await userModel.create(req.body);
    await mailUtil.sendingMail(
      createdUser.email,
      "Welcome to UrbanConnect",
      "You have signed up successfully!"
    );
    console.log("User created successfully:", createdUser);
    return res.status(201).json({
      message: "User created successfully",
      data: createdUser,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({
      message: "Error creating user",
      error: err.message,
    });
  }
};

const addUser = async (req, res) => {
  try {
    const savedUser = await userModel.create(req.body);
    return res.json({
      message: "User saved successfully",
      data: savedUser,
    });
  } catch (error) {
    console.error("Add user error:", error);
    return res
      .status(500)
      .json({ message: "Error saving user", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().populate("role");
    return res.json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    return res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const foundUser = await userModel.findById(req.params.id);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({
      message: "User fetched successfully",
      data: foundUser,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    return res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  signup,
  loginUser,
};
