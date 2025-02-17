// Routes/continentRoutes.js
const express = require("express");
const continentController = require("../Controllers/continentController");
const { createContinent, getAllContinents, updateContinent, deleteContinent } =
  continentController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createContinent);
router.get("/", authMiddleware, getAllContinents);
router.put("/:id", authMiddleware, updateContinent);
router.delete("/:id", authMiddleware, deleteContinent);

module.exports = router;
