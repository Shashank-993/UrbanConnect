const express = require("express");
const routes = express.Router();
const { Router } = require("express");
const stateController = require("../controllers/StateController");

routes.post("/state", stateController.createState);

module.exports = routes;
