// Models/documentShareModel.js
module.exports = (sequelize, DataTypes) => {
  const DocumentShare = sequelize.define(
    "document_share",
    {
      share_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      document_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "documents",
          key: "document_id",
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

  return DocumentShare;
};
