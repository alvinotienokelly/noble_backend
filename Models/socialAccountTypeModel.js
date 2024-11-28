// Models/socialAccountTypeModel.js
module.exports = (sequelize, DataTypes) => {
    const SocialAccountType = sequelize.define(
      "social_account_type",
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
  
    return SocialAccountType;
  };