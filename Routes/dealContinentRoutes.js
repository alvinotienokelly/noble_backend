// Routes/dealContinentRoutes.js
const express = require("express");
const dealContinentController = require("../Controllers/dealContinentController");
const { addContinentToDeal, getContinentsForDeal, removeContinentFromDeal } =
  dealContinentController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermission = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/add",
  authMiddleware,
  checkPermission("ADD_CONTINENT_TO_DEAL"),

  addContinentToDeal
);
router.get("/:deal_id/continents", authMiddleware, getContinentsForDeal);
router.delete(
  "/remove",
  authMiddleware,
  checkPermission("REMOVE_CONTINENT_FROM_DEAL"),
  removeContinentFromDeal
);

module.exports = router;
