// Models/folderModel.js
module.exports = (sequelize, DataTypes) => {
  const Folder = sequelize.define(
    "folder",
    {
      folder_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    { timestamps: true }
  );

  return Folder;
};