//user model
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        isEmail: true, //checks for email format
        allowNull: false,
      },
      profile_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      kyc_status: {
        type: DataTypes.ENUM,
        values: ["Pending", "Verified", "Rejected"],
        defaultValue: "Pending",
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM,
        values: ["Investor", "Administrator", "Target Company"],
        allowNull: false,
        defaultValue: "Investor",
      },
    },
    { timestamps: true }
  );
  return User;
};
