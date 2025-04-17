const express = require("express");
const routes = express.Router();
const cityController = require("../controllers/CityController");

routes.post("/city", cityController.createCity);

module.exports = routes;
