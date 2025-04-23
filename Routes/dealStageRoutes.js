const express = require("express");
const dealStageController = require("../Controllers/dealStageController");
const {
  createDealStage,
  getAllDealStages,
  getDealStageById,
  updateDealStage,
  deleteDealStage,
  getDealStagesByUser,
} = dealStageController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermission = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  checkPermission("CREATE_DEAL_STAGE"),

  createDealStage
);
router.get("/", authMiddleware, getAllDealStages);
router.get("/:id", authMiddleware, getDealStageById);
router.put(
  "/:id",
  authMiddleware,
  checkPermission("UPDATE_DEAL_STAGE"),

  updateDealStage
);
router.delete(
  "/:id",
  authMiddleware,
  checkPermission("DELETE_DEAL_STAGE"),

  deleteDealStage
);
router.get("/user/stages", authMiddleware, getDealStagesByUser);

module.exports = router;
