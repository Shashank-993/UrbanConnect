const routes = require("express").Router();
const userCategoryController = require("../controllers/UserCategoryController");

routes.post("/usercategory", userCategoryController.createUserCategory);

module.exports = routes;
