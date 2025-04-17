const express = require("express");
const routes = express.Router();
const areaController = require("../controllers/AreaController");

routes.post("/area", areaController.createArea);

module.exports = routes;
