// Models/rolePermissionModel.js
module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define(
    "role_permission",
    {
      role_permission_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      role_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "roles",
          key: "role_id",
        },
      },
      permission_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "permissions",
          key: "permission_id",
        },
      },
    },
    { timestamps: true }
  );

  return RolePermission;
};