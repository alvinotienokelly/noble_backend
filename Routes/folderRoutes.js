const express = require("express");
const { createFolder, getFoldersByUser } = require("../Controllers/folderController");
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createFolder);
router.get("/", authMiddleware, getFoldersByUser);

module.exports = router;