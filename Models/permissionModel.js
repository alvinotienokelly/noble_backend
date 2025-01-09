// Models/permissionModel.js
module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define(
    "permission",
    {
      permission_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    { timestamps: true }
  );

  return Permission;
};