const express = require("express");
const { createFolder, getFoldersByUser, getAllFolders } = require("../Controllers/folderController");
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createFolder);
router.get("/", authMiddleware, getFoldersByUser);
router.get("/user", authMiddleware, getAllFolders);

module.exports = router;