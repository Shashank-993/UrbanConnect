const express = require("express");
const router = express.Router();
const clientController = require("../controllers/ClientController");

router.post("/", clientController.createClient);
router.get("/", clientController.getClientsForProvider);
router.patch("/:id", clientController.updateClient);

module.exports = router;
