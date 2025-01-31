// Models/subfolderModel.js
module.exports = (sequelize, DataTypes) => {
  const Subfolder = sequelize.define(
    "subfolder",
    {
      subfolder_id: {
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
      created_for: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      parent_folder_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "folders",
          key: "folder_id",
        },
      },
      parent_subfolder_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "subfolders",
          key: "subfolder_id",
        },
      },
      archived: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    { timestamps: true }
  );

  return Subfolder;
};
