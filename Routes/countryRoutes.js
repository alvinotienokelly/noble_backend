// Routes/countryRoutes.js
const express = require("express");
const countryController = require("../Controllers/countryController");
const {
  getAllCountries,
  getCountryById,
  filterCountries,
  createCountry,
  updateCountry,
  deleteCountry,
} = countryController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getAllCountries);
router.get("/:id", authMiddleware, getCountryById);
router.get("/filter", authMiddleware, filterCountries);
router.post("/", authMiddleware, createCountry);
router.put("/:id", authMiddleware, updateCountry);
router.delete("/:id", authMiddleware, deleteCountry);

module.exports = router;