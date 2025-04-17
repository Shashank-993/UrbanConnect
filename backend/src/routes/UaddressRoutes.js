const express = require("express");
const routes = express.Router();
const addressController = require("../controllers/UaddressController");

routes.post("/useraddress", addressController.createUserAddress);

module.exports = routes;
