// Routes/roleRoutes.js
const express = require("express");
const roleController = require("../Controllers/roleController");
const {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  assignPermissionsToRole,
  assignPermissionsToRoleName,
} = roleController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermission = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getAllRoles);
router.get("/:id", authMiddleware, getRoleById);
router.post("/", authMiddleware, checkPermission("CREATE_ROLE"), createRole);
router.put("/:id", authMiddleware, checkPermission("UPDATE_ROLE"), updateRole);
router.delete(
  "/:id",
  authMiddleware,
  checkPermission("DELETE_ROLE"),
  deleteRole
);
router.post(
  "/assign-permissions",
  authMiddleware,
  checkPermission("ASSIGN_PERMISSIONS_TO_ROLE"),
  assignPermissionsToRole
);
router.post(
  "/assign-permissions-to-role-name",
  authMiddleware,
  assignPermissionsToRoleName
);

module.exports = router;
