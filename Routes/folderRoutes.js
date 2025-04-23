const express = require("express");
const {
  createFolder,
  getFoldersByUser,
  getAllFolders,
  getFolderById,
  getAcceptedAndPendingFolderInvites, // Add this line
  archiveFolder,
  filterFolders, // Add this line
} = require("../Controllers/folderController");
const authMiddleware = require("../Middlewares/authMiddleware");
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermission = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  checkPermission("CREATE_FOLDER"),

  createFolder
);
router.get("/myfolders", authMiddleware, getAcceptedAndPendingFolderInvites); // Update this line
router.get("/", authMiddleware, getFoldersByUser);
router.get(
  "/filter",
  authMiddleware,
  checkPermission("VIEW_ALL_FOLDERS"),

  filterFolders
); // Add this line
router.get(
  "/user",
  authMiddleware,
  checkPermission("FILTER_FOLDERS"),

  getAllFolders
);
router.get(
  "/:id",
  authMiddleware,
  checkPermission("VIEW_FOLDER_BY_ID"),

  getFolderById
); // Add this line
router.put("/:id/archive", authMiddleware, archiveFolder); // Add this line

module.exports = router;
