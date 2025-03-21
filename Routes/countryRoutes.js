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

router.get("/", getAllCountries);
router.get("/:id", getCountryById);
router.get("/filter", filterCountries);
router.post("/", createCountry);
router.put("/:id", updateCountry);
router.delete("/:id", deleteCountry);

module.exports = router;
