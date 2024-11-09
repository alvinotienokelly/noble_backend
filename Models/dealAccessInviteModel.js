// Models/dealAccessInviteModel.js
module.exports = (sequelize, DataTypes) => {
  const DealAccessInvite = sequelize.define(
    "deal_access_invite",
    {
      invite_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      investor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users", // name of the target table
          key: "id", // key in the target table
        },
      },
      deal_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "deals", // name of the target table
          key: "deal_id", // key in the target table,
        },
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

  return DealAccessInvite;
};
