// Models/userTicketPreferencesModel.js
module.exports = (sequelize, DataTypes) => {
  const UserTicketPreferences = sequelize.define(
    "user_ticket_preferences",
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
      ticket_size_min: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      ticket_size_max: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
    },
    { timestamps: true }
  );

  return UserTicketPreferences;
};
