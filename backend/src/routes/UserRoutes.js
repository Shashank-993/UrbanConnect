const express = require("express");
const routes = express.Router();
const userController = require("../controllers/UserController");
routes.post("/user", userController.signup);
routes.get("/users", userController.getAllUsers);
routes.get("/user/:id", userController.getUserById);
routes.delete("/user/:id", userController.deleteUserById);
routes.post("/user/login", userController.loginUser);
routes.post("/user/signup", userController.signup);

module.exports = routes;
