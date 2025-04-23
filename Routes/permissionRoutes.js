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
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermission = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  checkPermission("VIEW_ALL_PERMISSIONS"),
  getAllPermissions
);
router.get("/:id", authMiddleware, getPermissionById);
router.post(
  "/",
  authMiddleware,
  checkPermission("CREATE_PERMISSION"),

  createPermission
);
router.put(
  "/:id",
  authMiddleware,
  checkPermission("UPDATE_PERMISSION"),

  updatePermission
);
router.delete(
  "/:id",
  authMiddleware,
  checkPermission("DELETE_PERMISSION"),
  deletePermission
);

module.exports = router;
