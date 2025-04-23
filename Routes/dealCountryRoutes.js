// Routes/dealCountryRoutes.js
const express = require("express");
const dealCountryController = require("../Controllers/dealCountryController");
const { addCountryToDeal, getCountriesForDeal, removeCountryFromDeal } =
  dealCountryController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermission = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/add",
  authMiddleware,
  checkPermission("ADD_COUNTRY_TO_DEAL"),

  addCountryToDeal
);
router.get(
  "/:deal_id/countries",
  authMiddleware,
  checkPermission("VIEW_COUNTRIES_FOR_DEAL"),

  getCountriesForDeal
);
router.delete(
  "/remove",
  authMiddleware,
  checkPermission("REMOVE_COUNTRY_FROM_DEAL"),

  removeCountryFromDeal
);

module.exports = router;
