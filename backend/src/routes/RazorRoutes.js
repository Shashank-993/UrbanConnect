const express = require("express");
const { checkout, verifyPayment } = require("../controllers/RazorController");
const routes = express.Router();

routes.route("/checkout").post(checkout);
routes.route("/verify").post(verifyPayment);

module.exports = routes;
