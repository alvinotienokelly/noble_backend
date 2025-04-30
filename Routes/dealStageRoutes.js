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
const checkPermissions = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  checkPermissions(["CREATE_DEAL_STAGE", "EDIT_DEAL", "UPDATE_DEAL"]),

  createDealStage
);
router.get("/", authMiddleware, getAllDealStages);
router.get("/:id", authMiddleware, getDealStageById);
router.put(
  "/:id",
  authMiddleware,
  checkPermissions(["UPDATE_DEAL_STAGE", "EDIT_DEAL", "UPDATE_DEAL"]),

  updateDealStage
);
router.delete(
  "/:id",
  authMiddleware,
  checkPermissions(["DELETE_DEAL_STAGE"]),

  deleteDealStage
);
router.get("/user/stages", authMiddleware, getDealStagesByUser);

module.exports = router;
