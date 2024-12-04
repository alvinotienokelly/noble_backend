const express = require("express");
const dealStageController = require("../Controllers/dealStageController");
const {
    createDealStage,
    getAllDealStages,
    getDealStageById,
    updateDealStage,
    deleteDealStage,
    getDealStagesByUser
} = dealStageController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createDealStage);
router.get("/", authMiddleware, getAllDealStages);
router.get("/:id", authMiddleware, getDealStageById);
router.put("/:id", authMiddleware, updateDealStage);
router.delete("/:id", authMiddleware, deleteDealStage);
router.get("/user/stages", authMiddleware, getDealStagesByUser);

module.exports = router;