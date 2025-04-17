const routes = require("express").Router();
const categoryController = require("../controllers/CategoryController");

routes.post("/category", categoryController.createCategory);

module.exports = routes;
