// Models/subfolderAccessInviteModel.js
module.exports = (sequelize, DataTypes) => {
  const SubfolderAccessInvite = sequelize.define(
    "subfolder_access_invite",
    {
      invite_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      subfolder_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "subfolders",
          key: "subfolder_id",
        },
      },
      user_email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["Pending", "Accepted", "Rejected"],
        defaultValue: "Pending",
      },
    },
    {
      timestamps: true,
    }
  );

  return SubfolderAccessInvite;
};
