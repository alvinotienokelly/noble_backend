// Models/contactPersonModel.js
module.exports = (sequelize, DataTypes) => {
  const ContactPerson = sequelize.define(
    "contact_person",
    {
      contact_id: {
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      position: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { timestamps: true }
  );

  return ContactPerson;
};