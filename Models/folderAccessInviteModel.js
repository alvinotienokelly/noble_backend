// Models/folderAccessInviteModel.js
module.exports = (sequelize, DataTypes) => {
  const FolderAccessInvite = sequelize.define(
    "folder_access_invite",
    {
      invite_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      folder_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "folders",
          key: "folder_id",
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

  return FolderAccessInvite;
};
