const express = require("express");
const {
  createFolder,
  getFoldersByUser,
  getAllFolders,
  getFolderById,
  archiveFolder,
  filterFolders, // Add this line
} = require("../Controllers/folderController");
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createFolder);
router.get("/", authMiddleware, getFoldersByUser);
router.get("/filter", authMiddleware, filterFolders); // Add this line
router.get("/user", authMiddleware, getAllFolders);
router.get("/:id", authMiddleware, getFolderById); // Add this line
router.put("/:id/archive", authMiddleware, archiveFolder); // Add this line

module.exports = router;
