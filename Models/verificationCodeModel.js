// Models/verificationCodeModel.js
module.exports = (sequelize, DataTypes) => {
  const VerificationCode = sequelize.define(
    "verification_codes",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users", // name of the target table
          key: "id", // key in the target table
        },
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      already_used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
    }
  );

  return VerificationCode;
};
