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
      return res
        .status(404)
        .json({ status: false, message: "Role not found." });
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
      return res
        .status(404)
        .json({ status: false, message: "Role not found." });
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
      return res
        .status(404)
        .json({ status: false, message: "Role not found." });
    }
    await role.destroy();
    res
      .status(200)
      .json({ status: true, message: "Role deleted successfully." });
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
    const rolePermissions = permission_ids.map((permission_id) => ({
      role_id,
      permission_id,
    }));
    await RolePermission.bulkCreate(rolePermissions);

    res
      .status(200)
      .json({ status: true, message: "Permissions assigned successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const assignPermissionsToRoleName = async (req, res) => {
  try {
    const { roleName } = req.body;

    // Find the role by name
    const role = await Role.findOne({ where: { name: roleName } });
    if (!role) {
      return res
        .status(404)
        .json({ status: false, message: "Role not found." });
    }

    // Fetch all permissions
    const permissions = await Permission.findAll();
    if (!permissions.length) {
      return res
        .status(404)
        .json({ status: false, message: "No permissions found." });
    }

    // Map permissions to role_permissions entries
    const rolePermissions = permissions.map((permission) => ({
      role_id: role.role_id,
      permission_id: permission.permission_id,
    }));

    // Assign all permissions to the role
    await RolePermission.bulkCreate(rolePermissions, {
      ignoreDuplicates: true,
    });

    res.status(200).json({
      status: true,
      message: `All permissions have been assigned to the role: ${roleName}`,
    });
  } catch (error) {
    console.error("Error assigning permissions to role:", error);
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
  assignPermissionsToRoleName
};
