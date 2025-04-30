// Routes/dealCountryRoutes.js
const express = require("express");
const dealCountryController = require("../Controllers/dealCountryController");
const { addCountryToDeal, getCountriesForDeal, removeCountryFromDeal } =
  dealCountryController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermissions = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/add",
  authMiddleware,
  checkPermissions(["ADD_COUNTRY_TO_DEAL", "EDIT_DEAL"]),

  addCountryToDeal
);
router.get(
  "/:deal_id/countries",
  authMiddleware,
  checkPermissions(["VIEW_COUNTRIES_FOR_DEAL", "EDIT_DEAL"]),

  getCountriesForDeal
);
router.delete(
  "/remove",
  authMiddleware,
  checkPermissions(["REMOVE_COUNTRY_FROM_DEAL", "EDIT_DEAL"]),

  removeCountryFromDeal
);

module.exports = router;
