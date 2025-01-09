// Controllers/permissionController.js
const db = require("../Models");
const Permission = db.permissions;

// Get all permissions
const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    res.status(200).json({ status: true, permissions });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get permission by ID
const getPermissionById = async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission) {
      return res.status(404).json({ status: false, message: "Permission not found." });
    }
    res.status(200).json({ status: true, permission });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Create a new permission
const createPermission = async (req, res) => {
  try {
    const { name } = req.body;
    const permission = await Permission.create({ name });
    res.status(201).json({ status: true, permission });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a permission
const updatePermission = async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission) {
      return res.status(404).json({ status: false, message: "Permission not found." });
    }
    await permission.update(req.body);
    res.status(200).json({ status: true, permission });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a permission
const deletePermission = async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission) {
      return res.status(404).json({ status: false, message: "Permission not found." });
    }
    await permission.destroy();
    res.status(200).json({ status: true, message: "Permission deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
};