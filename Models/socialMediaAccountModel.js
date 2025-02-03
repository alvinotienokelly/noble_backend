// Models/socialMediaAccountModel.js
module.exports = (sequelize, DataTypes) => {
  const SocialMediaAccount = sequelize.define(
    "social_media_account",
    {
      account_id: {
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
      social_account_type_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "social_account_types",
          key: "type_id",
        },
      },
      link: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { timestamps: true }
  );

  return SocialMediaAccount;
};
