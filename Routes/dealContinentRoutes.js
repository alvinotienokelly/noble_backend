// Routes/dealContinentRoutes.js
const express = require("express");
const dealContinentController = require("../Controllers/dealContinentController");
const { addContinentToDeal, getContinentsForDeal, removeContinentFromDeal } =
  dealContinentController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermissions = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/add",
  authMiddleware,
  checkPermissions(["ADD_CONTINENT_TO_DEAL", "EDIT_DEAL"]),

  addContinentToDeal
);
router.get("/:deal_id/continents", authMiddleware, getContinentsForDeal);
router.delete(
  "/remove",
  authMiddleware,
  checkPermissions(["REMOVE_CONTINENT_FROM_DEAL"]),
  removeContinentFromDeal
);

module.exports = router;
