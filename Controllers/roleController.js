// Controllers/roleController.js
const db = require("../Models");
const Role = db.roles;
const Permission = db.permissions;
const RolePermission = db.role_permissions;

// Get all roles
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json({ status: true, roles });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get role by ID
const getRoleById = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      return res.status(404).json({ status: false, message: "Role not found." });
    }
    res.status(200).json({ status: true, role });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Create a new role
const createRole = async (req, res) => {
  try {
    const { name } = req.body;
    const role = await Role.create({ name });
    res.status(201).json({ status: true, role });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a role
const updateRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      return res.status(404).json({ status: false, message: "Role not found." });
    }
    await role.update(req.body);
    res.status(200).json({ status: true, role });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a role
const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      return res.status(404).json({ status: false, message: "Role not found." });
    }
    await role.destroy();
    res.status(200).json({ status: true, message: "Role deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Assign permissions to a role
const assignPermissionsToRole = async (req, res) => {
  try {
    const { role_id, permission_ids } = req.body;

    // Remove existing permissions
    await RolePermission.destroy({ where: { role_id } });

    // Assign new permissions
    const rolePermissions = permission_ids.map(permission_id => ({
      role_id,
      permission_id,
    }));
    await RolePermission.bulkCreate(rolePermissions);

    res.status(200).json({ status: true, message: "Permissions assigned successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  assignPermissionsToRole,
};