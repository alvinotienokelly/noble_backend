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
} = roleController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getAllRoles);
router.get("/:id", authMiddleware, getRoleById);
router.post("/", authMiddleware, createRole);
router.put("/:id", authMiddleware, updateRole);
router.delete("/:id", authMiddleware, deleteRole);
router.post("/assign-permissions", authMiddleware, assignPermissionsToRole);

module.exports = router;