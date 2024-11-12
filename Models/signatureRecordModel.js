// Models/signatureRecordModel.js
module.exports = (sequelize, DataTypes) => {
  const SignatureRecord = sequelize.define(
    "signature_record",
    {
      record_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      document_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "documents", // name of the target table
          key: "document_id", // key in the target table
        },
      },
      deal_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "deals", // name of the target table
          key: "deal_id", // key in the target table
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users", // name of the target table
          key: "id", // key in the target table
        },
      },
      signed_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    { timestamps: true }
  );

  return SignatureRecord;
};
