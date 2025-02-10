const express = require("express");
const {
  createSubfolder,
  getSubfolderById,
  getSubfoldersByParentFolderId,
  updateSubfolder,
  deleteSubfolder,
  archiveSubfolder,
  filterSubfolders,
} = require("../Controllers/subfolderController");
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createSubfolder);
router.get("/filter", authMiddleware, filterSubfolders); // Add this line
router.get("/:id", authMiddleware, getSubfolderById);
router.get(
  "/parent/:parent_folder_id",
  authMiddleware,
  getSubfoldersByParentFolderId
);
router.put("/:id", authMiddleware, updateSubfolder); // Add this line
router.delete("/:id", authMiddleware, deleteSubfolder); // Add this line
router.put("/:id/archive", authMiddleware, archiveSubfolder); // Add this line

module.exports = router;
