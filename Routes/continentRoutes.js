// Routes/continentRoutes.js
const express = require("express");
const continentController = require("../Controllers/continentController");
const { createContinent, getAllContinents, updateContinent, deleteContinent } =
  continentController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", createContinent);
router.get("/", getAllContinents);
router.put("/:id", updateContinent);
router.delete("/:id", deleteContinent);

module.exports = router;
