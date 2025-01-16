// Models/dealTypePreferencesModel.js
module.exports = (sequelize, DataTypes) => {
  const DealTypePreferences = sequelize.define(
    "deal_type_preferences",
    {
      preference_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      deal_type: {
        type: DataTypes.ENUM,
        values: ["Equity", "Debt", "Equity and Debt"],
        allowNull: false,
      },
    },
    { timestamps: true }
  );

  return DealTypePreferences;
};
