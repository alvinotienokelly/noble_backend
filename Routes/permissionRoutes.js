// Routes/permissionRoutes.js
const express = require("express");
const permissionController = require("../Controllers/permissionController");
const {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
} = permissionController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getAllPermissions);
router.get("/:id", authMiddleware, getPermissionById);
router.post("/", authMiddleware, createPermission);
router.put("/:id", authMiddleware, updatePermission);
router.delete("/:id", authMiddleware, deletePermission);

module.exports = router;