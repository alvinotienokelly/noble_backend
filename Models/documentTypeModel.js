// Models/documentTypeModel.js
module.exports = (sequelize, DataTypes) => {
  const DocumentType = sequelize.define(
    "document_type",
    {
      type_id: {
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

  return DocumentType;
};
