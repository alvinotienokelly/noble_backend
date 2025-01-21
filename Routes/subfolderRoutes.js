const express = require("express");
const {
  createSubfolder,
  getSubfolderById,
  getSubfoldersByParentFolderId,
  updateSubfolder,
  deleteSubfolder,
} = require("../Controllers/subfolderController");
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createSubfolder);
router.get("/:id", authMiddleware, getSubfolderById);
router.get(
  "/parent/:parent_folder_id",
  authMiddleware,
  getSubfoldersByParentFolderId
);
router.put("/:id", authMiddleware, updateSubfolder); // Add this line
router.delete("/:id", authMiddleware, deleteSubfolder); // Add this line

module.exports = router;
