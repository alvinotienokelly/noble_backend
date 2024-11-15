// Models/documentModel.js
module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define(
    "document",
    {
      document_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      deal_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "deals", // name of the target table
          key: "deal_id", // key in the target table
        },
      },
      uploaded_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users", // name of the target table
          key: "id", // key in the target table
        },
      },
      file_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      file_path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      folder_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "folders",
          key: "folder_id",
        },
      },
      file_type: {
        type: DataTypes.ENUM,
        values: ["pdf", "docx", "xlsx"],
        allowNull: true,
      },
      version_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      upload_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      access_permissions: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      watermark_details: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      docusign_envelope_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      requires_signature: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    { timestamps: true }
  );

  return Document;
};
